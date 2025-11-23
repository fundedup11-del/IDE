"use client"

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';

interface ObserverTasksProps {
  text: string;
  className?: string;
  onNextStepSelect?: (step: string) => void;
}

export function ObserverTasks({ text, className = "", onNextStepSelect }: ObserverTasksProps) {
  const [displayedTasks, setDisplayedTasks] = useState<Array<{ text: string; completed: boolean; isNextStep?: boolean }>>([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [nextStepsList, setNextStepsList] = useState<string[]>([]);

  useEffect(() => {
    // Parse the text to separate completed tasks and next steps
    const sections = text.split(/\*\*NEXT STEPS:\*\*|\*\*COMPLETED TASKS:\*\*/i);
    
    let completedTasksText = '';
    let nextStepsText = '';
    
    if (text.includes('**COMPLETED TASKS:**') || text.includes('**NEXT STEPS:**')) {
      completedTasksText = sections[1] || '';
      nextStepsText = sections[2] || '';
    } else {
      // Fallback: treat all as completed tasks
      completedTasksText = text;
    }

    // Parse completed tasks
    const completedLines = completedTasksText
      .split('\n')
      .filter(line => line.trim().length > 0 && !line.includes('**'));
    
    const completedTasks = completedLines.map(line => ({
      text: line.trim(),
      completed: false,
      isNextStep: false
    }));

    // Parse next steps
    const nextStepLines = nextStepsText
      .split('\n')
      .filter(line => line.trim().length > 0 && !line.includes('**'));
    
    const nextStepTasks = nextStepLines.map(line => ({
      text: line.trim(),
      completed: false,
      isNextStep: true
    }));

    setNextStepsList(nextStepLines.map(line => line.trim()));

    if (completedTasks.length === 0) return;

    // Animate completed tasks first
    let index = 0;
    const interval = setInterval(() => {
      if (index < completedTasks.length) {
        setDisplayedTasks(prev => [...prev, { ...completedTasks[index], completed: false }]);
        
        // Mark previous task as completed
        if (index > 0) {
          setDisplayedTasks(prev => 
            prev.map((task, i) => 
              i === index - 1 ? { ...task, completed: true } : task
            )
          );
        }
        
        index++;
      } else {
        // Mark ALL tasks as completed (not just the last one)
        setDisplayedTasks(prev => 
          prev.map((task) => 
            !task.isNextStep ? { ...task, completed: true } : task
          )
        );
        
        setAllCompleted(true);
        
        // Show next steps after a delay
        if (nextStepTasks.length > 0) {
          setTimeout(() => {
            setShowNextSteps(true);
            setDisplayedTasks(prev => [...prev, ...nextStepTasks]);
            
            // Show prompt after next steps are displayed
            setTimeout(() => {
              setShowPrompt(true);
            }, nextStepTasks.length * 200 + 500);
          }, 1000);
        }
        
        clearInterval(interval);
      }
    }, 800); // Show each task after 800ms

    return () => clearInterval(interval);
  }, [text]);

  const handleStepClick = (step: string) => {
    // Clean the text (no need to remove emoji since there won't be any)
    const cleanStep = step.trim();
    if (onNextStepSelect) {
      onNextStepSelect(cleanStep);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Completed Tasks Section */}
      <div className="space-y-2">
        {displayedTasks.filter(t => !t.isNextStep).map((task, index) => (
          <div 
            key={`completed-${index}`} 
            className="flex items-start gap-2 text-sm animate-in fade-in slide-in-from-left-2 duration-300"
          >
            {task.completed ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <Loader2 className="h-4 w-4 text-purple-600 animate-spin shrink-0 mt-0.5" />
            )}
            <span className={`${task.completed ? 'text-gray-600 line-through' : 'text-purple-900 font-medium'}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>

      {/* All Completed Message */}
      {allCompleted && (
        <div className="flex items-center gap-2 mt-3 p-2 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Sparkles className="h-4 w-4 text-green-600 shrink-0" />
          <span className="text-sm font-semibold text-green-700">
            ✅ All tasks completed successfully!
          </span>
        </div>
      )}

      {/* Next Steps Section */}
      {showNextSteps && displayedTasks.some(t => t.isNextStep) && (
        <div className="mt-4 pt-4 border-t border-purple-200 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-bold text-purple-700">Next Steps:</span>
          </div>
          {displayedTasks.filter(t => t.isNextStep).map((task, index) => (
            <div 
              key={`next-${index}`} 
              className="flex items-start gap-2 text-sm animate-in fade-in slide-in-from-left-2 duration-300"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <ArrowRight className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-gray-700">
                {task.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Prompt */}
      {showPrompt && nextStepsList.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-start gap-2 mb-3">
            <MessageCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-blue-900">
              Would you like me to proceed with any of these next steps?
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {nextStepsList.map((step, index) => {
              const cleanStep = step.trim();
              return (
                <button
                  key={index}
                  onClick={() => handleStepClick(step)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-white border border-blue-300 rounded-lg hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {cleanStep}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
