import { Main, Row, colors, Title, Column, Label, Button, Input, useFetch, useToast, ScrollVertical } from "@/ui";
import { PenLine, MapPin, Phone, Mail } from "lucide-react-native";
import { Pressable, RefreshControl, FlatList, } from 'react-native';

import { type Store, StoreService } from "@/services/store";
import { useNavigation } from "@react-navigation/native";
import StoreEmpty from "./_empty";
import StoreLoading from "./_loading";
import StoreError from "./_error";
import { useState, useEffect } from "react";


export default function StoreListScreen() {
    const toast = useToast();
    const theme = colors();
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const { data: stores, isLoading, error, refetch } = useFetch({
        key: ["stores"],
        fetcher: async () => {
            const res = await StoreService.list();
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
        if (!search.trim()) {
            setShowSearchResults(false);
            setSearchResults([]);
        }
    }, [search]);

    if (isLoading) return <StoreLoading />
    if (error) return <StoreError message={error.message} />

    const currentData = showSearchResults ? searchResults : stores?.stores || [];
    const isEmpty = showSearchResults ? searchResults.length === 0 : stores?.stores?.length === 0;

    return (
        <Main>
            <FlatList
                data={currentData}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => <Card store={item} />}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading || isSearching} onRefresh={() => { refetch() }} />}
                style={{ paddingHorizontal: 26, }}
                contentContainerStyle={{ gap: 16 }}
                ListHeaderComponent={
                    <Column style={{ marginTop: -24, }}>
                        <Input
                            placeholder="Pesquisar loja"
                            setValue={setSearch}
                            value={search}
                            search
                            onSearch={handleSearch}
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
                                Nenhuma loja encontrada para "{search}"
                            </Label>
                            <Button
                                label="Limpar busca"
                                onPress={handleClearSearch}
                                variant="outline"
                            />
                        </Column>
                    ) : (
                        <StoreEmpty />
                    )
                }
            />

            <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                <Button label='Criar loja' route="StoreAdd" />
            </Column>
        </Main>)
}

const Card = ({ store }: { store: Store }) => {
    const navigation = useNavigation<any>();
    const theme = colors();
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
            onPress={() => { navigation.navigate('StoreEdit', { id: id }) }}
            style={{
                borderColor: theme.color.border,
                borderWidth: 1,
                paddingVertical: 16,
                borderRadius: 8,
                paddingHorizontal: 16,
            }}
        >
            <Row justify='space-between' align='center'>
                <Column gv={8} style={{ flex: 1 }}>
                    <Title size={18} fontFamily='Font_Medium' >
                        {name}
                    </Title>

                    <Row gv={8} align='center'>
                        <Label
                            color={status ? theme.color.green : theme.color.red}
                            fontFamily='Font_Medium'
                            size={12}
                        >
                            {status ? "Ativo" : "Inativo"}
                        </Label>

                        {city && (
                            <Label size={12}> • {city}</Label>
                        )}

                        {state && (
                            <Label size={12}> •{state}</Label>
                        )}
                    </Row>

                    {address && (
                        <Row align='center' gv={4}>
                            <MapPin size={12} />
                            <Label size={12} >
                                {address}
                            </Label>
                        </Row>
                    )}

                    <Row gv={12} mv={4}>
                        {cnpj && (
                            <Label size={12}>CNPJ: {cnpj}</Label>
                        )}
                        {cep && (
                            <Label size={12}> • CEP: {cep}</Label>
                        )}
                    </Row>

                    {(phone || email) && (
                        <Row gv={8}>
                            {phone && (
                                <Row align='center' gv={4}>
                                    <Phone size={12} />
                                    <Label size={12}>
                                        {phone}
                                    </Label>
                                </Row>
                            )}
                            {email && (
                                <Row align='center' gv={4}>
                                    <Mail size={12} />
                                    <Label size={12}>
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
                        (navigation as any).navigate('StoreEdit', { id: id })
                    }}
                    style={{
                        padding: 8,
                        borderRadius: 6,
                        backgroundColor: theme.color.primary + 20
                    }}
                >
                    <PenLine color={theme.color.primary} size={20} />
                </Pressable>
            </Row>
        </Pressable>
    )
}
