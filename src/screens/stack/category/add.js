import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, Tabs, Medida, Status, Label, Title, Row, colors, Loader } from "@/ui";

import { addCategory } from "@/api/category";

export default function CategoryAddScreen({ navigation }) {

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
            const res = await addCategory(params)
            setsuccess('Categoria criada com sucesso!');
            setTimeout(() => {
                navigation.replace('CategoryList');
            }, 1000);
           
        } catch (error) {
            seterror(error.message);
        } finally {
            setIsLoading(false);
        }
    }


    return (<Main>
        <ScrollVertical>
            <About setstatus={setstatus} status={status} loading={isLoading} aboutValues={aboutValues} setaboutValues={setaboutValues} handleCreate={handleCreate} />
            <Column mh={26} mv={26}>
                <Message error={error} success={success} />
            </Column>
        </ScrollVertical>
    </Main>)
}

const About = React.memo(({ aboutValues, setaboutValues, setstatus, status, handleCreate, loading}) => {
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
                label="Criar categoria"
                loading={loading}
                onPress={handleNext}
            />
        </Column>
    )
})



