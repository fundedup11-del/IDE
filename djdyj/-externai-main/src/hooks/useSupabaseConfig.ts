"use client"

import { useState, useEffect } from 'react';

export interface SupabaseConfig {
    url: string;
    anonKey: string;
    savedAt: string;
}

const SUPABASE_CONFIG_KEY = 'externai_supabase_config';

export function useSupabaseConfig() {
    const [config, setConfig] = useState<SupabaseConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load config from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setConfig(parsed);
            }
        } catch (error) {
            console.error('Failed to load Supabase config:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveConfig = (newConfig: Omit<SupabaseConfig, 'savedAt'>) => {
        const configWithTimestamp: SupabaseConfig = {
            ...newConfig,
            savedAt: new Date().toISOString()
        };

        try {
            localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(configWithTimestamp));
            setConfig(configWithTimestamp);
            return true;
        } catch (error) {
            console.error('Failed to save Supabase config:', error);
            return false;
        }
    };

    const clearConfig = () => {
        try {
            localStorage.removeItem(SUPABASE_CONFIG_KEY);
            setConfig(null);
            return true;
        } catch (error) {
            console.error('Failed to clear Supabase config:', error);
            return false;
        }
    };

    const isConfigured = config !== null && config.url !== '' && config.anonKey !== '';

    return {
        config,
        saveConfig,
        clearConfig,
        isConfigured,
        isLoading
    };
}
