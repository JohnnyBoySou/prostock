import { useState, useRef } from "react";
import { Main, Button, Label, Column, Input, Image } from "@/ui";

export default function LoginScreen() {
    const [password, setpassword] = useState();
    const [email, setemail] = useState();

    const refPassword = useRef();

    const handleLogin = () => {
    
    }

    return (<Main>
        <Column mh={26} gv={26}>
            <Image src={require('@/imgs/logo.png')} w={124} h={124} r={12} style={{  }}/>
            <Input label='Email' value={email} setValue={setemail} placeholder="Ex.: exemplo@email.com" onSubmitEditing={() => { refPassword.current.focus()}} />
            <Input label='Senha' ref={refPassword} pass value={password} setValue={setpassword} placeholder="Ex.: ********" onSubmitEditing={handleLogin} />
            <Column>
                <Button label='Entrar' />
                <Button label='Esqueci minha senha' variant='link' />
            </Column>
        </Column>
    </Main>)
}