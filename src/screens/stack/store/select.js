import { useState, useEffect } from 'react';
import { Main, ScrollVertical, Title, Column, Row, Label, colors, Loader, Message, } from '@/ui';
import { getStore, selectStore } from '@/hooks/store';
import { Check, ChevronRight, Plus } from 'lucide-react-native';
import { listUser } from '@/api/auth';
import { Pressable } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';

export default function StoreSelectScreen({ navigation, }) {
    const [loading, setloading] = useState();
    const [store, setstore] = useState();
    const [user, setuser] = useState();
    const queryClient = useQueryClient();
    const [success, setsuccess] = useState();
    const [error, seterror] = useState();

    const fetchStore = async () => {
        setloading(true)
        try {
            const res = await getStore();
            setstore(res);
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false);
        }
    }

    const fetchData = async () => {
        try {
            const user = await listUser()
            setuser(user)
        } catch (error) {
            console.log(error)
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
                <Column mh={26} gv={12}>
                    <Column>
                        <Label>Selecionado</Label>
                        <Row pv={20} justify="space-between" ph={20} mv={12} style={{ backgroundColor: colors.color.primary, borderRadius: 8 }}>
                            <Column gv={8}>
                                <Title size={18} color='#fff'>{store?.nome}</Title>
                                <Label color='#f1f1f1'>{store?.endereco} • {store?.status}</Label>
                            </Column>
                            <Check size={32} color='#fff' />
                        </Row>
                    </Column>
                    <Column>
                        <Label>Resultados</Label>
                        {user?.lojas?.map((store, index) => (
                            <Pressable key={index} onPress={() => handleStore(store)}>
                                <Item store={store} />
                            </Pressable>
                        ))}
                    </Column>
                    <Pressable style={{ backgroundColor: colors.color.blue, borderRadius: 8, }} onPress={() => { navigation.navigate('Stacks', { screen: 'StoreAdd' }) }} >
                        <Row justify="space-between" ph={20} align='center' gh={8} pv={20}>
                            <Label size={18} color='#fff'>Adicionar nova loja</Label>
                            <Column style={{ backgroundColor: '#fff', borderRadius: 4, }} pv={6} ph={6}>
                                <Plus size={24} color={colors.color.blue} />
                            </Column>
                        </Row>
                    </Pressable>
                </Column>

            </ScrollVertical>
            <Column style={{ position: 'absolute', bottom:30, alignSelf: 'center' }} >
                <Message success={success} error={error} />
            </Column>
        </Main>
    )
}

const Item = ({ store }) => {
    
    if(!store) return null;
    const { nome, endereco, status } = store;
    return (
        <Row pv={20} justify="space-between" ph={20} mv={12} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
            <Column gv={4}>
                <Title size={22}>{nome}</Title>
                <Label>{endereco} • {status}</Label>
            </Column>
            <ChevronRight color={colors.color.primary} />
        </Row>
    )
}