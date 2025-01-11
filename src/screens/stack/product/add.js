import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, Tabs, Medida, Status, Label, Title, Row, colors, Loader } from "@/ui";

import { listCategory } from "@/api/category";
import { Pressable } from "react-native";
import { Check, Plus, SquareDashed, CircleDashed, MessageCircleDashed } from 'lucide-react-native';
import { addProduct } from "@/api/product";
import { useNavigation } from "@react-navigation/native";

export default function ProductAddScreen({ navigation }) {
    const [tab, settab] = useState("Sobre");
    const types = ["Sobre", "Categorias", "Estoque"];
    const values = ['KG', 'GRAMA', 'LITRO', 'SACA', 'TONELADA']

    const [medida, setmedida] = useState(values[0]);
    const [status, setstatus] = useState("Ativo");
    const [aboutValues, setaboutValues] = useState({
        name: "",
        description: "",
    });
    const [stockValues, setstockValues] = useState({
        estoque_minimo: "",
        estoque_maximo: "",
    });
    const [selectCategory, setselectCategory] = useState();

    const [category, setcategory] = useState([]);
    const [isLoading, setIsLoading] = useState();
    const fecthCategory = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await listCategory();
            setcategory(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fecthCategory();
    }, [fecthCategory]);

    const [success, setsuccess] = useState();
    const [error, seterror] = useState();
    const handleCreate = async () => {
        seterror('')
        setsuccess('')
        setIsLoading(true);
        try {
            const params = {
                nome: aboutValues.name,
                descricao: aboutValues.description,
                unidade: medida,
                estoque_minimo: stockValues.min,
                estoque_maximo: stockValues.max,
                status: status,
                categorias: selectCategory
            }
            const res = await addProduct(params)
            setsuccess('Produto cadastrado com sucesso');
            setTimeout(() => {
                navigation.navigate('ProductSuccess')
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
            {tab === "Sobre" && <About values={values} setmedida={setmedida} medida={medida} settab={settab} aboutValues={aboutValues} setaboutValues={setaboutValues} />}
            {tab === "Categorias" && <Categories category={category} settab={settab} selectCategory={selectCategory} setselectCategory={setselectCategory} />}
            {tab === "Estoque" && <Stock isLoading={isLoading} setstatus={setstatus} status={status} stockValues={stockValues} setstockValues={setstockValues} handleCreate={handleCreate} />}
            <Column mh={26} mv={26}>
                <Message error={error} success={success} />
            </Column>
        </ScrollVertical>
    </Main>)
}

const About = React.memo(({ settab, aboutValues, setaboutValues, values, setmedida, medida }) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const refs = useRef({
        name: null,
        description: null,
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
    };

    // Validações dinâmicas
    const validations = {
        name: (value) => !!value || "Por favor, insira o nome do produto.",
        description: (value) => !!value || "Por favor, insira uma descrição.",
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
            settab("Categorias");
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
            <Medida values={values} setvalue={setmedida} value={medida} />
            <Message success={success} error={error} />
            <Button
                label="Próximo"
                onPress={handleNext}
            />
        </Column>
    )
})

const Categories = React.memo(({ settab, setselectCategory, selectCategory, category }) => {

    const navigation = useNavigation();
    const [error, setError] = useState("");

    const handleNext = async () => {
        if (categoryArray.length === 0) {
            setError('Selecione ao menos uma categoria');
            return;
        }
        else {
            setselectCategory(categoryArray);
            settab("Estoque");
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

    const Item = ({ category }) => {
        const { nome, status, id, } = category;
        return (
            <Pressable onPress={() => toggleCategory(id)} style={{
                backgroundColor: "#fff",
                borderColor: categoryArray.includes(id) ? colors.color.green : "#fff",
                borderWidth: 2,
                paddingVertical: 12, paddingHorizontal: 12,
                borderRadius: 6,
            }}>
                <Row justify='space-between'>
                    <Title size={18} fontFamily='Font_Book'>{nome}</Title>
                    <Column style={{ width: 36, height: 36, borderColor: categoryArray.includes(id) ? colors.color.green : '#d1d1d1', borderWidth: 2, borderRadius: 8, backgroundColor: categoryArray.includes(id) ? colors.color.green : '#fff', justifyContent: 'center', alignItems: 'center', }}>
                        <Check color='#FFF' size={24} />
                    </Column>
                </Row>
            </Pressable>
        )
    }

    return (
        <Column mh={26} gv={26}>
            <Column gv={12}>
                <Label>Resultados</Label>
                {category && category?.map((item, index) => (
                    <Item key={index} category={item} />
                ))}
                {category.length === 0 &&
                    <Column style={{ backgroundColor: '#fff', borderRadius: 12,}} pv={20} ph={20}  justify='center' gv={12}>
                        <Row gh={8} mv={12} justify='center'>
                            <SquareDashed size={52} color='#43AA8B' />
                            <CircleDashed size={52} color='#3590F3' />
                            <MessageCircleDashed size={52} color='#FFB238' />
                        </Row>
                        <Title align='center' size={22}  fontFamily="Font_Medium">Nenhuma categoria encontrada...</Title>
                        <Pressable style={{ backgroundColor: colors.color.blue, borderRadius: 8, }} onPress={() => { navigation.navigate('CategoryAdd') }} >
                            <Row justify="space-between" ph={14} align='center' gh={8} pv={14}>
                                <Label size={18} color='#fff'>Criar nova categoria</Label>
                                <Column style={{ backgroundColor: '#fff', borderRadius: 4, }} pv={6} ph={6}>
                                    <Plus size={24} color={colors.color.blue} />
                                </Column>
                            </Row>
                        </Pressable>
                    </Column>
                }
            </Column>
            <Message error={error} />
            <Button
                label="Próximo"
                onPress={handleNext}
            />
        </Column>
    )
})


const Stock = React.memo(({ stockValues, isLoading, setstockValues, handleCreate, status, setstatus }) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const refs = useRef({
        min: null,
        max: null,
    });

    const fieldProperties = {
        min: {
            label: "Estoque minímo",
            placeholder: "Ex.: 200",
            keyboardType: "numeric",
        },
        max: {
            label: "Estoque máximo",
            placeholder: "Ex.: 500",
            keyboardType: "numeric",
        },
    };

    // Validações dinâmicas
    const validations = {
        min: (value) => {
            if (!value) return "Por favor, insira o estoque mínimo.";
            if (value < 0) return "O estoque mínimo não pode ser menor que 0.";
            if (parseInt(value) > parseInt(stockValues.max)) return "O estoque mínimo não pode ser maior que o estoque máximo.";
            return true;
        },
        max: (value) => {
            if (!value) return "Por favor, insira o estoque máximo.";
            if (value < 0) return "O estoque máximo não pode ser menor que 0.";
            if (parseInt(value) < parseInt(stockValues.min)) return "O estoque máximo não pode ser menor que o estoque mínimo.";
            return true;
        },
    };

    // Função para validar todos os campos
    const validateForm = () => {
        for (const field of Object.keys(validations)) {
            const error = validations[field](stockValues[field]);
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
        setstockValues((prev) => ({ ...prev, [field]: value }));
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
                    value={stockValues[field]}
                    setValue={(value) => handleChange(field, value)}
                    placeholder={fieldProperties[field].placeholder}
                    keyboard={fieldProperties[field].keyboardType}
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
                label="Próximo"
                onPress={handleNext}
                loading={isLoading}
            />
        </Column>
    )
})