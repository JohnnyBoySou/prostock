import { fetchWithAuth } from "../../hooks/api";

interface User extends Record<string, unknown> {
    nome: string;
    sobrenome: string;
    email: string;
    password: string;
    cpf: number;
    telefone: number;
    tipo: string | 'adminloja' | 'superadmin' | 'regular';
    lojas: Array<number>;
}

export const listUser = async (page: number = 1) => {
    try {
        const res = await fetchWithAuth("/usuarios/usuario" + "?page=" + page, {
            method: "GET", 
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const addUser = async (params: User) => {
    try {
        const res = await fetchWithAuth("/usuarios/usuario", {
            method: "POST",
            data: params,
           
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const editUser = async (id: number, params: User) => {
    try {
        const res = await fetchWithAuth("/usuarios/usuario/" + id, {
            method: "PUT", data: params, 
            
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const showUser = async (id: number) => {
    try {
        const res = await fetchWithAuth("/usuarios/usuario/" + id, {
            method: "GET", 
            
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteUser = async (id: number) => {
    try {
        const res = await fetchWithAuth("/usuarios/usuario/" + id, {
            method: "DELETE", data: {},
           });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}