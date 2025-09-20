import React, { useState, useRef, useEffect } from "react";
import { Main, Button, Message, useToast, Column, Input, ScrollVertical, Loader, colors, useFetch, Image } from "@/ui";
import { KeyboardAvoidingView } from "react-native";
import { AuthService, type ProfileResponse, type User } from '@/services/auth/index';
import { useUser } from "@/context/user";

export default function ProfileScreen({ navigation }) {
    const toast = useToast();
    const theme = colors();
    const { saveUser} = useUser();
    const [aboutValues, setaboutValues] = useState({
        id: "",
        name: "",
        phone: "",
        email: "",
    });

    const { data: user, isLoading: loading } = useFetch({
        key: ["user edit"],
        fetcher: async () => {
            const res = await AuthService.getProfile() as ProfileResponse;
            return res.user;
        }
    });

    useEffect(() => {
        if (user) {
            setaboutValues({
                id: user.id || "",
                name: user.name || "",
                phone: user.phone || "",
                email: user.email || "",
            });
        }
    }, [user]);


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [success, setsuccess] = useState<string>("");
    const [error, seterror] = useState<string>("");
    const handleEdit = async () => {
        seterror('')
        setsuccess('')
        setIsLoading(true);
        try {
            const params = {
                name: aboutValues.name,
            }
            const res = await AuthService.updateProfile(params) as ProfileResponse;
            saveUser(res?.user as any);
            toast.showSuccess("Perfil atualizado com sucesso!");
            // setsuccess(res.message);
            setTimeout(() => {
                navigation.navigate('Home');
            }, 1000);
        } catch (error) {
            toast.showError(error.message);
            seterror(error.message);
        } finally {
            setIsLoading(false);
        }
    }


    return (<Main>
        <KeyboardAvoidingView behavior="padding">
            {loading ? <Loader size={24} color={theme.color.primary} /> :
                <ScrollVertical>
                    <About handleEdit={handleEdit} success={success} error={error} setSuccess={setsuccess} setError={seterror} isLoading={isLoading} aboutValues={aboutValues} setaboutValues={setaboutValues} />
                </ScrollVertical>}
        </KeyboardAvoidingView>
    </Main>)
}

interface AboutProps {
    aboutValues: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    setaboutValues: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string;
        email: string;
        phone: string;
    }>>;
    handleEdit: () => Promise<void>;
    success: string;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    setSuccess: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
}

const About = React.memo(({ aboutValues, setaboutValues, handleEdit, success, error, setError, setSuccess, isLoading }: AboutProps) => {

    const refs = useRef(Object.keys(aboutValues).reduce((acc, key) => {
        acc[key] = null;
        return acc;
    }, {}));

    const fieldProperties = {
        name: {
            label: "Nome",
            placeholder: "Ex.: João",
            keyboardType: "default",
        },
        phone: {
            label: "Telefone",
            placeholder: "Ex.: (49) 99193-5657",
            keyboardType: "number-pad",
            mask: "PHONE",
        },
        email: {
            label: "Email",
            placeholder: "Ex.: email@exemplo.com",
            keyboardType: "email-address",
            lock: true,
            disabled: true,
        },
    };

    // Validações dinâmicas
    const validations = {
        name: (value) => !!value || "Por favor, insira o nome do usuário.",
        phone: (value) => !!value || "Por favor, insira o telefone do usuário.",
    };

    // Função para validar todos os campos
    const validateForm = () => {
        for (const field of Object.keys(validations)) {
            const error = validations[field](aboutValues[field]);
            if (error !== true) {
                setError(error); // Define o erro do primeiro campo inválido
                return false;
            }
        }
        setError(""); // Nenhum erro
        return true;
    };
    // Atualiza o estado dinamicamente
    const handleChange = (field, value) => {
        setaboutValues((prev) => ({ ...prev, [field]: value }));
        setError(""); // Limpa os erros ao alterar o valor
    };

    // Função para lidar com o cadastro
    const handleNext = async () => {
        setSuccess("");
        setError(""); // Limpa os erros ao tentar submeter
        if (!validateForm()) return;
        else {
            handleEdit()
        }
    };

    return (
        <Column mh={26} gv={26}>
            <Image src={require('@/imgs/profile_img.png')} w={100} h={100} r={100}/>

            {Object.keys(fieldProperties).map((field, index, fields) => (
                <Input
                    key={field}
                    label={fieldProperties[field].label}
                    value={aboutValues[field]}
                    setValue={(value) => handleChange(field, value)}
                    placeholder={fieldProperties[field].placeholder}
                    keyboard={fieldProperties[field].keyboardType}
                    mask={fieldProperties[field].mask}
                    pass={fieldProperties[field].pass}
                    ref={(el) => { if (el) refs.current[field] = el; }}
                    lock={fieldProperties[field].lock}
                    onSubmitEditing={() => {
                        const nextField = fields[index + 1];
                        if (nextField) {
                            refs.current[nextField]?.focus();
                        } else {
                            handleNext();
                        }
                    }}
                />
            ))}
            <Message success={success} error={error} />
            <Button
                label="Salvar"
                loading={isLoading}
                onPress={handleNext}
            />
        </Column>
    )
})

