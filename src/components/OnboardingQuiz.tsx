import React, { useState } from 'react';
import { QuizAnswers, Category } from '../types';
import { Leaf, Users, Brain, Bot, Compass, ChevronLeft, Edit3, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HBWLogo from './HBWLogo';

interface OnboardingQuizProps {
  answers: QuizAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<QuizAnswers>>;
  onSubmit: () => void;
  isLoading: boolean;
  skipDemographics?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: (theme: 'dark' | 'light') => void;
  onBackToWelcome?: () => void;
}

export default function OnboardingQuiz({ answers, setAnswers, onSubmit, isLoading, skipDemographics = false, theme = 'light', onToggleTheme, onBackToWelcome }: OnboardingQuizProps) {
  const [step, setStep] = useState<number>(skipDemographics ? 2 : 1);
  const isDark = theme === 'dark';

  // Validate step inputs: step 2 is valid if 1 category is selected OR custom path is chosen
  const isStep1Valid = answers.age.trim() !== '' && answers.gender !== '';
  const isCustomSelected = !!answers.isCustomPath;
  const isStep2Valid = ((answers.categories && answers.categories.length === 1) || isCustomSelected);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1 && !skipDemographics) {
      setStep(1);
    } else if (onBackToWelcome) {
      onBackToWelcome();
    }
  };

  const handleSkip = () => {
    if (step === 1) {
      // Provide standard baseline demographics and advance to step 2
      setAnswers(prev => ({
        ...prev,
        age: prev.age || '25–34',
        gender: prev.gender || 'Prefer not to say'
      }));
      setStep(2);
    } else {
      // Provide standard baseline category if not selected, and submit
      if (!answers.categories || answers.categories.length === 0) {
        setAnswers(prev => ({
          ...prev,
          categories: ['Environment'],
          isCustomPath: false
        }));
      }
      onSubmit();
    }
  };

  const handleSelectCategory = (categoryName: Category) => {
    setAnswers({
      ...answers,
      categories: [categoryName],
      isCustomPath: false
    });
  };

  const handleSelectCustomPath = () => {
    setAnswers({
      ...answers,
      categories: [],
      isCustomPath: true
    });
  };

  const ageRanges = ['Under 18', '18–24', '25–34', '35–44', '45+'];
  const genderOptions = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];

  // Categories in exact order and copy matching screenshot & user request
  const categories: { name: Category; title: string; description: string; icon: React.ReactNode }[] = [
    {
      name: 'Compassion',
      title: 'Compassion',
      description: 'Cultivate empathy & kindness for humans and animals',
      icon: <Users className="w-6 h-6 stroke-[1.75]" />
    },
    {
      name: 'Environment',
      title: 'Environment',
      description: 'Reduce your impact on the planet',
      icon: <Leaf className="w-6 h-6 stroke-[1.75]" />
    },
    {
      name: 'Responsible AI',
      title: 'Responsible AI',
      description: 'Foster an optimal & symbiotic relationship with AI',
      icon: <Bot className="w-6 h-6 stroke-[1.75]" />
    },
    {
      name: 'Well-Being',
      title: 'Wellbeing',
      description: 'Improve mental, physical, & social health',
      icon: <Brain className="w-6 h-6 stroke-[1.75]" />
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto px-4 py-5 flex flex-col justify-between min-h-[100dvh]">
      {/* Top Header with Back button, centered HBW Logo, Skip button & Theme toggle */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <button
          type="button"
          id="quiz-top-back-btn"
          onClick={handleBack}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-colors cursor-pointer ${
            isDark ? 'text-[#8E8E93] hover:text-white hover:bg-[#1F1F24]' : 'text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-[#E5E5EA]'
          }`}
          aria-label="Go back"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-semibold">Back</span>
        </button>

        {/* Centered Brand Logo */}
        <div className="flex items-center justify-center">
          <HBWLogo size="md" variant="full" theme={isDark ? 'dark' : 'light'} />
        </div>

        {/* Right Action Group: Skip Button & Theme Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="quiz-top-skip-btn"
            onClick={handleSkip}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              isDark
                ? 'bg-[#121214] border-[#1F1F24] text-[#8E8E93] hover:text-white hover:border-[#2C2C30]'
                : 'bg-white border-[#E5E5EA] text-[#6C6C70] hover:text-[#1C1C1E] hover:border-[#D1D1D6] shadow-2xs'
            }`}
          >
            Skip
          </button>

          <button
            type="button"
            onClick={() => onToggleTheme?.(isDark ? 'light' : 'dark')}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              isDark ? 'text-[#98989D] hover:text-white hover:bg-[#1F1F24]' : 'text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-[#E5E5EA]'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0080FF]" />}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-1.5">
              <h2 className={`text-2xl font-serif font-normal tracking-tight sm:text-3xl ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                A little about <i className="italic font-serif">you</i>.
              </h2>
              <p className={`text-sm font-sans leading-relaxed ${
                isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                This helps us recommend habits and communities that fit you.
              </p>
            </div>

            {/* Age range selection */}
            <div className="space-y-2.5">
              <label className={`text-xs font-semibold tracking-wide ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                What is your age range?
              </label>
              <div className="flex flex-wrap gap-2">
                {ageRanges.map((range) => {
                  const isSelected = answers.age === range || (answers.age && range.includes(answers.age));
                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setAnswers({ ...answers, age: range })}
                      className={`h-[38px] px-4 rounded-full font-sans text-xs sm:text-sm transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#0080FF] text-white font-semibold shadow-xs'
                          : isDark
                          ? 'bg-[#121214] border border-[#1F1F24] text-white hover:border-[#0080FF]/50 font-medium'
                          : 'bg-white border border-[#E5E5EA] text-[#1C1C1E] hover:border-[#0080FF]/50 font-medium shadow-2xs'
                      }`}
                    >
                      {range}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender options */}
            <div className="space-y-2.5">
              <label className={`text-xs font-semibold tracking-wide ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                Select Gender
              </label>
              <div className="flex flex-wrap gap-2">
                {genderOptions.map((g) => {
                  const isSelected = answers.gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setAnswers({ ...answers, gender: g })}
                      className={`h-[38px] px-4 rounded-full font-sans text-xs sm:text-sm transition-all flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#0080FF] text-white font-semibold shadow-xs'
                          : isDark
                          ? 'bg-[#121214] border border-[#1F1F24] text-white hover:border-[#0080FF]/50 font-medium'
                          : 'bg-white border border-[#E5E5EA] text-[#1C1C1E] hover:border-[#0080FF]/50 font-medium shadow-2xs'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Preserved h2 and p exactly as instructed */}
            <div className="space-y-1.5">
              <h2 className={`text-2xl font-serif font-normal tracking-tight sm:text-3xl ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                How would you like to make an <i className="italic font-serif">impact?</i>
              </h2>
              <p className={`text-sm font-sans leading-relaxed ${
                isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
              }`}>
                Pick an area you'd like to build habits around.
              </p>
            </div>

            {/* Category Cards matching the attached screen design */}
            <div className="flex flex-col gap-3">
              {categories.map((c) => {
                const isSelected = !isCustomSelected && (answers.categories || []).includes(c.name);
                return (
                  <button
                    key={c.name}
                    id={`category-btn-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleSelectCategory(c.name)}
                    type="button"
                    className={`w-full rounded-[22px] p-4 sm:p-4.5 text-left transition-all duration-200 flex items-center justify-between gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#0080FF] bg-white dark:bg-[#121214] shadow-sm'
                        : isDark
                        ? 'border border-[#1F1F24] hover:border-[#2C2C30] bg-[#121214] text-white'
                        : 'border border-[#E5E5EA] hover:border-[#D1D1D6] bg-white text-[#1C1C1E] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      {/* Squircle Icon Container matching screenshot */}
                      <div
                        className={`w-13 h-13 sm:w-14 sm:h-14 rounded-[16px] flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#0080FF]/10 text-[#0080FF]'
                            : isDark
                            ? 'bg-[#1C1C22] text-[#98989D]'
                            : 'bg-[#F2F4F8] text-[#6C727F]'
                        }`}
                      >
                        {c.icon}
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1 pr-1">
                        <h3 className={`text-[17px] sm:text-[18px] font-sans font-bold leading-snug tracking-tight ${
                          isDark ? 'text-white' : 'text-[#1C1C1E]'
                        }`}>
                          {c.title}
                        </h3>
                        <p className={`text-[13px] sm:text-[14px] font-sans leading-snug ${
                          isDark ? 'text-[#98989D]' : 'text-[#6C727F]'
                        }`}>
                          {c.description}
                        </p>
                      </div>
                    </div>

                    {/* Radio circle matching screenshot */}
                    <div className="shrink-0 pl-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-2 border-[#0080FF] bg-transparent'
                            : isDark
                            ? 'border-2 border-[#3A3A3C] bg-transparent'
                            : 'border-2 border-[#D1D1D6] bg-transparent'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-[#0080FF]" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Custom Pathway Option matching visual design */}
              <div
                id="custom-path-btn"
                onClick={handleSelectCustomPath}
                className={`w-full rounded-[22px] p-4 sm:p-4.5 text-left transition-all duration-200 flex flex-col gap-3 cursor-pointer ${
                  isCustomSelected
                    ? 'border-2 border-[#0080FF] bg-white dark:bg-[#121214] shadow-sm'
                    : isDark
                    ? 'border-2 border-dashed border-[#2C2C30] hover:border-[#0080FF]/50 bg-[#121214]/70 text-white'
                    : 'border-2 border-dashed border-[#D1D1D6] hover:border-[#0080FF]/50 bg-white/70 text-[#1C1C1E] shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3.5 w-full">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-13 h-13 sm:w-14 sm:h-14 rounded-[16px] flex items-center justify-center shrink-0 transition-colors ${
                        isCustomSelected
                          ? 'bg-[#0080FF]/10 text-[#0080FF]'
                          : isDark
                          ? 'bg-[#1C1C22] text-[#98989D]'
                          : 'bg-[#F2F4F8] text-[#6C727F]'
                      }`}
                    >
                      <Compass className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1 pr-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-[17px] sm:text-[18px] font-sans font-bold leading-snug tracking-tight ${
                          isDark ? 'text-white' : 'text-[#1C1C1E]'
                        }`}>
                          I want to make my own path
                        </h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isCustomSelected
                            ? 'bg-[#0080FF]/15 text-[#0080FF] font-semibold'
                            : isDark
                            ? 'bg-[#1F1F24] text-[#8E8E93]'
                            : 'bg-[#F2F2F7] text-[#8E8E93]'
                        }`}>
                          Custom
                        </span>
                      </div>
                      <p className={`text-[13px] sm:text-[14px] font-sans leading-snug ${
                        isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'
                      }`}>
                        Design a personalized habit tailored to your goals
                      </p>
                    </div>
                  </div>

                  {/* Radio selector for custom pathway */}
                  <div className="shrink-0 pl-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isCustomSelected
                          ? 'border-2 border-[#0080FF] bg-transparent'
                          : isDark
                          ? 'border-2 border-[#3A3A3C] bg-transparent'
                          : 'border-2 border-[#D1D1D6] bg-transparent'
                      }`}
                    >
                      {isCustomSelected && (
                        <div className="w-3 h-3 rounded-full bg-[#0080FF]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Animated expandable custom goal field when selected */}
                <AnimatePresence>
                  {isCustomSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pt-2.5 border-t border-[#E5E5EA] dark:border-[#1F1F24] flex flex-col gap-1.5 w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <label className="text-xs font-semibold text-[#0080FF] flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Name your custom habit (optional)</span>
                      </label>
                      <input
                        type="text"
                        value={answers.customGoalTitle || ''}
                        onChange={(e) => setAnswers({ ...answers, customGoalTitle: e.target.value })}
                        placeholder="e.g., 15-minute digital sunset, zero-waste commute..."
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm border transition-all ${
                          isDark
                            ? 'bg-[#1C1C22] border-[#2C2C30] text-white placeholder-[#8E8E93] focus:border-[#0080FF]'
                            : 'bg-[#F9F9FB] border-[#E5E5EA] text-[#1C1C1E] placeholder-[#8E8E93] focus:border-[#0080FF]'
                        } focus:outline-none`}
                      />
                      <span className="text-[11px] text-[#8E8E93]">
                        We will calibrate a full 90-day plan and context anchors around this goal.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation footer with step dots, Back/Continue row, and Skip button */}
      <div className="mt-8 flex flex-col items-center gap-3.5">
        {/* Step dots indicator matching screenshot • • • • */}
        <div className="flex items-center justify-center gap-1.5">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${
            step === 1 ? 'w-5 bg-[#0080FF]' : isDark ? 'w-1.5 bg-[#3A3A3C]' : 'w-1.5 bg-[#D1D1D6]'
          }`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${
            step === 2 ? 'w-5 bg-[#0080FF]' : isDark ? 'w-1.5 bg-[#3A3A3C]' : 'w-1.5 bg-[#D1D1D6]'
          }`} />
          <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#3A3A3C]' : 'bg-[#D1D1D6]'}`} />
          <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#3A3A3C]' : 'bg-[#D1D1D6]'}`} />
        </div>

        {/* Primary Action Row: Back & Continue */}
        <div className="w-full flex items-center gap-3">
          <button
            type="button"
            id="quiz-bottom-back-btn"
            onClick={handleBack}
            className={`h-[52px] px-5 font-sans font-semibold text-sm rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer border shrink-0 ${
              isDark
                ? 'bg-[#121214] border-[#1F1F24] text-[#98989D] hover:text-white hover:bg-[#1A1A1E]'
                : 'bg-white border-[#E5E5EA] text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-[#F2F2F7] shadow-2xs'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            id="next-btn"
            onClick={handleNext}
            disabled={
              isLoading ||
              (step === 1 && !isStep1Valid) ||
              (step === 2 && !isStep2Valid)
            }
            className={`flex-1 h-[52px] font-sans font-semibold text-base text-white rounded-full transition-all flex items-center justify-center cursor-pointer shadow-md ${
              isLoading ||
              (step === 1 && !isStep1Valid) ||
              (step === 2 && !isStep2Valid)
                ? isDark
                  ? 'bg-[#121214] border border-[#1F1F24] cursor-not-allowed text-[#636366]'
                  : 'bg-[#E5E5EA] cursor-not-allowed text-[#8E8E93]'
                : 'bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Building Plan...</span>
              </div>
            ) : (
              <span>Continue</span>
            )}
          </button>
        </div>

        {/* Dedicated Skip Button in Footer */}
        <button
          type="button"
          id="quiz-bottom-skip-btn"
          onClick={handleSkip}
          className={`text-xs font-sans font-semibold py-1 px-3 rounded-full transition-all cursor-pointer hover:underline ${
            isDark ? 'text-[#8E8E93] hover:text-white' : 'text-[#6C6C70] hover:text-[#1C1C1E]'
          }`}
        >
          {step === 1 ? 'Skip demographics' : 'Skip & view recommended habits'}
        </button>
      </div>
    </div>
  );
}


