import { useState, useRef, useEffect } from "react";
import { Main, Button, Column, Input, ScrollVertical, Pressable, Label, U } from "@/ui/index";
import { AuthService } from "@/services/auth";
import { toast } from "@/hooks/useToast";
import { usePostHog } from "posthog-react-native";

export default function RegisterScreen({ navigation }) {

    const posthog = usePostHog() 

    const [name, setName] = useState('teste');
    const [email, setEmail] = useState('dev.joaosousa@gmail.com');
    const [password, setPassword] = useState('123456');
    const [phone, setPhone] = useState('49991935657');
    const [verificationCode, setVerificationCode] = useState('');
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

    const [errors, setErrors] = useState({
        name: null,
        email: null,
        password: null,
        phone: null,
        verificationCode: null,
    });

    const isValidPhone = (phone: string) => {
        const formattedPhone = /^\(\d{2}\) \d{5}-\d{4}$/;
        return formattedPhone.test(phone);
    };

    const clearError = (field: string) => {
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleNameChange = (value: string) => {
        setName(value);
        clearError('name');
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
        clearError('email');
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        clearError('password');
    };

    const handlePhoneChange = (value: string) => {
        setPhone(value);
        clearError('phone');
    };

    const handleVerificationCodeChange = (value: string) => {
        setVerificationCode(value);
        clearError('verificationCode');
    };

    const handleRegister = async () => {
        if (!name) {
            setErrors(prev => ({ ...prev, name: "Por favor, insira seu nome." }));
            refs.current.name.current?.focus();
            return;
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setErrors(prev => ({ ...prev, email: "Por favor, insira um email válido." }));
            refs.current.email.current?.focus();
            return;
        }
        if (!phone || !isValidPhone(phone)) {
            setErrors(prev => ({ ...prev, phone: "Por favor, insira um telefone válido." }));
            refs.current.phone.current?.focus();
            return;
        }
        if (!password || (password as string).length < 6) {
            setErrors(prev => ({ ...prev, password: "A senha deve conter pelo menos 6 caracteres." }));
            refs.current.password.current?.focus();
            return;
        }

        setIsLoading(true);

        try {
            const res = await AuthService.register({ name, email, phone, password });
            console.log(res)
            toast.showSuccess("Cadastro realizado! Verifique seu email para confirmar a conta.");
            posthog.capture("Cadastro realizado", { email: email })
            setUserEmail(email);
            setIsVerificationStep(true);
        } catch (e: any) {
            console.log(e)
            const errorMessage = e?.message || e?.error || "Erro ao realizar o cadastro. Tente novamente.";
            toast.showError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    const handleVerifyCode = async () => {
        if (!verificationCode || verificationCode.length < 6) {
            setErrors(prev => ({ ...prev, verificationCode: "Por favor, insira o código de 6 dígitos." }));
            refs.current.verificationCode.current?.focus();
            return;
        }

        setIsLoading(true);

        try {
            await AuthService.verifyEmailCode(userEmail, verificationCode);
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
        setVerificationCode('');
        setUserEmail('');
    };

    const openTerms = () => {
        console.log("openTerms");
    }

    return (<Main>
        <ScrollVertical>
            <Column mh={26} gv={26}>
                {!isVerificationStep ? (
                    <>
                        <Input label='Nome' errorMessage={errors.name} keyboard="default" value={name} setValue={handleNameChange} placeholder="Ex.: João"
                            ref={refs.current.name}
                            onSubmitEditing={() => { refs.current.email.current?.focus() }} />
                        <Input
                            label='Email'
                            errorMessage={errors.email}
                            value={email} keyboard="email-address"
                            setValue={handleEmailChange}
                            ref={refs.current.email}
                            placeholder="Ex.: exemplo@email.com"
                            onSubmitEditing={() => { refs.current.phone.current?.focus() }} />

                        <Input
                            label='Telefone'
                            errorMessage={errors.phone}
                            value={phone}
                            mask="PHONE"
                            keyboard="phone-pad"
                            setValue={handlePhoneChange}
                            ref={refs.current.phone}
                            placeholder="Ex.: (11) 91234-5678"
                            onSubmitEditing={() => {
                                refs.current.password.current?.focus();
                            }}
                        />
                        <Input label='Senha' errorMessage={errors.password} ref={refs.current.password} keyboard="default" pass value={password} setValue={handlePasswordChange} placeholder="Ex.: ********" onSubmitEditing={handleRegister} />
                        <Column gv={12}>
                            <Button label='Criar conta' onPress={handleRegister} loading={isLoading} disabled={isLoading} />
                            <Pressable onPress={openTerms} style={{ alignItems: 'center', }}>
                                <Label align='center'>Ao criar uma conta, você concorda com nossos <U>Termos de Uso</U> e <U>Política de Privacidade</U>.</Label>
                            </Pressable>
                        </Column>
                    </>
                ) : (
                    <>
                        <Column gv={12} style={{ alignItems: 'center' }}>
                            <Label size={18} align='center'>Verificação de Email</Label>
                            <Label align='center' color="gray">Enviamos um código de 6 dígitos para:</Label>
                            <Label align='center'>{userEmail}</Label>
                        </Column>
                        
                        <Input
                            label='Código de Verificação'
                            errorMessage={errors.verificationCode}
                            value={verificationCode}
                            keyboard="numeric"
                            setValue={handleVerificationCodeChange}
                            ref={refs.current.verificationCode}
                            placeholder="Ex.: 123456"
                            maxLength={6}
                            onSubmitEditing={handleVerifyCode}
                        />
                        
                        <Column gv={12}>
                            <Button label='Verificar Código' onPress={handleVerifyCode} loading={isLoading} disabled={isLoading} />
                            
                            <Pressable onPress={handleResendCode} style={{ alignItems: 'center' }}>
                                <Label align='center' color="primary">Não recebeu o código? <U>Reenviar</U></Label>
                            </Pressable>
                            
                            <Pressable onPress={handleBackToRegister} style={{ alignItems: 'center' }}>
                                <Label align='center' color="gray">Voltar ao cadastro</Label>
                            </Pressable>
                        </Column>
                    </>
                )}
            </Column>

            <Column style={{ height: 200, }} />
        </ScrollVertical>

    </Main>)
}