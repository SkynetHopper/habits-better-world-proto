import React, { useState } from 'react';
import { Goal, QuizAnswers, ImplementationOption } from '../types';
import { ChevronLeft, Trophy, Sliders, Gauge, ChevronDown, Zap, ArrowRight, RefreshCw, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HBWLogo from './HBWLogo';

interface GoalRecommendationsProps {
  answers: QuizAnswers;
  topGoal: Goal;
  alternatives: Goal[];
  onCommit: (selectedGoal: Goal) => void;
  onReset: () => void;
  hasAI?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: (theme: 'dark' | 'light') => void;
}

export default function GoalRecommendations({ 
  answers, 
  topGoal, 
  onCommit, 
  onReset, 
  theme = 'light',
  onToggleTheme
}: GoalRecommendationsProps) {
  const activeGoal = topGoal;
  const isDark = theme === 'dark';

  // Selected implementation option within the active goal
  const [selectedOption, setSelectedOption] = useState<ImplementationOption>(
    activeGoal.selectedOption || activeGoal.implementationOptions[0]
  );
  const [isPaceDropdownOpen, setIsPaceDropdownOpen] = useState<boolean>(false);

  const handleFinalCommit = () => {
    const committedGoal: Goal = {
      ...activeGoal,
      action: `${selectedOption.title}: ${selectedOption.description}`,
      selectedOption: selectedOption,
      anchorRoutine: 'Brewing morning coffee'
    };
    onCommit(committedGoal);
  };

  // Derive pace short badge text (e.g. "Weekly Meal Swap") using brand Figtree
  const getPaceShortLabel = (opt: ImplementationOption) => {
    if (activeGoal.category === 'Environment') {
      if (opt.id.includes('full')) return 'Weekly Meal Swap';
      if (opt.id.includes('half')) return 'Bi-Weekly Blend';
      if (opt.id.includes('starter')) return 'Fortnightly Swap';
    }
    const cleanTitle = opt.title.split('(')[0].trim();
    return cleanTitle || 'Standard Pace';
  };

  // Derive metrics matching screenshot for Environment, or proportional domain metrics
  const getDisplayMetrics = (opt: ImplementationOption) => {
    if (activeGoal.category === 'Environment') {
      const multiplier = opt.impactMultiplier || 1.0;
      const km = Math.round(740 * multiplier);
      const savings = Math.round(210 * multiplier);
      return {
        metric1Value: `+${km} km`,
        metric1Label: 'Driving emissions avoided',
        metric2Value: `+$${savings}`,
        metric2Label: 'Grocery budget saved'
      };
    }

    if (activeGoal.category === 'Well-Being') {
      return {
        metric1Value: `+${opt.metrics.primaryValue} ${opt.metrics.primaryUnit}`,
        metric1Label: opt.metrics.primaryLabel,
        metric2Value: `-${opt.metrics.secondaryValue}%`,
        metric2Label: opt.metrics.secondaryLabel
      };
    }

    return {
      metric1Value: `+${opt.metrics.primaryValue} ${opt.metrics.primaryUnit}`,
      metric1Label: opt.metrics.primaryLabel,
      metric2Value: `+${opt.metrics.secondaryValue} ${opt.metrics.secondaryUnit}`,
      metric2Label: opt.metrics.secondaryLabel
    };
  };

  const { metric1Value, metric1Label, metric2Value, metric2Label } = getDisplayMetrics(selectedOption);

  return (
    <div className="w-full max-w-md mx-auto px-4 py-5 flex flex-col gap-5 min-h-[100dvh] no-scrollbar overflow-x-hidden font-sans">
      {/* Top Navigation Header matching HBW guidelines */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onReset}
          className={`p-1.5 -ml-1 rounded-full transition-colors cursor-pointer flex items-center justify-center ${
            isDark ? 'text-[#8E8E93] hover:text-white hover:bg-[#1C1C1E]' : 'text-[#6C6C70] hover:text-[#0A0A0A] hover:bg-[#E5E5EA]'
          }`}
          aria-label="Go back to assessment"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Centered Brand Logo */}
        <div className="flex items-center justify-center">
          <HBWLogo size="md" variant="full" theme={isDark ? 'dark' : 'light'} />
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={() => onToggleTheme?.(isDark ? 'light' : 'dark')}
          className={`p-1.5 -mr-1 rounded-full transition-all cursor-pointer ${
            isDark ? 'text-[#98989D] hover:text-white hover:bg-[#1C1C1E]' : 'text-[#6C6C70] hover:text-[#0A0A0A] hover:bg-[#E5E5EA]'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0385FF]" />}
        </button>
      </div>

      {/* Eyebrow & Title Section with HBW Merriweather & Figtree */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-sans font-bold tracking-wider uppercase ${
          isDark 
            ? 'bg-[#24A1FF]/15 text-[#24A1FF] border border-[#24A1FF]/30' 
            : 'bg-[#0385FF]/10 text-[#0385FF] border border-[#0385FF]/30'
        }`}>
          <Trophy className="w-3.5 h-3.5" />
          <span>RECOMMENDED HABIT PLAN</span>
        </div>

        <div className="space-y-1">
          <h2 className={`text-3xl sm:text-[34px] font-serif font-normal tracking-tight ${
            isDark ? 'text-white' : 'text-[#0A0A0A]'
          }`}>
            Your 3-Month <span className="italic font-serif font-normal">Plan</span>
          </h2>
          <p className={`text-sm font-sans leading-relaxed max-w-xs mx-auto ${
            isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}>
            Your top-impact habit for <strong className={isDark ? 'text-white font-semibold' : 'text-[#0A0A0A] font-semibold'}>{activeGoal.category}</strong>.<br />
            Adjust your schedule below to fit your daily routine.
          </p>
        </div>
      </div>

      {/* Main Focus Card matching image design & HBW Brand Guidelines */}
      <div className={`w-full rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 border-2 transition-all relative overflow-hidden flex flex-col items-center text-center shadow-lg ${
        isDark
          ? 'bg-[#121214] text-white border-[#24A1FF] shadow-black/40'
          : 'bg-white text-[#0A0A0A] border-[#0385FF] shadow-[#0385FF]/5'
      }`}>
        {/* Soft Top Glow Gradient matching design */}
        <div className={`absolute top-0 inset-x-0 h-32 pointer-events-none ${
          isDark
            ? 'bg-gradient-to-b from-[#24A1FF]/15 via-[#24A1FF]/5 to-transparent'
            : 'bg-gradient-to-b from-[#0385FF]/10 via-[#0385FF]/3 to-transparent'
        }`} />

        {/* Removed '#1...' and 'Compassion' / Category divs as requested */}

        {/* Title */}
        <h3 className={`z-10 text-2xl sm:text-[28px] font-serif font-normal leading-tight mt-1 ${
          isDark ? 'text-white' : 'text-[#0A0A0A]'
        }`}>
          {activeGoal.title}
        </h3>

        {/* Action Description */}
        <p className={`z-10 text-sm font-sans leading-relaxed max-w-xs mx-auto mt-2 ${
          isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
        }`}>
          {activeGoal.category === 'Environment' && activeGoal.id === 'env-top'
            ? 'Swap animal protein for beans, lentils, or organic tofu.'
            : activeGoal.action}
        </p>

        {/* Separator / Sub-header: Adapt plan to work for you */}
        <div className="z-10 flex items-center justify-center gap-1.5 pt-4 pb-2 text-xs font-sans text-[#6C727F] dark:text-[#98989D]">
          <Sliders className="w-3.5 h-3.5 text-[#0385FF] dark:text-[#24A1FF]" />
          <span>Adapt plan to work for you</span>
        </div>

        {/* Choose Your Pace Box */}
        <div className={`z-10 w-full rounded-[22px] p-4 text-left border transition-all ${
          isDark
            ? 'bg-[#141416] border-[#26262B]'
            : 'bg-[#F7F4F4] border-[#E0E0E0]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDark ? 'bg-[#24A1FF]/15 text-[#24A1FF]' : 'bg-[#0385FF]/10 text-[#0385FF]'
            }`}>
              <Gauge className="w-5 h-5 stroke-[2]" />
            </div>
            <h4 className={`text-base font-sans font-bold ${isDark ? 'text-white' : 'text-[#0A0A0A]'}`}>
              Choose Your Pace
            </h4>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-sans font-semibold ${
              isDark ? 'bg-[#24A1FF]/15 text-[#24A1FF]' : 'bg-[#0385FF]/10 text-[#0385FF]'
            }`}>
              {getPaceShortLabel(selectedOption)}
            </span>
            <button
              type="button"
              id="change-pace-btn"
              onClick={() => setIsPaceDropdownOpen(!isPaceDropdownOpen)}
              className={`text-xs sm:text-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer ${
                isDark ? 'text-[#24A1FF]' : 'text-[#0385FF]'
              }`}
            >
              <span>Change</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPaceDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <p className="text-xs text-[#6C727F] dark:text-[#98989D] mt-1.5">
            Currently: {selectedOption.scheduleText} · Tap to change
          </p>

          {/* Interactive Dropdown for Pace Options */}
          <AnimatePresence>
            {isPaceDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`pt-3 mt-3 border-t space-y-1.5 overflow-hidden ${
                  isDark ? 'border-[#26262B]' : 'border-[#E0E0E0]'
                }`}
              >
                {activeGoal.implementationOptions.map((opt) => {
                  const isSelected = selectedOption.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setSelectedOption(opt);
                        setIsPaceDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left text-xs font-sans transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'bg-[#24A1FF]/15 border border-[#24A1FF] font-semibold text-[#24A1FF]'
                            : 'bg-[#0385FF]/15 border border-[#0385FF] font-semibold text-[#0385FF]'
                          : isDark
                          ? 'hover:bg-[#222228] text-[#E5E5EA] border border-transparent'
                          : 'hover:bg-[#EAEAEA] text-[#0A0A0A] border border-transparent'
                      }`}
                    >
                      <span>{opt.title}</span>
                      <span className="text-[10px] opacity-75">{opt.scheduleText}</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3-Month Impact Section */}
        <div className="z-10 w-full pt-4 space-y-2.5">
          <div className={`flex items-center gap-1.5 text-xs font-sans font-bold tracking-wider uppercase ${
            isDark ? 'text-[#24A1FF]' : 'text-[#0385FF]'
          }`}>
            <Zap className={`w-3.5 h-3.5 fill-current ${
              isDark ? 'text-[#24A1FF]' : 'text-[#0385FF]'
            }`} />
            <span>3-MONTH IMPACT</span>
            <span className="text-[#8E8E93] font-normal">• Pace: {Math.round((selectedOption.impactMultiplier || 1) * 100)}%</span>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            {/* Metric 1 Card - styled strictly to HBW Brand Guidelines */}
            <div className={`p-4 rounded-[20px] text-center border flex flex-col items-center justify-center ${
              isDark ? 'bg-[#141416] border-[#26262B]' : 'bg-[#F7F4F4] border-[#E0E0E0]'
            }`}>
              <span className={`text-2xl sm:text-3xl font-sans font-bold tracking-tight ${
                isDark ? 'text-[#24A1FF]' : 'text-[#0385FF]'
              }`}>
                {metric1Value}
              </span>
              <span className={`text-xs font-sans mt-1 leading-snug ${
                isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                {metric1Label}
              </span>
            </div>

            {/* Metric 2 Card - styled strictly to HBW Brand Guidelines */}
            <div className={`p-4 rounded-[20px] text-center border flex flex-col items-center justify-center ${
              isDark ? 'bg-[#141416] border-[#26262B]' : 'bg-[#F7F4F4] border-[#E0E0E0]'
            }`}>
              <span className={`text-2xl sm:text-3xl font-sans font-bold tracking-tight ${
                isDark ? 'text-[#24A1FF]' : 'text-[#0385FF]'
              }`}>
                {metric2Value}
              </span>
              <span className={`text-xs font-sans mt-1 leading-snug ${
                isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                {metric2Label}
              </span>
            </div>
          </div>
        </div>

        {/* Primary CTA Button matching Brand Guidelines (p. 45 & 46) */}
        <button
          type="button"
          id="start-habit-btn"
          onClick={handleFinalCommit}
          className={`z-10 w-full h-[52px] px-4 font-sans font-bold text-base rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-5 active:scale-[0.99] ${
            isDark
              ? 'bg-[#24A1FF] hover:bg-[#0385FF] text-[#0A0A0A]'
              : 'bg-[#0075E3] hover:bg-[#0066CC] text-white'
          }`}
        >
          <span className="truncate">
            Start Habit: {selectedOption.scheduleText}
          </span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>

      {/* Secondary Bottom Button: Change Profile or Plan */}
      <div className="flex justify-center pt-1 pb-4 shrink-0">
        <button
          type="button"
          id="change-profile-or-plan-btn"
          onClick={onReset}
          className={`h-[44px] px-5 flex items-center gap-2 font-sans font-medium text-xs sm:text-sm rounded-full border transition-all cursor-pointer ${
            isDark
              ? 'text-[#98989D] hover:text-white bg-[#141416] hover:bg-[#202026] border-[#26262B]'
              : 'text-[#6C6C70] hover:text-[#0A0A0A] bg-[#F7F4F4] hover:bg-[#EAEAEA] border-[#E0E0E0] shadow-2xs'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Change Profile or Plan</span>
        </button>
      </div>
    </div>
  );
}
