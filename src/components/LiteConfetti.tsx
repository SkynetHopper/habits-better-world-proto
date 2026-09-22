/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap } from 'lucide-react';

interface LiteConfettiProps {
  active: boolean;
  onComplete?: () => void;
  message?: string;
  theme?: 'dark' | 'light';
}

interface Particle {
  id: number;
  xPercent: number; // 4% to 96% across full screen
  xSway: number; // horizontal flutter amplitude
  yStart: number;
  yPeak?: number;
  yEnd: number;
  scale: number;
  color: string;
  shape: 'rect' | 'circle' | 'diamond' | 'ribbon';
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  duration: number;
  delay: number;
}

const PALETTE = [
  '#0080FF', // Azure
  '#34C759', // Green
  '#FF9500', // Amber
  '#AF52DE', // Purple
  '#38BDF8', // Sky Blue
  '#FF2D55', // Coral Red
  '#FFD60A', // Gold
  '#30D158', // Mint
  '#5E5CE6'  // Indigo
];

export default function LiteConfetti({
  active,
  onComplete,
  message = 'Micro-habit completed! +15g Rain Cloud ready',
  theme = 'light'
}: LiteConfettiProps) {
  // Generate particles that cover the full screen from top to bottom
  const particles = useMemo<Particle[]>(() => {
    if (!active) return [];
    
    // 68 total particles: a mix of top-to-bottom cascades and upward celebratory bursts
    return Array.from({ length: 68 }).map((_, i) => {
      const shapeRand = Math.random();
      const shape: 'rect' | 'circle' | 'diamond' | 'ribbon' = 
        shapeRand < 0.35 ? 'rect' : shapeRand < 0.6 ? 'circle' : shapeRand < 0.82 ? 'diamond' : 'ribbon';
      
      const isBurst = i % 3 === 0; // 1 in 3 bursts upward first then falls down
      const xPercent = 4 + Math.random() * 92; // spreads 4% - 96% horizontally
      const xSway = (Math.random() - 0.5) * 50; // gentle flutter sway
      const yEnd = 760 + Math.random() * 120; // past the bottom of mobile frame (760px - 880px)

      return {
        id: i,
        xPercent,
        xSway,
        yStart: isBurst ? (220 + Math.random() * 80) : (-30 - Math.random() * 60), // bursts from checklist or starts at top
        yPeak: isBurst ? (-20 - Math.random() * 50) : undefined, // climbs to top before cascading
        yEnd,
        scale: shape === 'ribbon' ? 0.85 + Math.random() * 0.4 : 0.65 + Math.random() * 0.55,
        color: PALETTE[i % PALETTE.length],
        shape,
        rotateX: 360 + Math.random() * 1080,
        rotateY: 360 + Math.random() * 1080,
        rotateZ: (Math.random() - 0.5) * 1080,
        duration: 3.2 + Math.random() * 1.3, // 3.2s - 4.5s graceful tumble
        delay: isBurst ? Math.random() * 0.15 : Math.random() * 0.45 // staggered release
      };
    });
  }, [active]);

  useEffect(() => {
    if (active && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 4200); // 4.2s to enjoy full top-to-bottom celebration
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <div 
          id="lite-confetti-overlay"
          className="fixed inset-0 pointer-events-none z-[60] overflow-hidden"
        >
          {/* Confetti Particles: Full Screen Top-to-Bottom Drift */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map((p) => {
              const yKeyframes = p.yPeak !== undefined 
                ? [p.yStart, p.yPeak, p.yEnd] 
                : [p.yStart, p.yEnd];
              
              return (
                <motion.div
                  key={p.id}
                  initial={{
                    x: 0,
                    y: p.yStart,
                    scale: 0.2,
                    opacity: 1,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0
                  }}
                  animate={{
                    x: [0, p.xSway, -p.xSway * 0.7, p.xSway * 0.4],
                    y: yKeyframes,
                    scale: [0.2, p.scale, p.scale * 0.95, 0.5],
                    opacity: [1, 1, 0.95, 0],
                    rotateX: [0, p.rotateX * 0.5, p.rotateX],
                    rotateY: [0, p.rotateY * 0.5, p.rotateY],
                    rotateZ: [0, p.rotateZ * 0.5, p.rotateZ]
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: [0.22, 1, 0.36, 1] // airy drifting easing
                  }}
                  style={{
                    left: `${p.xPercent}%`,
                    backgroundColor: p.color,
                    width: p.shape === 'rect' ? '6px' : p.shape === 'ribbon' ? '4px' : '7px',
                    height: p.shape === 'rect' ? '12px' : p.shape === 'ribbon' ? '16px' : '7px',
                    borderRadius: p.shape === 'circle' ? '9999px' : '2px',
                    transform: p.shape === 'diamond' ? 'rotate(45deg)' : undefined
                  }}
                  className="absolute origin-center drop-shadow-xs"
                />
              );
            })}
          </div>

          {/* Celebratory Banner (Anchored at Top) */}
          <div className="absolute top-10 inset-x-3 sm:inset-x-4 flex justify-center z-10">
            <motion.div
              initial={{ opacity: 0, y: -24, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.92 }}
              transition={{ type: 'spring', damping: 16, stiffness: 260 }}
              className={`max-w-[340px] w-full px-3.5 py-2 rounded-full border shadow-xl backdrop-blur-md flex items-center justify-between gap-2 ${
                theme === 'dark'
                  ? 'bg-[#121214]/95 border-[#0080FF]/40 text-white'
                  : 'bg-white/95 border-[#0080FF]/40 text-[#1C1C1E]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-[#0080FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-3 h-3 stroke-[2.5]" />
                </span>
                <span className="text-xs font-sans font-semibold truncate">
                  {message}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#0080FF] flex items-center gap-0.5 shrink-0 bg-[#0080FF]/10 px-2 py-0.5 rounded-full border border-[#0080FF]/25">
                <Zap className="w-3 h-3 fill-[#0080FF]" /> +15g
              </span>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
