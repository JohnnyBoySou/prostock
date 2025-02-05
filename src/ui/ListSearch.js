import { useState } from "react";
import { Column, Loader, Search, colors, Label, useQuery, useInfiniteQuery, Button } from "@/ui";
import { RefreshControl, FlatList } from "react-native-gesture-handler";

export default function ListSearch({ renderItem, getSearch, getList, selectID, empty, spacing = true, top = false, id = 'id', name = '', refresh = true, }) {
    const [termo, settermo] = useState('');
    const { data: result, isLoading: loadingSearch, refetch: handleSearch } = useQuery({
        queryKey: [`search ${id} ${name}`],
        queryFn: async () => {
            const res = await getSearch(termo); return res.data;
        },
    });
    const resultado = result?.filter(item => item[id] === selectID); 
    const listData = selectID ? resultado?.length == 0 ? result : resultado : result
    if(!listData) return null;
    return (
        <Column >
            {loadingSearch ? <Column mv={50}><Loader size={32} color={colors.color.primary} /></Column> :
                <FlatList
                    data={listData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    refreshControl={refresh ? <RefreshControl refreshing={loadingSearch} onRefresh={() => { handleSearch() }} /> : null}
                    style={{  paddingHorizontal: 26, paddingVertical: top ? 26 : 0 }}
                    ListFooterComponent={<Column>
                     
                        {spacing && <Column style={{height: 200, }} /> }
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

/*
  const {data: list, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: [`list ${id} ${name}`],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await getList(pageParam); return res.data;
        },
        getNextPageParam: (lastPage) => lastPage?.next_page,
    });
    const nextProduct = () => {
        if (isFetchingNextPage || !hasNextPage) return;
        fetchNextPage();
    }
   {listData?.length >= 20 &&
                            <Column>
                                <Button onPress={() => { nextProduct() }} label="Carregar mais" />
                            </Column>
                        }
*/