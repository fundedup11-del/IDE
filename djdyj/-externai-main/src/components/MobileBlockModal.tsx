"use client"

import React from "react";
import { Monitor, Smartphone, Code, Layers, Zap, X } from "lucide-react";

export function MobileBlockModal() {
  return (
    <div className="fixed inset-0 bg-linear-to-br from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-md z-9999 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Decorative Elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        {/* Icon */}
        <div className="relative mb-6 flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-3 shadow-lg">
              <Monitor className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
          Desktop Required
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-6">
          ExternAI IDE is designed for desktop development
        </p>

        {/* Reasons */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
              <Code className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Full-Stack Development</h3>
              <p className="text-xs text-gray-600">Build complete applications with advanced code editor features</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Split-Screen Preview</h3>
              <p className="text-xs text-gray-600">View code and live preview side-by-side for better workflow</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Keyboard Shortcuts</h3>
              <p className="text-xs text-gray-600">Professional IDE features require physical keyboard input</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl p-4 text-center">
          <p className="text-white text-sm font-medium mb-2">
            Switch to Desktop for the Best Experience
          </p>
          <p className="text-white/80 text-xs">
            Access ExternAI on a computer to unlock all features
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Open this link on your desktop or laptop to continue
        </p>
      </div>
    </div>
  );
}
