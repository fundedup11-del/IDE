"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Menu, User, LogOut, Plus, Eye, History, Share2, Settings } from "lucide-react";
import { HistoryPanel } from "@/components/HistoryPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { PublishModal } from "@/components/PublishModal";
import { SupabaseSettingsModal } from "@/components/SupabaseSettingsModal";

interface HeaderProps {
  currentCode?: string;
  onRestoreVersion?: (code: string) => void;
}

export function Header({ currentCode = "", onRestoreVersion = () => { } }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSupabaseSettings, setShowSupabaseSettings] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between h-14 px-2 md:px-4">
        {/* Left side - Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 font-semibold text-base md:text-lg">ExternAI</span>
              <span className="text-gray-500 text-[10px] md:text-xs italic hidden sm:block">"Even a merely prompt can bring your vision to life"</span>
            </div>
          </div>
        </div>

        {/* Center - Preview Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="bg-blue-500 text-white hover:bg-blue-600 text-sm border-2 border-blue-300 hover:border-blue-400 rounded-full hover:shadow-[0_0_15px_rgba(59,130,246,0.7)] transition-all duration-300"
            onClick={() => {
              const previewFrame = document.querySelector('iframe[title="Live Preview"]') as HTMLIFrameElement;
              if (previewFrame && previewFrame.src) {
                window.open(previewFrame.src, '_blank', 'fullscreen=yes,scrollbars=yes,resizable=yes');
              } else {
                alert('No preview available. Please generate some code first.');
              }
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Full Screen Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-sm rounded-full shadow-sm"
            onClick={() => {
              if (!currentCode) {
                alert('No code to publish. Please generate something first.');
                return;
              }
              setShowPublishModal(true);
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Publish
          </Button>
          <HistoryPanel
            currentCode={currentCode}
            onRestoreVersion={onRestoreVersion}
          />
        </div>

        {/* Right side - User Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:bg-gray-100"
            onClick={() => setShowSupabaseSettings(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>

          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Right side - Compact controls */}
        <div className="flex md:hidden items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:bg-gray-100 h-8 w-8"
            onClick={() => setShowSupabaseSettings(true)}
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white h-8 w-8"
            onClick={() => {
              if (!currentCode) {
                alert('No code to publish. Please generate something first.');
                return;
              }
              setShowPublishModal(true);
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <HistoryPanel
            currentCode={currentCode}
            onRestoreVersion={onRestoreVersion}
          />
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:bg-gray-100 h-8 w-8"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <PublishModal
          code={currentCode}
          onClose={() => setShowPublishModal(false)}
        />
      )}

      {/* Supabase Settings Modal */}
      {showSupabaseSettings && (
        <SupabaseSettingsModal
          onClose={() => setShowSupabaseSettings(false)}
        />
      )}
    </header>
  );
}
