import React, { useState, useRef, useEffect, useCallback } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, Tabs, Medida, Status, Title, Row, colors, useMutation, useToast, useFetch, Search, Loader } from "@/ui";

import { CategoryService } from "src/services/category";
import { Pressable, KeyboardAvoidingView } from "react-native";
import { Check } from 'lucide-react-native';
import { ProductService, ProductCreateRequest } from "src/services/product";
import { CategoryEmpty } from '@/ui/Emptys/category';
import { useQueryClient } from "@tanstack/react-query";
import { FlatList } from "react-native-gesture-handler";

export default function ProductAddScreen({ navigation, route }) {
    const toast = useToast();
    const queryClient = useQueryClient();
    const data = route?.params?.data

    const [tab, settab] = useState("Sobre");
    const types = ["Sobre", "Categorias", "Estoque"];
    const values: ProductCreateRequest['unitOfMeasure'][] = ['UNIDADE', 'KG', 'L', 'ML', 'M', 'CM', 'MM', 'UN', 'DZ', 'CX', 'PCT', 'KIT', 'PAR', 'H', 'D']

    const [medida, setmedida] = useState<ProductCreateRequest['unitOfMeasure']>(data?.unitOfMeasure || 'UNIDADE');
    const [status, setstatus] = useState<boolean>(true);
    const [aboutValues, setaboutValues] = useState<{
        name: string;
        description: string;
        referencePrice: string;
    }>({
        name: data?.name || "",
        description: data?.description || "",
        referencePrice: data?.referencePrice?.toString() || "",
    });
    const [stockValues, setstockValues] = useState<{
        stockMin: string;
        stockMax: string;
        alertPercentage: string;
    }>({
        stockMin: data?.stockMin?.toString() || "",
        stockMax: data?.stockMax?.toString() || "",
        alertPercentage: data?.alertPercentage?.toString() || "10",
    });
    const [selectCategory, setselectCategory] = useState<string>();
    const [storeId, setStoreId] = useState<string>(""); // TODO: Obter do contexto do usuário

    const [category, setcategory] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fecthCategory = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await CategoryService.list();
            setcategory(res.items || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fecthCategory();
    }, [fecthCategory]);

    const createProductMutation = useMutation({
        mutationFn: async (params: ProductCreateRequest) => {
            return await ProductService.create(params);
        },
        onSuccess: () => {
            toast.showSuccess('Produto criado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setTimeout(() => {
                navigation.replace('ProductList');
            }, 1000);
        },
        onError: (error) => {
            toast.showError(error.message || 'Erro ao criar produto');
        }
    });

    const handleCreate = () => {
        if (!storeId) {
            toast.showError('StoreId é obrigatório');
            return;
        }

        const params: ProductCreateRequest = {
            name: aboutValues.name,
            description: aboutValues.description,
            unitOfMeasure: medida,
            referencePrice: parseFloat(aboutValues.referencePrice) || 0,
            categoryId: selectCategory,
            storeId: storeId,
            stockMin: parseInt(stockValues.stockMin) || 0,
            stockMax: parseInt(stockValues.stockMax) || 0,
            alertPercentage: parseInt(stockValues.alertPercentage) || 10,
            status: status,
        };

        createProductMutation.mutate(params);
    }

    return (<Main>
        <KeyboardAvoidingView behavior="padding">
            <Tabs types={types} value={tab} setValue={settab} />
            <ScrollVertical>
                {tab === "Sobre" && <About values={values} setmedida={setmedida} medida={medida} settab={settab} aboutValues={aboutValues} setaboutValues={setaboutValues} />}
                {tab === "Categorias" && <Categories category={category} settab={settab} selectCategory={selectCategory} setselectCategory={setselectCategory} />}
                {tab === "Estoque" && <Stock isLoading={createProductMutation.isLoading} setstatus={setstatus} status={status} stockValues={stockValues} setstockValues={setstockValues} handleCreate={handleCreate} />}
            </ScrollVertical>
        </KeyboardAvoidingView>
    </Main>)
}

interface AboutProps {
    settab: (tab: string) => void;
    aboutValues: {
        name: string;
        description: string;
        referencePrice: string;
    };
    setaboutValues: React.Dispatch<React.SetStateAction<{
        name: string;
        description: string;
        referencePrice: string;
    }>>;
    values: ProductCreateRequest['unitOfMeasure'][];
    setmedida: React.Dispatch<React.SetStateAction<ProductCreateRequest['unitOfMeasure']>>;
    medida: ProductCreateRequest['unitOfMeasure'];
}

const About = React.memo(({ settab, aboutValues, setaboutValues, values, setmedida, medida }: AboutProps) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const refs = useRef({
        name: null as any,
        description: null as any,
        referencePrice: null as any,
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
        referencePrice: {
            label: "Preço de Referência",
            placeholder: "Ex.: 25.50",
            keyboardType: "numeric",
        },
    };

    // Validações dinâmicas
    const validations = {
        name: (value) => !!value || "Por favor, insira o nome do produto.",
        description: (value) => !!value || "Por favor, insira uma descrição.",
        referencePrice: (value) => {
            if (!value) return "Por favor, insira o preço de referência.";
            if (isNaN(parseFloat(value))) return "Por favor, insira um preço válido.";
            if (parseFloat(value) < 0) return "O preço não pode ser negativo.";
            return true;
        },
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
            <Input
                label="Nome do Produto"
                value={aboutValues.name}
                setValue={(value) => handleChange('name', value)}
                placeholder="Ex.: Produto X"
                keyboardType="default"
                ref={(el) => { refs.current.name = el; }}
                onSubmitEditing={() => {
                    refs.current.description?.focus();
                }}
            />
            <Input
                label="Descrição"
                value={aboutValues.description}
                setValue={(value) => handleChange('description', value)}
                placeholder="Ex.: Uma breve descrição"
                keyboardType="default"
                ref={(el) => { refs.current.description = el; }}
                onSubmitEditing={() => {
                    refs.current.referencePrice?.focus();
                }}
            />
            <Input
                label="Preço de Referência"
                value={aboutValues.referencePrice}
                setValue={(value) => handleChange('referencePrice', value)}
                placeholder="Ex.: 25.50"
                keyboardType="numeric"
                ref={(el) => { refs.current.referencePrice = el; }}
                onSubmitEditing={() => {
                    handleNext();
                }}
            />
            <Medida values={values} setvalue={setmedida} value={medida} />
            <Message success={success} error={error} />
            <Button
                label="Próximo"
                onPress={handleNext}
            />
        </Column>
    )
})

interface CategoriesProps {
    settab: (tab: string) => void;
    setselectCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
    selectCategory: string | undefined;
    category: any[];
}

const Categories = React.memo(({ settab, setselectCategory, selectCategory, category }: CategoriesProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const theme = colors();

    const { data: categories, isLoading, refetch } = useFetch({
        key: CategoryService.keys.list,
        fetcher: async () => {
            const res = await CategoryService.list(); console.log(res); return res;
        }
    });

    const { data: searchResults, isLoading: isSearching, refetch: handleSearch } = useFetch({
        key: CategoryService.keys.search,
        fetcher: async () => {
            if (searchTerm.length < 2) return { categories: [] };
            const res = await CategoryService.search(searchTerm);
            return res;
        },
        enabled: searchTerm.length >= 2
    });

    // Executa a busca automaticamente quando o termo muda
    useEffect(() => {
        if (searchTerm.length >= 2) {
            handleSearch();
        } else if (searchTerm.length === 0) {
            // Limpa a seleção quando o campo de busca é limpo
            setselectCategory(undefined);
        }
    }, [searchTerm, handleSearch, setselectCategory]);
    const handleNext = async () => {
        if (!selectCategory) {
            setError('Selecione uma categoria');
            return;
        }
        else {
            settab("Estoque");
        }
    };

    const toggleCategory = (categoryId) => {
        setselectCategory(categoryId);
    };

    const Card = ({ item }) => {
        const { name, status, id, } = item;
        const theme = colors();
        const isSelected = selectCategory === id;
        return (
            <Pressable onPress={() => toggleCategory(id)} style={{
                backgroundColor: "#fff",
                borderColor: isSelected ? theme.color.green : "#fff",
                borderWidth: 2,
                paddingVertical: 12, paddingHorizontal: 12,
                borderRadius: 6,
                marginVertical: 6,
            }}>
                <Row justify='space-between'>
                    <Title size={18} fontFamily='Font_Book'>{name}</Title>
                    <Column style={{ width: 36, height: 36, borderColor: isSelected ? theme.color.green : '#d1d1d1', borderWidth: 2, borderRadius: 8, backgroundColor: isSelected ? theme.color.green : '#fff', justifyContent: 'center', alignItems: 'center', }}>
                        {isSelected && <Check color='#FFF' size={24} />}
                    </Column>
                </Row>
            </Pressable>
        )
    }

    // Determina quais dados mostrar (busca ou lista completa)
    const displayData = searchTerm.length >= 2 ? searchResults?.categories : categories?.items;

    return (
        <Column gv={26}>
            <Column mh={26} gv={26}>
                <Input
                    label="Buscar categorias"
                    value={searchTerm}
                    setValue={setSearchTerm}
                    placeholder="Digite para buscar categorias..."
                    keyboardType="default"
                    search
                    onSearch={handleSearch}
                    onSubmitEditing={() => {
                        handleSearch();
                    }}
                />
                {isSearching ? (
                    <Column style={{ paddingVertical: 20, alignItems: 'center' }}>
                        <Loader size={32} color={theme.color.primary} />
                    </Column>
                ) : (
                    <FlatList
                        data={displayData}
                        renderItem={({ item }) => <Card item={item} />}
                        keyExtractor={(item) => item.id}
                    />
                )}
                <Message error={error} />
                <Button
                    label="Próximo"
                    onPress={handleNext}
                />
            </Column>
        </Column>
    )
})

interface StockProps {
    stockValues: {
        stockMin: string;
        stockMax: string;
        alertPercentage: string;
    };
    isLoading: boolean;
    setstockValues: React.Dispatch<React.SetStateAction<{
        stockMin: string;
        stockMax: string;
        alertPercentage: string;
    }>>;
    handleCreate: () => void;
    status: boolean;
    setstatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const Stock = React.memo(({ stockValues, isLoading, setstockValues, handleCreate, status, setstatus }: StockProps) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const refs = useRef({
        stockMin: null as any,
        stockMax: null as any,
        alertPercentage: null as any,
    });

    const fieldProperties = {
        stockMin: {
            label: "Estoque minímo",
            placeholder: "Ex.: 200",
            keyboardType: "numeric",
        },
        stockMax: {
            label: "Estoque máximo",
            placeholder: "Ex.: 500",
            keyboardType: "numeric",
        },
        alertPercentage: {
            label: "Percentual de Alerta (%)",
            placeholder: "Ex.: 10",
            keyboardType: "numeric",
        },
    };

    // Validações dinâmicas
    const validations = {
        stockMin: (value) => {
            if (!value) return "Por favor, insira o estoque mínimo.";
            if (parseInt(value) < 0) return "O estoque mínimo não pode ser menor que 0.";
            if (parseInt(value) > parseInt(stockValues.stockMax)) return "O estoque mínimo não pode ser maior que o estoque máximo.";
            return true;
        },
        stockMax: (value) => {
            if (!value) return "Por favor, insira o estoque máximo.";
            if (parseInt(value) < 0) return "O estoque máximo não pode ser menor que 0.";
            if (parseInt(value) < parseInt(stockValues.stockMin)) return "O estoque máximo não pode ser menor que o estoque mínimo.";
            return true;
        },
        alertPercentage: (value) => {
            if (!value) return "Por favor, insira o percentual de alerta.";
            if (isNaN(parseInt(value))) return "Por favor, insira um percentual válido.";
            if (parseInt(value) < 0 || parseInt(value) > 100) return "O percentual deve estar entre 0 e 100.";
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
            <Input
                label="Estoque minímo"
                value={stockValues.stockMin}
                setValue={(value) => handleChange('stockMin', value)}
                placeholder="Ex.: 200"
                keyboardType="numeric"
                ref={(el) => { refs.current.stockMin = el; }}
                onSubmitEditing={() => {
                    refs.current.stockMax?.focus();
                }}
            />
            <Input
                label="Estoque máximo"
                value={stockValues.stockMax}
                setValue={(value) => handleChange('stockMax', value)}
                placeholder="Ex.: 500"
                keyboardType="numeric"
                ref={(el) => { refs.current.stockMax = el; }}
                onSubmitEditing={() => {
                    refs.current.alertPercentage?.focus();
                }}
            />
            <Input
                label="Percentual de Alerta (%)"
                value={stockValues.alertPercentage}
                setValue={(value) => handleChange('alertPercentage', value)}
                placeholder="Ex.: 10"
                keyboardType="numeric"
                ref={(el) => { refs.current.alertPercentage = el; }}
                onSubmitEditing={() => {
                    handleNext();
                }}
            />
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