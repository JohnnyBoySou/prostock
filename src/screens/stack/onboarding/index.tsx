import React, { useState } from 'react';
import { Main, Column, Title, Label, Button, colors, MultiStep, Image, Pressable, Icon, Row } from "@/ui/index";

const steps = [
    {
        title: 'Controle total do seu estoque',
        description: "Gerencie produtos, categorias e fornecedores de forma simples e prática, tudo em um só lugar.",
        image: require('@/imgs/onboarding_img.png'),
    },
    {
        title: 'Acompanhe movimentações em tempo real',
        description: "Tenha visibilidade imediata das entradas e saídas, evitando perdas e garantindo decisões mais rápidas.",
        image: require('@/imgs/onboarding_img.png'),
    },
    {
        title: 'Relatórios e insights inteligentes',
        description: "Descubra estatísticas úteis para otimizar sua gestão e aumentar a eficiência do seu negócio.",
        image: require('@/imgs/onboarding_img.png'),
    },
]

export default function OnboardingScreen({ navigation }) {

    const [currentStep, setCurrentStep] = useState(0);
    const [action, setAction] = useState<{ action: 'sign-up' | 'sign-in' | null }>({ action: null });
    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            if (action.action === 'sign-up') {
                navigation.navigate('Register');
            } else {
                navigation.navigate('Login');
            }
        }
    }

    const theme = colors();

    return (
        <Main style={{ backgroundColor: theme.color.background }}>
            <Column gv={12} ph={26} pv={40} style={{ flex: 1, }}>
                <Column>
                    <Image src={require('@/imgs/logo_img.png')} w={80} h={80} r={12} />
                    <Image src={require('@/imgs/logo_text_img.png')} w={100} h={24} style={{ marginTop: -8 }} />
                </Column>
                {currentStep > 0 && (<Pressable style={{ position: "absolute", left: 26, top: 54, }} onPress={() => {
                    if (currentStep > 0) {
                        setCurrentStep(currentStep - 1);
                    }
                }}>
                    <Icon name='ChevronLeft' size={24} color={theme.color.text} />
                </Pressable>)}
                {currentStep === steps.length && (
                    <ActionComponent action={action.action} setAction={(action) => setAction({ action })} />
                )}
                {currentStep < steps.length && (
                    <StepComponent step={currentStep} />
                )}
                <Column gv={12} style={{ position: "absolute", bottom: 30, left: 26, right: 26, }}>
                    {currentStep < steps.length && (<MultiStep steps={steps.length} currentStep={currentStep} />)}
                    <Button label='Próximo' variant='tertiary' onPress={nextStep} />
                </Column>
            </Column>
        </Main>
    );
}


const StepComponent = ({ step }: { step: number }) => {
    const theme = colors();
    return (
        <Column gv={12} mv={12} >
            <Column style={{ flexGrow: 1, height: 330, }} justify='center' align='center'>
                <Image src={steps[step].image} w="100%" h={330} r={12} />
            </Column>
            <Column mh={24} gv={16}>
                <Title align='center' size={32} spacing={-1.5}>{steps[step].title}</Title>
                <Label align='center' size={18}>{steps[step].description}</Label>
            </Column>
        </Column>
    )
}

const ActionComponent = ({ action, setAction }: { action: 'sign-up' | 'sign-in', setAction: (action: 'sign-up' | 'sign-in') => void }) => {
    const theme = colors();

    return (
        <Column gv={16}>
            <Column mh={24} gv={16} mv={24}>
                <Title align='center' size={32} spacing={-1.5} style={{ lineHeight: 28}}>Comece agora mesmo</Title>
                <Label align='center' size={18}>Crie sua conta grátis ou faça login e leve o controle do seu estoque para o próximo nível.</Label>
            </Column>

            <Pressable style={{
                borderColor: action === 'sign-up' ? theme.color.primary : "#D1D1D1",
                borderWidth: 2, borderRadius: 8,
                padding: 20,
                backgroundColor: action === 'sign-up' ? theme.color.primary + 10 : "transparent",
            }} onPress={() => {
                setAction('sign-up');
            }}>
                <Row justify='space-between'>
                    <Column gv={6}>
                        <Title size={22} spacing={-1.5}>Criar uma nova conta</Title>
                        <Label size={14} style={{ width: 200, }}>Cadastre-se em poucos passos e comece a organizar o seu estoque de forma simples e rápida.</Label>
                    </Column>
                    <Column style={{ width: 38, height: 38, backgroundColor: action === 'sign-up' ? theme.color.primary : "#d1d1d1", borderRadius: 100 }} justify='center' align='center'>
                        <Icon name='Check' size={22} color={action === 'sign-up' ? "#fff" : "#D1D1D1"} />
                    </Column>
                </Row>
            </Pressable>
        
            <Pressable style={{
                borderColor: action === 'sign-in' ? theme.color.primary : "#D1D1D1",
                borderWidth: 2, borderRadius: 8,
                padding: 20,
                backgroundColor: action === 'sign-in' ? theme.color.primary + 10 : "transparent",
            }} onPress={() => {
                setAction('sign-in');
            }}>
                <Row justify='space-between'>
                    <Column gv={6}>
                        <Title size={22} spacing={-1.5}>Já tenho uma conta</Title>
                        <Label size={14} style={{ width: 200, }}>Acesse sua conta e continue acompanhando seus produtos e movimentações sem perder nada.</Label>
                    </Column>
                    <Column style={{ width: 38, height: 38, backgroundColor: action === 'sign-in' ? theme.color.primary : "#d1d1d1", borderRadius: 100 }} justify='center' align='center'>
                        <Icon name='Check' size={22} color={action === 'sign-in' ? "#fff" : "#D1D1D1"} />
                    </Column>
                </Row>
            </Pressable>
        </Column>
    )
}