import { fetchAuth } from "@/services/http/fetch";
import axios from "axios";

export interface Owner {
    id: string;
    name: string;
    email: string;
}

export interface StoreCount {
    products: number;
    users: number;
}

export interface Store extends Record<string, unknown> {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    cep: string;
    city: string;
    state: string;
    address: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    owner: Owner;
    _count: StoreCount;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface StoreListResponse {
    stores: Store[];
    pagination: Pagination;
}

export interface StoreCreateRequest extends Record<string, unknown> {
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    cep: string;
    city: string;
    state: string;
    address: string;
    status: boolean;
}

const URI = "/stores"

const getCep = async (cep: string) => {
    try {
        const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        return res.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const StoreService = {
    create: (params: StoreCreateRequest) => fetchAuth(URI, { method: "POST", data: params }),
    list: (): Promise<StoreListResponse> => fetchAuth(URI, { method: "GET" }),
    update: (id: string, params: Partial<StoreCreateRequest>) => fetchAuth(`${URI}/${id}`, { method: "PUT", data: params }),
    single: (id: string): Promise<Store> => fetchAuth(`${URI}/${id}`, { method: "GET" }),
    delete: (id: string) => fetchAuth(`${URI}/${id}`, { method: "DELETE" }),
    search: (name: string): Promise<StoreListResponse> => fetchAuth(URI, { method: "GET", params: { name: name } }),

    getCep: (cep: string) => getCep(cep),
}