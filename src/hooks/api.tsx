import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { getToken } from "./token";
import { getStore } from "./store";

const baseURL = "https://stock.engenhariadigital.net/api";

interface FetchApiOptions extends AxiosRequestConfig {
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
  params?: Record<string, string | number | boolean | unknown> ;
}

type ApiResponse<T> = T | null;

const apiClient = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

export async function fetchApi<T = unknown>(
  url: string,
  options: FetchApiOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const method = options.method?.toUpperCase() || "GET";
    if (method !== "GET" && !options.data) {
      throw new Error(`Data is required for ${method} requests.`);
    }
    const response: AxiosResponse<T> = await apiClient.request({
      url,
      method,
      params: options.params,
      ...options,
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
}
export async function fetchWithAuth<T = unknown>(
  url: string,
  options: FetchApiOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const token = await getToken();
    const store = await getStore();
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const method = options.method?.toUpperCase() || "GET";
    const response: AxiosResponse<T> = await apiClient.request({
      url,
      method,
      headers: {
        ...options.headers,
        lojaid: store.id,
        Authorization: `Bearer ${token}`,
      },
      params: method === "GET" ? { ...options.params, ...options.data } : options.params,
      data: method !== "GET" ? options.data : undefined,
    });

    return response.data;
  } catch (error: any) {
    console.error(`Error fetching with auth at ${url}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
}


export async function fetchWithAuthOtherStore<T = unknown>(
  url: string,
  options: FetchApiOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const token = await getToken(); 
    if (!token) {
      throw new Error("Authentication token not found.");
    }

    const method = options.method?.toUpperCase() || "GET";
    const response: AxiosResponse<T> = await apiClient.request({
      url,
      method,
      headers: {
        ...options.headers, 
        Authorization: `Bearer ${token}`,
      },
      params: options.params,
      data: options.data,
    });

    return response.data;
  } catch (error: any) {
    console.error(`Error fetching with auth at ${url}:`, error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

export async function fetchWithNoAuth<T = unknown>(
  url: string,
  options: FetchApiOptions = {}
): Promise<ApiResponse<T>> {
  try {
    

    const method = options.method?.toUpperCase() || "GET";
    if (method !== "GET" && !options.data) {
      throw new Error(`Data is required for ${method} requests.`);
    }
    const response: AxiosResponse<T> = await apiClient.request({
      url,
      method,
      headers: {
      ...options.headers,
      },
      params: options.params,
      data: options.data,
    });

    return response.data;
  } catch (error) {
    console.error(`Error fetching with auth at ${url}:`, error);
    throw error;
  }
}

// Exemplo de uso (sem autenticação):
// fetchApi('/search/', { method: 'GET' });

// Exemplo de uso (com autenticação):
// fetchWithAuth('/search/', {
//   method: 'POST',
//   data: {
//     name: "string",
//     capa: "string",
//     color: "string",
//     descricao: "string",
//     mangas_id: ["string"],
//     type: "post",
//   },
// });
