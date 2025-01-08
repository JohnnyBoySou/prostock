import { useState, useRef } from "react";
import { Main, Row, Button, colors, Title, Column, Label, ScrollVertical, Tabs, useQuery } from "@/ui";
import { ChevronRight, PenLine } from "lucide-react-native";
import { FlatList } from 'react-native';
import { listProduct } from '@/api/product';
import { listCategory } from "@/api/category";
import { Pressable } from "react-native";

export default function ProductListScreen() {
    const [tab, settab] = useState("Items");
    const types = ["Items", "Categorias", "Estoque"];

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

    return (<Main>
        <Column>
            <Tabs types={types} value={tab} setValue={settab} />
        </Column>
        <ScrollVertical>
            {tab === "Items" && <Items data={product} />}
            {tab === "Categorias" && <Categories data={category} />}
        </ScrollVertical>
    </Main>)
}

const Items = ({ data }) => {

    const Card = ({ item }) => {
        const { nome, status, unidade, categorias, descricao, estoque_maximo, estoque_minimo } = item;
        return (
            <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                <Column gv={4}>
                    <Title size={20} fontFamily='Font_Medium'>{nome}</Title>
                    <Label>{unidade} • {status} • min {estoque_minimo} • max {estoque_maximo}</Label>
                </Column>
                <PenLine color={colors.color.primary} />
            </Row>
        )
    }
    return (

        <FlatList
            data={data}
            ListHeaderComponent={<Column mb={12}>
                <Label>Resultados</Label>
            </Column>}
            style={{ marginHorizontal: 26, }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Card item={item} />}
        />
    )
}

const Categories = ({ data }) => {
    const Card = ({ category }) => {
        const { nome, status, id, } = category;
        return (
            <Pressable style={{
                backgroundColor: "#fff",
                paddingVertical: 20, paddingHorizontal: 20,
                borderRadius: 8,
                marginVertical: 8,
            }}>
                <Row justify='space-between'>
                    <Column gv={4}>
                        <Title size={20} fontFamily='Font_Medium'>{nome}</Title>
                        <Label>#{id} • {status} • </Label>
                    </Column>
                    <PenLine color={colors.color.primary} />
                </Row>
            </Pressable>
        )
    }
    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Card category={item} />}
            ListHeaderComponent={<Column mb={12}>
                <Label>Resultados</Label>
            </Column>}
            style={{ marginHorizontal: 26, }}
        />
    )
}
