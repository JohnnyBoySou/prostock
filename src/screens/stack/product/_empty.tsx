import React from 'react';
import { Row, colors, Title, Column, Label } from "@/ui";
import { useNavigation } from "@react-navigation/native";
import { Package, ShoppingCart, Plus } from "lucide-react-native";
import { Pressable } from "react-native";

export default function ProductEmpty() {
    const navigation = useNavigation();
    const theme = colors();
    return (
        <Column style={{ 
            backgroundColor: '#fff', 
            borderRadius: 12, 
            margin: 20,
            padding: 20 
        }} justify='center' align='center' gv={16}>
            <Row gh={8} mv={12} justify='center'>
                <Package size={52} color='#43AA8B' />
                <ShoppingCart size={52} color='#3590F3' />
                <Package size={52} color='#FFB238' />
            </Row>
            
            <Title align='center' size={22} fontFamily="Font_Medium">
                Nenhum produto encontrado...
            </Title>
            
            <Label align='center' size={14} color='#666'>
                Crie seu primeiro produto para começar a gerenciar seu estoque
            </Label>
            
            <Pressable 
                style={{ 
                    backgroundColor: theme.color.blue || theme.color.primary, 
                    borderRadius: 8,
                    marginTop: 8
                }} 
                onPress={() => { navigation.navigate('ProductAdd' as never) }}
            >
                <Row 
                    justify="space-between" 
                    ph={14} 
                    align='center' 
                    gh={8} 
                    pv={14}
                >
                    <Label size={18} color='#fff'>Criar produto</Label>
                    <Column style={{ 
                        backgroundColor: '#fff', 
                        borderRadius: 4 
                    }} pv={6} ph={6}>
                        <Plus size={24} color={theme.color.blue || theme.color.primary} />
                    </Column>
                </Row>
            </Pressable>
        </Column>
    );
}
