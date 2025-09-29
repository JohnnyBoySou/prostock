import { fetchAuth } from "@/services/http/fetch";

// === INTERFACES PARA SUPPLIER ===

export interface Supplier {
  id: string;
  corporateName: string;
  cnpj: string;
  tradeName?: string;
  status: boolean;
  cep?: string;
  city?: string;
  state?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
    movements: number;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SupplierListResponse {
  suppliers: Supplier[];
  pagination: Pagination;
}

export interface CreateSupplierRequest {
  corporateName: string;
  cnpj: string;
  tradeName?: string;
  cep?: string;
  city?: string;
  state?: string;
  address?: string;
}

export interface UpdateSupplierRequest {
  corporateName?: string;
  cnpj?: string;
  tradeName?: string;
  status?: boolean;
  cep?: string;
  city?: string;
  state?: string;
  address?: string;
}

export interface SupplierStatsResponse {
  total: number;
  active: number;
  inactive: number;
  byState: Array<{
    state: string;
    _count: { id: number };
  }>;
  byCity: Array<{
    city: string;
    _count: { id: number };
  }>;
  withProducts: number;
  withoutProducts: number;
  averageProductsPerSupplier: number;
}

export interface TopSupplier {
  id: string;
  corporateName: string;
  cnpj: string;
  tradeName?: string;
  totalProducts: number;
  totalMovements: number;
  totalValue: number;
  lastMovement?: string;
}

export interface SupplierAnalytics {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalSuppliers: number;
    activeSuppliers: number;
    newSuppliers: number;
    averageProductsPerSupplier: number;
  };
  trends: {
    daily: Array<{
      date: string;
      newSuppliers: number;
      activeSuppliers: number;
    }>;
    weekly: Array<{
      week: string;
      newSuppliers: number;
      activeSuppliers: number;
    }>;
    monthly: Array<{
      month: string;
      newSuppliers: number;
      activeSuppliers: number;
    }>;
  };
  topSuppliers: Array<{
    supplierId: string;
    corporateName: string;
    products: number;
    movements: number;
    value: number;
  }>;
  geographicDistribution: Array<{
    state: string;
    city: string;
    count: number;
  }>;
}

export interface SupplierFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  state?: string;
  city?: string;
  hasProducts?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CnpjVerification {
  available: boolean;
  message: string;
  supplier?: Supplier;
}

export interface SupplierProduct {
  id: string;
  name: string;
  description?: string;
  unitOfMeasure: string;
  referencePrice: number;
  currentStock: number;
  stockMin: number;
  stockMax: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierMovement {
  id: string;
  type: 'ENTRADA' | 'SAIDA' | 'PERDA';
  quantity: number;
  price?: number;
  batch?: string;
  expiration?: string;
  note?: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    unitOfMeasure: string;
  };
  store: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface SupplierReport {
  supplier: Supplier;
  summary: {
    totalProducts: number;
    totalMovements: number;
    totalValue: number;
    averageValue: number;
    lastMovement: string;
  };
  products: SupplierProduct[];
  recentMovements: SupplierMovement[];
  monthlyTrends: Array<{
    month: string;
    movements: number;
    value: number;
    products: number;
  }>;
}

const URI = "/suppliers";

export const SupplierService = {
  // === CRUD BÁSICO ===
  create: (params: CreateSupplierRequest): Promise<Supplier> => 
    fetchAuth(URI, { method: "POST", data: params as unknown as Record<string, unknown> }),
  
  list: (filters?: SupplierFilters): Promise<SupplierListResponse> => 
    fetchAuth(URI, { method: "GET", params: filters as Record<string, unknown> }),
  
  get: (id: string): Promise<Supplier> => 
    fetchAuth(`${URI}/${id}`, { method: "GET" }),
  
  update: (id: string, params: UpdateSupplierRequest): Promise<Supplier> => 
    fetchAuth(`${URI}/${id}`, { method: "PUT", data: params as Record<string, unknown> }),
  
  delete: (id: string): Promise<void> => 
    fetchAuth(`${URI}/${id}`, { method: "DELETE" }),

  // === CONSULTAS ESPECÍFICAS ===
  getByCnpj: (cnpj: string): Promise<Supplier> => 
    fetchAuth(`${URI}/cnpj/${cnpj}`, { method: "GET" }),
  
  getByCity: (city: string): Promise<{ suppliers: Supplier[] }> => 
    fetchAuth(`${URI}/city/${city}`, { method: "GET" }),
  
  getByState: (state: string): Promise<{ suppliers: Supplier[] }> => 
    fetchAuth(`${URI}/state/${state}`, { method: "GET" }),
  
  getActive: (): Promise<{ suppliers: Supplier[] }> => 
    fetchAuth(`${URI}/active`, { method: "GET" }),
  
  getStats: (): Promise<SupplierStatsResponse> => 
    fetchAuth(`${URI}/stats`, { method: "GET" }),
  
  search: (q: string, limit?: number): Promise<{ suppliers: Supplier[] }> => 
    fetchAuth(`${URI}/search`, { method: "GET", params: { q, limit } }),
  
  getTopSuppliers: (limit?: number): Promise<{ suppliers: TopSupplier[] }> => 
    fetchAuth(`${URI}/top`, { method: "GET", params: { limit } }),

  // === GERENCIAMENTO DE STATUS ===
  toggleStatus: (id: string): Promise<Supplier> => 
    fetchAuth(`${URI}/${id}/toggle-status`, { method: "PATCH" }),

  // === VALIDAÇÕES ===
  verifyCnpj: (cnpj: string): Promise<CnpjVerification> => 
    fetchAuth(`${URI}/verify-cnpj/${cnpj}`, { method: "GET" }),
  
  validateCnpj: (cnpj: string): Promise<{
    valid: boolean;
    formatted: string;
    message: string;
  }> => 
    fetchAuth(`${URI}/validate-cnpj`, { method: "POST", data: { cnpj } }),

  // === BUSCA AVANÇADA ===
  getByLocation: (state?: string, city?: string): Promise<{ suppliers: Supplier[] }> => 
    fetchAuth(`${URI}/location`, { method: "GET", params: { state, city } }),
  
  getWithProducts: (filters?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<SupplierListResponse> => 
    fetchAuth(`${URI}/with-products`, { method: "GET", params: filters }),
  
  getWithoutProducts: (filters?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<SupplierListResponse> => 
    fetchAuth(`${URI}/without-products`, { method: "GET", params: filters }),

  // === RELATÓRIOS E ANÁLISES ===
  getAnalytics: (filters?: {
    startDate?: string;
    endDate?: string;
    state?: string;
    city?: string;
  }): Promise<SupplierAnalytics> => 
    fetchAuth(`${URI}/analytics`, { method: "GET", params: filters }),
  
  getReport: (id: string, filters?: {
    startDate?: string;
    endDate?: string;
    includeProducts?: boolean;
    includeMovements?: boolean;
  }): Promise<SupplierReport> => 
    fetchAuth(`${URI}/${id}/report`, { method: "GET", params: filters }),
  
  getGeographicDistribution: (): Promise<{
    byState: Array<{
      state: string;
      count: number;
      percentage: number;
    }>;
    byCity: Array<{
      city: string;
      state: string;
      count: number;
    }>;
  }> => 
    fetchAuth(`${URI}/geographic-distribution`, { method: "GET" }),

  // === PRODUTOS E MOVIMENTAÇÕES ===
  getProducts: (id: string, filters?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: boolean;
  }): Promise<{
    products: SupplierProduct[];
    pagination: Pagination;
  }> => 
    fetchAuth(`${URI}/${id}/products`, { method: "GET", params: filters }),
  
  getMovements: (id: string, filters?: {
    page?: number;
    limit?: number;
    type?: 'ENTRADA' | 'SAIDA' | 'PERDA';
    startDate?: string;
    endDate?: string;
  }): Promise<{
    movements: SupplierMovement[];
    pagination: Pagination;
  }> => 
    fetchAuth(`${URI}/${id}/movements`, { method: "GET", params: filters }),
  
  getRecentMovements: (id: string, limit?: number): Promise<{ movements: SupplierMovement[] }> => 
    fetchAuth(`${URI}/${id}/recent-movements`, { method: "GET", params: { limit } }),

  // === OPERAÇÕES EM LOTE ===
  bulkCreate: (suppliers: CreateSupplierRequest[]): Promise<{
    created: number;
    errors: string[];
    suppliers: Supplier[];
  }> => 
    fetchAuth(`${URI}/bulk-create`, { method: "POST", data: { suppliers } }),
  
  bulkUpdate: (updates: Array<{ id: string; data: UpdateSupplierRequest }>): Promise<{
    updated: number;
    errors: string[];
  }> => 
    fetchAuth(`${URI}/bulk-update`, { method: "POST", data: { updates } }),
  
  bulkDelete: (ids: string[]): Promise<{
    deleted: number;
    errors: string[];
  }> => 
    fetchAuth(`${URI}/bulk-delete`, { method: "POST", data: { ids } }),
  
  bulkToggleStatus: (ids: string[], status: boolean): Promise<{
    updated: number;
    errors: string[];
  }> => 
    fetchAuth(`${URI}/bulk-toggle-status`, { method: "POST", data: { ids, status } }),

  // === FUNÇÕES ESPECÍFICAS ===
  getRecent: (limit?: number): Promise<{ suppliers: Supplier[] }> => 
    fetchAuth(`${URI}/recent`, { method: "GET", params: { limit } }),
  
  getInactive: (filters?: {
    page?: number;
    limit?: number;
    daysSinceLastActivity?: number;
  }): Promise<SupplierListResponse> => 
    fetchAuth(`${URI}/inactive`, { method: "GET", params: filters }),
  
  getByProductCount: (minProducts?: number, maxProducts?: number): Promise<{ suppliers: Supplier[] }> => 
    fetchAuth(`${URI}/by-product-count`, { method: "GET", params: { minProducts, maxProducts } }),

  // === RELATÓRIOS ESPECÍFICOS ===
  getPerformanceReport: (filters?: {
    startDate?: string;
    endDate?: string;
    state?: string;
    city?: string;
  }): Promise<{
    topPerformers: Array<{
      supplier: Supplier;
      metrics: {
        totalProducts: number;
        totalMovements: number;
        totalValue: number;
        averageValue: number;
        growthRate: number;
      };
    }>;
    underPerformers: Array<{
      supplier: Supplier;
      metrics: {
        totalProducts: number;
        totalMovements: number;
        totalValue: number;
        lastActivity: string;
      };
    }>;
  }> => 
    fetchAuth(`${URI}/performance-report`, { method: "GET", params: filters }),
  
  getFinancialReport: (id: string, filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    supplier: Supplier;
    summary: {
      totalValue: number;
      averageValue: number;
      totalMovements: number;
      growthRate: number;
    };
    monthlyData: Array<{
      month: string;
      value: number;
      movements: number;
      products: number;
    }>;
    topProducts: Array<{
      product: SupplierProduct;
      value: number;
      movements: number;
    }>;
  }> => 
    fetchAuth(`${URI}/${id}/financial-report`, { method: "GET", params: filters }),

  // === UTILITÁRIOS ===
  export: (filters?: SupplierFilters): Promise<{ downloadUrl: string }> => 
    fetchAuth(`${URI}/export`, { method: "POST", data: filters as Record<string, unknown> }),
  
  import: (file: File, options?: {
    updateExisting?: boolean;
    dryRun?: boolean;
  }): Promise<{
    imported: number;
    errors: string[];
    warnings: string[];
  }> => 
    fetchAuth(`${URI}/import`, { method: "POST", data: { file, ...options } }),
  
  validate: (supplier: CreateSupplierRequest): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> => 
    fetchAuth(`${URI}/validate`, { method: "POST", data: supplier as unknown as Record<string, unknown> }),
  
  getStates: (): Promise<Array<{
    state: string;
    count: number;
  }>> => 
    fetchAuth(`${URI}/states`, { method: "GET" }),
  
  getCities: (state?: string): Promise<Array<{
    city: string;
    state: string;
    count: number;
  }>> => 
    fetchAuth(`${URI}/cities`, { method: "GET", params: { state } }),

  keys: {
    list: ["suppliers"],
    get: ["supplier"],
    create: ["suppliers"],
    update: ["supplier"],
    delete: ["supplier"],
    search: ["suppliers", "search"],
  }
};
