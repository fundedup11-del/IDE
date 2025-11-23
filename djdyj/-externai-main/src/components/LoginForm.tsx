"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, LogIn, UserPlus, Sparkles, Code, Zap, CheckCircle2 } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();

  useEffect(() => {
    console.log('LoginForm - User state:', user ? `Logged in as ${user.email}` : 'Not logged in');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      // Log full error for debugging
      console.error('Firebase Auth Error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      // Handle specific Firebase auth errors with user-friendly messages
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-5xl flex gap-8 items-center relative z-10">
        {/* Left Side - Motivational Content */}
        <div className="hidden lg:flex flex-col flex-1 space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Almost there!</span>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Your AI-Powered IDE is
              <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ready to Go! 🚀
              </span>
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Sign in to start building amazing applications with the power of AI. 
              Your creative journey is just one click away.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-3 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Code Generation</h3>
                <p className="text-sm text-gray-600">Generate full-stack applications instantly</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Code className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Live Preview</h3>
                <p className="text-sm text-gray-600">See your app running in real-time</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Smart Iteration</h3>
                <p className="text-sm text-gray-600">Refine and improve with natural language</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">AI</div>
              <div className="text-xs text-gray-600">Powered</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-purple-600">Fast</div>
              <div className="text-xs text-gray-600">Development</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-pink-600">Free</div>
              <div className="text-xs text-gray-600">To Start</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-96 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Logo/Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {isSignUp ? 'Join ExternAI' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600 text-sm">
              {isSignUp ? 'Create your account to get started' : 'Sign in to continue building'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2">
              <span className="text-red-500 font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Please wait...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {isSignUp ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
              </div>
            )}
          </Button>
        </form>

        {/* Toggle Sign In/Up */}
        <div className="mt-6 text-center text-sm">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Mobile-only motivational text */}
        <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>Your AI IDE is ready!</span>
            </div>
            <p className="text-xs text-gray-500">
              Build full-stack apps with natural language
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
