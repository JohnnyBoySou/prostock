import React, { useState } from "react";
import { Main, Row, Loader, colors, Title, Column, Label, useQuery, Input, } from "@/ui";
import { ChevronRight,  Search} from "lucide-react-native";
import { FlatList } from 'react-native';
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { listReportStore } from '@/api/report';
import { PieChart } from "react-native-gifted-charts";

export default function ReportListScreen() {

    const dateNow = new Date().toLocaleDateString('pt-BR');
    const [dateC, setdateC] = useState('01/01/2025');
    const [dateF, setdateF] = useState(dateNow);
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["stores report"],
        queryFn: async () => {
            const res = await listReportStore(1, dateC, dateF); return res.data;
        }
    });
    return (
        <Main>
            {isLoading ? <Column style={{ flex: 1, }} justify="center" align='center'>
                <Loader size={32} color={colors.color.primary} />
            </Column>
                :
                <Column style={{ flex: 1 }}>
                  
                    <Items data={data} header={
                          <Column gv={16} mv={12} mh={26}>
                          <Title size={24}>Filtrar por data</Title>
                          <Row gh={8}>
                              <Column>
                                  <Label style={{ zIndex: 2, marginBottom: -20 }}>Começo</Label>
                                  <Input mask='DATE' value={dateC} setValue={setdateC} />
                              </Column>
                              <Column>
                                  <Label style={{ zIndex: 2, marginBottom: -20 }}>Final</Label>
                                  <Input mask='DATE' value={dateF} setValue={setdateF} onSubmitEditing={() => {refetch()}} />
                              </Column>
                              <Pressable onPress={() => { refetch();  }} style={{ backgroundColor: colors.color.primary, borderRadius: 8, justifyContent: 'center', alignItems: 'center', width: 62, height: 62, marginTop: 20 }}>
                                  <Search color='#FFF' />
                              </Pressable>
                          </Row>
                      </Column>
                    }/>
                </Column>
            }
        </Main>)
}

const Items = ({ data, header }) => {
    if(!data) return null;
    const navigation = useNavigation();
    const Card = ({ item }) => {
        if(!item) return null;
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
            <Pressable onPress={() => { navigation.navigate('ReportSingle', { id: id }) }} style={{ backgroundColor: '#FFF', borderRadius: 8, marginVertical: 12, marginHorizontal: 26,  paddingBottom: 20, paddingTop: 20,}}>
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
        <Column >
            <FlatList
                style={{ paddingTop: 12, }}
                data={data}
                renderItem={({ item }) => <Card item={item} />}
                keyExtractor={item => item.id}
                ListFooterComponent={<Column pv={40} />}
                ListHeaderComponent={header}
            />
        </Column>
    )
}
