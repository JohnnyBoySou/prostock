
import React, { useState, useRef, useEffect } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, Tabs, Status, fields, validations, Form } from "@/ui";

import { getCep } from "@/api/store";
import { addSupplier } from "@/api/supplier";

export default function SupplierAddScreen({ navigation }) {
    const [tab, settab] = useState("Sobre");
    const types = ["Sobre","Responsável", "Endereço",];
    const [status, setstatus] = useState("Ativo");

    const [aboutValues, setaboutValues] = useState();
    const [responsibleValues, setresponsibleValues] = useState();
    const [addressValues, setaddressValues] = useState({
        cep: "",
        city: "",
        state: "",
        street: "",
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

                razao_social: aboutValues.razao_social,
                nome_fantasia: aboutValues.nome_fantasia,
                cnpj: aboutValues.cnpj,

                telefone_responsavel: responsibleValues.telefone_responsavel,
                email_responsavel: responsibleValues.email_responsavel,
                cpf_responsavel: responsibleValues.cpf_responsavel,
                nome_responsavel: responsibleValues.nome_responsavel,

                status: status,
                cep: addressValues.cep,
                cidade: addressValues.city,
                estado: addressValues.state,
                endereco: addressValues.street,
            }
            const res = await addSupplier(params)
            setsuccess(res.message);
            setTimeout(() => {
                navigation.navigate('StoreList');
            }, 1000);
        } catch (error) {
            seterror(error.message);
        } finally {
            setIsLoading(false);
        }
    }


    return (<Main>
        <Column>
            <Tabs types={types} value={tab} setValue={settab} />
        </Column>
        <ScrollVertical>
            {tab === "Sobre" && <About settab={settab} aboutValues={aboutValues} setaboutValues={setaboutValues} />}
            {tab === "Responsável" && <Responsible settab={settab} responsibleValues={responsibleValues} setresponsibleValues={setresponsibleValues} />}
            {tab === "Endereço" && <Address isLoading={isLoading} setstatus={setstatus} status={status} addressValues={addressValues} setaddressValues={setaddressValues} handleCreate={handleCreate} />}
            <Column mh={26} mv={26}>
                <Message error={error} success={success} />
            </Column>
        </ScrollVertical>
    </Main>)
}

const About = React.memo(({ settab, aboutValues, setaboutValues, }) => {
    const fieldKeys = [
        'razao_social',
        'nome_fantasia',
        'cnpj',
    ];
    return (
        <Form fieldKeys={fieldKeys} initialValue={aboutValues} onSubmit={(value) => {
            setaboutValues(value);
            settab('Responsável');
        }} />
    )
})
const Responsible = React.memo(({ settab, responsibleValues, setresponsibleValues, }) => {
    const fieldKeys = [
        'nome_responsavel',
        'email_responsavel',
        'cpf_responsavel',
        'telefone_responsavel',
    ];
    return (
        <Form fieldKeys={fieldKeys} initialValue={responsibleValues} onSubmit={(value) => {
            setresponsibleValues(value);
            settab('Endereço');
        }} />
    )
})

const Address = React.memo(({ setaddressValues, addressValues, isLoading, status, setstatus, handleCreate }) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const values = addressValues;
    const setvalue = setaddressValues;

    const refs = useRef(Object.keys(values).reduce((acc, key) => {
        acc[key] = null;
        return acc;
    }, {}));

    const getFieldProperties = (fieldName) => fields[fieldName] || {};


    const getLocal = async () => {
        try {
            const res = await getCep(values.cep);
            setvalue((prev) => ({ ...prev, city: res.localidade, state: res.estado, street: res.logradouro }));
        } catch (error) {

        }
    }

    useEffect(() => {
        if (values.cep.length === 9) {
            getLocal();
        }
    }, [values.cep]);


    const validateForm = () => {
        for (const field of Object.keys(values)) {
            const validation = validations[field];
            if (validation) {
                const error = validation(values[field]);
                if (error !== true) {
                    setError(error);
                    refs.current[field]?.current?.focus();
                    return false;
                }
            }
        }
        setError("");
        return true;
    };
    const handleChange = (field, value) => {
        setvalue((prev) => ({ ...prev, [field]: value }));
        setError("");
    };

    const handleNext = async () => {
        setSuccess("");
        setError("");
        if (!validateForm()) return;
        else {
            handleCreate()
        }
    };
    return (
        <Column mh={26} gv={26}>
            {Object.keys(values).map((key, index, fields) => {
                const fieldProps = getFieldProperties(key);
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
                            const nextField = fields[index + 1]; // Campo seguinte
                            if (nextField) {
                                refs.current[nextField]?.focus(); // Foca no próximo campo
                            } else {
                                handleNext(); // Envia o formulário
                            }
                        }}
                        returnKeyType={index === fields.length - 1 ? "done" : "next"} // Define o botão do teclado
                    />
                );
            })}
            <Status setvalue={setstatus} value={status} />
            <Message success={success} error={error} />
            <Button
                label="Criar fornecedor"
                onPress={handleNext}
                loading={isLoading}
            />
        </Column>
    )
})

