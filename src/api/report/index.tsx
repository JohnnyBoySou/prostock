import { fetchWithAuth, fetchWithAuthOtherStore } from "../../hooks/api";

interface Report extends Record<string, unknown> {
    tipo: string;
    quantidade: number;
    preco: number;
    produto_id: number;
    fornecedor_id: number;
    lote: string;
    validade: string;
    observacoes: string;
}

export const listReportStore = async (page: number = 1) => {
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/lojas" + "?page=" + page, {
            method: "GET", 
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}


export const showReportStore = async (id: number, datac: string, dataf: string) => {
    const formatDateForLaravel = (date: string) => {
        const [day, month, year] = date.split("/");
        return `${year}-${month}-${day}`;
    };
    
    const c = formatDateForLaravel(datac);
    const f = formatDateForLaravel(dataf);
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/loja/" + id, {
            method: "GET", data: { "datac": c, "dataf": f }
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const listReportProduct = async (page: number = 1) => {
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/produtos" + "?page=" + page, {
            method: "GET", 
         });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const showReportProduct = async (id: number, lojaid: number,  datac: string, dataf: string) => {
    
    const formatDateForLaravel = (date: string) => {
        const [day, month, year] = date.split("/");
        return `${year}-${month}-${day}`;
    };
    
    const c = formatDateForLaravel(datac);
    const f = formatDateForLaravel(dataf);
    try {
        const res = await fetchWithAuthOtherStore("/usuarios/estatisticas/produto/" + id, {
            method: "GET", 
            data: { "datac": datac, "dataf": dataf },
            headers: { "lojaid": lojaid.toString() }
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
