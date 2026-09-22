/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import OrganicShape from "@/components/splash/OrganicShape";
import AnimatedLogo from "@/components/splash/AnimatedLogo";

interface SplashProps {
  onComplete?: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  let navigate: ReturnType<typeof useNavigate> | null = null;
  try {
    navigate = useNavigate();
  } catch {
    // Fallback if rendered outside of React Router context
  }

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    } else if (navigate) {
      navigate("/welcome");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleFinish();
    }, 4800);
    return () => clearTimeout(timer);
  }, []);

  const skip = () => handleFinish();

  return (
    <div className="fixed inset-0 bg-charcoal flex flex-col items-center justify-center overflow-hidden z-50">
      {/* Floating organic cut-out shapes */}
      <OrganicShape
        shape="leaf"
        color="#AFA625"
        className="top-[14%] left-[10%] w-14 h-14"
        delay={0.9}
        rotate={-18}
      />
      <OrganicShape
        shape="flower"
        color="#F48BAB"
        className="top-[18%] right-[12%] w-16 h-16"
        delay={1.15}
        rotate={12}
      />
      <OrganicShape
        shape="bird"
        color="#0285FF"
        className="bottom-[26%] left-[13%] w-16 h-16"
        delay={1.4}
        rotate={-8}
      />
      <OrganicShape
        shape="tree"
        color="#387667"
        className="bottom-[20%] right-[9%] w-14 h-14"
        delay={1.65}
        rotate={10}
      />
      <OrganicShape
        shape="heart"
        color="#EC6724"
        className="top-[32%] right-[20%] w-10 h-10"
        delay={1.9}
        rotate={-14}
      />

      {/* Discreet but visible skip */}
      <button
        onClick={skip}
        className="absolute top-10 right-5 flex items-center gap-0.5 pl-3 pr-2 py-1.5 rounded-full border border-pearl/25 text-pearl/70 hover:text-pearl hover:border-pearl/50 transition-colors z-20 font-body text-xs font-semibold tracking-wide cursor-pointer active:scale-95"
      >
        Skip
        <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>

      <div className="relative z-10 flex flex-col items-center px-8">
        <AnimatedLogo />

        <motion.p
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.6, ease: "easeOut" }}
          className="font-body text-sm text-pearl/55 mt-6 text-center"
        >
          One habit at a time.
        </motion.p>
      </div>

      <div className="absolute bottom-14 left-0 right-0 px-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="h-1 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto"
        >
          <motion.div
            className="h-full bg-azure rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4.8, ease: "linear" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
