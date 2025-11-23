"use client"

import { Header } from "@/components/header";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { CompactLoginForm } from '@/components/CompactLoginForm';
import { usePromptLimit } from '@/hooks/usePromptLimit';
import { MobileBlockModal } from '@/components/MobileBlockModal';
import dynamic from 'next/dynamic';

// Lazy load ChatInterface to improve initial page load
const ChatInterface = dynamic(() => import("@/components/chat-interface").then(mod => ({ default: mod.ChatInterface })), {
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-600 text-sm">Loading interface...</p>
      </div>
    </div>
  ),
  ssr: false
});

export default function App() {
  const [currentCode, setCurrentCode] = useState<string>('');
  const [restoredCode, setRestoredCode] = useState<string>('');
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [promptCount, setPromptCount] = useState<number>(0);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showLimitModal, setShowLimitModal] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const { promptsRemaining, canPrompt, loading: limitLoading, incrementPromptCount, dailyLimit } = usePromptLimit();

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get initial prompt from URL parameters
  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt) {
      setInitialPrompt(prompt);
    }
  }, [searchParams]);

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
  };

  const handleRestoreVersion = (code: string) => {
    setRestoredCode(code);
  };

  // Add an effect to handle restored code
  useEffect(() => {
    if (restoredCode) {
      setCurrentCode(restoredCode);
      // Clear the restored code after applying it
      setRestoredCode('');
    }
  }, [restoredCode]);

  // Handle prompt submission
  const handlePromptSubmit = async () => {
    const newCount = promptCount + 1;
    setPromptCount(newCount);
    
    // Show auth modal when attempting second prompt (after first prompt was free)
    if (newCount > 1 && !user) {
      setShowAuthModal(true);
      return;
    }

    // If user is authenticated, check daily limit and increment count
    if (user) {
      if (!canPrompt) {
        setShowLimitModal(true);
        return;
      }
      // Increment the Firestore counter
      await incrementPromptCount();
    }
  };

  // Only show loading for auth, let limit load in background
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Block Modal - Shows on mobile devices */}
      {isMobile && <MobileBlockModal />}

      <div className="min-h-screen bg-gray-50">
        <Header 
          currentCode={currentCode}
          onRestoreVersion={handleRestoreVersion}
        />
        <main className="h-[calc(100vh-56px)]">
          <ChatInterface 
            currentCode={currentCode}
            onCodeChange={handleCodeChange}
            onPromptSubmit={handlePromptSubmit}
            allowPrompt={(user !== null && canPrompt) || promptCount <= 0}
            restoredCode={restoredCode}
            initialPrompt={initialPrompt}
          />
        </main>
      </div>

      {/* Auth Modal - Shows after first prompt if not logged in */}
      {showAuthModal && !user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAuthModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CompactLoginForm />
          </div>
        </div>
      )}

      {/* Daily Limit Reached Modal */}
      {showLimitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLimitModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⏰</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Daily Limit Reached
              </h2>
              <p className="text-gray-600 mb-6">
                You've used all {dailyLimit} prompts for today. Come back tomorrow to continue building amazing apps!
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  💡 <strong>Tip:</strong> Your prompts will reset at midnight. Bookmark your projects to continue where you left off!
                </p>
              </div>
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
