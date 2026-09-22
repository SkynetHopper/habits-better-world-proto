/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

const wordLines = [
  { text: "HABITS", color: "text-pearl", delay: 1.45 },
  { text: "FOR A", color: "text-pearl", delay: 1.7 },
  { text: "BETTER", color: "text-azure", delay: 1.95 },
  { text: "WORLD", color: "text-pearl", delay: 2.2 },
];

export default function AnimatedLogo() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Symbol: entrance on outer, breathing on inner */}
      <motion.div
        className="relative w-24 h-24"
        initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Pulsing glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-azure/30 blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />

        {/* Continuous breathing after bloom settles */}
        <motion.div
          className="relative w-full h-full"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 2.7 }}
        >
          {/* Pearl circle body (inverted treatment for dark bg) */}
          <div className="absolute inset-0 rounded-full bg-pearl" />

          {/* Azure semicircle wipes in from left */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 50% 0 0)" }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-full h-full bg-azure" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Stacked wordmark — line by line */}
      <div className="mt-5 flex flex-col items-center">
        {wordLines.map(({ text, color, delay }) => (
          <motion.span
            key={text}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
            className={`font-heading font-bold text-lg leading-tight tracking-[0.02em] ${color}`}
          >
            {text}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
