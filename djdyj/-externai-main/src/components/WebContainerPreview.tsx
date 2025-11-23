"use client";

import { useEffect, useRef, useState } from 'react';
import { WebContainer } from '@webcontainer/api';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { getWebContainer } from '@/lib/webcontainer-singleton';

interface WebContainerPreviewProps {
  files: {
    'package.json'?: string;
    'server.js'?: string;
    'index.html'?: string;
    [key: string]: string | undefined;
  };
}

export function WebContainerPreview({ files }: WebContainerPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [webcontainer, setWebcontainer] = useState<WebContainer>();
  const [url, setUrl] = useState<string>();
  const [isBooting, setIsBooting] = useState(true);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const serverProcessRef = useRef<any>(null);
  const filesHashRef = useRef<string>('');

  // Generate hash of files to detect changes
  const getFilesHash = () => JSON.stringify(files);

  useEffect(() => {
    let isMounted = true;
    let fitAddon: FitAddon;

    async function initContainer() {
      try {
        const currentHash = getFilesHash();
        const isFileUpdate = filesHashRef.current !== '' && filesHashRef.current !== currentHash;
        
        // Use singleton to get WebContainer instance
        const container = await getWebContainer();
        if (!isMounted) return;
        
        setWebcontainer(container);

        // Initialize terminal only once
        if (!terminalInstanceRef.current && terminalRef.current) {
          const term = new Terminal({
            convertEol: true,
            theme: {
              background: '#1e1e1e',
              foreground: '#d4d4d4',
            }
          });

          fitAddon = new FitAddon();
          term.loadAddon(fitAddon);
          term.open(terminalRef.current);
          fitAddon.fit();
          terminalInstanceRef.current = term;
        }

        const term = terminalInstanceRef.current;
        if (!term) return;

        // If this is a file update, kill the existing server
        if (isFileUpdate && serverProcessRef.current) {
          term.writeln('\n🔄 Files changed, restarting server...\n');
          try {
            serverProcessRef.current.kill();
          } catch (e) {
            // Process might already be dead
          }
        }

        filesHashRef.current = currentHash;

        // Mount files
        const fileTree: Record<string, any> = {};
        
        // Default package.json if not provided
        const packageJson = files['package.json'] || JSON.stringify({
          name: 'user-backend',
          type: 'module',
          dependencies: {
            express: '^4.18.2',
            cors: '^2.8.5'
          },
          scripts: {
            start: 'node server.js'
          }
        }, null, 2);

        fileTree['package.json'] = {
          file: { contents: packageJson }
        };

        // Add all other files
        Object.entries(files).forEach(([path, content]) => {
          if (content && path !== 'package.json') {
            fileTree[path] = {
              file: { contents: content }
            };
          }
        });

        await container.mount(fileTree);
        
        if (!isFileUpdate) {
          term.writeln('📦 Installing dependencies...\n');
        }

        // Install dependencies (skip if just updating files)
        if (!isFileUpdate) {
          const installProcess = await container.spawn('npm', ['install']);
          installProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                term.write(data);
              },
            })
          );

          const installExitCode = await installProcess.exit;
          if (installExitCode !== 0) {
            term.writeln('\n❌ Installation failed');
            setIsBooting(false);
            return;
          }

          term.writeln('\n✅ Dependencies installed\n');
        }
        
        term.writeln('🚀 Starting server...\n');

        // Run dev server
        const serverProcess = await container.spawn('npm', ['start']);
        serverProcessRef.current = serverProcess;
        
        serverProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              term.write(data);
            },
          })
        );

        // Listen for server ready
        container.on('server-ready', (port, serverUrl) => {
          term.writeln(`\n✅ Server running at ${serverUrl}\n`);
          setUrl(serverUrl);
          setIsBooting(false);
        });

      } catch (error) {
        console.error('Failed to boot WebContainer:', error);
        const term = terminalInstanceRef.current;
        if (term) {
          term.writeln(`\n❌ Error: ${error}`);
        }
        setIsBooting(false);
      }
    }

    initContainer();

    return () => {
      isMounted = false;
      // Don't dispose terminal or teardown container - they're reused
    };
  }, [files]);

  return (
    <div className="h-full flex flex-col">
      {/* Terminal Output */}
      <div 
        ref={terminalRef} 
        className="h-48 bg-gray-900 border-b border-gray-700 overflow-hidden"
        style={{ minHeight: '200px' }}
      />

      {/* Preview */}
      <div className="flex-1 relative">
        {isBooting ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Booting Node.js environment...</p>
              <p className="text-gray-400 text-sm mt-2">Installing dependencies and starting server</p>
            </div>
          </div>
        ) : url ? (
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-0"
            title="Backend Preview"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <p className="text-red-600 font-medium">Failed to start server</p>
              <p className="text-gray-500 text-sm mt-2">Check the terminal output above for errors</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
