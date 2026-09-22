import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, ChevronLeft, Sun, Moon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HBWLogo from './HBWLogo';
import Splash from './splash/Splash';

interface AuthScreenProps {
  onLoginSuccess: (displayName: string, email: string) => void;
  onContinueAsGuest: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: (theme: 'dark' | 'light') => void;
}

export default function AuthScreen({ onLoginSuccess, onContinueAsGuest, theme = 'light', onToggleTheme }: AuthScreenProps) {
  const [view, setView] = useState<'splash' | 'welcome' | 'form'>('welcome');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const isDark = theme === 'dark';

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      onLoginSuccess('Nathan Nagy', 'nathan@habitsforabetterworld.org');
      setIsLoading(false);
    }, 400);
  };

  const handleAppleSignIn = () => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      onLoginSuccess('Apple User', 'alex.mercer@icloud.com');
      setIsLoading(false);
    }, 500);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (isSignUp && !displayName) {
      setError('Please enter your name');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Interactive Prototype authentication logic
    setTimeout(() => {
      try {
        if (isSignUp) {
          const registeredUsers = JSON.parse(localStorage.getItem('hbw_mock_users') || '{}');
          registeredUsers[email.toLowerCase()] = {
            displayName: displayName,
            password: password
          };
          localStorage.setItem('hbw_mock_users', JSON.stringify(registeredUsers));
          onLoginSuccess(displayName, email);
        } else {
          const registeredUsers = JSON.parse(localStorage.getItem('hbw_mock_users') || '{}');
          const matchedUser = registeredUsers[email.toLowerCase()];
          
          if (matchedUser) {
            if (matchedUser.password === password) {
              onLoginSuccess(matchedUser.displayName, email);
            } else {
              setError('Invalid password for this account.');
              setIsLoading(false);
            }
          } else {
            const derivedName = email.split('@')[0];
            const capitalizedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
            
            registeredUsers[email.toLowerCase()] = {
              displayName: capitalizedName,
              password: password
            };
            localStorage.setItem('hbw_mock_users', JSON.stringify(registeredUsers));
            onLoginSuccess(capitalizedName, email);
          }
        }
      } catch (err: any) {
        console.error(err);
        setError('Error completing authentication.');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleForgotPassword = () => {
    setForgotMsg('Password reset instructions sent to your email (if registered).');
    setTimeout(() => setForgotMsg(null), 4000);
  };

  return (
    <div className={`w-full max-w-md mx-auto flex-1 min-h-[100dvh] flex flex-col justify-between px-5 sm:px-6 py-6 relative select-none transition-colors duration-200 overflow-y-auto no-scrollbar ${
      isDark ? 'bg-[#0A0A0C] text-white' : 'bg-[#F5F5F7] text-[#1C1C1E]'
    }`}>
      {/* Decorative subtle ambient glows */}
      <div className="absolute top-[-40px] left-[-40px] w-48 h-48 rounded-full bg-[#0080FF]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 rounded-full bg-[#34C759]/5 blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {view === 'splash' ? (
          <motion.div
            key="splash-view"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="fixed inset-0 z-50"
          >
            <Splash onComplete={() => setView('welcome')} />
          </motion.div>
        ) : view === 'welcome' ? (
          /* =========================================================================
             SCREEN 1: WELCOME / BRAND LANDING GATEWAY
             ========================================================================= */
          <motion.div
            key="welcome-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col justify-between py-2 z-10"
          >
            {/* Top Bar with Quick Theme Toggle & Splash Replay */}
            <div className="w-full flex items-center justify-between pt-1 pb-1">
              <button
                type="button"
                onClick={() => setView('splash')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-sans font-medium transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isDark
                    ? 'bg-[#121214] border-[#1F1F24] text-[#8E8E93] hover:text-white hover:bg-[#1A1A1E]'
                    : 'bg-white border-[#E5E5EA] text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-[#F2F2F7]'
                }`}
                title="Replay Splash Screen"
              >
                <Sparkles className="w-3.5 h-3.5 text-azure" />
                <span>Splash Intro</span>
              </button>

              <button
                type="button"
                id="first-screen-theme-toggle"
                onClick={() => onToggleTheme?.(isDark ? 'light' : 'dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-sans font-medium transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isDark
                    ? 'bg-[#121214] border-[#1F1F24] text-[#F5F5F7] hover:bg-[#1A1A1E]'
                    : 'bg-white border-[#E5E5EA] text-[#1C1C1E] hover:bg-[#F2F2F7]'
                }`}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#0080FF]" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Top Brand Logo - Main Logo (Page 7: Preferred version when space allows) */}
            <div className="flex flex-col items-center pt-4 pb-4">
              <HBWLogo size="xl" variant="full" theme={isDark ? 'dark' : 'light'} />
            </div>

            {/* Editorial Hero Statement matching 1-welcome */}
            <div className="text-center px-2 my-auto">
              <h1 className={`text-[28px] sm:text-[32px] font-serif leading-[1.25] tracking-tight ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                Build <i className="italic font-serif font-normal">better</i> habits<br />with science.
              </h1>
            </div>

            {/* Action CTAs */}
            <div className="w-full flex flex-col gap-3 pt-6 pb-2">
              {/* Primary Login Pill Button */}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setView('form');
                  setError(null);
                }}
                className="w-full h-[52px] bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99] font-sans text-base font-semibold rounded-full text-white transition-all flex items-center justify-center cursor-pointer shadow-md"
              >
                <span>Login</span>
              </button>

              {/* Or Divider */}
              <div className="flex items-center justify-center my-0.5">
                <span className={`text-[12px] font-sans ${isDark ? 'text-[#6C6C70]' : 'text-[#8E8E93]'}`}>or</span>
              </div>

              {/* Social Login Options (Google & Apple) */}
              <div className="flex flex-col gap-2.5">
                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className={`w-full h-[48px] active:scale-[0.99] border font-sans text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs ${
                    isDark
                      ? 'bg-[#121214] hover:bg-[#1A1A1E] border-[#0080FF]/40 text-[#0080FF]'
                      : 'bg-white hover:bg-[#F2F2F7] border-[#0080FF]/40 text-[#0080FF]'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Continue with Apple */}
                <button
                  type="button"
                  onClick={handleAppleSignIn}
                  disabled={isLoading}
                  className={`w-full h-[48px] active:scale-[0.99] border font-sans text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs ${
                    isDark
                      ? 'bg-[#121214] hover:bg-[#1A1A1E] border-[#0080FF]/40 text-[#0080FF]'
                      : 'bg-white hover:bg-[#F2F2F7] border-[#0080FF]/40 text-[#0080FF]'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.59-7.71-11.72-14.01-6.19-9.46-10.99-19.98-14.4-31.57-3.41-11.59-5.12-22.95-5.12-34.08 0-14.7 3.58-26.96 10.74-36.78 7.16-9.82 16.29-14.87 27.39-15.15 4.8 0 10.12 1.25 15.96 3.76 5.84 2.5 9.4 3.82 10.68 3.96 1.45-.14 5.3-1.57 11.55-4.28 6.25-2.71 11.78-3.9 16.58-3.57 12.87 1.01 22.84 5.92 29.91 14.74-11.45 6.94-17.06 16.63-16.83 29.07.23 9.69 3.87 17.7 10.92 24.04 7.05 6.33 15.29 10.02 24.71 11.07-2.34 7.21-5.32 14.34-8.93 21.39zM119.22 31.84c0-7.39 2.66-14.28 7.98-20.67 5.32-6.39 11.95-10.28 19.89-11.67.23 1.23.35 2.35.35 3.35 0 7.39-2.78 14.4-8.34 21.03-5.56 6.63-12.35 10.42-20.37 11.38-.23-1.12-.35-2.26-.35-3.42z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>

              {/* Prominent Guest Mode Button */}
              <button
                type="button"
                onClick={onContinueAsGuest}
                className={`w-full h-[46px] active:scale-[0.99] border font-sans text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-1 ${
                  isDark
                    ? 'bg-[#121214] hover:bg-[#1A1A1E] border-[#2C2C30] text-[#98989D] hover:text-white'
                    : 'bg-white hover:bg-[#F2F2F7] border-[#E5E5EA] text-[#6C6C70] hover:text-[#1C1C1E]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#0080FF]" />
                <span>Continue as Guest (Explore Prototype)</span>
              </button>

              {/* Footer Terms Note */}
              <p className={`text-[11px] font-sans text-center mt-2 leading-tight ${
                isDark ? 'text-[#6C6C70]' : 'text-[#8E8E93]'
              }`}>
                By signing up, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </motion.div>
        ) : (
          /* =========================================================================
             SCREEN 2: SEAMLESS LOGIN / SIGN-UP FORM VIEW
             ========================================================================= */
          <motion.div
            key="form-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col justify-between py-1 z-10"
          >
            {/* Top Navigation Bar with Back Arrow and Logo */}
            <div className="flex items-center justify-between pt-2 pb-4">
              <button
                type="button"
                onClick={() => {
                  setView('welcome');
                  setError(null);
                }}
                className={`p-1.5 -ml-2 rounded-full transition-colors cursor-pointer ${
                  isDark ? 'text-[#8E8E93] hover:text-white hover:bg-[#1A1A1E]' : 'text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-[#E5E5EA]'
                }`}
                aria-label="Back to welcome"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <HBWLogo size="sm" variant="horizontal" theme={isDark ? 'dark' : 'light'} />

              {/* Theme toggle in Form View */}
              <button
                type="button"
                onClick={() => onToggleTheme?.(isDark ? 'light' : 'dark')}
                className={`p-1.5 -mr-1 rounded-full transition-all cursor-pointer ${
                  isDark ? 'text-[#98989D] hover:text-white hover:bg-[#1F1F24]' : 'text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-[#E5E5EA]'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0080FF]" />}
              </button>
            </div>

            {/* Form Headline */}
            <div className="mb-4">
              <h2 className={`text-2xl sm:text-3xl font-serif tracking-tight ${
                isDark ? 'text-white' : 'text-[#1C1C1E]'
              }`}>
                {isSignUp ? (
                  <>Create an <i className="italic font-serif font-normal">account</i>.</>
                ) : (
                  <>Welcome <i className="italic font-serif font-normal">back</i>.</>
                )}
              </h2>
              <p className={`text-xs font-sans mt-1 ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                {isSignUp ? 'Enter your details to begin your habit pathway.' : 'Enter your credentials to access your daily habits.'}
              </p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleAuth} className="flex flex-col gap-3.5 my-auto">
              {/* Display Name (Only on Sign Up) */}
              {isSignUp && (
                <div className="space-y-1">
                  <label className={`text-xs font-semibold block px-1 ${isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                    <input
                      type="text"
                      placeholder="Alex Mercer"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className={`w-full h-[48px] pl-10 pr-4 rounded-[14px] text-sm outline-none transition-all border ${
                        isDark
                          ? 'bg-[#121214] border-[#1F1F24] text-white placeholder-[#6C6C70] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                          : 'bg-white border-[#E5E5EA] text-[#1C1C1E] placeholder-[#8E8E93] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                      }`}
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1">
                <label className={`text-xs font-semibold block px-1 ${isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                  <input
                    type="email"
                    placeholder="alex@hbw.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-[48px] pl-10 pr-4 rounded-[14px] text-sm outline-none transition-all border ${
                      isDark
                        ? 'bg-[#121214] border-[#1F1F24] text-white placeholder-[#6C6C70] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                        : 'bg-white border-[#E5E5EA] text-[#1C1C1E] placeholder-[#8E8E93] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                    }`}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1">
                  <label className={`text-xs font-semibold ${isDark ? 'text-[#8E8E93]' : 'text-[#6C6C70]'}`}>
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] text-[#0080FF] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-[48px] pl-10 pr-10 rounded-[14px] text-sm outline-none transition-all border ${
                      isDark
                        ? 'bg-[#121214] border-[#1F1F24] text-white placeholder-[#6C6C70] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                        : 'bg-white border-[#E5E5EA] text-[#1C1C1E] placeholder-[#8E8E93] hover:border-[#0080FF]/40 focus:border-[#0080FF]'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 focus:outline-none cursor-pointer ${
                      isDark ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                    }`}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot notification */}
              {forgotMsg && (
                <div className="p-2.5 bg-[#0080FF]/15 border border-[#0080FF]/30 text-[#0080FF] text-xs rounded-xl">
                  {forgotMsg}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-[12px] flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit CTA Pill */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] mt-2 bg-[#0080FF] hover:bg-[#0066CC] active:scale-[0.99] disabled:bg-[#A0C8FF] font-sans text-sm font-semibold rounded-full text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Account' : 'Continue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Mode Switch & Guest Bypass */}
            <div className="flex flex-col items-center gap-3 pt-3">
              <p className={`text-xs font-sans ${isDark ? 'text-[#98989D]' : 'text-[#6C6C70]'}`}>
                {isSignUp ? 'Already have an account?' : 'Don’t have an account?'}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                  }}
                  className="text-[#0080FF] font-semibold hover:underline ml-1 cursor-pointer"
                >
                  {isSignUp ? 'Log In' : 'Sign Up'}
                </button>
              </p>

              <button
                type="button"
                onClick={onContinueAsGuest}
                className={`text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isDark ? 'text-[#6C6C70] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0080FF]" />
                <span>Or explore as Guest</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

