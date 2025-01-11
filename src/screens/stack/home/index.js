import React from 'react';
import { Main, ScrollVertical, Column, Row, Title, HeadTitle, Image, Label, useQuery, colors, } from '@/ui';
import { useUser } from '@/context/user';
import { Pressable } from 'react-native';
import { GitCompareArrows, Menu, PieChart as Pie, Users, ChevronRight, ScanText } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { listReportStore } from '@/api/report';
import { FlatList } from 'react-native';
import { PieChart } from "react-native-gifted-charts";

export default function HomeScreen({ navigation, }) {

    const { user } = useUser();

    const greatings = () => {
        const date = new Date();
        const hour = date.getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    }

    const { data, isLoading } = useQuery({
        queryKey: ["stores report"],
        queryFn: async () => {
            const res = await listReportStore(); return res.data;
        }
    });
    return (
        <Main >
            <ScrollVertical>
                <Column ph={26} gv={16} pv={16}>
                    <Row justify='space-between'>
                        <Pressable onPress={() => {navigation.toggleDrawer()}}  style={{ width: 48, height: 48, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 100, }}>
                            <Menu color='#8A8A8A' size={24} />
                        </Pressable>
                        <Image src={require('@/imgs/logo_red.png')} w={64} h={64} />
                    </Row>

                    <Column mb={12}>
                        <HeadTitle>{greatings()},</HeadTitle>
                        <HeadTitle fontFamily="Font_Bold" mt={-5}>{user?.name}</HeadTitle>
                    </Column>

                    <Row justify='space-between' gh={12}>
                        <Pressable onPress={() => {navigation.navigate('MoveAdd')}}  style={{ padding: 16, flexGrow: 1, borderRadius: 12, rowGap: 12,backgroundColor: '#FFF0D7',}}>
                            <GitCompareArrows size={32} color='#FFB238' />
                            <Title size={16} fontFamily="Font_Medium" color='#FFB238'>Criar {'\n'}Movimentação</Title>
                        </Pressable>
                        <Pressable onPress={() => {navigation.navigate('AI')}}  style={{ padding: 16, flexGrow: 2, borderRadius: 12, rowGap: 12,backgroundColor: '#D7E9FD',}}>
                            <ScanText size={32} color='#3590F3' />
                            <Title size={16} fontFamily="Font_Medium" color='#3590F3'>Escanear {'\n'}Documento</Title>
                        </Pressable>
                    </Row>
                    <Items data={data?.slice(0, 1)} />
                    
                    <HeadTitle size={24} mt={12}>Confira também</HeadTitle>
                    <Row justify='space-between' gh={12}>
                        <Pressable onPress={() => {navigation.navigate('UserAdd')}}  style={{ padding: 16, flexGrow: 1, borderRadius: 12, rowGap: 12,backgroundColor: '#D9EEE8',}}>
                            <Users size={32} color='#43AA8B' />
                            <Title size={16} fontFamily="Font_Medium" color='#43AA8B'>Adicionar {'\n'}Usuário</Title>
                        </Pressable>
                        <Pressable onPress={() => {navigation.navigate('ReportList')}}  style={{ padding: 16, flexGrow: 1, borderRadius: 12, rowGap: 12,backgroundColor: '#EADAFF',}}>
                            <Pie size={32} color='#9747FF' />
                            <Title size={16} fontFamily="Font_Medium" color='#9747FF'>Acessar {'\n'}Relatórios</Title>
                        </Pressable>
                    </Row>
                </Column>
            </ScrollVertical>
        </Main>
    )
}


const Items = ({ data }) => {
    if(!data) return null;
    const navigation = useNavigation();
    const Card = ({ item }) => {
        const { nome_loja, id, entrada, saida, entrada_saida_porcentagem, estoque_maximo, estoque_ocupado, estoque_porcentagem, status } = item;
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
        return (
            <Pressable onPress={() => { navigation.navigate('ReportSingle', { id: id }) }} style={{ backgroundColor: '#FFF', borderRadius: 8,   paddingBottom: 20, paddingTop: 20,}}>
                <Row justify="space-between" ph={20} mb={20} >
                    <Column>
                        <Label size={12}>Loja • {status}</Label>
                        <Title size={16}>{nome_loja}</Title>
                    </Column>
                    <ChevronRight color={colors.color.primary} />
                </Row>
                <Row ph={20} justify='space-between'>
                    <Column gv={6}>
                        <Row gh={8}>
                            <Column style={{ width: 16, height: 16, backgroundColor: '#43AA8B', }} />
                            <Label size={14} color='#43AA8B'>Saídas</Label>
                        </Row>
                        <Row gh={8}>
                            <Column style={{ width: 16, height: 16, backgroundColor: '#FFB238', }} />
                            <Label size={14} color='#FFB238'>Perdas</Label>
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
            <FlatList
                data={data}
                renderItem={({ item }) => <Card item={item} />}
                keyExtractor={item => item.id}
            />
        </Column>
    )
}