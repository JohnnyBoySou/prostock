import { useState } from "react";
import { Column, Loader, Search, colors, Label, useQuery, useInfiniteQuery, Button } from "@/ui";
import { RefreshControl, FlatList } from "react-native-gesture-handler";
export default function ListSearchStore({ renderItem, getSearch, getList, empty, spacing = true, top = false, id = 1, name = 'search' }) {
    const [termo, settermo] = useState('');

    const { data: result, isLoading: loadingSearch, refetch: handleSearch } = useQuery({
        queryKey: [`search ${id} ${name}`],
        queryFn: async () => {
            const res = await getSearch(id, termo); return res.data;
        },
        enabled: false,
        cacheTime: 0,
    });
    const { data: data, isLoading, fetchNextPage: nextProduct, refetch } = useInfiniteQuery({
        queryKey: [`list infinite ${id} ${name}`],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await getList(id, pageParam);
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
                    data={result}
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