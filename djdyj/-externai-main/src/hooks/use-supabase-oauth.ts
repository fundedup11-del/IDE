import { useState, useCallback } from 'react';
import {
    SupabaseAuthStatus,
    SupabaseProject,
    SupabaseProjectDetails,
    SupabaseConnectResponse,
    SupabaseProjectsResponse,
    SupabaseProjectDetailsResponse,
} from '@/types/supabase-oauth';

/**
 * Custom hook for managing Supabase OAuth integration
 * 
 * Provides methods to:
 * - Check authentication status
 * - Initiate OAuth flow
 * - Fetch user's projects
 * - Get project credentials
 */
export function useSupabaseOAuth() {
    const [authStatus, setAuthStatus] = useState<SupabaseAuthStatus | null>(null);
    const [projects, setProjects] = useState<SupabaseProject[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Check if Supabase CLI is installed and user is authenticated
     */
    const checkAuthStatus = useCallback(async () => {
        try {
            const response = await fetch('/api/supabase/connect');
            const data: SupabaseAuthStatus = await response.json();
            setAuthStatus(data);
            return data;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to check auth status';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    }, []);

    /**
     * Initiate Supabase CLI login flow
     * Opens browser for user to authenticate
     */
    const connectSupabase = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/supabase/connect', {
                method: 'POST',
            });

            const data: SupabaseConnectResponse = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to connect to Supabase');
            }

            // Update auth status after successful connection
            await checkAuthStatus();

            return data;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to connect to Supabase';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [checkAuthStatus]);

    /**
     * Fetch list of user's Supabase projects
     */
    const fetchProjects = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/supabase/projects');
            const data: SupabaseProjectsResponse = await response.json();

            if (!data.success || !data.projects) {
                throw new Error(data.message || 'Failed to fetch projects');
            }

            setProjects(data.projects);
            return data.projects;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch projects';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get API keys and credentials for a specific project
     */
    const getProjectCredentials = useCallback(async (projectRef: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/supabase/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projectRef }),
            });

            const data: SupabaseProjectDetailsResponse = await response.json();

            if (!data.success || !data.apiKeys) {
                throw new Error(data.message || 'Failed to fetch project credentials');
            }

            return {
                apiUrl: data.apiUrl!,
                anonKey: data.apiKeys.anon,
                serviceRoleKey: data.apiKeys.serviceRole,
            };
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to fetch project credentials';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        authStatus,
        projects,
        loading,
        error,
        checkAuthStatus,
        connectSupabase,
        fetchProjects,
        getProjectCredentials,
    };
}
