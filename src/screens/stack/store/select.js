import { useState, useEffect } from 'react';
import { Main, ScrollVertical, Title, Column, Row, Label, colors, Loader, ListSearch, Message, } from '@/ui';
import { getStore, selectStore } from '@/hooks/store';
import { Check, ChevronRight, Plus } from 'lucide-react-native';
import { FlatList, Pressable } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { listStore, } from '@/api/store';

export default function StoreSelectScreen({ navigation, }) {
    const [loading, setloading] = useState();
    const [store, setstore] = useState();
    const [user, setuser] = useState();
    const queryClient = useQueryClient();
    const [success, setsuccess] = useState();
    const [error, seterror] = useState();

    const fetchStore = async () => {
        try {
            const res = await getStore();
            setstore(res);
        } catch (error) {
            console.log(error);
        } finally {
        }
    }

    const fetchData = async () => {
        setloading(true)
        try {
            const user = await listStore()
            setuser(user?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false);
        }
    }
    useEffect(() => {
        fetchStore();
        fetchData();
    }, []);

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

    return (
        <Main>
            <ScrollVertical>
                <Column  gv={12}>
                    <Column mh={26}>
                        <Label>Selecionado</Label>
                        <Row pv={20} justify="space-between" ph={20} mv={12} style={{ backgroundColor: colors.color.primary, borderRadius: 8 }}>
                            <Column gv={8}>
                                <Title size={18} color='#fff'>{store?.nome}</Title>
                                <Label color='#f1f1f1'>{store?.endereco} • {store?.status}</Label>
                            </Column>
                            <Check size={32} color='#fff' />
                        </Row>
                    </Column>

                    {loading ? <Loader size={32} color={colors.color.primary} /> :
                        <FlatList
                            ListHeaderComponent={
                                <Column>
                                    <Label>Suas lojas</Label>
                                </Column>
                            }
                            data={user}
                            keyExtractor={(index) => index}
                            style={{ marginHorizontal: 26, }}
                            renderItem={({ item }) => <Item store={item} handleStore={handleStore} />}
                        />}
                </Column>

            </ScrollVertical>
            <Column style={{ position: 'absolute', bottom: 30, alignSelf: 'center' }} >
                <Message success={success} error={error} />
            </Column>
        </Main>
    )
}

const Item = ({ store, handleStore }) => {
    if (!store) return null;
    const { nome, endereco, status } = store;
    return (
        <Pressable onPress={() => handleStore(store)}>
            <Row pv={20} justify="space-between" ph={20} mv={12} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                <Column gv={4}>
                    <Title size={22}>{nome}</Title>
                    <Label>{endereco} • {status}</Label>
                </Column>
                <ChevronRight color={colors.color.primary} />
            </Row>
        </Pressable>
    )
}