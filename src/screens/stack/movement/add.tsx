import React, { useState, useEffect, useRef } from "react";
import { Main, Button, Column, Input, ScrollVertical, Tabs, Tipo, Title, Row, colors, useMutation, useToast, useFetch, Loader, Icon, Label, MultiStep } from "@/ui";

import { SupplierService } from "src/services/supplier";
import { ProductService } from "src/services/product";
import { Pressable, KeyboardAvoidingView, FlatList, Text } from "react-native";
import { Check } from 'lucide-react-native';
import { MovementService, CreateMovementRequest } from "src/services/movement";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ProductEmpty from "../product/_empty";
import SupplierEmpty from "../supplier/_empty";

const movementSchema = z.object({
    type: z.enum(['entrada', 'saida', 'perda']),
    quantity: z
        .string()
        .min(1, "A quantidade é obrigatória")
        .refine((val) => !isNaN(parseFloat(val)), "Por favor, insira uma quantidade válida")
        .refine((val) => parseFloat(val) > 0, "A quantidade deve ser maior que zero"),
    price: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(parseFloat(val)), "Por favor, insira um preço válido")
        .refine((val) => !val || parseFloat(val) >= 0, "O preço não pode ser negativo"),
    productId: z.string().min(1, "Selecione um produto"),
    supplierId: z.string().optional(),
    batch: z.string().optional(),
    expiration: z.string().optional(),
    note: z.string().optional(),
});

type MovementFormData = z.infer<typeof movementSchema>;

export default function MoveAddScreen({ navigation, route }) {
    const theme = colors();
    const toast = useToast();
    const queryClient = useQueryClient();
    const data = route?.params?.data

    const [tab, settab] = useState("Produto");
    const types = ["Produto", "Fornecedor", "Observação"];

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<MovementFormData>({
        resolver: zodResolver(movementSchema),
        defaultValues: {
            type: data?.type || 'entrada',
            quantity: data?.quantity?.toString() || "",
            price: data?.price?.toString() || "",
            productId: data?.productId || "",
            supplierId: data?.supplierId || "",
            batch: "",
            expiration: "",
            note: "",
        },
        mode: "onChange"
    });

    const createMovementMutation = useMutation({
        mutationFn: async (params: MovementFormData) => {
            const formatDate = (date: string) => {
                const [day, month, year] = date.split('/');
                return `${year}-${month}-${day}`;
            };

            const movementParams: CreateMovementRequest = {
                type: params.type.toUpperCase() as 'ENTRADA' | 'SAIDA' | 'PERDA',
                quantity: parseFloat(params.quantity),
                productId: params.productId,
                supplierId: params.supplierId || undefined,
                batch: params.batch || undefined,
                expiration: params.expiration ? formatDate(params.expiration) : undefined,
                price: params.price ? parseFloat(params.price) : undefined,
                note: params.note || undefined,
            };
            return await MovementService.create(movementParams);
        },
        onSuccess: () => {
            toast.showSuccess('Movimentação criada com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['movements'] });
            setTimeout(() => {
                navigation.replace('MoveList');
            }, 1000);
        },
        onError: (error) => {
            console.log(error);
            toast.showError(error.message || 'Erro ao criar movimentação');
        }
    });

    const onSubmit = (data: MovementFormData) => {
        createMovementMutation.mutate(data);
    };

    const handleNext = () => {
        settab(tab === "Produto" ? "Fornecedor" : tab === "Fornecedor" ? "Observação" : "Produto");
    };

    return (
        <Main>
        <KeyboardAvoidingView behavior="padding">
                <Tabs types={types} value={tab} setValue={settab} />
                
            <ScrollVertical>
                    {tab === "Produto" && <Product control={control} errors={errors} settab={settab} setValue={setValue} watch={watch} />}
                    {tab === "Fornecedor" && <Supplier control={control} errors={errors} settab={settab} setValue={setValue} watch={watch} />}
                    {tab === "Observação" && <Observation control={control} errors={errors} isLoading={createMovementMutation.isLoading} onSubmit={handleSubmit(onSubmit)} />}
            </ScrollVertical>
            <Column style={{ position: "absolute", bottom: 30, left: 26, right: 26, backgroundColor: theme.color.foreground, borderRadius: 6, }} pv={10} ph={10}>
                <Label>Passo {tab === "Produto" ? 1 : tab === "Fornecedor" ? 2 : 3} de 3</Label>
                <MultiStep steps={3} currentStep={tab === "Produto" ? 1 : tab === "Fornecedor" ? 2 : 3} />
                <Button label="Próximo" onPress={handleNext} variant="tertiary" />
            </Column>
        </KeyboardAvoidingView>
        </Main>
    )
}

interface ProductProps {
    control: any;
    errors: any;
    settab: (tab: string) => void;
    setValue: any;
    watch: any;
}

const Product = ({ control, errors, settab, setValue, watch }: ProductProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProductId, setSelectedProductId] = useState<string>("");
    const theme = colors();
    const watchedProductId = watch("productId");
    const quantityRef = useRef(null);
    const priceRef = useRef(null);

    useEffect(() => {
        setSelectedProductId(watchedProductId || "");
    }, [watchedProductId]);

    const { data: products, isLoading, refetch } = useFetch({
        key: ProductService.keys.list,
        fetcher: async () => {
            const res = await ProductService.list();
            return res;
        }
    });

    const { data: searchResults, isLoading: isSearching, refetch: handleSearch } = useFetch({
        key: ProductService.keys.search,
        fetcher: async () => {
            if (searchTerm.length < 2) return { items: [] };
            const res = await ProductService.search(searchTerm);
            return res;
        },
        enabled: searchTerm.length >= 2
    });

    const handleNext = () => {
        settab("Fornecedor");
    };

    const toggleProduct = (productId: string) => {
        const newId = selectedProductId === productId ? "" : productId;
        setValue("productId", newId);
    };

    const Card = ({ item }) => {
        const { name, unitOfMeasure, status, id } = item;
        const isSelected = selectedProductId === id;

        return (
            <Pressable
                onPress={() => toggleProduct(id)}
                style={{
                    borderColor: isSelected ? theme.color.primary : theme.color.border,
                    borderWidth: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                borderRadius: 6,
                }}
            >
                <Row justify='space-between' align='center'>
                    <Column>
                        <Title size={16} fontFamily='Font_Medium'>{name}</Title>
                        <Label>{unitOfMeasure} • {status ? "Ativo" : "Inativo"}</Label>
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
            </Pressable>
        )
    }

    const displayData = searchTerm.length >= 2 ? searchResults?.items : products?.items;

    return (
        <Column mh={26} gv={26}>
            <Input
                label="Buscar produtos"
                value={searchTerm}
                setValue={setSearchTerm}
                placeholder="Digite para buscar produtos..."
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
                    ListEmptyComponent={<ProductEmpty />}
                />
            )}

            <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                    <Tipo setValue={onChange} value={value} />
                )}
            />
            {errors.type && (
                <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                    {errors.type.message}
                </Text>
            )}

            <Controller
                control={control}
                name="quantity"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={quantityRef}
                        label="Quantidade"
                        value={value}
                        setValue={onChange}
                        required={true}
                        placeholder="Ex.: 100"
                        keyboardType="numeric"
                        errorMessage={errors.quantity?.message}
                        onSubmitEditing={() => priceRef.current?.focus()}
                        returnKeyType="next"
                    />
                )}
            />

            <Controller
                control={control}
                name="price"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={priceRef}
                        label="Preço (opcional)"
                        value={value}
                        setValue={onChange}
                        placeholder="Ex.: 25.50"
                        keyboardType="numeric"
                        errorMessage={errors.price?.message}
                        onSubmitEditing={handleNext}
                        returnKeyType="done"
                    />
                )}
            />

            {errors.productId && (
                <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                    {errors.productId.message}
                </Text>
            )}

            <Button
                label="Próximo"
                onPress={handleNext}
            />
        </Column>
    )
}

interface SupplierProps {
    control: any;
    errors: any;
    settab: (tab: string) => void;
    setValue: any;
    watch: any;
}

const Supplier = ({ control, errors, settab, setValue, watch }: SupplierProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
    const theme = colors();
    const watchedSupplierId = watch("supplierId");
    const batchRef = useRef(null);
    const expirationRef = useRef(null);

    useEffect(() => {
        setSelectedSupplierId(watchedSupplierId || "");
    }, [watchedSupplierId]);

    const { data: suppliers, isLoading, refetch } = useFetch({
        key: SupplierService.keys?.list ,
        fetcher: async () => {
            const res = await SupplierService.list();
            return res;
        }
    });

    const { data: searchResults, isLoading: isSearching, refetch: handleSearch } = useFetch({
        key: SupplierService.keys?.search ,
        fetcher: async () => {
            if (searchTerm.length < 2) return { suppliers: [] };
            const res = await SupplierService.search(searchTerm);
            return res;
        },
        enabled: searchTerm.length >= 2
    });

    const handleNext = () => {
        settab("Observação");
    };

    const toggleSupplier = (supplierId: string) => {
        const newId = selectedSupplierId === supplierId ? "" : supplierId;
        setValue("supplierId", newId);
    };

    const Card = ({ item }) => {
        const { corporateName, tradeName, city, status, id } = item;
        const isSelected = selectedSupplierId === id;
        const displayName = tradeName || corporateName;

        return (
            <Pressable
                onPress={() => toggleSupplier(id)}
                style={{
                    borderColor: isSelected ? theme.color.primary : theme.color.border,
                    borderWidth: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                borderRadius: 6,
                }}
            >
                <Row justify='space-between' align='center'>
                    <Column>
                        <Title size={16} fontFamily='Font_Medium'>{displayName}</Title>
                        <Label>{city} • {status ? "Ativo" : "Inativo"}</Label>
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
            </Pressable>
        )
    }

    const displayData = searchTerm.length >= 2 ? searchResults?.suppliers : suppliers?.suppliers;

    return (
        <Column mh={26} gv={26}>
            <Input
                label="Buscar fornecedores"
                value={searchTerm}
                setValue={setSearchTerm}
                placeholder="Digite para buscar fornecedores..."
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
                    ListEmptyComponent={<SupplierEmpty />}
                />
            )}

            <Controller
                control={control}
                name="batch"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={batchRef}
                        label="Lote (opcional)"
                        value={value}
                        setValue={onChange}
                        placeholder="Ex.: LOTE001"
                        keyboardType="default"
                        errorMessage={errors.batch?.message}
                        onSubmitEditing={() => expirationRef.current?.focus()}
                        returnKeyType="next"
                    />
                )}
            />

            <Controller
                control={control}
                name="expiration"
                render={({ field: { onChange, value } }) => (
                    <Input
                        ref={expirationRef}
                        label="Data de Vencimento (opcional)"
                        value={value}
                        setValue={onChange}
                        placeholder="Ex.: 31/12/2024"
                        keyboardType="default"
                        errorMessage={errors.expiration?.message}
                        onSubmitEditing={handleNext}
                        returnKeyType="done"
                    />
                )}
            />

            <Button
                label="Próximo"
                onPress={handleNext}
            />
        </Column>
    )
}

interface ObservationProps {
    control: any;
    errors: any;
    isLoading: boolean;
    onSubmit: () => void;
}

const Observation = ({ control, errors, isLoading, onSubmit }: ObservationProps) => {
    const noteRef = useRef(null);

    return (
        <Column mh={26} gv={26}>
            <Controller
                control={control}
                name="note"
                render={({ field: { onChange, value } }) => (
            <Input
                        ref={noteRef}
                        label="Observação (opcional)"
                placeholder="Ex.: Produto com defeito"
                value={value}
                        setValue={onChange}
                multiline={true}
                        errorMessage={errors.note?.message}
                        onSubmitEditing={onSubmit}
                        returnKeyType="done"
                    />
                )}
            />

            <Button
                label="Criar movimentação"
                onPress={onSubmit}
                loading={isLoading}
            />
        </Column>
    )
}

