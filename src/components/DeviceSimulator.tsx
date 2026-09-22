import React, { useState } from 'react';
import { Smartphone, Monitor, ShieldCheck, HeartHandshake, Eye, Sparkles, X, Download, FileText, Layout, Layers } from 'lucide-react';
import HBWLogo from './HBWLogo';
import InteractionDesignSystem from './InteractionDesignSystem';

interface DeviceSimulatorProps {
  children: React.ReactNode;
  theme?: 'dark' | 'light';
}

export default function DeviceSimulator({ children, theme = 'light' }: DeviceSimulatorProps) {
  const [showFlowModal, setShowFlowModal] = useState(false);
  const isDark = theme === 'dark';

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Header bar with organization identity and simulator controls */}
      <div className="w-full max-w-7xl mx-auto px-4 py-4 mb-4 flex flex-col sm:flex-row items-center justify-between border border-[#002246]/60 bg-[#000f1f]/80 backdrop-blur-md rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <HBWLogo size="md" variant="horizontal" theme="dark" />
          <div>
            <p className="text-xs text-[#0285ff] font-medium tracking-wide font-mono flex items-center gap-1">
              <span>● Interactive Mobile App Prototype</span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowFlowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#002246] hover:bg-[#00488A] active:scale-95 text-white font-sans text-xs font-bold rounded-xl transition-all border border-[#00488A]/50 shadow-md cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#0285ff]" />
            View Screen Interaction Design Matrix
          </button>
        </div>
      </div>

      {/* Simulator view frame context - Forced to Mobile Bezel layout */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 min-h-[750px] py-4">
        {/* Mobile App design viewport with simulation bezel */}
        <div className="relative w-[390px] h-[820px] bg-black rounded-[50px] p-3.5 shadow-[0_25px_60px_-15px_rgba(2,133,255,0.15)] border-4 border-neutral-900 flex flex-col items-center shrink-0 transition-all duration-300">
          {/* Top Ear Piece notch dynamic simulation */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-30 flex items-center justify-between px-4 border border-neutral-900">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111]"></div>
            <div className="w-12 h-3.5 bg-[#111] rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0285ff]"></span>
            </div>
          </div>

          {/* Simulated phone screen container with transform containment for in-phone modals */}
          <div className={`w-full h-full rounded-[38px] overflow-hidden relative flex flex-col border transition-colors duration-300 [transform:translateZ(0)] ${
            isDark ? 'bg-[#000814] border-neutral-950' : 'bg-[#F5F5F7] border-[#D1D1D6]'
          }`}>
            {/* Simulated Mobile Status bar */}
            <div className={`pt-3 px-6 pb-2 flex items-center justify-between text-2xs font-sans font-semibold tracking-wide select-none transition-colors duration-300 ${
              isDark ? 'bg-[#000814] text-white' : 'bg-[#F5F5F7] text-[#1C1C1E]'
            }`}>
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xs font-mono">5G</span>
                <div className={`w-5 h-2.5 rounded-sm p-0.5 border flex items-center justify-start ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#E5E5EA] border-[#C7C7CC]'
                }`}>
                  <div className="w-3.5 h-full bg-emerald-500 rounded-2xs"></div>
                </div>
              </div>
            </div>

            {/* Viewable Content Area scale-adaptive */}
            <div 
              data-device-screen="true"
              className={`flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar relative flex flex-col transition-colors duration-300 ${
                isDark ? 'bg-[#000814]' : 'bg-[#F5F5F7]'
              }`}
            >
              {children}
            </div>

            {/* Simulated iOS home gesture pill */}
            <div className={`w-full h-5 flex items-center justify-center shrink-0 pb-1.5 z-20 transition-colors duration-300 ${
              isDark ? 'bg-[#000814]' : 'bg-[#F5F5F7]'
            }`}>
              <div className={`w-32 h-1 rounded-full ${
                isDark ? 'bg-slate-800' : 'bg-[#C7C7CC]'
              }`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Full screen Interaction Design System & User Flow Modal */}
      {showFlowModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 md:p-6 overflow-hidden">
          <div className="bg-[#000814] rounded-3xl shadow-2xl max-w-7xl w-full h-[92vh] flex flex-col overflow-hidden border border-[#002246]">
            <InteractionDesignSystem onClose={() => setShowFlowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
