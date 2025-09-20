import { useState, useEffect } from 'react';
import { Main, ScrollVertical, Title, Column, Row, Label, colors, Loader, Message, Input, useFetch, useToast } from '@/ui';
import { getStore, selectStore } from '@/hooks/store';
import { Check, ChevronRight, Plus, MapPin, Phone, Mail } from 'lucide-react-native';
import { FlatList, Pressable, RefreshControl } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { StoreService } from '@/services/store';

export default function StoreSelectScreen({ navigation, }) {
    const [store, setstore] = useState<any>();
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const queryClient = useQueryClient();
    const [success, setsuccess] = useState<string | undefined>();
    const [error, seterror] = useState<string | undefined>();
    const toast = useToast();

    const { data: stores, isLoading, error: fetchError, refetch } = useFetch({
        key: ["stores-select"],
        fetcher: async () => {
            const res = await StoreService.list();
            return res;
        }
    });

    const fetchStore = async () => {
        try {
            const res = await getStore();
            setstore(res);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearch = async () => {
        if (!search.trim()) {
            setShowSearchResults(false);
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const res = await StoreService.search(search.trim());
            setSearchResults(res.stores || []);
            setShowSearchResults(true);
            toast.showSuccess(`${res.stores?.length || 0} loja(s) encontrada(s)`);
        } catch (error) {
            toast.showError('Erro ao buscar lojas');
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
        fetchStore();
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setShowSearchResults(false);
            setSearchResults([]);
        }
    }, [search]);

    const handleStore = async (store) => {
        Haptics.selectionAsync()
        try {
            const res = await selectStore(store)
            fetchStore()
            setsuccess('Loja selecionada com sucesso. Aguarde...')
            setTimeout(() => {
                navigation.navigate('Home')
            }, 1200);
        } catch (error) {
            seterror('Erro ao selecionar loja')
            console.log(error)
        } finally {
            queryClient.invalidateQueries();
        }
    }

    const theme = colors();
    
    if (isLoading) return <Loader size={32} color={theme.color.primary} />
    if (fetchError) return (
        <Main>
            <Column align='center' gv={16} mv={40}>
                <Label color={theme.color.red} fontFamily='Font_Medium'> 
                    Erro ao carregar lojas
                </Label>
            </Column>
        </Main>
    )

    const currentData = showSearchResults ? searchResults : stores?.stores || [];

    return (
        <Main>
            <FlatList
                data={currentData}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => <StoreItem store={item} handleStore={handleStore} />}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading || isSearching} onRefresh={() => { refetch() }} />}
                style={{ paddingVertical: 12, paddingHorizontal: 16, }}
                contentContainerStyle={{ gap: 16 }}
                ListHeaderComponent={
                    <Column gv={16}>
                        {store && (
                            <Column>
                                <Label fontFamily='Font_Medium' size={16}>Loja Selecionada</Label>
                                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: colors().color.primary, borderRadius: 12 }}>
                                    <Column gv={8} style={{ flex: 1 }}>
                                        <Title size={18} color='#fff'>{(store as any)?.name}</Title>
                                        <Label color='#f1f1f1'>{(store as any)?.address} • {(store as any)?.status ? 'Ativo' : 'Inativo'}</Label>
                                    </Column>
                                    <Check size={32} color='#fff' />
                                </Row>
                            </Column>
                        )}
                        
                        <Column>
                            <Input
                                placeholder="Pesquisar loja"
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
                                    <Pressable onPress={handleClearSearch} style={{ backgroundColor: colors().color.red + 20, padding: 8, borderRadius: 6 }}>
                                        <Label color={colors().color.red} size={12} fontFamily='Font_Medium'>
                                            Limpar
                                        </Label>
                                    </Pressable>
                                </Row>
                            )}
                        </Column>
                    </Column>
                }
                ListEmptyComponent={
                    showSearchResults ? (
                        <Column align='center' gv={16} mv={40}>
                            <Label color={colors().color.muted} fontFamily='Font_Medium'>
                                Nenhuma loja encontrada para "{search}"
                            </Label>
                            <Pressable onPress={handleClearSearch} style={{ backgroundColor: colors().color.primary + 20, padding: 12, borderRadius: 8 }}>
                                <Label color={colors().color.primary} fontFamily='Font_Medium'>
                                    Limpar busca
                                </Label>
                            </Pressable>
                        </Column>
                    ) : (
                        <Column align='center' gv={16} mv={40}>
                            <Label color={colors().color.muted} fontFamily='Font_Medium'>
                                Nenhuma loja disponível
                            </Label>
                        </Column>
                    )
                }
            />
            <Column style={{ position: 'absolute', bottom: 30, alignSelf: 'center' }} >
                <Message success={success} error={error} />
            </Column>
        </Main>
    )
}

const StoreItem = ({ store, handleStore }) => {
    if (!store) return null;
    const {
        name,
        id,
        status,
        cep,
        city,
        cnpj,
        email,
        address,
        state,
        phone
    } = store;

    return (
        <Pressable
            onPress={() => handleStore(store)}
            style={{
                backgroundColor: "#fff",
                paddingVertical: 16,
                paddingHorizontal: 20,
                borderRadius: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
            }}
        >
            <Row justify='space-between' align='center'>
                <Column gv={8} style={{ flex: 1 }}>
                    <Title size={18} fontFamily='Font_Medium' color={colors().color.primary}>
                        {name}
                    </Title>

                    <Row gv={8} align='center'>
                        <Label
                            color={status ? colors().color.green : colors().color.red}
                            fontFamily='Font_Medium'
                            size={12}
                        >
                            {status ? "Ativo" : "Inativo"}
                        </Label>

                        {city && (
                            <>
                                <Label size={12}>•</Label>
                                <Label size={12}>{city}</Label>
                            </>
                        )}

                        {state && (
                            <>
                                <Label size={12}>•</Label>
                                <Label size={12}>{state}</Label>
                            </>
                        )}
                    </Row>

                    {address && (
                        <Row align='center' gv={4}>
                            <MapPin size={12} color={colors().color.muted} />
                            <Label size={12} color={colors().color.muted}>
                                {address}
                            </Label>
                        </Row>
                    )}

                    <Row gv={12} mv={4}>
                        {cnpj && (
                            <>
                                <Label size={12}>CNPJ: {cnpj}</Label>
                            </>
                        )}
                        {cep && (
                            <>
                                <Label size={12}>•</Label>
                                <Label size={12}>CEP: {cep}</Label>
                            </>
                        )}
                    </Row>

                    {(phone || email) && (
                        <Row gv={8}>
                            {phone && (
                                <Row align='center' gv={4}>
                                    <Phone size={12} color={colors().color.muted} />
                                    <Label size={12} color={colors().color.muted}>
                                        {phone}
                                    </Label>
                                </Row>
                            )}
                            {email && (
                                <Row align='center' gv={4}>
                                    <Mail size={12} color={colors().color.muted} />
                                    <Label size={12} color={colors().color.muted}>
                                        {email}
                                    </Label>
                                </Row>
                            )}
                        </Row>
                    )}
                </Column>

                <Pressable
                    onPress={(e) => {
                        e.stopPropagation();
                        handleStore(store);
                    }}
                    style={{
                        padding: 8,
                        borderRadius: 6,
                        backgroundColor: colors().color.primary + 20
                    }}
                >
                    <ChevronRight color={colors().color.primary} size={20} />
                </Pressable>
            </Row>
        </Pressable>
    )
}