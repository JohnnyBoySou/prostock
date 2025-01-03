import React from 'react';
import { Main, Scroll, Column, Label, Title, Row,  Button, useTheme } from '@theme/global';
import { ArrowLeft } from 'lucide-react-native';
//import SucessAnim from '@assets/anim/sucess.js';

export default function SuccessScreen({ navigation, }) {
    const { color, font, margin } = useTheme();
    return (
        <Main style={{ backgroundColor: "#fff", }}>
             <Scroll>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: margin.h, }}>
                    <Button onPress={() => { navigation.goBack() }} style={{ backgroundColor: color.secundary, width: 46, height: 34, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
                        <ArrowLeft color="#fff" />
                    </Button>
                    <Column >
                    </Column>
                    <Column style={{ width: 42, height: 42, justifyContent: 'center', alignItems: 'center', }}>
                    </Column>
                </Row>

                <Column style={{ marginHorizontal: margin.h,  justifyContent: 'center', alignItems: 'center', flex: 1, }}>
                    <Title style={{ fontSize: 32, lineHeight: 34, textAlign: 'center', marginVertical: 24, }}>Compra realizada com sucesso!</Title>
                    <Label style={{ textAlign: 'center', }}>Desfrute de serviços em estabelecimentos parceiros acumulando mais pontos!</Label>

                </Column>

                <Column style={{ padding: 32, borderTopLeftRadius: 32, borderTopRightRadius: 32, justifyContent: 'center', alignItems: 'center', }}>
                    <Button  style={{ paddingHorizontal: 24, borderColor: color.primary, }}>
                        <Label style={{ fontFamily: font.bold, }}>Ver meus Pets</Label>
                    </Button>
                    <Column style={{ height: 12, }} />
                    <Button  style={{ paddingHorizontal: 24, paddingVertical: 12, borderColor: color.secundary, }}>
                        <Label style={{ color: color.secundary, fontFamily: font.bold, }}>Ver escola Pongo</Label>
                    </Button>
                </Column>
            </Scroll>
        </Main>
    )
}

