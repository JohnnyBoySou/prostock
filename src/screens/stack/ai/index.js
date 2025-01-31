import React, { useState, useEffect } from 'react';
import { Main, ScrollVertical, Column, Label, Title, Row, Button, colors, HeadTitle } from '@/ui';
import { ScanText } from 'lucide-react-native';
export default function Screen({ navigation, }) {
    return (
        <Main>
            <ScrollVertical>
                <Column mh={26} gv={16}>
                    <Column style={{ width: 136, height: 136, alignSelf: 'center', backgroundColor: colors.color.primary, borderRadius: 100, justifyContent: 'center', alignItems: 'center', }}>
                        <ScanText size={64} color='#fff' />
                    </Column>
                    <HeadTitle size={24} align='center' style={{ lineHeight: 24, }}>Escaneie documentos e o contabilize em seu estoque</HeadTitle>
                    <Label align='center'>Com nossa inteligência artificial tudo fica mais fácil, siga essas recomendações para que dê tudo certo:</Label>
                    <Column gv={12} mv={12}>
                        <Row gh={12}>
                            <Column style={{ width: 44, height: 44, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#01986620', }}><Title size={24} style={{ lineHeight: 24, marginTop: 6, }} color='#019866'>1</Title></Column>
                            <Label style={{ width: 250, }}>Deixe o documento em uma superfície iluminada e sem sombras. </Label>
                        </Row>
                        <Row gh={12}>
                            <Column style={{ width: 44, height: 44, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#01986620', }}><Title size={24} style={{ lineHeight: 24, marginTop: 6, }} color='#019866'>2</Title></Column>
                            <Label style={{ width: 250, }}>Aproxime a câmera até focar no documento e deixar os dados nítidos.</Label>
                        </Row>
                        <Row gh={12}>
                            <Column style={{ width: 44, height: 44, borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: '#01986620', }}><Title size={24} style={{ lineHeight: 24, marginTop: 6, }} color='#019866'>3</Title></Column>
                            <Label  style={{ width: 250, }}>Tire a foto de maneira nítida sem tremidos.</Label>
                        </Row>
                    </Column>
                    <Button onPress={() => navigation.navigate('OCR')} label='Escanear agora' />
                    <Button variant='ghost' onPress={() => navigation.navigate('OCR', { "anexo": true})} label='Anexar imagem' />
                </Column>
            </ScrollVertical>
        </Main>
    )
}