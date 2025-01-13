import { Main, Row, colors, Title, Column, Label, ListSearch, Button,  } from "@/ui";
import { PenLine } from "lucide-react-native";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { listMove, searchMove } from '@/api/move';
import { MoveEmpty } from "@/ui/Emptys/move";

export default function MoveListScreen() {
    return (
        <Main>
            <Items />
            <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                <Button label='Criar movimentação' route="MoveAdd" />
            </Column>
        </Main>)
}

const Items = () => {
    const Card = ({ item }) => {
        const navigation = useNavigation();
        const { id, quantidade, produto_name, validade } = item;
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString('pt-BR', options);
        };

        return (
            <Pressable onPress={() => { navigation.navigate('MoveEdit', { id: id }) }} >
                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{produto_name?.length > 16 ? produto_name?.slice(0, 16) + '...' : produto_name}</Title>
                        <Label>{quantidade} • {formatDate(validade)} </Label>
                    </Column>
                    <PenLine color={colors.color.primary} />
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <ListSearch id='move' top spacing renderItem={({ item }) => <Card item={item} />} getSearch={searchMove} getList={listMove} empty={<MoveEmpty />} />
        </Column>
    )
}
