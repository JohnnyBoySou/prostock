import { fetchWithAuth } from "../../hooks/api";

interface Supplier extends Record<string, unknown> {
    razao_social: string;
    nome_fantasia: string;
    email_responsavel: string;
    cnpj: number;
    cpf_responsavel: number;
    telefone_responsavel: number;
    endereco: string;
    cidade: string;
    estado: string;
    cep: number;
    status: string;
    nome_responsavel: string;
}

export const listSupplier = async (page: number = 1) => {
    try {
        const res = await fetchWithAuth("/usuarios/fornecedor" + "?page=" + page, {
            method: "GET", 
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const addSupplier = async (params: Supplier) => {
    try {
        const res = await fetchWithAuth("/usuarios/fornecedor", {
            method: "POST",
            data: params,
           
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const editSupplier = async (id: number, params: Supplier) => {
    try {
        const res = await fetchWithAuth("/usuarios/fornecedor/" + id, {
            method: "PUT", data: params, 
            
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const showSupplier = async (id: number) => {
    try {
        const res = await fetchWithAuth("/usuarios/fornecedor/" + id, {
            method: "GET", 
            
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteSupplier = async (id: number) => {
    try {
        const res = await fetchWithAuth("/usuarios/fornecedor/" + id, {
            method: "DELETE", data: {},
           });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}