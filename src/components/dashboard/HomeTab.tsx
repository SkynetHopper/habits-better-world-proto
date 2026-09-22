/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Check, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Bell, 
  ChevronRight, 
  MessageSquare, 
  ExternalLink,
  Users,
  Share2,
  Clock,
  MapPin,
  X,
  Zap,
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Goal } from '../../types';
import EcosystemVisualization from '../EcosystemVisualization';
import LiteConfetti from '../LiteConfetti';

export type DashboardPhase = 'phase2' | 'phase3' | 'phase4';

interface HomeTabProps {
  activeGoal: Goal;
  checklist: {
    habitDone: boolean;
    anchorDone: boolean;
    reflectDone: boolean;
  };
  onCheckItem: (item: 'habitDone' | 'anchorDone' | 'reflectDone') => void;
  hasLoggedToday: boolean;
  onLogSuccess: () => void;
  bubbles: Array<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean }>;
  setBubbles?: React.Dispatch<React.SetStateAction<Array<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean }>>>;
  individualEnergy?: number;
  setIndividualEnergy?: React.Dispatch<React.SetStateAction<number>>;
  streak?: number;
  dismissedBubbleAlert: boolean;
  setDismissedBubbleAlert: (dismissed: boolean) => void;
  motivationalQuote: string;
  hasConfiguredNotifications: boolean;
  anchorHabit: string;
  setAnchorHabit: (anchor: string) => void;
  onQuickEnableReminders: () => void;
  onNavigateToTab: (tab: 'home' | 'community' | 'progress' | 'profile') => void;
  theme: 'dark' | 'light';
  userName?: string;
  initialPhase?: DashboardPhase;
}

interface MicroHabitItem {
  id: string;
  title: string;
  category: 'Well-being' | 'Environment' | 'Compassion' | 'Responsible AI';
  completed: boolean;
}

const DEFAULT_DAYS = [
  { day: 'Mon', dateNum: 23 },
  { day: 'Tue', dateNum: 24 },
  { day: 'Wed', dateNum: 25, isToday: true },
  { day: 'Thu', dateNum: 26 },
  { day: 'Fri', dateNum: 27 },
];

export default function HomeTab({
  activeGoal,
  checklist,
  onCheckItem,
  hasLoggedToday,
  onLogSuccess,
  bubbles,
  setBubbles,
  individualEnergy,
  setIndividualEnergy,
  streak,
  dismissedBubbleAlert,
  setDismissedBubbleAlert,
  motivationalQuote,
  hasConfiguredNotifications,
  anchorHabit,
  setAnchorHabit,
  onQuickEnableReminders,
  onNavigateToTab,
  theme,
  userName = 'Alex',
  initialPhase = 'phase2'
}: HomeTabProps) {
  const isDark = theme === 'dark';

  // Ecosystem & Cloud Reaction States (with robust fallbacks)
  const [localBubbles, setLocalBubbles] = useState(bubbles);
  const effectiveBubbles = bubbles ?? localBubbles;
  const effectiveSetBubbles = setBubbles ?? setLocalBubbles;

  const [localEnergy, setLocalEnergy] = useState<number>(individualEnergy ?? 45);
  const effectiveEnergy = individualEnergy ?? localEnergy;
  const effectiveSetEnergy = setIndividualEnergy ?? setLocalEnergy;

  const effectiveStreak = streak ?? 3;

  // Lite Confetti & Hydration Overlay Modal State
  const [showLiteConfetti, setShowLiteConfetti] = useState<boolean>(false);
  const [confettiMessage, setConfettiMessage] = useState<string>('Micro-habit completed! +15g Rain Cloud ready');
  const [showHydrationModal, setShowHydrationModal] = useState<boolean>(false);
  const [completedHabitTitle, setCompletedHabitTitle] = useState<string>('');

  // Active dashboard view version/phase (Screen 11, 12, 15 from Figma mockups)
  const [phase, setPhase] = useState<DashboardPhase>(initialPhase);
  const [selectedDate, setSelectedDate] = useState<number>(25);

  // Phase 2: Today's Micro Habits state
  const [microHabits, setMicroHabits] = useState<MicroHabitItem[]>([
    {
      id: 'h1',
      title: '2-minute mindful breathing',
      category: 'Well-being',
      completed: true
    },
    {
      id: 'h2',
      title: 'Avoid single-use plastics',
      category: 'Environment',
      completed: true
    },
    {
      id: 'h3',
      title: 'Water community herbs',
      category: 'Environment',
      completed: false
    },
    {
      id: 'h4',
      title: 'Take a 5-minute walk outside',
      category: 'Well-being',
      completed: false
    },
    {
      id: 'h5',
      title: activeGoal.title,
      category: (activeGoal.category as any) || 'Well-being',
      completed: hasLoggedToday
    }
  ]);

  // Phase 3: Challenge state
  const [challengeProgress, setChallengeProgress] = useState<number>(5); // 5 of 7
  const [showInviteToast, setShowInviteToast] = useState<boolean>(false);

  // Phase 4: RSVPs state
  const [rsvps, setRsvps] = useState<Record<string, boolean>>({
    'evt-1': false,
    'evt-2': false,
    'evt-3': false
  });
  const [activeEventDetail, setActiveEventDetail] = useState<string | null>(null);

  const toggleHabit = (id: string) => {
    const target = microHabits.find(h => h.id === id);
    if (!target) return;

    const isCompleting = !target.completed;
    setMicroHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));

    if (isCompleting) {
      // 1. Trigger lite confetti celebration
      setConfettiMessage(`Completed "${target.title}"!`);
      setShowLiteConfetti(true);

      // 2. Ensure a floating rain cloud is available for the user to pop
      const newCloud = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        cx: 35 + Math.floor(Math.random() * 32), // 35% - 67%
        cy: 22 + Math.floor(Math.random() * 18), // 22% - 40%
        value: 15,
        type: 'Habit Energy',
        label: '+15g Hydration',
        isNew: true
      };

      effectiveSetBubbles(current => [...current, newCloud]);

      // 3. Give user a moment to feel joy and celebrate their achievement, then show the hydration ecosystem modal
      setCompletedHabitTitle(target.title);
      setTimeout(() => {
        setShowHydrationModal(true);
      }, 2000);

      // If toggled the active goal habit, sync with onLogSuccess
      if (id === 'h5' && !hasLoggedToday) {
        onLogSuccess();
      }
    }
  };

  const remainingCount = microHabits.filter(h => !h.completed).length;
  const completedCount = microHabits.filter(h => h.completed).length;

  const toggleRSVP = (evtId: string) => {
    setRsvps(prev => ({
      ...prev,
      [evtId]: !prev[evtId]
    }));
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Well-being':
      case 'Well-Being':
        return isDark
          ? 'bg-[#AF52DE]/15 text-[#D896FF] border border-[#AF52DE]/30'
          : 'bg-[#F5EEFB] text-[#7A2E99] border border-[#AF52DE]/25';
      case 'Environment':
        return isDark
          ? 'bg-[#34C759]/15 text-[#34C759] border border-[#34C759]/30'
          : 'bg-[#EBF9F0] text-[#1E7E34] border border-[#34C759]/25';
      case 'Compassion':
        return isDark
          ? 'bg-[#FF9500]/15 text-[#FF9500] border border-[#FF9500]/30'
          : 'bg-[#FFF5E5] text-[#C06000] border border-[#FF9500]/25';
      case 'Responsible AI':
      default:
        return isDark
          ? 'bg-[#24A1FF]/15 text-[#24A1FF] border border-[#24A1FF]/30'
          : 'bg-[#EAF5FF] text-[#0066CC] border border-[#24A1FF]/25';
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* =========================================================================
          VERSION 1: SCREEN 11 (11-home-dashboard-phase-two: Daily Habits)
          ========================================================================= */}
      {phase === 'phase2' && (
        <motion.div
          key="phase-2"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="flex flex-col gap-4 w-full"
        >
          {/* Greeting Header */}
          <div className="space-y-1 text-left">
            <h2 className={`text-2xl font-serif font-normal tracking-tight ${
              isDark ? 'text-white' : 'text-[#0A0A0A]'
            }`}>
              Good to see you, <strong className="font-serif font-bold">{userName}.</strong>
            </h2>
            <p className={`text-xs font-sans leading-relaxed ${
              isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
            }`}>
              {remainingCount > 0 
                ? `You have ${remainingCount} habit${remainingCount === 1 ? '' : 's'} remaining for today.`
                : 'All habits locked in for today! Fantastic consistency.'}
            </p>
          </div>

          {/* Week Calendar Strip */}
          <div className={`p-4 rounded-[20px] border transition-colors ${
            isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA] shadow-2xs'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-black/5 dark:border-white/5">
              <span className={`text-xs font-sans font-bold ${isDark ? 'text-white' : 'text-[#0A0A0A]'}`}>
                January 2026
              </span>
              <span className={`text-[10px] font-mono uppercase tracking-wider ${
                isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
              }`}>
                Week 4
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {DEFAULT_DAYS.map((d) => {
                const isActive = selectedDate === d.dateNum;
                return (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => setSelectedDate(d.dateNum)}
                    className={`py-2 px-1 rounded-[14px] flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#24A1FF] text-white font-bold shadow-xs'
                        : isDark
                        ? 'text-[#98989D] hover:bg-white/5'
                        : 'text-[#6C6C70] hover:bg-black/5'
                    }`}
                  >
                    <span className="text-[10px] font-sans font-medium">{d.day}</span>
                    <span className="text-sm font-sans font-bold leading-tight">{d.dateNum}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Today's Micro Habits Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pt-0.5">
              <h3 className={`text-sm font-sans font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-[#0A0A0A]'
              }`}>
                Today's Micro Habits
              </h3>
              <span className={`text-[10px] font-mono uppercase tracking-wider ${
                isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'
              }`}>
                {completedCount} of {microHabits.length} Done
              </span>
            </div>

            <div className="space-y-2">
              {microHabits.map((habit) => (
                <button
                  key={habit.id}
                  type="button"
                  id={`habit-row-${habit.id}`}
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-full p-3.5 rounded-[18px] border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    isDark
                      ? 'bg-[#121214] border-[#1F1F24] hover:border-[#24A1FF]/40'
                      : 'bg-white border-[#E5E5EA] hover:border-[#24A1FF]/40 shadow-2xs'
                  }`}
                >
                  {/* Round Checkbox */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    habit.completed
                      ? 'bg-[#24A1FF] border-[#24A1FF] text-white'
                      : isDark ? 'border-[#3A3A3C]' : 'border-[#C7C7CC]'
                  }`}>
                    {habit.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  {/* Habit Details & Pillar Tag */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className={`text-xs font-sans font-semibold block leading-tight truncate ${
                      habit.completed
                        ? 'line-through text-[#8E8E93] dark:text-[#636366]'
                        : isDark ? 'text-white' : 'text-[#0A0A0A]'
                    }`}>
                      {habit.title}
                    </span>

                    <div>
                      <span className={`inline-block text-[10px] font-sans font-medium px-2 py-0.5 rounded-full ${
                        getCategoryBadgeStyle(habit.category)
                      }`}>
                        {habit.category}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts to Progress & Challenges */}
          <div className="pt-1 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onNavigateToTab('progress')}
              className={`w-full p-3 rounded-[16px] border flex items-center justify-between transition-colors cursor-pointer ${
                isDark
                  ? 'bg-[#24A1FF]/10 border-[#24A1FF]/30 hover:bg-[#24A1FF]/15 text-[#24A1FF]'
                  : 'bg-[#24A1FF]/5 border-[#24A1FF]/20 hover:bg-[#24A1FF]/10 text-[#0066CC]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-[#24A1FF]/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-[#24A1FF]" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-sans font-bold leading-tight truncate">
                    Ant Forest Ecosystem Tree
                  </p>
                  <p className={`text-[10px] font-sans ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                    {bubbles.length} energy bubble{bubbles.length === 1 ? '' : 's'} ready to harvest
                  </p>
                </div>
              </div>
              <span className="text-xs font-sans font-bold">&rarr;</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* =========================================================================
          VERSION 2: SCREEN 12 (12-challenges-phase-three: Challenges & Momentum)
          ========================================================================= */}
      {phase === 'phase3' && (
        <motion.div
          key="phase-3"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="flex flex-col gap-4 w-full"
        >
          {/* Title */}
          <div className="space-y-1 text-left">
            <h2 className={`text-2xl font-serif font-normal tracking-tight ${
              isDark ? 'text-white' : 'text-[#0A0A0A]'
            }`}>
              Small wins, <strong className="font-serif font-bold">adding up.</strong>
            </h2>
            <p className={`text-xs font-sans leading-relaxed ${
              isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
            }`}>
              Consistency breeds momentum. Celebrate every action.
            </p>
          </div>

          {/* Card 1: Active Challenge */}
          <div className={`p-4 rounded-[20px] border space-y-3 transition-colors ${
            isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA] shadow-2xs'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#24A1FF]/15 text-[#0066CC] dark:text-[#24A1FF] border border-[#24A1FF]/30">
                ACTIVE CHALLENGE
              </span>
            </div>

            <div className="space-y-0.5">
              <h3 className={`text-base font-sans font-bold leading-snug ${
                isDark ? 'text-white' : 'text-[#0A0A0A]'
              }`}>
                7-Day Climate Action Kickstart
              </h3>
              <p className={`text-xs font-sans ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                {challengeProgress} of 7 habits locked in this week.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="w-full h-2 rounded-full bg-[#E5E5EA] dark:bg-[#1F1F24] overflow-hidden">
                <div 
                  className="h-full bg-[#24A1FF] rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((challengeProgress / 7) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans font-medium text-[#6C6C70] dark:text-[#98989D]">
                <span>{Math.round((challengeProgress / 7) * 100)}% Complete</span>
                <span>2 days remaining</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setChallengeProgress(prev => Math.min(prev + 1, 7))}
              className="w-full py-2 bg-[#24A1FF]/10 hover:bg-[#24A1FF]/20 text-[#0066CC] dark:text-[#24A1FF] font-sans font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
            >
              + Log Today's Challenge Action
            </button>
          </div>

          {/* Card 2: Next Achievement */}
          <div className={`p-4 rounded-[20px] border space-y-3 transition-colors ${
            isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA] shadow-2xs'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8E93]">
                NEXT ACHIEVEMENT
              </span>
              <span className="text-xs font-mono font-bold text-[#24A1FF]">
                +50 XP
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#FF9500] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-[#121214]">M</div>
                <div className="w-7 h-7 rounded-full bg-[#24A1FF] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-[#121214]">J</div>
                <div className="w-7 h-7 rounded-full bg-[#34C759] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white dark:ring-[#121214]">R</div>
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <h4 className={`text-sm font-sans font-bold leading-tight ${
                  isDark ? 'text-white' : 'text-[#0A0A0A]'
                }`}>
                  Invite 3 Friends
                </h4>
                <p className={`text-xs font-sans leading-normal ${
                  isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}>
                  Build habits in shared support circles.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowInviteToast(true);
                setTimeout(() => setShowInviteToast(false), 3000);
              }}
              className="w-full py-2 border rounded-xl text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-[#E5E5EA] dark:border-[#1F1F24] hover:border-[#24A1FF]"
            >
              <Share2 className="w-3.5 h-3.5 text-[#24A1FF]" />
              <span>Share Invite Link</span>
            </button>

            {showInviteToast && (
              <p className="text-[11px] font-mono text-center text-[#34C759]">
                ✓ Invite link copied to clipboard!
              </p>
            )}
          </div>

          {/* Card 3: Slack Community Channel */}
          <div 
            onClick={() => onNavigateToTab('community')}
            className={`p-4 rounded-[20px] border transition-colors flex items-center justify-between gap-3 cursor-pointer ${
              isDark
                ? 'bg-[#121214] border-[#1F1F24] hover:border-[#24A1FF]/50'
                : 'bg-white border-[#E5E5EA] hover:border-[#24A1FF]/50 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-[12px] bg-[#24A1FF]/10 text-[#24A1FF] flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className={`text-sm font-sans font-bold leading-tight truncate ${
                  isDark ? 'text-white' : 'text-[#0A0A0A]'
                }`}>
                  Join the HBW Slack Channel
                </h4>
                <p className={`text-xs font-sans truncate ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                  Share daily progress with our team.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8E8E93] shrink-0" />
          </div>
        </motion.div>
      )}

      {/* =========================================================================
          VERSION 3: SCREEN 15 (15-events-phase-four: Show Up Together & Events)
          ========================================================================= */}
      {phase === 'phase4' && (
        <motion.div
          key="phase-4"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="flex flex-col gap-4 w-full"
        >
          {/* Title */}
          <div className="space-y-1 text-left">
            <h2 className={`text-2xl font-serif font-normal tracking-tight ${
              isDark ? 'text-white' : 'text-[#0A0A0A]'
            }`}>
              Show up, <strong className="font-serif font-bold">together.</strong>
            </h2>
            <p className={`text-xs font-sans leading-relaxed ${
              isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
            }`}>
              Find daily motivation from real-time events.
            </p>
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8E8E93] block">
              DIGITAL & LOCAL EVENTS
            </span>

            {/* Event 1 */}
            <div className={`p-4 rounded-[20px] border space-y-2.5 transition-colors ${
              isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA] shadow-2xs'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E5F1FF] text-[#0066CC] dark:bg-[#24A1FF]/15 dark:text-[#24A1FF]">
                  Digital Events
                </span>
                <span className={`text-[11px] font-sans ${isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
                  Thu, 6:00 PM • Online
                </span>
              </div>

              <h4 className={`text-sm font-sans font-bold leading-snug ${
                isDark ? 'text-white' : 'text-[#0A0A0A]'
              }`}>
                Live Q&A: habits that stick
              </h4>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setActiveEventDetail(activeEventDetail === 'evt-1' ? null : 'evt-1')}
                  className="text-xs font-sans text-[#24A1FF] hover:underline cursor-pointer"
                >
                  {activeEventDetail === 'evt-1' ? 'Hide Details' : 'RSVP Details'}
                </button>

                <button
                  type="button"
                  onClick={() => toggleRSVP('evt-1')}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans font-bold transition-all cursor-pointer ${
                    rsvps['evt-1']
                      ? 'bg-[#34C759] text-white shadow-xs'
                      : isDark
                      ? 'bg-white text-[#0A0A0A] hover:bg-[#E5E5EA]'
                      : 'bg-[#0A0A0A] text-white hover:bg-[#2C2C2E]'
                  }`}
                >
                  {rsvps['evt-1'] ? '✓ RSVP\'d' : 'RSVP'}
                </button>
              </div>

              {activeEventDetail === 'evt-1' && (
                <div className={`p-2.5 rounded-xl text-xs space-y-1 border ${
                  isDark ? 'bg-[#0A0A0C] border-[#1F1F24] text-[#98989D]' : 'bg-[#F7F4F4] border-[#E5E5EA] text-[#6C6C70]'
                }`}>
                  <p>Join behavioral scientists exploring how tiny anchors create irreversible momentum.</p>
                  <p className="font-mono text-[10px] text-[#24A1FF]">Google Meet: meet.google.com/hbw-live</p>
                </div>
              )}
            </div>

            {/* Event 2 */}
            <div className={`p-4 rounded-[20px] border space-y-2.5 transition-colors ${
              isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA] shadow-2xs'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EBF9F0] text-[#1E7E34] dark:bg-[#34C759]/15 dark:text-[#34C759]">
                  Offline
                </span>
                <span className={`text-[11px] font-sans ${isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
                  Sat, 10:00 AM • Riverside Park
                </span>
              </div>

              <h4 className={`text-sm font-sans font-bold leading-snug ${
                isDark ? 'text-white' : 'text-[#0A0A0A]'
              }`}>
                Neighborhood clean-up meetup
              </h4>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setActiveEventDetail(activeEventDetail === 'evt-2' ? null : 'evt-2')}
                  className="text-xs font-sans text-[#24A1FF] hover:underline cursor-pointer"
                >
                  {activeEventDetail === 'evt-2' ? 'Hide Details' : 'RSVP Details'}
                </button>

                <button
                  type="button"
                  onClick={() => toggleRSVP('evt-2')}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans font-bold transition-all cursor-pointer ${
                    rsvps['evt-2']
                      ? 'bg-[#34C759] text-white shadow-xs'
                      : isDark
                      ? 'bg-white text-[#0A0A0A] hover:bg-[#E5E5EA]'
                      : 'bg-[#0A0A0A] text-white hover:bg-[#2C2C2E]'
                  }`}
                >
                  {rsvps['evt-2'] ? '✓ RSVP\'d' : 'RSVP'}
                </button>
              </div>

              {activeEventDetail === 'evt-2' && (
                <div className={`p-2.5 rounded-xl text-xs space-y-1 border ${
                  isDark ? 'bg-[#0A0A0C] border-[#1F1F24] text-[#98989D]' : 'bg-[#F7F4F4] border-[#E5E5EA] text-[#6C6C70]'
                }`}>
                  <p>Bags and protective gloves provided. Refreshments sponsored by HBW community garden.</p>
                </div>
              )}
            </div>

            {/* Event 3 */}
            <div className={`p-4 rounded-[20px] border space-y-2.5 transition-colors ${
              isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA] shadow-2xs'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FFF5E5] text-[#C06000] dark:bg-[#FF9500]/15 dark:text-[#FF9500]">
                  Local
                </span>
                <span className={`text-[11px] font-sans ${isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
                  First Sunday • Community Hall
                </span>
              </div>

              <h4 className={`text-sm font-sans font-bold leading-snug ${
                isDark ? 'text-white' : 'text-[#0A0A0A]'
              }`}>
                Community garden workday
              </h4>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setActiveEventDetail(activeEventDetail === 'evt-3' ? null : 'evt-3')}
                  className="text-xs font-sans text-[#24A1FF] hover:underline cursor-pointer"
                >
                  {activeEventDetail === 'evt-3' ? 'Hide Details' : 'RSVP Details'}
                </button>

                <button
                  type="button"
                  onClick={() => toggleRSVP('evt-3')}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans font-bold transition-all cursor-pointer ${
                    rsvps['evt-3']
                      ? 'bg-[#34C759] text-white shadow-xs'
                      : isDark
                      ? 'bg-white text-[#0A0A0A] hover:bg-[#E5E5EA]'
                      : 'bg-[#0A0A0A] text-white hover:bg-[#2C2C2E]'
                  }`}
                >
                  {rsvps['evt-3'] ? '✓ RSVP\'d' : 'RSVP'}
                </button>
              </div>

              {activeEventDetail === 'evt-3' && (
                <div className={`p-2.5 rounded-xl text-xs space-y-1 border ${
                  isDark ? 'bg-[#0A0A0C] border-[#1F1F24] text-[#98989D]' : 'bg-[#F7F4F4] border-[#E5E5EA] text-[#6C6C70]'
                }`}>
                  <p>Planting native pollinator seeds and weeding community raised beds.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* =========================================================================
          LITE CONFETTI CELEBRATION
          ========================================================================= */}
      <LiteConfetti
        active={showLiteConfetti}
        message={confettiMessage}
        theme={theme}
        onComplete={() => setShowLiteConfetti(false)}
      />

      {/* =========================================================================
          COMBINED ACTION & RESPONSE: HYDRATION ECOSYSTEM OVERLAY MODAL (SCR-07 in SCR-05)
          ========================================================================= */}
      <AnimatePresence>
        {showHydrationModal && (
          <div 
            id="hydration-ecosystem-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-3 bg-black/65 backdrop-blur-xs overflow-hidden"
          >
            {/* Backdrop click to dismiss */}
            <div 
              className="absolute inset-0"
              onClick={() => setShowHydrationModal(false)} 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className={`relative z-10 w-full max-w-[348px] max-h-[92%] overflow-y-auto no-scrollbar rounded-[22px] border shadow-2xl p-3.5 sm:p-4 flex flex-col gap-2.5 ${
                isDark 
                  ? 'bg-[#121214] border-[#1F1F24] text-white shadow-black/80' 
                  : 'bg-white border-[#E5E5EA] text-[#1C1C1E] shadow-xl'
              }`}
            >
              {/* Header Bar */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase bg-[#0080FF]/15 text-[#0080FF] border border-[#0080FF]/30 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 fill-[#0080FF]" /> HABIT ENERGY REACTION
                    </span>
                    <span className="text-[10px] font-mono text-[#8E8E93]">SCR-07</span>
                  </div>
                  <h3 className="text-base font-serif font-bold tracking-tight leading-tight">
                    Hydration Ecosystem
                  </h3>
                  <p className={`text-[11px] font-sans leading-snug ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                    {completedHabitTitle ? `Checked "${completedHabitTitle}". ` : 'Micro-habit completed! '}
                    A rain cloud of Habit Energy is hovering over your tree.
                  </p>
                </div>

                <button
                  type="button"
                  id="close-hydration-modal"
                  onClick={() => setShowHydrationModal(false)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                    isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-[#1C1C1E] hover:bg-black/10'
                  }`}
                  aria-label="Close modal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tap Cloud Guidance Pill */}
              <div className="flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-full bg-[#0080FF]/10 border border-[#0080FF]/25 text-[#0080FF] text-[11px] font-sans font-medium text-center">
                <Cloud className="w-3 h-3 shrink-0 animate-pulse" />
                <span className="truncate">Tap the floating cloud below to pop & hydrate!</span>
              </div>

              {/* Interactive Ant Forest Stage (SCR-07 in stageOnly mode) */}
              <div className="w-full">
                <EcosystemVisualization
                  category={activeGoal.category}
                  streak={effectiveStreak}
                  individualEnergy={effectiveEnergy}
                  setIndividualEnergy={effectiveSetEnergy}
                  hasLoggedToday={hasLoggedToday}
                  onLogToday={onLogSuccess}
                  goalTitle={activeGoal.title}
                  bubbles={effectiveBubbles}
                  setBubbles={effectiveSetBubbles}
                  theme={theme}
                  stageOnly={true}
                />
              </div>

              {/* Dual Action Controls */}
              <div className="flex items-center gap-2 pt-0.5">
                {/* Go to Progress Button */}
                <button
                  type="button"
                  id="btn-go-to-scr07"
                  onClick={() => {
                    setShowHydrationModal(false);
                    onNavigateToTab('progress');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-full bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.98] text-white font-sans text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs whitespace-nowrap min-h-[44px]"
                >
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span>Go to Progress</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </button>

                {/* Stay in Today's Habits */}
                <button
                  type="button"
                  id="btn-stay-home"
                  onClick={() => setShowHydrationModal(false)}
                  className={`py-2.5 px-4 rounded-full border text-xs font-sans font-medium transition-colors cursor-pointer text-center whitespace-nowrap min-h-[44px] ${
                    isDark 
                      ? 'border-[#1F1F24] hover:bg-white/5 text-[#98989D]' 
                      : 'border-[#E5E5EA] hover:bg-black/5 text-[#6C6C70]'
                  }`}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
