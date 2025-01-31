import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, Tabs, Medida, Status, Label, Title, Row, colors, Loader, useQuery } from "@/ui";
import { editCategory, showCategory } from "@/api/category";
import { KeyboardAvoidingView } from "react-native";

export default function CategoryEditScreen({ navigation, route }) {

    const id = route?.params?.id ? route.params.id : 1;
    const { data: category, isLoading: loadingCategory } = useQuery({
        queryKey: ["category edit" + id],
        queryFn: async () => {
            const res = await showCategory(id); return res;
        }
    });

    const [status, setstatus] = useState("ativo");
    const [aboutValues, setaboutValues] = useState({
        name: "",
    });
    const [isLoading, setIsLoading] = useState();
    const [success, setsuccess] = useState();
    const [error, seterror] = useState();
    const handleCreate = async () => {
        seterror('')
        setsuccess('')
        setIsLoading(true);
        try {
            const params = {
                nome: aboutValues.name,
                status: status,
            }
            const res = await editCategory(id, params)
            setsuccess(res.message);
            setTimeout(() => {
                navigation.navigate('CategoryList');
            }, 1000);

        } catch (error) {
            seterror(error.message);
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        if (category) {
            setaboutValues({
                name: category.nome,
            });
            setstatus(category.status);
        }
    }, [category]);

    return (<Main>
        <KeyboardAvoidingView behavior="padding">
            <ScrollVertical>
                {loadingCategory ? <Column style={{ flex: 1, }} justify="center" align='center'>
                    <Loader size={32} color={colors.color.primary} />
                </Column> :
                    <About setstatus={setstatus} status={status} loading={isLoading} aboutValues={aboutValues} setaboutValues={setaboutValues} handleCreate={handleCreate} />}
                <Column mh={26} mv={26}>
                    <Message error={error} success={success} />
                </Column>
            </ScrollVertical>
        </KeyboardAvoidingView>
    </Main>)
}

const About = React.memo(({ aboutValues, loading, setaboutValues, setstatus, status, handleCreate }) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const refs = useRef({
        name: null,
    });
    const fieldProperties = {
        name: {
            label: "Nome da categoria",
            placeholder: "Ex.: Eletrônicos",
            keyboardType: "default",
        },
    };

    // Validações dinâmicas
    const validations = {
        name: (value) => !!value || "Por favor, insira o nome da categoria.",
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
            handleCreate();
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
                    keyboardType={fieldProperties[field].keyboardType}
                    ref={(el) => (refs.current[field] = el)}
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
            <Status setvalue={setstatus} value={status} />
            <Message success={success} error={error} />
            <Button
                label="Salvar"
                loading={loading}
                onPress={handleNext}
            />
        </Column>
    )
})



