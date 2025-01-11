import { fetchWithAuth } from "../../hooks/api";

interface Move extends Record<string, unknown> {
    tipo: string;
    quantidade: number;
    preco: number;
    produto_id: number;
    
    fornecedor_id: number;
    lote: string;
    validade: string;
    
    observacoes: string;
}

export const listMove = async (page: number = 1) => {
    try {
        const res = await fetchWithAuth("/usuarios/movimentacao" + "?page=" + page, {
            method: "GET", 
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const addMove = async (params: Move) => {
    try {
        const res = await fetchWithAuth("/usuarios/movimentacao", {
            method: "POST",
            data: params,
           
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const editMove = async (id: number, params: Move) => {
    try {
        const res = await fetchWithAuth("/usuarios/movimentacao/" + id, {
            method: "PUT", data: params, 
            
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const showMove = async (id: number) => {
    try {
        const res = await fetchWithAuth("/usuarios/movimentacao/" + id, {
            method: "GET", 
            
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteMove = async (id: number) => {
    try {
        const res = await fetchWithAuth("/usuarios/movimentacao/" + id, {
            method: "DELETE", data: {},
           });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}