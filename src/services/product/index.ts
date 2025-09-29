import { fetchAuth } from "@/services/http/fetch";

// === INTERFACES PARA PRODUCT ===

export interface Product {
    id: string;
    name: string;
    description?: string;
    unitOfMeasure: 'UNIDADE' | 'KG' | 'L' | 'ML' | 'M' | 'CM' | 'MM' | 'UN' | 'DZ' | 'CX' | 'PCT' | 'KIT' | 'PAR' | 'H' | 'D';
    referencePrice: number;
    categoryId?: string;
    supplierId?: string;
    storeId: string;
    stockMin: number;
    stockMax: number;
    alertPercentage: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    category?: {
        id: string;
        name: string;
        description?: string;
        code?: string;
    };
    supplier?: {
        id: string;
        corporateName: string;
        cnpj: string;
        tradeName?: string;
    };
    store?: {
        id: string;
        name: string;
        cnpj: string;
    };
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ProductListResponse {
    items: Product[];
    pagination: Pagination;
}

export interface ProductCreateRequest {
    name: string;
    description?: string;
    unitOfMeasure: 'UNIDADE' | 'KG' | 'L' | 'ML' | 'M' | 'CM' | 'MM' | 'UN' | 'DZ' | 'CX' | 'PCT' | 'KIT' | 'PAR' | 'H' | 'D';
    referencePrice: number;
    categoryId?: string;
    categoryIds?: string[];
    supplierId?: string;
    stockMin: number;
    stockMax: number;
    alertPercentage: number;
    status?: boolean;
}

export interface ProductUpdateRequest {
    name?: string;
    description?: string;
    unitOfMeasure?: 'UNIDADE' | 'KG' | 'L' | 'ML' | 'M' | 'CM' | 'MM' | 'UN' | 'DZ' | 'CX' | 'PCT' | 'KIT' | 'PAR' | 'H' | 'D';
    referencePrice?: number;
    categoryId?: string;
    supplierId?: string;
    storeId?: string;
    stockMin?: number;
    stockMax?: number;
    alertPercentage?: number;
    status?: boolean;
}

export interface ProductStats {
    total: number;
    active: number;
    inactive: number;
    byCategory: Array<{
        category: string;
        _count: { id: number };
    }>;
    bySupplier: Array<{
        supplier: string;
        _count: { id: number };
    }>;
    lowStock: number;
    outOfStock: number;
}

export interface ProductStockResponse {
    id: string;
    name: string;
    currentStock: number;
    stockMin: number;
    stockMax: number;
    alertPercentage: number;
    status: 'OK' | 'LOW' | 'CRITICAL' | 'OVERSTOCK';
    lastMovement?: {
        type: string;
        quantity: number;
        date: string;
    };
}

export interface ProductMovement {
    id: string;
    type: 'ENTRADA' | 'SAIDA' | 'PERDA';
    quantity: number;
    batch?: string;
    expiration?: string;
    price?: number;
    note?: string;
    balanceAfter?: number;
    createdAt: string;
    supplier?: {
        id: string;
        corporateName: string;
        cnpj: string;
    };
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface ProductMovementListResponse {
    movements: ProductMovement[];
    pagination: Pagination;
}

export interface CreateProductMovementRequest {
    type: 'ENTRADA' | 'SAIDA' | 'PERDA';
    quantity: number;
    supplierId?: string;
    batch?: string;
    expiration?: string;
    price?: number;
    note?: string;
}

export interface UpdateStockRequest {
    quantity: number;
    type: 'ENTRADA' | 'SAIDA' | 'PERDA';
    note?: string;
}

export interface ProductAnalytics {
    productId: string;
    productName: string;
    totalMovements: number;
    totalIn: number;
    totalOut: number;
    totalLoss: number;
    averagePrice: number;
    lastMovement: string;
    stockTrend: 'INCREASING' | 'DECREASING' | 'STABLE';
    turnoverRate: number;
    profitMargin: number;
}

export interface SkuVerification {
    available: boolean;
    message: string;
}

const URI = "/products";

export const ProductService = {
    // === CRUD BÁSICO ===
    create: (params: ProductCreateRequest): Promise<Product> => 
        fetchAuth(URI, { method: "POST", data: params as unknown as Record<string, unknown> }),
    
    list: (params?: { 
        page?: number; 
        limit?: number; 
        search?: string; 
        status?: boolean; 
        categoryId?: string; 
        supplierId?: string; 
        storeId?: string 
    }): Promise<ProductListResponse> => 
        fetchAuth(URI, { method: "GET", params }),
    
    get: (id: string): Promise<Product> => 
        fetchAuth(`${URI}/${id}`, { method: "GET" }),
    
    update: (id: string, params: ProductUpdateRequest): Promise<Product> => 
        fetchAuth(`${URI}/${id}`, { method: "PUT", data: params as unknown as Record<string, unknown> }),
    
    delete: (id: string): Promise<void> => 
        fetchAuth(`${URI}/${id}`, { method: "DELETE" }),

    // === CONSULTAS ESPECÍFICAS ===
    getActive: (): Promise<{ items: Product[] }> => 
        fetchAuth(`${URI}/active`, { method: "GET" }),
    
    getStats: (): Promise<ProductStats> => 
        fetchAuth(`${URI}/stats`, { method: "GET" }),
    
    search: (q: string, limit?: number): Promise<{ items: Product[] }> => 
        fetchAuth(`${URI}/search`, { method: "GET", params: { q, limit } }),
    
    getByCategory: (categoryId: string): Promise<{ items: Product[] }> => 
        fetchAuth(`${URI}/category/${categoryId}`, { method: "GET" }),
    
    getBySupplier: (supplierId: string): Promise<{ items: Product[] }> => 
        fetchAuth(`${URI}/supplier/${supplierId}`, { method: "GET" }),
    
    getByStore: (storeId: string): Promise<{ items: Product[] }> => 
        fetchAuth(`${URI}/store/${storeId}`, { method: "GET" }),

    // === GERENCIAMENTO DE STATUS ===
    updateStatus: (id: string, status: boolean): Promise<Product> => 
        fetchAuth(`${URI}/${id}/status`, { method: "PATCH", data: { status } }),

    // === GERENCIAMENTO DE ESTOQUE ===
    getStock: (id: string): Promise<ProductStockResponse> => 
        fetchAuth(`${URI}/${id}/stock`, { method: "GET" }),
    
    updateStock: (id: string, params: UpdateStockRequest): Promise<ProductStockResponse> => 
        fetchAuth(`${URI}/${id}/stock`, { method: "PATCH", data: params as unknown as Record<string, unknown> }),
    
    getStockHistory: (id: string, limit?: number): Promise<{ history: ProductStockResponse[] }> => 
        fetchAuth(`${URI}/${id}/stock/history`, { method: "GET", params: { limit } }),
    
    getLowStock: (storeId?: string): Promise<{ items: ProductStockResponse[] }> => 
        fetchAuth(`${URI}/low-stock`, { method: "GET", params: { storeId } }),

    // === MOVIMENTAÇÕES DE ESTOQUE ===
    getMovements: (id: string, params?: {
        page?: number;
        limit?: number;
        type?: 'ENTRADA' | 'SAIDA' | 'PERDA';
        startDate?: string;
        endDate?: string;
    }): Promise<ProductMovementListResponse> => 
        fetchAuth(`${URI}/${id}/movements`, { method: "GET", params }),
    
    createMovement: (id: string, params: CreateProductMovementRequest): Promise<ProductMovement> => 
        fetchAuth(`${URI}/${id}/movements`, { method: "POST", data: params as unknown as Record<string, unknown> }),

    // === ANÁLISES E RELATÓRIOS ===
    getAnalytics: (id: string): Promise<ProductAnalytics> => 
        fetchAuth(`${URI}/${id}/analytics`, { method: "GET" }),
    
    getRecent: (limit?: number): Promise<{ items: Product[] }> => 
        fetchAuth(`${URI}/recent`, { method: "GET", params: { limit } }),

    // === VALIDAÇÕES ===
    verifySku: (id: string, sku: string): Promise<SkuVerification> => 
        fetchAuth(`${URI}/${id}/verify-sku`, { method: "POST", data: { sku } }),

    // === FUNÇÕES DE BUSCA AVANÇADA ===
    getByPriceRange: (minPrice: number, maxPrice: number, storeId?: string): Promise<{ items: Product[] }> => 
        fetchAuth(`${URI}/price-range`, { method: "GET", params: { minPrice, maxPrice, storeId } }),
    
    getByStockStatus: (status: 'OK' | 'LOW' | 'CRITICAL' | 'OVERSTOCK', storeId?: string): Promise<{ items: ProductStockResponse[] }> => 
        fetchAuth(`${URI}/stock-status`, { method: "GET", params: { status, storeId } }),
    
    getExpiringSoon: (days: number = 30, storeId?: string): Promise<{ items: Product[] }> => 
        fetchAuth(`${URI}/expiring-soon`, { method: "GET", params: { days, storeId } }),

    // === RELATÓRIOS DE PERFORMANCE ===
    getTopSelling: (storeId?: string, limit?: number): Promise<{ items: Product[] }> => 
        fetchAuth(`${URI}/top-selling`, { method: "GET", params: { storeId, limit } }),
    
    getSlowMoving: (storeId?: string, days?: number): Promise<{ items: Product[] }> => 
        fetchAuth(`${URI}/slow-moving`, { method: "GET", params: { storeId, days } }),
    
    getZeroStock: (storeId?: string): Promise<{ items: Product[] }> => 
        fetchAuth(`${URI}/zero-stock`, { method: "GET", params: { storeId } }),

    // === UTILITÁRIOS ===
    bulkUpdate: (updates: Array<{ id: string; data: ProductUpdateRequest }>): Promise<{ updated: number; errors: string[] }> => 
        fetchAuth(`${URI}/bulk-update`, { method: "POST", data: { updates } as unknown as Record<string, unknown> }),
    
    bulkDelete: (ids: string[]): Promise<{ deleted: number; errors: string[] }> => 
        fetchAuth(`${URI}/bulk-delete`, { method: "POST", data: { ids } as unknown as Record<string, unknown> }),
    
    export: (filters?: {
        storeId?: string;
        categoryId?: string;
        supplierId?: string;
        status?: boolean;
        format?: 'csv' | 'xlsx';
    }): Promise<{ downloadUrl: string }> => 
        fetchAuth(`${URI}/export`, { method: "POST", data: filters }),

    keys: {
        list: ["products"],
        get: ["product"],
        create: ["products"],
        update: ["product"],
        delete: ["product"],
        search: ["products", "search"],
        stats: ["products", "stats"],
        active: ["products", "active"],
        byCategory: ["products", "byCategory"],
        bySupplier: ["products", "bySupplier"],
        byStore: ["products", "byStore"],
        stock: ["products", "stock"],
        lowStock: ["products", "lowStock"],
        movements: ["products", "movements"],
        analytics: ["products", "analytics"],
        recent: ["products", "recent"],
        topSelling: ["products", "topSelling"],
        slowMoving: ["products", "slowMoving"],
        zeroStock: ["products", "zeroStock"],
        expiringSoon: ["products", "expiringSoon"],
        byPriceRange: ["products", "byPriceRange"],
        byStockStatus: ["products", "byStockStatus"],
        bulkUpdate: ["products", "bulkUpdate"],
        bulkDelete: ["products", "bulkDelete"],
        export: ["products", "export"],
    }
};