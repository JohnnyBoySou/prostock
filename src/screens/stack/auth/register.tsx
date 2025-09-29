import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Main, Button, Column, Input, ScrollVertical, Pressable, Label, U, colors, Title } from "@/ui/index";
import { AuthService } from "@/services/auth";
import { toast } from "@/hooks/useToast";
import { usePostHog } from "posthog-react-native";

// Schema de validação para o formulário de registro
const registerSchema = z.object({
    name: z.string()
        .min(1, "Por favor, insira seu nome.")
        .min(2, "O nome deve ter pelo menos 2 caracteres."),
    email: z.string()
        .min(1, "Por favor, insira um email.")
        .email("Por favor, insira um email válido."),
    phone: z.string()
        .min(1, "Por favor, insira um telefone.")
        .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX."),
    password: z.string()
        .min(1, "Por favor, insira uma senha.")
        .min(6, "A senha deve conter pelo menos 6 caracteres."),
});

// Schema de validação para o código de verificação
const verificationSchema = z.object({
    verificationCode: z.string()
        .min(1, "Por favor, insira o código de verificação.")
        .length(6, "O código deve ter exatamente 6 dígitos."),
});

type RegisterFormData = z.infer<typeof registerSchema>;
type VerificationFormData = z.infer<typeof verificationSchema>;

export default function RegisterScreen({ navigation }) {
    const posthog = usePostHog();

    const [isLoading, setIsLoading] = useState(false);
    const [isVerificationStep, setIsVerificationStep] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const refs = useRef({
        name: useRef(null),
        email: useRef(null),
        password: useRef(null),
        phone: useRef(null),
        verificationCode: useRef(null),
    });

    // Formulário de registro
    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: 'teste',
            email: 'dev.joaosousa@gmail.com',
            phone: '49991935657',
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

    const handleRegister = async (data: RegisterFormData) => {
        setIsLoading(true);

        try {
            const res = await AuthService.register(data);
            console.log(res);
            toast.showSuccess("Cadastro realizado! Verifique seu email para confirmar a conta.");
            posthog.capture("Cadastro realizado", { email: data.email });
            setUserEmail(data.email);
            setIsVerificationStep(true);
        } catch (e: any) {
            console.log(e);
            const errorMessage = e?.message || e?.error || "Erro ao realizar o cadastro. Tente novamente.";
            toast.showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    const handleVerifyCode = async (data: VerificationFormData) => {
        setIsLoading(true);

        try {
            await AuthService.verifyEmailCode(userEmail, data.verificationCode);
            toast.showSuccess("Email verificado com sucesso!");
            navigation.navigate('Login');
        } catch (e: any) {
            console.log(e);
            const errorMessage = e?.message || e?.error || "Código inválido. Tente novamente.";
            toast.showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!userEmail) {
            toast.showError("Email não encontrado. Tente fazer o cadastro novamente.");
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

    const handleBackToRegister = () => {
        setIsVerificationStep(false);
        verificationForm.reset();
        setUserEmail('');
    };

    const openTerms = () => {
        console.log("openTerms");
    }

    const theme = colors();

    return (<Main style={{ backgroundColor: "#fff" }}>
        <ScrollVertical>
            <Column mh={26} gv={26}>
                {!isVerificationStep ? (
                    <>
                        <Column gv={6} >
                            <Title spacing={-2} size={38} style={{ lineHeight: 38, }}>Criar conta</Title>
                            <Label>Preencha os campos abaixo para criar sua conta</Label>
                        </Column>
                        <Column style={{ backgroundColor: theme.color.background, height: 2, }} />
                        <Controller
                            control={registerForm.control}
                            name="name"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input
                                    label='Nome'
                                    errorMessage={error?.message}
                                    keyboard="default"
                                    value={value}
                                    setValue={onChange}
                                    placeholder="Ex.: João"
                                    ref={refs.current.name}
                                    onSubmitEditing={() => { refs.current.email.current?.focus() }}
                                />
                            )}
                        />

                        <Controller
                            control={registerForm.control}
                            name="email"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input
                                    label='Email'
                                    errorMessage={error?.message}
                                    value={value}
                                    keyboard="email-address"
                                    setValue={onChange}
                                    ref={refs.current.email}
                                    placeholder="Ex.: exemplo@email.com"
                                    onSubmitEditing={() => { refs.current.phone.current?.focus() }}
                                />
                            )}
                        />

                        <Controller
                            control={registerForm.control}
                            name="phone"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input
                                    label='Telefone'
                                    errorMessage={error?.message}
                                    value={value}
                                    mask="PHONE"
                                    keyboard="phone-pad"
                                    setValue={onChange}
                                    ref={refs.current.phone}
                                    placeholder="Ex.: (11) 91234-5678"
                                    onSubmitEditing={() => {
                                        refs.current.password.current?.focus();
                                    }}
                                />
                            )}
                        />

                        <Controller
                            control={registerForm.control}
                            name="password"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <Input
                                    label='Senha'
                                    errorMessage={error?.message}
                                    ref={refs.current.password}
                                    keyboard="default"
                                    pass
                                    value={value}
                                    setValue={onChange}
                                    placeholder="Ex.: ********"
                                    onSubmitEditing={registerForm.handleSubmit(handleRegister)}
                                />
                            )}
                        />

                        <Column gv={12}>
                            <Button
                                label='Criar conta'
                                onPress={registerForm.handleSubmit(handleRegister)}
                                loading={isLoading}
                                disabled={isLoading}
                                variant='tertiary'
                            />
                            <Pressable onPress={openTerms} style={{ alignItems: 'center', }}>
                                <Label align='center'>Ao criar uma conta, você concorda com nossos <U>Termos de Uso</U> e <U>Política de Privacidade</U>.</Label>
                            </Pressable>
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
                            <Button variant="ghost" onPress={handleBackToRegister} style={{ alignItems: 'center' }} label="Voltar ao cadastro" />
                        </Column>
                    </>
                )}
            </Column>

            <Column style={{ height: 200, }} />
        </ScrollVertical>

    </Main>)
}