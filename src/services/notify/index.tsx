import { fetchWithAuth } from "../../hooks/api";

interface Notify extends Record<string, unknown> {
    id: number;
    title: string;
    type: string;
    desc: string;
    IDUsuario: number;
    created_at: string;
    updated_at: string;
    date: string;
}

export const listNotify  = async (page: number = 1) => {
    try {
        const res = await fetchWithAuth("/usuarios/notificacoes" + "?page=" + page, {  method: "GET",  });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const singleNotify = async (id: string) => {
    try {
        const res = await fetchWithAuth("/usuarios/notificacao/" + id, { method: "GET" });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
