"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Code, Eye, Copy, Download, FolderTree } from 'lucide-react';
import { FileTreeViewer } from './FileTreeViewer';
import { MultiFilePreview } from './MultiFilePreview';
import { ProjectType } from '@/lib/file-tree-generator';

interface CodePreviewProps {
  code?: string;
  language?: string;
  fileTree?: Record<string, string>;
  projectType?: ProjectType;
  onRun?: () => void;
}

export function CodePreview({ code, language, fileTree, projectType, onRun }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'files'>('code');
  const [iframeSrc, setIframeSrc] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [selectedFileContent, setSelectedFileContent] = useState<string>('');

  const isMultiFile = !!fileTree;

  // Auto-select first file when file tree is available
  useEffect(() => {
    if (isMultiFile && fileTree) {
      const files = Object.keys(fileTree);
      if (files.length > 0 && !selectedFile) {
        // Prefer selecting main entry files
        const mainFile = files.find(f =>
          f.includes('App.tsx') || f.includes('app.tsx') ||
          f.includes('index.tsx') || f.includes('main.tsx') ||
          f.includes('page.tsx')
        ) || files[0];

        setSelectedFile(mainFile);
        setSelectedFileContent(fileTree[mainFile]);
        setActiveTab('files');
      }
    }
  }, [fileTree, isMultiFile, selectedFile]);

  useEffect(() => {
    if (code && language === 'html') {
      // Create a blob URL for HTML preview
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Preview</title>
          <style>
            body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
          </style>
        </head>
        <body>
          ${code}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setIframeSrc(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [code, language]);

  const handleFileSelect = (path: string, content: string) => {
    setSelectedFile(path);
    setSelectedFileContent(content);
  };

  const copyCode = async () => {
    try {
      const contentToCopy = isMultiFile ? selectedFileContent : (code || '');
      await navigator.clipboard.writeText(contentToCopy);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const downloadCode = () => {
    if (isMultiFile) {
      // In multi-file mode, download the selected file
      const fileName = selectedFile.split('/').pop() || 'file.txt';
      const blob = new Blob([selectedFileContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Original single-file download
      const extension = language === 'html' ? 'html' : language === 'javascript' ? 'js' : 'txt';
      const blob = new Blob([code || ''], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-code.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!code && !fileTree) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Code className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg font-medium mb-2">Code Preview</p>
        <p className="text-gray-400 text-sm">Generated code and live preview will appear here when you start building</p>
        <div className="mt-4">
          <div className="text-xs text-gray-400 mb-2">Example: Try asking "Build a simple button"</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {isMultiFile ? (
          <>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeTab === 'files'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <FolderTree className="h-4 w-4" />
              Project Files
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeTab === 'preview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeTab === 'code'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Code className="h-4 w-4" />
              Code
            </button>
            {language === 'html' && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${activeTab === 'preview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
            )}
          </>
        )}

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyCode}
            className="text-gray-600 hover:text-gray-900"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadCode}
            className="text-gray-600 hover:text-gray-900"
          >
            <Download className="h-4 w-4" />
          </Button>
          {onRun && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRun}
              className="text-gray-600 hover:text-gray-900"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isMultiFile ? (
          <>
            {activeTab === 'files' ? (
              <div className="h-full flex">
                {/* File Tree Sidebar */}
                <div className="w-64 flex-shrink-0">
                  <FileTreeViewer
                    fileTree={fileTree!}
                    projectType={projectType!}
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                  />
                </div>

                {/* Selected File Content */}
                <div className="flex-1 overflow-auto bg-white text-gray-900 p-4">
                  {selectedFile ? (
                    <>
                      <div className="mb-2 text-xs text-gray-500 font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">
                        {selectedFile}
                      </div>
                      <pre className="text-sm leading-relaxed">
                        <code>{selectedFileContent}</code>
                      </pre>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Select a file to view its contents
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <MultiFilePreview
                fileTree={fileTree!}
                projectType={projectType!}
              />
            )}
          </>
        ) : (
          <>
            {activeTab === 'code' ? (
              <div className="h-full overflow-auto bg-white text-gray-900 p-4 border border-gray-200">
                <pre className="text-sm leading-relaxed">
                  <code>{code}</code>
                </pre>
              </div>
            ) : (
              <div className="h-full">
                {iframeSrc && (
                  <iframe
                    src={iframeSrc}
                    className="w-full h-full border-0"
                    title="Live Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
