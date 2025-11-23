"use client"

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Plus, Code, FileText, Zap, User } from "lucide-react";
import { CodePreview } from "@/components/CodePreview";
import { AnimatedText } from "@/components/AnimatedText";
import { DevProcess } from "@/components/DevProcess";
import { ObserverTasks } from "@/components/ObserverTasks";
import { ProjectType } from "@/lib/file-tree-generator";
import { useSupabaseConfig } from "@/hooks/useSupabaseConfig";

interface Message {
  id: string;
  type: "user" | "assistant" | "observer";
  content: string;
  timestamp: Date;
  hasCode?: boolean;
  isObserver?: boolean;
}

interface ChatInterfaceProps {
  currentCode: string;
  onCodeChange: (code: string) => void;
  restoredCode?: string;
  initialPrompt?: string;
  onPromptSubmit?: () => void;
  allowPrompt?: boolean;
}

export function ChatInterface({ currentCode, onCodeChange, restoredCode, initialPrompt, onPromptSubmit, allowPrompt = true }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("");
  const [activeTab, setActiveTab] = useState<'chat' | 'preview'>('chat');
  const [fileTree, setFileTree] = useState<Record<string, string> | null>(null);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update language when code is restored from history
  useEffect(() => {
    if (currentCode && currentCode.includes('<!DOCTYPE html')) {
      setCurrentLanguage('html');
    }
  }, [currentCode]);

  // Handle initial prompt from landing page
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      setInput(initialPrompt);
    }
  }, [initialPrompt, messages.length]);

  // Handle next step selection from Observer AI
  const handleNextStepSelect = (step: string) => {
    if (isLoading) return;
    setInput(step);
    // Auto-submit after a short delay to let user see what was selected
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // If parent has disabled further prompts (user used the free prompt and isn't signed in),
    // trigger the parent's auth flow instead of sending the request. Keep input intact so
    // the user doesn't lose their typed prompt and can submit after signing in.
    if (allowPrompt === false) {
      if (typeof onPromptSubmit === 'function') {
        onPromptSubmit();
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const currentInput = input.trim();
    setMessages((prev) => [...prev, userMessage]);
    // Notify parent that a prompt was submitted (so it can increment prompt count / show auth)
    if (typeof onPromptSubmit === 'function') {
      try { onPromptSubmit(); } catch (err) { /* ignore */ }
    }
    setInput("");
    setIsLoading(true);

    try {
      // Build conversation history (only user and assistant messages for context)
      const conversationHistory = messages
        .filter(msg => msg.type === 'user' || msg.type === 'assistant')
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      // Call API with conversation history
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          history: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.message,
        timestamp: new Date(),
        hasCode: !!(data.code || data.fileTree),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Add Observer AI insights as a separate message if available (without visual label)
      if (data.observerInsights) {
        const observerMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: "observer",
          content: data.observerInsights,
          timestamp: new Date(),
          isObserver: true,
        };
        setMessages((prev) => [...prev, observerMessage]);
      }

      // Handle multi-file response
      if (data.fileTree) {
        setFileTree(data.fileTree);
        setProjectType(data.projectType);
        setCurrentLanguage('project');
      } else if (data.code) {
        // Single-file response (original behavior)
        onCodeChange(data.code);
        setCurrentLanguage(data.language || 'html');
      }
    } catch (error) {
      console.error('Error calling AI API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickStartPrompts = [
    {
      icon: <Code className="h-4 w-4" />,
      text: "Build a todo app with React",
      description: "Create a simple task management application"
    },
    {
      icon: <Zap className="h-4 w-4" />,
      text: "Design a landing page",
      description: "Build a modern, responsive landing page"
    },
    {
      icon: <FileText className="h-4 w-4" />,
      text: "Create a blog platform",
      description: "Build a content management system"
    },
    {
      icon: <Zap className="h-4 w-4" />,
      text: "Build an API server",
      description: "Create a REST API with authentication"
    }
  ];

  return (
    <div className="flex h-full flex-col bg-blue-50 relative">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area - Left panel (40% on desktop, 100% on mobile) */}
        <div className={`w-full md:w-[40%] flex flex-col border-r border-blue-200 bg-blue-50 ${activeTab === 'chat' ? 'flex' : 'hidden'} md:flex`} id="chat-panel">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6 pb-20 md:pb-0">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto px-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Welcome to ExternAI</h1>

                {/* Quick Start Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl">
                  {quickStartPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(prompt.text)}
                      className="p-3 md:p-4 bg-white hover:bg-blue-100 rounded-xl border border-blue-200 text-left transition-colors group shadow-sm"
                    >
                      <div className="flex items-start gap-2 md:gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 text-blue-600 shrink-0">
                          {prompt.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 font-medium mb-1 text-sm md:text-base">{prompt.text}</h3>
                          <p className="text-gray-600 text-xs md:text-sm">{prompt.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-2xl p-3 md:p-4 rounded-2xl wrap-break-word ${message.type === "user"
                        ? "text-black"
                        : message.type === "observer"
                          ? "border-2 border-purple-200"
                          : ""
                        }`}
                    >
                      {message.type === "user" && (
                        <div className="flex items-center gap-2 mb-2 justify-end">
                          <span className="text-gray-600 text-xs md:text-sm">You</span>
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-600 rounded-full flex items-center justify-center">
                            <User className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          </div>
                        </div>
                      )}
                      {message.type === "assistant" && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">E</span>
                          </div>
                          <span className="text-gray-600 text-xs md:text-sm">ExternAI</span>
                        </div>
                      )}
                      {message.type === "assistant" ? (
                        message.hasCode ? (
                          <DevProcess
                            text={message.content}
                            className="whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere text-sm md:text-base"
                          />
                        ) : (
                          <AnimatedText
                            text={message.content}
                            className="whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere text-justify text-sm md:text-base"
                          />
                        )
                      ) : message.type === "observer" ? (
                        <ObserverTasks
                          text={message.content}
                          className="text-purple-900 text-sm md:text-base"
                          onNextStepSelect={handleNextStepSelect}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere text-sm md:text-base">{message.content}</div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] md:max-w-2xl p-3 md:p-4 rounded-2xl text-gray-900">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">E</span>
                        </div>
                        <span className="text-gray-600 text-xs md:text-sm">ExternAI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
                        </div>
                        <span className="text-gray-500 text-xs md:text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Desktop */}
          <div className="hidden md:block shrink-0 p-6 border-t border-blue-200 bg-blue-50">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative will-change-auto">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask ExternAI....."
                    className="w-full p-4 pr-12 bg-white border border-blue-300 rounded-2xl text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>Powered by AI</span>
              </div>
            </form>
          </div>

          {/* Input Area - Mobile (Fixed at bottom) */}
          <div className="md:hidden fixed bottom-16 left-0 right-0 p-3 border-t border-blue-200 bg-blue-50 z-10">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask ExternAI....."
                    className="w-full p-3 pr-12 bg-white border border-blue-300 rounded-xl text-gray-900 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 bottom-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel - Code Preview (60% on desktop, 100% on mobile) */}
        <div className={`w-full md:w-[60%] bg-gray-50 flex-col ${activeTab === 'preview' ? 'flex' : 'hidden'} md:flex`} id="preview-panel">
          <div className="flex-1 p-2 md:p-4 overflow-hidden pb-16 md:pb-0">
            <div className="h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <CodePreview
                code={currentCode}
                language={currentLanguage}
                fileTree={fileTree || undefined}
                projectType={projectType || undefined}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20 safe-area-inset-bottom">
        <div className="grid grid-cols-2 h-16">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'chat'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs font-medium">Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeTab === 'preview'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Code className="h-5 w-5" />
            <span className="text-xs font-medium">Preview</span>
          </button>
        </div>
      </div>
    </div>
  );
}