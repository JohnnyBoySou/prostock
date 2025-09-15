import React, { useState } from 'react';
import { Main, Column, Row, ScrollVertical, Title, HeadTitle, Label, SubLabel, Button, colors, MultiStep, Image } from "@/ui/index";

const steps = [
    {
        title: 'Crie sua primeira loja',
        description: "Vamos criar sua primeira loja. Assim você poderá cadastrar produtos, fornecedores e acompanhar todo o seu estoque em um só lugar.",
        image: require('@/imgs/logo.png'),
    },
    {
        title: 'Quem abastece sua loja?',
        description: "Adicione um fornecedor para vincular aos seus produtos e organizar melhor suas entradas de estoque",
        image: require('@/imgs/logo.png'),
    },
    {
        title: 'Adicione o primeiro produto',
        description: "Cadastre um produto para começar a organizar seu estoque. Você poderá definir nome, categoria, preço e quantidade inicial.",
        image: require('@/imgs/logo.png'),
    },
    {
        title: 'Tudo pronto para começar!',
        description: "Sua conta, loja, fornecedor e primeiro produto já estão prontos. Agora é só começar a explorar o 20Stock e transformar a forma como você controla seu estoque.",
        image: require('@/imgs/logo.png'),
    },
]

export default function OnboardingScreen({ navigation}) {

    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            navigation.navigate('Login');
        }
    }

    return (
        <Main>
            <Column gv={12} ph={26} pv={60} style={{ flex: 1, }}>
                <MultiStep steps={steps.length} currentStep={currentStep} />
                <StepComponent step={currentStep} />
                <Column gv={12} style={{ position: "absolute", bottom: 30, left: 26, right: 26, }}>
                    <Button label='Continuar' onPress={nextStep} />
                </Column>
            </Column>
        </Main>
    );
}


const StepComponent = ({ step }: { step: number }) => {
    return (
        <Column gv={12} mv={24}>
            <Column style={{ backgroundColor: colors.color.primary, flexGrow: 1, height: 400, borderRadius: 12, }} justify='center' align='center'>
                <Image src={steps[step].image} w={100} h={100} r={12} />
            </Column>
            <Title>{steps[step].title}</Title>
            <Label>{steps[step].description}</Label>
        </Column>
    )
}
