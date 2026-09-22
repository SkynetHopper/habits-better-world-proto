/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Goal, QuizAnswers } from '../types';
import { 
  getCommittedGoal, 
  setCommittedGoal as saveCommittedGoal, 
  getQuizAnswers, 
  setQuizAnswers as saveQuizAnswers,
  getUserProfile,
  setUserProfile,
  getUserStreak,
  setUserStreak,
  getUserEnergy,
  setUserEnergy,
  storage,
  MockUserProfile 
} from '../services/storage';

export type UserProfile = MockUserProfile;

export interface HabitContextValue {
  // User & Auth
  user: UserProfile | null;
  isGuest: boolean;
  isAuthLoading: boolean;
  loginUser: (displayName: string, email: string) => void;
  continueAsGuest: () => void;
  signOutUser: () => Promise<void>;
  goToAuth: () => void;

  // Active Goal & Onboarding
  committedGoal: Goal | null;
  commitGoal: (goal: Goal) => void;
  resetGoal: () => void;
  answers: QuizAnswers;
  updateAnswers: (answers: QuizAnswers) => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: (newTheme?: 'dark' | 'light') => void;

  // Routine & Metrics
  streak: number;
  incrementStreak: () => void;
  individualEnergy: number;
  addIndividualEnergy: (points: number) => void;
}

const HabitContext = createContext<HabitContextValue | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  // Initialize with pre-seeded user or localStorage profile
  const [user, setUser] = useState<UserProfile | null>(() => {
    return getUserProfile();
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return storage.getBoolean('hbw_is_guest');
  });

  // Zero-wait local state loading
  const [isAuthLoading] = useState<boolean>(false);

  // Goal & Answers state pre-seeded via localStorage
  const [committedGoal, setCommittedGoalState] = useState<Goal | null>(() => getCommittedGoal());
  const [answers, setAnswersState] = useState<QuizAnswers>(() => getQuizAnswers());

  // Streak & Gamified Energy pre-seeded via localStorage
  const [streak, setStreakState] = useState<number>(() => getUserStreak());
  const [individualEnergy, setIndividualEnergyState] = useState<number>(() => getUserEnergy());

  // Global Theme
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = storage.getString('hbw_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Sync theme changes to storage and DOM
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const loginUser = (displayName: string, email: string) => {
    const profile: UserProfile = {
      displayName,
      email,
      memberSince: 'September 2025',
      tier: 'Planet Steward · Level 3'
    };
    setUser(profile);
    setUserProfile(profile);
    setIsGuest(false);
    storage.delete('hbw_is_guest');
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    storage.set('hbw_is_guest', 'true');
  };

  const goToAuth = () => {
    setIsGuest(false);
    storage.delete('hbw_is_guest');
  };

  const signOutUser = async () => {
    setUser(null);
    setUserProfile(null);
    setIsGuest(false);
    storage.delete('hbw_is_guest');
  };

  const commitGoal = (goal: Goal) => {
    setCommittedGoalState(goal);
    saveCommittedGoal(goal);
  };

  const resetGoal = () => {
    setCommittedGoalState(null);
    saveCommittedGoal(null);
  };

  const updateAnswers = (newAnswers: QuizAnswers) => {
    setAnswersState(newAnswers);
    saveQuizAnswers(newAnswers);
  };

  const toggleTheme = (newTheme?: 'dark' | 'light') => {
    const selected = newTheme || (theme === 'dark' ? 'light' : 'dark');
    setTheme(selected);
    storage.set('hbw_theme', selected);
  };

  const incrementStreak = () => {
    setStreakState(prev => {
      const next = prev + 1;
      setUserStreak(next);
      return next;
    });
  };

  const addIndividualEnergy = (points: number) => {
    setIndividualEnergyState(prev => {
      const next = prev + points;
      setUserEnergy(next);
      return next;
    });
  };

  return (
    <HabitContext.Provider
      value={{
        user,
        isGuest,
        isAuthLoading,
        loginUser,
        continueAsGuest,
        signOutUser,
        goToAuth,
        committedGoal,
        commitGoal,
        resetGoal,
        answers,
        updateAnswers,
        theme,
        toggleTheme,
        streak,
        incrementStreak,
        individualEnergy,
        addIndividualEnergy
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabit(): HabitContextValue {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
}
