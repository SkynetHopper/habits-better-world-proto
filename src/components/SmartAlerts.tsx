/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bell, Plus } from 'lucide-react';
import { HabitTrigger } from '../types';
import { getHabitTriggers, saveHabitTriggers } from '../services/storage';
import TriggerItem from './alerts/TriggerItem';
import TriggerForm from './alerts/TriggerForm';
import NotificationPreviewCard from './alerts/NotificationPreviewCard';

interface SmartAlertsProps {
  goalTitle: string;
  defaultAnchor?: string;
  theme?: 'dark' | 'light';
  onSaveConfigured?: (anchor: string, alertTime: string, triggers?: HabitTrigger[]) => void;
}

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SmartAlerts({ 
  goalTitle, 
  defaultAnchor = 'pouring my morning coffee', 
  theme = 'light',
  onSaveConfigured 
}: SmartAlertsProps) {
  const isDark = theme === 'dark';

  // Load triggers from preseeded localStorage framework
  const [triggers, setTriggers] = useState<HabitTrigger[]>(() => {
    return getHabitTriggers();
  });

  // State for adding a new trigger
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newDays, setNewDays] = useState<string[]>(ALL_DAYS);

  // State for editing an existing trigger
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTime, setEditTime] = useState('08:00');
  const [editDays, setEditDays] = useState<string[]>(ALL_DAYS);

  // Notification option toggles
  const [pushOptIn, setPushOptIn] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Save triggers to localStorage
  useEffect(() => {
    saveHabitTriggers(triggers);
  }, [triggers]);

  // Primary active trigger for preview
  const primaryTrigger = triggers.find((t) => t.enabled) || triggers[0] || {
    id: 'placeholder',
    name: defaultAnchor,
    time: '08:00',
    days: ALL_DAYS,
    enabled: true
  };

  const showSavedFeedback = (customMessage?: string) => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);

    window.dispatchEvent(
      new CustomEvent('hbw:add-notification', {
        detail: {
          id: Date.now(),
          title: 'Smart Reminders Updated ⏰',
          body: customMessage || `Habit paired with anchor "${primaryTrigger.name}".`,
          type: 'system'
        }
      })
    );
  };

  const handleStartAdd = () => {
    setNewName('');
    setNewTime('08:00');
    setNewDays(ALL_DAYS);
    setIsAdding(true);
    setEditingId(null);
  };

  const handleSaveNew = () => {
    if (!newName.trim()) return;
    const newTrigger: HabitTrigger = {
      id: `trigger-${Date.now()}`,
      name: newName.trim(),
      time: newTime || '08:00',
      days: newDays.length > 0 ? newDays : ALL_DAYS,
      enabled: true
    };
    const updated = [...triggers, newTrigger];
    setTriggers(updated);
    setIsAdding(false);
    setNewName('');

    if (onSaveConfigured) {
      onSaveConfigured(newTrigger.name, newTrigger.time, updated);
    }
    showSavedFeedback(`Added trigger: "${newTrigger.name}"`);
  };

  const handleStartEdit = (trigger: HabitTrigger) => {
    setEditingId(trigger.id);
    setEditName(trigger.name);
    setEditTime(trigger.time || '08:00');
    setEditDays(trigger.days || ALL_DAYS);
    setIsAdding(false);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    const updated = triggers.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          name: editName.trim(),
          time: editTime || '08:00',
          days: editDays.length > 0 ? editDays : ALL_DAYS
        };
      }
      return t;
    });
    setTriggers(updated);
    setEditingId(null);

    const edited = updated.find((t) => t.id === id);
    if (edited && onSaveConfigured) {
      onSaveConfigured(edited.name, edited.time, updated);
    }
    showSavedFeedback(`Updated trigger: "${editName.trim()}"`);
  };

  const handleToggle = (id: string) => {
    const updated = triggers.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t));
    setTriggers(updated);

    const enabledTrigger = updated.find((t) => t.enabled);
    if (enabledTrigger && onSaveConfigured) {
      onSaveConfigured(enabledTrigger.name, enabledTrigger.time, updated);
    }
  };

  const handleDelete = (id: string) => {
    const updated = triggers.filter((t) => t.id !== id);
    setTriggers(updated);
    if (editingId === id) setEditingId(null);

    const remaining = updated.find((t) => t.enabled) || updated[0];
    if (remaining && onSaveConfigured) {
      onSaveConfigured(remaining.name, remaining.time, updated);
    }
    showSavedFeedback('Trigger removed.');
  };

  return (
    <div className="space-y-4">
      {/* Triggers Manager Card */}
      <div
        className={`p-4 border rounded-[16px] shadow-xs flex flex-col gap-3.5 transition-colors duration-200 ${
          isDark ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
        }`}
      >
        <div
          className={`flex items-center justify-between border-b pb-2.5 ${
            isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#0080FF]/15 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-[#0080FF]" />
            </div>
            <div>
              <h4 className="text-xs font-sans font-bold uppercase tracking-wider">
                Habit Anchors & Cues
              </h4>
              <p
                className={`text-[10px] ${
                  isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}
              >
                Pair your habit with existing routines to trigger consistency
              </p>
            </div>
          </div>

          {!isAdding && (
            <button
              type="button"
              onClick={handleStartAdd}
              className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-[#0080FF] hover:text-[#0066CC] transition-colors px-2.5 py-1 rounded-full border border-[#0080FF]/30 hover:bg-[#0080FF]/10 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>

        {/* List of active triggers */}
        <div className="flex flex-col gap-2.5">
          {triggers.map((trigger) => {
            if (editingId === trigger.id) {
              return (
                <TriggerForm
                  key={trigger.id}
                  title="Edit Trigger"
                  name={editName}
                  setName={setEditName}
                  time={editTime}
                  setTime={setEditTime}
                  days={editDays}
                  setDays={setEditDays}
                  allDays={ALL_DAYS}
                  onSave={() => handleSaveEdit(trigger.id)}
                  onCancel={() => setEditingId(null)}
                  isDark={isDark}
                  submitLabel="Save Changes"
                />
              );
            }

            return (
              <TriggerItem
                key={trigger.id}
                trigger={trigger}
                isDark={isDark}
                onToggle={handleToggle}
                onStartEdit={handleStartEdit}
                onDelete={handleDelete}
              />
            );
          })}

          {triggers.length === 0 && !isAdding && (
            <div
              className={`p-4 text-center border rounded-[14px] border-dashed ${
                isDark
                  ? 'border-[#1F1F24] text-[#98989D]'
                  : 'border-[#E5E5EA] text-[#6C6C70]'
              }`}
            >
              <p className="text-xs">
                No active triggers. Tap below to pair your habit with a daily routine.
              </p>
              <button
                type="button"
                onClick={handleStartAdd}
                className="mt-2 text-xs font-semibold text-[#0080FF] hover:underline cursor-pointer"
              >
                + Add your first trigger
              </button>
            </div>
          )}
        </div>

        {/* Add Trigger Inline Form */}
        {isAdding && (
          <TriggerForm
            title="New Trigger"
            name={newName}
            setName={setNewName}
            time={newTime}
            setTime={setNewTime}
            days={newDays}
            setDays={setNewDays}
            allDays={ALL_DAYS}
            onSave={handleSaveNew}
            onCancel={() => setIsAdding(false)}
            isDark={isDark}
            submitLabel="Add Trigger"
          />
        )}

        {/* Notification Channel Preferences */}
        <div
          className={`space-y-2.5 pt-2 border-t ${
            isDark ? 'border-[#1F1F24]' : 'border-[#E5E5EA]'
          }`}
        >
          <span
            className={`text-[10px] font-mono uppercase tracking-wider font-bold block ${
              isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
            }`}
          >
            Notification Preferences
          </span>

          <div className="flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span
                className={`font-semibold block ${
                  isDark ? 'text-white' : 'text-[#1C1C1E]'
                }`}
              >
                Push Notifications
              </span>
              <span
                className={`text-[10px] block leading-tight ${
                  isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                }`}
              >
                Trigger alerts on scheduled days
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushOptIn}
                onChange={(e) => setPushOptIn(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0080FF] ${
                  isDark
                    ? 'bg-[#1F1F24] after:border-[#1F1F24]'
                    : 'bg-[#E5E5EA] after:border-[#E5E5EA]'
                }`}
              />
            </label>
          </div>
        </div>

        {isSaved && (
          <p className="text-xs font-mono text-center text-emerald-500 font-semibold animate-pulse">
            ✔ Smart alert triggers saved.
          </p>
        )}
      </div>

      {/* Interactive Notification Live Preview Simulator */}
      <NotificationPreviewCard
        primaryTrigger={primaryTrigger}
        goalTitle={goalTitle}
        isDark={isDark}
      />
    </div>
  );
}
