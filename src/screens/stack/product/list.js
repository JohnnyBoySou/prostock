import { useState } from "react";
import { Main, Row, colors, Title, Column, Label, Tabs, Button, ListSearch } from "@/ui";
import { PenLine } from "lucide-react-native";
import { Pressable } from 'react-native';

import { listProduct, searchProduct } from '@/api/product';
import { listCategory, searchCategory } from "@/api/category";

import { useNavigation } from "@react-navigation/native";
import { CategoryEmpty } from "@/ui/Emptys/category";
import { ProductEmpty } from "@/ui/Emptys/product";

export default function ProductListScreen() {
    const [tab, settab] = useState("Produtos");
    const types = ["Produtos", "Categorias"];

    return (
        <Main>
            <Column>
                <Tabs types={types} value={tab} setValue={settab} />
            </Column>
            <Column style={{ flex: 1 }}>
                    {tab === "Produtos" && <Product />}
                    {tab === "Categorias" && <Categories />}
                <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                    {tab == "Produtos" && <Button label='Criar produto' route="ProductAdd" />}
                    {tab == "Categorias" && <Button label='Criar categoria' route="CategoryAdd" />}
                </Column>
            </Column>
        </Main>)
}

const Product = () => {
    const Card = ({ item }) => {
        const navigation = useNavigation();
        const { nome, status, unidade, id, estoque_maximo, estoque_minimo } = item;
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
            <ListSearch top spacing renderItem={({ item }) => <Card item={item} />} getSearch={searchProduct} getList={listProduct} empty={<ProductEmpty />} />
        </Column>
    )
}

const Categories = () => {
    const Card = ({ category }) => {
        
        if(!category) return null;
        const navigation = useNavigation();
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
            <ListSearch top spacing renderItem={({ item }) => <Card category={item} />} getSearch={searchCategory} getList={listCategory} empty={<CategoryEmpty />} />
        </Column>
    )
}
