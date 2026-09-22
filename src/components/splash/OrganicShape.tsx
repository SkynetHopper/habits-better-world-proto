/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, type Transition } from "motion/react";

export type OrganicShapeType = "leaf" | "flower" | "bird" | "tree" | "heart";

const paths: Record<OrganicShapeType, string> = {
  leaf: "M50 5 C75 20 85 50 50 95 C15 50 25 20 50 5 Z",
  flower:
    "M50 20 C55 5 70 5 70 20 C85 15 92 30 80 38 C95 42 92 58 78 58 C88 70 75 82 62 72 C60 88 40 88 38 72 C25 82 12 70 22 58 C8 58 5 42 20 38 C8 30 15 15 30 20 C30 5 45 5 50 20 Z",
  bird: "M10 55 C30 30 55 25 95 15 C70 25 65 35 75 45 C55 45 40 55 35 75 C30 62 22 55 10 55 Z",
  tree: "M50 5 L70 40 L60 40 L78 68 L64 68 L82 95 L18 95 L36 68 L22 68 L40 40 L30 40 Z",
  heart:
    "M50 90 C10 60 5 30 25 15 C40 5 50 20 50 30 C50 20 60 5 75 15 C95 30 90 60 50 90 Z",
};

interface OrganicShapeProps {
  shape: OrganicShapeType;
  color: string;
  className?: string;
  delay?: number;
  rotate?: number;
}

export default function OrganicShape({
  shape,
  color,
  className = "",
  delay = 0,
  rotate = 0,
}: OrganicShapeProps) {
  const transitionConfig: Transition = {
    duration: 3,
    delay,
    times: [0, 0.3, 1],
    ease: [0.16, 1, 0.3, 1],
    y: {
      duration: 3,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
      delay: delay + 0.6,
    },
  };

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ opacity: 0, scale: 0.3, y: 20, rotate: rotate - 30 }}
      animate={{
        opacity: [0, 1, 1],
        scale: [0.3, 1, 1],
        y: [20, 0, -6, 0],
        rotate: [rotate - 30, rotate, rotate],
      }}
      transition={transitionConfig}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill={color}>
        <path d={paths[shape]} />
      </svg>
    </motion.div>
  );
}
