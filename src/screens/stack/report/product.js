import { useState, useRef, useCallback, useEffect } from "react";
import { Main, Loader, colors, Title, Column, Label, useQuery, ScrollVertical, Row, Input, ListSearchStore, Tabs } from "@/ui";
import { showReportProduct, showReportProductLine } from 'src/services/report';
import { BarChart, LineChart } from "react-native-gifted-charts";
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Pressable } from "react-native";

import { SupplierEmpty } from '@/ui/Emptys/supplier';
import { listSupplierStore, listSupplierStoreSearch } from "src/services/supplier";
import { Calendar1, Check, ChevronRight, LayoutGrid, Search, Truck, Users, } from "lucide-react-native";

export default function ReportProductScreen({ route, navigation }) {
    const id = route.params.id;
    const lojaid = route.params.lojaid;
    const bottomSheetRef = useRef(null);

    const dateNow = new Date().toLocaleDateString('pt-BR');
    const [dateC, setdateC] = useState('01/01/2025');
    const [dateF, setdateF] = useState(dateNow);

    const [tab, settab] = useState('Saída');
    const types = ['Saída', 'Entrada', 'Perdas',];

    const [fornecedor, setfornecedor] = useState();
    const { data, isLoading } = useQuery({
        queryKey: ["stores product report single", id],
        queryFn: async () => {
            const res = await showReportProduct(id, lojaid,); return res;
        }
    });
    const { data: line, isLoading: loadingDay, refetch } = useQuery({
        queryKey: ["stores product daylist single", id, fornecedor, tab, dateC, dateF],
        queryFn: async () => {
            const res = await showReportProductLine(id, lojaid, fornecedor, dateC, dateF, tab); 
            return res;
        }
    });

    useEffect(() => {
        refetch();
    }, [fornecedor, tab, dateC, dateF]);

    return (
        <Main >
            {isLoading ? <Column style={{ flex: 1, }} justify="center" align='center'>
                <Loader size={32} color={colors.color.primary} />
            </Column>
                :
                <Column style={{ flex: 1, }}>
                    <ScrollVertical stickyHeaderIndices={[2]}>
                        <Store item={data} tab={tab} settab={settab} types={types} />
                        <Tabs types={types} value={tab} setValue={settab} />
                        <Column style={{ flex: 1 }} gv={20} mh={26} mv={20}>
                            <SingleCharts tab={tab} data={data} line={line} loadingDay={loadingDay} />
                        </Column>
                    </ScrollVertical>

                    <Pressable onPress={() => bottomSheetRef.current?.expand()} style={{ paddingHorizontal: 24, columnGap: 12, alignItems: 'center', flexDirection: 'row', position: 'absolute', alignSelf: 'center', bottom: 60, height: 56, borderRadius: 8, backgroundColor: colors.color.primary, justifyContent: 'center', alignItems: 'center', }}>
                        <Label color='#fff' size={18} fontFamily='Font_Medium'>Ver filtros</Label>
                    </Pressable>

                    <BottomSheet
                        ref={bottomSheetRef}
                        snapPoints={[0.1, '100%']}
                        index={-1}
                        backgroundStyle={{ backgroundColor: '#f1f1f1' }}
                    >
                        <BottomSheetScrollView>
                            <Column gv={16} mv={12}>
                                <Column mh={26}>
                                    <Title size={20}>Filtrar por data</Title>
                                    <Row gh={8} justify='space-between' mv={6}>
                                        <Column>
                                            <Label style={{ zIndex: 2, marginBottom: -20 }}>Data Começo</Label>
                                            <Input mask='DATE' value={dateC} setValue={setdateC} keyboard='numeric' />
                                        </Column>
                                        <Column>
                                            <Label style={{ zIndex: 2, marginBottom: -20 }}>Data Final</Label>
                                            <Input mask='DATE' value={dateF} setValue={setdateF} keyboard='numeric' />
                                        </Column>
                                    </Row>
                                </Column>
                                <Column mh={26}>
                                    <Title size={20} style={{ marginBottom: -12, marginTop: 12, }}>Filtrar por fornecedor</Title>
                                </Column>
                                <Suppliers setfornecedor={setfornecedor} fornecedor={fornecedor} lojaid={lojaid} dateC={dateC} dateF={dateF} />
                            </Column>
                        </BottomSheetScrollView>
                        <Pressable onPress={() => { bottomSheetRef?.current?.close() }} style={{ backgroundColor: colors.color.primary, borderRadius: 8, position: 'absolute', bottom: 30, justifyContent: 'center', alignItems: 'center', height: 56, left: 26, right: 26, }}>
                            <Label color='#fff' fontFamily='Font_Medium' size={18}>Definir filtros</Label>
                        </Pressable>
                    </BottomSheet>
                </Column>
            }
        </Main>)
}

const SingleCharts = ({ data, tab, line, loadingDay }) => {
    if (!data) return null;
    if (!line) return null;

    const meses = data?.estatisticas;

    const ocupacao = [
        { value: meses[0].estoque_ocupado, label: meses[0].mes.slice(0, 3), frontColor: '#FF1828' },
        { value: meses[1].estoque_ocupado, label: meses[1].mes.slice(0, 3), frontColor: '#FF1828' },
        { value: meses[2].estoque_ocupado, label: meses[2].mes.slice(0, 3), frontColor: '#FF1828' }
    ];
    const entrada = [
        { value: meses[0].entrada, label: meses[0].mes.slice(0, 3), frontColor: '#019866' },
        { value: meses[1].entrada, label: meses[1].mes.slice(0, 3), frontColor: '#019866' },
        { value: meses[2].entrada, label: meses[2].mes.slice(0, 3), frontColor: '#019866' }
    ];
    const saida = [
        { value: meses[0].saida, label: meses[0].mes.slice(0, 3), frontColor: '#3590F3' },
        { value: meses[1].saida, label: meses[1].mes.slice(0, 3), frontColor: '#3590F3' },
        { value: meses[2].saida, label: meses[2].mes.slice(0, 3), frontColor: '#3590F3' }
    ];
    const perdas = [
        { value: meses[0].perdas, label: meses[0].mes.slice(0, 3), frontColor: '#FFB238' },
        { value: meses[1].perdas, label: meses[1].mes.slice(0, 3), frontColor: '#FFB238' },
        { value: meses[2].perdas, label: meses[2].mes.slice(0, 3), frontColor: '#FFB238' }
    ]

    const selectData = tab === 'Saída' ? saida : tab === 'Entrada' ? entrada : tab === 'Perdas' ? perdas : tab === 'Ocupação' ? ocupacao : null;
    return (
        <Column gv={20}>
            <Column style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={20} ph={20}>
                <Column mb={12}>
                    <Label>Gráfico de Linha</Label>
                    <Title size={22}>Por data selecionada</Title>
                </Column>
                {loadingDay ? <Loader size={32} color={colors.color.primary} /> :
                    <LineChart
                        data={line}
                        color={'#019866'}
                        spacing={30}
                        hideDataPoints
                        thickness={5}
                        showVerticalLines
                        yAxisThickness={0}
                        xAxisThickness={0}
                        isAnimated
                        width={230}
                        xAxisLabelTextStyle={{ color: 'gray', fontSize: 10, fontFamily: 'Font_Book' }}
                        yAxisTextStyle={{ color: 'gray', fontSize: 14, fontFamily: 'Font_Book' }}
                    />}
            </Column>
            <Column style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={20} ph={20}>
                <Column mb={12}>
                    <Label>Gráfico de Barras</Label>
                    <Title size={22}>Últimos 3 meses</Title>
                </Column>
                <BarChart
                    barWidth={52}
                    height={150}
                    noOfSections={3}
                    barBorderRadius={4}
                    data={selectData}
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
                    <Label>Tabela</Label>
                    <Title size={22}>Últimos 3 meses</Title>
                </Column>
                <Column style={{ borderRadius: 6, overflow: 'hidden' }}>
                    <Row>
                        <Column style={{ width: '30%', backgroundColor: '#000', }} pv={4} justify='center' align='center'>
                            <Label size={16} color='#F1F1F1'>Data</Label>
                        </Column>
                        <Column style={{ width: '70%', backgroundColor: '#30303030', }} pv={4} justify='center' align='center'>
                            <Label size={16} color='#000'>Valor</Label>
                        </Column>
                    </Row>
                    {selectData.map((item, index) => {
                        return (
                            <Row key={index}>
                                <Column style={{ width: '30%', backgroundColor: index % 2 ? '#f1f1f1' : '#FFF', }} pv={4} justify='center' align='center'>
                                    <Label size={16}>{item?.label}</Label>
                                </Column>
                                <Column style={{ width: '70%', backgroundColor: index % 2 ? '#fff' : '#f1f1f1', }} pv={4} justify='center' align='center'>
                                    <Label size={16}>{item?.value}</Label>
                                </Column>
                            </Row>
                        )
                    })}
                </Column>
            </Column>
        </Column>
    )
}

const Suppliers = ({ lojaid, setfornecedor, fornecedor, dateC, dateF }) => {
    const Card = ({ item }) => {
        if (!item) return null;
        const { id, status, cidade, id_loja, nome_fantasia, } = item;
        return (
            <Pressable onPress={() => { setfornecedor(fornecedor === id ? '' : id) }} >
                <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8, borderWidth: 2, borderColor: fornecedor == id ? colors.color.green : '#fff' }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome_fantasia?.length > 16 ? nome_fantasia?.slice(0, 16) + '...' : nome_fantasia}</Title>
                        <Label>{cidade} • {status} </Label>
                    </Column>
                    <Check color={fornecedor == id ? colors.color.primary : '#fff'} />
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <ListSearchStore
                id={`${lojaid}`}
                spacing={false}
                name='suppliers report'
                renderItem={({ item }) => <Card item={item} />}
                getSearch={listSupplierStoreSearch}
                getList={listSupplierStore}
                empty={<SupplierEmpty />}
                dateC={dateC}
                dateF={dateF}
            />
        </Column>
    )
}


const Charts = ({ data }) => {
    if (!data) return null;

    const meses = data?.estatisticas;

    const ocupacao = [
        { value: meses[0].estoque_ocupado, label: meses[0].mes.slice(0, 3), frontColor: '#FF1828' },
        { value: meses[1].estoque_ocupado, label: meses[1].mes.slice(0, 3), frontColor: '#FF1828' },
        { value: meses[2].estoque_ocupado, label: meses[2].mes.slice(0, 3), frontColor: '#FF1828' }
    ];
    const entrada = [
        { value: meses[0].entrada, label: meses[0].mes.slice(0, 3), frontColor: '#019866' },
        { value: meses[1].entrada, label: meses[1].mes.slice(0, 3), frontColor: '#019866' },
        { value: meses[2].entrada, label: meses[2].mes.slice(0, 3), frontColor: '#019866' }
    ];

    const saida = [
        { value: meses[0].saida, label: meses[0].mes.slice(0, 3), frontColor: '#3590F3' },
        { value: meses[1].saida, label: meses[1].mes.slice(0, 3), frontColor: '#3590F3' },
        { value: meses[2].saida, label: meses[2].mes.slice(0, 3), frontColor: '#3590F3' }
    ];
    const perdas = [
        { value: meses[0].perdas, label: meses[0].mes.slice(0, 3), frontColor: '#FFB238' },
        { value: meses[1].perdas, label: meses[1].mes.slice(0, 3), frontColor: '#FFB238' },
        { value: meses[2].perdas, label: meses[2].mes.slice(0, 3), frontColor: '#FFB238' }

    ]

    const lineData = [
        { value: 0, label: '01/01' },
        { value: 20, label: '02/01' },
        { value: 18, label: '03/01' },
        { value: 32, label: '04/01' },
    ];


    return (
        <Column gv={20}>
            <Column style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={20} ph={20}>
                <Column mb={12}>
                    <Label>Relatório</Label>
                    <Title size={24}>Saída</Title>
                </Column>
                <LineChart
                    data={lineData}
                    color={'#019866'}
                    spacing={30}
                    hideDataPoints
                    thickness={5}
                    showVerticalLines
                    yAxisThickness={0}
                    xAxisThickness={0}
                    isAnimated
                    width={230}
                    xAxisLabelTextStyle={{ color: 'gray', fontSize: 10, fontFamily: 'Font_Book' }}
                    yAxisTextStyle={{ color: 'gray', fontSize: 14, fontFamily: 'Font_Book' }}
                />
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
            <Column style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={20} ph={20}>
                <Column mb={12}>
                    <Label>Relatório</Label>
                    <Title size={24}>Perdas</Title>
                </Column>
                <BarChart
                    barWidth={52}
                    noOfSections={3}
                    height={150}
                    barBorderRadius={4}
                    maxValue={Math.max(perdas[0].value, perdas[1].value, perdas[2].value)}
                    frontColor="lightgray"
                    data={perdas}
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
const Store = ({ item }) => {
    if (!item) return null;
    const { nome, status, descricao, estoque_maximo, estoque_minimo, unidade } = item;
    return (
        <Column style={{ backgroundColor: '#FFF', marginTop: -50, paddingTop: 20,}} >
            <Column gv={6} ph={26} pv={12}>
                <Title size={24}>{nome}</Title>
                <Label>{descricao} - {status} - {unidade}</Label>
            </Column>
        </Column>
    )
}