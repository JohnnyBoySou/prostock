import { Main, Row, Loader, colors, Title, Column, Label, useQuery, ScrollVertical } from "@/ui";
import { ChevronRight, LayoutGrid, Truck, Users, } from "lucide-react-native";
import { FlatList } from 'react-native';
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { showReportStore } from '@/api/report';
import { listProductStore } from '@/api/product';
import { BarChart } from "react-native-gifted-charts";
import { ProductEmpty } from './../../../ui/Emptys/product';

export default function ReportSingleScreen({ route, navigation }) {
    const id = route.params.id;
    const { data, isLoading } = useQuery({
        queryKey: ["stores report single", id],
        queryFn: async () => {
            const res = await showReportStore(id); return res;
        }
    });
    const { data: products, isLoading: loadingProducts } = useQuery({
        queryKey: ["product list store", id],
        queryFn: async () => {
            const res = await listProductStore(id); return res.data;
        }
    });

    return (
        <Main>
            {isLoading ? <Column style={{ flex: 1, }} justify="center" align='center'>
                <Loader size={32} color={colors.color.primary} />
            </Column>
                :
                <ScrollVertical>
                    <Column style={{ flex: 1 }} mh={26} gv={20}>
                        <Store item={data} />
                        <Charts data={data} />
                        <Items data={products} />
                    </Column>
                </ScrollVertical>
            }
        </Main>)
}

const Store = ({ item }) => {
    const { nome, status, cidade, estado, cnpj, funcionarios, produtos, fornecedores } = item;
    return (
        <Column gv={6} style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={16} ph={16}>
            <Title size={24}>{nome}</Title>
            <Label>{cidade}, {estado} - {status}</Label>
            <Label>CNPJ: {cnpj}</Label>
            <Row gh={6} mt={10} justify="space-between">
                <Column style={{ backgroundColor: '#43AA8B20', borderRadius: 12 }} pv={12} ph={12} gv={6}>
                    <Label size={12} color='#43AA8B'>Funcionários</Label>
                    <Row justify='space-between'>
                        <Title size={24} style={{ lineHeight: 24 }} color='#43AA8B'>{funcionarios} </Title>
                        <Users size={24} color="#43AA8B" />
                    </Row>
                </Column>
                <Column style={{ backgroundColor: '#3590F320', borderRadius: 12 }} pv={12} ph={12} gv={6}>
                    <Label size={12} color='#3590F3'>Produtos</Label>
                    <Row justify='space-between'>
                        <Title size={24} style={{ lineHeight: 24 }} color='#3590F3'>{produtos} </Title>
                        <LayoutGrid size={24} color="#3590F3" />
                    </Row>
                </Column>
                <Column style={{ backgroundColor: '#9747FF20', borderRadius: 12 }} pv={12} ph={12} gv={6}>
                    <Label size={12} color='#9747FF'>Fornecedores</Label>
                    <Row justify='space-between'>
                        <Title size={24} style={{ lineHeight: 24 }} color='#9747FF'>{fornecedores} </Title>
                        <Truck size={24} color="#9747FF" />
                    </Row>
                </Column>
            </Row>
        </Column>
    )
}

const Charts = ({ data }) => {
    const meses = data.meses;

    const ocupacao = [
        { value: meses[0].estoque_ocupado, label: meses[0].mes.slice(0, 3), frontColor: '#FF1828' },
        { value: meses[1].estoque_ocupado, label: meses[1].mes.slice(0, 3), frontColor: '#FF1828' },
        { value: meses[2].estoque_ocupado, label: meses[2].mes.slice(0, 3), frontColor: '#FF1828' }
    ];
    const entrada = [
        { value: meses[0].entrada, label: meses[0].mes.slice(0, 3), frontColor: '#FFB238' },
        { value: meses[1].entrada, label: meses[1].mes.slice(0, 3), frontColor: '#FFB238' },
        { value: meses[2].entrada, label: meses[2].mes.slice(0, 3), frontColor: '#FFB238' }
    ];

    const saida = [
        { value: meses[0].saida, label: meses[0].mes.slice(0, 3), frontColor: '#3590F3' },
        { value: meses[1].saida, label: meses[1].mes.slice(0, 3), frontColor: '#3590F3' },
        { value: meses[2].saida, label: meses[2].mes.slice(0, 3), frontColor: '#3590F3' }
    ];

    return (
        <Column gv={20}>
            <Column style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={20} ph={20}>
                <Column mb={12}>
                    <Label>Relatório</Label>
                    <Title size={24}>Ocupação</Title>
                </Column>
                <BarChart
                    barWidth={52}
                    height={150}
                    maxValue={meses[0].estoque_maximo}
                    noOfSections={3}
                    barBorderRadius={4}
                    frontColor="lightgray"
                    data={ocupacao}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    isAnimated
                    width={230}
                    xAxisLabelTextStyle={{ color: 'gray', fontSize: 12, fontFamily: 'Font_Book' }}
                    yAxisTextStyle={{ color: 'gray', fontSize: 14, fontFamily: 'Font_Book' }}
                />
            </Column>
            <Column style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={20} ph={20}>
                <Column mb={12}>
                    <Label>Relatório</Label>
                    <Title size={24}>Entrada</Title>
                </Column>
                <BarChart
                    barWidth={52}
                    noOfSections={3}
                    height={150}
                    maxValue={Math.max(entrada[0].value, entrada[1].value, entrada[2].value)}
                    barBorderRadius={4}
                    frontColor="lightgray"
                    data={entrada}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    isAnimated
                    width={230}
                    xAxisLabelTextStyle={{ color: 'gray', fontSize: 12, fontFamily: 'Font_Book' }}
                    yAxisTextStyle={{ color: 'gray', fontSize: 14, fontFamily: 'Font_Book' }}
                />
            </Column>
            <Column style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={20} ph={20}>
                <Column mb={12}>
                    <Label>Relatório</Label>
                    <Title size={24}>Saída</Title>
                </Column>
                <BarChart
                    barWidth={52}
                    noOfSections={3}
                    height={150}
                    barBorderRadius={4}
                    maxValue={Math.max(saida[0].value, saida[1].value, saida[2].value)}
                    frontColor="lightgray"
                    data={saida}
                    yAxisThickness={0}
                    xAxisThickness={0}
                    isAnimated
                    width={230}
                    xAxisLabelTextStyle={{ color: 'gray', fontSize: 12, fontFamily: 'Font_Book' }}
                    yAxisTextStyle={{ color: 'gray', fontSize: 14, fontFamily: 'Font_Book' }}
                />
            </Column>
        </Column>
    )
}

const Items = ({ data }) => {
    const navigation = useNavigation();
    const Card = ({ item }) => {
        const { nome, status, unidade, id, id_loja, descricao, estoque_maximo, estoque_minimo,  } = item;
        return (
            <Pressable onPress={() => { navigation.navigate('ReportProduct', { id: id, lojaid: id_loja }) }} >
                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome} ({unidade})</Title>
                        <Label>{status} • Mín {estoque_minimo} • Máx {estoque_maximo}</Label>
                    </Column>
                    <ChevronRight color={colors.color.primary} />
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <FlatList
                data={data}
                ListHeaderComponent={<Column mb={12}>
                    <Label>Produtos</Label>
                </Column>}
                style={{ paddingVertical: 26, }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<Column style={{ height: 200, }}/>}
                renderItem={({ item }) => <Card item={item} />}
                ListEmptyComponent={<ProductEmpty />}
            />
        </Column>
    )
}