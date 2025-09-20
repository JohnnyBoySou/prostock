import { fetchAuth } from "@/services/http/fetch";

// === INTERFACES PARA MOVEMENT ===

export interface Movement {
  id: string;
  type: 'ENTRADA' | 'SAIDA' | 'PERDA';
  quantity: number;
  storeId: string;
  productId: string;
  supplierId?: string;
  batch?: string;
  expiration?: string;
  price?: number;
  note?: string;
  balanceAfter?: number;
  verified?: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  cancelled?: boolean;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  store?: {
    id: string;
    name: string;
  };
  product?: {
    id: string;
    name: string;
    unitOfMeasure: string;
  };
  supplier?: {
    id: string;
    corporateName: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MovementListResponse {
  movements: Movement[];
  pagination: Pagination;
}

export interface CreateMovementRequest {
  type: 'ENTRADA' | 'SAIDA' | 'PERDA';
  quantity: number;
  storeId: string;
  productId: string;
  supplierId?: string;
  batch?: string;
  expiration?: string;
  price?: number;
  note?: string;
  userId?: string;
}

export interface UpdateMovementRequest {
  type?: 'ENTRADA' | 'SAIDA' | 'PERDA';
  quantity?: number;
  supplierId?: string;
  batch?: string;
  expiration?: string;
  price?: number;
  note?: string;
}

export interface MovementStatsResponse {
  total: number;
  entrada: number;
  saida: number;
  perda: number;
  totalValue: number;
  averageValue: number;
  byType: {
    ENTRADA: number;
    SAIDA: number;
    PERDA: number;
  };
  byStore: Array<{
    storeId: string;
    storeName: string;
    count: number;
    totalValue: number;
  }>;
  byProduct: Array<{
    productId: string;
    productName: string;
    count: number;
    totalQuantity: number;
  }>;
  bySupplier: Array<{
    supplierId: string;
    supplierName: string;
    count: number;
    totalValue: number;
  }>;
}

export interface MovementReportResponse {
  summary: {
    totalMovements: number;
    totalValue: number;
    period: {
      startDate: string;
      endDate: string;
    };
  };
  data: Array<{
    date: string;
    movements: number;
    value: number;
    entrada: number;
    saida: number;
    perda: number;
  }>;
  byType: {
    ENTRADA: {
      count: number;
      value: number;
      quantity: number;
    };
    SAIDA: {
      count: number;
      value: number;
      quantity: number;
    };
    PERDA: {
      count: number;
      value: number;
      quantity: number;
    };
  };
  byStore: Array<{
    storeId: string;
    storeName: string;
    movements: number;
    value: number;
  }>;
  byProduct: Array<{
    productId: string;
    productName: string;
    movements: number;
    quantity: number;
  }>;
  bySupplier: Array<{
    supplierId: string;
    supplierName: string;
    movements: number;
    value: number;
  }>;
}

export interface BulkMovementRequest {
  movements: Array<{
    type: 'ENTRADA' | 'SAIDA' | 'PERDA';
    quantity: number;
    storeId: string;
    productId: string;
    supplierId?: string;
    batch?: string;
    expiration?: string;
    price?: number;
    note?: string;
  }>;
}

export interface BulkMovementResponse {
  success: number;
  failed: number;
  results: Array<{
    index: number;
    success: boolean;
    movement?: Movement;
    error?: string;
  }>;
}

export interface MovementVerificationRequest {
  verified: boolean;
  note?: string;
}

export interface MovementVerificationResponse {
  id: string;
  verified: boolean;
  verifiedAt: string;
  verifiedBy: string;
  note?: string;
}

export interface MovementCancellationRequest {
  reason: string;
}

export interface MovementCancellationResponse {
  id: string;
  cancelled: boolean;
  cancelledAt: string;
  cancelledBy: string;
  reason: string;
}

export interface MovementFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'ENTRADA' | 'SAIDA' | 'PERDA';
  storeId?: string;
  productId?: string;
  supplierId?: string;
  startDate?: string;
  endDate?: string;
  verified?: boolean;
  cancelled?: boolean;
  groupBy?: 'day' | 'week' | 'month' | 'year';
  format?: 'json' | 'csv' | 'pdf';
}

export interface StockHistoryResponse {
  movements: Movement[];
  currentStock: number;
  product: {
    id: string;
    name: string;
    unitOfMeasure: string;
  };
  store: {
    id: string;
    name: string;
  };
}

export interface CurrentStockResponse {
  currentStock: number;
  product: {
    id: string;
    name: string;
    unitOfMeasure: string;
  };
  store: {
    id: string;
    name: string;
  };
  lastMovement?: Movement;
}

export interface LowStockProduct {
  productId: string;
  productName: string;
  currentStock: number;
  stockMin: number;
  stockMax: number;
  alertPercentage: number;
  status: 'OK' | 'LOW' | 'CRITICAL' | 'OVERSTOCK';
  store: {
    id: string;
    name: string;
  };
}

export interface MovementAnalytics {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalMovements: number;
    totalValue: number;
    averageValue: number;
    totalQuantity: number;
  };
  trends: {
    daily: Array<{
      date: string;
      movements: number;
      value: number;
      quantity: number;
    }>;
    weekly: Array<{
      week: string;
      movements: number;
      value: number;
      quantity: number;
    }>;
    monthly: Array<{
      month: string;
      movements: number;
      value: number;
      quantity: number;
    }>;
  };
  topProducts: Array<{
    productId: string;
    productName: string;
    movements: number;
    quantity: number;
    value: number;
  }>;
  topSuppliers: Array<{
    supplierId: string;
    supplierName: string;
    movements: number;
    value: number;
  }>;
  efficiency: {
    averageProcessingTime: number;
    verificationRate: number;
    cancellationRate: number;
  };
}

const URI = "/movements";

export const MovementService = {
  // === CRUD BÁSICO ===
  create: (params: CreateMovementRequest): Promise<Movement> => 
    fetchAuth(URI, { method: "POST", data: params }),
  
  list: (filters?: MovementFilters): Promise<MovementListResponse> => 
    fetchAuth(URI, { method: "GET", params: filters }),
  
  get: (id: string): Promise<Movement> => 
    fetchAuth(`${URI}/${id}`, { method: "GET" }),
  
  update: (id: string, params: UpdateMovementRequest): Promise<Movement> => 
    fetchAuth(`${URI}/${id}`, { method: "PUT", data: params }),
  
  delete: (id: string): Promise<void> => 
    fetchAuth(`${URI}/${id}`, { method: "DELETE" }),

  // === CONSULTAS POR ENTIDADE ===
  getByStore: (storeId: string, filters?: {
    page?: number;
    limit?: number;
    type?: 'ENTRADA' | 'SAIDA' | 'PERDA';
    startDate?: string;
    endDate?: string;
  }): Promise<MovementListResponse> => 
    fetchAuth(`${URI}/store/${storeId}`, { method: "GET", params: filters }),
  
  getByProduct: (productId: string, filters?: {
    page?: number;
    limit?: number;
    type?: 'ENTRADA' | 'SAIDA' | 'PERDA';
    startDate?: string;
    endDate?: string;
  }): Promise<MovementListResponse> => 
    fetchAuth(`${URI}/product/${productId}`, { method: "GET", params: filters }),
  
  getBySupplier: (supplierId: string, filters?: {
    page?: number;
    limit?: number;
    type?: 'ENTRADA' | 'SAIDA' | 'PERDA';
    startDate?: string;
    endDate?: string;
  }): Promise<MovementListResponse> => 
    fetchAuth(`${URI}/supplier/${supplierId}`, { method: "GET", params: filters }),

  // === HISTÓRICO DE ESTOQUE ===
  getStockHistory: (productId: string, storeId: string, filters?: {
    startDate?: string;
    endDate?: string;
  }): Promise<StockHistoryResponse> => 
    fetchAuth(`${URI}/stock-history/${productId}/${storeId}`, { method: "GET", params: filters }),
  
  getCurrentStock: (productId: string, storeId: string): Promise<CurrentStockResponse> => 
    fetchAuth(`${URI}/current-stock/${productId}/${storeId}`, { method: "GET" }),

  // === RELATÓRIOS E ESTATÍSTICAS ===
  getStats: (): Promise<MovementStatsResponse> => 
    fetchAuth(`${URI}/stats`, { method: "GET" }),
  
  search: (q: string, limit?: number): Promise<{ movements: Movement[] }> => 
    fetchAuth(`${URI}/search`, { method: "GET", params: { q, limit } }),
  
  getLowStockProducts: (storeId?: string): Promise<{ products: LowStockProduct[] }> => 
    fetchAuth(`${URI}/low-stock`, { method: "GET", params: { storeId } }),

  // === COMANDOS ESPECIAIS ===
  recalculateStock: (productId: string, storeId: string): Promise<{ currentStock: number }> => 
    fetchAuth(`${URI}/recalculate-stock/${productId}/${storeId}`, { method: "POST" }),

  // === RELATÓRIOS AVANÇADOS ===
  getReport: (filters?: {
    storeId?: string;
    productId?: string;
    supplierId?: string;
    type?: 'ENTRADA' | 'SAIDA' | 'PERDA';
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month' | 'year';
    format?: 'json' | 'csv' | 'pdf';
  }): Promise<MovementReportResponse> => 
    fetchAuth(`${URI}/report`, { method: "GET", params: filters }),
  
  getAnalytics: (filters?: {
    storeId?: string;
    productId?: string;
    supplierId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<MovementAnalytics> => 
    fetchAuth(`${URI}/analytics`, { method: "GET", params: filters }),

  // === OPERAÇÕES EM LOTE ===
  createBulk: (params: BulkMovementRequest): Promise<BulkMovementResponse> => 
    fetchAuth(`${URI}/bulk`, { method: "POST", data: params }),
  
  updateBulk: (updates: Array<{ id: string; data: UpdateMovementRequest }>): Promise<{ 
    updated: number; 
    errors: string[] 
  }> => 
    fetchAuth(`${URI}/bulk-update`, { method: "POST", data: { updates } }),
  
  deleteBulk: (ids: string[]): Promise<{ 
    deleted: number; 
    errors: string[] 
  }> => 
    fetchAuth(`${URI}/bulk-delete`, { method: "POST", data: { ids } }),

  // === VERIFICAÇÃO E CANCELAMENTO ===
  verify: (id: string, params: MovementVerificationRequest): Promise<MovementVerificationResponse> => 
    fetchAuth(`${URI}/${id}/verify`, { method: "PATCH", data: params }),
  
  cancel: (id: string, params: MovementCancellationRequest): Promise<MovementCancellationResponse> => 
    fetchAuth(`${URI}/${id}/cancel`, { method: "PATCH", data: params }),
  
  getVerifiedMovements: (filters?: {
    page?: number;
    limit?: number;
    storeId?: string;
    verified?: boolean;
    startDate?: string;
    endDate?: string;
  }): Promise<MovementListResponse> => 
    fetchAuth(`${URI}/verified`, { method: "GET", params: filters }),
  
  getCancelledMovements: (filters?: {
    page?: number;
    limit?: number;
    storeId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<MovementListResponse> => 
    fetchAuth(`${URI}/cancelled`, { method: "GET", params: filters }),

  // === FUNÇÕES ESPECÍFICAS ===
  getByType: (type: 'ENTRADA' | 'SAIDA' | 'PERDA', filters?: {
    storeId?: string;
    productId?: string;
    supplierId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<MovementListResponse> => 
    fetchAuth(`${URI}/type/${type}`, { method: "GET", params: filters }),
  
  getByDateRange: (startDate: string, endDate: string, filters?: {
    storeId?: string;
    productId?: string;
    supplierId?: string;
    type?: 'ENTRADA' | 'SAIDA' | 'PERDA';
    page?: number;
    limit?: number;
  }): Promise<MovementListResponse> => 
    fetchAuth(`${URI}/date-range`, { method: "GET", params: { startDate, endDate, ...filters } }),
  
  getRecent: (limit?: number, storeId?: string): Promise<{ movements: Movement[] }> => 
    fetchAuth(`${URI}/recent`, { method: "GET", params: { limit, storeId } }),
  
  getPendingVerification: (storeId?: string): Promise<{ movements: Movement[] }> => 
    fetchAuth(`${URI}/pending-verification`, { method: "GET", params: { storeId } }),

  // === RELATÓRIOS ESPECÍFICOS ===
  getInventoryReport: (storeId?: string, date?: string): Promise<{
    products: Array<{
      productId: string;
      productName: string;
      currentStock: number;
      stockMin: number;
      stockMax: number;
      status: string;
      lastMovement: string;
    }>;
    summary: {
      totalProducts: number;
      lowStock: number;
      outOfStock: number;
      overstock: number;
    };
  }> => 
    fetchAuth(`${URI}/inventory-report`, { method: "GET", params: { storeId, date } }),
  
  getSupplierReport: (supplierId?: string, filters?: {
    startDate?: string;
    endDate?: string;
    storeId?: string;
  }): Promise<{
    supplier: {
      id: string;
      corporateName: string;
    };
    movements: number;
    totalValue: number;
    totalQuantity: number;
    averageValue: number;
    byProduct: Array<{
      productId: string;
      productName: string;
      movements: number;
      quantity: number;
      value: number;
    }>;
  }> => 
    fetchAuth(`${URI}/supplier-report`, { method: "GET", params: { supplierId, ...filters } }),
  
  getProductReport: (productId?: string, filters?: {
    startDate?: string;
    endDate?: string;
    storeId?: string;
  }): Promise<{
    product: {
      id: string;
      name: string;
      unitOfMeasure: string;
    };
    movements: number;
    totalQuantity: number;
    totalValue: number;
    averageValue: number;
    stockHistory: Array<{
      date: string;
      stock: number;
      movement: number;
      type: string;
    }>;
  }> => 
    fetchAuth(`${URI}/product-report`, { method: "GET", params: { productId, ...filters } }),

  // === UTILITÁRIOS ===
  export: (filters?: MovementFilters): Promise<{ downloadUrl: string }> => 
    fetchAuth(`${URI}/export`, { method: "POST", data: filters }),
  
  import: (file: File, options?: {
    updateExisting?: boolean;
    dryRun?: boolean;
  }): Promise<{
    imported: number;
    errors: string[];
    warnings: string[];
  }> => 
    fetchAuth(`${URI}/import`, { method: "POST", data: { file, ...options } }),
  
  validate: (movement: CreateMovementRequest): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> => 
    fetchAuth(`${URI}/validate`, { method: "POST", data: movement }),
  
  getMovementTypes: (): Promise<Array<{
    type: 'ENTRADA' | 'SAIDA' | 'PERDA';
    label: string;
    description: string;
  }>> => 
    fetchAuth(`${URI}/types`, { method: "GET" }),
};

// === FUNÇÕES ESPECÍFICAS USADAS PELOS COMPONENTES ===

export const listMove = (filters?: any) => MovementService.list(filters);
export const searchMove = (q: string, limit?: number) => MovementService.search(q, limit);
export const showMove = (id: string) => MovementService.get(id);
export const addMove = (params: CreateMovementRequest) => MovementService.create(params);
export const editMove = (id: string, params: UpdateMovementRequest) => MovementService.update(id, params);