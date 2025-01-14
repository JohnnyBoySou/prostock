import { Main, Row, colors, Title, Column, Label, ListSearch, Button } from "@/ui";
import { PenLine } from "lucide-react-native";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { listUser, searchUser } from '@/api/user';
import { UserEmpty } from "@/ui/Emptys/user";

export default function UserListScreen() {
    return (
        <Main>
            <Column style={{ flex: 1 }}>
                <Items  />
                <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                    <Button label='Criar usuário' route="UserAdd" />
                </Column>
            </Column>
        </Main>)
}

const Items = () => {
    const Card = ({ item }) => {
        
        if(!item) return null;
        const values = [{ name: "NORMAL", id: "regular" }, { name: "ADMIN DE LOJA", id: "adminloja" }, { name: "SUPER ADMIN", id: "superadmin" },];
        const navigation = useNavigation();
        const { nome, sobrenome, status, tipo, id, uiid, cpf, email, telefone } = item;
        return (
            <Pressable onPress={() => { navigation.navigate('UserEdit', { id: id }) }} >
                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome} {sobrenome}</Title>
                        <Label>{status} • {values.find((item) => item.id === tipo)?.name}</Label>
                    </Column>
                    <PenLine color={colors.color.primary} />
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <ListSearch id="list user" top spacing={true} renderItem={({ item }) => <Card item={item} />} getSearch={searchUser} getList={listUser} empty={<UserEmpty />} />
        </Column>
    )
}
