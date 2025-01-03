import React, { useEffect } from 'react';
import { Main, Title, } from '@theme/global';

export default function AsyncStaticScreen({ navigation, }) {
    //verificacoes e animação
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Tabs')
        }, 2000)
    }, [])
    return (
        <Main style={{ backgroundColor: "#FE25BD", flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Title>Tela de carregamento</Title>
        </Main>
    )
}