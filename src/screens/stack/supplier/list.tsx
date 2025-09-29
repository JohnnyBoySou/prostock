import { Main, Row, colors, Title, Column, Label, Button, useFetch, Pressable, Icon, Input, useToast, Loader } from "@/ui";
import { RefreshControl, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { type Supplier, SupplierService } from "@/services/supplier";

import SupplierEmpty from "./_empty";
import SupplierLoading from "./_loading";
import SupplierError from "./_error";

export default function SupplierListScreen({ navigation }) {
    const toast = useToast();
    const theme = colors();
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<Supplier[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const { data: suppliers, isLoading, error, refetch } = useFetch({
        key: 'suppliers-list',
        fetcher: async () => {
            const res = await SupplierService.list();
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
            const res = await SupplierService.search(search.trim());
            setSearchResults(res.suppliers || []);
            setShowSearchResults(true);
            toast.showSuccess(`${res.suppliers?.length || 0} fornecedor(es) encontrado(s)`);
        } catch (error) {
            toast.showError('Erro ao buscar fornecedores');
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

    // Reset search when search input is empty
    useEffect(() => {
        if (!search.trim()) {
            setShowSearchResults(false);
            setSearchResults([]);
        }
    }, [search]);

    if (isLoading) return <SupplierLoading />
    if (error) return <SupplierError message={error.message} />
    if (!suppliers) return <SupplierEmpty />

    const currentData = showSearchResults ? searchResults : suppliers.suppliers;
    const isEmpty = showSearchResults ? searchResults.length === 0 : suppliers.suppliers.length === 0;

    return (
        <Main>
            <FlatList
                data={currentData}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => <Card supplier={item} navigation={navigation} />}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading || isSearching} onRefresh={() => { refetch() }} />}
                style={{ paddingHorizontal: 26, }}
                contentContainerStyle={{ gap: 16 }}
                ListHeaderComponent={
                    <Column style={{ marginTop: -24, }}>
                        <Input
                            placeholder="Pesquisar fornecedor"
                            setValue={setSearch}
                            value={search}
                            search
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
                                Nenhum fornecedor encontrado para "{search}"
                            </Label>
                            <Button
                                label="Limpar busca"
                                onPress={handleClearSearch}
                                variant="outline"
                            />
                        </Column>
                    ) : (
                        <SupplierEmpty />
                    )
                }
            />
            {isEmpty && <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                <Button label='Criar fornecedor' route="SupplierAdd" />
            </Column>}
        </Main>)
}

const Card = ({ supplier, navigation }: { supplier: Supplier, navigation: any }) => {
    const { corporateName, tradeName, cnpj, city, state, status, id, _count } = supplier;
    const theme = colors();
    return (
        <Pressable style={{
            borderColor: theme.color.border,
            borderWidth: 1,
            paddingVertical: 16,
            borderRadius: 8,
            paddingHorizontal: 16,
        }}
            onPress={() => {
                navigation.navigate('SupplierSingle', { id: id })
            }}
        >
            <Row justify='space-between' align='center'>
                <Column gv={8} style={{ flex: 1 }}>
                    <Title size={18} fontFamily='Font_Medium'>
                        {tradeName || corporateName}
                    </Title>

                    <Row gh={8} align='center'>
                        <Label
                            fontFamily='Font_Medium'
                            size={12}
                        >
                            {status ? "Ativo" : "Inativo"}
                        </Label>

                        {cnpj && (
                            <Label size={12}>• {cnpj}</Label>
                        )}

                        {city && (
                            <Label size={12}>• {city}</Label>
                        )}
                    </Row>

                    {corporateName && corporateName !== tradeName && (
                        <Label size={12}>
                            {corporateName.length > 50 ? `${corporateName.substring(0, 50)}...` : corporateName}
                        </Label>
                    )}

                    {_count && (
                        <Row gh={12} mv={4}>
                            <Label size={12}>
                                {_count.products} produto{_count.products > 1 ? 's' : ''} • {_count.movements} movimento{_count.movements > 1 ? 's' : ''}
                            </Label>
                        </Row>
                    )}
                </Column>

            </Row>
        </Pressable>
    )
}
