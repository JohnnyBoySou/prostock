import { Main, Row, Loader, colors, Title, Column, Label, useQuery, Button } from "@/ui";
import { PenLine } from "lucide-react-native";
import { FlatList } from 'react-native';
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { listSupplier } from '@/api/supplier';

export default function SupplierListScreen() {
    const { data, isLoading } = useQuery({
        queryKey: ["supplier"],
        queryFn: async () => {
            const res = await listSupplier(); return res.data;
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
                        <Button label='Criar fornecedor' route="SupplierAdd" />
                    </Column>
                </Column>
            }
        </Main>)
}

const Items = ({ data }) => {
    const navigation = useNavigation();
    const Card = ({ item }) => {
        const { id, status, cep, cidade, cnpj, email, endereco, estado, telefone, cpf_responsavel, email_responsavel, id_loja, nome_fantasia, nome_responsavel, telefone_responsavel } = item;
        return (
            <Pressable onPress={() => { navigation.navigate('SupplierEdit', { id: id }) }} >
                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome_fantasia.length > 16 ? nome_fantasia.slice(0,16) + '...' : nome_fantasia}</Title>
                        <Label>{cidade} • {status} </Label>
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
