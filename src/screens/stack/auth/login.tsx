import { useState, useRef } from "react";
import { KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Main, Button, Message, Column, Input, Image, Title, Label, colors, Row } from "@/ui";

import { AuthService, type LoginResponse } from '@/services/auth/index';
import { useUser } from "@/context/user";
import { TokenService } from "@/hooks/token";

export default function LoginScreen({ navigation }) {
    const theme = colors();
    const { saveUser } = useUser();
    const [password, setPassword] = useState('123456');
    const [email, setEmail] = useState('dev.joaosousa@gmail.com');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const refPassword = useRef<any>(null);

    const handleLogin = async () => {
        setError('');
        setSuccess('');
        setEmailError('');
        setPasswordError('');

        let hasError = false;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Por favor, insira um email válido.');
            hasError = true;
        }
        if (!password) {
            setPasswordError('Por favor, insira sua senha.');
            hasError = true;
        }

        if (hasError) {
            return;
        }
        setIsLoading(true);
        try {
            const res = await AuthService.login(email, password) as LoginResponse;
            setSuccess('Login realizado com sucesso!');
            saveUser(res.user);
            await TokenService.save(res.token);
            navigation.navigate('Home');
        } catch (e) {
            setError('Erro ao realizar o login. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (emailError) {
            setEmailError('');
        }
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        if (passwordError) {
            setPasswordError('');
        }
    };

    return (
        <Main>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Column style={{ flex: 1, minHeight: '100%', backgroundColor: theme.color.primary }}>
                        <Column style={{ height: 250 }} ph={26} pv={24} justify="space-between">
                            <Row mt={24} align="center">
                                <Image src={require('@/imgs/logo.png')} w={56} h={56} />
                                <Title color='#fff'>20Stock</Title>
                            </Row>
                            <Column gv={6}>
                                <Title color='#fff'>Bem-vindo de volta!</Title>
                                <Label color='#f1f1f1'>Faça login para continuar</Label>
                            </Column>
                        </Column>
                        <Column ph={26} pv={24} gv={12} style={{ backgroundColor: theme.color.background, borderTopLeftRadius: 12, borderTopRightRadius: 12, flex: 1 }}>
                            <Input
                                label='Email'
                                value={email}
                                setValue={handleEmailChange}
                                keyboard="email-address"
                                placeholder="Ex.: exemplo@email.com"
                                onSubmitEditing={() => { refPassword.current.focus() }}
                                errorMessage={emailError}
                            />
                            <Input
                                label='Senha'
                                ref={refPassword}
                                pass={true}
                                value={password}
                                setValue={handlePasswordChange}
                                placeholder="Ex.: ********"
                                onSubmitEditing={handleLogin}
                                errorMessage={passwordError}
                            />
                            <Column mt={12} gv={12}>
                                <Message success={success} error={error} />
                                <Button label='Entrar' onPress={handleLogin} loading={isLoading} />
                                <Button label='Esqueci minha senha' variant='link' onPress={() => navigation.navigate('ForgotPassword')} />
                            </Column>
                        </Column>
                    </Column>
                </ScrollView>
            </KeyboardAvoidingView>
        </Main>
    )
}