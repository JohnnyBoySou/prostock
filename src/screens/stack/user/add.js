import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, Tabs, Users, Status, Label, Title, Row, colors, ListSearch } from "@/ui";

import { listStore, searchStore } from "@/api/store";
import { Pressable } from "react-native";
import { Check } from 'lucide-react-native';
import { addUser } from "@/api/user";
import { UserEmpty } from '@/ui/Emptys/user';

export default function UserAddScreen({ navigation }) {
    const [tab, settab] = useState("Sobre");
    const types = ["Sobre", "Loja", "Tipo",];
    const values = [{ name: "NORMAL", id: "regular" }, { name: "ADMIN DE LOJA", id: "adminloja" }, { name: "SUPER ADMIN", id: "superadmin" },];

    const [tipo, settipo] = useState(values[0].id);
    const [status, setstatus] = useState("ativo");

    const [aboutValues, setaboutValues] = useState({
        name: "",
        last_name: "",
        email: "",
        phone: "",
        cpf: "",
        password: "",
    });

    const [selectCategory, setselectCategory] = useState();
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
                sobrenome: aboutValues.last_name,
                email: aboutValues.email,
                cpf: aboutValues.cpf,
                telefone: aboutValues.phone,
                password: aboutValues.password,
                tipo: tipo,
                status: status,
                lojas: selectCategory
            }
            const res = await addUser(params)
            setsuccess(res.message);
            setTimeout(() => {
                navigation.replace('UserList');
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
            {tab === "Sobre" && <About values={values} settab={settab} aboutValues={aboutValues} setaboutValues={setaboutValues} />}
            {tab === "Loja" && <Store settab={settab} selectCategory={selectCategory} setselectCategory={setselectCategory} />}
            {tab === "Tipo" && <Tipo isLoading={isLoading} tipos={values} settab={settab} setstatus={setstatus} status={status} settipo={settipo} tipo={tipo} handleCreate={handleCreate} />}
            <Column mh={26} mv={26}>
                <Message error={error} success={success} />
            </Column>
        </ScrollVertical>
    </Main>)
}

const About = React.memo(({ settab, aboutValues, setaboutValues, }) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        email: {
            label: "Email",
            placeholder: "Ex.: email@exemplo.com",
            keyboardType: "email-address"
        },
        phone: {
            label: "Telefone",
            placeholder: "Ex.: (49) 99193-5657",
            keyboardType: "number-pad",
            mask: "PHONE",
        },
        cpf: {
            label: "CPF",
            placeholder: "Ex.: 000.000.000-00",
            keyboardType: "numeric",
            mask: "CPF"
        },
        password: {
            label: "Senha",
            placeholder: "Ex.: ********",
            keyboardType: "default",
            pass: true,
        }
    };

    // Validações dinâmicas
    const validations = {
        name: (value) => !!value || "Por favor, insira o nome do usuário.",
        last_name: (value) => !!value || "Por favor, insira o sobrenome do usuário.",
        email: (value) => !!value || "Por favor, insira o email do usuário.",
        phone: (value) => !!value || "Por favor, insira o telefone do usuário.",
        cpf: (value) => !!value || "Por favor, insira o CPF do usuário.",
        password: (value) => !!value || "Por favor, insira a senha do usuário.",
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
            settab("Loja");
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
                label="Próximo"
                onPress={handleNext}
            />
        </Column>
    )
})

const Store = React.memo(({ setselectCategory, selectCategory, settab }) => {

    const [error, setError] = useState("");

    const handleNext = async () => {
        if (categoryArray.length === 0) {
            setError('Selecione ao menos uma loja');
            return;
        }
        else {
            setselectCategory(categoryArray);
            settab("Tipo");
        }
    };

    const [categoryArray, setCategoryArray] = useState(selectCategory ? selectCategory : []);
    const toggleCategory = (categoryId) => {
        setCategoryArray((prev) => {
            if (prev.includes(categoryId)) {
                return prev.filter((id) => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const Card = ({ category }) => {
        const { nome, status, id, endereco } = category;
        return (
            <Pressable onPress={() => toggleCategory(id)} style={{
                backgroundColor: "#fff",
                borderColor: categoryArray.includes(id) ? colors.color.green : "#fff",
                borderWidth: 2,
                paddingVertical: 12, paddingHorizontal: 12,
                borderRadius: 6,
                marginVertical: 6,
            }}>
                <Row justify='space-between'>
                    <Column gv={4}>
                        <Title size={22}>{nome.length > 20 ? nome.slice(0,20) + '...' : nome}</Title>
                        <Label>{endereco.length > 24 ? endereco.slice(0,24) + '...' : endereco} • {status}</Label>
                    </Column>
                    <Column style={{ width: 36, height: 36, borderColor: categoryArray.includes(id) ? colors.color.green : '#d1d1d1', borderWidth: 2, borderRadius: 8, backgroundColor: categoryArray.includes(id) ? colors.color.green : '#fff', justifyContent: 'center', alignItems: 'center', }}>
                        <Check color='#FFF' size={24} />
                    </Column>
                </Row>
            </Pressable>
        )
    }

    return (
        <Column  >
            <ListSearch spacing={false} renderItem={({ item }) => <Card category={item} />} getSearch={searchStore} getList={listStore} empty={<UserEmpty />} />
            <Column mh={26} gv={26} mv={26}>
                <Message error={error} />
                <Button
                    label="Próximo"
                    onPress={handleNext}
                />
            </Column>
        </Column>
    )
})

const Tipo = React.memo(({ settipo, tipo, isLoading, status, setstatus, tipos, handleCreate }) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleNext = async () => {
        setSuccess("");
        setError("");
        handleCreate()
    };

    return (
        <Column mh={26} gv={26}>
            <Users setvalue={settipo} value={tipo} values={tipos} />
            <Status setvalue={setstatus} value={status} />
            <Message success={success} error={error} />
            <Button
                label="Próximo"
                onPress={handleNext}
                loading={isLoading}
            />
        </Column>
    )
})