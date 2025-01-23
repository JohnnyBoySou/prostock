import { useState } from "react";
import { Column, Loader, Search, colors, Label, useQuery, useInfiniteQuery, Button } from "@/ui";
import { RefreshControl, FlatList } from "react-native-gesture-handler";

export default function ListSearchIA({ renderItem, getSearch, empty, top = false, id = 'id', name = '', refresh = true, defaultValue }) {
    const [termo, settermo] = useState(defaultValue);

    const { data: result, isLoading: loadingSearch, refetch: handleSearch } = useQuery({
        queryKey: [`search ${id} ${name}`],
        queryFn: async () => {
            const res = await getSearch(termo); return res.data;
        },
        enabled: !termo?.length < 1,
        cacheTime: 0,
    });
  
    return (
        <Column >
            {loadingSearch ? <Column mv={50}><Loader size={32} color={colors.color.primary} /></Column> :
                <FlatList
                    data={result}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    refreshControl={refresh ? <RefreshControl refreshing={loadingSearch} onRefresh={() => { handleSearch() }} /> : null}
                    ListHeaderComponent={<Column mb={12}>
                        <Search setValue={settermo} value={termo} loading={loadingSearch} onSubmitEditing={() => { handleSearch() }} onSearch={() => { handleSearch() }} />
                    </Column>}
                    ListEmptyComponent={empty}
                />}
        </Column>
    )

}