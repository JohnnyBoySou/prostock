import React, { useState, useEffect, useRef } from "react";
import { Main, Button, Column, Input, ScrollVertical, Tabs, Medida, Status, Title, Row, colors, useMutation, useToast, useFetch, Loader, Icon, Label, MultiStep } from "@/ui";

import { CategoryService } from "src/services/category";
import { Pressable, KeyboardAvoidingView, FlatList, Text } from "react-native";
import { Check } from 'lucide-react-native';
import { ProductService, ProductCreateRequest } from "src/services/product";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CategoryEmpty from "../category/_empty";

const productSchema = z.object({
    name: z
        .string()
        .min(1, "O nome do produto é obrigatório")
        .min(2, "O nome deve ter pelo menos 2 caracteres")
        .max(100, "O nome deve ter no máximo 100 caracteres"),

    description: z
        .string()
        .min(1, "A descrição é obrigatória")
        .min(5, "A descrição deve ter pelo menos 5 caracteres")
        .max(500, "A descrição deve ter no máximo 500 caracteres"),

    referencePrice: z
        .string()
        .min(1, "O preço de referência é obrigatório")
        .refine((val) => !isNaN(parseFloat(val)), "Por favor, insira um preço válido")
        .refine((val) => parseFloat(val) >= 0, "O preço não pode ser negativo"),

    unitOfMeasure: z.enum(['UNIDADE', 'KG', 'L', 'ML', 'M', 'CM', 'MM', 'UN', 'DZ', 'CX', 'PCT', 'KIT', 'PAR', 'H', 'D']),

    categoryIds: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),

    stockMin: z
        .string()
        .min(1, "O estoque mínimo é obrigatório")
        .refine((val) => !isNaN(parseInt(val)), "Por favor, insira um valor válido")
        .refine((val) => parseInt(val) >= 0, "O estoque mínimo não pode ser negativo"),

    stockMax: z
        .string()
        .min(1, "O estoque máximo é obrigatório")
        .refine((val) => !isNaN(parseInt(val)), "Por favor, insira um valor válido")
        .refine((val) => parseInt(val) >= 0, "O estoque máximo não pode ser negativo"),

    alertPercentage: z
        .string()
        .min(1, "O percentual de alerta é obrigatório")
        .refine((val) => !isNaN(parseInt(val)), "Por favor, insira um valor válido")
        .refine((val) => parseInt(val) >= 0 && parseInt(val) <= 100, "O percentual deve estar entre 0 e 100"),

    status: z.boolean()
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductAddScreen({ navigation, route }) {
    const toast = useToast();
    const queryClient = useQueryClient();
    const data = route?.params?.data
    const theme = colors();

    const [tab, settab] = useState("Sobre");
    const types = ["Sobre", "Categorias", "Estoque"];
    const values: ProductCreateRequest['unitOfMeasure'][] = ['UNIDADE', 'KG', 'L', 'ML', 'M', 'CM', 'MM', 'UN', 'DZ', 'CX', 'PCT', 'KIT', 'PAR', 'H', 'D']

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        trigger
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: data?.name || "",
            description: data?.description || "",
            referencePrice: data?.referencePrice?.toString() || "",
            unitOfMeasure: data?.unitOfMeasure || 'UNIDADE',
            categoryIds: [],
            stockMin: data?.stockMin?.toString() || "",
            stockMax: data?.stockMax?.toString() || "",
            alertPercentage: data?.alertPercentage?.toString() || "10",
            status: true,
        },
        mode: "onChange"
    });

    const aboutVerifyFieldsRef = useRef<(() => Promise<boolean>) | undefined>(undefined);
    const categoriesVerifyFieldsRef = useRef<(() => Promise<boolean>) | undefined>(undefined);
    const stockVerifyFieldsRef = useRef<(() => Promise<boolean>) | undefined>(undefined);

    const createProductMutation = useMutation({
        mutationFn: async (params: ProductFormData) => {
            const productParams: ProductCreateRequest = {
                name: params.name,
                description: params.description,
                unitOfMeasure: params.unitOfMeasure,
                referencePrice: parseFloat(params.referencePrice),
                categoryIds: params.categoryIds,
                stockMin: parseInt(params.stockMin),
                stockMax: parseInt(params.stockMax),
                alertPercentage: parseInt(params.alertPercentage),
                status: params.status,
            };
            return await ProductService.create(productParams);
        },
        onSuccess: () => {
            toast.showSuccess('Produto criado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setTimeout(() => {
                navigation.replace('ProductList');
            }, 1000);
        },
        onError: (error) => {
            console.log(error);
            toast.showError(error.message || 'Erro ao criar produto');
        }
    });

    const onSubmit = (data: ProductFormData) => {
        createProductMutation.mutate(data);
    };

    const handleNext = async () => {
        let isValid = false;

        if (tab === "Sobre" && aboutVerifyFieldsRef.current) {
            isValid = await aboutVerifyFieldsRef.current();
            if (isValid) {
                settab("Categorias");
            }
        } else if (tab === "Categorias" && categoriesVerifyFieldsRef.current) {
            isValid = await categoriesVerifyFieldsRef.current();
            if (isValid) {
                settab("Estoque");
            }
        } else if (tab === "Estoque" && stockVerifyFieldsRef.current) {
            isValid = await stockVerifyFieldsRef.current();
            if (isValid) {
                handleSubmit(onSubmit)();
            }
        }
    };

    return (
        <Main>
            <KeyboardAvoidingView behavior="padding">
                <Tabs types={types} value={tab} setValue={settab} />
                <ScrollVertical>
                    {tab === "Sobre" && <About control={control} errors={errors} values={values} settab={settab} verifyFieldsRef={aboutVerifyFieldsRef} watch={watch} trigger={trigger} />}
                    {tab === "Categorias" && <Categories errors={errors} settab={settab} setValue={setValue} watch={watch} verifyFieldsRef={categoriesVerifyFieldsRef} trigger={trigger} />}
                    {tab === "Estoque" && <Stock control={control} errors={errors} isLoading={createProductMutation.isLoading} onSubmit={handleSubmit(onSubmit)} verifyFieldsRef={stockVerifyFieldsRef} watch={watch} trigger={trigger} />}
                </ScrollVertical>
            </KeyboardAvoidingView>
            <Column style={{ position: "absolute", bottom: 20, left: 0, right: 0, backgroundColor: theme.color.foreground, borderRadius: 6, }} pv={26} ph={26}>
                <Label>Passo {tab === "Sobre" ? 1 : tab === "Categorias" ? 2 : 3} de 3</Label>
                <MultiStep steps={3} currentStep={tab === "Sobre" ? 0 : tab === "Categorias" ? 1 : 2} />
                <Row>
                    <Button label="Voltar" onPress={() => settab(tab === "Sobre" ? "Sobre" : tab === "Categorias" ? "Categorias" : "Estoque")} disabled={tab === "Sobre"} variant="tertiary" />
                    <Button label={tab === "Estoque" ? "Criar produto" : "Próximo"} onPress={handleNext} variant="tertiary" />
                </Row>
            </Column>
        </Main>
    )
}

interface AboutProps {
    control: any;
    errors: any;
    settab: (tab: string) => void;
    values: ProductCreateRequest['unitOfMeasure'][];
    verifyFieldsRef: React.MutableRefObject<(() => Promise<boolean>) | undefined>;
    watch: any;
    trigger: any;
}

const About = ({ control, errors, settab, values, verifyFieldsRef, watch, trigger }: AboutProps) => {
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const priceRef = useRef(null);

    const handleNext = () => {
        settab("Categorias");
    };

    const verifyFields = async (): Promise<boolean> => {
        // Valida apenas os campos da tab Sobre usando React Hook Form
        const fieldsToValidate = ['name', 'description', 'referencePrice', 'unitOfMeasure'];
        const isValid = await trigger(fieldsToValidate);
        return isValid;
    };

    // Passa a função verifyFields para a referência
    useEffect(() => {
        verifyFieldsRef.current = verifyFields;
    }, [verifyFieldsRef]);

    return (
        <Column mh={26} gv={26}>
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={nameRef}
                        label="Nome do Produto"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: Produto X"
                        keyboardType="default"
                        errorMessage={errors.name?.message}
                        onSubmitEditing={() => descriptionRef.current?.focus()}
                        returnKeyType="next"
                    />
                )}
            />

            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={descriptionRef}
                        label="Descrição"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: Uma breve descrição"
                        keyboardType="default"
                        errorMessage={errors.description?.message}
                        onSubmitEditing={() => priceRef.current?.focus()}
                        returnKeyType="next"
                    />
                )}
            />

            <Controller
                control={control}
                name="referencePrice"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={priceRef}
                        label="Preço de Referência"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: 25.50"
                        keyboardType="numeric"
                        errorMessage={errors.referencePrice?.message}
                        onSubmitEditing={handleNext}
                        returnKeyType="done"
                    />
                )}
            />

            <Controller
                control={control}
                name="unitOfMeasure"
                render={({ field: { onChange, value } }) => (
                    <Medida values={values} setValue={onChange} value={value} />
                )}
            />
            {errors.unitOfMeasure && (
                <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                    {errors.unitOfMeasure.message}
                </Text>
            )}

            <Button
                label="Próximo"
                onPress={handleNext}
            />
        </Column>
    )
}

interface CategoriesProps {
    errors: any;
    settab: (tab: string) => void;
    setValue: any;
    watch: any;
    verifyFieldsRef: React.MutableRefObject<(() => Promise<boolean>) | undefined>;
    trigger: any;
}

const Categories = ({ errors, settab, setValue, watch, verifyFieldsRef, trigger }: CategoriesProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const theme = colors();
    const watchedCategoryIds = watch("categoryIds");

    useEffect(() => {
        setSelectedCategoryIds(watchedCategoryIds || []);
    }, [watchedCategoryIds]);

    const { data: categories, isLoading, refetch } = useFetch({
        key: CategoryService.keys.list,
        fetcher: async () => {
            const res = await CategoryService.list();
            console.log(res);
            return res;
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

    const handleNext = () => {
        settab("Estoque");
    };

    const verifyFields = async (): Promise<boolean> => {
        // Valida apenas o campo categoryIds usando React Hook Form
        const isValid = await trigger(['categoryIds']);
        return isValid;
    };

    // Passa a função verifyFields para a referência
    useEffect(() => {
        verifyFieldsRef.current = verifyFields;
    }, [verifyFieldsRef]);

    const toggleCategory = (categoryId: string) => {
        const currentIds = watchedCategoryIds || [];
        const newIds = currentIds.includes(categoryId)
            ? currentIds.filter(id => id !== categoryId)
            : [...currentIds, categoryId];
        setValue("categoryIds", newIds);
    };

    const Card = ({ item }) => {
        const { name, status, id, color, icon, description } = item;
        const isSelected = selectedCategoryIds.includes(id);

        return (
            <Pressable
                onPress={() => toggleCategory(id)}
                style={{
                    borderColor: isSelected ? theme.color.primary : theme.color.border,
                    borderWidth: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                }}
            >
                <Row align='center'>
                    {/* Ícone da categoria */}
                    {icon && (
                        <Column
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: color ? color + "60" : theme.color.primary + '20',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}
                        >
                            <Icon
                                name={icon as any}
                                size={20}
                                color={theme.color.tertiary}
                            />
                        </Column>
                    )}

                    {/* Conteúdo do card */}
                    <Row justify='space-between' align='center' style={{ flexGrow: 1, }}>
                        <Column>
                            <Title size={16} fontFamily='Font_Medium'>{name}</Title>
                            {description && (
                                <Label size={12}>
                                    {description.length > 40 ? `${description.substring(0, 40)}...` : description}
                                </Label>
                            )}
                        </Column>
                        <Column style={{
                            width: 32,
                            height: 32,
                            borderColor: isSelected ? theme.color.primary : theme.color.foreground,
                            borderWidth: 2,
                            borderRadius: 100,
                            backgroundColor: isSelected ? theme.color.primary : theme.color.foreground,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {isSelected && <Check color='#FFF' size={20} />}
                        </Column>
                    </Row>

                </Row>
            </Pressable>
        )
    }

    const displayData = searchTerm.length >= 2 ? searchResults?.categories : categories?.items;

    return (
        <Column >
            <Column mh={26} gv={16}>
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

                {selectedCategoryIds.length > 0 && (
                    <Row justify='space-between' align='center'>
                        <Label fontFamily='Font_Medium'>
                            {selectedCategoryIds.length} categoria{selectedCategoryIds.length > 1 ? 's' : ''} selecionada{selectedCategoryIds.length > 1 ? 's' : ''}
                        </Label>
                        <Pressable
                            onPress={() => setValue("categoryIds", [])}
                            style={{
                                backgroundColor: theme.color.red + '20',
                                padding: 8,
                                borderRadius: 6
                            }}
                        >
                            <Label color={theme.color.red} size={12} fontFamily='Font_Medium'>
                                Limpar
                            </Label>
                        </Pressable>
                    </Row>
                )}
                {isSearching ? (
                    <Column style={{ paddingVertical: 20, alignItems: 'center' }}>
                        <Loader size={32} color={theme.color.primary} />
                    </Column>
                ) : (
                    <FlatList
                        data={displayData}
                        renderItem={({ item }) => <Card item={item} />}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={<CategoryEmpty />}
                    />
                )}
                {errors.categoryIds && (
                    <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                        {errors.categoryIds.message}
                    </Text>
                )}
                <Button
                    label="Próximo"
                    onPress={handleNext}
                />
            </Column>
        </Column>
    );
}

interface StockProps {
    control: any;
    errors: any;
    isLoading: boolean;
    onSubmit: () => void;
    verifyFieldsRef: React.MutableRefObject<(() => Promise<boolean>) | undefined>;
    watch: any;
    trigger: any;
}

const Stock = ({ control, errors, isLoading, onSubmit, verifyFieldsRef, watch, trigger }: StockProps) => {
    const stockMinRef = useRef(null);
    const stockMaxRef = useRef(null);
    const alertPercentageRef = useRef(null);

    const verifyFields = async (): Promise<boolean> => {
        // Valida apenas os campos da tab Estoque usando React Hook Form
        const fieldsToValidate = ['stockMin', 'stockMax', 'alertPercentage'];
        const isValid = await trigger(fieldsToValidate);
        return isValid;
    };

    // Passa a função verifyFields para a referência
    useEffect(() => {
        verifyFieldsRef.current = verifyFields;
    }, [verifyFieldsRef]);

    return (
        <Column mh={26} gv={26}>
            <Controller
                control={control}
                name="stockMin"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={stockMinRef}
                        label="Estoque mínimo"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: 200"
                        keyboardType="numeric"
                        errorMessage={errors.stockMin?.message}
                        onSubmitEditing={() => stockMaxRef.current?.focus()}
                        returnKeyType="next"
                    />
                )}
            />

            <Controller
                control={control}
                name="stockMax"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={stockMaxRef}
                        label="Estoque máximo"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: 500"
                        keyboardType="numeric"
                        errorMessage={errors.stockMax?.message}
                        onSubmitEditing={() => alertPercentageRef.current?.focus()}
                        returnKeyType="next"
                    />
                )}
            />

            <Controller
                control={control}
                name="alertPercentage"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={alertPercentageRef}
                        label="Percentual de Alerta (%)"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: 10"
                        keyboardType="numeric"
                        errorMessage={errors.alertPercentage?.message}
                        onSubmitEditing={onSubmit}
                        returnKeyType="done"
                    />
                )}
            />

            <Controller
                control={control}
                name="status"
                render={({ field: { onChange, value } }) => (
                    <Status setValue={onChange} value={value} />
                )}
            />

            <Button
                label="Criar produto"
                onPress={onSubmit}
                loading={isLoading}
            />
        </Column>
    )
}