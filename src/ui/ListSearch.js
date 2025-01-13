import { useState } from "react";
import { Column, Loader, Search, colors, Label, useQuery, useInfiniteQuery, Button } from "@/ui";
import { FlatList } from "react-native";

export default function ListSearch({ renderItem, getSearch, getList, empty, spacing = true, id = 'id' }) {
    const [termo, settermo] = useState();

    const { data: result, isLoading: loadingSearch, refetch: handleSearch } = useQuery({
        queryKey: [`search ${id}`],
        queryFn: async () => {
            const res = await getSearch(termo); return res.data;
        },
        enabled: false,
        //cacheTime: 0,
    });
    const { data: data, isLoading, fetchNextPage: nextProduct } = useInfiniteQuery({
        queryKey: [`infinite ${id}`],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await getList(pageParam);
            return res.data;
        },
        getNextPageParam: (lastPage) => {
            return lastPage.nextPage ?? false;
        },
       // cacheTime: 0,
    });
    const listData = result || data?.pages.flat();
    return (
        <Column >
            {isLoading || loadingSearch ? <Loader size={32} color={colors.color.primary} /> :
                <FlatList
                    data={listData}
                    keyExtractor={(index) => index}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    style={{  paddingHorizontal: 26, }}
                    ListFooterComponent={<Column>
                        {listData.length >= 20 && <Button onPress={() => { nextProduct() }} title="Carregar mais" />}
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