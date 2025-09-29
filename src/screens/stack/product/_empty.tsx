import React from 'react';
import { Title, Column, Label, Image, Button } from "@/ui";
import { useNavigation } from "@react-navigation/native";

export default function ProductEmpty() {
    const navigation = useNavigation() as any;
    return (
        <Column justify='center' gv={16} pv={40}>
            <Image src={require("@/imgs/empty_img.png")} w={156} h={156} />
            <Title align='center' size={32} spacing={-2} style={{ lineHeight: 32 }} fontFamily="Font_Medium">
                Nenhum produto encontrado...
            </Title>
            <Label align='center' size={14}>
                Crie seu primeiro produto para começar a gerenciar seu estoque
            </Label>
            <Button variant="ghost" label="Criar produto" onPress={() => navigation.navigate("ProductAdd")} />

        </Column>
    );
}
