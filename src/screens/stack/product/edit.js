import React, { useState, useRef, useEffect } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, useQuery, Tabs, Medida, Status, ListSearch, Title, Row, colors, Loader } from "@/ui";

import { listCategory } from "@/api/category";
import { Pressable } from "react-native";
import { Check } from 'lucide-react-native';
import { showProduct, editProduct, deleteProduct } from "@/api/product";

export default function ProductEditScreen({ route, navigation }) {
    const [tab, settab] = useState("Sobre");

    const id = route?.params?.id ? route.params.id : 1;
    const { data: product, isLoading: loadingProduct } = useQuery({
        queryKey: ["product edit" + id],
        queryFn: async () => {
            const res = await showProduct(id); return res;
        }
    });
    const { data: category, isLoading: loadingCategory } = useQuery({
        queryKey: ["category list" + id],
        queryFn: async () => {
            const res = await listCategory(); return res.data;
        }
    });
    const [status, setstatus] = useState("ativo");
    const [aboutValues, setaboutValues] = useState({
        name: "",
        description: "",
    });
    const [stockValues, setstockValues] = useState({
        min: "teste",
        max: "teste",
    });
    const [selectCategory, setselectCategory] = useState();

    useEffect(() => {
        if (product) {
            setaboutValues({
                name: product.nome,
                description: product.descricao,
            });
            setstockValues({
                min: product.estoque_minimo.toString(),
                max: product.estoque_maximo.toString(),
            });
            setstatus(product.status);
            setselectCategory(product?.categorias?.map((item) => item.id));
        }

    }, [product]);

    const types = ["Sobre", "Categorias", "Estoque"];
    const values = ['KG', 'GRAMA', 'LITRO', 'SACA', 'TONELADA']
    const [medida, setmedida] = useState(values[0]);


    const [isLoading, setIsLoading] = useState(false);
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
            const res = await editProduct(id, params)
            setsuccess(res.message);
            setTimeout(() => {
                navigation.navigate('ProductList')
            }, 1000);
        } catch (error) {
            seterror(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleExclude = async() => {
        try {
            const res = await deleteProduct(id)
        } catch (error) {
            console.log(error)
        }
    }

    return (<Main>
        <Column>
            <Tabs types={types} value={tab} setValue={settab} />
        </Column>
        {loadingProduct ?
           <Column style={{ flex: 1, }} justify="center" align='center'>
           <Loader size={32} color={colors.color.primary} />
       </Column> :
            <ScrollVertical>
                {tab === "Sobre" && <About values={values} setmedida={setmedida} medida={medida} settab={settab} aboutValues={aboutValues} setaboutValues={setaboutValues} />}
                {tab === "Categorias" && <Categories category={category} settab={settab} selectCategory={selectCategory} setselectCategory={setselectCategory} />}
                {tab === "Estoque" && <Stock isLoading={isLoading} handleExclude={handleExclude} setstatus={setstatus} status={status} stockValues={stockValues} setstockValues={setstockValues} handleCreate={handleCreate} />}
                <Column mh={26} mv={26}>
                    <Message error={error} success={success} />
                </Column>
            </ScrollVertical>}
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
                marginVertical: 6,
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
        <Column gv={26}>
        <ListSearch id="add product" spacing={false} renderItem={({ item }) => <Card item={item} />} getSearch={searchCategory} getList={listCategory} empty={<CategoryEmpty />} />
        <Column mh={26} gv={26}>
            <Message error={error} />
            <Button
                label="Próximo"
                onPress={handleNext}
            />
        </Column>
    </Column>
    )
})

const Stock = ({ stockValues, handleExclude, isLoading, setstockValues, handleCreate, status, setstatus }) => {
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
                    value={stockValues[field]?.toString() || ""}
                    setValue={(value) => handleChange(field, value)}
                    placeholder={fieldProperties[field].placeholder}
                    disabled={isLoading}
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
                label="Salvar"
                onPress={handleNext}
                loading={isLoading}
            />
        </Column>
    )
}