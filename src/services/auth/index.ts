import { fetch, fetchAuth } from "@/services/http/fetch";

const URI = "/auth";

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
    lastLoginAt?: string;
    status?: boolean;
}

export interface LoginResponse {
    user: User;
    message: string;
    token?: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    user: User;
    message: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
}

export interface ResetPasswordResponse {
    message: string;
}

export interface VerifyEmailRequest {
    token: string;
}

export interface VerifyEmailResponse {
    message: string;
}

export interface ResendVerificationRequest {
    email: string;
}

export interface ResendVerificationResponse {
    message: string;
}

export interface RefreshTokenResponse {
    token: string;
    message: string;
}

export interface LogoutResponse {
    message: string;
}

export interface ProfileResponse {
    user: User;
}

export interface UserStats {
    total: number;
    active: number;
    inactive: number;
    verified: number;
    unverified: number;
    byRole?: Array<{
        role: string;
        _count: { id: number };
    }>;
}

export interface ProfilePermissionsResponse {
    userId: string;
    userRoles: string[];
    storeId?: string;
    effectivePermissions: string[];
    customPermissions: Array<{
        id: string;
        action: string;
        resource?: string;
        storeId?: string;
        grant: boolean;
        conditions?: any;
        expiresAt?: string;
        reason?: string;
        createdAt: string;
        createdBy: string;
        creator?: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    storePermissions: Array<{
        id: string;
        storeId: string;
        storeRole: string;
        permissions: string[];
        conditions?: any;
        expiresAt?: string;
        createdAt: string;
        createdBy: string;
        store?: {
            id: string;
            name: string;
        };
        creator?: {
            id: string;
            name: string;
            email: string;
        };
    }>;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface UsersResponse {
    users: User[];
}

export interface SearchUsersResponse {
    users: User[];
}

export const AuthService = {
    // === AUTH ENDPOINTS ===
    register: (data: RegisterRequest): Promise<RegisterResponse> =>
        fetch(`${URI}/register`, { method: "POST", data: data as unknown as Record<string, unknown> }),

    login: (email: string, password: string): Promise<LoginResponse> =>
        fetch(`${URI}/login`, { method: "POST", data: { email, password } }),

    forgotPassword: (email: string): Promise<ForgotPasswordResponse> =>
        fetch(`${URI}/forgot-password`, { method: "POST", data: { email } }),

    resetPassword: (token: string, password: string): Promise<ResetPasswordResponse> =>
        fetch(`${URI}/reset-password`, { method: "POST", data: { token, password } }),

    verifyEmail: (token: string): Promise<VerifyEmailResponse> =>
        fetch(`${URI}/verify-email`, { method: "POST", data: { token } }),

    resendVerification: (email: string): Promise<ResendVerificationResponse> =>
        fetch(`${URI}/resend-verification`, { method: "POST", data: { email } }),

    refreshToken: (): Promise<RefreshTokenResponse> =>
        fetch(`${URI}/refresh-token`, { method: "POST" }),

    logout: (): Promise<LogoutResponse> =>
        fetch(`${URI}/logout`, { method: "POST" }),

    // === USER PROFILE ===
    getProfile: (): Promise<ProfileResponse> =>
        fetchAuth(`${URI}/profile`, { method: "GET" }),

    updateProfile: (params: any) => fetchAuth(`${URI}/profile`, { method: "PUT", data: params }),
    getProfilePermissions: (params?: {
        storeId?: string;
        active?: boolean;
        page?: number;
        limit?: number;
    }): Promise<ProfilePermissionsResponse> =>
        fetchAuth(`${URI}/profile/permissions`, { method: "GET", params }),


    // === ADMIN ENDPOINTS ===
    getActiveUsers: (): Promise<UsersResponse> =>
        fetch(`${URI}/users/active`, { method: "GET" }),

    getVerifiedUsers: (): Promise<UsersResponse> =>
        fetch(`${URI}/users/verified`, { method: "GET" }),

    getUnverifiedUsers: (): Promise<UsersResponse> =>
        fetch(`${URI}/users/unverified`, { method: "GET" }),

    getUserStats: (): Promise<UserStats> =>
        fetch(`${URI}/stats`, { method: "GET" }),

    searchUsers: (q: string, limit?: number): Promise<SearchUsersResponse> =>
        fetch(`${URI}/search`, { method: "GET", params: { q, limit } }),

    getPendingVerification: (): Promise<UsersResponse> =>
        fetch(`${URI}/users/pending-verification`, { method: "GET" }),

    getPendingReset: (): Promise<UsersResponse> =>
        fetch(`${URI}/users/pending-reset`, { method: "GET" }),

    // === LEGACY METHODS (mantidos para compatibilidade) ===
    list: () => fetch(URI, { method: "GET" }),
    update: (params: any) => fetchAuth(URI, { method: "PUT", data: params }),
    exclude: (password: string) => fetch(URI, { method: "DELETE", data: { password } }),
}