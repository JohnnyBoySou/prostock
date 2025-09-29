import { Main, Row, colors, Title, Column, Label, Button, Input, useFetch, useToast, ScrollVertical, Icon, Pressable, } from "@/ui";
import { RefreshControl, FlatList, } from 'react-native';

import { ProductService } from "@/services/product";
import { useNavigation } from "@react-navigation/native";
import ProductEmpty from "./_empty";
import ProductLoading from "./_loading";
import ProductError from "./_error";
import { useState, useEffect } from "react";


export default function ProductListScreen() {
    const toast = useToast();
    const theme = colors();
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const { data: products, isLoading, error, refetch } = useFetch({
        key: ["products"],
        fetcher: async () => {
            const res = await ProductService.list();
            return res;
        }
    });

    const handleSearch = async () => {
        if (!search.trim()) {
            setShowSearchResults(false);
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const res = await ProductService.search(search.trim());
            setSearchResults(res.items || []);
            setShowSearchResults(true);
            toast.showSuccess(`${res.items?.length || 0} produto(s) encontrado(s)`);
        } catch (error) {
            toast.showError('Erro ao buscar produtos');
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClearSearch = () => {
        setSearch("");
        setSearchResults([]);
        setShowSearchResults(false);
    };

    useEffect(() => {
        if (!search.trim()) {
            setShowSearchResults(false);
            setSearchResults([]);
        }
    }, [search]);

    if (isLoading) return <ProductLoading />
    if (error) return <ProductError />

    const isEmpty = showSearchResults ? searchResults.length === 0 : products?.items?.length === 0;

    const currentData = showSearchResults ? searchResults : products?.items || [];

    return (
        <Main>
            <FlatList
                data={currentData}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => <ProductCard product={item} />}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading || isSearching} onRefresh={() => { refetch() }} />}
                style={{ paddingHorizontal: 26, }}
                contentContainerStyle={{ gap: 16 }}
                ListHeaderComponent={
                    <Column style={{ marginTop: -24, }}>
                        <Input
                            placeholder="Pesquisar produto"
                            setValue={setSearch}
                            value={search}
                            search
                            disabled={isLoading || isSearching || isEmpty}
                            onSearch={handleSearch}
                        />
                        {showSearchResults && (
                            <Row justify='space-between' align='center' mt={12}>
                                <Label fontFamily='Font_Medium'>
                                    Resultados da busca ({searchResults.length})
                                </Label>
                                <Pressable onPress={handleClearSearch} style={{ backgroundColor: theme.color.red + 20, padding: 8, borderRadius: 6 }}>
                                    <Label color={theme.color.red} size={12} fontFamily='Font_Medium'>
                                        Limpar
                                    </Label>
                                </Pressable>
                            </Row>
                        )}
                    </Column>
                }
                ListEmptyComponent={
                    showSearchResults ? (
                        <Column align='center' gv={16} mv={40}>
                            <Label color={theme.color.muted} fontFamily='Font_Medium'>
                                Nenhum produto encontrado para "{search}"
                            </Label>
                            <Button
                                label="Limpar busca"
                                onPress={handleClearSearch}
                                variant="outline"
                            />
                        </Column>
                    ) : (
                        <ProductEmpty />
                    )
                }
            />
            {showSearchResults && searchResults.length === 0 && (
                <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                    <Button label='Criar produto' route="ProductAdd" />
                </Column>
            )}
        </Main>)
}

const ProductCard = ({ product }: { product: any }) => {
    const navigation = useNavigation<any>();
    const theme = colors();

    const {
        name,
        status,
        unitOfMeasure,
        id,
        stockMax,
        stockMin,
        referencePrice,
        description,
        category
    } = product;

    return (
        <Pressable
            onPress={() => { navigation.navigate('ProductSingle', { id: id }) }}
            style={{
                backgroundColor: "#fff",
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: 12,
            }}
        >
            <Row justify='space-between' align='center'>
                <Column gv={8} style={{ flex: 1 }}>
                    <Row justify='space-between' align='center'>
                        <Title size={18} fontFamily='Font_Medium'>
                            {name}
                        </Title>
                        <Icon name="ChevronRight" color={theme.color.primary} size={20} />
                    </Row>

                    <Row gv={8} align='center'>
                        <Label
                            fontFamily='Font_Medium'
                            size={12}
                        >
                            {status ? "Ativo" : "Inativo"}
                        </Label>
                    </Row>

                    {description && (
                        <Label size={12}>
                            {description.length > 50 ? `${description.substring(0, 50)}...` : description}
                        </Label>
                    )}

                    <Row gv={12} mv={4}>
                        {referencePrice && (
                            <Label size={12}>R$ {parseFloat(referencePrice).toFixed(2)}</Label>
                        )}
                    </Row>

                    {stockMax && <Row justify="space-between">
                        <Row style={{ width: 140, height: 20, }} gh={4}>
                            <Column style={{ width: "70%", height: 12, backgroundColor: theme.color.primary, borderRadius: 100 }} />
                            <Column style={{ width: "30%", height: 12, backgroundColor: theme.color.primary + 50, borderRadius: 100 }} />
                        </Row>
                        <Row gh={6}>
                            <Column pv={4} ph={8} style={{ backgroundColor: theme.color.primary, borderRadius: 4 }}>
                                <Label size={12} color='#fff'>{stockMin}/{stockMax}</Label>
                            </Column>
                            <Column pv={4} ph={8} style={{ backgroundColor: theme.color.primary, borderRadius: 4 }}>
                                <Label size={12} color='#fff'>{unitOfMeasure}</Label>
                            </Column>
                        </Row>
                    </Row>}

                </Column>
            </Row>
        </Pressable>
    )
}
