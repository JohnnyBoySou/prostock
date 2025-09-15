import { fetchAuth } from '@/services/http/fetch';

const URI = '/category';

// === INTERFACES ===
export interface Category {
    id: string;
    name: string;
    description?: string;
    code?: string;
    status: boolean;
    color?: string;
    icon?: string;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
    parent?: Category;
    children: Category[];
    products: any[];
    _count: {
        children: number;
        products: number;
    };
}

export interface CategoryCreateRequest {
    name: string;
    description?: string;
    code?: string;
    status?: boolean;
    color?: string;
    icon?: string;
    parentId?: string;
}

export interface CategoryUpdateRequest {
    name?: string;
    description?: string;
    code?: string;
    status?: boolean;
    color?: string;
    icon?: string;
    parentId?: string;
}

export interface CategoryListResponse {
    items: Category[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CategoryStats {
    total: number;
    active: number;
    inactive: number;
    withChildren: number;
    withProducts: number;
    rootCategories: number;
}

export interface CategoryMoveRequest {
    parentId?: string;
}

export const CategoryService = {
    // === CRUD BÁSICO ===
    create: (data: CategoryCreateRequest): Promise<Category> =>
        fetchAuth(URI, { method: "POST", data: data as unknown as Record<string, unknown> }),

    list: (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: boolean;
        parentId?: string;
    }): Promise<CategoryListResponse> =>
        fetchAuth(URI, { method: "GET", params }),

    single: (id: string): Promise<Category> =>
        fetchAuth(`${URI}/${id}`, { method: "GET" }),

    update: (id: string, data: CategoryUpdateRequest): Promise<Category> =>
        fetchAuth(`${URI}/${id}`, { method: "PUT", data: data as unknown as Record<string, unknown> }),

    delete: (id: string): Promise<void> =>
        fetchAuth(`${URI}/${id}`, { method: "DELETE" }),

    // === CONSULTAS ESPECÍFICAS ===
    getActive: (): Promise<{ categories: Category[] }> =>
        fetchAuth(`${URI}/active`, { method: "GET" }),

    getStats: (): Promise<CategoryStats> =>
        fetchAuth(`${URI}/stats`, { method: "GET" }),

    search: (q: string, limit?: number): Promise<{ categories: Category[] }> =>
        fetchAuth(`${URI}/search`, { method: "GET", params: { q, limit } }),

    getByCode: (code: string): Promise<Category> =>
        fetchAuth(`${URI}/code/${code}`, { method: "GET" }),

    getRootCategories: (status?: boolean): Promise<{ categories: Category[] }> =>
        fetchAuth(`${URI}/root`, { method: "GET", params: { status } }),

    getChildren: (id: string): Promise<{ categories: Category[] }> =>
        fetchAuth(`${URI}/${id}/children`, { method: "GET" }),

    getHierarchy: (): Promise<{ categories: Category[] }> =>
        fetchAuth(`${URI}/hierarchy`, { method: "GET" }),

    // === COMANDOS ESPECÍFICOS ===
    updateStatus: (id: string, status: boolean): Promise<Category> =>
        fetchAuth(`${URI}/${id}/status`, { method: "PATCH", data: { status } }),

    moveToParent: (id: string, parentId?: string): Promise<Category> =>
        fetchAuth(`${URI}/${id}/move`, { method: "PATCH", data: { parentId } }),

    // === UTILITÁRIOS ===
    toggleStatus: (id: string): Promise<Category> => {
        // Primeiro busca a categoria para obter o status atual
        return fetchAuth(`${URI}/${id}`, { method: "GET" })
            .then((category: Category) => 
                fetchAuth(`${URI}/${id}/status`, { 
                    method: "PATCH", 
                    data: { status: !category.status } 
                })
            );
    },

    getCategoryTree: (): Promise<Category[]> => {
        // Busca todas as categorias e organiza em árvore
        return fetchAuth(`${URI}/hierarchy`, { method: "GET" })
            .then((response: { categories: Category[] }) => response.categories);
    },

    getCategoriesWithProducts: (): Promise<Category[]> => {
        // Busca categorias que possuem produtos
        return fetchAuth(URI, { method: "GET", params: { limit: 1000 } })
            .then((response: CategoryListResponse) => 
                response.items.filter(category => category._count.products > 0)
            );
    },

    getLeafCategories: (): Promise<Category[]> => {
        // Busca categorias folha (sem filhos)
        return fetchAuth(URI, { method: "GET", params: { limit: 1000 } })
            .then((response: CategoryListResponse) => 
                response.items.filter(category => category._count.children === 0)
            );
    },

    bulkUpdateStatus: (ids: string[], status: boolean): Promise<Category[]> => {
        // Atualiza status de múltiplas categorias
        const promises = ids.map(id => 
            fetchAuth(`${URI}/${id}/status`, { method: "PATCH", data: { status } })
        );
        return Promise.all(promises) as Promise<Category[]>;
    },

    getCategoryPath: (id: string): Promise<Category[]> => {
        // Busca o caminho completo de uma categoria (até a raiz)
        return fetchAuth(`${URI}/${id}`, { method: "GET" })
            .then((category: Category) => {
                const path: Category[] = [category];
                let current = category.parent;
                
                while (current) {
                    path.unshift(current);
                    current = current.parent;
                }
                
                return path;
            });
    }
};
