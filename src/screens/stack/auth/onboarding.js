import React, { useState } from 'react';
import { Main, Column, Label, Button, Input, Tabs } from '@/ui';
import { StatusBar } from 'expo-status-bar'

export default function OnboardingScreen({ navigation, }) {
    const [type, setType] = useState();
    const types = ['Sobre', 'Categorias', 'Estoque']
    return (
        <Main>
            <StatusBar style="dark" translucent animated={true} />
            <Column gv={12} justify='center' mh={12} >
                <Input label='E-mail' placeholder="Ex.: email@exemplo.com" pass />
                <Input label='E-mail' placeholder="Ex.: email@exemplo.com" lock />
                <Input label='E-mail' placeholder="Ex.: email@exemplo.com" select />
                <Button label='Salvar' />
                <Button label='Salvar' variant='secondary'/>
            </Column>
            <Column>
                <Tabs types={types} value={type} setValue={setType} />
            </Column>
        </Main>
    )
}

