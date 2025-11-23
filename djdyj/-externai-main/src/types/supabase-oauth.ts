/**
 * Supabase OAuth Integration Types
 */

export interface SupabaseAuthStatus {
    installed: boolean;
    authenticated: boolean;
    error?: string;
}

export interface SupabaseProject {
    id: string;
    name: string;
    organizationId: string;
    region: string;
    createdAt: string;
    database: {
        host: string;
        port: number;
    };
    apiUrl: string;
}

export interface SupabaseProjectDetails {
    apiKeys: {
        anon: string;
        serviceRole: string;
    };
    apiUrl: string;
}

export interface SupabaseConnectResponse {
    success: boolean;
    message?: string;
    error?: string;
    alreadyLoggedIn?: boolean;
    output?: string;
    installInstructions?: {
        windows: string;
        mac: string;
        linux: string;
    };
}

export interface SupabaseProjectsResponse {
    success: boolean;
    projects?: SupabaseProject[];
    error?: string;
    message?: string;
}

export interface SupabaseProjectDetailsResponse {
    success: boolean;
    apiKeys?: {
        anon: string;
        serviceRole: string;
    };
    apiUrl?: string;
    error?: string;
    message?: string;
}
