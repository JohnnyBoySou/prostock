import { fetchWithAuth, fetchWithAuthOtherStore } from "../../hooks/api";

interface Product extends Record<string, unknown> {
    nome: string;
    descricao: string;
    unidade: string;
    estoque_minimo: string;
    estoque_maximo: string;
    status: string;
    categorias: string[];
}

export const listProduct = async (page: number = 1) => {
    try {
        const res = await fetchWithAuth("/usuarios/produto" + "?page=" + page, { method: "GET" });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const searchProduct = async (name: string) => {
    try {
        const res = await fetchWithAuth("/usuarios/produto" + "?busca=" + name, { method: "GET" });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const importProduct = async (data: any) => {
    try {
        const res = await fetchWithAuth("/usuarios/upload/produtos", {
            method: "POST",
            data: { "csv": data },
        }
        );
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const addProduct = async (params: Product) => {
    try {
        const res = await fetchWithAuth("/usuarios/produto", { method: "POST", data: params });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const editProduct = async (id: number, params: Product) => {
    try {
        const res = await fetchWithAuth("/usuarios/produto/" + id, { method: "PUT", data: params });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const showProduct = async (id: number) => {
    try {
        const res = await fetchWithAuth("/usuarios/produto/" + id, { method: "GET", });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteProduct = async (id: number) => {
    try {
        const res = await fetchWithAuth("/usuarios/produto/" + id, { method: "DELETE", data: {} });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const listProductStore = async (id: number, page: number = 1,) => {
    try {
        const res = await fetchWithAuthOtherStore("/usuarios/produto" + "?page=" + page,
            {
                method: "GET",
                headers: { "lojaid": id.toString() }
            },);
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const listProductStoreSearch = async (id: number, name: string,) => {
    try {
        const res = await fetchWithAuthOtherStore("/usuarios/produto" + "?busca=" + name, { method: "GET", headers: { "lojaid": id.toString() } },);
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
