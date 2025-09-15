import React from 'react';
import { Main, Column, Loader, Title, Label, colors } from '@/ui';

export default function StoreLoadingScreen() {
    return (
        <Main>
            <Column style={{ flex: 1 }} justify='center' align="center">
                <Column mh={10} gv={16} pv={20} ph={20} style={{ borderRadius: 12 }}>
                    <Loader color={colors.color.primary} size={32} />
                    <Column gv={12} align="center">
                        <Title size={22} fontFamily="Font_Medium">Carregando lojas...</Title>
                        <Label>Aguarde enquanto buscamos suas lojas.</Label>
                    </Column>
                </Column>
            </Column>
        </Main>
    );
}
