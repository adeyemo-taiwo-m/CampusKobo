# CampusKobo 💚

> A student personal finance app built for BOF OAU — track spending, control budgets, and build savings habits.

![Version](https://img.shields.io/badge/version-1.0.0-brightgreen) ![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue) ![Built With](https://img.shields.io/badge/built%20with-React%20Native%20%2B%20Expo-black) ![Status](https://img.shields.io/badge/status-in%20development-orange)

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Screens Overview](#screens-overview)
- [Data & Storage](#data--storage)
- [Contributing](#contributing)
- [Credits](#credits)

---

## About

**CampusKobo** is a mobile personal finance application designed specifically for students at Obafemi Awolowo University (OAU). Built under the Bureau of Finance OAU (BOF OAU), it helps students develop healthy money habits by making expense tracking, budget management, and savings goal-setting simple and intuitive.

The app is fully **offline-first** — all data is stored locally on the device with no internet connection required for core features.

---

## Features

### 💰 Expense Tracking

- Log income and expenses in seconds
- Categorise transactions (Food, Transport, Data, Entertainment, Shopping, Health, and more)
- Search, filter, and group transactions by date
- Export transaction history as PDF or Excel _(coming soon)_
- Set up recurring expenses for bills and subscriptions

### 📊 Budget Management

- Create category-based spending budgets
- Visual progress bars with colour-coded alerts (green → yellow → red)
- Real-time budget impact shown on each transaction
- Monthly and termly budget periods

### 🎯 Savings Goals

- Set savings goals with target amounts and deadlines
- Track progress with visual indicators and motivational messages
- Add funds manually with notes
- View full contribution history

### 📚 Learning Hub

- Curated financial articles, videos, and podcasts from BOF OAU
- Finance 101 Series — 8-episode structured learning path
- Financial Glossary with 20+ terms and daily "Term of the Day"
- Market Pulse Podcast and BOF Newsletter content

### 🔒 Security & Privacy

- 4-digit PIN lock with animated keypad
- Biometric authentication support (Face ID / Fingerprint)
- Balance visibility toggle (hide sensitive amounts)
- Full account deletion with data wipe

---

## Screenshots

> _(Add your screenshots here after building the app)_

| Splash | Dashboard | Expenses | Budget | Savings |
| ------ | --------- | -------- | ------ | ------- |
| —      | —         | —        | —      | —       |

---

## Tech Stack

| Layer             | Technology                                |
| ----------------- | ----------------------------------------- |
| Framework         | React Native (Expo)                       |
| Language          | TypeScript                                |
| Navigation        | React Navigation v6 (Stack + Bottom Tabs) |
| Local Storage     | AsyncStorage                              |
| State Management  | React Context API                         |
| Animations        | React Native Reanimated + Animated API    |
| Charts & Progress | Victory Native, React Native Progress     |
| Bottom Sheets     | @gorhom/bottom-sheet                      |
| Icons             | @expo/vector-icons (Ionicons)             |
| Fonts             | Inter (via @expo-google-fonts/inter)      |
| Date Utilities    | date-fns                                  |
| ID Generation     | uuid                                      |
| Gestures          | React Native Gesture Handler              |

---

## Project Structure

```
campuskobo/
├── src/
│   ├── screens/
│   │   ├── onboarding/        # Splash, Welcome, SignUp, Login, Goal setup
│   │   ├── dashboard/         # Main home screen
│   │   ├── expenses/          # Transactions, Add/Edit, Recurring
│   │   ├── budget/            # Budget list, Create, Detail
│   │   ├── savings/           # Goals list, Create, Detail
│   │   ├── learning/          # Hub, Articles, Finance 101, Glossary, Podcast
│   │   └── profile/           # Settings, Notifications, Security, PIN, FAQ
│   ├── components/            # Reusable UI components
│   ├── navigation/            # App navigator (stack + tabs)
│   ├── context/               # Global state (AppContext)
│   ├── storage/               # AsyncStorage service layer
│   ├── hooks/                 # Custom React hooks (useToast, etc.)
│   ├── utils/                 # Formatters and helpers
│   ├── constants/             # Colors, spacing, typography, learning data
│   └── types/                 # TypeScript type definitions
├── assets/
│   ├── fonts/
│   ├── images/
│   └── icons/
├── App.tsx
├── app.json
└── package.json
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org) (LTS version recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- [Expo Go](https://expo.dev/client) app on your phone (iOS or Android)
- [Git](https://git-scm.com)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/bofaou/campuskobo.git
   cd campuskobo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Open on your device**
   - Scan the QR code shown in the terminal using the **Expo Go** app on your phone
   - Or press `a` for Android emulator, `i` for iOS simulator

### Available Scripts

| Script            | Description                            |
| ----------------- | -------------------------------------- |
| `npm start`       | Start the Expo development server      |
| `npm run android` | Open on Android emulator               |
| `npm run ios`     | Open on iOS simulator                  |
| `npm run web`     | Open in browser (for quick UI testing) |

---

## Usage

### First Launch

1. Open the app — the splash screen auto-navigates after 2.5 seconds
2. Swipe through the 3 Welcome screens
3. Tap **Sign Up** to create your account
4. Complete the 5-step onboarding:
   - Select your financial goals
   - Set a monthly budget
   - Choose your spending categories
   - Log your first expense _(optional)_
5. You're in — welcome to CampusKobo!

### Day-to-Day Use

- Tap the **+** FAB button anywhere to log a new transaction
- Check your **Dashboard** for a live summary of balance, budget, and savings
- Visit the **Budget** tab to see how each spending category is tracking
- Add funds to your **Savings** goals as you save up
- Explore the **Learning Hub** to build financial knowledge

---

## Screens Overview

### Onboarding & Auth (9 screens)

Splash → Welcome 1–3 → Sign Up / Log In → Goal Selection → Monthly Budget Setup → Category Setup → First Expense → Success

### Dashboard (1 screen)

Balance card, budget overview, savings snapshot, recent transactions, FAB

### Expenses (6 screens)

Transaction list, Add/Edit transaction, Transaction detail, Recurring expenses, Add recurring expense

### Budget (4 screens)

Budget list, Create/Edit budget, Budget detail, Budget created success

### Savings (4 screens)

Goals list, Create/Edit goal, Goal detail, Goal created success

### Learning Hub (7 screens)

Hub home, Content detail (Article/Video/Podcast), Finance 101 series, Glossary, Podcast & Newsletter

### Profile & Settings (7 screens)

Profile overview, Notification settings, Security & privacy, Set PIN, Confirm PIN, PIN success, Help & FAQ

---

## Data & Storage

CampusKobo is **100% offline**. All data lives on the user's device using AsyncStorage with the following storage keys:

| Key                       | Description                     |
| ------------------------- | ------------------------------- |
| `campuskobo_user`         | User profile and preferences    |
| `campuskobo_transactions` | All income and expense records  |
| `campuskobo_budgets`      | Category spending budgets       |
| `campuskobo_savings`      | Savings goals and contributions |
| `campuskobo_recurring`    | Recurring expense schedules     |

> No data is ever sent to a server. Deleting the app removes all stored data.

---

## Contributing

This project is maintained by the BOF OAU team. To contribute:

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature-name`
3. Commit your changes — `git commit -m 'Add: your feature description'`
4. Push to your branch — `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style and component patterns when contributing.

---

## Credits

**Designed & Developed for:**
[Bureau of Finance OAU (BOF OAU)](https://instagram.com/bofaou) — Obafemi Awolowo University, Ile-Ife, Nigeria

**Design:** BOF OAU Design Team
**Development:** BOF OAU Tech Team
**Content:** BOF OAU Research Division

---

<p align="center">
  Made with 💚 by BOF OAU &nbsp;•&nbsp; CampusKobo v1.0.0 &nbsp;•&nbsp; April 2026
</p>
