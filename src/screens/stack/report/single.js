import { useState, useRef, useCallback, useEffect } from "react";
import { Main, Row, Loader, colors, Title, Column, Label, useQuery, ScrollVertical, Button, Input, ListSearchStore, ListSearch } from "@/ui";
import { Calendar1, Check, ChevronRight, LayoutGrid, Search, Truck, Users, } from "lucide-react-native";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { showReportStore, showReportProductLine, } from '@/api/report';
import { BarChart, LineChart } from "react-native-gifted-charts";
import { ProductEmpty } from '@/ui/Emptys/product';
import BottomSheet, { BottomSheetScrollView, TouchableOpacity } from '@gorhom/bottom-sheet';
import { SupplierEmpty } from '@/ui/Emptys/supplier';
import { listSupplierStore, listSupplierStoreSearch } from "@/api/supplier";
import { listProductStore, listProductStoreSearch } from "@/api/product";

export default function ReportSingleScreen({ route }) {
    const id = route.params.id;
    const dateNow = new Date().toLocaleDateString('pt-BR');
    const dateMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString('pt-BR');
    const [dateC, setdateC] = useState(dateMonth);
    const [dateF, setdateF] = useState(dateNow);

    const [tab, settab] = useState('Saída');
    const types = [{ name: 'Saída', color: '#3590F3' }, { name: 'Entrada', color: '#019866' }, { name: 'Perdas', color: '#FFB238' }];
    const [fornecedor, setfornecedor] = useState(null);
    const [produto, setproduto] = useState(null);
    const { data, isLoading, } = useQuery({
        queryKey: ["stores report single", id],
        queryFn: async () => {
            const res = await showReportStore(id, fornecedor); return res;
        }
    });
    const { data: line, isLoading: loadingLine, refetch: searchChart } = useQuery({
        queryKey: ["stores report daylist single", id, fornecedor, tab, dateC, dateF],
        queryFn: async () => {
            const res = await showReportProductLine(produto, id, fornecedor, dateC, dateF, tab);
            return res;
        },
        enabled: false,
    });

    const { data: perdas, isLoading: loadingPerdas, } = useQuery({
        queryKey: ["stores perdas"],
        queryFn: async () => {
            const res = await showReportProductLine(null, id, null, dateMonth, dateNow, 'Perdas');
            return res;
        }
    });
    const { data: entradas, isLoading: loadingEntradas, } = useQuery({
        queryKey: ["stores entradas"],
        queryFn: async () => {
            const res = await showReportProductLine(null, id, null, dateMonth, dateNow, 'Entrada');
            return res;
        }
    });
    const { data: saidas, isLoading: loadingSaidas, } = useQuery({
        queryKey: ["stores saidas"],
        queryFn: async () => {
            const res = await showReportProductLine(null, id, null, dateMonth, dateNow, 'Saída');
            return res;
        }
    });

    const bottomSheetRef = useRef(null);
    return (
        <Main>
            {isLoading ? <Column style={{ flex: 1, }} justify="center" align='center'>
                <Loader size={32} color={colors.color.primary} />
            </Column>
                :
                <Column style={{ flex: 1, }}>
                    <ScrollVertical >
                        <Store item={data} />
                        {line && <ResultCharts line={line} tab={tab} />}
                        {!line && <SingleCharts data={data} tab={tab} line={line} saidas={saidas} entradas={entradas} perdas={perdas} />}
                    </ScrollVertical>
                </Column>
            }
            <Pressable
                onPress={() => bottomSheetRef.current?.expand()}
                style={{ paddingHorizontal: 24, columnGap: 12, alignItems: 'center', flexDirection: 'row', position: 'absolute', alignSelf: 'center', bottom: 60, height: 56, borderRadius: 8, backgroundColor: colors.color.primary, justifyContent: 'center', alignItems: 'center', }}>
                <Label color='#fff' size={18} fontFamily='Font_Medium'>Gerar relatório</Label>
            </Pressable>

            <BottomSheet ref={bottomSheetRef} snapPoints={[0.1, '100%']} index={-1} backgroundStyle={{ backgroundColor: '#f1f1f1' }} >
                <BottomSheetScrollView >
                    <Column gv={16} mv={12}>

                        <Column mh={26}>
                            <Title size={18}>Filtrar por tipo</Title>
                            <Row gh={12} mv={12}>
                                {types.map((item, index) => (
                                    <TouchableOpacity style={{ backgroundColor: tab == item.name ? item.color : item.color + 20, padding: 12, borderRadius: 6, }} onPress={() => { settab(item.name) }} >
                                        <Label style={{ color: tab == item.name ? '#fff' : item.color, fontSize: 18, fontWeight: 500, marginTop: 4, fontFamily: 'Font_Medium' }}>{item.name}</Label>
                                    </TouchableOpacity>
                                ))}
                            </Row>
                        </Column>

                        <Column mh={26}>
                            <Title size={18}>Filtrar por data</Title>
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
                            <Title size={18} style={{ marginBottom: -12, marginTop: 12, }}>Filtrar por fornecedor</Title>
                        </Column>
                        <Suppliers setfornecedor={setfornecedor} fornecedor={fornecedor} lojaid={id} dateC={dateC} dateF={dateF} />
                        <Products lojaid={id} setproduto={setproduto} produto={produto} />
                    </Column>

                </BottomSheetScrollView>
                <Pressable onPress={() => { bottomSheetRef?.current?.close(); searchChart(); }} style={{ backgroundColor: colors.color.primary, borderRadius: 8, position: 'absolute', bottom: 30, justifyContent: 'center', alignItems: 'center', height: 56, left: 26, right: 26, }}>
                    <Label color='#fff' fontFamily='Font_Medium' size={18}>Gerar agora</Label>
                </Pressable>
            </BottomSheet>
        </Main>)
}

const Store = ({ item, }) => {
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

const Products = ({ lojaid, setproduto, produto }) => {
    const Card = ({ item }) => {
        const { nome, status, unidade, id, estoque_maximo, estoque_minimo, } = item;
        return (
            <TouchableOpacity onPress={() => { setproduto(id); }} style={{ backgroundColor: '#FFF', borderColor: produto == id ? colors.color.blue : '#fff', borderWidth: 3, borderRadius: 8, marginVertical: 12, }}>
                <Row pv={20} justify="space-between" ph={20} >
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome} ({unidade})</Title>
                        <Label>{status} • Mín {estoque_minimo} • Máx {estoque_maximo}</Label>
                    </Column>
                    <Column style={{ width: 42, height: 42, backgroundColor: produto == id ? colors.color.blue : '#fff', borderRadius: 100, }} align='center' justify='center' >
                        <Check color='#fff' />
                    </Column>
                </Row>
            </TouchableOpacity>
        )
    }
    return (
        <Column>
            <Column mh={26} pt={12}>
                <Title size={18}>Filtrar por produtos</Title>
            </Column>
            <ListSearchStore
                id={lojaid}
                refresh={false}
                name='products report'
                spacing={true}
                renderItem={({ item }) => <Card item={item} />}
                empty={<ProductEmpty />}
                getSearch={listProductStoreSearch}
                getList={listProductStore} />
        </Column>
    )
}

const Suppliers = ({ lojaid, setfornecedor, fornecedor }) => {
    const Card = ({ item }) => {
        if (!item) return null;
        const { id, status, cidade, nome_fantasia, } = item;
        return (
            <TouchableOpacity onPress={() => { setfornecedor(fornecedor === id ? '' : id) }} >
                <Row pv={16} justify="space-between" ph={12} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8, borderWidth: 3, borderColor: fornecedor == id ? colors.color.blue : '#fff' }}>
                    <Column gv={6}>
                        <Title size={20} fontFamily='Font_Medium'>{nome_fantasia?.length > 16 ? nome_fantasia?.slice(0, 16) + '...' : nome_fantasia}</Title>
                        <Label>{cidade} • {status} </Label>
                    </Column>
                    <Column style={{ width: 42, height: 42, backgroundColor: fornecedor == id ? colors.color.blue : '#fff', borderRadius: 100, }} align='center' justify='center' >
                        <Check color='#fff' />
                    </Column>
                </Row>
            </TouchableOpacity>
        )
    }
    return (
        <Column>
            <ListSearchStore
                refresh={false}
                id={`${lojaid}`}
                spacing={false}
                name='suppliers report'
                renderItem={({ item }) => <Card item={item} />}
                getSearch={listSupplierStoreSearch}
                getList={listSupplierStore}
                empty={<SupplierEmpty />}
            />
        </Column>
    )
}

const ResultCharts = ({ line, tab }) => {
    if (!line) return null;
    return (
        <Column gv={20} mh={26} mv={20}>
            <Column style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={20} ph={20} gv={32}>
                <Title size={18} align='center'>Resumo dos últimos 30 dias</Title>
                <Column>
                    <Column mb={12}>
                        <Title size={16}>Gráfico de {tab}</Title>
                    </Column>
                    <LineChart
                        data={line}
                        color={'#3590F3'}
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
                </Column>
               
                <Column >
                    <Title size={16}>Tabela</Title>
                <Column style={{ borderRadius: 6, overflow: 'hidden', marginTop: 12, }}>
                    <Row>
                        <Column style={{ width: '40%', backgroundColor: '#000', }} pv={4} justify='center' align='center'>
                            <Label size={16} color='#F1F1F1'>Data</Label>
                        </Column>
                        <Column style={{ width: '60%', backgroundColor: '#30303030', }} pv={4} justify='center' align='center'>
                            <Label size={16} color='#000'>Valor</Label>
                        </Column>
                    </Row>
                    {line?.map((item, index) => {
                        return (
                            <Row key={index}>
                                <Column style={{ width: '40%', backgroundColor: index % 2 ? '#f1f1f1' : '#FFF', }} pv={4} justify='center' align='center'>
                                    <Label size={16}>{item?.label}</Label>
                                </Column>
                                <Column style={{ width: '60%', backgroundColor: index % 2 ? '#fff' : '#f1f1f1', }} pv={4} justify='center' align='center'>
                                    <Label size={16}>{item?.value}</Label>
                                </Column>
                            </Row>
                        )
                    })}
                </Column>
                </Column>
            </Column>
        </Column>
    )
}

const SingleCharts = ({ saidas, entradas, perdas }) => {
    if (!saidas || !entradas || !perdas) return null;
    return (
        <Column gv={20} mh={26} mv={20}>
            <Column style={{ backgroundColor: '#FFF', borderRadius: 8 }} pv={20} ph={20} gv={32}>
                <Title size={18} align='center'>Resumo dos últimos 30 dias</Title>
                <Column>
                    <Column mb={12}>
                        <Title size={16}>Saída de produtos</Title>
                        <Label size={12}>Últimos 30 dias</Label>
                    </Column>
                    <LineChart
                        data={saidas}
                        color={'#3590F3'}
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
                </Column>
                <Column>
                    <Column mb={12}>
                        <Title size={16}>Entrada de produtos</Title>
                        <Label size={12}>Últimos 30 dias</Label>
                    </Column>
                    <LineChart
                        data={entradas}
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
                </Column>
                <Column>
                    <Column mb={12}>
                        <Title size={16}>Perdas de produtos</Title>
                        <Label size={12}>Últimos 30 dias</Label>
                    </Column>
                    <LineChart
                        data={perdas}
                        color={'#FFB238'}
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
                </Column>

            </Column>

        </Column>
    )
}

/*

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

  const ocupacao = [
            { value: estoque_ocupado, label: 'Ocupação', frontColor: '#FF1828' },
            { value: entrada, label: 'Entrada', frontColor: '#019866' },
            { value: saida, label: 'Saida', frontColor: '#3590F3' },
            { value: perdas, label: 'Perdas', frontColor: '#FFB238' }
        ];
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

