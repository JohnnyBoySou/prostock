import React, { useState, useEffect } from "react";
import { Main, Button, Column, Input, ScrollVertical, Tabs, Medida, Status, Title, Row, colors, Loader, useFetch, useMutation, useToast } from "@/ui";

import { CategoryService } from "@/services/category";
import { Pressable, KeyboardAvoidingView } from "react-native";
import { Check } from 'lucide-react-native';
import { ProductService } from "@/services/product";
import { useQueryClient } from "@tanstack/react-query";

export default function ProductEditScreen({ route, navigation }) {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [tab, setTab] = useState("Sobre");
    const theme = colors();

    const id = route?.params?.id ? route.params.id : 1;
    const { data: product, isLoading: loadingProduct } = useFetch({
        key: ["product", id],
        fetcher: async () => {
            const res = await ProductService.get(id); 
            console.log(res); 
            return res;
        }
    });

    const { data: categories, isLoading: loadingCategory } = useFetch({
        key: CategoryService.keys.list,
        fetcher: async () => {
            const res = await CategoryService.list(); 
            return res;
        }
    });

    const [status, setStatus] = useState<boolean>(true);
    const [aboutValues, setAboutValues] = useState<{
        name: string,
        description: string,
        referencePrice: string,
        alertPercentage: string
    }>({
        name: "",
        description: "",
        referencePrice: "",
        alertPercentage: "",
    });
    const [stockValues, setStockValues] = useState<{
        stockMin: string,
        stockMax: string
    }>({
        stockMin: "",
        stockMax: "",
    });
    const [selectCategory, setSelectCategory] = useState<string>();
    const [unitOfMeasure, setUnitOfMeasure] = useState<string>("UNIDADE");

    useEffect(() => {
        if (product) {
            setAboutValues({
                name: product.name || "",
                description: product.description || "",
                referencePrice: product.referencePrice?.toString() || "",
                alertPercentage: product.alertPercentage?.toString() || "",
            });
            setStockValues({
                stockMin: product.stockMin?.toString() || "",
                stockMax: product.stockMax?.toString() || "",
            });
            setStatus(product.status);
            setSelectCategory(product.categoryId);
            setUnitOfMeasure(product.unitOfMeasure || "UNIDADE");
        }
    }, [product]);

    const types = ["Sobre", "Categorias", "Estoque"];
    const unitValues = ['UNIDADE', 'KG', 'L', 'ML', 'M', 'CM', 'MM', 'UN', 'DZ', 'CX', 'PCT', 'KIT', 'PAR', 'H', 'D'];

    const updateProductMutation = useMutation({
        mutationFn: async (params: any) => {
            return await ProductService.update(id, params);
        },
        onSuccess: () => {
            toast.showSuccess('Produto atualizado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ["product", id] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setTimeout(() => {
                navigation.navigate('ProductList');
            }, 1000);
        },
        onError: (error) => {
            toast.showError(error.message || 'Erro ao atualizar produto');
        }
    });

    const handleUpdate = () => {
        const params = {
            name: aboutValues.name,
            description: aboutValues.description,
            referencePrice: parseFloat(aboutValues.referencePrice) || 0,
            alertPercentage: parseFloat(aboutValues.alertPercentage) || 0,
            unitOfMeasure: unitOfMeasure as any,
            stockMin: parseInt(stockValues.stockMin) || 0,
            stockMax: parseInt(stockValues.stockMax) || 0,
            status: status,
            categoryId: selectCategory,
        };

        updateProductMutation.mutate(params);
    };

    const handleDelete = async () => {
        try {
            await ProductService.delete(id);
            toast.showSuccess('Produto excluído com sucesso!');
            queryClient.invalidateQueries({ queryKey: ["products"] });
            navigation.navigate('ProductList');
        } catch (error) {
            toast.showError('Erro ao excluir produto');
        }
    };

    return (<Main>
        <KeyboardAvoidingView behavior="padding">
            <Column>
                <Tabs types={types} value={tab} setValue={setTab} />
            </Column>
            {loadingProduct ?
                <Column style={{ flex: 1, }} justify="center" align='center'>
                    <Loader size={32} color={theme.color.primary} />
                </Column> :
                <ScrollVertical>
                    {tab === "Sobre" && <About 
                        values={unitValues} 
                        setUnitOfMeasure={setUnitOfMeasure} 
                        unitOfMeasure={unitOfMeasure} 
                        setTab={setTab} 
                        aboutValues={aboutValues} 
                        setAboutValues={setAboutValues} 
                    />}
                    {tab === "Categorias" && <Categories 
                        categories={categories} 
                        setTab={setTab} 
                        selectCategory={selectCategory} 
                        setSelectCategory={setSelectCategory} 
                    />}
                    {tab === "Estoque" && <Stock 
                        isLoading={updateProductMutation.isLoading} 
                        handleDelete={handleDelete} 
                        setStatus={setStatus} 
                        status={status} 
                        stockValues={stockValues} 
                        setStockValues={setStockValues} 
                        handleUpdate={handleUpdate} 
                    />}
                </ScrollVertical>}
        </KeyboardAvoidingView>
    </Main>)
}

interface AboutProps {
    aboutValues: {
        name: string,
        description: string,
        referencePrice: string,
        alertPercentage: string
    };
    setAboutValues: React.Dispatch<React.SetStateAction<{
        name: string,
        description: string,
        referencePrice: string,
        alertPercentage: string
    }>>;
    setTab: React.Dispatch<React.SetStateAction<string>>;
    values: string[];
    setUnitOfMeasure: React.Dispatch<React.SetStateAction<string>>;
    unitOfMeasure: string;
}

const About = React.memo(({ aboutValues, setAboutValues, setTab, values, setUnitOfMeasure, unitOfMeasure }: AboutProps) => {
    const toast = useToast();

    const handleChange = (field: string, value: string) => {
        setAboutValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (!aboutValues.name.trim()) {
            toast.showError("Por favor, insira o nome do produto.");
            return;
        }
        if (!aboutValues.description.trim()) {
            toast.showError("Por favor, insira uma descrição.");
            return;
        }
        setTab("Categorias");
    };

    return (
        <Column mh={26} gv={26}>
            <Input
                label="Nome do Produto"
                value={aboutValues.name}
                setValue={(value) => handleChange("name", value)}
                placeholder="Ex.: Produto X"
                keyboardType="default"
            />
            
            <Input
                label="Descrição"
                value={aboutValues.description}
                setValue={(value) => handleChange("description", value)}
                placeholder="Ex.: Uma breve descrição"
                keyboardType="default"
            />

            <Input
                label="Preço de Referência"
                value={aboutValues.referencePrice}
                setValue={(value) => handleChange("referencePrice", value)}
                placeholder="Ex.: 29.90"
                keyboardType="numeric"
            />

            <Input
                label="Percentual de Alerta"
                value={aboutValues.alertPercentage}
                setValue={(value) => handleChange("alertPercentage", value)}
                placeholder="Ex.: 20"
                keyboardType="numeric"
            />

            <Medida values={values} setvalue={setUnitOfMeasure} value={unitOfMeasure} />
            
            <Button
                label="Próximo"
                onPress={handleNext}
            />
        </Column>
    )
})

interface CategoriesProps {
    categories: any;
    setTab: React.Dispatch<React.SetStateAction<string>>;
    selectCategory: string | undefined;
    setSelectCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Categories = React.memo(({ categories, setTab, selectCategory, setSelectCategory }: CategoriesProps) => {
    const toast = useToast();
    const theme = colors();
    const handleNext = () => {
        if (!selectCategory) {
            toast.showError('Selecione uma categoria');
            return;
        }
        setTab("Estoque");
    };

    const CategoryCard = ({ category }: { category: any }) => {
        const theme = colors();
            const { name, id } = category;
        const isSelected = selectCategory === id;
        
        return (
            <Pressable 
                onPress={() => setSelectCategory(id)} 
                style={{
                    backgroundColor: "#fff",
                    borderColor: isSelected ? theme.color.green : "#e0e0e0",
                    borderWidth: 2,
                    paddingVertical: 12, 
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    marginVertical: 6,
                }}
            >
                <Row justify='space-between' align='center'>
                    <Title size={18} fontFamily='Font_Medium'>{name}</Title>
                    <Column style={{ 
                        width: 36, 
                        height: 36, 
                        borderColor: isSelected ? theme.color.green : '#d1d1d1', 
                        borderWidth: 2, 
                        borderRadius: 8, 
                        backgroundColor: isSelected ? theme.color.green : '#fff', 
                        justifyContent: 'center', 
                        alignItems: 'center' 
                    }}>
                        {isSelected && <Check color='#FFF' size={20} />}
                    </Column>
                </Row>
            </Pressable>
        )
    }

    return (
        <Column gv={26}>
            <Column mh={26} gv={16}>
                <Title size={18} fontFamily='Font_Medium'>Selecione uma categoria</Title>
                {categories?.items?.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </Column>
            
            <Column mh={26} gv={26}>
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
        stockMin: string,
        stockMax: string
    };
    setStockValues: React.Dispatch<React.SetStateAction<{
        stockMin: string,
        stockMax: string
    }>>;
    status: boolean;
    setStatus: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;
    handleUpdate: () => void;
    handleDelete: () => void;
}

const Stock = ({ stockValues, setStockValues, status, setStatus, isLoading, handleUpdate, handleDelete }: StockProps) => {
    const toast = useToast();

    const handleChange = (field: string, value: string) => {
        setStockValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (!stockValues.stockMin.trim()) {
            toast.showError("Por favor, insira o estoque mínimo.");
            return;
        }
        if (!stockValues.stockMax.trim()) {
            toast.showError("Por favor, insira o estoque máximo.");
            return;
        }
        
        const min = parseInt(stockValues.stockMin);
        const max = parseInt(stockValues.stockMax);
        
        if (min < 0) {
            toast.showError("O estoque mínimo não pode ser menor que 0.");
            return;
        }
        if (max < 0) {
            toast.showError("O estoque máximo não pode ser menor que 0.");
            return;
        }
        if (min > max) {
            toast.showError("O estoque mínimo não pode ser maior que o estoque máximo.");
            return;
        }
        
        handleUpdate();
    };

    return (
        <Column mh={26} gv={26}>
            <Input
                label="Estoque Mínimo"
                value={stockValues.stockMin}
                setValue={(value) => handleChange("stockMin", value)}
                placeholder="Ex.: 200"
                keyboardType="numeric"
                disabled={isLoading}
            />
            
            <Input
                label="Estoque Máximo"
                value={stockValues.stockMax}
                setValue={(value) => handleChange("stockMax", value)}
                placeholder="Ex.: 500"
                keyboardType="numeric"
                disabled={isLoading}
            />
            
            <Status setvalue={setStatus} value={status} />
            
            <Row gv={12}>
                <Button
                    label="Salvar"
                    onPress={handleSubmit}
                    loading={isLoading}
                    style={{ flex: 1 }}
                />
                <Button
                    label="Excluir"
                    onPress={handleDelete}
                    variant="destructive"
                    style={{ flex: 1 }}
                />
            </Row>
        </Column>
    )
}