import React, { useRef, useEffect, useState } from "react";
import { Main, Button, Column, Input, ScrollVertical, Status, useMutation, useToast, colors, Tabs } from "@/ui";
import { KeyboardAvoidingView, TextInput } from "react-native";
import { StoreService, StoreCreateRequest } from "@/services/store";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@/context/user";

const storeSchema = z.object({
    name: z
        .string()
        .min(1, "O nome da loja é obrigatório")
        .min(2, "O nome deve ter pelo menos 2 caracteres")
        .max(100, "O nome deve ter no máximo 100 caracteres"),

    cnpj: z
        .string()
        .min(1, "O CNPJ é obrigatório")
        .min(14, "CNPJ deve ter 14 dígitos")
        .max(18, "CNPJ inválido"),

    email: z
        .string()
        .min(1, "O email é obrigatório")
        .email("Email inválido"),

    phone: z
        .string()
        .min(1, "O telefone é obrigatório")
        .min(10, "Telefone deve ter pelo menos 10 dígitos"),

    cep: z
        .string()
        .min(1, "O CEP é obrigatório")
        .min(8, "CEP deve ter 8 dígitos"),

    city: z
        .string()
        .min(1, "A cidade é obrigatória")
        .min(2, "Nome da cidade deve ter pelo menos 2 caracteres"),

    state: z
        .string()
        .min(1, "O estado é obrigatório")
        .min(2, "Nome do estado deve ter pelo menos 2 caracteres"),

    street: z
        .string()
        .min(1, "O endereço é obrigatório")
        .min(5, "Endereço deve ter pelo menos 5 caracteres"),

    status: z.boolean()
});

type StoreFormData = z.infer<typeof storeSchema>;

interface AboutTabProps {
    control: any;
    errors: any;
    onNext: () => void;
}

interface AddressTabProps {
    control: any;
    errors: any;
    loading: boolean;
    onSubmit: () => void;
}

export default function StoreAddScreen({ navigation }) {
    const toast = useToast();
    const queryClient = useQueryClient();
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState("Sobre");

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<StoreFormData>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: "",
            cnpj: "",
            email: "",
            phone: "",
        cep: "",
        city: "",
        state: "",
        street: "",
            status: true,
        },
        mode: "onChange"
    });

    const watchedCep = watch("cep");

    const createStoreMutation = useMutation({
        mutationFn: async (params: StoreFormData) => {
            const apiParams: StoreCreateRequest = {
                name: params.name,
                cnpj: params.cnpj,
                email: params.email,
                phone: params.phone,
                status: params.status,
                cep: params.cep,
                city: params.city,
                state: params.state,
                address: params.street,
            };
            return await StoreService.create(apiParams);
        },
        onSuccess: () => {
            toast.showSuccess('Loja criada com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['stores'] });
            setTimeout(() => {
                navigation.replace('StoreList');
            }, 1000);
        },
        onError: (error) => {
            toast.showError(error.message || 'Erro ao criar loja');
        }
    });

    const onSubmit = (data: StoreFormData) => {
        createStoreMutation.mutate(data);
    };

    // Busca CEP automaticamente
    useEffect(() => {
        const fetchCepData = async () => {
            if (watchedCep && watchedCep.length === 9) {
                try {
                    const res = await StoreService.getCep(watchedCep);
                    setValue("city", res.localidade);
                    setValue("state", res.estado);
                    setValue("street", res.logradouro);
                } catch (error) {
                    // Silently handle CEP fetch errors
                }
            }
        };

        fetchCepData();
    }, [watchedCep, setValue]);

    return (
        <Main>
            <KeyboardAvoidingView behavior="padding">
                <Column>
                    <Tabs types={["Sobre", "Endereço"]} value={activeTab} setValue={setActiveTab} />
                </Column>
                <ScrollVertical>
                    {activeTab === "Sobre" && (
                        <AboutTab 
                            control={control}
                            errors={errors}
                            onNext={() => setActiveTab("Endereço")}
                        />
                    )}
                    {activeTab === "Endereço" && (
                        <AddressTab
                            control={control}
                            errors={errors}
                            loading={createStoreMutation.isLoading}
                            onSubmit={handleSubmit(onSubmit)}
                        />
                    )}
                </ScrollVertical>
            </KeyboardAvoidingView>
        </Main>
    )
}

const AboutTab = React.memo(({ control, errors, onNext }: AboutTabProps) => {
    const nameRef = useRef<TextInput>(null);
    const cnpjRef = useRef<TextInput>(null);
    const emailRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);

    return (
        <Column mh={26} gv={26}>
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={nameRef}
                        label="Nome da loja"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: Loja Central"
                        keyboardType="default"
                        errorMessage={errors.name?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => cnpjRef.current?.focus()}
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
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="00.000.000/0000-00"
                        keyboardType="numeric"
                        mask="CNPJ"
                        errorMessage={errors.cnpj?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                    />
                )}
            />

            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={emailRef}
                        label="Email"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: contato@loja.com"
                        keyboardType="email-address"
                        errorMessage={errors.email?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => phoneRef.current?.focus()}
                    />
                )}
            />

            <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={phoneRef}
                        label="Telefone"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="(00) 00000-0000"
                        keyboardType="phone-pad"
                        mask="PHONE"
                        errorMessage={errors.phone?.message}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                            phoneRef.current?.blur();
                            onNext();
                        }}
                    />
                )}
            />

            <Button
                label="Próximo"
                onPress={onNext}
            />
        </Column>
    )
});

const AddressTab = React.memo(({ control, errors, loading, onSubmit }: AddressTabProps) => {
    const cepRef = useRef<TextInput>(null);
    const cityRef = useRef<TextInput>(null);
    const stateRef = useRef<TextInput>(null);
    const streetRef = useRef<TextInput>(null);

    return (
        <Column mh={26} gv={26}>
            <Controller
                control={control}
                name="cep"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={cepRef}
                        label="CEP"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="00000-000"
                        keyboardType="numeric"
                        mask="CEP"
                        errorMessage={errors.cep?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => cityRef.current?.focus()}
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
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: São Paulo"
                        keyboardType="default"
                        errorMessage={errors.city?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => stateRef.current?.focus()}
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
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: SP"
                        keyboardType="default"
                        errorMessage={errors.state?.message}
                        returnKeyType="next"
                        onSubmitEditing={() => streetRef.current?.focus()}
                    />
                )}
            />

            <Controller
                control={control}
                name="street"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={streetRef}
                        label="Endereço"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: Rua das Flores, 123"
                        keyboardType="default"
                        errorMessage={errors.street?.message}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                            streetRef.current?.blur();
                            onSubmit();
                        }}
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
                label="Criar loja"
                loading={loading}
                onPress={onSubmit}
            />
        </Column>
    )
})

