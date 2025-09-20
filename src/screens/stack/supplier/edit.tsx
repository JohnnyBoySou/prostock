

import React, { useState, useRef, useEffect } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, useQuery, Tabs, Status, Loader, colors } from "@/ui";
import { KeyboardAvoidingView } from "react-native";
import { StoreService } from "src/services/store";
import { SupplierService, CreateSupplierRequest, UpdateSupplierRequest } from "src/services/supplier";
import { useMutation } from "src/hooks/useMutation";
import { useToast } from "src/hooks/useToast";

export default function SupplierEditScreen({ navigation, route }) {
    const id = route?.params?.id ? route.params.id : 1;
    const [tab, settab] = useState("Sobre");
    const types = ["Sobre", "Endereço"];
    const [status, setstatus] = useState(true);
    const { showSuccess, showError } = useToast();

    const { data: supplier, isLoading: loadingSupplier } = useQuery({
        queryKey: [`supplier edit ${id}`],
        queryFn: async () => {
            const res = await SupplierService.get(id);
            return res;
        }
    });

    const [formData, setFormData] = useState<CreateSupplierRequest>({
        corporateName: '',
        tradeName: '',
        cnpj: '',
        cep: '',
        city: '',
        state: '',
        address: '',
    });

    useEffect(() => {
        if (supplier) {
            setFormData({
                corporateName: supplier.corporateName || '',
                tradeName: supplier.tradeName || '',
                cnpj: supplier.cnpj || '',
                cep: supplier.cep || '',
                city: supplier.city || '',
                state: supplier.state || '',
                address: supplier.address || '',
            });
            setstatus(supplier.status);
        }
    }, [supplier]);

    const [success, setsuccess] = useState<string>('');
    const [error, seterror] = useState<string>('');

    const updateSupplierMutation = useMutation({
        mutationFn: (params: UpdateSupplierRequest) => SupplierService.update(id, params),
        onSuccess: (data) => {
            showSuccess('Fornecedor atualizado com sucesso!');
            setsuccess('Fornecedor atualizado com sucesso!');
            setTimeout(() => {
                navigation.navigate('SupplierList');
            }, 1000);
        },
        onError: (error: any) => {
            const errorMessage = error?.message || 'Erro ao atualizar fornecedor';
            showError(errorMessage);
            seterror(errorMessage);
        }
    });

    const handleUpdate = async () => {
        seterror('');
        setsuccess('');
        
        // Validação básica
        if (!formData.corporateName.trim()) {
            seterror('Razão social é obrigatória');
            return;
        }
        if (!formData.cnpj.trim()) {
            seterror('CNPJ é obrigatório');
            return;
        }
        if (!formData.cep.trim()) {
            seterror('CEP é obrigatório');
            return;
        }
        if (!formData.city.trim()) {
            seterror('Cidade é obrigatória');
            return;
        }
        if (!formData.state.trim()) {
            seterror('Estado é obrigatório');
            return;
        }
        if (!formData.address.trim()) {
            seterror('Endereço é obrigatório');
            return;
        }

        const params: UpdateSupplierRequest = {
            corporateName: formData.corporateName,
            tradeName: formData.tradeName,
            cnpj: formData.cnpj,
            cep: formData.cep,
            city: formData.city,
            state: formData.state,
            address: formData.address,
            status: status,
        };

        updateSupplierMutation.mutate(params);
    }
    return (<Main>
        <KeyboardAvoidingView behavior="padding">
        <Column>
            <Tabs types={types} value={tab} setValue={settab} />
        </Column>
        {loadingSupplier ? <Column style={{ flex: 1, }} justify="center" align='center'><Loader size={32} color={colors.color.primary} /></Column> :
            <ScrollVertical>
                {supplier && <>
                    {tab === "Sobre" && <AboutTab formData={formData} setFormData={setFormData} settab={settab} />}
                    {tab === "Endereço" && <AddressTab formData={formData} setFormData={setFormData} isLoading={updateSupplierMutation.isLoading} setstatus={setstatus} status={status} handleUpdate={handleUpdate} />}
                </>}
                <Column mh={26} mv={26}>
                    <Message error={error} success={success} />
                </Column>
                </ScrollVertical>}
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
                ref={(el) => { refs.current.tradeName = el; }}
                label="Nome Fantasia"
                placeholder="Digite o nome fantasia"
                value={formData.tradeName || ''}
                setValue={(value) => handleChange('tradeName', value)}
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
    handleUpdate: () => void;
}

const AddressTab = ({ formData, setFormData, isLoading, status, setstatus, handleUpdate }: AddressTabProps) => {
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

    const getLocal = async () => {
        try {
            const res = await StoreService.getCep(formData.cep);
            setFormData(prev => ({ 
                ...prev, 
                city: res.localidade, 
                state: res.estado, 
                address: res.logradouro 
            }));
        } catch (error) {
            // Erro ao buscar CEP
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
                    handleUpdate();
                }}
                returnKeyType="done"
            />
            
            <Status setvalue={setstatus} value={status} />
            <Button
                label="Salvar fornecedor"
                onPress={handleUpdate}
                loading={isLoading}
            />
        </Column>
    );
}

