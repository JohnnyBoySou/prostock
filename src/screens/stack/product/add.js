import { useState, useRef } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, Tabs } from "@/ui";

export default function ProductAddScreen() {
    const [tab, settab] = useState("Sobre");
    const types = ["Sobre", "Categorias", "Estoque"];
    return (<Main>
        <Column>
            <Tabs types={types} value={tab} setValue={settab} />
        </Column>
        <ScrollVertical>
            <About />
        </ScrollVertical>
    </Main>)
}


const About = () => {
    const [formValues, setFormValues] = useState({
        name: "",
        description: "",
        medida: "",
        price: "",
    });

    const [error, setError] = useState(""); // Agora é uma única string para erro

    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const refs = useRef({
        name: null,
        description: null,
        medida: null,
        price: null,
    });

    const fieldProperties = {
        name: {
            label: "Nome do Produto",
            placeholder: "Ex.: Produto X",
            keyboardType: "default",
        },
        description: {
            label: "Descrição",
            placeholder: "Ex.: Uma breve descrição",
            keyboardType: "default",
        },
        medida: {
            label: "Unidade de Medida",
            placeholder: "Ex.: Kg",
            keyboardType: "default",
        },
        price: {
            label: "Preço",
            placeholder: "Ex.: 99.99",
            keyboardType: "numeric",
        },
    };

    // Validações dinâmicas
    const validations = {
        name: (value) => !!value || "Por favor, insira o nome do produto.",
        description: (value) => !!value || "Por favor, insira uma descrição.",
        medida: (value) => !!value || "Por favor, insira a unidade de medida.",
        price: (value) =>
            /^[0-9]+(\.[0-9]{1,2})?$/.test(value) || "Por favor, insira um preço válido.",
    };

    // Função para validar todos os campos
    const validateForm = () => {
        for (const field of Object.keys(validations)) {
            const error = validations[field](formValues[field]);
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
        setFormValues((prev) => ({ ...prev, [field]: value }));
        setError(""); // Limpa os erros ao alterar o valor
    };

    // Função para lidar com o cadastro
    const handleAddProduct = async () => {
        setSuccess("");
        setError(""); // Limpa os erros ao tentar submeter
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // Simula uma chamada de API
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSuccess("Cadastro do produto realizado com sucesso!");
        } catch (e) {
            setError("Erro ao realizar o cadastro. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Column mh={26} gv={26}>
            {Object.keys(fieldProperties).map((field, index, fields) => (
                <Input
                    key={field}
                    label={fieldProperties[field].label}
                    value={formValues[field]}
                    setValue={(value) => handleChange(field, value)}
                    placeholder={fieldProperties[field].placeholder}
                    keyboardType={fieldProperties[field].keyboardType}
                    ref={(el) => (refs.current[field] = el)}
                    onSubmitEditing={() => {
                        const nextField = fields[index + 1];
                        if (nextField) {
                            refs.current[nextField]?.focus();
                        } else {
                            handleAddProduct();
                        }
                    }}
                />
            ))}
            <Message success={success} error={error} />
            <Button
                label="Criar produto"
                onPress={handleAddProduct}
                loading={isLoading}
            />
        </Column>
    )
}