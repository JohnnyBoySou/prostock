import React, { useState, useRef, useEffect } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, Loader, useQuery, colors } from "@/ui";
import { editLoggedUser, showLoggedUser } from "@/api/user";

export default function ProfileScreen({ navigation, route }) {
    const [aboutValues, setaboutValues] = useState({
        id: "",
        name: "",
        last_name: "",
        email: "",
        phone: "",
        cpf: "",
        status: "",
        tipo: "",
    });

    const { data: user, isLoading: loading } = useQuery({
        queryKey: ["user edit"],
        queryFn: async () => {
            const res = await showLoggedUser(); return res;
        }
    });

    useEffect(() => {
        if (user) {
            setaboutValues({
                id: user.id,
                name: user.nome,
                last_name: user.sobrenome,
                email: user.email,
                phone: user.telefone,
                cpf: user.cpf,
                status: user.status,
                tipo: user.tipo,
            });
        }
    }, [user]);


    const [isLoading, setIsLoading] = useState();
    const [success, setsuccess] = useState();
    const [error, seterror] = useState();
    const handleEdit = async () => {
        seterror('')
        setsuccess('')
        setIsLoading(true);
        try {
            const params = {
                nome: aboutValues.name,
                sobrenome: aboutValues.last_name,
                email: aboutValues.email,
                cpf: aboutValues.cpf,
                telefone: aboutValues.phone,
                status: aboutValues.status,
                tipo: aboutValues.tipo,
            }
            const res = await editLoggedUser(params)
            setsuccess(res.message);
            setTimeout(() => {
                navigation.navigate('Home');
            }, 1000);
        } catch (error) {
            seterror(error.message);
        } finally {
            setIsLoading(false);
        }
    }


    return (<Main>
        {loading ? <Loader size={24} color={colors.color.primary} /> :
            <ScrollVertical>
                <About handleEdit={handleEdit} success={success} error={error} setSuccess={setsuccess} setError={seterror} isLoading={isLoading} aboutValues={aboutValues} setaboutValues={setaboutValues} />
            </ScrollVertical>}
    </Main>)
}

const About = React.memo(({aboutValues, setaboutValues, handleEdit, success, error, setError, setSuccess, isLoading, }) => {

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
        last_name: {
            label: "Sobrenome",
            placeholder: "Ex.: Medeiros Silva",
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
        },
        cpf: {
            label: "CPF",
            placeholder: "Ex.: 000.000.000-00",
            keyboardType: "numeric",
            mask: "CPF",
            lock: true,
        },
    };

    // Validações dinâmicas
    const validations = {
        name: (value) => !!value || "Por favor, insira o nome do usuário.",
        last_name: (value) => !!value || "Por favor, insira o sobrenome do usuário.",
        email: (value) => !!value || "Por favor, insira o email do usuário.",
        phone: (value) => !!value || "Por favor, insira o telefone do usuário.",
        cpf: (value) => !!value || "Por favor, insira o CPF do usuário.",
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
                    ref={(el) => (refs.current[field] = el)}
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

