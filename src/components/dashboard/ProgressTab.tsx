/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import EcosystemVisualization from '../EcosystemVisualization';
import { Goal } from '../../types';

interface ProgressTabProps {
  activeGoal: Goal;
  streak: number;
  individualEnergy: number;
  setIndividualEnergy: React.Dispatch<React.SetStateAction<number>>;
  hasLoggedToday: boolean;
  onLogSuccess: () => void;
  bubbles: Array<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean }>;
  setBubbles: React.Dispatch<React.SetStateAction<Array<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean }>>>;
  metrics: {
    primaryValue: string;
    primaryLabel: string;
    secondaryValue: string;
    secondaryLabel: string;
    targetTip: string;
  };
  theme: 'dark' | 'light';
}

export default function ProgressTab({
  activeGoal,
  streak,
  individualEnergy,
  setIndividualEnergy,
  hasLoggedToday,
  onLogSuccess,
  bubbles,
  setBubbles,
  metrics,
  theme
}: ProgressTabProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <EcosystemVisualization
        category={activeGoal.category}
        streak={streak}
        individualEnergy={individualEnergy}
        setIndividualEnergy={setIndividualEnergy}
        hasLoggedToday={hasLoggedToday}
        onLogToday={onLogSuccess}
        goalTitle={activeGoal.title}
        bubbles={bubbles}
        setBubbles={setBubbles}
        theme={theme}
      />

      {/* Projected Impact Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className={`p-3 sm:p-3.5 border rounded-[16px] text-center space-y-1 shadow-xs transition-colors duration-200 min-w-0 overflow-hidden flex flex-col justify-center items-center ${
          theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
        }`}>
          <span className={`text-[10px] font-mono font-bold uppercase block truncate w-full ${
            theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}>{metrics.primaryLabel.toUpperCase()}</span>
          <span className="text-sm sm:text-base font-sans font-bold text-[#0080FF] block w-full break-words leading-tight">{metrics.primaryValue}</span>
        </div>
        <div className={`p-3 sm:p-3.5 border rounded-[16px] text-center space-y-1 shadow-xs transition-colors duration-200 min-w-0 overflow-hidden flex flex-col justify-center items-center ${
          theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
        }`}>
          <span className={`text-[10px] font-mono font-bold uppercase block truncate w-full ${
            theme === 'dark' ? 'text-[#98989D]' : 'text-[#6C6C70]'
          }`}>{metrics.secondaryLabel.toUpperCase()}</span>
          <span className={`text-sm sm:text-base font-sans font-bold block w-full break-words leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#1C1C1E]'
          }`}>{metrics.secondaryValue}</span>
        </div>
      </div>
    </div>
  );
}
