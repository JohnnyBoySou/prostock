import { useState } from "react";
import { Main, Row, colors, Title, Column, Label, Button, useInfiniteQuery, Loader } from "@/ui";
import { ChevronRight, } from "lucide-react-native";
import { FlatList, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { listNotify } from '@/api/notify/index';

export default function NotifyListScreen() {
    const [page, setpage] = useState();
    const { data, isLoading, fetchNextPage: nextProduct, refetch } = useInfiniteQuery({
        queryKey: [`list notify`],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await listNotify(pageParam);
            setpage(pageParam)
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.nextPage ?? false;
        },
    });

    const Card = ({ item }) => {
        if (!item) return null;
        const navigation = useNavigation();
        const { id, type, title, created_at, date } = item;

        return (
            <Pressable onPress={() => { navigation.navigate('NotifyShow', { id: id }) }} >
                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{title?.length > 16 ? title?.slice(0, 16) + '...' : title}</Title>
                        <Label>{type} • {date} </Label>
                    </Column>
                    <ChevronRight color={colors.color.primary} size={32} />
                </Row>
            </Pressable>
        )
    }

    if(isLoading) return <Main><Column justify="center" align='center' style={{ flex: 1, }}><Loader size={32} color={colors.color.primary} /></Column></Main>

    return (
        <Main>
            <FlatList
                data={data?.pages.flat()}
                keyExtractor={(index) => index}
                style={{ marginHorizontal: 26, paddingVertical: 12, }}
                renderItem={({ item }) => <Card item={item} />}
                ListFooterComponent={
                    <Column>
                        {page * 20 === data.pages.flat().length && <Button label='Mostrar mais' onPress={nextProduct} />}
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
