import { fetchWithAuth } from "../../hooks/api";
import axios from "axios";

interface Store extends Record<string, unknown> {
    nome: string;
    endereco: string,
    cidade: string,
    estado: string,
    cep: number,
    telefone: number,
    email: string,
    cnpj: number,
    status: string,
}

export const listStore = async (page: number = 1) => {
    try {
        const res = await fetchWithAuth("/usuarios/loja" + "?page=" + page, {
            method: "GET", 
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const getCep = async (cep:string) =>{
    try {
        const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        return res.data;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const addStore = async (params: Store) => {
    try {
        const res = await fetchWithAuth("/usuarios/loja", {
            method: "POST",
            data: params,
           
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const editStore = async (id: number, params: Store) => {
    try {
        const res = await fetchWithAuth("/usuarios/loja/" + id, {
            method: "PUT", data: params, 
            
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const showStore = async (id: number) => {
    try {
        const res = await fetchWithAuth("/usuarios/loja/" + id, {
            method: "GET", 
            
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteStore = async (id: number) => {
    try {
        const res = await fetchWithAuth("/usuarios/loja/" + id, {
            method: "DELETE", data: {},
           });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}