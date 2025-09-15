import React, { useState } from 'react';
import { Main, ScrollVertical, Column, Row, Title, HeadTitle, Label, colors, SCREEN_WIDTH, useFetch } from '@/ui';
import { useUser } from '@/context/user';
import { Pressable } from 'react-native';
import { GitCompareArrows, Menu, PieChart as Pie, Users, ChevronRight, ScanText, LayoutGrid, Truck, LayoutList, Bell } from 'lucide-react-native';

import { MotiView } from 'moti';
import { StoreService } from '../../../services/store';

const FadeUp = ({ children, delay = 200 }) => {
    return (
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', delay: delay }}>
            {children}
        </MotiView>
    )
}

export default function HomeScreen({ navigation, }) {
    const { user, role } = useUser();
    const greatings = () => {
        const date = new Date();
        const hour = date.getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    }

    const { data: store, isLoading, refetch } = useFetch({
        key: 'store',
        fetcher: async () => {
            const res = await StoreService.list();
            return res.stores[0];
        },
    }) 

    return (
        <Main>
            <ScrollVertical style={{ zIndex: 2, }}>
                <Column ph={26} gv={16} pv={16}>
                    <Row justify='space-between'>
                        <Pressable onPress={() => { navigation.toggleDrawer() }} style={{ width: 48, height: 48, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 100, }}>
                            <Menu color='#8A8A8A' size={24} />
                        </Pressable>

                        <Row gh={12}>
                            <Pressable onPress={() => { navigation.navigate('NotifyList') }} style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 100, }}>
                                <Bell color="#505050" size={24} />
                            </Pressable>
                            <Pressable onPress={() => { navigation.navigate('Profile') }} style={{ backgroundColor: colors.color.primary, width: 46, height: 46, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
                                <Title size={20} style={{ marginTop: 4, }} color='#fff'>{user?.name?.slice(0, 1)}</Title>
                            </Pressable>
                        </Row>
                    </Row>
                    <Row justify='space-between' align='center' style={{ width: SCREEN_WIDTH - 50, }}>
                        <Column>
                            <FadeUp>
                                <HeadTitle size={24}>{greatings()},</HeadTitle>
                            </FadeUp>
                            <FadeUp delay={500}>
                                <HeadTitle fontFamily="Font_Bold" mt={-5}>{user?.name}</HeadTitle>
                            </FadeUp>
                        </Column>

                    </Row>
                    <FadeUp delay={700}>
                        <Column gv={16}>
                            <HeadTitle size={24} mt={12}>Sua loja</HeadTitle>
                            <Pressable style={{ backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 6 }} onPress={() => navigation.navigate("StoreSelect")}>
                                {isLoading ? <Label>Carregando...</Label> :
                                    <Row align="center" justify='space-between'>
                                        <Column gv={4}>
                                            <Title size={18}>{store?.name}</Title>
                                            <Label size={12}>LOJA SELECIONADA</Label>
                                        </Column>
                                        {role != 'regular' && <ChevronRight color="#484848" size={24} />}
                                    </Row>}
                            </Pressable>
                            <Row justify='space-between' gh={12}>
                                <Pressable onPress={() => { navigation.navigate('MoveAdd') }} style={{ paddingHorizontal: 16, paddingVertical: 24, flexGrow: 1, borderRadius: 12, rowGap: 12, backgroundColor: '#FFF', }}>
                                    <GitCompareArrows size={24} color='#FFB238' />
                                    <Title size={16} fontFamily="Font_Book" color='#505050'>Criar {'\n'}Movimentação</Title>
                                </Pressable>
                                <Pressable onPress={() => { navigation.navigate('AI') }} style={{ paddingHorizontal: 16, paddingVertical: 24, flexGrow: 2, borderRadius: 12, rowGap: 12, backgroundColor: '#fff', }}>
                                    <ScanText size={24} color='#3590F3' />
                                    <Title size={16} fontFamily="Font_Book" color='#505050' >Inteligência {'\n'}Artificial</Title>
                                </Pressable>
                            </Row>
                        </Column>
                    </FadeUp>
                    <FadeUp delay={700}>
                        <HeadTitle size={24} mt={12}>Confira também</HeadTitle>
                        <Column style={{ height: 12 }} />
                        <Row justify='space-between' gh={12}>
                            <Pressable onPress={() => { navigation.navigate('SupplierAdd') }} style={{ paddingHorizontal: 16, paddingVertical: 24, flexGrow: 1, borderRadius: 12, rowGap: 12, backgroundColor: '#fff', }}>
                                <Truck size={24} color='#43AA8B' />
                                <Title size={16} fontFamily="Font_Book" color='#505050'>Adicionar {'\n'}Fornecedor</Title>
                            </Pressable>
                            {role != 'regular' && <Pressable onPress={() => { navigation.navigate('ReportList') }} style={{ paddingHorizontal: 16, paddingVertical: 24, flexGrow: 1, borderRadius: 12, rowGap: 12, backgroundColor: '#fff', }}>
                                <Pie size={24} color='#9747FF' />
                                <Title size={16} fontFamily="Font_Book" color='#505050'>Acessar {'\n'}Relatórios   </Title>
                            </Pressable>}
                        </Row>
                        <Column style={{ height: 12 }} />
                        <Row justify='space-between' gh={12}>
                            <Pressable onPress={() => { navigation.navigate('ProductAdd') }} style={{ paddingHorizontal: 16, paddingVertical: 24, flexGrow: 1, borderRadius: 12, rowGap: 12, backgroundColor: '#fff', }}>
                                <LayoutGrid size={24} color='#EA1E2C' />
                                <Title size={16} fontFamily="Font_Book" color='#505050'>Adicionar {'\n'}Produto</Title>
                            </Pressable>
                            <Pressable onPress={() => { navigation.navigate('CategoryAdd') }} style={{ paddingHorizontal: 16, paddingVertical: 24, flexGrow: 1, borderRadius: 12, rowGap: 12, backgroundColor: '#fff', }}>
                                <LayoutList size={24} color='#3590F3' />
                                <Title size={16} fontFamily="Font_Book" color='#505050'>Adicionar {'\n'}Categoria</Title>
                            </Pressable>
                        </Row>
                    </FadeUp>
                </Column>
            </ScrollVertical>
        </Main>
    )
}

/*
const StoreCards = ({ store }) => {

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["home store report cards"],
        queryFn: async () => {
            const res = await showReportStore(store.id); return res;
        },
        enabled: false,
    });

    useEffect(() => {
        if (store) {
            refetch();
        }
    }, [store])

    if (!data) return null;
    const { funcionarios, produtos, fornecedores } = data;
    return (
        <Row gh={6} pv={12} ph={12} justify="space-between" style={{ backgroundColor: '#fff', borderRadius: 12, }}>
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
    )
}
const Items = ({ store }) => {

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["home store report"],
        queryFn: async () => {
            const res = await showReportStore(store.id); return res;
        },
        enabled: false,
    });

    useEffect(() => {
        if (store) {
            refetch();
        }
    }, [store])



    if (!data) return null;
    const navigation = useNavigation();
    const Card = ({ item }) => {
        const { nome, id, status } = item;
        const { entrada_saida_porcentagem, estoque_porcentagem, } = item.meses[2]

        const porcentagem1 = parseFloat(entrada_saida_porcentagem.toString().replace(',', '.'));
        const porcentagem2 = parseFloat(estoque_porcentagem.toString().replace(',', '.'));

        const ocupacao = 100 - porcentagem2
        const entradaxsaida = 100 - porcentagem1

        const pieData = [
            { value: ocupacao, color: '#3590F3' },
            { value: porcentagem2, color: '#EA1E2C' },
        ];
        const pieData2 = [
            { value: porcentagem1, color: '#43AA8B' },
            { value: entradaxsaida, color: '#FFB238' },
        ];

        if (isLoading) return <Loader size={32} color={colors.color.primary} />
        return (
            <Pressable onPress={() => { navigation.navigate('ReportSingle', { id: id }) }} style={{ backgroundColor: '#FFF', borderRadius: 8, paddingBottom: 20, paddingTop: 20, }}>
                <Row justify="space-between" ph={20} mb={20} >
                    <Column>
                        <Label size={12}>Loja • {status}</Label>
                        <Title size={16}>{nome}</Title>
                    </Column>
                    <ChevronRight color={colors.color.primary} />
                </Row>
                <Row ph={20} justify='space-between'>
                    <Column gv={6}>
                        <Row gh={8}>
                            <Column style={{ width: 16, height: 16, backgroundColor: '#43AA8B', }} />
                            <Label size={14} color='#43AA8B'>Entrada</Label>
                        </Row>
                        <Row gh={8}>
                            <Column style={{ width: 16, height: 16, backgroundColor: '#FFB238', }} />
                            <Label size={14} color='#FFB238'>Saída</Label>
                        </Row>
                        <Row gh={8}>
                            <Column style={{ width: 16, height: 16, backgroundColor: '#3590F3', }} />
                            <Label size={14} color='#3590F3'>Estoque</Label>
                        </Row>
                        <Row gh={8}>
                            <Column style={{ width: 16, height: 16, backgroundColor: '#EA1E2C', }} />
                            <Label size={14} color='#EA1E2C'>Ocupação</Label>
                        </Row>
                    </Column>
                    <Row gh={12}>
                        <PieChart
                            donut
                            isAnimated
                            radius={40}
                            innerRadius={30}
                            data={pieData2}
                            centerLabelComponent={() => {
                                return <Title size={16} color={porcentagem1 > 50 ? '#43AA8B' : '#FFB238'} style={{ lineHeight: 20, }}>{porcentagem1.toFixed(0)}%</Title>;
                            }}
                        />
                        <PieChart
                            donut
                            isAnimated
                            radius={40}
                            innerRadius={30}
                            data={pieData}
                            centerLabelComponent={() => {
                                return <Title size={16} color={porcentagem2 > 50 ? '#EA1E2C' : '#3590F3'} style={{ lineHeight: 20, }}>{porcentagem2.toFixed(0)}%</Title>;
                            }}
                        />
                    </Row>
                </Row>
            </Pressable>
        )
    }
    return (
        <Column>
            <Card item={data} />
        </Column>
    )
}
    import { showReportStore } from '@/api/report';
import { PieChart } from "react-native-gifted-charts";
*/