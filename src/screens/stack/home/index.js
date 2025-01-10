import React from 'react';
import { Main, ScrollVertical, Column, Row, Title, HeadTitle, Label, Image } from '@/ui';
import { useUser } from '@/context/user';
import { Pressable } from 'react-native';
import { Menu } from 'lucide-react-native';

export default function HomeScreen({ navigation, }) {

    const { user } = useUser();
    
    const greatings = () => {
        const date = new Date();
        const hour = date.getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    }
    return (
        <Main >
            <ScrollVertical>
                <Column ph={26} gv={16}>
                <Row justify='space-between'>
                    <Pressable style={{ width: 48, height: 48, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',  borderRadius: 100, }}>
                        <Menu color='#8A8A8A' size={24} />
                    </Pressable>
                    <Image src={require('@/imgs/logo_red.png')} w={64} h={64} />
                </Row>

                <Column>
                        <HeadTitle>{greatings()}, {'\n'}{user?.name}</HeadTitle>
                    <Label>Escolha uma das opções no menu para começar</Label>
                </Column>

                </Column>
            </ScrollVertical>
        </Main>
    )
}
