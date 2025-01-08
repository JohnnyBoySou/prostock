import { fetchWithAuth } from "../../hooks/api";

interface Category extends Record<string, unknown> {
    nome: string;
    status: string;
}

export const listCategory = async (page: number = 1) => {
    try {
        const res = await fetchWithAuth("/usuarios/categoria"+"?page="+page, { method: "GET"});
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const addCategory = async ( params: Category) => {
    try {
        const res = await fetchWithAuth("/usuarios/categoria", { method: "POST", data: params });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const editCategory = async (id: number, params: Category) => {
    try {
        const res = await fetchWithAuth("/usuarios/categoria/"+id, { method: "PUT", data: params });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const showCategory = async (id: number, ) => {
    try {
        const res = await fetchWithAuth("/usuarios/categoria/"+id, { method: "GET",  });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteCategory = async (id: number, ) => {
    try {
        const res = await fetchWithAuth("/usuarios/categoria/"+id, { method: "DELETE", data: {}  });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}