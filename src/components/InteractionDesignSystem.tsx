/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Smartphone, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Activity, 
  ShieldCheck, 
  Bell, 
  Zap, 
  Users, 
  Heart, 
  FileText, 
  Clock, 
  RefreshCw, 
  ChevronRight, 
  ChevronDown, 
  Info, 
  Code, 
  Check, 
  Compass, 
  Eye, 
  Layout, 
  Watch, 
  Lock, 
  X,
  Target,
  CornerDownRight,
  MousePointer,
  HelpCircle,
  Download,
  Sun,
  Moon,
  ChevronLeft,
  Home,
  TrendingUp,
  User,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import HBWLogo from './HBWLogo';
import AuthScreen from './AuthScreen';
import OnboardingQuiz from './OnboardingQuiz';
import GoalRecommendations from './GoalRecommendations';
import HomeTab from './dashboard/HomeTab';
import CommunityChat from './CommunityChat';
import ProgressTab from './dashboard/ProgressTab';
import ProfileTab from './dashboard/ProfileTab';
import HabitsManager from './HabitsManager';
import SmartAlerts from './SmartAlerts';
import SmartwatchSimulator from './SmartwatchSimulator';
import OverflowSettingsMenu from './dashboard/OverflowSettingsMenu';
import { Goal, QuizAnswers } from '../types';
import { TOP_IMPACT_GOALS, STATIC_GOALS } from '../data';

export interface VisualCallout {
  id: string;
  badgeNumber: number;
  title: string;
  elementName: string;
  side: 'left' | 'right';
  targetYPercent: number; // 0 to 100% position on the phone screen
  description: string;
  technicalType: string;
}

export interface ScreenInteractionSpec {
  id: string;
  number: string;
  name: string;
  category: 'Access & Onboarding' | 'Core Daily Execution' | 'Community & Circles' | 'Gamification & Analytics' | 'Management & Settings' | 'Multi-Device Companion';
  componentPath: string;
  purpose: string;
  primaryCTA: {
    label: string;
    actionDescription: string;
    stateChange: string;
    destinationScreen: string;
  };
  appearsContext: {
    how: string;
    when: string;
    where: string;
  };
  callouts: VisualCallout[];
}

// Sample mock data for live interactive screen rendering
const MOCK_ANSWERS: QuizAnswers = {
  age: '25–34',
  gender: 'Female',
  categories: ['Environment'],
  primaryConstraint: ['Time constraints & busy schedule']
};

const MOCK_GOAL: Goal = {
  ...TOP_IMPACT_GOALS['Environment'],
  selectedOption: TOP_IMPACT_GOALS['Environment'].implementationOptions[0]
};

const MOCK_USER = {
  uid: 'hbw-demo-user-123',
  displayName: 'Olympia Datta',
  email: 'olympia@example.org',
  createdAt: '2026-08-17'
};

export const SCREEN_INTERACTION_SPECS: ScreenInteractionSpec[] = [
  {
    id: 'scr-auth',
    number: '01',
    name: 'Authentication & Access Gateway',
    category: 'Access & Onboarding',
    componentPath: 'src/components/AuthScreen.tsx',
    purpose: 'Provide frictionless, secure user entry through email/password credentials, 1-tap Google & Apple OAuth sign-in popups with automatic sandbox fallback, and instantaneous offline Guest Mode access.',
    primaryCTA: {
      label: 'Continue with Google / Apple (or Sign In / Guest)',
      actionDescription: 'Authenticates member credentials via Apple Sign-In, 1-tap Google Sign-In, Native Local Authentication, or bypasses with instantaneous offline Guest Mode.',
      stateChange: 'Sets `user` in HabitContext and transitions `effectivePage` from Auth -> Onboarding Quiz.',
      destinationScreen: 'SCR-02: Demographics Assessment'
    },
    appearsContext: {
      how: 'Conditionally rendered when no active user session exists (`user === null && !isGuest`).',
      when: 'On first application boot or after tapping "Sign Out" in Profile settings.',
      where: 'Root Device Frame Container (`DeviceSimulator.tsx`).'
    },
    callouts: [
      {
        id: 'c1',
        badgeNumber: 1,
        title: 'HBW Brand Emblem & Identity',
        elementName: 'Scalable Double-Ring Logo',
        side: 'left',
        targetYPercent: 12,
        description: 'Centered SVG brand mark signifying individual and planetary wellbeing with clean circular geometry.',
        technicalType: 'Vector SVG Component'
      },
      {
        id: 'c2',
        badgeNumber: 2,
        title: 'Editorial Hero Statement',
        elementName: 'Serif Brand Headline',
        side: 'right',
        targetYPercent: 32,
        description: 'High-contrast typography proclaiming "Build better habits with science" with italicized emphasis.',
        technicalType: 'Typography Display Element'
      },
      {
        id: 'c3',
        badgeNumber: 3,
        title: 'Primary Login Pill CTA',
        elementName: 'Solid Accent Action Button',
        side: 'left',
        targetYPercent: 54,
        description: 'Electric blue pill button providing 1-tap transition to the streamlined credential login form.',
        technicalType: 'Interactive Button CTA'
      },
      {
        id: 'c4',
        badgeNumber: 4,
        title: 'Google & Apple Social OAuth',
        elementName: 'Dual Social Sign-In Pills',
        side: 'right',
        targetYPercent: 70,
        description: '1-tap native OAuth integrations for Google and Apple accounts with fallback preview simulation.',
        technicalType: 'Social Auth Providers'
      },
      {
        id: 'c5',
        badgeNumber: 5,
        title: 'Prominent Offline Guest Sandbox Mode',
        elementName: 'Instant Sandbox Bypass CTA',
        side: 'left',
        targetYPercent: 86,
        description: 'Provides instantaneous access to full app features and local sandbox state without requiring an account.',
        technicalType: 'Offline Local Session'
      }
    ]
  },
  {
    id: 'scr-quiz-step1',
    number: '02',
    name: 'Demographics & Baseline Diagnostics',
    category: 'Access & Onboarding',
    componentPath: 'src/components/OnboardingQuiz.tsx (Step 1)',
    purpose: 'Calibrate baseline demographic markers (Age bracket and Gender identity) to personalize scientific habit recommendations and demographic peer cohort comparisons.',
    primaryCTA: {
      label: 'Continue to Focus Areas',
      actionDescription: 'Validates selections and advances the quiz to Step 2 systemic pillar diagnostics.',
      stateChange: 'Mutates `answers.age` and `answers.gender` in HabitContext, sets `step = 2`.',
      destinationScreen: 'SCR-03: Systemic Impact Pillar Diagnostics'
    },
    appearsContext: {
      how: 'Rendered when `effectivePage === "quiz"` and internal quiz step is 1.',
      when: 'Immediately following login/guest authentication, or when "Retake Assessment" is clicked.',
      where: 'Root Device Frame Container.'
    },
    callouts: [
      {
        id: 'c1',
        badgeNumber: 1,
        title: 'Step 1 Progress & Privacy Indicator',
        elementName: 'Diagnostic Header Badge',
        side: 'left',
        targetYPercent: 12,
        description: 'Displays "Step 1 of 2" badge to calibrate user expectation with subtitle explaining local-first diagnostic calibration.',
        technicalType: 'Progress Pill Badge'
      },
      {
        id: 'c2',
        badgeNumber: 2,
        title: 'Age Bracket Radio Selector Cards',
        elementName: '5 Selectable Age Bands',
        side: 'right',
        targetYPercent: 36,
        description: 'Selectable cards ("Under 18" to "45+") with active blue borders and checkmark badge on selection.',
        technicalType: 'Card Radio Group'
      },
      {
        id: 'c3',
        badgeNumber: 3,
        title: 'Inclusive Gender Identity Pills',
        elementName: '4 Gender Options',
        side: 'left',
        targetYPercent: 64,
        description: 'Options ("Female", "Male", "Non-binary", "Prefer not to say") styled with 44px touch targets.',
        technicalType: 'Pill Group Selector'
      },
      {
        id: 'c4',
        badgeNumber: 4,
        title: 'Next Step Progression CTA',
        elementName: 'Continue to Focus Areas Button',
        side: 'right',
        targetYPercent: 88,
        description: 'Remains disabled at 40% opacity until both age and gender are chosen, preventing invalid diagnostic submissions.',
        technicalType: 'Stateful Primary CTA'
      }
    ]
  },
  {
    id: 'scr-quiz-step2',
    number: '03',
    name: 'Systemic Impact Pillar Diagnostics',
    category: 'Access & Onboarding',
    componentPath: 'src/components/OnboardingQuiz.tsx (Step 2)',
    purpose: 'Identify the user\'s primary transformational impact pillar (Environment, Wellbeing, Responsible AI, or Compassion) or create a custom pathway to compute the top recommended habit pathway.',
    primaryCTA: {
      label: 'Continue / Generate 3-Month Plan',
      actionDescription: 'Executes the deterministic recommendation engine and advances to the 3-month strategy view.',
      stateChange: 'Sets `isLoading: true` (900ms evaluation) -> populates `topGoal` & `alternatives` -> routes to `recommendations`.',
      destinationScreen: 'SCR-04: Personalized 3-Month Strategy'
    },
    appearsContext: {
      how: 'Rendered when `effectivePage === "quiz"` and internal quiz step is 2.',
      when: 'Step 2 of the Onboarding Quiz journey.',
      where: 'Root Device Frame Container.'
    },
    callouts: [
      {
        id: 'c1',
        badgeNumber: 1,
        title: 'Back Navigation Arrow & HBW Emblem',
        elementName: 'Header ChevronLeft & Logo',
        side: 'left',
        targetYPercent: 6,
        description: 'Enables quick return to Step 1 demographics without resetting or losing previously selected data.',
        technicalType: 'Navigation Icon Button'
      },
      {
        id: 'c2',
        badgeNumber: 2,
        title: '4 Systemic Impact Pillar Rows',
        elementName: 'Interactive Category Rows',
        side: 'right',
        targetYPercent: 38,
        description: 'Environment (#387667), Wellbeing (#f48bab), Responsible AI (#603a51), and Compassion (#ec6724) with custom vector icons and radio selectors.',
        technicalType: 'Interactive Row Group'
      },
      {
        id: 'c3',
        badgeNumber: 3,
        title: 'Custom Pathway Option',
        elementName: 'Make My Own Path Card',
        side: 'left',
        targetYPercent: 68,
        description: 'Dashed action card allowing users to define custom habits and personal trajectories outside standard tracks.',
        technicalType: 'Custom Path Trigger'
      },
      {
        id: 'c4',
        badgeNumber: 4,
        title: 'Evaluation Action CTA',
        elementName: 'Continue / Generate 3-Month Plan Button',
        side: 'right',
        targetYPercent: 92,
        description: 'Full-width rounded-full pill button triggering recommendation computation with loading spinner and arrow icon.',
        technicalType: 'Async Submit Action'
      }
    ]
  },
  {
    id: 'scr-recommendations',
    number: '04',
    name: 'Personalized 3-Month Strategy & Commitment',
    category: 'Access & Onboarding',
    componentPath: 'src/components/GoalRecommendations.tsx',
    purpose: 'Deliver the scientifically calibrated high-impact habit, customize dosage intensity tiers (Minimal, Standard, Stretch), set daily routine anchors, and commit to the 90-day trajectory.',
    primaryCTA: {
      label: 'Commit to This 90-Day Plan',
      actionDescription: 'Commits the chosen habit to global state, initializes the 90-day streak tracker, and launches the active dashboard.',
      stateChange: 'Invokes `commitGoal(topGoal)` in HabitContext, persists to `localStorage`, navigates to `dashboard`.',
      destinationScreen: 'SCR-05: Daily Habit Execution Hub (Home Tab)'
    },
    appearsContext: {
      how: 'Rendered when `effectivePage === "recommendations"` and topGoal is calculated.',
      when: 'Immediately following assessment completion.',
      where: 'Root Device Frame Container.'
    },
    callouts: [
      {
        id: 'c1',
        badgeNumber: 1,
        title: 'Top Impact Strategy Hero Card',
        elementName: 'Primary Habit Callout Card',
        side: 'left',
        targetYPercent: 20,
        description: 'Displays the highest-impact habit title, pillar category badge, and evidence-based clinical rationale.',
        technicalType: 'Hero Strategy Card'
      },
      {
        id: 'c2',
        badgeNumber: 2,
        title: '3-Tier Dosage Intensity Selector',
        elementName: 'Dosage Radio Options',
        side: 'right',
        targetYPercent: 42,
        description: 'Selectable dosages (Minimal Dose: 1-2 min, Standard Habit: 5 min, Stretch: 15 min) for scalable commitment.',
        technicalType: 'Dosage Tier Selector'
      },
      {
        id: 'c3',
        badgeNumber: 3,
        title: 'Daily Schedule Anchor Accordion',
        elementName: 'Implementation Intentions Drawer',
        side: 'left',
        targetYPercent: 58,
        description: 'Expandable drawer configuring BJ Fogg habit stacking routine anchor ("After I [anchor], I will [habit]").',
        technicalType: 'Expandable Drawer'
      },
      {
        id: 'c5',
        badgeNumber: 5,
        title: 'Commit to 90-Day Plan Action',
        elementName: 'Commitment CTA Button',
        side: 'right',
        targetYPercent: 78,
        description: 'Locks in the selected habit and transitions the interface directly into the daily execution dashboard.',
        technicalType: 'Primary Commitment CTA'
      },
      {
        id: 'c4',
        badgeNumber: 4,
        title: 'Alternative Pillar Swap Strip',
        elementName: '1-Tap Pillar Swap Cards',
        side: 'left',
        targetYPercent: 90,
        description: 'Enables instant switching to top habits from other pillars without needing to retake the onboarding quiz.',
        technicalType: 'Horizontal Carousel'
      }
    ]
  },
  {
    id: 'scr-dashboard-home',
    number: '05',
    name: 'Branded Habit Execution Hub (SCR-05: 3-Phase Dashboard)',
    category: 'Core Daily Execution',
    componentPath: 'src/components/dashboard/HomeTab.tsx',
    purpose: 'Central daily operational center supporting the 3 brand dashboard versions: Phase 2 (Today\'s Micro-Habits with week calendar strip), Phase 3 (7-Day Challenges & +50 XP Achievements), and Phase 4 (Show Up Together real-time digital/offline events with RSVP).',
    primaryCTA: {
      label: 'Complete Micro-Habit (Confetti & Hydration Reaction)',
      actionDescription: 'Checking off any micro-habit triggers a lite confetti celebration and opens an overlay modal with the Habit energy - hydration ecosystem visualization from SCR-07 showing floating rain clouds ready to pop.',
      stateChange: 'Spawns floating rain cloud (+15g Habit Energy), increments energy upon pop, triggers rainfall animation to plant, and provides direct routing to SCR-07.',
      destinationScreen: 'Hydration Ecosystem Overlay Modal & SCR-07 Progress Tab'
    },
    appearsContext: {
      how: 'Rendered when `effectivePage === "dashboard"` and `activeTab === "home"`.',
      when: 'Primary landing view for returning users.',
      where: 'Mobile App Viewport within Device Simulator.'
    },
    callouts: [
      {
        id: 'c1',
        badgeNumber: 1,
        title: 'iOS Header with Centered HBW Logo & Back Action',
        elementName: 'Top Navigation Bar (iOS Header)',
        side: 'left',
        targetYPercent: 4,
        description: 'Matches previous screens (SCR-01 to SCR-03) with ChevronLeft back navigation, centered brand HBW Logo, and options trigger.',
        technicalType: 'iOS Navigation Header'
      },
      {
        id: 'c2',
        badgeNumber: 2,
        title: 'Serif Greeting & Dynamic Remaining Counter',
        elementName: 'Good to see you, Alex',
        side: 'right',
        targetYPercent: 12,
        description: 'Displays user greeting in Merriweather font-serif with live remaining habits counter ("You have X habits remaining for today.").',
        technicalType: 'Display Header'
      },
      {
        id: 'c3',
        badgeNumber: 3,
        title: 'Week Calendar Strip with Azure Active Day',
        elementName: 'Week 4 Calendar Strip',
        side: 'left',
        targetYPercent: 25,
        description: '5-day responsive calendar (Mon 23 - Fri 27) with the active day prominently styled in an Azure pill with white typography.',
        technicalType: 'Calendar Strip'
      },
      {
        id: 'c4',
        badgeNumber: 4,
        title: "Today's Micro Habits & Hydration Reaction (SCR-07)",
        elementName: 'Interactive Habit Checklist & Confetti/Ecosystem Overlay',
        side: 'right',
        targetYPercent: 52,
        description: 'Checking any micro-habit triggers a celebratory lite confetti burst and presents an interactive overlay popup with the SCR-07 hydration ecosystem. Users can pop the floating cloud right inside the modal to rain on their tree or navigate to SCR-07.',
        technicalType: 'Micro-Habits Checklist & Hydration Modal'
      },
      {
        id: 'c5',
        badgeNumber: 5,
        title: 'iOS Main Navigation Bar (4 Items)',
        elementName: 'Fixed Bottom Tab Bar',
        side: 'left',
        targetYPercent: 94,
        description: 'Persistent 4-item iOS bottom navigation routing between Home (SCR-05), Progress (SCR-07 & SCR-09), Community (SCR-06), and Profile (SCR-08, SCR-10 & SCR-12) with Azure active state.',
        technicalType: 'iOS Tab Bar (4 Items)'
      }
    ]
  },
  {
    id: 'scr-dashboard-community',
    number: '06',
    name: 'Community Circles & Live Events Hub',
    category: 'Community & Circles',
    componentPath: 'src/components/CommunityChat.tsx',
    purpose: 'Facilitate peer accountability, global Slack workspace channels, and live Google Meet Q&A circles alongside localized community action events.',
    primaryCTA: {
      label: 'RSVP to Live Circle / Add to Google Calendar',
      actionDescription: 'Toggles event attendance status and generates a pre-filled Google Calendar event with live Google Meet link.',
      stateChange: 'Updates `rsvpedEvents[id] = true`, increments attendee count by 1.',
      destinationScreen: 'External Google Meet / Calendar Integration'
    },
    appearsContext: {
      how: 'Rendered when user taps the "Community" tab in the bottom bar.',
      when: 'User explores peer circles, events, or Slack channels.',
      where: 'Mobile App Viewport within Device Simulator.'
    },
    callouts: [
      {
        id: 'c1',
        badgeNumber: 1,
        title: 'Pillar Slack Channel Banner',
        elementName: 'Slack Integration Banner',
        side: 'left',
        targetYPercent: 12,
        description: 'Connects users directly to their category peer channel (#hbw-climate-action, #hbw-vitality-circle) on Slack.',
        technicalType: 'Channel Connect Card'
      },
      {
        id: 'c2',
        badgeNumber: 2,
        title: 'Event Format Filters',
        elementName: 'Filter Segmented Pills',
        side: 'right',
        targetYPercent: 24,
        description: 'Filter between "All Events", "Digital Events (Google Meet)", and "In-Person Actions".',
        technicalType: 'Filter Pill Strip'
      },
      {
        id: 'c3',
        badgeNumber: 3,
        title: 'Live Q&A & Accountability Cards',
        elementName: 'Curated Events Feed',
        side: 'left',
        targetYPercent: 52,
        description: 'Shows event title, host avatar, attendee counter (e.g. 142 peers), and live Google Meet video button.',
        technicalType: 'Interactive Event Card'
      },
      {
        id: 'c4',
        badgeNumber: 4,
        title: 'Interactive RSVP & Calendar Actions',
        elementName: 'RSVP & Add to Calendar Buttons',
        side: 'right',
        targetYPercent: 82,
        description: 'Toggles attendance status and generates 1-tap Google Calendar invitations with meeting links.',
        technicalType: 'Dual Action Buttons'
      }
    ]
  },
  {
    id: 'scr-dashboard-progress',
    number: '07',
    name: 'Analytics, Milestones & Ant Forest Tree',
    category: 'Gamification & Analytics',
    componentPath: 'src/components/dashboard/ProgressTab.tsx + EcosystemVisualization.tsx',
    purpose: 'Gamified Ant Forest virtual tree growth engine with interactive hydration rainfall mechanics, 90-day progress metrics, and milestone badge unlock criteria.',
    primaryCTA: {
      label: 'Tap Cloud / Energy Bubble to Hydrate Tree',
      actionDescription: 'Spawns an array of 16 animated falling raindrops that water the tree roots and award growth energy.',
      stateChange: 'Increments `individualEnergy`, advances tree growth progress bar towards next botanical stage.',
      destinationScreen: 'SCR-07: In-Place Botanical Growth Stage Advance'
    },
    appearsContext: {
      how: 'Rendered when user taps the "Progress" tab in the bottom bar.',
      when: 'User checks milestones, tree growth, or aggregate cohort impact.',
      where: 'Mobile App Viewport within Device Simulator.'
    },
    callouts: [
      {
        id: 'c1',
        badgeNumber: 1,
        title: 'Ant Forest Botanical Tree Canvas',
        elementName: 'Dynamic 5-Stage Tree SVG',
        side: 'left',
        targetYPercent: 22,
        description: 'Scales dynamically from Seedling -> Sprout -> Sapling -> Canopy -> Ancient Guardian based on accumulated energy.',
        technicalType: 'Interactive SVG Canvas'
      },
      {
        id: 'c2',
        badgeNumber: 2,
        title: 'Hydration Rain Animation Particle System',
        elementName: 'Raindrop Canvas FX',
        side: 'right',
        targetYPercent: 36,
        description: 'Spawns realistic raindrop particles falling onto roots when energy is harvested or clouds are tapped.',
        technicalType: 'Particle Animation System'
      },
      {
        id: 'c3',
        badgeNumber: 3,
        title: 'Category Tangible Impact Metrics',
        elementName: 'Dual Impact Stat Boxes',
        side: 'left',
        targetYPercent: 62,
        description: 'Displays tangible metrics like "12.4 kg CO2 Prevented" and "36 Single-Use Items Slashed" based on active pillar.',
        technicalType: 'Impact Metric Grid'
      },
      {
        id: 'c4',
        badgeNumber: 4,
        title: 'Streak Milestone Badges Grid',
        elementName: 'Achievement Unlock Cards',
        side: 'right',
        targetYPercent: 86,
        description: 'Day 1, Day 7, Day 14, and Day 21 badges with unlock criteria and progress indicators.',
        technicalType: 'Badges Bento Grid'
      }
    ]
  },
  {
    id: 'scr-dashboard-profile',
    number: '08',
    name: 'Profile & Calibration Settings',
    category: 'Management & Settings',
    componentPath: 'src/components/dashboard/ProfileTab.tsx',
    purpose: 'Manage user identity, review and edit baseline diagnostic answers, toggle display themes, access auxiliary tool managers, and safely reset or backup habit state.',
    primaryCTA: {
      label: 'Edit Baseline Demographics / Save Changes',
      actionDescription: 'Opens inline demographic form to adjust age or gender without resetting active habit streaks.',
      stateChange: 'Mutates `answers` in HabitContext and syncs to `localStorage`.',
      destinationScreen: 'SCR-08: In-Place Profile Update'
    },
    appearsContext: {
      how: 'Rendered when user taps the "Profile" tab in the bottom bar.',
      when: 'User adjusts settings, updates demographics, or logs out.',
      where: 'Mobile App Viewport within Device Simulator.'
    },
    callouts: [
      {
        id: 'c1',
        badgeNumber: 1,
        title: 'Member Identity & Verification Badge',
        elementName: 'Profile Avatar & Tag',
        side: 'left',
        targetYPercent: 12,
        description: 'User display name, email, avatar icon, and "Verified Challenger" vs "Guest Sandbox" status badge.',
        technicalType: 'Profile Header Card'
      },
      {
        id: 'c2',
        badgeNumber: 2,
        title: 'Baseline Diagnostic Answers Review',
        elementName: 'Demographics Summary Box',
        side: 'right',
        targetYPercent: 32,
        description: 'Displays current age bracket and gender identity with 1-tap "Edit Profile" and "Retake Assessment" buttons.',
        technicalType: 'Data Summary & Edit Trigger'
      },
      {
        id: 'c3',
        badgeNumber: 3,
        title: 'Wardrobe & Smart Alerts Shortcuts',
        elementName: 'Tool Quick Navigation Rows',
        side: 'left',
        targetYPercent: 56,
        description: 'Direct navigation rows linking to Habits Wardrobe, Smart Alerts, and 90-Day PDF Plan download.',
        technicalType: 'Navigation Action Rows'
      },
      {
        id: 'c4',
        badgeNumber: 4,
        title: 'Sign Out & Session Reset Action',
        elementName: 'Danger Action Button',
        side: 'right',
        targetYPercent: 88,
        description: 'Clears active session while safely caching habit progress in local storage.',
        technicalType: 'Danger Button'
      }
    ]
  },
  {
    id: 'scr-wardrobe',
    number: '09',
    name: 'Habit Catalog & Multi-Habit Hub',
    category: 'Management & Settings',
    componentPath: 'src/components/HabitsManager.tsx',
    purpose: 'Explore the complete curated scientific habit repository, inspect clinical evidence across 4 pillars, manage a personal habit wardrobe, and switch the active primary focus.',
    primaryCTA: {
      label: 'Make Active Focus (Set Primary Habit)',
      actionDescription: 'Sets this habit as the primary focus on the daily Home dashboard, Watch companion, and streak engine.',
      stateChange: 'Invokes `setActiveGoal(goal)` in HabitContext, persists to `localStorage`.',
      destinationScreen: 'SCR-05: Daily Home Tab (with updated focus)'
    },
    appearsContext: {
      how: 'Launched via Profile tab or Overflow settings menu.',
      when: 'User explores the repository or switches their primary daily habit.',
      where: 'Modal View within Device Simulator.'
    },
    callouts: [
      {
        id: 'c1',
        badgeNumber: 1,
        title: 'Single-Habit Behavioral Caution Banner',
        elementName: 'Cognitive Bandwidth Notice',
        side: 'left',
        targetYPercent: 12,
        description: 'Science-backed reminder emphasizing that focusing on 1 primary habit at a time yields an 80% higher success rate.',
        technicalType: 'Behavioral Callout Banner'
      },
      {
        id: 'c2',
        badgeNumber: 2,
        title: 'Active Wardrobe & Primary Focus Tag',
        elementName: 'My Active Habits List',
        side: 'right',
        targetYPercent: 34,
        description: 'Shows user\'s saved habits with "PRIMARY FOCUS" badge, time dosage, and delete/switch buttons.',
        technicalType: 'Wardrobe Items List'
      },
      {
        id: 'c3',
        badgeNumber: 3,
        title: 'Category Filter Tabs',
        elementName: 'Pillar Filter Pills',
        side: 'left',
        targetYPercent: 54,
        description: 'Filter catalog across Environment, Well-Being, Compassion, and Responsible AI.',
        technicalType: 'Filter Tabs'
      },
      {
        id: 'c4',
        badgeNumber: 4,
        title: 'Full Repository Directory & Add Action',
        elementName: 'Catalog Habit Cards',
        side: 'right',
        targetYPercent: 82,
        description: 'Detailed cards showing habit title, difficulty, time investment, clinical evidence, and "Add to Wardrobe" CTA.',
        technicalType: 'Catalog Card Grid'
      }
    ]
  },
  {
    id: 'scr-smart-alerts',
    number: '10',
    name: 'Smart Alerts & BJ Fogg Habit Anchors',
    category: 'Management & Settings',
    componentPath: 'src/components/SmartAlerts.tsx',
    purpose: 'Formulate BJ Fogg implementation intentions ("After [Anchor Habit], I will [Target Habit]"), configure scheduled notification alarms, and preview live lock-screen push notifications.',
    primaryCTA: {
      label: 'Add Habit Anchor / Send Test Push Alert',
      actionDescription: 'Saves a new implementation intention trigger or fires a simulated push notification with haptics.',
      stateChange: 'Appends new trigger to `triggers` list in localStorage, dispatches test alert event.',
      destinationScreen: 'SCR-10: Live Lock-Screen Banner Preview'
    },
    appearsContext: {
      how: 'Launched via Home tab quick action or Profile settings.',
      when: 'User configures routine anchors and reminder times.',
      where: 'Modal View within Device Simulator.'
    },
    callouts: [
      {
        id: 'c1',
        badgeNumber: 1,
        title: 'BJ Fogg Implementation Intention Formula',
        elementName: 'Anchor Formula Banner',
        side: 'left',
        targetYPercent: 12,
        description: 'Visual diagram: "Anchor Event (Morning Coffee) -> Prompt -> Target Micro-Habit (1 Plant-Based Meal)".',
        technicalType: 'Educational Formula Banner'
      },
      {
        id: 'c2',
        badgeNumber: 2,
        title: 'Live Simulated Lock-Screen Push Preview',
        elementName: 'Push Notification Card',
        side: 'right',
        targetYPercent: 32,
        description: 'Interactive lock-screen card with app icon, timestamp ("Just Now"), habit title, and "Log Complete" / "Snooze" buttons.',
        technicalType: 'Simulated System Banner'
      },
      {
        id: 'c3',
        badgeNumber: 3,
        title: 'Anchor Triggers List & Active Toggles',
        elementName: 'Trigger Items List',
        side: 'left',
        targetYPercent: 58,
        description: 'List showing anchor name, scheduled time (e.g. 08:00 AM), repeating day chips (M-T-W-T-F), and enable/disable switch.',
        technicalType: 'Configurable Triggers List'
      },
      {
        id: 'c4',
        badgeNumber: 4,
        title: 'Add Trigger Form & Test Alert Button',
        elementName: 'Trigger Form & Test Action',
        side: 'right',
        targetYPercent: 86,
        description: 'Drawer input to formulate new routine anchors and trigger simulated device vibrations.',
        technicalType: 'Form Drawer & Action CTA'
      }
    ]
  },
  {
    id: 'scr-smartwatch',
    number: '11',
    name: 'Smartwatch Companion Wearable Simulator',
    category: 'Multi-Device Companion',
    componentPath: 'src/components/SmartwatchSimulator.tsx',
    purpose: 'Simulate watchOS and Wear OS companion wrist experiences for glanceable habit tracking, haptic check-ins, wrist notifications, and two-way phone state synchronization.',
    primaryCTA: {
      label: 'Tap Complication Ring to Log Habit on Wrist',
      actionDescription: 'Performs instant micro-logging directly from the watch face, triggers wrist haptics, and updates phone state in real-time.',
      stateChange: 'Synchronizes `hasLoggedToday: true` and streak across both phone and watch simulators.',
      destinationScreen: 'SCR-05: Synchronized Phone State'
    },
    appearsContext: {
      how: 'Launched via Overflow menu or device companion bar.',
      when: 'User explores wearable companion interactions.',
      where: 'Wearable Simulator Dedicated Frame.'
    },
    callouts: [
      {
        id: 'c1',
        badgeNumber: 1,
        title: 'Platform Hardware Switcher',
        elementName: 'watchOS / Wear OS Toggle',
        side: 'left',
        targetYPercent: 12,
        description: 'Transforms hardware bezel between Apple Watch squircle and Wear OS circular dial.',
        technicalType: 'Hardware Bezel Toggle'
      },
      {
        id: 'c2',
        badgeNumber: 2,
        title: 'Watch Face Glance Complication Ring',
        elementName: 'Interactive Watch Complication',
        side: 'right',
        targetYPercent: 42,
        description: 'Digital clock face, flame streak counter, and tap-to-complete circular progress complication.',
        technicalType: 'Wearable Watch Face View'
      },
      {
        id: 'c3',
        badgeNumber: 3,
        title: 'Tactile Haptic Vibration Ripple',
        elementName: 'Visual Haptic Wave Effect',
        side: 'left',
        targetYPercent: 68,
        description: 'Pulsating ripple and shake animation simulating tactile wrist vibration upon alert or logging.',
        technicalType: 'Haptic Visual Feedback'
      },
      {
        id: 'c4',
        badgeNumber: 4,
        title: 'Two-Way Live Sync Connection',
        elementName: 'Bluetooth/Cloud Sync Bar',
        side: 'right',
        targetYPercent: 90,
        description: 'Displays live synchronization status connecting wrist check-ins with phone persistent storage.',
        technicalType: 'Sync Status Indicator'
      }
    ]
  },
  {
    id: 'scr-overflow-menu',
    number: '12',
    name: 'iOS Navigation Bar Pull-Down Menu (UIMenu)',
    category: 'Management & Settings',
    componentPath: 'src/components/dashboard/OverflowSettingsMenu.tsx',
    purpose: 'Authentic iOS UIMenu pull-down action popover anchored directly beneath the header navigation ellipsis, providing instant tactile access to auxiliary companion tools, display theme switches, vector PDF plan export, and account session management without screen clutter.',
    primaryCTA: {
      label: 'Select Contextual Tool or Action',
      actionDescription: 'Directly launches companion tools (Wardrobe, Alerts, Watch) or dispatches utility actions without disruptive modal clutter.',
      stateChange: 'Switches display appearance, downloads PDF plan, or transitions to the selected companion screen.',
      destinationScreen: 'Selected Companion Screen / Active Session'
    },
    appearsContext: {
      how: 'Triggered by tapping the 3 dots (MoreVertical) button in the top iOS header.',
      when: 'User accesses companion tools, toggles display theme, or manages session.',
      where: 'Anchored directly below the top-right header button with frosted vibrancy blur.'
    },
    callouts: [
      {
        id: 'c1',
        badgeNumber: 1,
        title: 'Active Ellipsis Navigation Trigger',
        elementName: 'Header MoreVertical Button',
        side: 'left',
        targetYPercent: 7,
        description: 'Top-right iOS navigation item highlighted in Azure, visually anchoring the pull-down menu directly below it.',
        technicalType: 'iOS Navigation Bar Item'
      },
      {
        id: 'c2',
        badgeNumber: 2,
        title: 'Companion Tool Shortcuts',
        elementName: 'Wardrobe, Alerts & Watch Rows',
        side: 'right',
        targetYPercent: 24,
        description: 'Clean grouped iOS action rows linking to Habit Hub (SCR-09), Smart Alerts (SCR-10), and Apple Watch Simulator (SCR-11).',
        technicalType: 'Grouped Action Rows'
      },
      {
        id: 'c3',
        badgeNumber: 3,
        title: 'Display & Export Actions',
        elementName: 'Appearance & PDF Rows',
        side: 'left',
        targetYPercent: 44,
        description: 'Instant Dark/Light appearance toggle, 90-day vector PDF download with badge, and quiz recalibration trigger.',
        technicalType: 'Utility Action Rows'
      },
      {
        id: 'c4',
        badgeNumber: 4,
        title: 'Account & Destructive Sign Out',
        elementName: 'Profile & Log Out Rows',
        side: 'right',
        targetYPercent: 62,
        description: 'Session overview and destructive logout action rendered in iOS system red (#FF3B30).',
        technicalType: 'Session & Destructive Row'
      }
    ]
  }
];

export default function InteractionDesignSystem({ onClose }: { onClose: () => void }) {
  const [selectedScreenId, setSelectedScreenId] = useState<string>('scr-auth');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeCalloutId, setActiveCalloutId] = useState<string | null>(null);
  const [screenTheme, setScreenTheme] = useState<'dark' | 'light'>('dark');
  const [isDownloadingPNG, setIsDownloadingPNG] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const screenRenderRef = useRef<HTMLDivElement>(null);

  // Live interactive ecosystem & cloud bubble state for SCR-05 and SCR-07
  const [demoBubbles, setDemoBubbles] = useState<Array<{ id: number; cx: number; cy: number; value: number; type: string; label: string; isNew?: boolean }>>([
    { id: 1, cx: 38, cy: 26, value: 15, type: 'Habit Energy', label: '+15g Hydration' },
    { id: 2, cx: 62, cy: 36, value: 20, type: 'Habit Energy', label: '+20g Rainfall' }
  ]);
  const [demoEnergy, setDemoEnergy] = useState<number>(145);

  const selectedScreen = SCREEN_INTERACTION_SPECS.find(s => s.id === selectedScreenId) || SCREEN_INTERACTION_SPECS[0];

  const categories = ['All', 'Access & Onboarding', 'Core Daily Execution', 'Community & Circles', 'Gamification & Analytics', 'Management & Settings', 'Multi-Device Companion'];

  const filteredScreens = SCREEN_INTERACTION_SPECS.filter(screen => {
    const matchesCategory = activeCategory === 'All' || screen.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      screen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screen.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      screen.callouts.some(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const leftCallouts = selectedScreen.callouts.filter(c => c.side === 'left');
  const rightCallouts = selectedScreen.callouts.filter(c => c.side === 'right');

  const handleDownloadPNG = async () => {
    if (!screenRenderRef.current) return;
    try {
      setIsDownloadingPNG(true);
      // Brief tick to ensure DOM state reflects full expanded export layout before snapshotting
      await new Promise(resolve => setTimeout(resolve, 180));

      const node = screenRenderRef.current;
      const fullHeight = Math.max(node.scrollHeight, node.offsetHeight, 680);
      const fullWidth = node.offsetWidth || 375;

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        height: fullHeight,
        width: fullWidth,
        style: {
          scrollbarWidth: 'none',
          height: `${fullHeight}px`,
          maxHeight: 'none',
          overflow: 'visible',
        },
        filter: (domNode: HTMLElement) => {
          // Exclude annotation badge numbers and layers so only pristine screen UI is in the PNG
          if (!domNode) return true;
          if (
            domNode.classList?.contains('annotation-badge-layer') ||
            domNode.getAttribute?.('data-annotation-badge') === 'true'
          ) {
            return false;
          }
          return true;
        },
      });
      const link = document.createElement('a');
      link.download = `HBW-SCR-${selectedScreen.number}-${selectedScreen.id}-${screenTheme}.png`;
      link.href = dataUrl;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to export PNG of screen rendering:', err);
    } finally {
      setIsDownloadingPNG(false);
    }
  };

  // Helper to wrap dashboard screens in full iOS App Shell (Header section from previous screens + 4-item bottom nav bar)
  const renderIOSShell = (
    content: React.ReactNode, 
    activeTab: 'home' | 'progress' | 'community' | 'profile', 
    theme: 'dark' | 'light',
    backTarget: string = 'scr-recommendations',
    isMenuOpen: boolean = false,
    menuOverlay?: React.ReactNode
  ) => {
    return (
      <div className={`w-full ${isDownloadingPNG ? 'h-auto min-h-[680px] justify-start' : 'h-full justify-between'} flex flex-col font-sans relative [transform:translateZ(0)] overflow-hidden transition-colors duration-200 ${
        theme === 'dark' ? 'bg-[#0A0A0C] text-white' : 'bg-[#F5F5F7] text-[#1C1C1E]'
      }`}>
        {/* iOS Header Section with Centered Logo (Matching previous screens) */}
        <div className={`px-4 py-3 border-b flex items-center justify-between shadow-xs shrink-0 z-20 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-[#121214] border-[#1F1F24] text-white' : 'bg-white border-[#E5E5EA] text-[#1C1C1E]'
        }`}>
          <div className="flex items-center w-8">
            <button
              type="button"
              onClick={() => setSelectedScreenId(backTarget)}
              className={`p-1.5 -ml-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                theme === 'dark'
                  ? 'text-[#8E8E93] hover:text-white hover:bg-[#1F1F24]'
                  : 'text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-[#E5E5EA]'
              }`}
              title="Go back"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center">
            <HBWLogo size="sm" variant="horizontal" theme={theme} />
          </div>

          <div className="flex items-center justify-end w-8">
            <button
              type="button"
              onClick={() => setSelectedScreenId(isMenuOpen ? 'scr-dashboard-home' : 'scr-overflow-menu')}
              className={`p-1.5 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                isMenuOpen
                  ? 'bg-[#0080FF] text-white shadow-xs'
                  : theme === 'dark'
                    ? 'text-[#8E8E93] hover:text-white hover:bg-[#1F1F24]'
                    : 'text-[#6C6C70] hover:text-[#1C1C1E] hover:bg-[#F5F5F7]'
              }`}
              title="Settings & Options (SCR-12)"
              aria-label="Settings and Options menu"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Anchored iOS Pull-Down Menu Overlay */}
        {menuOverlay}

        {/* Scrollable Center Content */}
        <div className={`w-full ${isDownloadingPNG ? 'h-auto overflow-visible' : 'flex-1 overflow-y-auto no-scrollbar'} overflow-x-hidden px-4 py-5 flex flex-col justify-start`}>
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
            {content}
          </div>
        </div>

        {/* iOS Main Navigation Bar (4 Items: Home, Progress, Community, Profile) */}
        <div className={`border-t shrink-0 z-20 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-[#121214] border-[#1F1F24]' : 'bg-white border-[#E5E5EA]'
        }`}>
          <div className="h-[56px] grid grid-cols-4 items-center">
            {/* 1. HOME */}
            <button
              type="button"
              onClick={() => setSelectedScreenId('scr-dashboard-home')}
              className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer relative ${
                activeTab === 'home'
                  ? 'text-[#0080FF]'
                  : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
              }`}
            >
              <Home className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] font-sans font-medium leading-none whitespace-nowrap">Home</span>
            </button>

            {/* 2. PROGRESS */}
            <button
              type="button"
              onClick={() => setSelectedScreenId('scr-dashboard-progress')}
              className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer relative ${
                activeTab === 'progress'
                  ? 'text-[#0080FF]'
                  : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
              }`}
            >
              <TrendingUp className={`w-5 h-5 mb-0.5 ${activeTab === 'progress' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] font-sans font-medium leading-none whitespace-nowrap">Progress</span>
            </button>

            {/* 3. COMMUNITY */}
            <button
              type="button"
              onClick={() => setSelectedScreenId('scr-dashboard-community')}
              className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer relative ${
                activeTab === 'community'
                  ? 'text-[#0080FF]'
                  : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
              }`}
            >
              <Users className={`w-5 h-5 mb-0.5 ${activeTab === 'community' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] font-sans font-medium leading-none whitespace-nowrap">Community</span>
            </button>

            {/* 4. PROFILE */}
            <button
              type="button"
              onClick={() => setSelectedScreenId('scr-dashboard-profile')}
              className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer relative ${
                activeTab === 'profile'
                  ? 'text-[#0080FF]'
                  : theme === 'dark' ? 'text-[#8E8E93] hover:text-white' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
              }`}
            >
              <User className={`w-5 h-5 mb-0.5 ${activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] font-sans font-medium leading-none whitespace-nowrap">Profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render the exact live component based on screen id and current theme
  const renderLiveAppScreen = (screenId: string, theme: 'dark' | 'light' = 'dark') => {
    switch (screenId) {
      case 'scr-auth':
        return (
          <AuthScreen 
            onLoginSuccess={() => {}}
            onContinueAsGuest={() => {}}
            theme={theme}
          />
        );
      case 'scr-quiz-step1':
        return (
          <OnboardingQuiz
            answers={MOCK_ANSWERS}
            setAnswers={() => {}}
            onSubmit={() => {}}
            isLoading={false}
            skipDemographics={false}
            theme={theme}
          />
        );
      case 'scr-quiz-step2':
        return (
          <OnboardingQuiz
            answers={MOCK_ANSWERS}
            setAnswers={() => {}}
            onSubmit={() => {}}
            isLoading={false}
            skipDemographics={true}
            theme={theme}
          />
        );
      case 'scr-recommendations':
        return (
          <GoalRecommendations
            answers={MOCK_ANSWERS}
            topGoal={MOCK_GOAL}
            alternatives={[TOP_IMPACT_GOALS['Well-Being'], TOP_IMPACT_GOALS['Compassion'], TOP_IMPACT_GOALS['Responsible AI']]}
            onCommit={() => {}}
            onReset={() => {}}
            hasAI={false}
            theme={theme}
          />
        );
      case 'scr-dashboard-home':
        return renderIOSShell(
          <HomeTab
            activeGoal={MOCK_GOAL}
            checklist={{ habitDone: true, anchorDone: true, reflectDone: false }}
            onCheckItem={() => {}}
            hasLoggedToday={true}
            onLogSuccess={() => {}}
            bubbles={demoBubbles}
            setBubbles={setDemoBubbles}
            individualEnergy={demoEnergy}
            setIndividualEnergy={setDemoEnergy}
            streak={7}
            dismissedBubbleAlert={false}
            setDismissedBubbleAlert={() => {}}
            motivationalQuote="Small acts, when multiplied by millions of people, can transform the world."
            hasConfiguredNotifications={true}
            anchorHabit="Brewing morning coffee"
            setAnchorHabit={() => {}}
            onQuickEnableReminders={() => {}}
            onNavigateToTab={(tab) => {
              if (tab === 'community') setSelectedScreenId('scr-dashboard-community');
              else if (tab === 'progress') setSelectedScreenId('scr-dashboard-progress');
              else if (tab === 'profile') setSelectedScreenId('scr-dashboard-profile');
            }}
            theme={theme}
          />,
          'home',
          theme,
          'scr-recommendations'
        );
      case 'scr-dashboard-community':
        return renderIOSShell(
          <CommunityChat
            category="Environment"
            goalTitle={MOCK_GOAL.title}
            theme={theme}
          />,
          'community',
          theme,
          'scr-dashboard-home'
        );
      case 'scr-dashboard-progress':
        return renderIOSShell(
          <ProgressTab
            activeGoal={MOCK_GOAL}
            streak={7}
            individualEnergy={demoEnergy}
            setIndividualEnergy={setDemoEnergy}
            hasLoggedToday={true}
            onLogSuccess={() => {}}
            bubbles={demoBubbles}
            setBubbles={setDemoBubbles}
            metrics={{
              primaryValue: '12.4 kg',
              primaryLabel: 'CO2e Offset',
              secondaryValue: '4.2k L',
              secondaryLabel: 'Water Conserved',
              targetTip: 'Top 5% consistency in your cohort!'
            }}
            theme={theme}
          />,
          'progress',
          theme,
          'scr-dashboard-home'
        );
      case 'scr-dashboard-profile':
        return renderIOSShell(
          <ProfileTab
            user={MOCK_USER}
            answers={MOCK_ANSWERS}
            onUpdateAnswers={() => {}}
            onSignOut={() => {}}
            onOpenAuth={() => {}}
            theme={theme}
            onToggleTheme={() => {}}
            activeGoal={MOCK_GOAL}
            setActiveGoal={() => {}}
            onReset={() => setSelectedScreenId('scr-dashboard-home')}
            anchorHabit="Brewing morning coffee"
            setAnchorHabit={() => {}}
            setHasConfiguredNotifications={() => {}}
            onDownloadPDF={() => {}}
          />,
          'profile',
          theme,
          'scr-dashboard-home'
        );
      case 'scr-wardrobe':
        return renderIOSShell(
          <HabitsManager
            activeGoal={MOCK_GOAL}
            setActiveGoal={() => {}}
            onResetQuiz={() => {}}
            theme={theme}
          />,
          'progress',
          theme,
          'scr-dashboard-progress'
        );
      case 'scr-smart-alerts':
        return renderIOSShell(
          <SmartAlerts
            goalTitle={MOCK_GOAL.title}
            defaultAnchor="Brewing morning coffee"
            theme={theme}
          />,
          'profile',
          theme,
          'scr-dashboard-profile'
        );
      case 'scr-smartwatch':
        return (
          <div className={`h-full flex items-center justify-center p-2 transition-colors ${
            theme === 'dark' ? 'bg-[#0A0A0C]' : 'bg-[#F5F5F7]'
          }`}>
            <SmartwatchSimulator />
          </div>
        );
      case 'scr-overflow-menu':
        return renderIOSShell(
          <HomeTab
            activeGoal={MOCK_GOAL}
            checklist={{ habitDone: true, anchorDone: true, reflectDone: false }}
            onCheckItem={() => {}}
            hasLoggedToday={true}
            onLogSuccess={() => {}}
            bubbles={[]}
            dismissedBubbleAlert={false}
            setDismissedBubbleAlert={() => {}}
            motivationalQuote="Small daily rituals create planetary impact."
            hasConfiguredNotifications={true}
            anchorHabit="Brewing morning coffee"
            setAnchorHabit={() => {}}
            onQuickEnableReminders={() => {}}
            onNavigateToTab={(tab) => {
              if (tab === 'profile') setSelectedScreenId('scr-dashboard-profile');
              else if (tab === 'progress') setSelectedScreenId('scr-dashboard-progress');
              else if (tab === 'community') setSelectedScreenId('scr-dashboard-community');
              else setSelectedScreenId('scr-dashboard-home');
            }}
            theme={theme}
          />,
          'home',
          theme,
          'scr-dashboard-home',
          true,
          <OverflowSettingsMenu
            isOpen={true}
            onClose={() => setSelectedScreenId('scr-dashboard-home')}
            theme={theme}
            onToggleTheme={(t) => setScreenTheme(t)}
            user={MOCK_USER}
            answers={MOCK_ANSWERS}
            onOpenWardrobe={() => setSelectedScreenId('scr-wardrobe')}
            onOpenAlerts={() => setSelectedScreenId('scr-smart-alerts')}
            onOpenWatch={() => setSelectedScreenId('scr-smartwatch')}
            onNavigateToTab={(tab) => {
              if (tab === 'profile') setSelectedScreenId('scr-dashboard-profile');
              else if (tab === 'progress') setSelectedScreenId('scr-dashboard-progress');
              else if (tab === 'community') setSelectedScreenId('scr-dashboard-community');
              else setSelectedScreenId('scr-dashboard-home');
            }}
            onResetQuiz={() => setSelectedScreenId('scr-quiz')}
            onSignOut={() => setSelectedScreenId('scr-auth')}
            onOpenAuth={() => setSelectedScreenId('scr-auth')}
            onDownloadPDF={() => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#000814] text-[#F5F5F7] overflow-hidden font-sans">
      {/* Top System Header Bar */}
      <div className="px-4 sm:px-6 py-3 border-b border-[#002246] bg-[#000d21] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <HBWLogo size="sm" variant="horizontal" theme="dark" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-serif font-bold text-white tracking-wide">
                Interactive Screen Interaction Design System
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#0080FF]/20 text-[#0080FF] border border-[#0080FF]/40">
                12 Screens Annotated
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#8E8E93] hidden sm:block">
              Visual Callout Matrix • Primary Call to Action • Flow Dynamics
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#001733] hover:bg-[#002b59] text-white text-xs font-semibold border border-[#002b59] transition-all cursor-pointer"
        >
          <X className="w-4 h-4 text-[#8E8E93]" />
          <span>Close</span>
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar: Screen Selection Directory */}
        <div className="w-full md:w-72 lg:w-80 border-r border-[#002246] bg-[#000a18] flex flex-col shrink-0 overflow-hidden">
          {/* Search & Category Filter */}
          <div className="p-3 border-b border-[#002246] space-y-2 bg-[#000d21]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search screen or callout..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#001733] border border-[#002b59] rounded-xl text-xs text-white placeholder-[#6C6C70] focus:outline-hidden focus:border-[#0080FF]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#0080FF] text-white font-bold'
                      : 'bg-[#001733] text-[#8E8E93] hover:text-white border border-[#002b59]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Screen Thumbnails List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
            {filteredScreens.map((screen) => {
              const isSelected = screen.id === selectedScreenId;
              return (
                <button
                  key={screen.id}
                  onClick={() => {
                    setSelectedScreenId(screen.id);
                    setActiveCalloutId(null);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#002246] border-[#0080FF] shadow-md text-white'
                      : 'bg-[#001026] border-[#002246]/60 text-[#8E8E93] hover:bg-[#001733] hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${
                      isSelected ? 'bg-[#0080FF] text-white' : 'bg-[#001733] text-[#0080FF]'
                    }`}>
                      SCR-{screen.number}
                    </span>
                    <span className="text-[9px] font-mono uppercase text-[#6C6C70] truncate max-w-[120px]">
                      {screen.category}
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-[#D1D1D6]'}`}>
                    {screen.name}
                  </h4>
                  <span className="text-[10px] text-[#0080FF] flex items-center gap-1 font-mono">
                    <Target className="w-3 h-3" />
                    {screen.callouts.length} visual callouts
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Stage: Exact Screen with Surrounding Visual Callout Annotations */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#000814] flex flex-col space-y-6 custom-scrollbar">
          {/* Screen Overview Banner & Primary CTA */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#001026] border border-[#002b59] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#0080FF] text-white">
                  SCREEN {selectedScreen.number}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#002246] text-[#0080FF] border border-[#00488A]/50">
                  {selectedScreen.category}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#8E8E93] bg-[#000f1f] px-3 py-1 rounded-lg border border-[#002246]">
                <Code className="w-3.5 h-3.5 text-[#0080FF]" />
                <span>{selectedScreen.componentPath}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-white">
                {selectedScreen.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#B0B0B5] mt-1 leading-relaxed">
                {selectedScreen.purpose}
              </p>
            </div>

            {/* Focused Primary Call to Action Box */}
            <div className="p-3.5 rounded-xl bg-[#001733] border border-[#00488A]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0080FF] uppercase tracking-wider">
                  <Target className="w-4 h-4 text-[#0080FF]" />
                  <span>Primary Call to Action (CTA)</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {selectedScreen.primaryCTA.label}
                </h4>
                <p className="text-xs text-[#D1D1D6]">
                  {selectedScreen.primaryCTA.actionDescription}
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-1 text-[11px] font-mono text-[#8E8E93] shrink-0">
                <span className="text-[#34C759] flex items-center gap-1">
                  <CornerDownRight className="w-3.5 h-3.5" />
                  {selectedScreen.primaryCTA.destinationScreen}
                </span>
                <span className="text-[#8E8E93]">
                  {selectedScreen.primaryCTA.stateChange}
                </span>
              </div>
            </div>

            {/* How, When, Where Appears Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-[#000d21] border border-[#002246]">
                <span className="text-[10px] font-mono text-[#8E8E93] uppercase font-bold block mb-0.5">● HOW IT APPEARS</span>
                <span className="text-white text-[11px] font-mono">{selectedScreen.appearsContext.how}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#000d21] border border-[#002246]">
                <span className="text-[10px] font-mono text-[#8E8E93] uppercase font-bold block mb-0.5">● WHEN IT APPEARS</span>
                <span className="text-white text-[11px]">{selectedScreen.appearsContext.when}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#000d21] border border-[#002246]">
                <span className="text-[10px] font-mono text-[#8E8E93] uppercase font-bold block mb-0.5">● WHERE IT APPEARS</span>
                <span className="text-white text-[11px]">{selectedScreen.appearsContext.where}</span>
              </div>
            </div>
          </div>

          {/* Interactive Screen Stage: Exact Live Screen in Center with Annotation Callout Cards on Left and Right with Arrows */}
          <div className="w-full flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 py-2">
            {/* Left Annotations Column */}
            <div className="w-full xl:w-80 flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-1 border-b border-[#002246]">
                <span className="text-xs font-mono font-bold text-[#0080FF] uppercase tracking-wider">
                  Left Callout Annotations
                </span>
                <span className="text-[10px] font-mono text-[#8E8E93]">
                  ({leftCallouts.length} features)
                </span>
              </div>

              {leftCallouts.map((callout) => {
                const isActive = activeCalloutId === callout.id;
                return (
                  <div
                    key={callout.id}
                    onMouseEnter={() => setActiveCalloutId(callout.id)}
                    onMouseLeave={() => setActiveCalloutId(null)}
                    className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isActive 
                        ? 'bg-[#002246] border-[#0080FF] shadow-lg shadow-[#0080FF]/15 scale-[1.02]' 
                        : 'bg-[#001026] border-[#002b59] hover:bg-[#001733] text-[#D1D1D6]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#0080FF] text-white font-mono font-bold text-xs flex items-center justify-center shadow-md">
                          {callout.badgeNumber}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {callout.title}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#002246] text-[#0080FF] border border-[#00488A]/50">
                        {callout.technicalType}
                      </span>
                    </div>

                    <p className="text-xs text-[#B0B0B5] leading-relaxed">
                      {callout.description}
                    </p>

                    <div className="text-[10px] font-mono text-[#8E8E93] pt-1 border-t border-[#002246] flex items-center justify-between">
                      <span>Element: <span className="text-white">{callout.elementName}</span></span>
                      <span className="text-[#0080FF] flex items-center gap-1">
                        Anchor: {callout.targetYPercent}% <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Center Live Screen Display Frame with Relative Pointer Arrows */}
            <div className="relative shrink-0 flex flex-col items-center gap-3">
              {/* Screen Rendering Control Toolbar (Theme Toggle & Download PNG) */}
              <div className="w-full max-w-[375px] flex items-center justify-between gap-2 px-1">
                {/* Light vs Dark Mode Toggle */}
                <div className="flex items-center gap-1 bg-[#001733] p-1 rounded-xl border border-[#002b59] shadow-inner">
                  <button
                    type="button"
                    onClick={() => setScreenTheme('light')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      screenTheme === 'light'
                        ? 'bg-white text-[#1C1C1E] font-bold shadow-xs'
                        : 'text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    <Sun className={`w-3.5 h-3.5 ${screenTheme === 'light' ? 'text-amber-500 fill-amber-500' : 'text-[#8E8E93]'}`} />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScreenTheme('dark')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      screenTheme === 'dark'
                        ? 'bg-[#0080FF] text-white font-bold shadow-xs'
                        : 'text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    <Moon className={`w-3.5 h-3.5 ${screenTheme === 'dark' ? 'text-blue-200 fill-blue-200' : 'text-[#8E8E93]'}`} />
                    <span>Dark</span>
                  </button>
                </div>

                {/* Download Screen PNG Button */}
                <button
                  type="button"
                  onClick={handleDownloadPNG}
                  disabled={isDownloadingPNG}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer shadow-md active:scale-95 disabled:opacity-50 ${
                    downloadSuccess
                      ? 'bg-[#34C759]/20 border-[#34C759] text-[#34C759]'
                      : 'bg-[#002246] hover:bg-[#00488A] border-[#00488A]/60 text-white'
                  }`}
                  title="Download clean high-resolution PNG of the exact app screen"
                >
                  {isDownloadingPNG ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : downloadSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#34C759]" />
                      <span>PNG Saved!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#0080FF]" />
                      <span>Download PNG</span>
                    </>
                  )}
                </button>
              </div>

              {/* Device Frame Visual Wrapper */}
              <div 
                ref={screenRenderRef}
                className={`w-[340px] sm:w-[375px] ${
                  isDownloadingPNG ? 'h-auto min-h-[680px]' : 'h-[680px]'
                } rounded-[36px] border-4 shadow-2xl overflow-hidden relative flex flex-col [transform:translateZ(0)] transition-colors ${
                  screenTheme === 'dark'
                    ? 'border-[#1F1F24] bg-[#0A0A0C]'
                    : 'border-[#D1D1D6] bg-[#F5F5F7]'
                }`}
              >
                {/* Simulated Phone Top Notch / Speaker */}
                <div className={`w-full h-6 flex items-center justify-center relative shrink-0 z-20 transition-colors ${
                  screenTheme === 'dark' ? 'bg-[#0A0A0C]' : 'bg-[#F5F5F7]'
                }`}>
                  <div className={`w-24 h-3.5 rounded-full flex items-center justify-center ${
                    screenTheme === 'dark' ? 'bg-[#1F1F24]' : 'bg-[#E5E5EA]'
                  }`}>
                    <div className="w-2.5 h-2.5 rounded-full bg-black mr-2"></div>
                    <div className={`w-8 h-1 rounded-full ${screenTheme === 'dark' ? 'bg-[#2C2C2E]' : 'bg-[#C7C7CC]'}`}></div>
                  </div>
                </div>

                {/* Actual Live App Component Screen */}
                <div 
                  data-device-screen="true"
                  className={`w-full ${
                    isDownloadingPNG ? 'h-auto overflow-visible flex-none' : 'flex-1 h-full overflow-y-auto overflow-x-hidden no-scrollbar'
                  } relative [transform:translateZ(0)] transition-colors ${
                    screenTheme === 'dark' ? 'bg-[#0A0A0C]' : 'bg-[#F5F5F7]'
                  }`}
                >
                  {renderLiveAppScreen(selectedScreen.id, screenTheme)}

                  {/* Visual Callout Target Badge Anchors Layer (Omitted from exported PNGs) */}
                  <div 
                    data-annotation-badge="true"
                    className={`annotation-badge-layer absolute inset-0 pointer-events-none z-30 ${
                      isDownloadingPNG ? 'hidden' : ''
                    }`}
                  >
                    {selectedScreen.callouts.map((callout) => {
                      const isActive = activeCalloutId === callout.id;
                      const isLeft = callout.side === 'left';
                      return (
                        <div
                          key={callout.id}
                          style={{ top: `${callout.targetYPercent}%`, [isLeft ? 'left' : 'right']: '10px' }}
                          className={`absolute -translate-y-1/2 flex items-center gap-1 transition-all ${
                            isActive ? 'scale-125 z-40' : 'opacity-85'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold text-white shadow-lg ring-2 ${
                            isActive 
                              ? 'bg-[#FF9500] ring-white animate-pulse' 
                              : 'bg-[#0080FF] ring-black/80'
                          }`}>
                            {callout.badgeNumber}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Bottom Home Indicator Bar */}
                <div className={`w-full h-5 flex items-center justify-center shrink-0 z-20 transition-colors ${
                  screenTheme === 'dark' ? 'bg-[#0A0A0C]' : 'bg-[#F5F5F7]'
                }`}>
                  <div className={`w-28 h-1 rounded-full ${
                    screenTheme === 'dark' ? 'bg-[#3A3A3C]' : 'bg-[#C7C7CC]'
                  }`}></div>
                </div>
              </div>

              {/* Viewport label */}
              <div className="text-center text-[11px] font-mono text-[#8E8E93]">
                Exact Live Viewport • Screen {selectedScreen.number} ({screenTheme.toUpperCase()} MODE)
              </div>
            </div>

            {/* Right Annotations Column */}
            <div className="w-full xl:w-80 flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-1 border-b border-[#002246]">
                <span className="text-xs font-mono font-bold text-[#0080FF] uppercase tracking-wider">
                  Right Callout Annotations
                </span>
                <span className="text-[10px] font-mono text-[#8E8E93]">
                  ({rightCallouts.length} features)
                </span>
              </div>

              {rightCallouts.map((callout) => {
                const isActive = activeCalloutId === callout.id;
                return (
                  <div
                    key={callout.id}
                    onMouseEnter={() => setActiveCalloutId(callout.id)}
                    onMouseLeave={() => setActiveCalloutId(null)}
                    className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isActive 
                        ? 'bg-[#002246] border-[#0080FF] shadow-lg shadow-[#0080FF]/15 scale-[1.02]' 
                        : 'bg-[#001026] border-[#002b59] hover:bg-[#001733] text-[#D1D1D6]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#0080FF] text-white font-mono font-bold text-xs flex items-center justify-center shadow-md">
                          {callout.badgeNumber}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {callout.title}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#002246] text-[#0080FF] border border-[#00488A]/50">
                        {callout.technicalType}
                      </span>
                    </div>

                    <p className="text-xs text-[#B0B0B5] leading-relaxed">
                      {callout.description}
                    </p>

                    <div className="text-[10px] font-mono text-[#8E8E93] pt-1 border-t border-[#002246] flex items-center justify-between">
                      <span>Element: <span className="text-white">{callout.elementName}</span></span>
                      <span className="text-[#0080FF] flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 rotate-180" /> Anchor: {callout.targetYPercent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="px-5 py-2 border-t border-[#002246] bg-[#000a18] flex flex-wrap items-center justify-between text-xs text-[#8E8E93] font-mono shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
          <span>12 Live App Screens Documented with Callout Pointers & Primary CTAs</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Target Device: 375 × 680 px</span>
          <span>•</span>
          <span>Zero-Slop Interaction Matrix</span>
        </div>
      </div>
    </div>
  );
}
