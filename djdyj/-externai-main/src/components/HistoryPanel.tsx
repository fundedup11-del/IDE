"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { History, X, RotateCcw, Calendar, Code2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface HistoryVersion {
  id: string;
  title: string;
  code: string;
  timestamp: Date;
  description: string;
}

interface HistoryPanelProps {
  currentCode: string;
  onRestoreVersion: (code: string) => void;
}

export function HistoryPanel({ currentCode, onRestoreVersion }: HistoryPanelProps) {
  const [versions, setVersions] = useState<HistoryVersion[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load versions from localStorage on component mount
  useEffect(() => {
    const savedVersions = localStorage.getItem('externai-history');
    if (savedVersions) {
      const parsedVersions = JSON.parse(savedVersions).map((v: any) => ({
        ...v,
        timestamp: new Date(v.timestamp)
      }));
      setVersions(parsedVersions);
    }
  }, []);

  // Save a new version when currentCode changes
  const saveVersion = (title: string, description: string = "") => {
    if (!currentCode.trim()) return;

    const newVersion: HistoryVersion = {
      id: Date.now().toString(),
      title,
      code: currentCode,
      timestamp: new Date(),
      description
    };

    const updatedVersions = [newVersion, ...versions].slice(0, 20); // Keep only last 20 versions
    setVersions(updatedVersions);
    localStorage.setItem('externai-history', JSON.stringify(updatedVersions));
  };

  // Auto-save when code changes significantly
  useEffect(() => {
    if (currentCode && currentCode.length > 100) {
      const lastVersion = versions[0];
      // Only save if it's significantly different from the last version
      if (!lastVersion || lastVersion.code !== currentCode) {
        const title = `Version ${versions.length + 1}`;
        const description = "Auto-saved version";
        saveVersion(title, description);
      }
    }
  }, [currentCode]);

  const restoreVersion = (version: HistoryVersion) => {
    onRestoreVersion(version.code);
    setIsOpen(false);
  };

  const deleteVersion = (versionId: string) => {
    const updatedVersions = versions.filter(v => v.id !== versionId);
    setVersions(updatedVersions);
    localStorage.setItem('externai-history', JSON.stringify(updatedVersions));
  };

  const clearAllHistory = () => {
    setVersions([]);
    localStorage.removeItem('externai-history');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-600 hover:bg-gray-100"
          title="Show History"
        >
          <History className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <DialogTitle className="text-xl font-semibold">Version History</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Restore previous versions of your project
            </DialogDescription>
          </div>
          <div className="flex gap-2">
            {versions.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearAllHistory}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {versions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <History className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No version history yet</p>
              <p className="text-sm text-center">
                Start building something and your versions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((version, index) => (
                <div 
                  key={version.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Code2 className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-gray-900">{version.title}</span>
                        {index === 0 && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Latest
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(version.timestamp, { addSuffix: true })}
                        </div>
                        <div>
                          {version.code.length} characters
                        </div>
                      </div>

                      {version.description && (
                        <p className="text-sm text-gray-600 mb-3">{version.description}</p>
                      )}

                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <pre className="text-xs text-gray-700 overflow-hidden">
                          {version.code.substring(0, 200)}
                          {version.code.length > 200 && "..."}
                        </pre>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => restoreVersion(version)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteVersion(version.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
