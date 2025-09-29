
import React, { useState, useRef, useEffect } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, Tabs, Status, useMutation, useToast } from "@/ui";
import { KeyboardAvoidingView, Text } from "react-native";
import { StoreService } from "@/services/store";
import { SupplierService, CreateSupplierRequest } from "@/services/supplier";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const supplierSchema = z.object({
    corporateName: z
        .string()
        .min(1, "A razão social é obrigatória")
        .min(2, "A razão social deve ter pelo menos 2 caracteres")
        .max(100, "A razão social deve ter no máximo 100 caracteres"),

    tradeName: z
        .string()
        .optional(),

    cnpj: z
        .string()
        .min(1, "O CNPJ é obrigatório")
        .min(14, "CNPJ deve ter pelo menos 14 caracteres")
        .max(18, "CNPJ deve ter no máximo 18 caracteres"),

    cep: z
        .string()
        .min(1, "O CEP é obrigatório")
        .min(8, "CEP deve ter pelo menos 8 caracteres")
        .max(9, "CEP deve ter no máximo 9 caracteres"),

    city: z
        .string()
        .min(1, "A cidade é obrigatória")
        .min(2, "A cidade deve ter pelo menos 2 caracteres")
        .max(50, "A cidade deve ter no máximo 50 caracteres"),

    state: z
        .string()
        .min(1, "O estado é obrigatório")
        .min(2, "O estado deve ter pelo menos 2 caracteres"),

    address: z
        .string()
        .min(1, "O endereço é obrigatório")
        .min(5, "O endereço deve ter pelo menos 5 caracteres")
        .max(200, "O endereço deve ter no máximo 200 caracteres"),

    status: z.boolean()
});

type SupplierFormData = z.infer<typeof supplierSchema>;

export default function SupplierAddScreen({ navigation, route }) {
    const toast = useToast();
    const queryClient = useQueryClient();
    const data = route?.params?.data
    const [tab, settab] = useState("Sobre");
    const types = ["Sobre", "Endereço"];

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<SupplierFormData>({
        resolver: zodResolver(supplierSchema),
        defaultValues: {
            corporateName: data?.razaosocial || "",
            tradeName: data?.razaosocial || "",
            cnpj: data?.cnpj || "",
            cep: data?.cep || "",
            city: data?.municipio || "",
            state: data?.estado || "",
            address: data?.endereco || "",
            status: true,
        },
        mode: "onChange"
    });

    const createSupplierMutation = useMutation({
        mutationFn: async (params: SupplierFormData) => {
            const supplierParams: CreateSupplierRequest = {
                corporateName: params.corporateName,
                tradeName: params.tradeName,
                cnpj: params.cnpj,
                cep: params.cep,
                city: params.city,
                state: params.state,
                address: params.address,
            };
            return await SupplierService.create(supplierParams);
        },
        onSuccess: () => {
            toast.showSuccess('Fornecedor criado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            setTimeout(() => {
                navigation.replace('SupplierList');
            }, 1000);
        },
        onError: (error: any) => {
            console.log(error);
            toast.showError(error.message || 'Erro ao criar fornecedor');
        }
    });

    const onSubmit = (data: SupplierFormData) => {
        createSupplierMutation.mutate(data);
    };

    return (
        <Main>
            <KeyboardAvoidingView behavior="padding">
                <Tabs types={types} value={tab} setValue={settab} />
                <ScrollVertical>
                    {tab === "Sobre" && <AboutTab control={control} errors={errors} settab={settab} />}
                    {tab === "Endereço" && <AddressTab control={control} errors={errors} isLoading={createSupplierMutation.isLoading} onSubmit={handleSubmit(onSubmit)} setValue={setValue} watch={watch} />}
                </ScrollVertical>
            </KeyboardAvoidingView>
        </Main>
    )
}

interface AboutTabProps {
    control: any;
    errors: any;
    settab: (tab: string) => void;
}

const AboutTab = ({ control, errors, settab }: AboutTabProps) => {
    const corporateNameRef = useRef(null);
    const tradeNameRef = useRef(null);
    const cnpjRef = useRef(null);

    const handleNext = () => {
        settab('Endereço');
    };

    return (
        <Column mh={26} gv={26}>
            <Controller
                control={control}
                name="corporateName"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={corporateNameRef}
                        label="Razão Social"
                        placeholder="Digite a razão social"
                        value={value}
                        setValue={onChange}
                        required={true}
                        keyboardType="default"
                        errorMessage={errors.corporateName?.message}
                        onSubmitEditing={() => tradeNameRef.current?.focus()}
                        returnKeyType="next"
                    />
                )}
            />

            <Controller
                control={control}
                name="tradeName"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={tradeNameRef}
                        label="Nome Fantasia"
                        placeholder="Digite o nome fantasia"
                        value={value || ''}
                        setValue={onChange}
                        keyboardType="default"
                        errorMessage={errors.tradeName?.message}
                        onSubmitEditing={() => cnpjRef.current?.focus()}
                        returnKeyType="next"
                    />
                )}
            />

            <Controller
                control={control}
                name="cnpj"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={cnpjRef}
                        label="CNPJ"
                        placeholder="Digite o CNPJ"
                        value={value}
                        setValue={onChange}
                        required={true}
                        mask="CNPJ"
                        keyboardType="numeric"
                        errorMessage={errors.cnpj?.message}
                        onSubmitEditing={handleNext}
                        returnKeyType="done"
                    />
                )}
            />

            <Button
                label="Próximo"
                onPress={handleNext}
            />
        </Column>
    );
}
interface AddressTabProps {
    control: any;
    errors: any;
    isLoading: boolean;
    onSubmit: () => void;
    setValue: any;
    watch: any;
}

const AddressTab = ({ control, errors, isLoading, onSubmit, setValue, watch }: AddressTabProps) => {
    const cepRef = useRef(null);
    const cityRef = useRef(null);
    const stateRef = useRef(null);
    const addressRef = useRef(null);
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const watchedCep = watch("cep");

    const getLocal = async (cep: string) => {
        try {
            setLoading(true);
            const res = await StoreService.getCep(cep);
            setValue("city", res.localidade);
            setValue("state", res.estado);
            setValue("address", res.logradouro);
        } catch (error) {
            toast.showError('Erro ao buscar CEP');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (watchedCep?.length === 9) {
            getLocal(watchedCep);
        }
    }, [watchedCep]);

    return (
        <Column mh={26} gv={26}>
            <Controller
                control={control}
                name="cep"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={cepRef}
                        label="CEP"
                        placeholder="Digite o CEP"
                        keyboardType="numeric"
                        loading={loading}
                        value={value || ''}
                        setValue={onChange}
                        mask="CEP"
                        errorMessage={errors.cep?.message}
                        onSubmitEditing={() => cityRef.current?.focus()}
                        returnKeyType="next"
                    />
                )}
            />

            <Controller
                control={control}
                name="city"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={cityRef}
                        label="Cidade"
                        placeholder="Digite a cidade"
                        value={value || ''}
                        setValue={onChange}
                        required={true}
                        keyboardType="default"
                        errorMessage={errors.city?.message}
                        onSubmitEditing={() => stateRef.current?.focus()}
                        returnKeyType="next"
                    />
                )}
            />

            <Controller
                control={control}
                name="state"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={stateRef}
                        label="Estado"
                        placeholder="Digite o estado"
                        value={value || ''}
                        setValue={onChange}
                        required={true}
                        keyboardType="default"
                        errorMessage={errors.state?.message}
                        onSubmitEditing={() => addressRef.current?.focus()}
                        returnKeyType="next"
                    />
                )}
            />

            <Controller
                control={control}
                name="address"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={addressRef}
                        label="Endereço"
                        placeholder="Digite o endereço completo"
                        value={value || ''}
                        setValue={onChange}
                        required={true}
                        keyboardType="default"
                        errorMessage={errors.address?.message}
                        onSubmitEditing={onSubmit}
                        returnKeyType="done"
                    />
                )}
            />

            <Controller
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                    <Status setValue={onChange} value={value} />
                )}
            />

            <Button
                label="Criar fornecedor"
                onPress={onSubmit}
                loading={isLoading}
            />
        </Column>
    );
}

