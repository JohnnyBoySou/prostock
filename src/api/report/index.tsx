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
const formatDateForLaravel = (date: string | null = null) => {
    if(!date) return null;
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
};

//LISTAGEM COM DATA
export const listReportStore = async (page: number = 1, datac: string, dataf: string) => {
    const c = formatDateForLaravel(datac);
    const f = formatDateForLaravel(dataf);
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/lojas" + "?page=" + page, {
            method: "GET",
            data: { "datac": c, "dataf": f }
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const searchReportStore = async (name: string) => {
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/lojas" + "?busca=" + name, {
            method: "GET",
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const listReportProduct = async (id: number, page: number = 1, datac: string, dataf: string) => {
    const c = formatDateForLaravel(datac);
    const f = formatDateForLaravel(dataf);
    try {
        const res = await fetchWithAuthOtherStore("/usuarios/estatisticas/produtos" + "?page=" + page + `&datac=${c}&dataf=${f}`, {
            method: "GET",
            headers: { "lojaid": id.toString() }
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const listReportProductSearch = async (id: number, name: string, datac: string, dataf: string) => {
    const c = formatDateForLaravel(datac);
    const f = formatDateForLaravel(dataf);
    try {
        const res = await fetchWithAuthOtherStore("/usuarios/estatisticas/produtos" + "?busca=" + name + `&datac=${c}&dataf=${f}`, {
            method: "GET",
            headers: { "lojaid": id.toString() }
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const listReportSupplier = async (id: number, page: number = 1, datac: string, dataf: string) => {
    const c = formatDateForLaravel(datac);
    const f = formatDateForLaravel(dataf);
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/fornecedores" + "?page=" + page + `&datac=${c}&dataf=${f}`, {
            method: "GET",
            headers: { "lojaid": id.toString() }
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const listReportSupplierSearch = async (id: number, name: string, datac: string, dataf: string) => {
    const c = formatDateForLaravel(datac);
    const f = formatDateForLaravel(dataf);
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/fornecedores" + "?busca=" + name + `&datac=${c}&dataf=${f}`, {
            method: "GET",
            headers: { "lojaid": id.toString() }
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

//SHOW SEM DATA
export const showReportStore = async (id: number, fornecedor_id: string, produto_id: string) => {
    try {
        const res = await fetchWithAuth("/usuarios/estatisticas/loja/" + id, {
            method: "GET",
            data: {
                "fornecedor_id": fornecedor_id,
                "produto_id": produto_id,
            },
            //  headers: { "lojaid": id.toString() }
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
export const showReportProduct = async (produto_id: number, lojaid: number, ) => {
    try {
        const res = await fetchWithAuthOtherStore("/usuarios/estatisticas/produto/" + produto_id, {
            method: "GET",
            headers: { "lojaid": lojaid.toString() }
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const showReportProductLine = async (produto_id: number, lojaid: number, fornecedor_id: number | null = null, datac: string | null = null, dataf: string | null = null, tab: string) => {
    const c = formatDateForLaravel(datac);
    const f = formatDateForLaravel(dataf);
    const type = tab === 'Saída' ? 'saida' : tab == 'Entrada' ? 'entrada' : tab == 'Perdas' ? 'perda' : tab == 'Devoluções' ? 'devolucao' : tab == '' ? '' : 'saida'; 
    try {
        const res: any = await fetchWithAuthOtherStore("/usuarios/estatisticas/linechat", {
            method: "GET",
            headers: { "lojaid": lojaid.toString() },
            params: {
                "fornecedor_id": fornecedor_id,
                "produto_id": produto_id,
                "datac": c,
                "dataf": f,
                "tipo": type,
            },
        });
        const lineData = res?.data?.map((item: any) => { return { value: parseInt(item?.value), label: item?.label } });
        return lineData;
    } catch (error) {
        console.log(error.request)
        throw new Error(error.message);
    }
}

export const showReportSupplier = async (id: number, lojaid: number) => {
    try {
        const res = await fetchWithAuthOtherStore("/usuarios/estatisticas/loja/" + id, {
            method: "GET",
            data: {
                "fornecedor_id": id
            },
            headers: { "lojaid": lojaid.toString() }
        });
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}
