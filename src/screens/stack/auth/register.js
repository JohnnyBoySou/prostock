import { Main, Button, Label } from "@/ui/layout";

export default function RegisterScreen() {
    return (<Main>
        <StatusBar style="dark" translucent animated={true} />
        <Column style={{ flex: 1, justifyContent: 'center',}}>
            <Button rippleColor={'red'} onPress={() => { navigation.replace('Auth') }}>
                <Label align="center">Entrar</Label>
            </Button>
        </Column>

        <Input />
    </Main>)
}