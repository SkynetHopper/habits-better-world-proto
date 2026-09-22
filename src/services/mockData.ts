/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Centralized client-side mock data framework for Habits for a Better World.
 * Provides realistic pre-seeded user profiles, clinical habit paths, 14-day history,
 * and smart reminder triggers with zero external database dependencies.
 */

import { Goal, QuizAnswers, HabitTrigger } from '../types';
import { TOP_IMPACT_GOALS } from '../data';

export interface MockUserProfile {
  displayName: string;
  email: string;
  avatarUrl?: string;
  memberSince?: string;
  tier?: string;
}

export interface CompletionHistoryEntry {
  date: string; // YYYY-MM-DD
  completedTasks: string[];
}

export const PRESEEDED_USER: MockUserProfile = {
  displayName: 'Nathan Nagy',
  email: 'nathan@habitsforabetterworld.org',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  memberSince: 'September 2025',
  tier: 'Planet Steward · Level 3'
};

export const PRESEEDED_QUIZ_ANSWERS: QuizAnswers = {
  name: 'Nathan',
  age: '28',
  gender: 'Male',
  categories: ['Environment'],
  currentHabitLevel: 'Rarely / Never',
  timeCommitment: ['5 Minutes (Microchange)'],
  motivation: ['Personal growth & optimization'],
  friction: ['Forgetting & failing to keep track'],
  livingArrangement: 'Living with family/children',
  primaryConstraint: ['Extremely busy schedule & limited energy']
};

export const PRESEEDED_GOAL: Goal = {
  ...TOP_IMPACT_GOALS['Environment'],
  selectedOption: TOP_IMPACT_GOALS['Environment'].implementationOptions[0],
  anchorRoutine: 'Pouring morning coffee'
};

export const PRESEEDED_TRIGGERS: HabitTrigger[] = [
  {
    id: 'trig-1',
    name: 'Pouring morning coffee',
    time: '07:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enabled: true
  },
  {
    id: 'trig-2',
    name: 'Closing laptop after work',
    time: '17:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enabled: true
  },
  {
    id: 'trig-3',
    name: 'Preparing weekend brunch',
    time: '10:00',
    days: ['Sat', 'Sun'],
    enabled: false
  }
];

/**
 * Generate a realistic 14-day completion history for the user's ecosystem tree.
 */
export function generatePreseededHistory(): CompletionHistoryEntry[] {
  const history: CompletionHistoryEntry[] = [];
  const now = new Date();

  for (let i = 14; i >= 1; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // High consistency rate (simulate an engaged user on a 14-day streak)
    const isCompleted = i !== 4; // 1 rest day 4 days ago
    if (isCompleted) {
      history.push({
        date: dateStr,
        completedTasks: ['opt-env-full', 'anchor-done', 'reflect-done']
      });
    }
  }

  return history;
}
