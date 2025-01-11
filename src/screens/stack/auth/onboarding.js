import React from 'react';
import { Main, Column, Label, Button, Row, Title, HeadTitle, U, Image, SCREEN_HEIGHT, SCREEN_WIDTH } from '@/ui';
import { StatusBar } from 'expo-status-bar'
import { Linking, Pressable } from 'react-native';
import { Users, Truck, LayoutGrid } from 'lucide-react-native';

export default function OnboardingScreen() {
    const openTerms = () => {
        Linking.openURL('https://termos.com')
    }
    return (
        <Main>
            <StatusBar style="dark" translucent animated={true} />
            <Column gv={12} ph={26} pv={60} style={{ flex: 1, zIndex: 2, }}>
                <Column style={{ height: 50, }} />
                <Column style={{ alignSelf: 'flex-start' }}>
                    <Image src={require('@/imgs/logo.png')} w={100} h={100} r={12} />
                </Column>
                <HeadTitle color='#019866' size={42} mt={20}>Gerencie seu estoque com a ProStock.</HeadTitle>

                <Row gh={6} mt={10} justify="space-between">
                    <Column style={{ backgroundColor: '#43AA8B20', borderRadius: 12 }} pv={12} ph={12} gv={6}>
                        <Label size={12} color='#43AA8B'>Funcionários</Label>
                        <Row justify='space-between'>
                            <Title size={24} style={{ lineHeight: 24 }} color='#43AA8B'>20+</Title>
                            <Users size={24} color="#43AA8B" />
                        </Row>
                    </Column>
                    <Column style={{ backgroundColor: '#3590F320', borderRadius: 12 }} pv={12} ph={12} gv={6}>
                        <Label size={12} color='#3590F3'>Produtos</Label>
                        <Row justify='space-between'>
                            <Title size={24} style={{ lineHeight: 24 }} color='#3590F3'>50+</Title>
                            <LayoutGrid size={24} color="#3590F3" />
                        </Row>
                    </Column>
                    <Column style={{ backgroundColor: '#9747FF20', borderRadius: 12 }} pv={12} ph={12} gv={6}>
                        <Label size={12} color='#9747FF'>Fornecedores</Label>
                        <Row justify='space-between'>
                            <Title size={24} style={{ lineHeight: 24 }} color='#9747FF'>50+</Title>
                            <Truck size={24} color="#9747FF" />
                        </Row>
                    </Column>
                </Row>

                <Column style={{ position: 'absolute', bottom: 50, left: 26, right: 26, }}>
                    <Button label='Entrar' route='Login' />
                    <Pressable style={{ paddingVertical: 12, marginVertical: 12, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', }} onPress={openTerms} >
                        <Label align='center'>Ao continuar, você concorda com nossos <U>Termos de Serviço</U> e <U>Política de Privacidade</U></Label>
                    </Pressable>
                </Column>
            </Column>

            <Column style={{ position: 'absolute', bottom: 0, top: 0, zIndex: 0, opacity: .8, }} >
                <Image src={require('@/imgs/blur.png')} w={SCREEN_WIDTH + 100} h={SCREEN_HEIGHT} />
            </Column>
        </Main>
    )
}

