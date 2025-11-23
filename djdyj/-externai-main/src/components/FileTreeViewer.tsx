"use client"

import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, FileCode, FileText, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectType } from '@/lib/file-tree-generator';

interface FileTreeViewerProps {
    fileTree: Record<string, string>;
    projectType: ProjectType;
    onFileSelect: (path: string, content: string) => void;
    selectedFile?: string;
}

interface TreeNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: TreeNode[];
    content?: string;
}

export function FileTreeViewer({ fileTree, projectType, onFileSelect, selectedFile }: FileTreeViewerProps) {
    const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['src', 'app', 'components']));

    // Build tree structure from flat file list
    const buildTree = (): TreeNode[] => {
        const root: TreeNode[] = [];
        const pathMap = new Map<string, TreeNode>();

        // Sort paths to ensure directories come before their children
        const sortedPaths = Object.keys(fileTree).sort();

        sortedPaths.forEach(path => {
            const parts = path.split('/');
            const fileName = parts[parts.length - 1];

            // Build parent path
            let currentPath = '';
            let currentLevel = root;

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                currentPath = currentPath ? `${currentPath}/${part}` : part;

                const isLastPart = i === parts.length - 1;
                const isFile = isLastPart;

                let node = pathMap.get(currentPath);

                if (!node) {
                    node = {
                        name: part,
                        path: currentPath,
                        type: isFile ? 'file' : 'directory',
                        children: isFile ? undefined : [],
                        content: isFile ? fileTree[path] : undefined,
                    };

                    pathMap.set(currentPath, node);
                    currentLevel.push(node);
                }

                if (!isFile && node.children) {
                    currentLevel = node.children;
                }
            }
        });

        return root;
    };

    const toggleDirectory = (path: string) => {
        const newExpanded = new Set(expandedDirs);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
        }
        setExpandedDirs(newExpanded);
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();

        if (fileName === 'package.json' || fileName === 'tsconfig.json' || fileName.endsWith('.config.js') || fileName.endsWith('.config.ts')) {
            return <Settings className="h-4 w-4 text-amber-600" />;
        }

        switch (ext) {
            case 'tsx':
            case 'ts':
            case 'jsx':
            case 'js':
                return <FileCode className="h-4 w-4 text-blue-600" />;
            case 'css':
            case 'scss':
                return <FileText className="h-4 w-4 text-purple-600" />;
            case 'html':
                return <FileText className="h-4 w-4 text-orange-600" />;
            case 'json':
                return <FileText className="h-4 w-4 text-yellow-600" />;
            case 'md':
                return <FileText className="h-4 w-4 text-gray-600" />;
            default:
                return <File className="h-4 w-4 text-gray-500" />;
        }
    };

    const downloadAsZip = async () => {
        // This would require a library like JSZip in a real implementation
        console.log('Download as ZIP feature would be implemented here');
        alert('Download as ZIP feature coming soon!');
    };

    const TreeNodeComponent = ({ node, level = 0 }: { node: TreeNode; level?: number }) => {
        const isDirectory = node.type === 'directory';
        const isExpanded = expandedDirs.has(node.path);
        const isSelected = selectedFile === node.path;

        return (
            <div>
                <div
                    className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100 rounded ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                    style={{ paddingLeft: `${level * 12 + 8}px` }}
                    onClick={() => {
                        if (isDirectory) {
                            toggleDirectory(node.path);
                        } else {
                            onFileSelect(node.path, node.content || '');
                        }
                    }}
                >
                    {isDirectory && (
                        <span className="flex-shrink-0">
                            {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                        </span>
                    )}
                    {!isDirectory && <span className="w-4" />}

                    {isDirectory ? (
                        <Folder className={`h-4 w-4 ${isExpanded ? 'text-blue-500' : 'text-gray-500'}`} />
                    ) : (
                        getFileIcon(node.name)
                    )}

                    <span className={`text-sm truncate ${isSelected ? 'font-medium' : ''}`}>
                        {node.name}
                    </span>
                </div>

                {isDirectory && isExpanded && node.children && (
                    <div>
                        {node.children.map((child) => (
                            <TreeNodeComponent key={child.path} node={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const tree = buildTree();
    const fileCount = Object.keys(fileTree).length;

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-200">
            {/* Header */}
            <div className="p-3 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Project Files</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={downloadAsZip}
                        className="h-7 px-2"
                    >
                        <Download className="h-3.5 w-3.5" />
                    </Button>
                </div>
                <div className="text-xs text-gray-500">
                    <span className="font-medium">{projectType}</span>
                    <span className="mx-1">•</span>
                    <span>{fileCount} files</span>
                </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-auto p-2">
                {tree.map((node) => (
                    <TreeNodeComponent key={node.path} node={node} />
                ))}
            </div>

            {/* Footer Info */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-600">
                    💡 Select a file to view its contents
                </p>
            </div>
        </div>
    );
}
