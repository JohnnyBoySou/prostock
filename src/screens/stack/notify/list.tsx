import { useState } from "react";
import { Main, Row, colors, Title, Column, Label, Button, useInfiniteQuery, Loader, useFetch, Pressable, Icon } from "@/ui";
import { FlatList, } from "react-native";
import { NotificationService } from '@/services/notify/index';

export default function NotifyListScreen({ navigation }) {
    const [page, setPage] = useState(1);
    const theme = colors();
    const { data, isLoading, } = useFetch({
        key: [`list notify`],
        fetcher: async () => {
            const res = await NotificationService.list();
            return res;
        },
    });

    const Card = ({ item }) => {
        const { id, type, title, createdAt } = item;

        return (
            <Pressable onPress={() => { navigation.navigate('NotifySingle', { id: id }) }} >
                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{title?.length > 16 ? title?.slice(0, 16) + '...' : title}</Title>
                        <Label>{type} • {createdAt} </Label>
                    </Column>
                    <Icon name='ChevronRight' color={theme.color.primary} size={32} />
                </Row>
            </Pressable>
        )
    }

    if (isLoading) return <Main><Column justify="center" align='center' style={{ flex: 1, }}><Loader size={32} color={theme.color.primary} /></Column></Main>

    return (
        <Main>
            <FlatList
                data={data?.items}
                keyExtractor={(item) => item.id}
                style={{ marginHorizontal: 26, paddingVertical: 12, }}
                renderItem={({ item }) => <Card item={item} />}
                ListFooterComponent={
                    <Column>
                        {page * 20 === data?.items.length && <Button label='Mostrar mais' onPress={() => setPage(page + 1)} />}
                    </Column>
                }
                ListEmptyComponent={
                    <Column>
                        <Title size={24} fontFamily='Font_Medium' align='center' mt={26}>Nenhuma notificação por enquanto.</Title>
                    </Column>
                }
            />
        </Main>)
}
