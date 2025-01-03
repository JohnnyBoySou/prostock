import React from 'react';
import { Row, Button, useTheme, SubLabel } from '@theme/global';

export default function ButtonPrimary({ login = false, type = 'Default', label, pv = 15, ph = 20, fontStyle, size = 18, onPress, ...props }) {
    const { color, font, } = useTheme();
    const bg = type === 'Default' ? '#918C8B' : type === 'Light' ? '#ECEBEB' : '#202020';
    const text = type === 'Default' ? color.light : type === 'Light' ? '#434343' : '#fff';
    return (
        <Button {...props} onPress={onPress} pv={pv} ph={ph} style={{ justifyContent: 'center', alignItems: 'center', }} bg={bg} >
            <Row>
                <SubLabel style={{ fontSize: size, color: text,  }}>{label}</SubLabel>
            </Row>
        </Button>
    )
}