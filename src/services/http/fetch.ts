import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { TokenService } from "./token";
import { StoreService } from "./store";

const TIMEOUT = 5000;
const BASE_URL = "http://localhost:3000";

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
});


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
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
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
