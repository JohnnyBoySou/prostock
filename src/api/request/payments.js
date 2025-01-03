import axios from 'axios';

import getToken from '@hooks/getToken';
import getBaseURL from '@hooks/getBaseUrl';

export async function payPix(params) {
    const BASE_URL = await getBaseURL()
    const token = await getToken()
    try {
        const res = await axios.post(`${BASE_URL}/usuarios/criadoacaopix`, {
            'IDinstituicao': params.ong,
            'valor': params.value,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error)
        const err = JSON.parse(error.request.response);
        throw new Error(err.message)
    }
}


export async function payBoleto(params) {
    const BASE_URL = await getBaseURL()
    const token = await getToken()
    try {
        const res = await axios.post(`${BASE_URL}/usuarios/criadoacaoboleto`, {
            'IDinstituicao': params.ong,
            'valor': params.value,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error)
        const err = JSON.parse(error.request.response);
        throw new Error(err.message)
    }
}

export async function getStatusPay(transacao) {
    const BASE_URL = await getBaseURL()
    const token = await getToken()
    try {
        const res = await axios.post(`${BASE_URL}/usuarios/getstatus`, {
            'IDtransacao': transacao,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error)
        const err = JSON.parse(error.request.response);
        throw new Error(err.message)
    }
}


export async function payCredito(params) {
    const BASE_URL = await getBaseURL()
    const token = await getToken()

    const {  ong, value, nome, cvv, meseano,  numerocartao } = params
    try {
        const res = await axios.post(`${BASE_URL}/usuarios/criadoacaocartao`, {
            "nome": nome,
            "numerocartao": numerocartao,
            "cvv": cvv,
            "mes": meseano.slice(0, 2),
            "ano": meseano.slice(3, 5),
            "valor": value,
            "IDinstituicao": ong,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(res.data)
        return res.data;
    }catch (error) {
        let errMsg;
        try {
            const err = JSON.parse(error.request.response);
            errMsg = err.message;
        } catch (e) {
            errMsg = error.message;
        }
        throw new Error(errMsg);
      }
}


export async function getPaySingle(id) {
    const BASE_URL = await getBaseURL()
    const token = await getToken()
    try {
        const res = await axios.post(`${BASE_URL}/usuarios/getdadospixboleto`, {
            'iddoacao': id,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        let errMsg;
        try {
            const err = JSON.parse(error.request.response);
            errMsg = err.message;
        } catch (e) {
            errMsg = error.message;
        }
        throw new Error(errMsg);
    }
}