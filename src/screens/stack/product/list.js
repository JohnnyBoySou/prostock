import { useState, useRef } from "react";
import { Main, Row, Loader, colors, Title, Column, Label, ScrollVertical, Tabs, useQuery, Button } from "@/ui";
import { ChevronRight, CircleDashed, MessageCircleDashed, PenLine, SquareDashed, Plus } from "lucide-react-native";
import { FlatList } from 'react-native';
import { listProduct } from '@/api/product';
import { listCategory } from "@/api/category";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CategoryEmpty } from "../../../ui/Emptys/category";
import { ProductEmpty } from "../../../ui/Emptys/product";

export default function ProductListScreen() {
    const [tab, settab] = useState("Items");
    const types = ["Items", "Categorias"];

    const { data: product, isLoading: loadingProduct } = useQuery({
        queryKey: ["product"],
        queryFn: async () => {
            const res = await listProduct(); return res.data;
        }
    });
    const { data: category, isLoading: loadingCategory } = useQuery({
        queryKey: ["category"],
        queryFn: async () => {
            const res = await listCategory(); return res.data;
        }
    });

    return (
        <Main>
            <Column>
                <Tabs types={types} value={tab} setValue={settab} />
            </Column>
            {loadingProduct ? <Column style={{ flex: 1, }} justify="center" align='center'>
                <Loader size={32} color={colors.color.primary} />
            </Column>
                :
                <Column style={{ flex: 1 }}>
                    {tab === "Items" && <Items data={product} />}
                    {tab === "Categorias" && <Categories data={category} />}
                    
                    <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                        {tab == "Items" && <Button label='Criar produto' route="ProductAdd" />}
                        {tab == "Categorias" && <Button label='Criar categoria' route="CategoryAdd" />}
                    
                    </Column>
                </Column>
            }
        </Main>)
}

const Items = ({ data }) => {
    const navigation = useNavigation();
    const Card = ({ item }) => {
        const { nome, status, unidade, id, categorias, descricao, estoque_maximo, estoque_minimo } = item;
        return (
            <Pressable onPress={() => { navigation.navigate('ProductEdit', { id: id }) }} >
                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome} ({unidade})</Title>
                        <Label>{status} • Mín {estoque_minimo} • Máx {estoque_maximo}</Label>
                    </Column>
                    <PenLine color={colors.color.primary} />
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <FlatList
                data={data}
                ListHeaderComponent={<Column mb={12}>
                    <Label>Resultados</Label>
                </Column>}
                style={{ marginHorizontal: 26, paddingVertical: 26, }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<Column style={{ height: 200, }}/>}
                renderItem={({ item }) => <Card item={item} />}
                ListEmptyComponent={<ProductEmpty />}
            />
        </Column>
    )
}

const Categories = ({ data }) => {
    const navigation = useNavigation();
    const Card = ({ category }) => {
        const { nome, status, id, } = category;
        return (
            <Pressable style={{
                backgroundColor: "#fff",
                paddingVertical: 20, paddingHorizontal: 20,
                borderRadius: 8,
                marginVertical: 8,
            }}
            onPress={() => { navigation.navigate('CategoryEdit', { id: id }) }}
            >
                <Row justify='space-between'>
                    <Column gv={4}>
                        <Title size={20} fontFamily='Font_Medium'>{nome}</Title>
                        <Label>#{id} • {status}</Label>
                    </Column>
                    <PenLine color={colors.color.primary} />
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Card category={item} />}
                ListHeaderComponent={<Column mb={12}>
                    <Label>Resultados</Label>
                </Column>}
                showsVerticalScrollIndicator={false}
                style={{ marginHorizontal: 26, paddingVertical: 26, }}
                ListFooterComponent={<Column style={{ height: 200, }} />}
                ListEmptyComponent={<CategoryEmpty />}
            />
        </Column>
    )
}
