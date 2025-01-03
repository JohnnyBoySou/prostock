import React, { useContext } from 'react';
import { Main, Column, Label, Button,  } from '@theme/global';
import { ThemeContext } from 'styled-components/native';
import { StatusBar } from 'expo-status-bar'

export default function OnboardingScreen({ navigation, }) {
    const { color, font, margin } = useContext(ThemeContext);
    return (
        <Main>
            <StatusBar style="dark" translucent animated={true} />
            <Column style={{ flex: 1, justifyContent: 'center',}}>
                <Button rippleColor={'red'} onPress={() => { navigation.replace('Auth') }}>
                    <Label align="center">Entrar</Label>
                </Button>
            </Column>
        </Main>
    )
}

