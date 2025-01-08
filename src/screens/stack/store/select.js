import { useState, useEffect } from 'react';
import { Main, ScrollVertical, Title, Column, Row, Label, colors } from '@/ui';
import { getStore, selectStore } from '@/hooks/store';
import { Check, ChevronRight, Plus } from 'lucide-react-native';
import { listUser } from '../../../api/auth';
import { Pressable } from 'react-native';

export default function StoreSelectScreen() {
    const [loading, setloading] = useState();
    const [store, setstore] = useState();
    const [user, setuser] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getStore()
                const user = await listUser()
                setuser(user)
                setstore(res);
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, []);

    const handleStore = async (store) => {
        try {
            const res = await selectStore(store)
            console.log(res)
        } catch (error) {
            console.log(error)
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
                            <Pressable onPress={() => handleStore(store)}>
                                <Item key={index} store={store} />
                            </Pressable>
                        ))}
                    </Column>
                    <Pressable style={{ backgroundColor: colors.color.blue, borderRadius: 8,}}>
                        <Row justify="space-between" ph={20} align='center'gh={8} pv={20}>
                            <Label size={18} color='#fff'>Adicionar nova loja</Label>
                            <Column style={{ backgroundColor: '#fff',borderRadius: 4, }} pv={6} ph={6}>
                                <Plus size={24} color={colors.color.blue} />
                            </Column>
                        </Row>
                    </Pressable>
                </Column>

            </ScrollVertical>
        </Main>
    )
}

const Item = ({ store }) => {
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