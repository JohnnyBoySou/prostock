import { useState, useRef } from "react";
import { Main, Button, Message, Column, Input, Image } from "@/ui";

import { loginUser } from '@/api/auth/index';
import { useUser } from "@/context/user";

import { OneSignal } from 'react-native-onesignal';


export default function LoginScreen() {
    const { saveUser } = useUser();
    const [password, setpassword] = useState('');
    const [email, setemail] = useState('');
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const refPassword = useRef();

    const handleLogin = async () => {
        setError("");
        setSuccess("");
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError("Por favor, insira um email válido.");
            return;
        }
        if (!password) {
            setError("Por favor, insira sua senha.");
            return;
        }
        setIsLoading(true);
        try {
            const res = await loginUser(email, password);
            saveUser(res);
            setSuccess("Login realizado com sucesso!");
            OneSignal.login(res?.uiid)
        } catch (e) {
            setError("Erro ao realizar o login. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (<Main>
        <Column mh={26} gv={26}>
            <Image src={require('@/imgs/logo.png')} w={124} h={124} r={12} />
            <Input label='Email' value={email} setValue={setemail} keyboard="email-address" placeholder="Ex.: exemplo@email.com" onSubmitEditing={() => { refPassword.current.focus() }} />
            <Input label='Senha' ref={refPassword} pass value={password} setValue={setpassword} placeholder="Ex.: ********" onSubmitEditing={handleLogin} />
            <Message success={success} error={error} />
            <Column>
                <Button label='Entrar' onPress={handleLogin} loading={isLoading} />
            </Column>
        </Column>
    </Main>)
}