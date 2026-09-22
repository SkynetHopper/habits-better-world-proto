/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Goal } from './types';
import OnboardingQuiz from './components/OnboardingQuiz';
import GoalRecommendations from './components/GoalRecommendations';
import DashboardSimulation from './components/DashboardSimulation';
import { getRecommendedGoals } from './data';
import AuthScreen from './components/AuthScreen';
import Splash from './components/splash/Splash';
import { AnimatePresence, motion } from 'motion/react';
import { BrowserRouter } from 'react-router-dom';
import { HabitProvider, useHabit } from './context/HabitContext';

function AppContent() {
  const {
    user,
    isGuest,
    isAuthLoading,
    loginUser,
    continueAsGuest,
    signOutUser,
    goToAuth,
    committedGoal,
    commitGoal,
    resetGoal,
    answers,
    updateAnswers,
    theme,
    toggleTheme
  } = useHabit();

  const [showSplash, setShowSplash] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<'quiz' | 'recommendations' | 'dashboard'>(() => {
    return committedGoal ? 'dashboard' : 'quiz';
  });

  // Automatically transition to dashboard if a committed goal becomes available
  React.useEffect(() => {
    if (committedGoal && currentPage === 'quiz' && (user || isGuest)) {
      setCurrentPage('dashboard');
    }
  }, [committedGoal, user, isGuest]);

  // Recommendation outputs
  const [topGoal, setTopGoal] = useState<Goal | null>(null);
  const [alternatives, setAlternatives] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasAI, setHasAI] = useState<boolean>(false);

  // Submit onboarding quiz to acquire dynamic recommendations offline with zero token cost
  const handleSubmitQuiz = async () => {
    setIsLoading(true);

    // Simulate a brief scientific evaluation step for premium UX feedback
    setTimeout(() => {
      try {
        const matched = getRecommendedGoals(answers);
        setTopGoal(matched.topGoal);
        setAlternatives(matched.alternatives);
        setHasAI(false); // Runs completely local & offline!
      } catch (err) {
        console.error('Error generating offline goals:', err);
      } finally {
        setIsLoading(false);
        setCurrentPage('recommendations');
      }
    }, 900);
  };

  const handleCommitGoal = (goal: Goal) => {
    commitGoal(goal);
    setCurrentPage('dashboard');
  };

  const handleResetQuiz = () => {
    setTopGoal(null);
    setAlternatives([]);
    resetGoal();
    setCurrentPage('quiz');
  };

  const handleBackFromQuiz = () => {
    if (committedGoal) {
      setCurrentPage('dashboard');
    } else {
      goToAuth();
    }
  };

  const handleSignOut = async () => {
    setCurrentPage('quiz');
    setTopGoal(null);
    setAlternatives([]);
    await signOutUser();
  };

  // Safe fallback to guarantee no blank screen renders
  const effectivePage = (currentPage === 'dashboard' && !committedGoal)
    ? 'quiz'
    : (currentPage === 'recommendations' && !topGoal)
    ? 'quiz'
    : currentPage;

  const isDarkCanvas = theme === 'dark';

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-[#F5F5F7] font-sans flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#0080FF]/30 border-t-[#0080FF] rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#98989D] uppercase tracking-widest">
            Synchronizing Ecosystem...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="app-launch-splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 pointer-events-auto"
          >
            <Splash onComplete={() => setShowSplash(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`min-h-screen w-full flex flex-col items-center justify-start transition-colors duration-300 ${
        isDarkCanvas ? 'bg-[#0A0A0C] text-[#F5F5F7]' : 'bg-[#F5F5F7] text-[#1C1C1E]'
      }`}>
        {/* Real Mobile App Viewport Container */}
        <div className={`w-full max-w-md min-h-screen flex flex-col flex-1 relative transition-colors duration-300 ${
          isDarkCanvas ? 'bg-[#0A0A0C] text-[#F5F5F7]' : 'bg-[#F5F5F7] text-[#1C1C1E]'
        }`}>
          <main className="flex-1 w-full h-full flex flex-col justify-start">
            {/* Show login/signup screen if no user and not choosing Guest mode */}
            {!user && !isGuest ? (
              <AuthScreen 
                onLoginSuccess={loginUser}
                onContinueAsGuest={continueAsGuest}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            ) : (
              <>
                {effectivePage === 'quiz' && (
                  <OnboardingQuiz
                    answers={answers}
                    setAnswers={updateAnswers}
                    onSubmit={handleSubmitQuiz}
                    isLoading={isLoading}
                    skipDemographics={!!user}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    onBackToWelcome={handleBackFromQuiz}
                  />
                )}

                {effectivePage === 'recommendations' && topGoal && (
                  <GoalRecommendations
                    answers={answers}
                    topGoal={topGoal}
                    alternatives={alternatives}
                    onCommit={handleCommitGoal}
                    onReset={handleResetQuiz}
                    hasAI={hasAI}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                  />
                )}

                {effectivePage === 'dashboard' && committedGoal && (
                  <DashboardSimulation
                    goal={committedGoal}
                    onReset={handleResetQuiz}
                    answers={answers}
                    onUpdateAnswers={updateAnswers}
                    user={user}
                    onSignOut={handleSignOut}
                    onOpenAuth={goToAuth}
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    onReplaySplash={() => setShowSplash(true)}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <HabitProvider>
        <AppContent />
      </HabitProvider>
    </BrowserRouter>
  );
}
