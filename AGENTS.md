# Habits for a Better World - Agent & Contributor Guidelines

This document establishes the architectural standards, code patterns, and design system conventions for the **Habits for a Better World** project to ensure maintainable, high-quality development for humans and vibe coding assistants.

---

## 🏛️ System Architecture

- **Framework**: React 18+ with TypeScript & Vite.
- **Backend / Deployment**: Custom Express production server (`server.ts` / `dist/server.cjs`) on Google Cloud Run container runtime.
- **Persistence Layer**:
  - `src/services/localStore.ts`: Centralized native-style local data store with offline CRUD, seeded initial models, and schema corruption recovery.
  - `src/services/storage.ts`: Strongly-typed, resilient local storage interface layer.
  - `src/context/HabitContext.tsx`: Centralized React Context providing global user profile, theme, streak, energy, and committed habits.
- **Styling**: Tailwind CSS utility classes with light and dark theme styling tokens.
- **Icons**: Imported strictly from `lucide-react`.

---

## 📂 Codebase Structure

```
src/
├── components/
│   ├── alerts/                    # Smart alerts subcomponents (TriggerItem, TriggerForm, NotificationPreviewCard)
│   ├── dashboard/                 # Tab views (HomeTab, ProgressTab, ProfileTab, OverflowSettingsMenu)
│   ├── splash/                    # Animated Framer Motion splash sequence (Splash, AnimatedLogo, OrganicShape)
│   ├── AuthScreen.tsx             # Authentication and guest sign-in
│   ├── CommunityChat.tsx          # Peer support & category channel
│   ├── DashboardSimulation.tsx    # Mobile dashboard coordinator & tab router
│   ├── DeviceSimulator.tsx        # Responsive viewport frame wrapper
│   ├── EcosystemVisualization.tsx # Gamified Ant Forest-style tree visualizer
│   ├── GoalRecommendations.tsx    # Recommended 3-month habit pathways
│   ├── HabitsManager.tsx          # Habit wardrobe and category catalog
│   ├── HBWLogo.tsx                # Scalable brand vector logo
│   ├── OnboardingQuiz.tsx         # Clinical assessment & preference quiz
│   └── SmartAlerts.tsx            # Habit anchors, cues & in-app reminder previews
├── context/
│   └── HabitContext.tsx           # Global state management
├── services/
│   ├── localStore.ts              # Centralized native-style local data store
│   ├── storage.ts                 # Unified typed persistent storage
│   ├── syncQueue.ts               # Local transaction journal
│   └── mmkv.ts                    # Compatibility proxy
├── utils/
│   └── pdfExport.ts               # Printable 90-day action plan PDF exporter
├── data.ts                        # Curated scientific habit pathways
├── types.ts                       # TypeScript interfaces & domain models
└── App.tsx                        # Root application orchestrator
```

---

## 🎨 Design Tokens & UI Rules

1. **Colors**:
   - Primary Accent: `#0080FF` (Buttons, active tabs, energetic highlights)
   - Success: `#34C759` (Completions, verified status, PDF exports)
   - Alert / Energy: `#FF9500` (Gamified energy bubbles, notices)
   - Danger: `#FF3B30` (Sign out, destructive actions)
   - Light Mode Canvas: `#F5F5F7` (Background), `#FFFFFF` (Cards), `#E5E5EA` (Borders), `#1C1C1E` (Text)
   - Dark Mode Canvas: `#0A0A0C` (Background), `#121214` (Cards), `#1F1F24` (Borders), `#FFFFFF` (Text)

2. **Typography**:
   - Display / Headings: `font-serif` or bold `font-sans` with tight tracking.
   - Body & Controls: `font-sans` with line height 1.5–1.7.
   - Metrics & Timers: `font-mono` with uppercase styling.

3. **Interactivity & Craft**:
   - Always provide accessible touch targets (≥44px on interactive controls).
   - Use `motion/react` for smooth view entries and state transitions.
   - Keep button labels on a single line (`whitespace-nowrap`).

---

## 🛠️ Development & Build Commands

- **Local Dev Server**: `npm run dev`
- **Lint Codebase**: `npm run lint`
- **Production Build**: `npm run build`
- **Start Production Server**: `npm run start`

---

## 🤖 Vibe Coding Best Practices

- When modifying tabs, edit the specific subcomponent in `src/components/dashboard/` rather than expanding `DashboardSimulation.tsx`.
- Use the `useHabit()` hook from `src/context/HabitContext.tsx` to read or mutate global habit state instead of prop drilling.
- Rely on `src/services/storage.ts` for any persistent keys to ensure type safety and error tolerance.
