import { ScrollVertical, Main, Column, Button, HeadTitle, colors } from '@/ui';
import { CheckCheck } from 'lucide-react-native';

export default function ProductSuccessScreen({ route }) {
    const message = route?.params.message ? route.params.message : 'Deu tudo certo!';
    return (
        <Main>
            <ScrollVertical>
                <Column mh={26} mv={26} gv={32}>
                    <Column style={{ width: 175, alignSelf:'center', height: 175, justifyContent: 'center', alignItems: 'center',  borderRadius: 100, backgroundColor: colors.color.green, }}>
                        <CheckCheck size={112} color="#fff" />
                    </Column>
                    <HeadTitle align='center'>{message}</HeadTitle>
                    <Column gv={16}>
                        <Button label='Novo produto' route="ProductAdd" />
                        <Button variant='ghost' label='Listar produtos' route="ProductList"/>
                    </Column>
                </Column>

            </ScrollVertical>
        </Main>
    )
}