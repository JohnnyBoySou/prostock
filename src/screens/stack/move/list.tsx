import { Main, Row, colors, Title, Column, Label, Button, useFetch, Pressable, Icon, Input, useToast } from "@/ui";
import { RefreshControl, FlatList, } from "react-native";
import { useState, useEffect } from "react";

import { type Movement, MovementService } from "@/services/movement";

import MoveLoading from "./_loading";
import MoveError from "./_error";
import MoveEmpty from "./_empty";

export default function MoveListScreen({ navigation }) {
    const toast = useToast();
    const theme = colors();
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<Movement[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const { data: movements, isLoading, error, refetch } = useFetch({
        key: 'movements-list',
        fetcher: async () => {
            return await MovementService.list();
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
            const res = await MovementService.search(search.trim());
            setSearchResults(res.movements || []);
            setShowSearchResults(true);
            toast.showSuccess(`${res.movements?.length || 0} movimentação(ões) encontrada(s)`);
        } catch (error) {
            toast.showError('Erro ao buscar movimentações');
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

    if (isLoading) return <MoveLoading />
    if (error) return <MoveError />
    if (!movements) return <MoveEmpty />

    const currentData = showSearchResults ? searchResults : movements.movements;

    return (
        <Main>
            <FlatList
                data={currentData}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => <Card movement={item} navigation={navigation} />}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading || isSearching} onRefresh={() => { refetch() }} />}
                style={{ paddingVertical: 12, paddingHorizontal: 16, }}
                contentContainerStyle={{ gap: 16 }}
                ListHeaderComponent={
                    <Column>
                        <Input
                            placeholder="Pesquisar movimentação"
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
                                Nenhuma movimentação encontrada para "{search}"
                            </Label>
                            <Button
                                label="Limpar busca"
                                onPress={handleClearSearch}
                                variant="outline"
                            />
                        </Column>
                    ) : (
                        <MoveEmpty />
                    )
                }
            />
            <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                <Button label='Criar movimentação' route="MoveAdd" />
            </Column>
        </Main>)
}

const Card = ({ movement, navigation }: { movement: Movement, navigation: any }) => {
    const { id, quantity, type, product, store, expiration, createdAt } = movement;
    const theme = colors();
    
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'ENTRADA': return 'Entrada';
            case 'SAIDA': return 'Saída';
            case 'PERDA': return 'Perda';
            default: return type;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'ENTRADA': return theme.color.green;
            case 'SAIDA': return theme.color.yellow;
            case 'PERDA': return theme.color.red;
            default: return theme.color.muted;
        }
    };

    return (
        <Pressable style={{
            backgroundColor: theme.color.card,
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderRadius: 12,
        }}
            onPress={() => { navigation.navigate('MoveEdit', { id: id }) }}
        >
            <Column gv={8}>
                <Row justify='space-between' align='center'>
                    <Title size={18} fontFamily='Font_Medium'>
                        {product?.name || 'Produto não informado'}
                    </Title>
                    <Icon name="ChevronRight" color={theme.color.primary} size={20} />
                </Row>

                <Row justify='space-between' align='center'>
                    <Label size={12} color={getTypeColor(type)} fontFamily='Font_Medium'>
                        {getTypeLabel(type)} • {quantity} {product?.unitOfMeasure || 'un'}
                    </Label>
                    <Label size={12} color={theme.color.muted}>
                        {formatDate(createdAt)}
                    </Label>
                </Row>

                {store && (
                    <Label size={12} color={theme.color.muted}>
                        Loja: {store.name}
                    </Label>
                )}

                {expiration && (
                    <Label size={12} color={theme.color.muted}>
                        Validade: {formatDate(expiration)}
                    </Label>
                )}
            </Column>
        </Pressable>
    )
}
