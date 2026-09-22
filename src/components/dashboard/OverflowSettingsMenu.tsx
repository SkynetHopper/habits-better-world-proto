/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers,
  Bell, 
  Watch, 
  Sun, 
  Moon, 
  Download, 
  RotateCcw, 
  User, 
  LogOut, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { QuizAnswers } from '../../types';

export interface OverflowSettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme?: (theme: 'dark' | 'light') => void;
  user?: any;
  answers?: QuizAnswers;
  onUpdateAnswers?: (newAnswers: QuizAnswers) => void;
  onNavigateToTab?: (tab: 'home' | 'progress' | 'community' | 'profile') => void;
  onOpenWardrobe?: () => void;
  onOpenAlerts?: () => void;
  onOpenWatch?: () => void;
  onResetQuiz?: () => void;
  onSignOut?: () => void;
  onOpenAuth?: () => void;
  onDownloadPDF?: () => void;
  onReplaySplash?: () => void;
}

/**
 * Authentic iOS Navigation Bar Pull-Down Menu (UIMenu)
 * Clean, action-oriented, translucent frosted glass popover anchored to the header ellipsis.
 */
export default function OverflowSettingsMenu({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  user,
  answers,
  onNavigateToTab,
  onOpenWardrobe,
  onOpenAlerts,
  onOpenWatch,
  onResetQuiz,
  onSignOut,
  onOpenAuth,
  onDownloadPDF,
  onReplaySplash,
}: OverflowSettingsMenuProps) {
  if (!isOpen) return null;

  const handleAction = (callback?: () => void) => {
    if (callback) {
      callback();
    }
    onClose();
  };

  const displayName = user?.displayName || answers?.name || 'Alex';
  const isGuest = !user;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dismissible Translucent Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px] transition-opacity"
            onClick={onClose}
            aria-label="Dismiss menu"
          />
          
          {/* iOS Pull-Down Menu Container (UIMenu) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            className={`absolute top-[50px] right-2.5 w-[255px] sm:w-[265px] rounded-[14px] shadow-2xl backdrop-blur-2xl border font-sans select-none overflow-hidden origin-top-right z-50 transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-[#1E1E22]/92 border-white/12 text-white shadow-black/80'
                : 'bg-[#F9F9FB]/92 border-black/10 text-[#1C1C1E] shadow-xl'
            }`}
          >
            {/* Header: User Session Identity */}
            <div className={`px-3 py-2.5 border-b flex items-center justify-between ${
              theme === 'dark' ? 'border-white/[0.08] bg-white/[0.02]' : 'border-black/[0.06] bg-black/[0.02]'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#0080FF]/15 border border-[#0080FF]/30 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-[#0080FF]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-tight truncate">
                    {displayName}
                  </p>
                  <p className={`text-[9px] font-mono leading-tight truncate ${
                    isGuest ? 'text-[#FF9500]' : 'text-[#34C759]'
                  }`}>
                    {isGuest ? 'Guest Sandbox' : 'Verified Account'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#0080FF]/10 text-[#0080FF] shrink-0">
                HBW
              </span>
            </div>

            {/* SECTION 1: Companion & Auxiliary Tools */}
            <div className="py-1">
              {/* Habit Hub */}
              <button
                type="button"
                onClick={() => handleAction(onOpenWardrobe || (() => onNavigateToTab?.('profile')))}
                className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-white/10 active:bg-white/15' : 'hover:bg-black/5 active:bg-black/10'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium leading-tight">Habit Hub</p>
                  <p className={`text-[10px] leading-tight truncate ${
                    theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                  }`}>
                    Browse 12+ science habits
                  </p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#0080FF]/10 flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5 text-[#0080FF]" />
                </div>
              </button>

              {/* Smart Alerts & Cues */}
              <button
                type="button"
                onClick={() => handleAction(onOpenAlerts || (() => onNavigateToTab?.('profile')))}
                className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-white/10 active:bg-white/15' : 'hover:bg-black/5 active:bg-black/10'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium leading-tight">Smart Alerts & Cues</p>
                  <p className={`text-[10px] leading-tight truncate ${
                    theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                  }`}>
                    Anchor triggers & reminders
                  </p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#FF9500]/10 flex items-center justify-center shrink-0">
                  <Bell className="w-3.5 h-3.5 text-[#FF9500]" />
                </div>
              </button>

              {/* Apple Watch Companion */}
              <button
                type="button"
                onClick={() => handleAction(onOpenWatch)}
                className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-white/10 active:bg-white/15' : 'hover:bg-black/5 active:bg-black/10'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium leading-tight">Apple Watch Sync</p>
                  <p className={`text-[10px] leading-tight truncate ${
                    theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                  }`}>
                    Glanceable wrist tracking
                  </p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#34C759]/10 flex items-center justify-center shrink-0">
                  <Watch className="w-3.5 h-3.5 text-[#34C759]" />
                </div>
              </button>
            </div>

            {/* Hairline Divider */}
            <div className={`h-[1px] w-full ${theme === 'dark' ? 'bg-white/[0.08]' : 'bg-black/[0.06]'}`} />

            {/* SECTION 2: Display & Document Actions */}
            <div className="py-1">
              {/* Appearance (Theme Toggle) */}
              <button
                type="button"
                onClick={() => onToggleTheme?.(theme === 'dark' ? 'light' : 'dark')}
                className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-white/10 active:bg-white/15' : 'hover:bg-black/5 active:bg-black/10'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium leading-tight">Appearance</p>
                  <p className={`text-[10px] leading-tight ${
                    theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                  }`}>
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full border flex items-center gap-1.5 text-[10px] font-semibold shrink-0 ${
                  theme === 'dark' ? 'bg-[#121214] border-white/10 text-white' : 'bg-white border-black/10 text-[#1C1C1E]'
                }`}>
                  {theme === 'dark' ? (
                    <>
                      <Moon className="w-3 h-3 text-[#0080FF]" />
                      <span>Dark</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3 h-3 text-amber-500" />
                      <span>Light</span>
                    </>
                  )}
                </div>
              </button>

              {/* Export 90-Day Plan PDF */}
              <button
                type="button"
                onClick={() => handleAction(onDownloadPDF)}
                className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-white/10 active:bg-white/15' : 'hover:bg-black/5 active:bg-black/10'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium leading-tight">Export 90-Day Plan</p>
                  <p className={`text-[10px] leading-tight truncate ${
                    theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                  }`}>
                    Vector printable PDF action plan
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#34C759]/15 text-[#34C759]">
                    PDF
                  </span>
                  <Download className="w-3.5 h-3.5 text-[#34C759]" />
                </div>
              </button>

              {/* Retake Habit Quiz */}
              <button
                type="button"
                onClick={() => handleAction(onResetQuiz)}
                className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-white/10 active:bg-white/15' : 'hover:bg-black/5 active:bg-black/10'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium leading-tight">Retake Habit Quiz</p>
                  <p className={`text-[10px] leading-tight truncate ${
                    theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                  }`}>
                    Recalibrate science habits
                  </p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                  <RotateCcw className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`} />
                </div>
              </button>

              {/* Replay Welcome Splash */}
              {onReplaySplash && (
                <button
                  type="button"
                  onClick={() => handleAction(onReplaySplash)}
                  className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                    theme === 'dark' ? 'hover:bg-white/10 active:bg-white/15' : 'hover:bg-black/5 active:bg-black/10'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-medium leading-tight">Welcome Splash</p>
                    <p className={`text-[10px] leading-tight truncate ${
                      theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                    }`}>
                      Replay brand intro animation
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-[#0080FF]/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-[#0080FF]" />
                  </div>
                </button>
              )}
            </div>

            {/* Hairline Divider */}
            <div className={`h-[1px] w-full ${theme === 'dark' ? 'bg-white/[0.08]' : 'bg-black/[0.06]'}`} />

            {/* SECTION 3: Session & Account Actions */}
            <div className="py-1">
              {/* Account / Profile Settings */}
              <button
                type="button"
                onClick={() => handleAction(() => onNavigateToTab?.('profile'))}
                className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-white/10 active:bg-white/15' : 'hover:bg-black/5 active:bg-black/10'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium leading-tight">Profile & Preferences</p>
                  <p className={`text-[10px] leading-tight truncate ${
                    theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
                  }`}>
                    Demographics & goal settings
                  </p>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`} />
              </button>

              {/* Log Out / Exit Session (Destructive in iOS Red) */}
              <button
                type="button"
                onClick={() => handleAction(onSignOut || onOpenAuth)}
                className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-[#FF3B30]/10 active:bg-[#FF3B30]/20' : 'hover:bg-[#FF3B30]/10 active:bg-[#FF3B30]/15'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium leading-tight text-[#FF3B30]">
                    {isGuest ? 'Exit Guest Session' : 'Log Out of Account'}
                  </p>
                  <p className="text-[10px] leading-tight text-[#FF3B30]/70 truncate">
                    {isGuest ? 'Reset temporary local state' : 'Safely disconnect session'}
                  </p>
                </div>
                <LogOut className="w-3.5 h-3.5 text-[#FF3B30] shrink-0" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
