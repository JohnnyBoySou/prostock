import { Main, Row, colors, Title, Column, Label, Button, ListSearch } from "@/ui";
import { PenLine,   } from "lucide-react-native";
import { Pressable } from 'react-native';

import { listProduct, searchProduct,  } from 'src/services/product';

import { useNavigation } from "@react-navigation/native";
import { ProductEmpty } from "@/ui/Emptys/product";


export default function ProductListScreen() {
    return (
        <Main>
            <Column style={{ flex: 1 }}>
                <Product />
                <Column   style={{ position: 'absolute',  bottom: 40, flexGrow: 1,  left: 26, right: 26, }}>
                    <Button label='Criar produto' route="ProductAdd" />
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
