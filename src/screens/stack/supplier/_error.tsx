import React from 'react';
import { Column, Title, Label, Image, } from '@/ui';

    interface SupplierErrorProps {
    message?: string;
}

export default function SupplierError({ message }: SupplierErrorProps) {
    return (
        <Column justify='center' align='center' gv={16} pv={40}>
            <Image src={require("@/imgs/error_img.png")} w={156} h={156} />
            <Title align='center' size={32} spacing={-2} style={{ lineHeight: 32 }} fontFamily="Font_Medium">
                Ops! Algo deu errado
            </Title>
            <Label align='center' size={14}>
                {message}
            </Label>
        </Column>
    );
}
