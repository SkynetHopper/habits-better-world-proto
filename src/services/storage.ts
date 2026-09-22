/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Local Storage Interface Layer
 *
 * Exposes type-safe helper functions and raw key-value access backed by the
 * centralized LocalDataStore architecture. Fully replaces legacy Firestore
 * dependencies with offline native iOS-style local persistence.
 */

import { Goal, QuizAnswers, HabitTrigger } from '../types';
import {
  MockUserProfile,
  CompletionHistoryEntry
} from './mockData';
import { localStore, LocalDataStore } from './localStore';

export type { CompletionHistoryEntry, MockUserProfile };
export { localStore, LocalDataStore };

/**
 * Compatibility key-value interface backed by LocalDataStore driver
 */
export const storage = {
  getString: (key: string): string | null => localStore.rawGetString(key),
  set: (key: string, value: string | number | boolean | object): void => localStore.rawSet(key, value),
  delete: (key: string): void => localStore.rawDelete(key),
  getBoolean: (key: string): boolean => localStore.rawGetBoolean(key)
};

/**
 * User Profile CRUD via LocalDataStore
 */
export const getUserProfile = (): MockUserProfile => {
  return localStore.getUserProfile() || localStore.getUserProfile()!;
};

export const setUserProfile = (profile: MockUserProfile | null): void => {
  localStore.setUserProfile(profile);
};

/**
 * Committed Goal CRUD via LocalDataStore
 */
export const getCommittedGoal = (): Goal | null => {
  return localStore.getCommittedGoal();
};

export const setCommittedGoal = (goal: Goal | null): void => {
  localStore.setCommittedGoal(goal);
};

/**
 * Chosen Habits Wardrobe CRUD via LocalDataStore
 */
export const getChosenHabits = (): Goal[] => {
  return localStore.getChosenHabits();
};

export const setChosenHabits = (habits: Goal[]): void => {
  localStore.setChosenHabits(habits);
};

export const addChosenHabit = (goal: Goal): void => {
  localStore.addChosenHabit(goal);
};

export const removeChosenHabit = (goalId: string): void => {
  localStore.removeChosenHabit(goalId);
};

/**
 * Quiz Answers CRUD via LocalDataStore
 */
export const getQuizAnswers = (defaultAnswers?: QuizAnswers): QuizAnswers => {
  const answers = localStore.getQuizAnswers();
  if (defaultAnswers && (!answers || Object.keys(answers).length === 0)) {
    localStore.setQuizAnswers(defaultAnswers);
    return defaultAnswers;
  }
  return answers;
};

export const setQuizAnswers = (answers: QuizAnswers): void => {
  localStore.setQuizAnswers(answers);
};

/**
 * Completion History CRUD via LocalDataStore
 */
export const getCompletionHistory = (): CompletionHistoryEntry[] => {
  return localStore.getCompletionHistory();
};

export const saveCompletionHistory = (history: CompletionHistoryEntry[]): void => {
  localStore.saveCompletionHistory(history);
};

export const recordDailyCompletion = (date: string, taskIds: string[], verified = true): void => {
  localStore.recordCompletion(date, taskIds, verified);
};

/**
 * Habit Triggers / Smart Alerts CRUD via LocalDataStore
 */
export const getHabitTriggers = (): HabitTrigger[] => {
  return localStore.getTriggers();
};

export const saveHabitTriggers = (triggers: HabitTrigger[]): void => {
  localStore.saveTriggers(triggers);
};

export const createHabitTrigger = (trigger: Omit<HabitTrigger, 'id'>): HabitTrigger => {
  return localStore.createTrigger(trigger);
};

export const updateHabitTrigger = (id: string, partial: Partial<HabitTrigger>): HabitTrigger | null => {
  return localStore.updateTrigger(id, partial);
};

export const deleteHabitTrigger = (id: string): boolean => {
  return localStore.deleteTrigger(id);
};

export const toggleHabitTrigger = (id: string): boolean => {
  return localStore.toggleTrigger(id);
};

/**
 * Streak & Energy Gamification CRUD via LocalDataStore
 */
export const getUserStreak = (): number => {
  return localStore.getStreak();
};

export const setUserStreak = (streak: number): void => {
  localStore.setStreak(streak);
};

export const getUserEnergy = (): number => {
  return localStore.getEnergy();
};

export const setUserEnergy = (energy: number): void => {
  localStore.setEnergy(energy);
};

export const addEnergyPoints = (points: number): number => {
  return localStore.addEnergy(points);
};

/**
 * Impact Metrics & Avoided Request Counters
 */
export const getAvoidedLlmRequestsCount = (): number => {
  return localStore.getAvoidedRequests();
};

export const incrementAvoidedLlmRequestsCount = (): void => {
  localStore.incrementAvoidedRequests();
};

export const getCumulativeDarkTime = (): number => {
  return localStore.getDarkTimeSeconds();
};

export const addCumulativeDarkTime = (seconds: number): void => {
  localStore.addDarkTimeSeconds(seconds);
};

/**
 * Community Events & RSVPs
 */
export const getEventRsvps = (): Record<string, boolean> => {
  return localStore.getEventRsvps();
};

export const toggleEventRsvp = (eventId: string): boolean => {
  return localStore.toggleEventRsvp(eventId);
};

/**
 * Full State Reset to Factory Mock Data
 */
export const resetToMockData = (): void => {
  localStore.resetToFactoryDefaults();
};

export default storage;
