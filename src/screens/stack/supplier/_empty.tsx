import React from 'react';
import { Column, Title, Label, Button, Image } from '@/ui';
import { useNavigation } from '@react-navigation/native';

export default function SupplierEmpty() {
    const navigation = useNavigation<any>();

    return (
        <Column justify='center'  gv={16} pv={40}>
        <Image src={require("@/imgs/empty_img.png")} w={156} h={156} />
        <Title align='center' size={32} spacing={-2} style={{ lineHeight: 32 }} fontFamily="Font_Medium">
            Nenhuma fornecedor encontrado...
        </Title>
        <Label align='center' size={14}>
            Crie seu primeiro fornecedor para começar a gerenciar seu estoque
        </Label>
        <Button variant="ghost" label="Criar fornecedor" onPress={() => navigation.navigate("SupplierAdd")} />
    </Column>
    );
}
