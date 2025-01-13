import { useState } from "react";
import { Column, Loader, Search, colors, Label, useQuery, useInfiniteQuery, Button } from "@/ui";
import { RefreshControl, FlatList } from "react-native-gesture-handler";

export default function ListSearch({ renderItem, getSearch, getList, empty, spacing = true, top = false, id = 'id' }) {
    const [termo, settermo] = useState('');

    const { data: result, isLoading: loadingSearch, refetch: handleSearch } = useQuery({
        queryKey: [`search ${id}`],
        queryFn: async () => {
            const res = await getSearch(termo); return res.data;
        },
        enabled: false,
        cacheTime: 0,
    });
    const { data: data, isLoading, fetchNextPage: nextProduct, refetch } = useInfiniteQuery({
        queryKey: [`infinite ${id}`],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await getList(pageParam);
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.nextPage ?? false;
        },
        cacheTime: 0,
    });
    const listData = termo?.length > 1 ? result : data?.pages.flat()
    return (
        <Column >
            {isLoading || loadingSearch ? <Column mv={50}><Loader size={32} color={colors.color.primary} /></Column> :
                <FlatList
                    data={listData}
                    keyExtractor={(index) => index}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => { refetch() }} />}
                    style={{  paddingHorizontal: 26, paddingVertical: top ? 26 : 0 }}
                    ListFooterComponent={<Column>
                        {listData?.length >= 20 && <Button onPress={() => { nextProduct() }} title="Carregar mais" />}
                        {spacing && 
                        <Column style={{height: 200, }} />
                        }
                    </Column>}
                    ListHeaderComponent={<Column mb={12}>
                        <Label>Resultados</Label>
                        <Search setValue={settermo} value={termo} loading={loadingSearch} onSubmitEditing={() => { handleSearch() }} onSearch={() => { handleSearch() }} />
                    </Column>}
                    ListEmptyComponent={empty}
                />}
        </Column>
    )

}