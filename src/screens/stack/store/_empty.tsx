import React from 'react';
import { Main, Column, Title, Label, colors, Button, Icon } from '@/ui';
import { useNavigation } from '@react-navigation/native';

export default function StoreEmptyScreen() {
    const navigation = useNavigation();

    return (
        <Main>
            <Column style={{ flex: 1 }} justify='center' align="center">
                <Column mh={26} gv={20} pv={20} ph={20} style={{ backgroundColor: '#fff', borderRadius: 12 }}>
                    <Column align="center" gv={12}>
                        <Icon name="Store" size={52} color='#FFB238' />
                        <Title size={22} fontFamily="Font_Medium" align='center'>
                            Nenhuma loja encontrada
                        </Title>
                        <Label align='center' color={colors.color.muted}>
                            Você ainda não possui lojas cadastradas. Crie sua primeira loja para começar.
                        </Label>
                    </Column>
                    
                    <Button 
                        label="Criar primeira loja" 
                        onPress={() => (navigation as any).navigate('StoreAdd')}
                        icon={<Icon name="Plus" size={20} color="#fff" />}
                    />
                </Column>
            </Column>
        </Main>
    );
}
