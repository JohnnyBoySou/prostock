import { Main, Row, colors, Title, Column, Label, Button, ListSearch } from "@/ui";
import { PenLine } from "lucide-react-native";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { listStore, searchStore } from '@/api/store';
import { StoreEmpty } from "@/ui/Emptys/store";

export default function StoreListScreen() {
    return (
        <Main>
            <Column style={{ flex: 1 }}>
                <Items />
                <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                    <Button label='Criar loja' route="StoreAdd" />
                </Column>
            </Column>
        </Main>)
}

const Items = () => {
    const Card = ({ item }) => {
        const navigation = useNavigation();
        const { nome, id, status, cep, cidade, cnpj, email, endereco, estado, telefone } = item;
        return (
            <Pressable onPress={() => { navigation.navigate('StoreEdit', { id: id }) }} >
                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome}  </Title>
                        <Label>{cidade} • {status} </Label>
                    </Column>
                    <PenLine color={colors.color.primary} />
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <ListSearch id="list store" top spacing={true} renderItem={({ item }) => <Card item={item} />} getSearch={searchStore} getList={listStore} empty={<StoreEmpty />} />
        </Column>
    )
}
