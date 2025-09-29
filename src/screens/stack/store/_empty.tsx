import React from 'react';
import { Column, Title, Label, Image, Button,  } from '@/ui';
import { useNavigation } from '@react-navigation/native';

export default function StoreEmpty() {
    const navigation = useNavigation() as any;

    return (
        <Column justify='center' gv={16} pv={40}>
            <Image src={require("@/imgs/empty_img.png")} w={156} h={156} />
            <Title align='center' size={32} spacing={-2} style={{ lineHeight: 32 }} fontFamily="Font_Medium">
                Nenhuma loja encontrada...
            </Title>
            <Label align='center' size={14}>
                Crie sua primeira loja para começar a gerenciar seus produtos
            </Label>
            <Button variant="ghost" label="Criar loja" onPress={() => navigation.navigate("StoreAdd")} />
        </Column>
    );
}
