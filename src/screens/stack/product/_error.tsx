import React from 'react';
import { Column, Title, Label, Button, colors } from '@/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import { Pressable } from 'react-native';

interface ProductErrorProps {
    onRetry?: () => void;
    message?: string;
}

export default function ProductError({ onRetry, message = "Ops! Algo deu errado" }: ProductErrorProps) {
    const theme = colors();
        return (
        <Column style={{ 
            backgroundColor: '#fff', 
            borderRadius: 12, 
            margin: 20,
            padding: 20 
        }} justify='center' align='center' gv={16}>
            <Column style={{ 
                backgroundColor: '#ffebee', 
                borderRadius: 50, 
                padding: 16 
            }} align='center' justify='center'>
                <AlertTriangle size={48} color={theme.color.red || '#f44336'} />
            </Column>
            
            <Title align='center' size={20} fontFamily="Font_Medium">
                {message}
            </Title>
            
            <Label align='center' size={14} color='#666'>
                Verifique sua conexão e tente novamente
            </Label>
            
            {onRetry && (
                <Pressable 
                    style={{ 
                        backgroundColor: theme.color.primary, 
                        borderRadius: 8,
                        marginTop: 8
                    }} 
                    onPress={onRetry}
                >
                    <Column 
                        style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            paddingHorizontal: 16,
                            paddingVertical: 12
                        }} 
                        gh={8}
                    >
                        <RefreshCw size={20} color='#fff' />
                        <Label size={16} color='#fff'>Tentar novamente</Label>
                    </Column>
                </Pressable>
            )}
        </Column>
    );
}
