import React, { useContext, } from 'react';
import { Main, Scroll, Title, Row, } from '@theme/global';
import { ThemeContext } from 'styled-components/native';
import { StatusBar } from 'expo-status-bar';

export default function AccountScreen({ navigation, }) {
    const { color, font, margin } = useContext(ThemeContext);
   
    return (
        <Main style={{ backgroundColor: '#fff', }}>
            <StatusBar style="dark" backgroundColor="#fff" animated />
            <Scroll>
                <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginHorizontal: margin.h, paddingTop: 10, }}>
                    <Title>Minha conta</Title>
                </Row>
            </Scroll>
        </Main>
    )
}
