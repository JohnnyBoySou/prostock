import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { TokenService } from "./token";
import { StoreService } from "./store";

const TIMEOUT = 5000;

const getBaseURL = () => {
  if (__DEV__) {
    const possibleURLs = [
      "http://192.168.3.56:3000", 
      "http://localhost:3000", 
    ];
    
    return possibleURLs[0]; 
  }
  
  return "https://your-tunnel-url.ngrok.io"; // Substitua pela sua URL do tunnel
};

const BASE_URL = getBaseURL();

interface FetchApiOptions extends AxiosRequestConfig {
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
  params?: Record<string, string | number | boolean | unknown> ;
}

type ApiResponse<T> = T | null;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: TIMEOUT,
  // Configurações para evitar problemas de tunnel
  maxRedirects: 5,
  validateStatus: (status) => status < 500,
});

// Interceptor para tratamento de erros de tunnel
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message.includes('Body is unusable')) {
      console.warn('Tunnel error detected, retrying...');
      // Retry automático para erros de tunnel
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          apiClient.request(error.config).then(resolve).catch(reject);
        }, 2000);
      });
    }
    return Promise.reject(error);
  }
);


export async function fetch<T = unknown>(
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
  } catch (error: any) {
    console.error(`Error fetching ${url}:`, error);
    throw error.response?.data || error;
  }
}

export async function fetchAuth<T = unknown>(
  url: string,
  options: FetchApiOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const token = await TokenService.get();
    const store = await StoreService.get();
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

export async function fetchAuthOtherStore<T = unknown>(
  url: string,
  options: FetchApiOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const token = await TokenService.get(); 
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

export async function fetchNoAuth<T = unknown>(
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
