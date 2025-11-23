"use client"

import React, { useState, useEffect, useRef } from 'react';
import { WebContainerService } from '@/lib/webcontainer-service';
import { ProjectType } from '@/lib/file-tree-generator';
import { Loader2, AlertCircle, CheckCircle2, Package, Play, RefreshCw } from 'lucide-react';

export interface MultiFilePreviewProps {
    fileTree: Record<string, string>;
    projectType: ProjectType;
}

type Status = 'mounting' | 'installing' | 'starting' | 'ready' | 'error';

export function MultiFilePreview({ fileTree, projectType }: MultiFilePreviewProps) {
    const [status, setStatus] = useState<Status>('mounting');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const hasInitialized = useRef(false);

    const addLog = (message: string) => {
        setLogs(prev => [...prev.slice(-20), message]);
        console.log('[MultiFile]', message);
    };

    const initializePreview = async () => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        try {
            // Check browser support
            if (!WebContainerService.isSupported()) {
                setError('WebContainer requires a Chromium-based browser with Cross-Origin Isolation. Download the project files to run locally.');
                setStatus('error');
                return;
            }

            // Step 1: Mount files
            setStatus('mounting');
            setProgress(10);
            addLog('Mounting project files...');
            await WebContainerService.mountFiles(fileTree);
            setProgress(30);
            addLog(`✅ Mounted ${Object.keys(fileTree).length} files`);

            // Step 2: Install dependencies
            setStatus('installing');
            setProgress(40);
            addLog('Installing dependencies...');

            await WebContainerService.installDependencies((line) => {
                addLog(line);
            });

            setProgress(70);
            addLog('✅ Dependencies installed');

            // Step 3: Start dev server
            setStatus('starting');
            setProgress(80);
            addLog('Starting dev server...');

            const url = await WebContainerService.startDevServer((line) => {
                addLog(line);
            });

            setProgress(100);
            setPreviewUrl(url);
            setStatus('ready');
            addLog(`✅ Server ready at ${url}`);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            setStatus('error');
            addLog(`❌ Error: ${errorMessage}`);
        }
    };

    useEffect(() => {
        initializePreview();

        return () => {
            if (hasInitialized.current) {
                WebContainerService.dispose();
            }
        };
    }, [fileTree]);

    const handleRetry = () => {
        hasInitialized.current = false;
        setStatus('mounting');
        setProgress(0);
        setError(null);
        setLogs([]);
        setPreviewUrl(null);
        initializePreview();
    };

    // Error state
    if (status === 'error') {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Preview Error</h3>
                <p className="text-sm text-gray-600 text-center max-w-md mb-4">{error}</p>

                <button
                    onClick={handleRetry}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    Retry
                </button>

                {logs.length > 0 && (
                    <details className="mt-6 w-full max-w-2xl">
                        <summary className="px-4 py-2 cursor-pointer text-sm font-medium cursor-pointer">
                            View Logs
                        </summary>
                        <div className="px-4 py-2 max-h-48 overflow-y-auto bg-gray-50 text-xs font-mono rounded border">
                            {logs.map((log, i) => (
                                <div key={i} className="text-gray-700">{log}</div>
                            ))}
                        </div>
                    </details>
                )}
            </div>
        );
    }

    // Loading state
    if (status !== 'ready') {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Status Icon */}
                    <div className="flex justify-center mb-6">
                        {status === 'mounting' && <Loader2 className="h-8 w-8 animate-spin text-blue-500" />}
                        {status === 'installing' && <Package className="h-8 w-8 animate-pulse text-purple-500" />}
                        {status === 'starting' && <Play className="h-8 w-8 animate-pulse text-green-500" />}
                    </div>

                    {/* Status Text */}
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                        {status === 'mounting' && 'Mounting Project Files...'}
                        {status === 'installing' && 'Installing Dependencies...'}
                        {status === 'starting' && 'Starting Development Server...'}
                    </h3>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <p className="text-sm text-gray-600 text-center mb-6">{progress}% complete</p>

                    {/* Recent Logs */}
                    {logs.length > 0 && (
                        <div className="bg-gray-50 rounded-lg border p-4 max-h-32 overflow-y-auto">
                            <div className="text-xs font-mono space-y-1">
                                {logs.slice(-3).map((log, i) => (
                                    <div key={i} className="text-gray-600">{log}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Ready state - show iframe
    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex items-center justify-between px-3 py-2 bg-green-50 border-b">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Live Preview</span>
                </div>
                <button
                    onClick={handleRetry}
                    className="p-1 hover:bg-green-100 rounded transition-colors"
                    title="Restart preview"
                >
                    <RefreshCw className="h-3 w-3 text-green-700" />
                </button>
            </div>

            <div className="flex-1">
                <iframe
                    ref={iframeRef}
                    src={previewUrl || ''}
                    className="w-full h-full border-0"
                    title="Live Preview"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                />
            </div>
        </div>
    );
}
