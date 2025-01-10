import { Main, Row, Loader, colors, Title, Column, Label, useQuery, Button } from "@/ui";
import { PenLine } from "lucide-react-native";
import { FlatList } from 'react-native';
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { listMove } from '@/api/move';

export default function MoveListScreen() {
    const { data, isLoading } = useQuery({
        queryKey: ["move list"],
        queryFn: async () => {
            const res = await listMove(); return res.data;
        }
    });

    return (
        <Main>
            {isLoading ? <Column style={{ flex: 1, }} justify="center" align='center'>
                <Loader size={32} color={colors.color.primary} />
            </Column>
                :
                <Column style={{ flex: 1 }}>
                    <Items data={data} />
                    <Column style={{ position: 'absolute', bottom: 40, flexGrow: 1, left: 26, right: 26, }}>
                        <Button label='Criar movimentação' route="MoveAdd" />
                    </Column>
                </Column>
            }
        </Main>)
}

const Items = ({ data }) => {
    const navigation = useNavigation();
    const Card = ({ item }) => {
        const { id, fornecedor_name, quantidade, id_loja, fornecedor_id, observacoes, preco, produto_id, produto_name, user_name, validade } = item;
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString('pt-BR', options);
        };

        const formatPrice = (price) => {
            console.log(price)
            const numericPrice = parseFloat(price);
        
            if (isNaN(numericPrice)) {
                throw new Error("Invalid price format");
            }
        
            return numericPrice
                .toFixed(2)
                .replace('.', ',') 
                .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
            <FlatList
                data={data}
                ListHeaderComponent={<Column mb={12}>
                    <Label>Resultados</Label>
                </Column>}
                style={{ marginHorizontal: 26, paddingVertical: 26, }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<Column style={{ height: 200, }} />}
                renderItem={({ item }) => <Card item={item} />}
            />
        </Column>
    )
}
