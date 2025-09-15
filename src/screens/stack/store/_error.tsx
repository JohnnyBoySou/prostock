import React from 'react';
import { Main, Column, Title, Label, colors, Button, Icon } from '@/ui';

interface StoreErrorScreenProps {
    onRetry?: () => void;
    error?: string;
}

export default function StoreErrorScreen({ onRetry, error }: StoreErrorScreenProps) {
    return (
        <Main>
            <Column style={{ flex: 1 }} justify='center' align="center">
                <Column mh={26} gv={20} pv={20} ph={20} style={{ backgroundColor: '#fff', borderRadius: 12 }}>
                    <Column align="center" gv={12}>
                        <Icon name="AlertTriangle" size={52} color={colors.color.red} />
                        <Title size={22} fontFamily="Font_Medium" align='center'>
                            Ops! Algo deu errado
                        </Title>
                        <Label align='center' color={colors.color.muted}>
                            {error || 'Não foi possível carregar as lojas. Verifique sua conexão e tente novamente.'}
                        </Label>
                    </Column>
                    
                    {onRetry && (
                        <Button 
                            label="Tentar novamente" 
                            onPress={onRetry}
                            icon={<Icon name="RefreshCw" size={20} color="#fff" />}
                        />
                    )}
                </Column>
            </Column>
        </Main>
    );
}
