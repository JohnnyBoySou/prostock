import { useState, useRef, useCallback, useEffect } from "react";
import { Main, Row, Loader, colors, Title, Column, Label, useQuery, ScrollVertical, Button, Input, ListSearchStore, Tabs } from "@/ui";
import { Calendar1, Check, ChevronRight, LayoutGrid, Search, Truck, Users, } from "lucide-react-native";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { showReportStore, listReportProduct, listReportProductSearch, showReportProductLine, } from '@/api/report';
import { BarChart, LineChart } from "react-native-gifted-charts";
import { ProductEmpty } from '@/ui/Emptys/product';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { SupplierEmpty } from '@/ui/Emptys/supplier';
import { listSupplierStore, listSupplierStoreSearch } from "@/api/supplier";


export default function ReportSingleScreen({ route, navigation }) {
    const id = route.params.id;
    const dateNow = new Date().toLocaleDateString('pt-BR');
    const [dateC, setdateC] = useState('01/01/2025');
    const [dateF, setdateF] = useState(dateNow);

    const [tab, settab] = useState('Saída');
    const types = ['Saída', 'Entrada', 'Perdas',];
    const [fornecedor, setfornecedor] = useState();

    const { data, isLoading,  } = useQuery({
        queryKey: ["stores report single", id],
        queryFn: async () => {
            const res = await showReportStore(id, fornecedor); return res;
        }
    });

    const { data: line, isLoading: loadingDay, refetch } = useQuery({
        queryKey: ["stores report daylist single", id, fornecedor, tab, dateC, dateF],
        queryFn: async () => {
            const res = await showReportProductLine(null, id, fornecedor, dateC, dateF, tab); 
            return res;
        }
    });

    useEffect(() => {
        refetch();
    }, [fornecedor, tab, dateC, dateF]);

    const bottomSheetRef = useRef(null);
    return (
        <Main>
            {isLoading ? <Column style={{ flex: 1, }} justify="center" align='center'>
                <Loader size={32} color={colors.color.primary} />
            </Column>
                :
                <Column style={{ flex: 1, }}>
                    <ScrollVertical stickyHeaderIndices={[2]}>
                        <Store item={data}/>
                        <Tabs types={types} value={tab} setValue={settab} />
                        <SingleCharts data={data} tab={tab} line={line} loadingDay={loadingDay} />
                        <Products lojaid={id} dateC={dateC} dateF={dateF} />
                    </ScrollVertical>
                </Column>
            }
            <Pressable
                onPress={() => bottomSheetRef.current?.expand()}
                style={{ paddingHorizontal: 24, columnGap: 12, alignItems: 'center', flexDirection: 'row', position: 'absolute', alignSelf: 'center', bottom: 60, height: 56, borderRadius: 8, backgroundColor: colors.color.primary, justifyContent: 'center', alignItems: 'center', }}>
                <Label color='#fff' size={18} fontFamily='Font_Medium'>Ver filtros</Label>
            </Pressable>

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={[0.1, '100%']}
                index={-1}
                backgroundStyle={{ backgroundColor: '#f1f1f1' }}
            >
                <BottomSheetScrollView >
                    <Column gv={16} mv={12}>
                        <Column mh={26}>
                            <Title size={24}>Filtrar por data</Title>
                            <Row gh={8} justify='space-between'>
                                <Column>
                                    <Label style={{ zIndex: 2, marginBottom: -20 }}>Começo</Label>
                                    <Input mask='DATE' value={dateC} setValue={setdateC} keyboard='numeric' />
                                </Column>
                                <Column>
                                    <Label style={{ zIndex: 2, marginBottom: -20 }}>Final</Label>
                                    <Input mask='DATE' value={dateF} setValue={setdateF} keyboard='numeric' />
                                </Column>
                            </Row>
                        </Column>
                        <Column mh={26}>
                            <Title size={24} style={{ marginBottom: -12, marginTop: 12, }}>Filtrar por fornecedor</Title>
                        </Column>
                        <Suppliers setfornecedor={setfornecedor} fornecedor={fornecedor} lojaid={id} dateC={dateC} dateF={dateF} />
                    </Column>

                </BottomSheetScrollView>
                <Pressable onPress={() => { bottomSheetRef?.current?.close() }} style={{ backgroundColor: colors.color.primary, borderRadius: 8, position: 'absolute', bottom: 30, justifyContent: 'center', alignItems: 'center', height: 56, left: 26, right: 26, }}>
                    <Label color='#fff' fontFamily='Font_Medium' size={18}>Definir filtros</Label>
                </Pressable>
            </BottomSheet>
        </Main>)
}

const Store = ({ item,  }) => {
    if (!item) return null;
    const { nome, status, cidade, estado, cnpj, funcionarios, produtos, fornecedores } = item;
    return (
        <Column gv={6} style={{ backgroundColor: '#FFF', marginTop: -30, }} pv={16} ph={26} >
            <Title size={24}>{nome}</Title>
            <Label>{cidade}, {estado} - {status}</Label>
            <Label>CNPJ: {cnpj}</Label>
            <Row gh={12} mt={10} >
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

const Products = ({ lojaid, dateC, dateF }) => {

    const navigation = useNavigation();
    const Card = ({ item }) => {
        const { nome, status, unidade, id,
            estoque_ocupado, entrada, saida, perdas,
            id_loja, descricao, estoque_maximo, estoque_minimo, } = item;

        const ocupacao = [
            { value: estoque_ocupado, label: 'Ocupação', frontColor: '#FF1828' },
            { value: entrada, label: 'Entrada', frontColor: '#019866' },
            { value: saida, label: 'Saida', frontColor: '#3590F3' },
            { value: perdas, label: 'Perdas', frontColor: '#FFB238' }
        ];
        return (
            <Pressable onPress={() => { navigation.navigate('ReportProduct', { id: id, lojaid: lojaid }) }} style={{ backgroundColor: '#FFF', borderRadius: 8, marginVertical: 12, }}>
                <Row pv={20} justify="space-between" ph={20} >
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome} ({unidade})</Title>
                        <Label>{status} • Mín {estoque_minimo} • Máx {estoque_maximo}</Label>
                    </Column>
                    <ChevronRight color={colors.color.primary} />
                </Row>

                <Column ph={20} pv={12}>
                    <BarChart
                        barWidth={32}
                        height={120}
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
            </Pressable>
        )
    }
    return (
        <Column>
            <Column mh={26} pt={12}>
                <Title>Produtos</Title>
            </Column>
            <ListSearchStore
                id={lojaid}
                name='products report'
                spacing={true}
                renderItem={({ item }) => <Card item={item} />}
                empty={<ProductEmpty />}
                getSearch={listReportProductSearch}
                dateC={dateC}
                dateF={dateF}
                getList={listReportProduct} />
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

const SingleCharts = ({ data, tab , line, loadingDay}) => {
    if (!data) return null;
    if(!line) return null;
    const meses = data?.meses;

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
        <Column gv={20} mh={26} mv={20}>
            <Column style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={20} ph={20}>
                <Column mb={12}>
                    <Label>Gráfico de Linha</Label>
                    <Title size={24}>Por data selecionada</Title>
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
                    />
                }
            </Column>
            <Column style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={20} ph={20}>
                <Column mb={12}>
                    <Label>Gráfico de Barras</Label>
                    <Title size={24}>Últimos 3 meses</Title>
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

/*
 <Column gv={16} mv={12} mh={26}>
                            <Title size={24}>Filtrar por data</Title>
                            <Row gh={8}>
                                <Column>
                                    <Label style={{ zIndex: 2, marginBottom: -20 }}>Começo</Label>
                                    <Input mask='DATE' value={dateC} setValue={setdateC} />
                                </Column>
                                <Column>
                                    <Label style={{ zIndex: 2, marginBottom: -20 }}>Final</Label>
                                    <Input mask='DATE' value={dateF} setValue={setdateF} />
                                </Column>
                                <Pressable onPress={() => { refetch(); console.log(isLoading); console.log('reftch') }} style={{ backgroundColor: colors.color.primary, borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: 62, height: 62, marginTop: 20 }}>
                                    <Search color='#FFF' />
                                </Pressable>
                            </Row> */
const Charts = ({ data }) => {
    if (!data) return null;
    const meses = data.meses;

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

    return (
        <Column gv={20} mh={26}>
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
