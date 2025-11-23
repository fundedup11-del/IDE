"use client"

import React, { useState, useEffect } from 'react';
import { X, Database, CheckCircle2, AlertCircle, Info, ExternalLink, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useSupabaseConfig } from '@/hooks/useSupabaseConfig';
import { useSupabaseOAuth } from '@/hooks/use-supabase-oauth';
import { Button } from '@/components/ui/button';
import { SupabaseProject } from '@/types/supabase-oauth';

interface SupabaseSettingsModalProps {
    onClose: () => void;
}

export function SupabaseSettingsModal({ onClose }: SupabaseSettingsModalProps) {
    const { config, saveConfig, clearConfig, isConfigured } = useSupabaseConfig();
    const {
        authStatus,
        projects,
        loading: oauthLoading,
        error: oauthError,
        checkAuthStatus,
        connectSupabase,
        fetchProjects,
        getProjectCredentials
    } = useSupabaseOAuth();

    const [url, setUrl] = useState('');
    const [anonKey, setAnonKey] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // OAuth-specific state
    const [showOAuthFlow, setShowOAuthFlow] = useState(false);
    const [selectedProject, setSelectedProject] = useState<SupabaseProject | null>(null);
    const [loadingCredentials, setLoadingCredentials] = useState(false);

    // Load existing config when modal opens
    useEffect(() => {
        if (config) {
            setUrl(config.url);
            setAnonKey(config.anonKey);
        }

        // Check OAuth status on mount
        checkAuthStatus();
    }, [config, checkAuthStatus]);

    const validateUrl = (urlString: string): boolean => {
        try {
            const parsed = new URL(urlString);
            return parsed.hostname.includes('supabase');
        } catch {
            return false;
        }
    };

    const handleSave = () => {
        // Validation
        if (!url.trim() || !anonKey.trim()) {
            setErrorMessage('Please fill in both fields');
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        if (!validateUrl(url)) {
            setErrorMessage('Please enter a valid Supabase URL (e.g., https://xxx.supabase.co)');
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        // Save config
        const success = saveConfig({ url: url.trim(), anonKey: anonKey.trim() });

        if (success) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 1500);
        } else {
            setErrorMessage('Failed to save configuration');
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
        }
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear your Supabase configuration?')) {
            clearConfig();
            setUrl('');
            setAnonKey('');
        }
    };

    // OAuth handlers
    const handleConnect = async () => {
        try {
            await connectSupabase();
            // After successful connection, fetch projects
            await fetchProjects();
            setShowOAuthFlow(true);
        } catch (err: any) {
            setErrorMessage(err.message || 'Failed to connect to Supabase');
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        }
    };

    const handleProjectSelect = async (project: SupabaseProject) => {
        setSelectedProject(project);
        setLoadingCredentials(true);

        try {
            // Extract project ref from API URL
            const projectRef = project.apiUrl.match(/https:\/\/([^.]+)\.supabase/)?.[1];

            if (!projectRef) {
                throw new Error('Could not extract project reference from URL');
            }

            const credentials = await getProjectCredentials(projectRef);

            // Auto-populate the fields
            setUrl(credentials.apiUrl);
            setAnonKey(credentials.anonKey);

            // Automatically save the configuration
            const success = saveConfig({
                url: credentials.apiUrl,
                anonKey: credentials.anonKey
            });

            if (success) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onClose();
                }, 1500);
            }
        } catch (err: any) {
            setErrorMessage(err.message || 'Failed to fetch project credentials');
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        } finally {
            setLoadingCredentials(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Database className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Supabase Configuration</h2>
                            <p className="text-sm text-gray-500">Connect your Supabase project</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* OAuth Connect Button */}
                    {!showOAuthFlow && (
                        <div className="space-y-4">
                            <Button
                                onClick={handleConnect}
                                disabled={oauthLoading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base font-semibold flex items-center justify-center gap-3"
                            >
                                {oauthLoading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <LinkIcon className="h-5 w-5" />
                                        Connect with Supabase
                                    </>
                                )}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">or enter manually</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Project Selection */}
                    {showOAuthFlow && projects.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">Select a Project</h3>
                            <div className="max-h-60 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                                {projects.map((project) => (
                                    <button
                                        key={project.id}
                                        onClick={() => handleProjectSelect(project)}
                                        disabled={loadingCredentials}
                                        className="w-full text-left p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="font-medium text-gray-900">{project.name}</div>
                                        <div className="text-sm text-gray-500 mt-1">{project.region}</div>
                                        <div className="text-xs text-gray-400 mt-1 font-mono">{project.apiUrl}</div>
                                    </button>
                                ))}
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => setShowOAuthFlow(false)}
                                className="w-full"
                            >
                                ← Use Manual Configuration
                            </Button>
                        </div>
                    )}

                    {loadingCredentials && (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                            <span className="ml-2 text-sm text-gray-600">Loading credentials...</span>
                        </div>
                    )}
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900">
                                <p className="font-medium mb-1">Find your credentials in Supabase Dashboard</p>
                                <p className="text-blue-700">
                                    Settings → API → Project URL & anon/public key
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Supabase URL Input */}
                    <div>
                        <label htmlFor="supabase-url" className="block text-sm font-medium text-gray-700 mb-2">
                            Supabase Project URL
                        </label>
                        <input
                            id="supabase-url"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://xxxxxxxxxxxxx.supabase.co"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-mono"
                        />
                    </div>

                    {/* Anon Key Input */}
                    <div>
                        <label htmlFor="supabase-key" className="block text-sm font-medium text-gray-700 mb-2">
                            Supabase Anon/Public Key
                        </label>
                        <textarea
                            id="supabase-key"
                            value={anonKey}
                            onChange={(e) => setAnonKey(e.target.value)}
                            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-mono resize-none"
                        />
                    </div>

                    {/* Security Note */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-900">
                                <p className="font-medium mb-1">Security Note</p>
                                <p className="text-amber-700">
                                    Only use your <strong>anon/public key</strong>, never your service role key. Enable Row Level Security (RLS) in Supabase for data protection.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    {showSuccess && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <p className="text-sm font-medium text-green-900">
                                Configuration saved successfully!
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {showError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <p className="text-sm font-medium text-red-900">{errorMessage}</p>
                        </div>
                    )}

                    {/* Learn More Link */}
                    <a
                        href="https://supabase.com/docs/guides/api#api-url-and-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Learn more about Supabase API keys
                    </a>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    {isConfigured && (
                        <Button
                            variant="ghost"
                            onClick={handleClear}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            Clear Configuration
                        </Button>
                    )}
                    <div className={`flex gap-3 ${!isConfigured ? 'ml-auto' : ''}`}>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 text-white px-6"
                        >
                            Save Configuration
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
