
import React, { useState, useRef, useEffect } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, Tabs, Status } from "@/ui";
import { KeyboardAvoidingView } from "react-native";
import { StoreService } from "@/services/store";
import { SupplierService, CreateSupplierRequest } from "@/services/supplier";
import { useMutation } from "@/hooks/useMutation";
import { toast, useToast } from "@/hooks/useToast";

export default function SupplierAddScreen({ navigation, route }) {
    const data = route?.params?.data
    const [tab, settab] = useState("Sobre");
    const types = ["Sobre", "Endereço"];
    const [status, setstatus] = useState(true);
    const toast = useToast();

    const [formData, setFormData] = useState<CreateSupplierRequest>({
        corporateName: data?.razaosocial || '',
        tradeName: data?.razaosocial || '',
        cnpj: data?.cnpj || '',
        cep: data?.cep || '',
        city: data?.municipio || '',
        state: data?.estado || '',
        address: data?.endereco || '',
    });

    const createSupplierMutation = useMutation({
        mutationFn: (params: CreateSupplierRequest) => SupplierService.create(params),
        onSuccess: (data) => {
            toast.showSuccess('Fornecedor criado com sucesso!');
            setTimeout(() => {
                navigation.replace('SupplierList');
            }, 1000);
        },
        onError: (error: any) => {
            const errorMessage = error?.message || 'Erro ao criar fornecedor';
            toast.showError(errorMessage);
        }
    });

    const handleCreate = async () => {

        // Validação básica
        if (!formData.corporateName.trim()) {
            toast.showError('Razão social é obrigatória');
            return;
        }
        if (!formData.cnpj.trim()) {
            toast.showError('CNPJ é obrigatório');
            return;
        }
        if (!formData.cep.trim()) {
            toast.showError('CEP é obrigatório');
            return;
        }
        if (!formData.city.trim()) {
            toast.showError('Cidade é obrigatória');
            return;
        }
        if (!formData.state.trim()) {
            toast.showError('Estado é obrigatório');
            return;
        }
        if (!formData.address.trim()) {
            toast.showError('Endereço é obrigatório');
            return;
        }

        createSupplierMutation.mutate(formData);
    }

    return (<Main>
        <KeyboardAvoidingView behavior="padding">
            <Tabs types={types} value={tab} setValue={settab} />
            <ScrollVertical>
                {tab === "Sobre" && <AboutTab formData={formData} setFormData={setFormData} settab={settab} />}
                {tab === "Endereço" && <AddressTab formData={formData} setFormData={setFormData} isLoading={createSupplierMutation.isLoading} setstatus={setstatus} status={status} handleCreate={handleCreate} />}
            </ScrollVertical>
        </KeyboardAvoidingView>
    </Main>)
}

interface AboutTabProps {
    formData: CreateSupplierRequest;
    setFormData: React.Dispatch<React.SetStateAction<CreateSupplierRequest>>;
    settab: (tab: string) => void;
}

const AboutTab = ({ formData, setFormData, settab }: AboutTabProps) => {
    const handleChange = (field: keyof CreateSupplierRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (!formData.corporateName.trim()) {
            return;
        }
        if (!formData.cnpj.trim()) {
            return;
        }
        settab('Endereço');
    };

    const refs = useRef<{
        corporateName: any;
        tradeName: any;
        cnpj: any;
    }>({
        corporateName: null,
        tradeName: null,
        cnpj: null,
    });

    return (
        <Column mh={26} gv={26}>
            <Input
                label="Razão Social"
                placeholder="Digite a razão social"
                value={formData.corporateName}
                setValue={(value) => handleChange('corporateName', value)}
                ref={(el) => { refs.current.corporateName = el; }}
                onSubmitEditing={() => {
                    refs.current.tradeName?.focus();
                }}
                returnKeyType="next"
            />

            <Input
                label="Nome Fantasia"
                placeholder="Digite o nome fantasia"
                value={formData.tradeName || ''}
                setValue={(value) => handleChange('tradeName', value)}
                ref={(el) => { refs.current.tradeName = el; }}
                onSubmitEditing={() => {
                    refs.current.cnpj?.focus();
                }}
                returnKeyType="next"
            />

            <Input
                label="CNPJ"
                placeholder="Digite o CNPJ"
                value={formData.cnpj}
                setValue={(value) => handleChange('cnpj', value)}
                mask="CNPJ"
                keyboard="numeric"
                ref={(el) => { refs.current.cnpj = el; }}
                onSubmitEditing={() => {
                    handleNext();
                }}
                returnKeyType="done"
            />

            <Button
                label="Próximo"
                onPress={handleNext}
            />
        </Column>
    );
}
interface AddressTabProps {
    formData: CreateSupplierRequest;
    setFormData: React.Dispatch<React.SetStateAction<CreateSupplierRequest>>;
    isLoading: boolean;
    status: boolean;
    setstatus: (status: boolean) => void;
    handleCreate: () => void;
}

const AddressTab = ({ formData, setFormData, isLoading, status, setstatus, handleCreate }: AddressTabProps) => {
    const refs = useRef<{
        cep: any;
        city: any;
        state: any;
        address: any;
    }>({
        cep: null,
        city: null,
        state: null,
        address: null,
    });

    const handleChange = (field: keyof CreateSupplierRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const [loading, setLoading] = useState(false);
    const getLocal = async () => {
        try {
            setLoading(true);
            const res = await StoreService.getCep(formData.cep);
            setFormData(prev => ({
                ...prev,
                city: res.localidade,
                state: res.estado,
                address: res.logradouro
            }));
        } catch (error) {
            toast.showError('Erro ao buscar CEP');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (formData?.cep?.length === 9) {
            getLocal();
        }
    }, [formData?.cep]);

    return (
        <Column mh={26} gv={26}>
            <Input
                label="CEP"
                placeholder="Digite o CEP"
                keyboard="numeric"
                loading={loading}
                value={formData.cep || ''}
                setValue={(value) => handleChange('cep', value)}
                mask="CEP"
                ref={(el) => { refs.current.cep = el; }}
                onSubmitEditing={() => {
                    refs.current.city?.focus();
                }}
                returnKeyType="next"
            />

            <Input
                label="Cidade"
                placeholder="Digite a cidade"
                value={formData.city || ''}
                setValue={(value) => handleChange('city', value)}
                ref={(el) => { refs.current.city = el; }}
                onSubmitEditing={() => {
                    refs.current.state?.focus();
                }}
                returnKeyType="next"
            />

            <Input
                label="Estado"
                placeholder="Digite o estado"
                value={formData.state || ''}
                setValue={(value) => handleChange('state', value)}
                ref={(el) => { refs.current.state = el; }}
                onSubmitEditing={() => {
                    refs.current.address?.focus();
                }}
                returnKeyType="next"
            />

            <Input
                label="Endereço"
                placeholder="Digite o endereço completo"
                value={formData.address || ''}
                setValue={(value) => handleChange('address', value)}
                ref={(el) => { refs.current.address = el; }}
                onSubmitEditing={() => {
                    handleCreate();
                }}
                returnKeyType="done"
            />

            <Status setvalue={setstatus} value={status} />
            <Button
                label="Criar fornecedor"
                onPress={handleCreate}
                loading={isLoading}
            />
        </Column>
    );
}

