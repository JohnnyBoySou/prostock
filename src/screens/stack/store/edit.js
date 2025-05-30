import React, { useState, useRef, useEffect } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, Tabs, Status, fields, validations, useQuery, Form, Loader, colors, } from "@/ui";
import { KeyboardAvoidingView } from "react-native";
import { editStore, showStore, getCep } from "@/api/store";

export default function StoreEditScreen({ navigation, route }) {
    const id = route?.params?.id ? route.params.id : 1;
    const [tab, settab] = useState("Sobre");
    const types = ["Sobre", "Endereço",];

    const { data: store, isLoading: loadingStore } = useQuery({
        queryKey: ["product edit" + id],
        queryFn: async () => {
            const res = await showStore(id); return res;
        }
    });



    const [status, setstatus] = useState("ativo");

    const [aboutValues, setaboutValues] = useState();
    const [addressValues, setaddressValues] = useState({
        cep: "",
        city: "",
        state: "",
        street: "",
    });


    useEffect(() => {
        if (store) {
            setaboutValues({
                name: store.nome,
                cnpj: store.cnpj,
                email: store.email,
                phone: store.telefone,
            });
            setaddressValues({
                cep: store.cep,
                city: store.cidade,
                state: store.estado,
                street: store.endereco,
            });
            setstatus(store.status);
        }
    }, [store]);





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
                cnpj: aboutValues.cnpj,
                email: aboutValues.email,
                telefone: aboutValues.phone,
                status: status,
                cep: addressValues.cep,
                cidade: addressValues.city,
                estado: addressValues.state,
                endereco: addressValues.street,
            }
            const res = await editStore(id, params)
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
        <KeyboardAvoidingView behavior="padding">
            <Column>
                <Tabs types={types} value={tab} setValue={settab} />
            </Column>
            {loadingStore ? <Column style={{ flex: 1, }} justify="center" align='center'><Loader size={32} color={colors.color.primary} /></Column> :
                <ScrollVertical>
                    {store && <>
                        {tab === "Sobre" && <About settab={settab} aboutValues={aboutValues} setaboutValues={setaboutValues} />}
                        {tab === "Endereço" && <Address isLoading={isLoading} setstatus={setstatus} status={status} addressValues={addressValues} setaddressValues={setaddressValues} handleCreate={handleCreate} />}
                    </>}
                    <Column mh={26} mv={26}>
                        <Message error={error} success={success} />
                    </Column>
                </ScrollVertical>
            }
        </KeyboardAvoidingView>
    </Main>)
}
const About = React.memo(({ settab, aboutValues, setaboutValues, }) => {
    if (!aboutValues) return null;
    const fieldKeys = [
        'name',
        'cnpj',
        'email',
        'phone'
    ];
    return (
        <Form fieldKeys={fieldKeys} initialValues={aboutValues} onSubmit={(value) => {
            setaboutValues(value);
            settab('Endereço');
        }} />
    )
})

/*
const About = React.memo(({ settab, aboutValues, setaboutValues, }) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const values = aboutValues;
    const setvalue = setaboutValues;

    const refs = useRef(Object.keys(aboutValues).reduce((acc, key) => {
        acc[key] = null;
        return acc;
    }, {}));

    const getFieldProperties = (fieldName) => fields[fieldName] || {};
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
            settab("Endereço");
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
            <Message success={success} error={error} />
            <Button
                label="Próximo"
                onPress={handleNext}
            />
        </Column>
    )
})*/

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
                label="Salvar"
                onPress={handleNext}
                loading={isLoading}
            />
        </Column>
    )
})

