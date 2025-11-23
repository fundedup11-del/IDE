"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Code, Zap, Box, Wand2, Rocket, Image as ImageIcon, Palette, Layout } from "lucide-react";
import { useRouter } from 'next/navigation';

export function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

  // Prefetch the app page for faster navigation
  useEffect(() => {
    router.prefetch('/app');
  }, [router]);

  const handleStartBuilding = () => {
    if (prompt.trim()) {
      // Navigate to the main app with the initial prompt
      router.push(`/app?prompt=${encodeURIComponent(prompt.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleStartBuilding();
    }
  };

  const examplePrompts = [
    "Build a modern e-commerce website with shopping cart",
    "Create a social media dashboard with analytics",
    "Design a portfolio website for a photographer",
    "Build a task management app like Todoist",
    "Create a restaurant website with online ordering",
    "Design a fitness tracking web application"
  ];

  const features = [
    {
      icon: <Wand2 className="h-5 w-5" />,
      title: "Prompt to App",
      description: "Turn your ideas into working apps instantly"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Live Preview",
      description: "Watch your app materialize in real-time"
    },
    {
      icon: <Palette className="h-5 w-5" />,
      title: "Beautiful Design",
      description: "Modern, responsive UIs out of the box"
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "Clean Code",
      description: "Production-ready, well-structured code"
    },
    {
      icon: <Layout className="h-5 w-5" />,
      title: "Any Layout",
      description: "From landing pages to complex dashboards"
    },
    {
      icon: <Rocket className="h-5 w-5" />,
      title: "Deploy Ready",
      description: "Export and deploy to any platform"
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-blue-50/30 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl text-gray-900">ExternAI</span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => router.push('/app')}
              >
                Sign in
              </Button>
              <Button 
                className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm"
                onClick={() => router.push('/app')}
              >
                Start building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-20 lg:py-28">
        <div className="max-w-6xl w-full text-center space-y-16">
          
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span>Powered by GPT-4o</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              The AI app
              <br />
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">builder</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Build full-stack applications at the speed of conversation.
              <br />
              Just describe what you want, and watch it come to life.
            </p>
          </div>

          {/* Chat Interface */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-20"></div>
              
              <div className="relative bg-white border border-gray-200 rounded-3xl shadow-xl p-2">
                <div className="flex items-center gap-2 p-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your app idea..."
                    rows={1}
                    className="flex-1 text-lg px-4 py-3 bg-transparent border-none focus:outline-none resize-none placeholder:text-gray-400"
                    style={{ minHeight: '56px' }}
                  />
                  <Button
                    onClick={handleStartBuilding}
                    disabled={!prompt.trim()}
                    className="h-14 w-14 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-200 disabled:to-gray-200 shadow-lg disabled:shadow-none transition-all"
                    size="icon"
                  >
                    <ArrowRight className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Example prompts */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-gray-500">Try:</span>
              {examplePrompts.slice(0, 3).map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-sm bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full border border-gray-200 transition-all hover:border-blue-300 hover:shadow-sm"
                >
                  {example.length > 50 ? example.substring(0, 50) + '...' : example}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shrink-0">
                    {feature.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof / Stats */}
          <div className="flex flex-wrap justify-center items-center gap-12 py-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900">1000+</div>
              <div className="text-sm text-gray-600 mt-1">Apps Built</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200"></div>
            <div>
              <div className="text-4xl font-bold text-gray-900">&lt; 5 min</div>
              <div className="text-sm text-gray-600 mt-1">Average Build Time</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-200"></div>
            <div>
              <div className="text-4xl font-bold text-gray-900">AI-First</div>
              <div className="text-sm text-gray-600 mt-1">Development</div>
            </div>
          </div>

          {/* Examples */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Build anything</h3>
              <p className="text-gray-600">From simple landing pages to complex web apps</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-left p-5 bg-white hover:bg-gray-50 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">{example}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center space-y-6 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold">Start building for free</h2>
            <p className="text-xl text-blue-50 max-w-2xl mx-auto">
              No credit card required. Get 1 free prompt to try it out, then sign up for more.
            </p>
            <Button 
              onClick={() => router.push('/app')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-6 h-auto rounded-2xl shadow-xl font-semibold"
            >
              Get started now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">ExternAI</div>
                <div className="text-xs text-gray-500">© 2025 All rights reserved</div>
              </div>
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Docs</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
