import React from 'react';
import { Main, ScrollVertical, Column, Row, Title, Label, colors, Icon, Pressable, Image, Button } from '@/ui';
import { useUser } from '@/context/user';
import { MotiView } from 'moti';
import { useTheme } from '@/hooks/useTheme';
import { useTutorial } from '@/hooks/useTutorial';
import { useToast } from '@/hooks/useToast';
import { View } from 'react-native';
import Svg, { Defs, Pattern, Line, Path, Text as SvgText } from 'react-native-svg';
import { useEffect } from 'react';

const FadeUp = ({ children, delay = 200 }) => {
    return (
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', delay: delay }}>
            {children}
        </MotiView>
    )
}

import {
    CopilotStep,
    walkthroughable,
    useCopilot,
} from "react-native-copilot";

const CopilotPressable = walkthroughable(Pressable);


export default function HomeScreen({ navigation, }) {
    const { user } = useUser();
    const theme = colors();
    const { start: startCopilot, stop: stopCopilot, currentStep, visible } = useCopilot();
    
    const greatings = () => {
        const date = new Date();
        const hour = date.getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    }

    const { mode, toggleTheme } = useTheme();
    const { isNotStarted, isInProgress, startTutorial, completeTutorial } = useTutorial();
    const toast = useToast();

    const handleToggleTheme = () => {
        toggleTheme();
        toast.showSuccess('Tema alterado com sucesso! Reinicie a aplicação para ver as alterações.')
    }

    const handleStartTutorial = () => {
        startTutorial();
        startCopilot();
    }

    const handleSkipTutorial = () => {
        completeTutorial();
        toast.showSuccess('Tutorial marcado como completo. Você pode reiniciá-lo nas configurações.');
    }

    const handleTutorialEnd = () => {
        completeTutorial();
        toast.showSuccess('Tutorial concluído! Agora você conhece as principais funcionalidades do sistema.');
    }

    // Detectar quando o tutorial do copilot termina
    useEffect(() => {
        // Quando o tutorial estava visível e agora não está mais, significa que terminou
        if (isInProgress && !visible && currentStep === null) {
            handleTutorialEnd();
        }
    }, [visible, currentStep, isInProgress]);


    return (
        <Main style={{ backgroundColor: theme.color.background }}>
            <ScrollVertical style={{ zIndex: 2, }}>
                <Column gv={12} pv={16}>
                    <Row ph={26} justify='space-between'>
                        <CopilotStep text="Este é o menu principal. Aqui você pode acessar todas as funcionalidades do sistema." order={1} name="menu">
                            <CopilotPressable onPress={() => { navigation.toggleDrawer() }} style={{ width: 48, height: 48, backgroundColor: theme.color.foreground, justifyContent: 'center', alignItems: 'center', borderRadius: 100, }}>
                                <Icon name="Menu" color={theme.color.label} size={24} />
                            </CopilotPressable>
                        </CopilotStep>
                        <Row gh={12}>
                            <CopilotStep text="Selecione a loja que você quer gerenciar. Você pode ter múltiplas lojas no sistema." order={2} name="store">
                                <CopilotPressable onPress={() => { navigation.navigate('StoreList') }} style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 100, }}>
                                    <Icon name="Store" color={theme.color.label} size={24} />
                                </CopilotPressable>
                            </CopilotStep>
                            <CopilotStep text="Alterne entre tema claro e escuro para melhor visualização." order={3} name="theme">
                                <CopilotPressable onPress={handleToggleTheme} style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 100, }}>
                                    <Icon name={mode == 'dark' ? 'Sun' : 'Moon'} color={mode == 'dark' ? theme.color.label : theme.color.label} size={24} />
                                </CopilotPressable>
                            </CopilotStep>
                            <CopilotStep text="Visualize suas notificações e alertas importantes aqui." order={4} name="notifications">
                                <CopilotPressable onPress={() => { navigation.navigate('NotifyList') }} style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 100, }}>
                                    <Icon name="Bell" color={theme.color.label} size={24} />
                                </CopilotPressable>
                            </CopilotStep>
                            <CopilotStep text="Acesse seu perfil e configurações pessoais." order={5} name="profile">
                                <CopilotPressable onPress={() => { navigation.navigate('Profile') }} style={{ width: 46, height: 46, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
                                    <Icon name="User" color={theme.color.label} size={24} />
                                </CopilotPressable>
                            </CopilotStep>
                        </Row>
                    </Row>

                    <FadeUp delay={500}>
                        <Column ph={26}>
                            <Title fontFamily="Font_Book" size={24}>{greatings()},</Title>
                            <Title fontFamily="Font_Bold" mt={-5}>{user?.name}</Title>
                        </Column>
                    </FadeUp>

                    {!isNotStarted && (
                        <FadeUp delay={700}>
                            <Column ph={26} gv={12}>
                                <Label size={18} mt={12}>Primeiros passos</Label>
                                <Column pv={16} ph={16} style={{ backgroundColor: theme.color.foreground, borderRadius: 8, overflow: 'hidden' }}>
                                    <Row justify='space-between' align='center'>
                                        <Column gv={12} style={{ width: 180, }}>
                                            <Column gv={12}>
                                                <Title size={22} spacing={-1}>Comece seu primeiro passo</Title>
                                                <Label size={14}>Descubra como utilizar o sistema rapidamente e sem complicações</Label>
                                            </Column>
                                        </Column>
                                        <Image src={require('@/imgs/tutorial_img.png')} w={124} h={124} />
                                    </Row>
                                    <Column
                                        style={{
                                            height: 2,
                                            backgroundColor: theme.color.border,
                                            flexGrow: 1,
                                        }}
                                        mv={12}
                                    />
                                    <Row gh={12} justify='space-between'>
                                        <Button label="Iniciar tutorial" style={{ flexGrow: 1, }} onPress={handleStartTutorial} variant='default' />
                                        <Button label="Talvez depois" style={{ flexGrow: 1, }} onPress={handleSkipTutorial} variant='ghost' />
                                    </Row>
                                </Column>

                            </Column>
                        </FadeUp>
                    )}

                    <FadeUp delay={700}>
                        <Column ph={26}>
                            <Label size={18} mt={12}>Acesso rápido</Label>
                        </Column>
                        <Column ph={26} mv={12} gv={12}>
                            <Row gh={12} justify='space-between'>
                                <CopilotStep text="Adicione novos produtos ao seu estoque. Aqui você pode cadastrar informações detalhadas como nome, categoria, preço e quantidade." order={6} name="add-product">
                                    <CopilotPressable style={{ borderColor: theme.color.border, borderWidth: 1, flexGrow: 1, paddingHorizontal: 24, paddingVertical: 34, borderRadius: 8, overflow: 'hidden' }} onPress={() => navigation.navigate('ProductAdd')}>
                                        <Title spacing={-1} size={20} fontFamily='Font_Light_Italic' style={{ zIndex: 1000 }}>Adicionar</Title>
                                        <Title spacing={-1} size={22} mt={-4} style={{ width: 100, zIndex: 1000 }}>Produto</Title>
                                        <Image src={require('@/imgs/product_img.png')} w={64} h={64} style={{ position: 'absolute', bottom: 0, right: 0, }} />
                                    </CopilotPressable>
                                </CopilotStep>
                                <CopilotStep text="Organize seus produtos criando categorias. Isso facilita a busca e organização do seu estoque." order={7} name="add-category">
                                    <CopilotPressable style={{ borderColor: theme.color.border, borderWidth: 1, flexGrow: 1, paddingHorizontal: 24, paddingVertical: 34, borderRadius: 8, overflow: 'hidden' }} onPress={() => navigation.navigate('CategoryAdd')}>
                                        <Title spacing={-1} size={20} fontFamily='Font_Light_Italic' style={{ zIndex: 1000 }}>Adicionar</Title>
                                        <Title spacing={-1} size={22} mt={-4} style={{ width: 100, zIndex: 1000 }}>Categoria</Title>
                                        <Image src={require('@/imgs/category_img.png')} w={64} h={64} style={{ position: 'absolute', bottom: 0, right: 0, }} />
                                    </CopilotPressable>
                                </CopilotStep>
                            </Row>
                            <Row gh={12} justify='space-between'>
                                <CopilotStep text="Cadastre seus fornecedores para manter um controle completo da sua cadeia de suprimentos." order={8} name="add-supplier">
                                    <CopilotPressable style={{ borderColor: theme.color.border, borderWidth: 1, flexGrow: 1, paddingHorizontal: 24, paddingVertical: 34, borderRadius: 8, overflow: 'hidden' }} onPress={() => navigation.navigate('SupplierAdd')}>
                                        <Title spacing={-1} size={20} fontFamily='Font_Light_Italic' style={{ zIndex: 1000 }}>Adicionar</Title>
                                        <Title spacing={-1} size={20} mt={-4} style={{ width: 100, zIndex: 1000 }}>Fornecedor</Title>
                                        <Image src={require('@/imgs/supplier_img.png')} w={64} h={64} style={{ position: 'absolute', bottom: 0, right: 0, }} />
                                    </CopilotPressable>
                                </CopilotStep>
                                <CopilotStep 
                                    text="Configure alertas para ser notificado quando produtos estiverem com estoque baixo ou quando precisar fazer pedidos. Este é o último passo do tutorial!" 
                                    order={9} 
                                    name="add-alert"
                                >
                                    <CopilotPressable style={{ borderColor: theme.color.border, borderWidth: 1, flexGrow: 1, paddingHorizontal: 24, paddingVertical: 34, borderRadius: 8, overflow: 'hidden' }} onPress={() => navigation.navigate('MoveAdd')}>
                                        <Title spacing={-1} size={20} fontFamily='Font_Light_Italic' style={{ zIndex: 1000 }}>Adicionar</Title>
                                        <Title spacing={-1} size={22} style={{ width: 100, zIndex: 1000 }} mt={-4}>Movimentação</Title>
                                        <Image src={require('@/imgs/report_img.png')} w={64} h={64} style={{ position: 'absolute', bottom: 0, right: 0, }} />
                                    </CopilotPressable>
                                </CopilotStep>
                            </Row>
                        </Column>
                    </FadeUp>

                    <FadeUp delay={1000}>
                        <Column ph={26} gv={12}>
                            <Label size={18}>Visão geral</Label>
                        </Column>
                    </FadeUp>

                </Column>

            </ScrollVertical>
        </Main>
    )
}


const MostMovements = () => {
    const theme = colors();
    return (
        <Column gv={12} style={{ borderColor: theme.color.border, borderWidth: 1, borderRadius: 8, padding: 12 }}>
            <Title size={18}>Produtos Mais Movimentados da semana</Title>

            <Column gv={8}>
                <Row justify='space-between'>
                    <Label size={12}>Piso  Vinílico Lavável Madeira</Label>
                    <Row gh={8}>
                        <Label color={theme.color.primary} size={12}>32 unidades</Label>
                        <Label size={12}>/  44 unidades</Label>
                    </Row>
                </Row>
                <Column style={{ flexGrow: 1, borderColor: '#CDD7D3', borderWidth: 1, height: 14, borderRadius: 100, overflow: 'hidden' }}>
                    <View style={{
                        width: '32%',
                        backgroundColor: theme.color.primary,
                        height: 12,
                        borderRadius: 100,
                        position: 'relative',
                        zIndex: 1000,
                    }} />

                    <Svg height="12" width="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                        <Defs>
                            <Pattern id="crossPattern" patternUnits="userSpaceOnUse" width="8" height="8">
                                <Line x1="8" y1="0" x2="0" y2="8" stroke='#CDD7D3' strokeWidth="2" />
                            </Pattern>
                        </Defs>
                        <rect width="100%" height="100%" fill="url(#crossPattern)" />
                    </Svg>
                </Column>
            </Column>

            <Column gv={8}>
                <Row justify='space-between'>
                    <Label size={12}>Piso  Vinílico Lavável Madeira</Label>
                    <Row gh={8}>
                        <Label color={theme.color.primary} size={12}>32 unidades</Label>
                        <Label size={12}>/  44 unidades</Label>
                    </Row>
                </Row>
                <Column style={{ flexGrow: 1, borderColor: '#CDD7D3', borderWidth: 1, height: 14, borderRadius: 100, overflow: 'hidden' }}>
                    <View style={{
                        width: '32%',
                        backgroundColor: theme.color.primary,
                        height: 12,
                        borderRadius: 100,
                        position: 'relative',
                        zIndex: 1000,
                    }} />

                    <Svg height="12" width="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                        <Defs>
                            <Pattern id="crossPattern" patternUnits="userSpaceOnUse" width="8" height="8">
                                <Line x1="8" y1="0" x2="0" y2="8" stroke='#CDD7D3' strokeWidth="2" />
                            </Pattern>
                        </Defs>
                        <rect width="100%" height="100%" fill="url(#crossPattern)" />
                    </Svg>
                </Column>
            </Column>


        </Column>
    )
}

const CategoryChart = () => {
    const theme = colors();
    return (
        <Column gv={12} style={{ borderColor: theme.color.border, borderWidth: 1, borderRadius: 8, padding: 12 }}>
            <Title size={16}>Concentração de Produtos por Categoria</Title>
            <Row gh={12} align='center'>
                <PieChart />
                <Legend />
            </Row>
        </Column>
    )
}

const PieChart = () => {
    const theme = colors();
    const size = 120;
    const radius = 50;
    const innerRadius = 30;
    const gap = 2; // Espaçamento entre arcos em graus

    // Dados baseados na imagem
    const data = [
        { value: 45, color: '#43AA8B', label: 'Categoria A' },
        { value: 32, color: '#FFB238', label: 'Categoria B' },
        { value: 15, color: '#3590F3', label: 'Categoria C' },
        { value: 8, color: '#9747FF', label: 'Categoria D' }
    ];

    let cumulativeAngle = 0;

    const createArcPath = (startAngle, endAngle, innerR, outerR) => {
        const centerX = size / 2;
        const centerY = size / 2;

        // Converter ângulos para radianos e ajustar para começar do topo
        const startAngleRad = (startAngle - 90) * Math.PI / 180;
        const endAngleRad = (endAngle - 90) * Math.PI / 180;

        // Pontos externos
        const x1 = centerX + outerR * Math.cos(startAngleRad);
        const y1 = centerY + outerR * Math.sin(startAngleRad);
        const x2 = centerX + outerR * Math.cos(endAngleRad);
        const y2 = centerY + outerR * Math.sin(endAngleRad);

        // Pontos internos
        const x3 = centerX + innerR * Math.cos(endAngleRad);
        const y3 = centerY + innerR * Math.sin(endAngleRad);
        const x4 = centerX + innerR * Math.cos(startAngleRad);
        const y4 = centerY + innerR * Math.sin(startAngleRad);

        const largeArcFlag = endAngle - startAngle > 180 ? "1" : "0";

        return [
            "M", x1, y1,
            "A", outerR, outerR, 0, largeArcFlag, 1, x2, y2,
            "L", x3, y3,
            "A", innerR, innerR, 0, largeArcFlag, 0, x4, y4,
            "Z"
        ].join(" ");
    };

    return (
        <Svg width={size} height={size}>
            {data.map((segment, index) => {
                const startAngle = cumulativeAngle;
                const endAngle = cumulativeAngle + (segment.value * 3.6); // 3.6 graus por 1%
                cumulativeAngle = endAngle + gap; // Adiciona gap após cada segmento

                return (
                    <Path
                        key={index}
                        d={createArcPath(startAngle, endAngle, innerRadius, radius)}
                        fill={segment.color}
                    />
                );
            })}
        </Svg>
    );
};

const Legend = () => {
    const theme = colors();
    const data = [
        { color: '#43AA8B', label: 'Categoria A' },
        { color: '#FFB238', label: 'Categoria B' },
        { color: '#3590F3', label: 'Categoria C' },
        { color: '#9747FF', label: 'Categoria D' }
    ];

    return (
        <Column gv={8}>
            {data.map((item, index) => (
                <Row key={index} gh={8} align='center'>
                    <View style={{
                        width: 12,
                        height: 12,
                        backgroundColor: item.color,
                        borderRadius: 2
                    }} />
                    <Label size={12}>{item.label}</Label>
                </Row>
            ))}
        </Column>
    );
};

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