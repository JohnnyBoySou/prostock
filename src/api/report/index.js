
const entadas_saidas_produto =
{
    ...produto,
    nome: "Arroz",
    estatisticas: [
        {
            mes: 'Janeiro',
            entrada: 20000,
            saida: 12000,
            entrada_saida_porcentagem: '25%',
            estoque_maximo: 1000,
            estoque_ocupado: 500,
            estoque_porcentagem: '50%',
        },
        {
            mes: 'Fevereiro',
            entrada: 15000,
            saida: 14000,
            entrada_saida_porcentagem: '25%',
            estoque_maximo: 1000,
            estoque_ocupado: 500,
            estoque_porcentagem: '50%',
        },
        {
            mes: 'Março',
            entrada: 15300,
            saida: 12000,
            entrada_saida_porcentagem: '25%',
            estoque_maximo: 1000,
            estoque_ocupado: 500,
            estoque_porcentagem: '50%',
        },
    ]
}

const estoque_produto = [
    {
        nome: 'Arroz',
        ...produto,
        estoque_maximo: 1000,
        estoque_ocupado: 500,
        porcentagem: '50%',
    },
    {
        nome: 'Feijão',
        ...produto,
        estoque_maximo: 2000,
        estoque_ocupado: 500,
        porcentagem: '25%',
    },
]

const saidas_perdas_lojas = [
    {
        nome_loja: 'Mercadão Seu Jonas',
        saidas: 20000,
        perdas: 1000,
        porcentagem: '5%'
    },
    {
        nome_loja: 'Mercearia Dona Maria',
        saidas: 2000,
        perdas: 300,
        porcentagem: '15%'
    },
]

const saidas_perdas_lojas_produto =
{
    ...produto,
    estatisticas: [
        {
            mes: 'Janeiro',
            entrada: 20000,
            saida: 12000
        },
        {
            mes: 'Fevereiro',
            entrada: 15000,
            saida: 14000
        },
        {
            mes: 'Março',
            entrada: 15300,
            saida: 12000
        },
    ]
}


//LOJAS
const entadas_saidas_loja = [
    {
        ...loja,
        nome_loja: 'Mercearia Dona Maria',
        entrada: 20000,
        saida: 12000,
        entrada_saida_porcentagem: '25%',
        estoque_maximo: 1000,
        estoque_ocupado: 500,
        estoque_porcentagem: '50%',
    },
    {
        ...loja,
        nome_loja: 'Mercearia Juãn ',
        entrada: 2000,
        saida: 1200,
        entrada_saida_porcentagem: '25%',
        estoque_maximo: 2000,
        estoque_ocupado: 300,
        estoque_porcentagem: '50%',
    },
]


//LOJA SINGLE
const loja_estatisticas =
{
    ...loja,
    nome: 'Mercearia Dona Maria',
    funcionarios: 12,
    produtos: 20,
    fornecedores: 14,
    meses: [
        {
            mes: 'Janeiro',
            entrada: 20000,
            saida: 12000,
            entrada_saida_porcentagem: '25%',
            estoque_maximo: 1000,
            estoque_ocupado: 500,
            estoque_porcentagem: '50%',
        },
        {
            mes: 'Fevereiro',
            entrada: 15000,
            saida: 14000,
            entrada_saida_porcentagem: '25%',
            estoque_maximo: 1000,
            estoque_ocupado: 500,
            estoque_porcentagem: '50%',
        },
        {
            mes: 'Março',
            entrada: 15300,
            saida: 12000,
            entrada_saida_porcentagem: '25%',
            estoque_maximo: 1000,
            estoque_ocupado: 500,
            estoque_porcentagem: '50%',
        },
    ]
}