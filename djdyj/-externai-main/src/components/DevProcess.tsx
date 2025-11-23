"use client"

import React, { useState, useEffect } from 'react';
import { File, FileText, Code, CheckCircle, Loader } from 'lucide-react';

interface DevProcessProps {
  text?: string;
  className?: string;
}

export function DevProcess({ text = "", className = "" }: DevProcessProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Extract development steps from the text
  const steps = (text || "").split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed.includes('...') || 
           trimmed.includes('Creating') || 
           trimmed.includes('Reading') || 
           trimmed.includes('Analyzing') || 
           trimmed.includes('Writing') || 
           trimmed.includes('Optimizing') ||
           trimmed.includes('Building') ||
           trimmed.includes('Generating');
  }).map(step => step.trim());

  // Extract file names from steps
  const getFileName = (step: string) => {
    const fileMatch = step.match(/\b[\w-]+\.(html|css|js|jsx|ts|tsx|json|md)\b/);
    return fileMatch ? fileMatch[0] : null;
  };

  const getStepIcon = (step: string) => {
    if (step.includes('Creating') || step.includes('Generating')) return <File className="h-4 w-4" />;
    if (step.includes('Reading') || step.includes('Analyzing')) return <FileText className="h-4 w-4" />;
    if (step.includes('Writing') || step.includes('Building')) return <Code className="h-4 w-4" />;
    return <Loader className="h-4 w-4" />;
  };

  useEffect(() => {
    if (steps.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          // Add previous step to completed steps
          setCompletedSteps(completed => [...completed, prev]);
          return prev + 1;
        } else {
          // Complete the last step
          setCompletedSteps(completed => [...completed, prev]);
          clearInterval(interval);
          return prev;
        }
      });
    }, 1500); // Each step takes 1.5 seconds

    return () => clearInterval(interval);
  }, [steps.length]);

  // If no development steps found, show the original text
  if (steps.length === 0) {
    return (
      <div className={className}>
        <div className="text-gray-600">{text}</div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-3`}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = completedSteps.includes(index);
        const fileName = getFileName(step);
        
        return (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
              isActive 
                ? 'bg-blue-50 border-l-4 border-blue-500' 
                : isCompleted 
                ? 'bg-green-50 border-l-4 border-green-500' 
                : 'bg-gray-50 opacity-50'
            }`}
          >
            <div className={`shrink-0 ${
              isActive 
                ? 'text-blue-600 animate-spin' 
                : isCompleted 
                ? 'text-green-600' 
                : 'text-gray-400'
            }`}>
              {isCompleted ? <CheckCircle className="h-4 w-4" /> : getStepIcon(step)}
            </div>
            
            <div className="flex-1">
              <div className={`text-sm font-medium ${
                isActive 
                  ? 'text-blue-900' 
                  : isCompleted 
                  ? 'text-green-900' 
                  : 'text-gray-600'
              }`}>
                {step}
              </div>
              
              {fileName && (
                <div className={`text-xs font-mono mt-1 ${
                  isActive 
                    ? 'text-blue-700' 
                    : isCompleted 
                    ? 'text-green-700' 
                    : 'text-gray-500'
                }`}>
                  📁 {fileName}
                </div>
              )}
            </div>
            
            {isActive && (
              <div className="shrink-0">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
      
      {completedSteps.length === steps.length && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Development complete! Code is ready for preview.</span>
          </div>
        </div>
      )}
    </div>
  );
}
