const fields = {
    name: {
        label: "Nome",
        placeholder: "Ex.: João",
        keyboardType: "default",
    },
    last_name: {
        label: "Sobrenome",
        placeholder: "Ex.: Medeiros Silva",
        keyboardType: "default",
    },
    email: {
        label: "Email",
        placeholder: "Ex.: email@exemplo.com",
        keyboardType: "email-address"
    },
    phone: {
        label: "Telefone",
        placeholder: "Ex.: (49) 99193-5657",
        keyboardType: "number-pad",
        mask: "PHONE",
    },
    cpf: {
        label: "CPF",
        placeholder: "Ex.: 000.000.000-00",
        keyboardType: "numeric",
        mask: "CPF"
    },
    cnpj: {
        label: 'CNPJ',
        placeholder: "Ex.: 00.000.000/0000-00",
        keyboardType: "numeric",
        mask: "CNPJ"
    },
    password: {
        label: "Senha",
        placeholder: "Ex.: ********",
        keyboardType: "default",
        pass: true,
    }, 
    cep: {
        label: "CEP",
        placeholder: "Ex.: 00000-000",
        keyboardType: "numeric",
        mask: "CEP" 
    },
    city: {
        label: "Cidade",
        placeholder: "Ex.: São Paulo",
        keyboardType: "default",
    }, 
    state: {
        label: "Estado",
        placeholder: "Ex.: SP",
        keyboardType: "default",
    },
    street: {
        label: "Endereço",
        placeholder: "Ex.: Rua das Flores, 123",
        keyboardType: "default",
    },
    razao_social: {
        label: "Razão Social",
        placeholder: "Ex.: Empresa XYZ Ltda",
        keyboardType: "default",
    },
    nome_fantasia: {
        label: "Nome Fantasia",
        placeholder: "Ex.: Empresa XYZ",
        keyboardType: "default",
    },
    nome_responsavel: {
        label: "Nome do Responsável",
        placeholder: "Ex.: João da Silva",
        keyboardType: "default",
    },
    email_responsavel: {
        label: "Email do Responsável",
        placeholder: "Ex.: responsavel@exemplo.com",
        keyboardType: "email-address",
    },
    cpf_responsavel: {
        label: "CPF do Responsável",
        placeholder: "Ex.: 000.000.000-00",
        keyboardType: "numeric",
        mask: "CPF",
    },
    telefone_responsavel: {
        label: "Telefone do Responsável",
        placeholder: "Ex.: (49) 99193-5657",
        keyboardType: "number-pad",
        mask: "PHONE",
    },
    preco: {
        label: "Preço",
        placeholder: "Ex.: R$ 100,00",
        keyboardType: "numeric",
        mask:"PRICE",
    },
    quantidade: {
        label: "Quantidade",
        placeholder: "Ex.: 100",
        keyboardType: "numeric",
    },
    validade: {
        label: "Validade",
        placeholder: "Ex.: 01/01/2022",
        keyboardType: "numeric",
        mask: "DATE",
    },
    lote: {
        label: "Lote",
        placeholder: "Ex.: 123456",
        keyboardType: "numeric",
    },
    descricao: {
        label: "Descrição",
        placeholder: "Ex.: Produto de alta qualidade",
        keyboardType: "default",
    },
};
export default fields;