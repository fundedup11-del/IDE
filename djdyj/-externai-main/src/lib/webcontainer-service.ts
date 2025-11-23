// Types for WebContainer (simplified)
interface FileSystemTree {
    [key: string]: {
        file?: { contents: string };
        directory?: FileSystemTree;
    };
}

interface WebContainerInstance {
    mount(tree: FileSystemTree): Promise<void>;
    spawn(command: string, args: string[]): Promise<WebContainerProcess>;
    fs: {
        readFile(path: string, encoding: 'utf-8'): Promise<string>;
        writeFile(path: string, content: string): Promise<void>;
    };
    on(event: string, callback: (...args: any[]) => void): void;
}

interface WebContainerProcess {
    output: ReadableStream<string>;
    exit: Promise<number>;
}

/**
 * WebContainer Service - Manages WebContainer instance and operations
 * Provides singleton instance for running multi-file projects in the browser
 * 
 * NOTE: Includes a MOCK implementation for environments where @webcontainer/api
 * is not installed or supported (e.g. without proper COOP/COEP headers).
 */
export class WebContainerService {
    private static instance: WebContainerInstance | null = null;
    private static isBooting = false;
    private static useMock = false;

    /**
     * Get or create WebContainer instance
     */
    static async getInstance(): Promise<WebContainerInstance> {
        if (this.instance) {
            return this.instance;
        }

        if (this.isBooting) {
            // Wait for existing boot to complete
            await new Promise(resolve => setTimeout(resolve, 100));
            return this.getInstance();
        }

        this.isBooting = true;
        try {
            console.log('🚀 Booting WebContainer...');

            // Try dynamic import
            try {
                // @ts-ignore - Package might not be installed
                const { WebContainer } = await import('@webcontainer/api');
                this.instance = await WebContainer.boot();
                console.log('✅ WebContainer ready (Real)');
            } catch (e) {
                console.warn('⚠️ @webcontainer/api not found or failed to boot. Using MOCK implementation.', e);
                this.useMock = true;
                this.instance = new MockWebContainer();
                // Simulate boot delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                console.log('✅ WebContainer ready (Mock)');
            }

            return this.instance!;
        } finally {
            this.isBooting = false;
        }
    }

    /**
     * Convert flat file tree to WebContainer FileSystemTree format
     */
    static convertToFileSystemTree(fileTree: Record<string, string>): FileSystemTree {
        const tree: FileSystemTree = {};

        for (const [path, content] of Object.entries(fileTree)) {
            const parts = path.split('/');
            let current = tree;

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const isFile = i === parts.length - 1;

                if (isFile) {
                    current[part] = {
                        file: {
                            contents: content
                        }
                    };
                } else {
                    if (!current[part]) {
                        current[part] = {
                            directory: {}
                        };
                    }
                    current = (current[part] as any).directory;
                }
            }
        }

        return tree;
    }

    /**
     * Mount files to WebContainer
     */
    static async mountFiles(fileTree: Record<string, string>): Promise<void> {
        const container = await this.getInstance();
        const fsTree = this.convertToFileSystemTree(fileTree);

        console.log('📁 Mounting files:', Object.keys(fileTree).length);
        await container.mount(fsTree);
        console.log('✅ Files mounted');
    }

    /**
     * Install npm dependencies
     */
    static async installDependencies(
        onProgress?: (line: string) => void
    ): Promise<void> {
        const container = await this.getInstance();

        console.log('📦 Installing dependencies...');
        const installProcess = await container.spawn('npm', ['install']);

        if (onProgress) {
            const reader = installProcess.output.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                onProgress(value);
            }
        }

        const exitCode = await installProcess.exit;

        if (exitCode !== 0) {
            throw new Error(`npm install failed with exit code ${exitCode}`);
        }

        console.log('✅ Dependencies installed');
    }

    /**
     * Start development server
     */
    static async startDevServer(
        onLog?: (line: string) => void
    ): Promise<string> {
        const container = await this.getInstance();

        console.log('🚀 Starting dev server...');

        // Spawn the dev server process
        const serverProcess = await container.spawn('npm', ['run', 'dev']);

        if (onLog) {
            const reader = serverProcess.output.getReader();
            // Don't await the loop, let it run in background
            (async () => {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        onLog(value);
                    }
                } catch (e) {
                    console.error('Error reading server output:', e);
                }
            })();
        }

        // Wait for server to be ready
        const url = await new Promise<string>((resolve, reject) => {
            const timeout = setTimeout(() => {
                if (this.useMock) {
                    // Create a blob URL for the mock preview
                    const mockHtml = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>
                                @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
                            </style>
                        </head>
                        <body class="bg-slate-50 flex items-center justify-center h-screen font-sans text-slate-900">
                            <div class="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md border border-slate-100">
                                <div class="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6" style="animation: float 3s ease-in-out infinite">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                </div>
                                <h2 class="text-2xl font-bold mb-3">Preview Simulation</h2>
                                <p class="text-slate-600 mb-6 leading-relaxed">
                                    The WebContainer environment is running in <strong>Mock Mode</strong>.
                                    <br><span class="text-sm text-slate-400">(Dependency <code>@webcontainer/api</code> not found)</span>
                                </p>
                                <div class="text-left bg-slate-900 rounded-lg p-4 shadow-inner">
                                    <div class="flex gap-1.5 mb-3">
                                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <code class="text-sm font-mono text-green-400">
                                        > npm install @webcontainer/api
                                    </code>
                                </div>
                            </div>
                        </body>
                        </html>
                    `;
                    const blob = new Blob([mockHtml], { type: 'text/html' });
                    resolve(URL.createObjectURL(blob));
                } else {
                    reject(new Error('Server startup timeout'));
                }
            }, 3000);

            container.on('server-ready', (port: number, url: string) => {
                clearTimeout(timeout);
                console.log(`✅ Server ready at ${url}`);
                resolve(url);
            });
        });

        return url;
    }

    /**
     * Execute a command in WebContainer
     */
    static async exec(
        command: string,
        args: string[] = [],
        onOutput?: (data: string) => void
    ): Promise<number> {
        const container = await this.getInstance();
        const process = await container.spawn(command, args);

        if (onOutput) {
            const reader = process.output.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                onOutput(value);
            }
        }

        return await process.exit;
    }

    /**
     * Read a file from WebContainer
     */
    static async readFile(path: string): Promise<string> {
        const container = await this.getInstance();
        const data = await container.fs.readFile(path, 'utf-8');
        return data;
    }

    /**
     * Write a file to WebContainer
     */
    static async writeFile(path: string, content: string): Promise<void> {
        const container = await this.getInstance();
        await container.fs.writeFile(path, content);
    }

    /**
     * Clean up WebContainer instance
     */
    static dispose(): void {
        if (this.instance) {
            console.log('🧹 Disposing WebContainer');
            this.instance = null;
        }
    }

    /**
     * Check if WebContainer is supported in current browser
     */
    static isSupported(): boolean {
        // Always return true to allow Mock fallback to work
        return true;
    }
}

// --- MOCK IMPLEMENTATION ---

class MockWebContainer implements WebContainerInstance {
    fs = {
        readFile: async (path: string) => '',
        writeFile: async (path: string, content: string) => { }
    };

    async mount(tree: FileSystemTree) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate mount time
    }

    async spawn(command: string, args: string[]): Promise<WebContainerProcess> {
        const stream = new ReadableStream<string>({
            start(controller) {
                if (command === 'npm' && args[0] === 'install') {
                    // Simulate npm install output
                    const steps = [
                        'added 142 packages in 2s',
                        '15 packages are looking for funding',
                        'run `npm fund` for details',
                        'found 0 vulnerabilities'
                    ];
                    let i = 0;
                    const interval = setInterval(() => {
                        if (i >= steps.length) {
                            clearInterval(interval);
                            controller.close();
                        } else {
                            controller.enqueue(steps[i] + '\n');
                            i++;
                        }
                    }, 800);
                } else if (command === 'npm' && args[0] === 'run' && args[1] === 'dev') {
                    // Simulate dev server output
                    const steps = [
                        '> vite dev',
                        '',
                        '  VITE v4.4.9  ready in 312 ms',
                        '',
                        '  ➜  Local:   http://localhost:5173/',
                        '  ➜  Network: use --host to expose',
                    ];
                    let i = 0;
                    const interval = setInterval(() => {
                        if (i >= steps.length) {
                            clearInterval(interval);
                            // Don't close controller to keep stream open like a real server
                        } else {
                            controller.enqueue(steps[i] + '\n');
                            i++;
                        }
                    }, 500);
                } else {
                    controller.close();
                }
            }
        });

        return {
            output: stream,
            exit: new Promise(resolve => {
                if (command === 'npm' && args[0] === 'run' && args[1] === 'dev') {
                    // Server doesn't exit immediately
                    setTimeout(() => resolve(0), 300000);
                } else {
                    setTimeout(() => resolve(0), 3500);
                }
            })
        };
    }

    on(event: string, callback: (...args: any[]) => void) {
        if (event === 'server-ready') {
            // Trigger server ready after a delay
            setTimeout(() => {
                callback(5173, 'http://localhost:5173');
            }, 3000);
        }
    }
}
