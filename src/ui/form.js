import React, { useState, useRef } from 'react';
import { Column, Button, Input, Message, validations, fields } from '@/ui';

const Form = ({ fieldKeys, onSubmit = () => { }, initialValues, isLoading = false }) => {
    console.log(initialValues)
    const [values, setValues] = useState(initialValues ? initialValues : {});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const refs = useRef(
        fieldKeys.reduce((acc, key) => {
            acc[key] = null;
            return acc;
        }, {})
    );

    const handleChange = (field, value) => {
        setValues((prev) => ({ ...prev, [field]: value }));
        setError(""); // Limpa os erros ao alterar o valor
    };
    const validateForm = () => {
        for (const field of fieldKeys) {
            const validation = validations[field];
            if (validation) {
                const error = validation(values[field]);
                if (error !== true) {
                    setError(error);
                    refs.current[field]?.focus(); // Foca no campo inválido
                    return false;
                }
            }
        }
        setError("");
        return true;
    };
    const handleSubmit = async () => {
        setSuccess("");
        setError("");

        if (!validateForm()) return;

        try {
            onSubmit(values); 
            setSuccess("Dados enviados com sucesso!");
        } catch (err) {
            setError("Erro ao enviar os dados. Tente novamente.");
        }
    };

    return (
        <Column mh={26} gv={26}>
        {fieldKeys.map((key, index) => {
            const fieldProps = fields[key];
            return (
                <Input
                    key={key}
                    label={fieldProps.label}
                    placeholder={fieldProps.placeholder}
                    keyboard={fieldProps.keyboardType}
                    value={values[key]}
                    setValue={(value) => handleChange(key, value)}
                    mask={fieldProps.mask}
                    pass={fieldProps.pass}
                    lock={fieldProps.lock}
                    ref={(el) => (refs.current[key] = el)} // Atribui dinamicamente a ref
                    onSubmitEditing={() => {
                        const nextField = fieldKeys[index + 1]; // Campo seguinte
                        if (nextField) {
                            refs.current[nextField]?.focus(); // Foca no próximo campo
                        } else {
                            handleSubmit(); // Envia o formulário
                        }
                    }}
                    returnKeyType={index === fieldKeys.length - 1 ? "done" : "next"} // Define o botão do teclado
                />
            );
        })}
        <Message success={success} error={error} />
        <Button
            label="Próximo"
            onPress={handleSubmit}
            loading={isLoading}
        />
    </Column>
    );
};

export default Form;