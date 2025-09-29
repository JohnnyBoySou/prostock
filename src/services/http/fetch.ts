import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { TokenService } from "./token";
import { StoreService } from "./store";

const TIMEOUT = 5000;

const getBaseURL = () => {
  if (__DEV__) {
    const possibleURLs = [
      "https://api.25stock.com",
      "http://localhost:3000", 
      "http://192.168.3.56:3000", 
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
  validateStatus: (status) => status >= 200 && status < 300,
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
    
    const requestConfig = {
      url,
      method,
      params: options.params,
      ...options,
    };
    
    console.log(`🌐 [FETCH] ${method} ${BASE_URL}${url}`);
    console.log(`📦 [FETCH] Body:`, JSON.stringify(requestConfig.data, null, 2));
    console.log(`🔍 [FETCH] Params:`, JSON.stringify(requestConfig.params, null, 2));
    
    const response: AxiosResponse<T> = await apiClient.request(requestConfig);

    return response.data;
  } catch (error: any) {
    console.error(`Error fetching ${url}:`, error);
    
    // Preservar informações do erro HTTP
    if (error.response) {
      const errorData = error.response.data || {};
      const httpError = {
        ...errorData,
        status: error.response.status,
        statusCode: error.response.status,
        message: errorData.message || error.message || 'Erro na requisição'
      };
      throw httpError;
    }
    
    throw error;
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
    const requestConfig = {
      url,
      method,
      headers: {
        ...options.headers,
        lojaid: store.id,
        Authorization: `Bearer ${token}`,
      },
      params: method === "GET" ? { ...options.params, ...options.data } : options.params,
      data: method !== "GET" ? options.data : undefined,
    };
    
    console.log(`🔐 [FETCH_AUTH] ${method} ${BASE_URL}${url}`);
    console.log(`🏪 [FETCH_AUTH] Store ID: ${store.id}`);
    console.log(`📦 [FETCH_AUTH] Body:`, JSON.stringify(requestConfig.data, null, 2));
    console.log(`🔍 [FETCH_AUTH] Params:`, JSON.stringify(requestConfig.params, null, 2));
    
    const response: AxiosResponse<T> = await apiClient.request(requestConfig);

    return response.data;
  } catch (error: any) {
    console.error(`Error fetching with auth at ${url}:`, error.response?.data || error.message);
    // Preservar informações do erro HTTP
    if (error.response) {
      const errorData = error.response.data || {};
      const httpError = {
        ...errorData,
        status: error.response.status,
        statusCode: error.response.status,
        message: errorData.message || error.message || 'Erro na requisição'
      };
      throw httpError;
    }
    
    throw error;
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
    const requestConfig = {
      url,
      method,
      headers: {
        ...options.headers, 
        Authorization: `Bearer ${token}`,
      },
      params: options.params,
      data: options.data,
    };
    
    console.log(`🔓 [FETCH_AUTH_OTHER] ${method} ${BASE_URL}${url}`);
    console.log(`📦 [FETCH_AUTH_OTHER] Body:`, JSON.stringify(requestConfig.data, null, 2));
    console.log(`🔍 [FETCH_AUTH_OTHER] Params:`, JSON.stringify(requestConfig.params, null, 2));
    
    const response: AxiosResponse<T> = await apiClient.request(requestConfig);

    return response.data;
  } catch (error: any) {
    console.error(`Error fetching with auth at ${url}:`, error.response?.data || error.message);
    // Preservar informações do erro HTTP
    if (error.response) {
      const errorData = error.response.data || {};
      const httpError = {
        ...errorData,
        status: error.response.status,
        statusCode: error.response.status,
        message: errorData.message || error.message || 'Erro na requisição'
      };
      throw httpError;
    }
    
    throw error;
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
    
    const requestConfig = {
      url,
      method,
      headers: {
        ...options.headers,
      },
      params: options.params,
      data: options.data,
    };
    
    console.log(`🌍 [FETCH_NO_AUTH] ${method} ${BASE_URL}${url}`);
    console.log(`📦 [FETCH_NO_AUTH] Body:`, JSON.stringify(requestConfig.data, null, 2));
    console.log(`🔍 [FETCH_NO_AUTH] Params:`, JSON.stringify(requestConfig.params, null, 2));
    
    const response: AxiosResponse<T> = await apiClient.request(requestConfig);

    return response.data;
  } catch (error) {
    console.error(`Error fetching with auth at ${url}:`, error);
    throw error;
  }
}
