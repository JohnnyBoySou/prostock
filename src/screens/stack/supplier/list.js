import { Main, Row, colors, Title, Column, Label, Button, ListSearch, } from "@/ui";
import { PenLine } from "lucide-react-native";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { listSupplier, searchSupplier } from 'src/services/supplier';
import { SupplierEmpty } from "@/ui/Emptys/supplier";

export default function SupplierListScreen() {
    return (
        <Main>

            <Column style={{ flex: 1 }}>
                <Items />
                <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                    <Button label='Criar fornecedor' route="SupplierAdd" />
                </Column>
            </Column>
        </Main>)
}

const Items = () => {
    const Card = ({ item }) => {
        if(!item) return null;
        const navigation = useNavigation();
        const { id, status, cep, cidade, cnpj, email, endereco, estado, telefone, cpf_responsavel, email_responsavel, id_loja, nome_fantasia, nome_responsavel, telefone_responsavel } = item;
        return (
            <Pressable onPress={() => { navigation.navigate('SupplierEdit', { id: id }) }} >
                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome_fantasia?.length > 16 ? nome_fantasia?.slice(0, 16) + '...' : nome_fantasia}</Title>
                        <Label>{cidade} • {status} </Label>
                    </Column>
                    <PenLine color={colors.color.primary} />
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <ListSearch id="list supplier" top spacing={true} renderItem={({ item }) => <Card item={item} />} getSearch={searchSupplier} getList={listSupplier} empty={<SupplierEmpty />} />
        </Column>
    )
}
