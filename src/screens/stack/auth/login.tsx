import { useState, useRef } from "react";
import { KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Main, Button, Column, Input, Image, Title, Label, colors, Row, ScrollVertical, Pressable } from "@/ui";

import { AuthService, type LoginResponse } from '@/services/auth/index';
import { useUser } from "@/context/user";
import { useToast } from "@/hooks/useToast";
import { TokenService } from "@/hooks/token";

// Schema de validação para o formulário de login
const loginSchema = z.object({
    email: z.string()
        .min(1, "Por favor, insira um email.")
        .email("Por favor, insira um email válido."),
    password: z.string()
        .min(1, "Por favor, insira sua senha."),
});

// Schema de validação para o código de verificação
const verificationSchema = z.object({
    verificationCode: z.string()
        .min(1, "Por favor, insira o código de verificação.")
        .length(6, "O código deve ter exatamente 6 dígitos."),
});

type LoginFormData = z.infer<typeof loginSchema>;
type VerificationFormData = z.infer<typeof verificationSchema>;

export default function LoginScreen({ navigation }) {
    const theme = colors();
    const toast = useToast();
    const { saveUser } = useUser();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isVerificationStep, setIsVerificationStep] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const refs = useRef({
        email: useRef(null),
        password: useRef(null),
        verificationCode: useRef(null),
    });

    // Formulário de login
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'dev.joaosousa@gmail.com',
            password: '123456',
        },
    });

    // Formulário de verificação
    const verificationForm = useForm<VerificationFormData>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            verificationCode: '',
        },
    });

    const handleLogin = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            const res = await AuthService.login(data.email, data.password) as LoginResponse;
            console.log(res);
            toast.showSuccess('Login realizado com sucesso!');
            await saveUser(res.user);
            await TokenService.save(res.token);
        } catch (e: any) {
            console.log(e);
            if (e.error === "Necessário verificar o email") {
                setUserEmail(data.email);
                setIsVerificationStep(true);
                // Reenviar código automaticamente quando vai para verificação
                try {
                    await AuthService.resendVerification(data.email);
                    toast.showSuccess("Código de verificação reenviado! Verifique seu email.");
                } catch (resendError: any) {
                    console.log("Erro ao reenviar código:", resendError);
                    toast.showError("Email não verificado. Verifique seu email e insira o código enviado.");
                }
            } else {
                toast.showError(e.error || 'Erro ao realizar o login. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (data: VerificationFormData) => {
        setIsLoading(true);

        try {
            await AuthService.verifyEmailCode(userEmail, data.verificationCode);
            toast.showSuccess("Email verificado com sucesso!");
            // Após verificar, fazer login novamente
            const loginData = loginForm.getValues();
            const res = await AuthService.login(loginData.email, loginData.password) as LoginResponse;
            await saveUser(res.user);
            await TokenService.save(res.token);
            toast.showSuccess('Login realizado com sucesso!');
        } catch (e: any) {
            console.log(e);
            const errorMessage = e?.message || e?.error || "Código inválido. Tente novamente.";
            toast.showError("Código inválido. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!userEmail) {
            toast.showError("Email não encontrado. Tente fazer o login novamente.");
            return;
        }

        setIsLoading(true);

        try {
            await AuthService.resendVerification(userEmail);
            toast.showSuccess("Código reenviado! Verifique seu email.");
        } catch (e: any) {
            console.log(e);
            const errorMessage = e?.message || e?.error || "Erro ao reenviar código. Tente novamente.";
            toast.showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        setIsVerificationStep(false);
        verificationForm.reset();
        setUserEmail('');
    };

    return (
        <Main style={{ backgroundColor: theme.color.background }}>
            <ScrollVertical>
                <Column mh={26} gv={26}>
                    {!isVerificationStep ? (
                        <>
                            <Column gv={6} pv={24}>
                                <Title spacing={-2} size={38} style={{ lineHeight: 38, }}>Bem-vindo de volta!</Title>
                                <Label>Faça login para continuar</Label>
                            </Column>
                            <Column style={{ backgroundColor: theme.color.background, height: 2, }} />
                            <Column pv={24} gv={12}>
                                <Controller
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <Input
                                            label='Email'
                                            errorMessage={error?.message}
                                            keyboard="email-address"
                                            value={value}
                                            setValue={onChange}
                                            placeholder="Ex.: exemplo@email.com"
                                            ref={refs.current.email}
                                            onSubmitEditing={() => { refs.current.password.current?.focus() }}
                                        />
                                    )}
                                />
                                <Controller
                                    control={loginForm.control}
                                    name="password"
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <Input
                                            label='Senha'
                                            errorMessage={error?.message}
                                            ref={refs.current.password}
                                            pass={true}
                                            value={value}
                                            setValue={onChange}
                                            placeholder="Ex.: ********"
                                            onSubmitEditing={loginForm.handleSubmit(handleLogin)}
                                        />
                                    )}
                                />
                                <Column mt={12} gv={12}>
                                    <Button 
                                        label='Entrar' 
                                        onPress={loginForm.handleSubmit(handleLogin)} 
                                        variant='tertiary' 
                                        loading={isLoading} 
                                        disabled={isLoading}
                                    />
                                    <Button label='Esqueci minha senha' variant='link' onPress={() => navigation.navigate('ForgotPassword')} />
                                </Column>
                            </Column>
                        </>
                    ) : (
                        <>
                            <Column gv={12} style={{ alignItems: 'center' }}>
                                <Title spacing={-2} size={18} align='center'>Verificação de Email</Title>
                                <Label align='center' color="gray">Enviamos um código de 6 dígitos para:</Label>
                                <Label align='center' fontFamily="Font_Bold" color={theme.color.primary}>{userEmail}</Label>
                            </Column>

                            <Controller
                                control={verificationForm.control}
                                name="verificationCode"
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <Input
                                        label='Código de Verificação'
                                        errorMessage={error?.message}
                                        value={value}
                                        keyboard="numeric"
                                        setValue={onChange}
                                        ref={refs.current.verificationCode}
                                        placeholder="Ex.: 123456"
                                        maxLength={6}
                                        onSubmitEditing={verificationForm.handleSubmit(handleVerifyCode)}
                                    />
                                )}
                            />

                            <Column gv={12}>
                                <Button
                                    label='Verificar Código'
                                    onPress={verificationForm.handleSubmit(handleVerifyCode)}
                                    loading={isLoading}
                                    disabled={isLoading}
                                />
                                <Button variant="link" onPress={handleResendCode} style={{ alignItems: 'center' }} label="Não recebeu o código? Reenviar" />
                                <Button variant="ghost" onPress={handleBackToLogin} style={{ alignItems: 'center' }} label="Voltar ao login" />
                            </Column>
                        </>
                    )}
                </Column>
                <Column style={{ height: 200, }} />
            </ScrollVertical>
        </Main>
    )
}