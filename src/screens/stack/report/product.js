import { Main, Row, Loader, colors, Title, Column, Label, useQuery, ScrollVertical } from "@/ui";
import { ChevronRight, LayoutGrid, Truck, Users, PenLine} from "lucide-react-native";
import { FlatList } from 'react-native';
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { showReportProduct } from '@/api/report';
import { BarChart } from "react-native-gifted-charts";

export default function ReportProductScreen({ route, navigation }) {
    const id = route.params.id;
    const lojaid = route.params.lojaid;
    const { data, isLoading } = useQuery({
        queryKey: ["stores report single", id],
        queryFn: async () => {
            const res = await showReportProduct(id, lojaid); return res;
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
                    </Column>
                </ScrollVertical>
            }
        </Main>)
}

const Store = ({ item }) => {
    const { nome, status, descricao, estoque_maximo, estoque_minimo, unidade} = item;
    return (
        <Column gv={6} style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={16} ph={16}>
            <Title size={24}>{nome}</Title>
            <Label>{descricao} - {status} - {unidade}</Label>
            <Label>Máx: {estoque_maximo} - Mín: {estoque_minimo}</Label>
        </Column>
    )
}

const Charts = ({ data }) => {


    const meses = data?.estatisticas;

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
