import { Main, Row, colors, Title, Column, Label, Button, useFetch, Pressable, Icon, Input, useToast } from "@/ui";
import { RefreshControl, FlatList } from "react-native";

import { type Category, CategoryService } from "@/services/category";

import CategoryLoading from "./_loading";
import CategoryError from "./_error";
import CategoryEmpty from "./_empty";
import { useState, useEffect } from "react";

export default function CategoryListScreen({ navigation }) {
    const toast = useToast();
    const theme = colors();
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<Category[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const { data: categories, isLoading, error, refetch } = useFetch({
        key: CategoryService.keys.list,
        fetcher: async () => {
            return await CategoryService.list();
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
            const res = await CategoryService.search(search.trim());
            setSearchResults(res.categories || []);
            setShowSearchResults(true);
            toast.showSuccess(`${res.categories?.length || 0} categoria(s) encontrada(s)`);
        } catch (error) {
            toast.showError('Erro ao buscar categorias');
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

    if (isLoading) return <CategoryLoading />
    if (error) return <CategoryError />

    const isEmpty = showSearchResults ? searchResults.length === 0 : categories.items?.length === 0;
    const currentData = showSearchResults ? searchResults : categories.items;

    return (
        <Main>
            <FlatList
                data={currentData}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => <Card category={item} navigation={navigation} />}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading || isSearching} onRefresh={() => { refetch() }} />}
                style={{ paddingHorizontal: 26, }}
                contentContainerStyle={{ gap: 16 }}
                ListHeaderComponent={
                    <Column style={{ marginTop: -24, }}>
                        <Input
                            placeholder="Pesquisar categoria"
                            setValue={setSearch}
                            value={search}
                            search
                            onSearch={handleSearch}
                            onSubmitEditing={handleSearch}
                            disabled={isLoading || isSearching || isEmpty}
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
                            <Label fontFamily='Font_Medium'>
                                Nenhuma categoria encontrada para "{search}"
                            </Label>
                            <Button
                                label="Limpar busca"
                                onPress={handleClearSearch}
                                variant="outline"
                            />
                        </Column>
                    ) : (
                        <CategoryEmpty />
                    )
                }
            />
            {showSearchResults && searchResults.length === 0 && (
                <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                    <Button label='Criar categoria' route="CategoryAdd" />
                </Column>
            )}
        </Main>)
}

const Card = ({ category, navigation }: { category: Category, navigation: any }) => {
    const { name, status, id, description, code, color, icon, _count } = category;
    const theme = colors();
    return (
        <Pressable style={{
            borderColor: theme.color.border,
            borderWidth: 1,
            paddingVertical: 16,
            borderRadius: 8,
            paddingHorizontal: 16,
        }}
            onPress={() => { navigation.navigate('CategorySingle', { id: id }) }}
        >
            <Row align='center' gv={12}>
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
                <Column gv={8} style={{ flex: 1 }}>
                    <Row justify='space-between' align='center'>
                        <Title size={18} fontFamily='Font_Medium'>
                            {name}
                        </Title>
                        <Icon name="ChevronRight" color={theme.color.primary} size={20} />
                    </Row>

                    {description && (
                        <Label size={12}>
                            {description.length > 50 ? `${description.substring(0, 50)}...` : description}
                        </Label>
                    )}


                    <Row justify='space-between' align='center'>
                        {/* Status 
                        <Row align='center' gh={8}>
                            <Column
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: status ? theme.color.green : theme.color.red,
                                }}
                            />
                            <Label
                                size={11}
                                color={status ? theme.color.green : theme.color.red}
                                fontFamily='Font_Medium'
                            >
                                {status ? "Ativo" : "Inativo"}
                            </Label>
                        </Row>
                        */}
                        {code && (
                            <Row align='center' gh={4}>
                                <Label size={11} fontFamily='Font_Medium'>
                                    Código: #{code}
                                </Label>
                            </Row>
                        )}
                        {_count && (
                            <Label size={11}>
                                {_count.products || 0} produto{_count.products > 1 ? 's' : ''}
                            </Label>
                        )}
                    </Row>
                </Column>
            </Row>
        </Pressable>
    )
}