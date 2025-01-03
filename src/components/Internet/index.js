import React, { useEffect, useState, useContext } from 'react';
import { Feather, } from '@expo/vector-icons';
import { ThemeContext } from 'styled-components/native';
import { useNetInfo } from '@react-native-community/netinfo';
import { Column, Row, Title, Label, Button } from '@theme/global';

export default function Internet() {
    const { color } = useContext(ThemeContext)
    const netInfo = useNetInfo();
    const [messageConnection, setMessageConnection] = useState(false);

    useEffect(() => {
        const fecthData = () => {
            if (netInfo?.isConnected) {
                setMessageConnection(false);
            } else {
                setMessageConnection(true);
            }
        }
        fecthData()
    }, []);

    if (!messageConnection) {
        return null}
    return (
        <Column from={{opacity:0, translateY: -50,}} animate={{opacity: 1, translateY: 0,}} exit={{translateY: 0, opacity: 0,}} style={{ position: 'absolute', top: 0, width: '100%', zIndex: 99, }}>
            <Row style={{ paddingTop: 40, backgroundColor: '#f7f7f7', justifyContent: 'center',  paddingBottom: 12, }}>
                <Button style={{ backgroundColor: color?.secundary+10, padding: 12,  borderRadius: 100,}}>
                    <Feather style={{ textAlign: 'center', }} name="wifi-off" size={24} color={color?.secundary} />
                </Button>
                <Column style={{ marginLeft: 12, }}>
                    <Title style={{ fontSize: 18, }}>Sem conexão com a internet</Title>
                    <Label style={{ fontSize: 14, color: color.secundary+99, }}>Tente novamente mais tarde.</Label>
                </Column>
            </Row>
        </Column>
    )
}