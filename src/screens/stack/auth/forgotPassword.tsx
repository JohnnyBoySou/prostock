import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Main, Title, Column, Input, Button, Label } from '@/ui';
import { AuthService } from '@/services/auth';
import { useToast } from '@/hooks/useToast';

type Step = 'email' | 'code' | 'password';

export default function ForgotPasswordScreen({ navigation }) {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useToast();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSendCode = async () => {
        if (!email.trim()) {
            showError('Por favor, insira seu email');
            return;
        }

        if (!validateEmail(email)) {
            showError('Por favor, insira um email válido');
            return;
        }

        setLoading(true);
        try {
            const response = await AuthService.forgotPassword(email);
            showSuccess(response.message || 'Código enviado para seu email');
            setStep('code');
        } catch (error: any) {
            showError(error.message || 'Erro ao enviar código');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!code.trim()) {
            showError('Por favor, insira o código');
            return;
        }

        if (code.length !== 6) {
            showError('O código deve ter exatamente 6 dígitos');
            return;
        }

        if (!/^\d{6}$/.test(code)) {
            showError('O código deve conter apenas números');
            return;
        }

        setLoading(true);
        try {
            const response = await AuthService.verifyResetCode(email, code);
            console.log(response)
            showSuccess(response.message || 'Código verificado com sucesso');
            setStep('password');
        } catch (error: any) {
            console.error('Erro ao verificar código:', error);
            console.log('Tipo do erro:', typeof error);
            console.log('Status do erro:', error.status, error.statusCode);
            console.log('Mensagem do erro:', error.message);

            // Tratar diferentes tipos de erro
            if (error.status === 401 || error.statusCode === 401) {
                showError('Código inválido ou expirado. Verifique o código e tente novamente.');
            } else if (error.message) {
                showError(error.message);
            } else if (typeof error === 'string') {
                showError(error);
            } else {
                showError('Erro ao verificar código. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!password.trim()) {
            showError('Por favor, insira uma nova senha');
            return;
        }

        if (password.length < 6) {
            showError('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            showError('As senhas não coincidem');
            return;
        }

        setLoading(true);
        try {
            const response = await AuthService.resetPassword(email, code, password);
            showSuccess(response.message || 'Senha redefinida com sucesso');

            setTimeout(() => {
                navigation.navigate('Login')
            }, 2000);
        } catch (error: any) {
            console.error('Erro ao redefinir senha:', error);

            if (error.status === 401 || error.statusCode === 401) {
                showError('Código expirado. Solicite um novo código de verificação.');
                setStep('email');
            } else if (error.message) {
                showError(error.message);
            } else if (typeof error === 'string') {
                showError(error);
            } else {
                showError('Erro ao redefinir senha. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (step === 'code') {
            setStep('email');
        } else if (step === 'password') {
            setStep('code');
        }
    };

    const renderEmailStep = () => (
        <Column gv={26}>
            <Title>Esqueci minha senha</Title>
            <Label size={16} color="#666" style={{ marginBottom: 20 }}>
                Digite seu email para receber um código de verificação
            </Label>

            <Input
                placeholder="Email"
                value={email}
                setValue={setEmail}
                keyboard="email-address"
                style={{ marginBottom: 20 }}
            />

            <Button
                label="Enviar Código"
                onPress={handleSendCode}
                loading={loading}
                disabled={loading}
            />
        </Column>
    );

    const renderCodeStep = () => (
        <Column gv={26}>
            <Title>Verificar Código</Title>
            <Label size={16} color="#666" style={{ marginBottom: 20 }}>
                Digite o código de 6 dígitos enviado para {email}
            </Label>

            <Input
                placeholder="Código de verificação"
                value={code}
                setValue={(value) => {
                    const numericValue = value.replace(/[^0-9]/g, '');
                    if (numericValue.length <= 6) {
                        setCode(numericValue);
                    }
                }}
                keyboard="numeric"
                maxLength={6}
                style={{ marginBottom: 20 }}
            />

            <Column gv={12}>
                <Button
                    label="Verificar Código"
                    onPress={handleVerifyCode}
                    loading={loading}
                    disabled={loading}
                />

                <Button
                    label="Voltar"
                    onPress={handleBack}
                    variant="outline"
                    disabled={loading}
                />
            </Column>
        </Column>
    );

    const renderPasswordStep = () => (
        <Column gv={26}>
            <Title>Nova Senha</Title>
            <Label size={16} color="#666" style={{ marginBottom: 20 }}>
                Digite sua nova senha
            </Label>

            <Input
                placeholder="Nova senha"
                value={password}
                setValue={setPassword}
                pass={true}
                style={{ marginBottom: 15 }}
            />

            <Input
                placeholder="Confirmar nova senha"
                value={confirmPassword}
                setValue={setConfirmPassword}
                pass={true}
                style={{ marginBottom: 20 }}
            />

            <Column gv={12}>
                <Button
                    label="Redefinir Senha"
                    onPress={handleResetPassword}
                    loading={loading}
                    disabled={loading}
                />

                <Button
                    label="Voltar"
                    onPress={handleBack}
                    variant="outline"
                    disabled={loading}
                />
            </Column>
        </Column>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <Main>
                <Column mh={26} mv={26}>
                    {step === 'email' && renderEmailStep()}
                    {step === 'code' && renderCodeStep()}
                    {step === 'password' && renderPasswordStep()}
                </Column>
            </Main>
        </KeyboardAvoidingView>
    );
}
