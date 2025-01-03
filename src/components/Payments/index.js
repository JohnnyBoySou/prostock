import React, { useState } from 'react';
import { Column, Label, Title, Row, Button, useTheme, LabelBT, Image } from '@theme/global';

//COMPONENTS
import PaymentCredito from '@components/Payments/credito';
import PaymentPix from '@components/Payments/pix';
import StepIndicator from 'react-native-step-indicator';
//ICONS
import { ArrowLeft, Check, CircleHelp } from 'lucide-react-native';

export default function Payment({ item, destino, modal, card, }) {
    const { color, font, margin } = useTheme();
    const [type, settype] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <Column style={{ marginHorizontal: margin.h, }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center', }}>
                <Button onPress={() => { modal?.current.close() }} bg={color.sc.sc3} pv={6} ph={14}>
                    <ArrowLeft size={24} color='#fff' />
                </Button>
                <Title>Pagamento</Title>
                <Button onPress={() => { modal?.current.close() }}>
                    <CircleHelp size={24} color={color.sc.sc3} />
                </Button>
            </Row>

            <Column mv={20}>
                <StepIndicator
                    stepCount={3}
                    customStyles={firstIndicatorStyles}
                    currentPosition={currentPage - 1}
                    labels={['Confirmação', 'Pagamento', 'Finalização']}
                    renderStepIndicator={({ position, stepStatus, }) =>
                        <Column style={{ alignItems: 'center', }}>
                            {stepStatus === 'finished' ? <Check size={18} color="#fff" /> : <Label style={{ lineHeight: 18, fontFamily: font.bold, color: stepStatus === 'current' ? "#fff" : color.sc.sc3, }} >{position + 1}</Label>}
                        </Column>
                    }
                    renderLabel={({ position, stepStatus, label }) => <Label style={{ fontSize: 12, fontFamily: font.medium, color: stepStatus === 'current' ? color.sc.sc3 : stepStatus === 'finished' ? color.green : color.label, }}>{label}</Label>}
                />
            </Column>

            {currentPage === 1 && <Column style={{ marginVertical: 12, }}>
                <Title align="center" style={{ marginBottom: 12, }}>Confirmação</Title>
                {card}

                <Button onPress={() => { setCurrentPage(2) }} bg={color.sc.sc3} style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 12, }}>
                    <LabelBT color="#fff">Confirmar e continuar</LabelBT>
                </Button>
            </Column>}

            {currentPage === 2 &&
                <Column>
                    {type === null &&
                        <Column>
                            <Title>Escolha o método de pagamento</Title>
                            <Column style={{ rowGap: 12, marginTop: 12, }}>
                                <Button radius={12} bg="#fff" pv={20} onPress={() => { settype('Credito') }} style={{ borderWidth: 1, borderColor: color.border, }}>
                                    <Row style={{ alignItems: 'center', }}>
                                        <Image source={require('@assets/icons/credito.png')} style={{ width: 70, height: 50, objectFit: 'contain', }} />
                                        <Column mh={12}>
                                            <Title size={18}>Cartão de crédito</Title>
                                            <Column style={{ height: 3, }} />
                                            <Label>Até 6x sem juros.</Label>
                                        </Column>
                                    </Row>
                                </Button>
                                <Button radius={12} bg="#fff" pv={20} onPress={() => { settype('Pix') }} style={{ borderWidth: 1, borderColor: color.border, }}>
                                    <Row style={{ alignItems: 'center', }}>
                                        <Image source={require('@assets/icons/pix.png')} style={{ width: 70, height: 50, objectFit: 'contain', }} />
                                        <Column mh={12}>
                                            <Title size={18}>Pix</Title>
                                            <Label>Aprovação instantanêa.</Label>
                                        </Column>
                                    </Row>
                                </Button>
                            </Column>
                        </Column>}
                    {type === 'Credito' && <PaymentCredito settype={settype} item={item} />}
                    {type === 'Pix' && <PaymentPix settype={settype} item={item} />}
                </Column>}

        </Column>
    )
}

const firstIndicatorStyles = {
    stepIndicatorSize: 30,
    stepStrokeWidth: 0,
    currentStepIndicatorSize: 30,
    currentStepStrokeWidth: 0,
    separatorStrokeWidth: 3,

    separatorFinishedColor: '#37CB84',
    separatorUnFinishedColor: '#c3cfe3',

    stepIndicatorUnFinishedColor: '#dce5f2',
    stepIndicatorFinishedColor: '#37CB84',
    stepIndicatorCurrentColor: '#91A6C4',

};