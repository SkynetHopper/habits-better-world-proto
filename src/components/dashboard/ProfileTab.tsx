/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Download 
} from 'lucide-react';
import { Goal, QuizAnswers } from '../../types';
import SmartAlerts from '../SmartAlerts';
import HabitsManager from '../HabitsManager';

interface ProfileTabProps {
  user: any;
  answers: QuizAnswers;
  onUpdateAnswers?: (newAnswers: QuizAnswers) => void;
  onSignOut?: () => void;
  onOpenAuth?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme?: (theme: 'dark' | 'light') => void;
  activeGoal: Goal;
  setActiveGoal: (goal: Goal) => void;
  onReset: () => void;
  anchorHabit: string;
  setAnchorHabit: (anchor: string) => void;
  setHasConfiguredNotifications: (configured: boolean) => void;
  onDownloadPDF: () => void;
}

export default function ProfileTab({
  user,
  answers,
  onUpdateAnswers,
  onSignOut,
  onOpenAuth,
  theme,
  onToggleTheme,
  activeGoal,
  setActiveGoal,
  onReset,
  anchorHabit,
  setAnchorHabit,
  setHasConfiguredNotifications,
  onDownloadPDF
}: ProfileTabProps) {
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editAge, setEditAge] = useState<string>(answers.age);
  const [editGender, setEditGender] = useState<string>(answers.gender);

  const handleStartEdit = () => {
    setEditAge(answers.age);
    setEditGender(answers.gender);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    if (onUpdateAnswers) {
      onUpdateAnswers({
        ...answers,
        age: editAge || answers.age,
        gender: editGender || answers.gender,
      });
    }
    setIsEditingProfile(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* User Profile Card */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        <div className={`flex items-center justify-between border-b pb-2.5 ${
          theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0080FF]/15 border border-[#0080FF]/30 flex items-center justify-center">
              <User className="w-5 h-5 text-[#0080FF]" />
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight">
                {user?.displayName || 'My Challenger Profile'}
              </h4>
              <p className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                user ? 'text-[#34C759]' : 'text-[#FF9500]'
              }`}>
                {user ? 'Verified Challenger' : 'Guest Sandbox Mode'}
              </p>
            </div>
          </div>
          {!isEditingProfile && (
            <button
              onClick={handleStartEdit}
              className="text-xs font-semibold text-[#0080FF] hover:text-[#0066CC] transition-colors px-2.5 py-1 rounded-full border border-[#0080FF]/30 hover:bg-[#0080FF]/10 cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs leading-tight pt-1">
            <div className="flex flex-col gap-1">
              <label className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Age</label>
              <input
                type="text"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0080FF] ${
                  theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
                }`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Gender</label>
              <select
                value={editGender}
                onChange={(e) => setEditGender(e.target.value)}
                className={`w-full px-2 py-1.5 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0080FF] ${
                  theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
                }`}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary / Other">Non-binary</option>
                <option value="Prefer not to say">Secret</option>
              </select>
            </div>
            <div className={`flex gap-2 justify-end col-span-2 mt-2 pt-2 border-t ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
              <button
                onClick={() => setIsEditingProfile(false)}
                className={`text-xs font-medium transition-colors px-3 py-1 cursor-pointer ${
                  theme === 'dark' ? 'text-[#98989D] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="text-xs font-semibold bg-[#0080FF] text-white rounded-full px-4 py-1 hover:bg-[#0066CC] transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs leading-tight">
              <div className="flex flex-col">
                <span className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Age</span>
                <span className="font-semibold text-sm">{answers.age || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Gender</span>
                <span className="font-semibold text-sm">{answers.gender || 'N/A'}</span>
              </div>
              {user && (
                <div className={`flex flex-col col-span-2 border-t pt-1.5 ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
                  <span className={`font-mono text-[9px] uppercase ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Account Email</span>
                  <span className="font-semibold truncate text-xs font-mono">{user.email}</span>
                </div>
              )}
            </div>

            {/* Account CTA Button */}
            <div className={`pt-2 border-t ${theme === 'dark' ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'}`}>
              {user ? (
                <button
                  onClick={onSignOut}
                  className="w-full py-2 bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] text-xs font-bold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Account</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={onOpenAuth}
                    className="w-full py-2.5 bg-[#0080FF] hover:bg-[#0066CC] text-white text-xs font-semibold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Sign Up / Sync with Cloud</span>
                  </button>
                  <button
                    onClick={onSignOut}
                    className="w-full py-2 bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20 text-[#FF3B30] text-xs font-bold rounded-full transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out / Exit Guest Session</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Appearance Theme Selector */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-[#0080FF]" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider">Appearance Theme</h4>
          </div>
          <span className="text-[10px] font-mono font-semibold text-[#0080FF] bg-[#0080FF]/15 px-2.5 py-0.5 rounded-full">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </div>

        <p className={`text-xs leading-relaxed font-sans ${
          theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
        }`}>
          Dark mode reduces display energy consumption on OLED screens to lower your digital carbon footprint—and saves eye strain too!
        </p>

        <div className={`p-1 rounded-full border grid grid-cols-2 gap-1 ${
          theme === 'dark' ? 'bg-[#0A0A0C] border-[#1F1F24]' : 'bg-[#F5F5F7] border-[#E5E5EA]'
        }`}>
          <button
            type="button"
            onClick={() => onToggleTheme && onToggleTheme('light')}
            className={`py-2 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-[#0080FF] text-white shadow-xs'
                : theme === 'dark'
                  ? 'text-[#98989D] hover:text-white'
                  : 'text-[#6C6C70] hover:text-[#1C1C1E]'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleTheme && onToggleTheme('dark')}
            className={`py-2 px-3 rounded-full text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#0080FF] text-white shadow-xs'
                : 'text-[#6C6C70] hover:text-[#1C1C1E]'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Permanent Smart Reminders & Notification Settings */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0080FF] px-1">
          Reminders & Notification Controls
        </h3>
        <SmartAlerts
          goalTitle={activeGoal.title}
          defaultAnchor={anchorHabit}
          theme={theme}
          onSaveConfigured={(newAnchor) => {
            setAnchorHabit(newAnchor);
            setHasConfiguredNotifications(true);
          }}
        />
      </div>

      {/* Habits Wardrobe & Catalog */}
      <HabitsManager
        activeGoal={activeGoal}
        setActiveGoal={setActiveGoal}
        onResetQuiz={onReset}
        theme={theme}
      />

      {/* PDF Habit Plan Download */}
      <div className={`p-4 border rounded-[16px] shadow-xs flex items-center justify-between transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
      }`}>
        <div className="flex items-center gap-2.5">
          <Download className="w-5 h-5 text-[#34C759]" />
          <div>
            <h4 className="text-xs font-bold leading-tight">Habit Challenge PDF</h4>
            <p className={`text-[11px] ${theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>Export printable action plan</p>
          </div>
        </div>
        <button
          onClick={onDownloadPDF}
          className="px-3.5 py-1.5 bg-[#34C759] hover:bg-[#28A745] text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-xs"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
