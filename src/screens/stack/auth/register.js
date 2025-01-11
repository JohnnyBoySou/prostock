import { useState, useRef } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical } from "@/ui";

export default function RegisterScreen() {

    //INPUTS FORM
    const [password, setpassword] = useState();
    const [email, setemail] = useState();
    
    const [name, setname] = useState();    
    const [lastname, setlastname] = useState();
    const [phone, setphone] = useState();
    const [cpf, setcpf] = useState();

    //STATES FOR FORM
    const [success, setSuccess] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    //REFS FOR FORM
    const refLastname = useRef();
    const refCpf = useRef();
    const refPhone = useRef();
    const refEmail = useRef();
    const refPassword = useRef();


    const isValidCpf = (cpf) => {
        const formattedCpf = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        return formattedCpf.test(cpf);
    };

    // Função para validar telefone formatado
    const isValidPhone = (phone) => {
        const formattedPhone = /^\(\d{2}\) \d{5}-\d{4}$/; // Formato (XX) XXXXX-XXXX
        return formattedPhone.test(phone);
    };

    const handleRegister = async () => {
        setError("");
        setSuccess("");
        // Validações de cada campo
        if (!name) {
            setError("Por favor, insira seu nome.");
            return;
        }
        if (!lastname) {
            setError("Por favor, insira seu sobrenome.");
            return;
        }
       if (!cpf || !isValidCpf(cpf)) {
            setError("Por favor, insira um CPF válido (###.###.###-##).");
            return;
        }
        if (!phone || !isValidPhone(phone)) {
            setError("Por favor, insira um telefone válido ((XX) XXXXX-XXXX).");
            return;
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError("Por favor, insira um email válido.");
            return;
        }
        if (!password || password.length < 6) {
            setError("A senha deve conter pelo menos 6 caracteres.");
            return;
        }
        setIsLoading(true);

        try {
            // Simula uma chamada de API
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSuccess("Cadastro realizado com sucesso!");
        } catch (e) {
            setError("Erro ao realizar o cadastro. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (<Main>
        <ScrollVertical>
        <Column mh={26} gv={26}>
            <Input label='Nome' keyboard="default" value={name} setValue={setname} placeholder="Ex.: João" onSubmitEditing={() => { refLastname.current.focus() }} />
            <Input label='Sobrenome' keyboard="default"  value={lastname} ref={refLastname} setValue={setlastname} placeholder="Ex.: Medeiros Silva" onSubmitEditing={() => { refCpf.current.focus() }} />
            <Input label='CPF' mask="CPF" keyboard="numeric" value={cpf} setValue={setcpf} ref={refCpf} placeholder="Ex.: 000.000.000-00" onSubmitEditing={() => { refPhone.current.focus() }} />
            <Input label='Telefone' mask="PHONE" keyboard="phone-pad" value={phone} setValue={setphone} ref={refPhone} placeholder="Ex.: (00) 00000-0000"  onSubmitEditing={() => { refEmail.current.focus() }} />
            <Input label='Email' value={email} keyboard="email-address" setValue={setemail} ref={refEmail} placeholder="Ex.: exemplo@email.com" onSubmitEditing={() => { refPassword.current.focus() }} />
            <Input label='Senha' ref={refPassword} keyboard="default" pass value={password} setValue={setpassword} placeholder="Ex.: ********" onSubmitEditing={handleRegister} />
            <Message success={success} error={error} />
            <Column>
                <Button label='Criar conta' onPress={handleRegister} loading={isLoading} />
                <Button label='Esqueci minha senha' variant='link' />
            </Column>
            </Column>

            <Column style={{ height: 200, }} />
        </ScrollVertical>
            
    </Main>)
}