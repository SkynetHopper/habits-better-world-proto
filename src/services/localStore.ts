/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Centralized Local-Only Data & Store Architecture
 *
 * Replaces remote Firebase, Firestore, and cloud databases with a native iOS-style
 * structured persistence layer. Provides schema validation, automated initial seeding,
 * full CRUD operations, transaction auditing, and graceful recovery from missing
 * or corrupted data — operating entirely offline with ZERO remote network requests.
 */

import { Goal, QuizAnswers, HabitTrigger, Category } from '../types';
import {
  PRESEEDED_USER,
  PRESEEDED_GOAL,
  PRESEEDED_QUIZ_ANSWERS,
  PRESEEDED_TRIGGERS,
  generatePreseededHistory,
  MockUserProfile,
  CompletionHistoryEntry
} from './mockData';

// ---------------------------------------------------------------------------
// Model Definitions
// ---------------------------------------------------------------------------

export interface UserProfileRecord extends MockUserProfile {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GoalRecord extends Goal {
  active?: boolean;
  committedAt?: string;
  updatedAt?: string;
}

export interface CompletionRecord extends CompletionHistoryEntry {
  id?: string;
  verified?: boolean;
  notes?: string;
  updatedAt?: string;
}

export interface TriggerRecord extends HabitTrigger {
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizAnswersRecord extends QuizAnswers {
  completedAt?: string;
}

export interface GamificationRecord {
  streak: number;
  energy: number;
  avoidedRequests: number;
  darkTimeSeconds: number;
  lastActiveDate: string;
}

export interface TransactionRecord {
  id: string;
  timestamp: string;
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'RESET';
  entity: string;
  entityId?: string;
  details?: string;
}

// ---------------------------------------------------------------------------
// Storage Keys & Schema Version
// ---------------------------------------------------------------------------

export const STORE_SCHEMA_VERSION = '2.0.0-local';

const KEYS = {
  SCHEMA_VERSION: 'hbw_local_schema_version',
  USER_PROFILE: 'hbw_user_profile',
  COMMITTED_GOAL: 'hbw_committed_goal',
  CHOSEN_HABITS: 'hbw_chosen_habits',
  QUIZ_ANSWERS: 'hbw_quiz_answers',
  COMPLETIONS: 'hbw_completion_history',
  TRIGGERS: 'hbw_habit_triggers',
  GAMIFICATION: 'hbw_gamification_state',
  STREAK: 'hbw_user_streak',
  ENERGY: 'hbw_user_energy',
  AVOIDED_REQUESTS: 'hbw_avoided_llm_requests',
  DARK_TIME: 'hbw_cumulative_dark_time',
  THEME: 'hbw_theme',
  IS_GUEST: 'hbw_is_guest',
  HAS_LOGGED_IN: 'hbw_has_logged_in',
  EVENT_RSVPS: 'hbw_event_rsvps',
  TRANSACTION_LOG: 'hbw_local_transaction_log'
} as const;

// ---------------------------------------------------------------------------
// Low-Level Driver with In-Memory Sandbox Fallback
// ---------------------------------------------------------------------------

const memoryStorage = new Map<string, string>();

class LocalStorageDriver {
  private isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  getItem(key: string): string | null {
    try {
      if (this.isAvailable()) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch (err) {
      console.warn(`[LocalStore Driver] Failed to read key "${key}" from localStorage:`, err);
    }
    return memoryStorage.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    try {
      if (this.isAvailable()) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (err) {
      console.warn(`[LocalStore Driver] Failed to write key "${key}" to localStorage:`, err);
    }
    memoryStorage.set(key, value);
  }

  removeItem(key: string): void {
    try {
      if (this.isAvailable()) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (err) {
      console.warn(`[LocalStore Driver] Failed to remove key "${key}" from localStorage:`, err);
    }
    memoryStorage.delete(key);
  }

  clear(): void {
    try {
      if (this.isAvailable()) {
        window.localStorage.clear();
        return;
      }
    } catch (err) {
      console.warn('[LocalStore Driver] Failed to clear localStorage:', err);
    }
    memoryStorage.clear();
  }
}

const driver = new LocalStorageDriver();

// ---------------------------------------------------------------------------
// Safe Serialization & Corruption Recovery Helpers
// ---------------------------------------------------------------------------

function safeParse<T>(raw: string | null, fallback: T, validator?: (val: unknown) => boolean): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (validator && !validator(parsed)) {
      console.warn('[LocalStore] Schema validation failed for stored entity. Restoring seeded fallback.');
      return fallback;
    }
    return parsed as T;
  } catch (err) {
    console.warn('[LocalStore] JSON parse failure or corrupted data detected. Restoring seeded fallback:', err);
    return fallback;
  }
}

function safeStringify(data: unknown): string {
  try {
    return JSON.stringify(data);
  } catch (err) {
    console.error('[LocalStore] Serialization failure:', err);
    return '{}';
  }
}

// ---------------------------------------------------------------------------
// Transaction Logger (Offline Audit Trail)
// ---------------------------------------------------------------------------

function logTransaction(operation: TransactionRecord['operation'], entity: string, entityId?: string, details?: string): void {
  try {
    const raw = driver.getItem(KEYS.TRANSACTION_LOG);
    const logs: TransactionRecord[] = raw ? JSON.parse(raw) : [];
    logs.push({
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      operation,
      entity,
      entityId,
      details
    });
    // Keep last 100 transactions in local journal
    const trimmed = logs.slice(-100);
    driver.setItem(KEYS.TRANSACTION_LOG, safeStringify(trimmed));
  } catch {
    // Non-fatal logging failure
  }
}

// ---------------------------------------------------------------------------
// Central Store Implementation
// ---------------------------------------------------------------------------

export class LocalDataStore {
  private static instance: LocalDataStore;

  private constructor() {
    this.ensureInitialized();
  }

  public static getInstance(): LocalDataStore {
    if (!LocalDataStore.instance) {
      LocalDataStore.instance = new LocalDataStore();
    }
    return LocalDataStore.instance;
  }

  /**
   * Initializes the store with pre-seeded data on fresh installation or migration.
   */
  public ensureInitialized(): void {
    const version = driver.getItem(KEYS.SCHEMA_VERSION);
    if (!version) {
      this.seedInitialData();
      driver.setItem(KEYS.SCHEMA_VERSION, STORE_SCHEMA_VERSION);
    }
  }

  /**
   * Seeds realistic, science-based initial data for all application models.
   * Note: Fresh installs and incognito sessions do NOT auto-login or auto-commit
   * so new users experience the Welcome gateway and Onboarding flow.
   */
  public seedInitialData(): void {
    // 1. Clinical Quiz Answers template
    if (!driver.getItem(KEYS.QUIZ_ANSWERS)) {
      driver.setItem(KEYS.QUIZ_ANSWERS, safeStringify(PRESEEDED_QUIZ_ANSWERS));
    }

    // 2. Habit Triggers catalog
    if (!driver.getItem(KEYS.TRIGGERS)) {
      driver.setItem(KEYS.TRIGGERS, safeStringify(PRESEEDED_TRIGGERS));
    }

    // 3. Initial Gamification Stats
    if (!driver.getItem(KEYS.STREAK)) {
      driver.setItem(KEYS.STREAK, '0');
    }
    if (!driver.getItem(KEYS.ENERGY)) {
      driver.setItem(KEYS.ENERGY, '0');
    }
    if (!driver.getItem(KEYS.AVOIDED_REQUESTS)) {
      driver.setItem(KEYS.AVOIDED_REQUESTS, '0');
    }
    if (!driver.getItem(KEYS.DARK_TIME)) {
      driver.setItem(KEYS.DARK_TIME, '0');
    }

    // 4. Event RSVPs
    if (!driver.getItem(KEYS.EVENT_RSVPS)) {
      driver.setItem(KEYS.EVENT_RSVPS, safeStringify({ 'evt-1': true }));
    }

    logTransaction('RESET', 'STORE', undefined, 'Initial store seed completed');
  }

  /**
   * Resets the entire local data layer back to default seeded mock data.
   */
  public resetToFactoryDefaults(): void {
    driver.setItem(KEYS.USER_PROFILE, safeStringify(PRESEEDED_USER));
    driver.setItem(KEYS.COMMITTED_GOAL, safeStringify(PRESEEDED_GOAL));
    driver.setItem(KEYS.CHOSEN_HABITS, safeStringify([PRESEEDED_GOAL]));
    driver.setItem(KEYS.QUIZ_ANSWERS, safeStringify(PRESEEDED_QUIZ_ANSWERS));
    driver.setItem(KEYS.COMPLETIONS, safeStringify(generatePreseededHistory()));
    driver.setItem(KEYS.TRIGGERS, safeStringify(PRESEEDED_TRIGGERS));
    driver.setItem(KEYS.STREAK, '14');
    driver.setItem(KEYS.ENERGY, '185');
    driver.setItem(KEYS.AVOIDED_REQUESTS, '12');
    driver.setItem(KEYS.DARK_TIME, '3680');
    driver.setItem(KEYS.IS_GUEST, 'false');
    driver.setItem(KEYS.HAS_LOGGED_IN, 'true');
    driver.setItem(KEYS.EVENT_RSVPS, safeStringify({ 'evt-1': true }));
    driver.setItem(KEYS.SCHEMA_VERSION, STORE_SCHEMA_VERSION);
    logTransaction('RESET', 'STORE', undefined, 'Full factory reset executed');
  }

  // -------------------------------------------------------------------------
  // USER PROFILE CRUD
  // -------------------------------------------------------------------------

  public getUserProfile(): UserProfileRecord | null {
    const raw = driver.getItem(KEYS.USER_PROFILE);
    if (!raw) return null;
    return safeParse<UserProfileRecord | null>(
      raw,
      null,
      (val) => typeof val === 'object' && val !== null && 'displayName' in val
    );
  }

  public setUserProfile(profile: UserProfileRecord | null): void {
    if (profile) {
      const updated: UserProfileRecord = {
        ...profile,
        updatedAt: new Date().toISOString()
      };
      driver.setItem(KEYS.USER_PROFILE, safeStringify(updated));
      driver.setItem(KEYS.HAS_LOGGED_IN, 'true');
      logTransaction('UPDATE', 'UserProfile', profile.email, 'Updated user profile');
    } else {
      driver.removeItem(KEYS.USER_PROFILE);
      driver.removeItem(KEYS.HAS_LOGGED_IN);
      logTransaction('DELETE', 'UserProfile', undefined, 'User signed out / profile cleared');
    }
  }

  // -------------------------------------------------------------------------
  // GOALS & HABITS CRUD
  // -------------------------------------------------------------------------

  public getCommittedGoal(): GoalRecord | null {
    const raw = driver.getItem(KEYS.COMMITTED_GOAL);
    if (!raw) return null;
    return safeParse<GoalRecord | null>(
      raw,
      null,
      (val) => typeof val === 'object' && val !== null && 'id' in val && 'title' in val
    );
  }

  public setCommittedGoal(goal: GoalRecord | null): void {
    if (goal) {
      const updated: GoalRecord = {
        ...goal,
        active: true,
        committedAt: goal.committedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      driver.setItem(KEYS.COMMITTED_GOAL, safeStringify(updated));
      this.addChosenHabit(updated);
      logTransaction('UPDATE', 'Goal', goal.id, `Committed to goal: ${goal.title}`);
    } else {
      driver.removeItem(KEYS.COMMITTED_GOAL);
      logTransaction('DELETE', 'Goal', undefined, 'Committed goal cleared');
    }
  }

  public getChosenHabits(): GoalRecord[] {
    const raw = driver.getItem(KEYS.CHOSEN_HABITS);
    if (!raw) {
      const active = this.getCommittedGoal();
      return active ? [active] : [];
    }
    return safeParse<GoalRecord[]>(raw, [], (val) => Array.isArray(val));
  }

  public setChosenHabits(habits: GoalRecord[]): void {
    driver.setItem(KEYS.CHOSEN_HABITS, safeStringify(habits));
    logTransaction('UPDATE', 'ChosenHabits', undefined, `Updated wardrobe with ${habits.length} habits`);
  }

  public addChosenHabit(goal: GoalRecord): void {
    const current = this.getChosenHabits();
    if (!current.some((g) => g.id === goal.id)) {
      current.push(goal);
      this.setChosenHabits(current);
      logTransaction('CREATE', 'ChosenHabit', goal.id, `Added habit to wardrobe: ${goal.title}`);
    }
  }

  public removeChosenHabit(goalId: string): void {
    const current = this.getChosenHabits();
    if (current.length <= 1) return; // Keep at least one
    const filtered = current.filter((g) => g.id !== goalId);
    this.setChosenHabits(filtered);
    logTransaction('DELETE', 'ChosenHabit', goalId, 'Removed habit from wardrobe');
  }

  // -------------------------------------------------------------------------
  // COMPLETION HISTORY CRUD
  // -------------------------------------------------------------------------

  public getCompletionHistory(): CompletionRecord[] {
    const raw = driver.getItem(KEYS.COMPLETIONS);
    return safeParse<CompletionRecord[]>(
      raw,
      generatePreseededHistory(),
      (val) => Array.isArray(val)
    );
  }

  public saveCompletionHistory(history: CompletionRecord[]): void {
    driver.setItem(KEYS.COMPLETIONS, safeStringify(history));
    logTransaction('UPDATE', 'CompletionHistory', undefined, `Saved ${history.length} history entries`);
  }

  public recordCompletion(date: string, tasks: string[], verified = true): void {
    const history = this.getCompletionHistory();
    const existingIndex = history.findIndex((h) => h.date === date);

    if (existingIndex >= 0) {
      // Merge unique tasks
      const merged = Array.from(new Set([...history[existingIndex].completedTasks, ...tasks]));
      history[existingIndex] = {
        ...history[existingIndex],
        completedTasks: merged,
        verified,
        updatedAt: new Date().toISOString()
      };
    } else {
      history.unshift({
        date,
        completedTasks: tasks,
        verified,
        updatedAt: new Date().toISOString()
      });
    }

    this.saveCompletionHistory(history);
    logTransaction('CREATE', 'CompletionEntry', date, `Recorded tasks: ${tasks.join(', ')}`);
  }

  public removeCompletion(date: string): void {
    const history = this.getCompletionHistory().filter((h) => h.date !== date);
    this.saveCompletionHistory(history);
    logTransaction('DELETE', 'CompletionEntry', date, 'Removed completion record');
  }

  // -------------------------------------------------------------------------
  // HABIT TRIGGERS / SMART ALERTS CRUD
  // -------------------------------------------------------------------------

  public getTriggers(): TriggerRecord[] {
    const raw = driver.getItem(KEYS.TRIGGERS);
    return safeParse<TriggerRecord[]>(
      raw,
      PRESEEDED_TRIGGERS,
      (val) => Array.isArray(val) && val.length > 0
    );
  }

  public saveTriggers(triggers: TriggerRecord[]): void {
    driver.setItem(KEYS.TRIGGERS, safeStringify(triggers));
    logTransaction('UPDATE', 'Triggers', undefined, `Saved ${triggers.length} triggers`);
  }

  public createTrigger(trigger: Omit<TriggerRecord, 'id'>): TriggerRecord {
    const triggers = this.getTriggers();
    const newRecord: TriggerRecord = {
      ...trigger,
      id: `trig-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    triggers.push(newRecord);
    this.saveTriggers(triggers);
    logTransaction('CREATE', 'Trigger', newRecord.id, `Created trigger: ${newRecord.name}`);
    return newRecord;
  }

  public updateTrigger(id: string, partial: Partial<TriggerRecord>): TriggerRecord | null {
    const triggers = this.getTriggers();
    const index = triggers.findIndex((t) => t.id === id);
    if (index === -1) return null;

    triggers[index] = {
      ...triggers[index],
      ...partial,
      updatedAt: new Date().toISOString()
    };
    this.saveTriggers(triggers);
    logTransaction('UPDATE', 'Trigger', id, `Updated trigger: ${triggers[index].name}`);
    return triggers[index];
  }

  public deleteTrigger(id: string): boolean {
    const triggers = this.getTriggers();
    const filtered = triggers.filter((t) => t.id !== id);
    if (filtered.length === triggers.length) return false;
    this.saveTriggers(filtered);
    logTransaction('DELETE', 'Trigger', id, 'Deleted habit trigger');
    return true;
  }

  public toggleTrigger(id: string): boolean {
    const triggers = this.getTriggers();
    const trigger = triggers.find((t) => t.id === id);
    if (!trigger) return false;
    trigger.enabled = !trigger.enabled;
    trigger.updatedAt = new Date().toISOString();
    this.saveTriggers(triggers);
    logTransaction('UPDATE', 'Trigger', id, `Toggled trigger ${id} to ${trigger.enabled}`);
    return trigger.enabled;
  }

  // -------------------------------------------------------------------------
  // CLINICAL QUIZ ANSWERS CRUD
  // -------------------------------------------------------------------------

  public getQuizAnswers(): QuizAnswersRecord {
    const raw = driver.getItem(KEYS.QUIZ_ANSWERS);
    return safeParse<QuizAnswersRecord>(
      raw,
      PRESEEDED_QUIZ_ANSWERS,
      (val) => typeof val === 'object' && val !== null && 'categories' in val
    );
  }

  public setQuizAnswers(answers: QuizAnswersRecord): void {
    const record: QuizAnswersRecord = {
      ...answers,
      completedAt: new Date().toISOString()
    };
    driver.setItem(KEYS.QUIZ_ANSWERS, safeStringify(record));
    logTransaction('UPDATE', 'QuizAnswers', undefined, 'Saved clinical assessment answers');
  }

  // -------------------------------------------------------------------------
  // GAMIFICATION & ECO-METRICS
  // -------------------------------------------------------------------------

  public getStreak(): number {
    const saved = driver.getItem(KEYS.STREAK);
    const parsed = saved ? parseInt(saved, 10) : 14;
    return isNaN(parsed) ? 14 : parsed;
  }

  public setStreak(streak: number): void {
    driver.setItem(KEYS.STREAK, String(streak));
  }

  public getEnergy(): number {
    const saved = driver.getItem(KEYS.ENERGY);
    const parsed = saved ? parseInt(saved, 10) : 185;
    return isNaN(parsed) ? 185 : parsed;
  }

  public setEnergy(energy: number): void {
    driver.setItem(KEYS.ENERGY, String(energy));
  }

  public addEnergy(points: number): number {
    const current = this.getEnergy();
    const updated = Math.max(0, current + points);
    this.setEnergy(updated);
    logTransaction('UPDATE', 'Energy', undefined, `Added ${points} points, total: ${updated}`);
    return updated;
  }

  public getAvoidedRequests(): number {
    const saved = driver.getItem(KEYS.AVOIDED_REQUESTS);
    const parsed = saved ? parseInt(saved, 10) : 12;
    return isNaN(parsed) ? 12 : parsed;
  }

  public incrementAvoidedRequests(): number {
    const next = this.getAvoidedRequests() + 1;
    driver.setItem(KEYS.AVOIDED_REQUESTS, String(next));
    return next;
  }

  public getDarkTimeSeconds(): number {
    const saved = driver.getItem(KEYS.DARK_TIME);
    const parsed = saved ? parseInt(saved, 10) : 3680;
    return isNaN(parsed) ? 3680 : parsed;
  }

  public addDarkTimeSeconds(seconds: number): number {
    const next = this.getDarkTimeSeconds() + seconds;
    driver.setItem(KEYS.DARK_TIME, String(next));
    return next;
  }

  // -------------------------------------------------------------------------
  // COMMUNITY EVENTS & RSVPs
  // -------------------------------------------------------------------------

  public getEventRsvps(): Record<string, boolean> {
    const raw = driver.getItem(KEYS.EVENT_RSVPS);
    return safeParse<Record<string, boolean>>(raw, { 'evt-1': true });
  }

  public toggleEventRsvp(eventId: string): boolean {
    const rsvps = this.getEventRsvps();
    const nextState = !rsvps[eventId];
    rsvps[eventId] = nextState;
    driver.setItem(KEYS.EVENT_RSVPS, safeStringify(rsvps));
    logTransaction('UPDATE', 'EventRsvp', eventId, `RSVP set to ${nextState}`);
    return nextState;
  }

  // -------------------------------------------------------------------------
  // TRANSACTION AUDIT LOG
  // -------------------------------------------------------------------------

  public getTransactionHistory(limit = 50): TransactionRecord[] {
    const raw = driver.getItem(KEYS.TRANSACTION_LOG);
    const logs = safeParse<TransactionRecord[]>(raw, []);
    return logs.slice(-limit).reverse();
  }

  // -------------------------------------------------------------------------
  // GENERIC KEY-VALUE COMPATIBILITY LAYER
  // -------------------------------------------------------------------------

  public rawGetString(key: string): string | null {
    return driver.getItem(key);
  }

  public rawSet(key: string, value: string | number | boolean | object): void {
    const stringVal = typeof value === 'string' ? value : safeStringify(value);
    driver.setItem(key, stringVal);
  }

  public rawDelete(key: string): void {
    driver.removeItem(key);
  }

  public rawGetBoolean(key: string): boolean {
    return driver.getItem(key) === 'true';
  }
}

// Export singleton instance
export const localStore = LocalDataStore.getInstance();
export default localStore;
