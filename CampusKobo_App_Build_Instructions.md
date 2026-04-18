# CampusKobo — Full Mobile App Build Instructions

### A Student Personal Finance App for BOF OAU

---

> **Who this document is for:** You — a designer who has completed the full wireframe and high-fidelity design of CampusKobo and is now ready to bring the app to life through development. This document walks you through every single step, file, feature, and screen you need to build the complete mobile application. Follow it in order, pasting one feature at a time into your vibe coding agent.

> **Tech Stack Used:** React Native (with Expo) — because it works on both iOS and Android from a single codebase, is beginner-friendly, and has excellent community support.

---

## PART 0 — BEFORE YOU START (Read This First)

### What is React Native + Expo?

React Native is a framework that lets you build mobile apps using JavaScript. Instead of writing separate code for iPhone and Android, you write it once and it runs on both. Expo is a tool built on top of React Native that removes a lot of complex setup — you don't need to install Android Studio or Xcode to start building. You just install one tool and start coding.

### What is a Vibe Coding Agent?

A vibe coding agent (like Cursor, GitHub Copilot, or an AI coding assistant) reads your instructions and writes the code for you. Your job is to give it clear, detailed instructions one feature at a time. This document is structured so that each numbered step is one "paste" into your agent.

### Tools You Need to Install First

Before you begin, install these on your computer:

1. **Node.js** — Download from nodejs.org (choose the LTS version). This is required for everything.
2. **Expo CLI** — After installing Node.js, open your terminal and type: `npm install -g expo-cli`
3. **Expo Go App** — Install this on your phone from the App Store or Google Play. This lets you preview the app live on your phone.
4. **VS Code** — A code editor. Download from code.visualstudio.com.
5. **Git** — For saving your work. Download from git-scm.com.

---

## PART 1 — PROJECT SETUP

### Step 1 — Create the Project

Paste this instruction into your agent:

> "Create a new Expo React Native project called `campuskobo`. Use the blank TypeScript template. Set up the following folder structure inside the project:
>
> - `/src/screens/` — for all app screens
> - `/src/components/` — for reusable UI components
> - `/src/navigation/` — for all navigation logic
> - `/src/context/` — for global state management
> - `/src/hooks/` — for custom React hooks
> - `/src/utils/` — for helper functions
> - `/src/constants/` — for colors, fonts, and spacing values
> - `/src/types/` — for TypeScript type definitions
> - `/src/storage/` — for local database logic
> - `/assets/fonts/` — for custom fonts
> - `/assets/images/` — for images and illustrations
> - `/assets/icons/` — for icon assets"

---

### Step 2 — Install All Required Libraries

Paste this instruction into your agent:

> "Install the following npm packages in the campuskobo project:
>
> **Navigation:**
>
> - `@react-navigation/native`
> - `@react-navigation/bottom-tabs`
> - `@react-navigation/stack`
> - `react-native-screens`
> - `react-native-safe-area-context`
>
> **Storage (Local Database):**
>
> - `@react-native-async-storage/async-storage` — for saving user data locally on the device
>
> **UI and Styling:**
>
> - `react-native-vector-icons` — for icons
> - `@expo/vector-icons` — Expo's built-in icon library
> - `react-native-svg` — for rendering SVG images and charts
> - `victory-native` — for charts and progress visualizations
> - `react-native-progress` — for progress bars and circles
>
> **Animations:**
>
> - `react-native-reanimated` — for smooth animations
> - `react-native-gesture-handler` — for swipe and gesture interactions
>
> **Utilities:**
>
> - `date-fns` — for formatting dates
> - `uuid` — for generating unique IDs for transactions
> - `react-native-modal` — for bottom sheets and modals
> - `@gorhom/bottom-sheet` — for the slide-up bottom sheets used throughout the app
> - `react-native-confetti-cannon` — for the confetti animation on success screens
>
> **Fonts:**
>
> - `expo-font` — for loading custom fonts
> - `@expo-google-fonts/inter` — for the Inter font family used across the app"

---

### Step 3 — Set Up Brand Colors and Design Tokens

Paste this instruction into your agent:

> "Create a file at `/src/constants/colors.ts`. This file defines all the brand colors for CampusKobo based on BOF OAU's green and black identity. Define the following color constants:
>
> ```
> PRIMARY_GREEN = '#1A9E3F'       // Dark green — primary brand color
> LIGHT_GREEN = '#22C55E'         // Light green — secondary/accent
> SURFACE_GREEN = '#E8F5E9'       // Very light green — card backgrounds when selected
> BLACK = '#0A0A0A'               // Near-black for dark cards and headers
> DARK_CARD = '#111827'           // Dark card background (used in header cards)
> WHITE = '#FFFFFF'               // White background
> LIGHT_GRAY = '#F5F5F5'          // Light gray for page backgrounds
> BORDER_GRAY = '#E0E0E0'         // Border color for input fields
> TEXT_PRIMARY = '#0A0A0A'        // Primary text
> TEXT_SECONDARY = '#6B7280'      // Secondary/subtext
> TEXT_PLACEHOLDER = '#9CA3AF'    // Placeholder text in inputs
> RED = '#EF4444'                 // Expense color / danger state
> YELLOW = '#F59E0B'              // Warning state (70-90% budget used)
> SUCCESS_GREEN = '#16A34A'       // Checkmark and success icons
> INCOME_GREEN = '#22C55E'        // Income amount text color
> EXPENSE_RED = '#EF4444'         // Expense amount text color
> ```
>
> Also create `/src/constants/spacing.ts` with spacing values: XS=4, SM=8, MD=16, LG=24, XL=32, XXL=48.
> Create `/src/constants/typography.ts` with font sizes: XS=10, SM=12, MD=14, LG=16, XL=18, XXL=24, XXXL=32, DISPLAY=40.
> Create `/src/constants/index.ts` that exports everything from colors, spacing, and typography."

---

### Step 4 — Set Up TypeScript Types

Paste this instruction into your agent:

> "Create a file at `/src/types/index.ts`. This file defines all the TypeScript data types used throughout the app. Define the following types:
>
> **Transaction type** — represents a single income or expense entry:
>
> - id: string
> - amount: number
> - type: 'income' | 'expense'
> - category: string
> - categoryIcon: string
> - description: string
> - date: string (ISO date string)
> - note: string (optional)
> - isRecurring: boolean
>
> **RecurringExpense type:**
>
> - id: string
> - name: string
> - amount: number
> - category: string
> - frequency: 'daily' | 'weekly' | 'monthly'
> - startDate: string
> - nextDueDate: string
> - isPaused: boolean
>
> **Budget type:**
>
> - id: string
> - category: string
> - categoryIcon: string
> - limitAmount: number
> - spentAmount: number
> - period: 'monthly' | 'termly'
> - startDate: string
> - color: string
>
> **SavingsGoal type:**
>
> - id: string
> - name: string
> - targetAmount: number
> - savedAmount: number
> - deadline: string (optional)
> - createdAt: string
> - contributions: array of { amount: number, date: string, note: string }
>
> **User type:**
>
> - id: string
> - name: string
> - email: string
> - currency: 'NGN' | 'USD'
> - monthlyBudget: number
> - selectedGoals: string array
> - selectedCategories: string array
> - hasPIN: boolean
> - pin: string (optional)
> - hasCompletedOnboarding: boolean
>
> **LearningContent type:**
>
> - id: string
> - title: string
> - type: 'article' | 'video' | 'podcast'
> - category: string
> - duration: string
> - content: string
> - keyTakeaways: string array
> - relatedContentIds: string array
> - isFeatured: boolean"

---

### Step 5 — Set Up Local Storage Service

Paste this instruction into your agent:

> "Create a file at `/src/storage/StorageService.ts`. This file handles all reading and writing of data to the device's local storage using AsyncStorage. The app stores everything locally — no internet or server is needed.
>
> Create the following functions in this file:
>
> **saveUser(user)** — saves the user object to storage with key 'campuskobo_user'
> **getUser()** — retrieves the user object from storage, returns null if not found
>
> **saveTransactions(transactions)** — saves the full array of transactions with key 'campuskobo_transactions'
> **getTransactions()** — retrieves all transactions, returns empty array if none found
> **addTransaction(transaction)** — adds a single transaction to the existing array and saves
> **updateTransaction(id, updatedData)** — finds a transaction by id and updates it
> **deleteTransaction(id)** — removes a transaction by id from the array
>
> **saveBudgets(budgets)** — saves the full budgets array with key 'campuskobo_budgets'
> **getBudgets()** — retrieves all budgets
> **addBudget(budget)** — adds a budget and saves
> **updateBudget(id, updatedData)** — updates a budget by id
> **deleteBudget(id)** — deletes a budget by id
> **updateBudgetSpent(category, amount)** — finds a budget by category and increases its spentAmount
>
> **saveSavingsGoals(goals)** — saves all savings goals with key 'campuskobo_savings'
> **getSavingsGoals()** — retrieves all savings goals
> **addSavingsGoal(goal)** — adds a new goal
> **updateSavingsGoal(id, updatedData)** — updates a goal by id
> **deleteSavingsGoal(id)** — deletes a goal by id
>
> **saveRecurringExpenses(items)** — saves recurring expenses with key 'campuskobo_recurring'
> **getRecurringExpenses()** — retrieves all recurring expenses
> **addRecurringExpense(item)** — adds a recurring expense
> **updateRecurringExpense(id, updatedData)** — updates by id
> **deleteRecurringExpense(id)** — deletes by id
>
> **clearAllData()** — removes all campuskobo keys from storage (used for account deletion)
>
> All functions should use try/catch error handling and log errors to the console."

---

### Step 6 — Set Up Global State with Context

Paste this instruction into your agent:

> "Create a file at `/src/context/AppContext.tsx`. This is the global state manager — it holds all the app data in memory so every screen can access it without passing data through props.
>
> The context should hold and expose:
>
> - `user` — the current user object (or null)
> - `transactions` — array of all Transaction objects
> - `budgets` — array of all Budget objects
> - `savingsGoals` — array of all SavingsGoal objects
> - `recurringExpenses` — array of all RecurringExpense objects
> - `isLoading` — boolean for when data is being loaded
>
> Create the following functions that the context exposes:
>
> - `loadAllData()` — calls all get functions from StorageService and populates the state
> - `addTransaction(transaction)` — adds to state and saves to storage; also calls `updateBudgetSpent` if it's an expense
> - `updateTransaction(id, data)` — updates in state and storage
> - `deleteTransaction(id)` — removes from state and storage
> - `addBudget(budget)` — adds to state and storage
> - `updateBudget(id, data)` — updates in state and storage
> - `deleteBudget(id)` — removes from state and storage
> - `addSavingsGoal(goal)` — adds to state and storage
> - `updateSavingsGoal(id, data)` — updates in state and storage
> - `deleteSavingsGoal(id)` — removes from state and storage
> - `addFundsToGoal(goalId, amount, note)` — increases savedAmount and adds a contribution
> - `addRecurringExpense(item)` — adds to state and storage
> - `updateRecurringExpense(id, data)` — updates in state and storage
> - `deleteRecurringExpense(id)` — removes in state and storage
> - `pauseAllRecurring()` — sets isPaused=true on all recurring expenses
> - `resumeAllRecurring()` — sets isPaused=false on all recurring expenses
> - `updateUser(data)` — updates user in state and storage
> - `setUser(user)` — sets the full user object
>
> Wrap the app with this context provider in `App.tsx`. Use `useEffect` to call `loadAllData()` when the app starts."

---

## PART 2 — NAVIGATION STRUCTURE

### Step 7 — Set Up the App Navigator

Paste this instruction into your agent:

> "Create a file at `/src/navigation/AppNavigator.tsx`. This file controls what the user sees based on whether they are logged in or not, and whether they have completed onboarding.
>
> The navigation structure should be:
>
> **If user has NOT completed onboarding:**
> → Show the Onboarding Stack
>
> **If user HAS completed onboarding:**
> → Show the Main App (Bottom Tab Navigator)
>
> Create the following navigators:
>
> **OnboardingStack** (Stack Navigator) — screens in order:
>
> 1. SplashScreen
> 2. WelcomeScreen1
> 3. WelcomeScreen2
> 4. WelcomeScreen3
> 5. LoginScreen
> 6. SignUpScreen
> 7. GoalSelectionScreen
> 8. SetMonthlyBudgetScreen
> 9. QuickCategorySetupScreen
> 10. FirstExpenseScreen
> 11. OnboardingSuccessScreen
>
> **MainBottomTabNavigator** (Bottom Tab Navigator) — 4 tabs:
>
> 1. HomeTab → HomeStack
> 2. ExpensesTab → ExpensesStack
> 3. BudgetTab → BudgetStack
> 4. SavingsTab → SavingsStack
>
> **HomeStack** (Stack Navigator):
>
> - DashboardScreen (main)
> - LearningHubScreen
> - LearningContentDetailScreen
> - Finance101SeriesScreen
> - GlossaryScreen
> - PodcastNewsletterScreen
> - ProfileSettingsScreen
> - NotificationSettingsScreen
> - SecurityPrivacyScreen
> - SetPINScreen
> - ConfirmPINScreen
> - PINSuccessScreen
> - HelpFAQScreen
>
> **ExpensesStack** (Stack Navigator):
>
> - ExpensesListScreen (main)
> - AddTransactionScreen
> - TransactionDetailScreen
> - RecurringExpensesScreen
> - AddRecurringExpenseScreen
>
> **BudgetStack** (Stack Navigator):
>
> - BudgetScreen (main)
> - CreateBudgetScreen
> - BudgetDetailScreen
>
> **SavingsStack** (Stack Navigator):
>
> - SavingsScreen (main)
> - CreateSavingsGoalScreen
> - SavingsGoalDetailScreen
>
> Hide the header on all screens (use `headerShown: false`). Style the bottom tab bar with the brand green color for active tabs and gray for inactive tabs. Use icons from @expo/vector-icons for each tab."

---

## PART 3 — ONBOARDING SCREENS

### Step 8 — Splash Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/onboarding/SplashScreen.tsx`.
>
> This is the very first screen users see when the app opens. It should:
>
> - Have a pure white background
> - Display the CampusKobo logo centered on screen (use the app name as text if no image asset yet)
> - Show 'CampusKobo' in large bold Inter font in PRIMARY_GREEN color
> - Show 'by BOF OAU' in smaller gray text below
> - After 2.5 seconds automatically navigate to WelcomeScreen1
> - Use `useEffect` with `setTimeout` for the auto-navigation
> - Use `Animated` from React Native to fade the logo in from opacity 0 to 1 over 800ms
> - No buttons, no interaction — purely automatic
> - Use `StatusBar` set to dark content on white background"

---

### Step 9 — Welcome Screens (Onboarding Slides)

Paste this instruction into your agent:

> "Create three files:
>
> - `/src/screens/onboarding/WelcomeScreen1.tsx`
> - `/src/screens/onboarding/WelcomeScreen2.tsx`
> - `/src/screens/onboarding/WelcomeScreen3.tsx`
>
> Each welcome screen follows the same layout:
>
> - White background
> - Large illustration placeholder area at the top (a rounded rectangle with a light green background — this is where the illustration image will go later)
> - Bold title text (centered)
> - Smaller subtitle text below (centered, gray color)
> - Bottom section with two buttons stacked vertically:
>   - Primary button: 'Sign Up' — filled PRIMARY_GREEN background, white text, full width, rounded corners
>   - Secondary button: 'Log In' — no background, PRIMARY_GREEN text, full width
> - Small dot pagination indicator at the bottom showing which screen the user is on (3 dots, current dot is dark green, others are light gray)
>
> Screen 1 content:
>
> - Title: 'Take Control of Your Money'
> - Subtitle: 'Track every kobo, build smart habits, and reach your financial goals.'
> - Current dot: dot 1 active
>
> Screen 2 content:
>
> - Title: 'Know Where Your Money Goes'
> - Subtitle: 'Log expenses instantly, set budgets by category, and see exactly where you stand.'
> - Current dot: dot 2 active
>
> Screen 3 content:
>
> - Title: 'Stay in Control & Reach Your Goals'
> - Subtitle: 'Set savings goals, track progress, and celebrate every milestone.'
> - Current dot: dot 3 active
>
> Navigation behavior:
>
> - 'Sign Up' on Screen 1 → navigates to WelcomeScreen2
> - 'Sign Up' on Screen 2 → navigates to WelcomeScreen3
> - 'Sign Up' on Screen 3 → navigates to SignUpScreen
> - 'Log In' on any screen → navigates to LoginScreen
> - Navigation animation: slide from right"

---

### Step 10 — Sign Up Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/onboarding/SignUpScreen.tsx`.
>
> Layout:
>
> - White background
> - Back arrow at top left (navigates back)
> - Title: 'Create Account' (large, bold, centered or left-aligned)
> - Subtitle: 'Join CampusKobo and take control of your money' (gray, smaller)
>
> Form fields (in order):
>
> 1. **Full Name** — text input with label 'Full Name' above it, placeholder 'Enter your full name'
> 2. **Email** — email input with label 'Email Address', placeholder 'Enter your email'
> 3. **Password** — secure text input with label 'Password', placeholder 'Create a password', eye icon on right to toggle visibility, show password strength indicator below (Weak/Fair/Strong based on length and special characters)
>
> Input field styling:
>
> - Light gray border by default
> - PRIMARY_GREEN border when focused
> - Rounded corners
> - Label text above each field in dark gray
>
> Buttons:
>
> - 'Create Account' — PRIMARY_GREEN full-width button, disabled (gray) when any field is empty, active (green) when all fields are filled
> - Below the button: 'Already have an account? Log In' — the 'Log In' part is PRIMARY_GREEN and tappable, navigating to LoginScreen
>
> Logic:
>
> - Validate email format before allowing submit
> - Validate password is at least 6 characters
> - On successful submit: create a new User object, save it using `setUser` from context, navigate to GoalSelectionScreen
> - Show inline error messages in red below each field if validation fails"

---

### Step 11 — Login Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/onboarding/LoginScreen.tsx`.
>
> Layout:
>
> - White background
> - Back arrow at top left
> - Title: 'Welcome Back' (large, bold)
> - Subtitle: 'Log in to continue your financial journey' (gray, smaller)
>
> Form fields:
>
> 1. **Email** — email input, label 'Email Address', placeholder 'Enter your email'
> 2. **Password** — secure text input, label 'Password', placeholder 'Enter your password', eye icon to toggle visibility
>
> Below the password field:
>
> - 'Forgot Password?' link text aligned to the right, in PRIMARY_GREEN color (tapping shows a simple alert saying 'Password reset sent to your email')
>
> Button:
>
> - 'Log In' — PRIMARY_GREEN full-width button, disabled when fields are empty
>
> Below button:
>
> - 'Don't have an account? Sign Up' — 'Sign Up' is PRIMARY_GREEN and tappable → navigates to SignUpScreen
>
> Logic:
>
> - On login: check if a user exists in storage via `getUser()`. If found, load the user and navigate to the main app (Dashboard). If this is the first time, navigate to GoalSelectionScreen.
> - For prototype purposes, any non-empty email and password combination succeeds"

---

### Step 12 — Goal Selection Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/onboarding/GoalSelectionScreen.tsx`.
>
> This is Onboarding Step 1 of 5. It asks the user what they want to achieve with CampusKobo.
>
> Layout:
>
> - White background
> - Back arrow top left
> - Step progress indicator at top: 5 dots, dot 1 is active (PRIMARY_GREEN), others are light gray
> - Title: 'What do you want to achieve?' (large, bold)
> - Subtitle: 'Select all that apply — we will personalize your experience' (gray)
>
> Three selectable option cards (full width, stacked vertically):
>
> - Card 1: Icon (chart-bar) + 'Track my spending' + 'See exactly where your money goes'
> - Card 2: Icon (wallet) + 'Control my budget' + 'Stop overspending with spending limits'
> - Card 3: Icon (piggy-bank) + 'Save towards goals' + 'Build savings for things that matter'
>
> Card styling (unselected):
>
> - White background, light gray border, rounded corners
> - Icon in a light gray circle on the left
> - Title text bold, description text smaller gray below
>
> Card styling (selected):
>
> - SURFACE_GREEN background, PRIMARY_GREEN border
> - Icon circle becomes PRIMARY_GREEN background with white icon
> - Green checkmark icon appears on the right side of the card
>
> Cards are multi-selectable — tapping toggles selection. Use local state array to track which cards are selected.
>
> Bottom area:
>
> - 'Continue' button — PRIMARY_GREEN, full width, only active if at least one card is selected, gray/disabled otherwise
> - 'Skip' link below button in gray text
>
> On Continue or Skip: save selected goals to user context, navigate to SetMonthlyBudgetScreen"

---

### Step 13 — Set Monthly Budget Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/onboarding/SetMonthlyBudgetScreen.tsx`.
>
> This is Onboarding Step 2 of 5.
>
> Layout:
>
> - White background
> - Back arrow top left
> - Step progress indicator: dot 2 active
> - Title: 'Set Your Monthly Budget' (large, bold)
> - Subtitle: 'How much do you plan to spend this month?' (gray)
>
> Main input:
>
> - Large ₦ amount input field in the center of the screen — this is the primary focus
> - The field has a large font size (32px) so the number is very visible
> - Shows '₦0' by default
> - Numeric keyboard type
> - Light gray border, turns PRIMARY_GREEN when focused
>
> Quick suggestion chips below the input (horizontally scrollable):
>
> - ₦20,000 | ₦30,000 | ₦50,000 | ₦60,000 | ₦80,000
> - Tapping a chip fills the input with that value
> - Selected chip gets PRIMARY_GREEN background with white text
> - Unselected chips have white background with gray border
>
> Helper text below chips:
>
> - 'Most students set between ₦30,000 – ₦80,000' in PRIMARY_GREEN small text with a 💡 icon
>
> Buttons:
>
> - 'Continue' — PRIMARY_GREEN, full width, disabled if amount is 0
> - 'Skip' link below in gray
>
> On Continue or Skip: save the monthlyBudget to user context, navigate to QuickCategorySetupScreen"

---

### Step 14 — Quick Category Setup Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/onboarding/QuickCategorySetupScreen.tsx`.
>
> This is Onboarding Step 3 of 5.
>
> Layout:
>
> - White background
> - Back arrow top left
> - Step progress indicator: dot 3 active
> - Title: 'Your Spending Categories' (large, bold)
> - Subtitle: 'These are pre-selected for you — deselect any you don't need' (gray)
>
> A grid of category cards (2 columns, scrollable):
> Each category card has:
>
> - Colored icon circle at the top center
> - Category name below the icon
> - Selected by default (all 6 are pre-selected)
> - Tapping deselects (border disappears, icon circle goes gray)
> - Tapping again reselects
>
> Categories to show:
>
> 1. Food — fork-knife icon — red circle
> 2. Transport — car icon — blue circle
> 3. Data/Internet — wifi icon — purple circle
> 4. Entertainment — popcorn/game icon — orange circle
> 5. Shopping — bag icon — pink circle
> 6. Health — heart icon — green circle
>
> Selected card styling: SURFACE_GREEN background, PRIMARY_GREEN border, green checkmark top right
> Unselected card styling: white background, light gray border, gray icon
>
> Buttons:
>
> - 'Finish Setup' — PRIMARY_GREEN, full width
> - 'Skip' link below in gray
>
> On Finish or Skip: save selected categories to user context, navigate to FirstExpenseScreen"

---

### Step 15 — First Expense Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/onboarding/FirstExpenseScreen.tsx`.
>
> This is Onboarding Step 4 of 5. It encourages the user to log their first expense.
>
> Layout:
>
> - White background
> - Back arrow top left
> - Step progress indicator: dot 4 active
> - Title: 'Log Your First Expense' (large, bold)
> - Subtitle: 'Start tracking right now — it only takes a few seconds' (gray)
>
> Form (same style as AddTransactionScreen which comes later):
>
> 1. **Amount field:**
>    - Large ₦ input field, numeric keyboard, placeholder '₦0', turns PRIMARY_GREEN border when focused
> 2. **Category selector:**
>    - Label 'Category' above
>    - A tappable row that shows 'Select category' when empty
>    - When tapped, a bottom sheet slides up showing the category options as icon grid
>    - After selection, shows the chosen category name and icon
> 3. **Note field (optional):**
>    - Label 'Note (Optional)'
>    - Placeholder 'e.g. Lunch at Optop kitchen'
>
> Save button behavior:
>
> - Disabled (gray) when amount is 0 or no category selected
> - Active (PRIMARY_GREEN) when both amount and category are filled
>
> Buttons:
>
> - 'Save Expense' — PRIMARY_GREEN full width
> - 'Skip for now' — gray link text below
>
> On save: create a Transaction object, add it to context via `addTransaction()`, navigate to OnboardingSuccessScreen
> On skip: navigate to OnboardingSuccessScreen without saving"

---

### Step 16 — Onboarding Success Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/onboarding/OnboardingSuccessScreen.tsx`.
>
> This is the final onboarding screen. It celebrates the user finishing setup.
>
> Layout:
>
> - Dark green background (DARK_CARD color)
> - Full screen centered content
>
> Content (center of screen):
>
> - A confetti cannon animation that fires when the screen mounts (use react-native-confetti-cannon, fire from the top center, colors should be white, light green, and gold)
> - Large white checkmark inside a white semi-transparent circle
> - Title: 'You're All Set! 🎉' — white, large, bold
> - Subtitle: 'Welcome to CampusKobo. Your financial journey starts today.' — white, slightly smaller
>
> Bottom button:
>
> - 'Go to Dashboard' — white background with PRIMARY_GREEN text, full width, rounded corners
>
> Logic:
>
> - When this screen mounts, update the user's `hasCompletedOnboarding` to `true` and save to storage
> - On 'Go to Dashboard' press: navigate to the main app (MainBottomTabNavigator)
> - Also auto-navigate after 4 seconds if user doesn't tap"

---

## PART 4 — REUSABLE COMPONENTS

### Step 17 — Create Shared UI Components

Paste this instruction into your agent:

> "Create the following reusable component files in `/src/components/`:
>
> **1. `/src/components/Header.tsx`**
> A top navigation bar component that accepts props:
>
> - `title` (string) — text shown in center
> - `showBack` (boolean) — shows back arrow on left if true
> - `showEdit` (boolean) — shows 'Edit' text button on right if true
> - `showBell` (boolean) — shows bell icon on right if true
> - `showLearning` (boolean) — shows graduation cap icon if true
> - `showProfile` (boolean) — shows user avatar/initials on left if true
> - `onBack` (function) — called when back arrow is pressed
> - `onEdit` (function) — called when edit is pressed
> - `onBell` (function) — called when bell is pressed
> - `onLearning` (function) — called when learning icon is pressed
>   Styling: white background, bottom border, proper safe area padding
>
> **2. `/src/components/Button.tsx`**
> A reusable button component with props:
>
> - `title` (string)
> - `onPress` (function)
> - `variant`: 'primary' | 'secondary' | 'danger' | 'outline'
> - `disabled` (boolean)
> - `fullWidth` (boolean)
> - `size`: 'sm' | 'md' | 'lg'
>   Primary = PRIMARY_GREEN background, white text
>   Secondary = light gray background, dark text
>   Danger = red background, white text
>   Outline = white background, PRIMARY_GREEN border and text
>   Disabled = gray background regardless of variant
>
> **3. `/src/components/InputField.tsx`**
> A reusable text input with props:
>
> - `label` (string)
> - `placeholder` (string)
> - `value` (string)
> - `onChangeText` (function)
> - `keyboardType`
> - `secureTextEntry` (boolean)
> - `rightIcon` (component, optional)
> - `error` (string, optional) — shows red error text below
>   Styling: label above, input with rounded border, green border when focused, red border on error
>
> **4. `/src/components/CategoryBottomSheet.tsx`**
> A bottom sheet that slides up when the user needs to pick a category.
> Uses @gorhom/bottom-sheet.
> Shows a grid (3 columns) of category options, each with a colored icon circle and label below.
> Categories: Food, Transport, Data, Entertainment, Shopping, Health, Salary, Freelance, Transfer, Education, Savings, Bills, Others
> Accepts `onSelect(category)` callback and `visible` boolean prop.
>
> **5. `/src/components/TransactionCard.tsx`**
> A single transaction row card for lists. Props:
>
> - `transaction` (Transaction type)
> - `onPress` (function)
>   Shows: colored category icon circle on left, transaction name and description in middle, amount on right (green for income, red for expense), time below amount.
>
> **6. `/src/components/ProgressBar.tsx`**
> A horizontal progress bar. Props:
>
> - `progress` (number 0-1)
> - `height` (number)
> - `backgroundColor` (string, default light gray)
>   Color of fill changes automatically: green if <70%, yellow if 70-90%, red if >90%
>
> **7. `/src/components/DarkCard.tsx`**
> A dark (DARK_CARD background) rounded card used for header sections. Accepts `children` and `style` props. White text by default inside.
>
> **8. `/src/components/EmptyState.tsx`**
> A centered empty state display. Props:
>
> - `icon` (string — icon name from @expo/vector-icons)
> - `title` (string)
> - `subtitle` (string)
> - `buttonTitle` (string, optional)
> - `onButtonPress` (function, optional)
>   Shows icon, title, subtitle, and optional action button centered on screen.
>
> **9. `/src/components/SuccessScreen.tsx`**
> A full-screen success state. Props:
>
> - `title` (string)
> - `subtitle` (string)
> - `onDone` (function)
>   Shows large green checkmark circle, title, subtitle, and a 'Done' button. Auto-navigates after 2.5s if user doesn't press.
>
> **10. `/src/components/DeleteConfirmModal.tsx`**
> A modal that asks the user to confirm a delete action. Props:
>
> - `visible` (boolean)
> - `title` (string) e.g. 'Delete Transaction?'
> - `message` (string)
> - `onCancel` (function)
> - `onConfirm` (function)
>   Shows as a centered overlay modal with Cancel and Delete buttons."

---

## PART 5 — DASHBOARD (HOME SCREEN)

### Step 18 — Dashboard Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/dashboard/DashboardScreen.tsx`.
>
> This is the main home screen — the hub of the app. Use the AppContext to get all data.
>
> **Header (top of screen):**
>
> - Left: User avatar circle showing initials (e.g. 'TA' for Taiwo A.) — tapping navigates to ProfileSettingsScreen
> - Center: nothing (or 'CampusKobo' logo small)
> - Right: graduation cap icon (tapping navigates to LearningHubScreen) and bell icon side by side
>
> **Section 1 — Dark Header Card (DarkCard component):**
>
> - Label: 'Current Balance' in small gray text
> - Large balance amount: ₦{totalBalance} in white, bold, large font
> - Eye icon button next to balance — tapping toggles between showing the actual number and '₦ ••••••'
> - Below the amount: two columns side by side:
>   - Left: Income this month (green upward arrow icon + ₦{totalIncome})
>   - Right: Expenses this month (red downward arrow icon + ₦{totalExpenses})
> - Calculate totalBalance = totalIncome - totalExpenses from transactions array
>
> **Section 2 — Budget Overview Card:**
>
> - Card title: 'Budget Overview'
> - Progress bar showing budget used (ProgressBar component)
> - Text: '₦{spentAmount} of ₦{totalBudget} used'
> - Days remaining text: '{daysLeft} days left this month'
> - Tapping the card navigates to BudgetScreen
>
> **Section 3 — Savings Progress Card:**
>
> - Shows the first/primary savings goal (or empty state if none)
> - Goal name, progress bar, amount text '₦{saved} / ₦{target}'
> - 'Add Funds' small button
> - Tapping the card navigates to SavingsScreen
>
> **Section 4 — Recent Transactions:**
>
> - Label 'Recent Transactions' with 'View all' link on right (navigates to ExpensesListScreen)
> - Show last 5 transactions using TransactionCard component
> - If no transactions: show EmptyState component with wallet icon and message 'No transactions yet. Tap + to add one.'
>
> **FAB (Floating Action Button):**
>
> - Fixed at bottom right, above the tab bar
> - Large round PRIMARY_GREEN button with white '+' icon
> - Tapping navigates to AddTransactionScreen
>
> **Helper functions needed in this file:**
>
> - `getTotalIncome()` — sums all income transactions for current month
> - `getTotalExpenses()` — sums all expense transactions for current month
> - `getTotalBalance()` — income minus expenses
> - `getBudgetTotal()` — sums all budget limitAmounts
> - `getBudgetSpent()` — sums all budget spentAmounts
> - `getDaysLeftInMonth()` — calculates days remaining in current month"

---

## PART 6 — EXPENSES SCREENS

### Step 19 — Expenses List Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/expenses/ExpensesListScreen.tsx`.
>
> This is the main Expenses tab screen, showing all transactions.
>
> **Header:**
>
> - Profile avatar left, bell and graduation cap icons right (same as Dashboard)
> - Title 'Expenses' centered
>
> **Dark summary card:**
>
> - Total spent this month: ₦{totalExpenses} in large white text
> - Small label 'Spent this month'
> - Row below: Income ₦{totalIncome} (green, with up arrow) and Expenses ₦{totalExpenses} (red, with down arrow)
>
> **Search bar:**
>
> - Full width search input with magnifier icon on left
> - Recurring icon button on right (navigates to RecurringExpensesScreen)
> - Export icon button on right (opens an export bottom sheet — see below)
>
> **Filter chips (horizontal scroll):**
>
> - 'This Month' | 'Last Month' | 'This Week' | 'All'
> - Selected chip is PRIMARY_GREEN filled, others are outlined gray
> - Filtering changes which transactions are shown below
>
> **Transactions list:**
>
> - Grouped by date (e.g. 'Today', 'Yesterday', then actual dates like 'Apr 18')
> - Each group has a date header label then the transactions for that date
> - Use TransactionCard component for each row
> - Tapping a transaction navigates to TransactionDetailScreen, passing the transaction object
>
> **Empty state:**
>
> - If no transactions match filter: show EmptyState component with receipt icon and message 'No transactions found'
>
> **Export bottom sheet:**
>
> - Slides up when export icon is tapped
> - Title 'Export Transactions'
> - Two options with icons:
>   - Red document icon + 'Export as PDF'
>   - Green spreadsheet icon + 'Export as Excel'
>   - Cancel button
> - For now both options show an alert: 'Export feature coming soon'
>
> **FAB:**
>
> - Same as Dashboard, navigates to AddTransactionScreen"

---

### Step 20 — Add Transaction Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/expenses/AddTransactionScreen.tsx`.
>
> This screen handles both adding a new transaction and editing an existing one. It receives optional `route.params.transaction` — if provided, the screen is in edit mode.
>
> **Header:**
>
> - Back arrow left
> - Title: 'Add Transaction' (or 'Edit Transaction' in edit mode)
> - No bell, no tab bar
>
> **Toggle tabs at top:**
>
> - Two tabs side by side: 'Expense' and 'Income'
> - Active tab: PRIMARY_GREEN underline or filled style
> - Switching tabs changes the form label text and icon colors
> - Default: Expense tab active
>
> **Form fields:**
>
> 1. **Amount** — Large ₦ input centered at top, big font (40px), numeric keyboard, PRIMARY_GREEN border when focused
> 2. **Category** — Tappable row with label 'Category'. Shows placeholder 'Select category' when empty. When tapped, opens CategoryBottomSheet. After selection shows category name and colored icon.
> 3. **Description** — TextInput with label 'Description', placeholder 'e.g. Lunch at Optop kitchen'
> 4. **Date** — Tappable row showing current date by default. For prototype, show a simple date text that is not interactive.
> 5. **Note (Optional)** — TextInput with label 'Note (Optional)', placeholder 'Add a note...'
>
> **Save button:**
>
> - Text: 'Save Expense' or 'Save Income' depending on active tab
> - In edit mode: 'Save Changes'
> - PRIMARY_GREEN when active, gray when disabled
> - Disabled until Amount > 0 and Category is selected
>
> **Logic:**
>
> - In add mode: create new Transaction with uuid(), call `addTransaction()` from context, navigate back to the success screen
> - In edit mode: call `updateTransaction()` from context with the updated data, navigate back
> - After saving an expense: also call `updateBudgetSpent(category, amount)` to update the matching budget"

---

### Step 21 — Transaction Detail Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/expenses/TransactionDetailScreen.tsx`.
>
> Receives `route.params.transaction` (a Transaction object).
>
> **Header:**
>
> - Back arrow left
> - Title: 'Transaction Details'
> - 'Edit' text button right (navigates to AddTransactionScreen in edit mode, passing the transaction)
>
> **Dark hero card:**
>
> - Category icon (colored circle with icon inside) centered
> - Large amount: '+₦{amount}' in white for income, '-₦{amount}' in white for expense
> - Small tag below: 'Income' or 'Expense' with appropriate background color
> - Month tag: 'This Month'
>
> **Details list (white cards with rows):**
>
> - Date & Time — formatted from transaction.date
> - Description — transaction.description
> - Category — transaction.category with icon
> - Payment Method — 'Main Wallet' (static for now)
> - Notes — transaction.note (if present, else show 'No notes added')
>
> **Budget Impact card (only for expenses, NOT for income):**
>
> - Label 'Budget Impact'
> - Shows which budget category this affects: '{category}: ₦{spentInCategory} / ₦{budgetLimit}'
> - Small progress bar showing category budget usage
>
> **Add Receipt button:**
>
> - Outlined button with camera icon + 'Add Receipt'
> - Tapping shows alert 'Receipt upload coming soon'
>
> **Bottom action buttons:**
>
> - 'Edit Transaction' — PRIMARY_GREEN full width button — navigates to AddTransactionScreen in edit mode
> - 'Delete Transaction' — red text (no background) — tapping opens DeleteConfirmModal
> - On confirm delete: call `deleteTransaction(id)` from context, navigate back to ExpensesListScreen"

---

### Step 22 — Recurring Expenses Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/expenses/RecurringExpensesScreen.tsx`.
>
> **Header:**
>
> - Back arrow left
> - Title: 'Recurring Expenses'
> - No bell icon
>
> **Dark summary card:**
>
> - Label: 'Recurring this month'
> - Total recurring amount: ₦{sum of all non-paused recurring expenses}
> - Progress bar showing how much of budget is recurring
>
> **Top action row (below card):**
>
> - 'Pause All' button on the right — when tapped calls `pauseAllRecurring()` from context and button changes to 'Resume All'
> - 'Resume All' when all are paused — calls `resumeAllRecurring()`
>
> **Recurring expenses list:**
>
> - Each item is a card showing:
>   - Category icon (red circle) on left
>   - Name and frequency below name (e.g. 'Monthly')
>   - Amount on right (in red)
>   - 'Next due: {date}' below amount
>   - 'Active' or 'Paused' badge (green or gray pill)
>   - Swipe left on each item to reveal 'Delete' red button
>
> **Empty state:**
>
> - If no recurring expenses: EmptyState with repeat icon and message 'No recurring expenses yet. Add bills that repeat automatically like data, transport or rent.'
>
> **Bottom button:**
>
> - 'Add Recurring Expense' — PRIMARY_GREEN full width — navigates to AddRecurringExpenseScreen"

---

### Step 23 — Add Recurring Expense Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/expenses/AddRecurringExpenseScreen.tsx`.
>
> **Header:**
>
> - Back arrow, Title: 'Add Recurring Expense'
>
> **Form fields:**
>
> 1. **Amount** — ₦ input, numeric keyboard, large font
> 2. **Name** — text input, label 'Expense Name', placeholder 'e.g. MTN Data Subscription'
> 3. **Category** — tappable row, opens CategoryBottomSheet
> 4. **Frequency** — label 'Repeats', three chip options in a row: 'Daily' | 'Weekly' | 'Monthly'. Only one can be selected at a time. Selected chip = PRIMARY_GREEN background, white text.
> 5. **Start Date** — label 'Starts On', shows today's date by default, tappable (for prototype, static display is fine)
> 6. **Next Due Date** — auto-calculated label (read-only), shows based on frequency selected from start date
>
> **Save button:**
>
> - 'Add Recurring Expense' — PRIMARY_GREEN, disabled until all required fields filled
>
> **Logic:**
>
> - On save: create RecurringExpense object, call `addRecurringExpense()` from context, navigate back"

---

## PART 7 — BUDGET SCREENS

### Step 24 — Budget Main Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/budget/BudgetScreen.tsx`.
>
> This is the Budget tab screen.
>
> **Header:**
>
> - Profile avatar left, bell and learning icons right
> - Title 'Budget'
>
> **Empty State (when no budgets exist):**
>
> - Show the DarkCard at top with ₦0.00 and empty progress bar and 'No budget set yet'
> - Below: EmptyState component with target icon, 'No budgets yet', 'Create a budget to start tracking and controlling your spending'
> - FAB (+ button) at bottom right
>
> **Populated State (when budgets exist):**
>
> Dark summary card at top:
>
> - 'Total Budget' label
> - Large amount: ₦{totalBudget}
> - Progress bar: {totalSpent} / {totalBudget}
> - '₦{totalRemaining} remaining'
> - Motivational text: 'You are doing well 👍' if under 70%, 'Getting close ⚠️' if 70-90%, 'Budget exceeded! 🚨' if over 90%
> - Month label and current month name
>
> Below the card:
>
> - 'Active Budgets' label with 'View all' text on right
> - Budget cards list — each card shows:
>   - Category icon (colored circle) + category name
>   - Amount spent: ₦{spentAmount} / ₦{limitAmount}
>   - Circular progress ring (use react-native-progress CircularProgress)
>   - ProgressBar below
>   - '{daysLeft} days remaining' small text
>   - Color changes with ProgressBar (green/yellow/red based on percentage)
>   - Tapping a budget card navigates to BudgetDetailScreen
>
> **FAB:**
>
> - Bottom right, PRIMARY_GREEN, '+' icon, navigates to CreateBudgetScreen"

---

### Step 25 — Create Budget Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/budget/CreateBudgetScreen.tsx`.
>
> Handles both creating a new budget and editing an existing one. Receives optional `route.params.budget`.
>
> **Header:**
>
> - Back arrow, Title: 'Create Budget' (or 'Edit Budget' in edit mode)
>
> **Form fields:**
>
> 1. **Category** — tappable row, opens CategoryBottomSheet. In edit mode, pre-filled.
> 2. **Budget Amount** — ₦ input, label 'Budget Amount', numeric keyboard. In edit mode, pre-filled.
> 3. **Period** — two chip options: 'Monthly' | 'Termly'. Monthly selected by default. In edit mode, pre-filled.
> 4. **Starts On** — shows current month (static display for now, e.g. 'October 2025')
>
> **Bottom button:**
>
> - 'Create Budget' or 'Save Changes' in edit mode
> - PRIMARY_GREEN, disabled until Category and Amount are filled
>
> **Logic:**
>
> - On create: make Budget object, call `addBudget()`, navigate to a BudgetCreatedSuccessScreen
> - On edit: call `updateBudget()`, navigate back to BudgetDetailScreen
>
> **BudgetCreatedSuccessScreen:**
>
> - Use the SuccessScreen shared component
> - Title: 'Budget Created!'
> - Subtitle: 'Your budget is now active. We will alert you when you are nearing your limit.'
> - On done: navigate back to BudgetScreen"

---

### Step 26 — Budget Detail Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/budget/BudgetDetailScreen.tsx`.
>
> Receives `route.params.budget` (a Budget object). Also pulls transactions from context to show spending for this category.
>
> **Header:**
>
> - Back arrow left
> - Title: 'Budget Details'
> - 'Edit' button right — navigates to CreateBudgetScreen in edit mode
>
> **Dark header card:**
>
> - Category icon (large, colored) + category name
> - Large amount: ₦{spentAmount} / ₦{limitAmount}
> - Circular progress ring showing percentage
> - '₦{remaining} left • {daysLeft} days remaining'
> - Ring color follows the same green/yellow/red logic
>
> **Three summary mini-cards (side by side):**
>
> - 'Daily Average' — ₦{totalSpent / daysElapsed}
> - 'Highest Spend' — ₦{maxSingleTransaction}
> - 'Days Left' — {daysLeft}
>
> **Status message card:**
>
> - GREEN card: 'You're on track with your {category} budget 👍' (under 70%)
> - YELLOW card: 'You're getting close to your limit ⚠️' (70–90%)
> - RED card: 'You've almost exceeded your budget 🚨' (over 90%)
>
> **Transactions in this category:**
>
> - Label '{Category} Transactions'
> - List of transactions filtered by this budget's category, sorted by date
> - Use TransactionCard component
> - 'View all transactions →' link at bottom of list (navigates to ExpensesListScreen filtered by this category)
>
> **Bottom buttons:**
>
> - 'Edit Budget' — PRIMARY_GREEN full width — navigates to CreateBudgetScreen in edit mode
> - 'Delete Budget' — red text outline button — opens DeleteConfirmModal
> - On confirm: call `deleteBudget(id)` from context, navigate back to BudgetScreen"

---

## PART 8 — SAVINGS SCREENS

### Step 27 — Savings Main Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/savings/SavingsScreen.tsx`.
>
> This is the Savings tab screen.
>
> **Header:**
>
> - Profile avatar left, bell and learning icons right
> - Title 'Savings'
>
> **Empty State (no goals):**
>
> - DarkCard with ₦0.00, empty progress bar, 'No active goals yet'
> - EmptyState below with piggy bank icon, 'No savings goals yet', 'Set a goal and start saving towards something you love'
> - FAB at bottom right
>
> **Populated State:**
>
> Dark summary card:
>
> - 'Total Savings' label
> - ₦{sum of all savedAmounts} large, white, bold
> - 'Across {count} active goals' small text
>
> Goals list (below card):
>
> - 'My Goals' label
> - Each goal card:
>   - Goal name + an emoji based on name (🎯 for laptop, 📱 for phone, etc.)
>   - Progress bar: ₦{saved} / ₦{target}
>   - Percentage: {percent}%
>   - Due date if set: 'Due: {deadline}'
>   - Two small buttons: 'Add Funds' (outline) and 'View Details' (text)
>   - Tapping 'View Details' → navigates to SavingsGoalDetailScreen
>   - Tapping 'Add Funds' → opens AddFundsBottomSheet for this goal
>
> **FAB:**
>
> - Bottom right, navigates to CreateSavingsGoalScreen"

---

### Step 28 — Create Savings Goal Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/savings/CreateSavingsGoalScreen.tsx`.
>
> Handles creating and editing savings goals. Receives optional `route.params.goal`.
>
> **Header:**
>
> - Back arrow, Title: 'Create Savings Goal' or 'Edit Savings Goal'
>
> **Form fields:**
>
> 1. **Goal Name** — text input, label 'Goal Name', placeholder 'e.g. New Laptop'
> 2. **Target Amount** — ₦ input, label 'Target Amount', placeholder '₦0', numeric keyboard
> 3. **Target Date (Optional)** — label 'Target Date', shows 'Select a date' when empty, tappable (static for prototype)
> 4. **Initial Deposit (Optional)** — ₦ input, label 'Initial Deposit', placeholder '₦0', hint text: 'How much do you want to start with?'
> 5. **Notes (Optional)** — text input, placeholder 'e.g. Saving from monthly allowance'
>
> **Save button:**
>
> - 'Create Goal' or 'Save Changes' in edit mode
> - PRIMARY_GREEN, disabled until Goal Name and Target Amount are filled
>
> **Logic:**
>
> - On create: build SavingsGoal object (if Initial Deposit > 0, add it as first contribution), call `addSavingsGoal()`, navigate to GoalCreatedSuccessScreen
> - On edit: call `updateSavingsGoal()`, navigate back
>
> **GoalCreatedSuccessScreen:**
>
> - Use SuccessScreen component
> - Title: 'Goal Created!'
> - Subtitle: 'Your savings goal is set. Start adding funds and watch your progress grow.'
> - On done: navigate to SavingsScreen"

---

### Step 29 — Savings Goal Detail Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/savings/SavingsGoalDetailScreen.tsx`.
>
> Receives `route.params.goal` (SavingsGoal object).
>
> **Header:**
>
> - Back arrow left
> - Title: 'Goal Details'
> - 'Edit' button right — navigates to CreateSavingsGoalScreen in edit mode
>
> **Dark header card:**
>
> - Goal name large, white, bold
> - ₦{savedAmount} / ₦{targetAmount}
> - Circular or thick horizontal progress bar
> - '{percent}% achieved'
> - 'Due: {deadline}' if set
> - '₦{remaining} still needed'
>
> **Three summary mini-cards:**
>
> - 'Daily Target' — ₦{remaining / daysLeft} per day
> - 'Monthly Target' — ₦{remaining / monthsLeft} per month
> - 'Days Left' — {daysLeft} (if deadline set) or 'No deadline'
>
> **Motivational status card:**
>
> - Under 30%: 'You're just getting started! Every kobo counts 🚀'
> - 30–70%: 'Great progress! You're {percent}% closer to your {goalName}! 🔥'
> - Over 70%: 'Almost there! Keep going — you're nearly at your goal 🏆'
> - 100%: 'Goal Achieved! 🎉' with confetti
>
> **Recent Contributions list:**
>
> - Label 'Recent Contributions'
> - Each row: '+₦{amount}' in green, '{date}', '{note}' below
> - 'View all →' link if more than 3
>
> **Bottom buttons:**
>
> - 'Add Funds' — PRIMARY_GREEN full width — opens AddFundsBottomSheet
> - 'Delete Goal' — red outline button — opens DeleteConfirmModal
> - On confirm: call `deleteSavingsGoal(id)` from context, navigate back to SavingsScreen"

---

### Step 30 — Add Funds Bottom Sheet

Paste this instruction into your agent:

> "Create the file `/src/components/AddFundsBottomSheet.tsx`.
>
> A bottom sheet that slides up when user wants to add money to a savings goal. Uses @gorhom/bottom-sheet.
>
> Props:
>
> - `visible` (boolean)
> - `goal` (SavingsGoal object)
> - `onClose` (function)
> - `onSuccess` (function)
>
> Content:
>
> - Drag handle at top
> - Title 'Add Funds'
> - Goal name below in gray: 'Saving for: {goalName}'
>
> Current progress section:
>
> - Thin progress bar with '₦{saved} / ₦{target} • {percent}%'
>
> Amount input:
>
> - Label 'How much do you want to add?'
> - Large ₦ input, numeric keyboard
>
> Quick amount chips (horizontal row):
>
> - ₦1,000 | ₦2,000 | ₦5,000 | ₦10,000
> - Tapping fills the input
>
> Source row:
>
> - Label 'Add from'
> - 'Main Wallet' with dropdown arrow (static for now)
>
> Note input (optional):
>
> - Placeholder 'e.g. Monthly savings'
>
> Bottom button:
>
> - 'Add Funds' — PRIMARY_GREEN full width
> - Disabled until amount > 0
>
> Logic:
>
> - On save: call `addFundsToGoal(goalId, amount, note)` from context, close the sheet, call `onSuccess()`
> - Show a toast or brief success message after saving"

---

## PART 9 — LEARNING HUB SCREENS

### Step 31 — Seed Learning Content Data

Paste this instruction into your agent:

> "Create the file `/src/constants/learningData.ts`. This file contains static learning content data — it does not come from a server, it is hardcoded into the app.
>
> Create an array of LearningContent objects. Include at least 8 items covering different types and categories:
>
> Article 1:
>
> - id: 'art-001', type: 'article', category: 'Budgeting', featured: true
> - title: 'How to Stop Overspending as a Student'
> - duration: '3 min read'
> - content: (3-4 paragraphs about budgeting for OAU students)
> - keyTakeaways: ['Separate needs from wants', 'Use the 50/30/20 rule', 'Track every expense daily', 'Review your spending weekly']
>
> Article 2:
>
> - id: 'art-002', type: 'article', category: 'Saving'
> - title: 'Why You Always Run Out of Money'
> - duration: '3 min read'
>
> Video 1:
>
> - id: 'vid-001', type: 'video', category: 'Budgeting'
> - title: 'How to Create Your First Budget'
> - duration: '5 min'
>
> Podcast 1:
>
> - id: 'pod-001', type: 'podcast', category: 'Finance'
> - title: 'Market Pulse Podcast — EP 01'
> - duration: '15 min'
> - content: 'BOF OAU breaks down why students run out of money and how to fix it for good.'
>
> Also create a Finance101Series array with 8 episodes:
>
> - EP 01: Budgeting Basics — 5 min read
> - EP 02: Saving as a Student — 4 min read
> - EP 03: Intro to Investing — 6 min read
> - EP 04: Understanding Loans — 5 min read
> - EP 05: Credit Scores Explained — 4 min read
> - EP 06: How Inflation Affects You — 3 min read
> - EP 07: Building an Emergency Fund — 5 min read
> - EP 08: Financial Goals Setting — 4 min read
>
> Also create a GlossaryTerms array with at least 20 terms:
>
> - Asset, Allowance, Appreciation, Balance, Budget, Bond, Credit Score, Cash Flow, Compound Interest, Debt, Dividend, Depreciation, Expense, Emergency Fund, Equity, Income, Interest, Investment, Inflation, Loan, Net Worth, Savings, Stock, Tax, Transaction
>   Each term has: id, term, partOfSpeech (noun/verb), definition, example, relatedTerms[]"

---

### Step 32 — Learning Hub Home Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/learning/LearningHubScreen.tsx`.
>
> **Header:**
>
> - Back arrow left (since it's accessed from Dashboard icon, not a tab)
> - Title: 'Learning Hub'
>
> Use a ScrollView for the full screen.
>
> **Section 1 — Category Filter (horizontal scroll chips):**
>
> - Chips: 'All' | 'Budgeting' | 'Saving' | 'Investing' | 'Loans' | 'Credit'
> - Selected chip: PRIMARY_GREEN background, white text
> - Filtering the content below based on selected chip
>
> **Section 2 — Featured Content Card:**
>
> - Label 'Featured'
> - Large full-width card with:
>   - Light green gradient background area at top (placeholder for illustration)
>   - 'Budgeting' category chip
>   - Title: 'How to Stop Overspending as a Student'
>   - '📄 Article • 3 min read' small text
>   - Tapping navigates to LearningContentDetailScreen with this content
>
> **Section 3 — Finance 101 Series:**
>
> - Label 'Finance 101 Series' with 'By BOF OAU' small text and 'See all →' on right
> - Horizontal scrollable list of episode cards
> - Each card: colored background (different per episode), 'EP 0{n}' in bold, episode title, duration
> - Colors: green, blue, purple, orange, teal, red, pink, yellow (cycle through)
> - Tapping 'See all →' navigates to Finance101SeriesScreen
> - Tapping an episode navigates to LearningContentDetailScreen
>
> **Section 4 — Latest Content:**
>
> - Label 'Latest'
> - Vertical list of content cards
> - Each card layout: small image placeholder on left, then right side: category chip at top, title in middle, '📄 3 min read' or '🎥 5 min' or '🎧 15 min' at bottom with appropriate icon
> - Tapping navigates to LearningContentDetailScreen
>
> **Section 5 — Quick Access Cards (3 side by side):**
>
> - Finance 101 (book icon) → Finance101SeriesScreen
> - Glossary (document icon) → GlossaryScreen
> - Podcast (headphones icon) → PodcastNewsletterScreen
>
> **Section 6 — From BOF OAU:**
>
> - Label 'From BOF OAU'
> - Podcast card: 🎧 'Market Pulse Podcast' + 'Listen now →'
> - Newsletter card: 📰 'BOF Newsletter' + 'Read now →'
> - Both open PodcastNewsletterScreen"

---

### Step 33 — Learning Content Detail Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/learning/LearningContentDetailScreen.tsx`.
>
> Receives `route.params.content` (LearningContent object) and `route.params.type` ('article' | 'video' | 'podcast').
>
> **Header:**
>
> - Back arrow left
> - Title: 'Article' or 'Video' or 'Podcast' depending on content type
> - Bookmark icon right (tapping toggles bookmark — use local state for now)
>
> Render different layouts based on type:
>
> **For Article:**
>
> - Hero image placeholder (full width, rounded bottom)
> - Category chip
> - Title (large bold)
> - '📄 Article • {duration} • {date}' small row
> - Reading progress bar (thin, shows 0% by default, filling as user scrolls — approximate with ScrollView scroll position)
> - Body text content (paragraphs)
> - Key Takeaways card (light green background, bullet list of takeaways with ✅ before each)
> - 'Apply What You Learned' section with two tappable action cards:
>   - '📊 Create a Budget — Set spending limits for food, transport and more →' tapping navigates to CreateBudgetScreen
>   - '🎯 Set a Savings Goal — Start putting money aside for something you love →' tapping navigates to CreateSavingsGoalScreen
> - 'You Might Also Like' horizontal scroll of 2-3 related content cards
>
> **For Video:**
>
> - Video player placeholder (dark rectangle, large play button in center, '5:00' duration)
> - Same meta info, same Key Takeaways, same action CTAs
> - Under player: short description + bullet points of what the video covers
>
> **For Podcast:**
>
> - Square cover art placeholder (centered, with padding on sides)
> - 'By BOF OAU' subtitle
> - Audio player controls: progress bar, current time '0:00' / total '15:00', ⏪ 15s — ⏸ Play — ⏩ 15s buttons, 1x speed button
> - 'About this episode' text
> - Key Takeaways
> - 'More Episodes' list (shows other podcast content)
> - Same action CTAs"

---

### Step 34 — Finance 101 Series Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/learning/Finance101SeriesScreen.tsx`.
>
> **Header:**
>
> - Back arrow left
> - Title: 'Finance 101'
> - Search icon right
>
> **Header info:**
>
> - 'By BOF OAU' small tag
> - Title: 'Finance 101 Series'
> - Subtitle: 'Everything you need to know about money — simplified for students'
>
> **Progress card (dark card):**
>
> - '🔥 Your Progress'
> - Circular progress ring on right showing overall completion percentage
> - Text: '{n} of 8 episodes completed'
> - Motivational message based on progress:
>   - 0%: 'Start your financial journey today! 🚀'
>   - 1-25%: 'Great start! Keep the momentum going 🔥'
>   - 26-50%: 'You're making real progress! Halfway there 💪'
>   - 51-75%: 'Almost there! You're doing amazing 🌟'
>   - 76-99%: 'So close! One last push to finish 🏆'
>   - 100%: 'You completed the series! Financial genius 🎉'
>
> **Continue card (if user has started):**
>
> - 'Continue where you left off'
> - Shows the next incomplete episode
> - 'Continue Reading' button
>
> **Episode list:**
>
> - Label 'All Episodes'
> - Each episode row:
>   - Colored number badge on left ('01', '02', etc.) — each has a different color
>   - Episode title (bold)
>   - Short description (gray)
>   - Duration text
>   - Status icon on right: ✅ (completed), ▶️ (in progress), ○ (not started), 🔒 (locked — episodes unlock sequentially)
>   - Tapping unlocked episodes → navigates to LearningContentDetailScreen
>
> **About this series (collapsible):**
>
> - Tapping expands/collapses
> - Text: 'Finance 101 is a curated series by the BOF OAU Research Division to help students build strong financial habits from scratch'"

---

### Step 35 — Glossary Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/learning/GlossaryScreen.tsx`.
>
> **Header:**
>
> - Back arrow left
> - Title: 'Financial Glossary'
> - Search icon right
>
> **Search bar:**
>
> - Full width, placeholder 'Search a financial term...'
> - Filters the term list as user types
>
> **Term of the Day card (dark background):**
>
> - Small label '📅 Term of the Day'
> - Large bold term name (rotate based on day of week — different term each day)
> - 'noun' in italic gray
> - Definition text
>
> **Alphabet filter (horizontal scrollable row):**
>
> - Letters A through Z
> - Each letter is a small circle — selected letter is PRIMARY_GREEN filled, others are outlined gray
> - Tapping a letter scrolls the list to that letter's section OR filters to show only that letter's terms
>
> **'Good to Know' section:**
>
> - 3 cards side by side, each with a colored background
> - Card 1: green — 'Budget'
> - Card 2: blue — 'Interest'
> - Card 3: purple — 'Credit Score'
> - Tapping opens the Term Detail bottom sheet for that term
>
> **Terms list (main content):**
>
> - Grouped by letter with a gray section header for each letter
> - Under each letter: show first 2 terms, then 'See more ({n}) →' button
> - Tapping 'See more' expands to show all terms for that letter; button changes to 'See less ↑'
> - Each term row: term name (bold) on left, short definition below, '→' arrow on right
> - Tapping a row opens the Term Detail bottom sheet
>
> **Term Detail bottom sheet:**
>
> - Drag handle
> - Term name (large bold)
> - Part of speech (italic gray)
> - 'Simple Definition:' label + definition text
> - 'Example:' label + example text (with ₦ amounts for Nigerian context)
> - 'Related terms:' label + tappable chip tags for related terms
>
> **Empty search state:**
>
> - When search finds no results: magnifier icon, 'No results found', 'Try different keywords or suggest this term', 'Suggest this term →' button
> - Tapping 'Suggest this term' opens a small bottom sheet with: pre-filled term name input, optional definition input, 'Submit Suggestion' button (shows thank you alert)"

---

### Step 36 — Podcast & Newsletter Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/learning/PodcastNewsletterScreen.tsx`.
>
> **Header:**
>
> - Back arrow, Title: 'From BOF OAU'
>
> ScrollView content:
>
> **Header section:**
>
> - 'BOF OAU' tag chip
> - Title: 'Stay Informed & Keep Learning'
> - Subtitle: 'Fresh financial content from the Bureau of Finance, OAU'
>
> **Category chips (horizontal scroll):**
>
> - 'All' | 'Podcast' | 'Newsletter'
>
> **Featured banner card (full width):**
>
> - Colored placeholder background
> - 'Latest Episode' tag
> - Title: 'Market Pulse — EP 05: How to Invest as a Student'
> - '🎧 Podcast • 18 min'
> - 'Listen Now →' button
> - Tapping navigates to LearningContentDetailScreen with podcast type
>
> **Podcast section:**
>
> - Label 'Market Pulse Podcast' with 'By BOF OAU Research Division' sub-label and 'See all →'
> - List of 3 podcast episode cards:
>   - Cover art placeholder on left
>   - EP number, title, duration
>   - 'Play →' button on right
>   - Tapping navigates to LearningContentDetailScreen
>
> **Newsletter section:**
>
> - Label 'BOF Newsletter' with 'Stay updated with financial news and tips'
> - Two newsletter cards:
>   - April 2026 — Monthly Finance Digest — 📰 5 min read — 'Read →'
>   - March 2026 — Student Money Report — 📰 4 min read — 'Read →'
>
> **About BOF OAU section:**
>
> - Card with short description about BOF OAU
> - Website and Instagram link buttons
>
> **Subscribe section:**
>
> - Title: 'Never Miss an Update'
> - Subtitle text
> - Email input
> - 'Subscribe' button — tapping shows alert 'Subscribed! You will receive updates from BOF OAU.'"

---

## PART 10 — PROFILE & SETTINGS SCREENS

### Step 37 — Profile & Settings Main Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/profile/ProfileSettingsScreen.tsx`.
>
> **Header:**
>
> - Back arrow left
> - Title: 'Profile & Settings'
>
> Use a ScrollView for the whole screen.
>
> **Profile Card (top):**
>
> - Large circle avatar showing user initials (e.g. 'TA') in PRIMARY_GREEN background
> - User full name (large, bold) below
> - User email in gray below name
> - 'Edit Profile' button (small outline button) — tapping opens a bottom sheet with editable Name and Email fields
>
> **Section: Account Preferences**
>
> - Section label 'Account Preferences'
> - Rows (each row: icon + label left, value/arrow right):
>   - Currency → ₦ Nigerian Naira → (dropdown for NGN/USD)
>   - Language → English → (static for now)
>   - Notifications → arrow → navigates to NotificationSettingsScreen
>
> **Section: Security & Privacy**
>
> - Section label
> - Rows:
>   - Security & Privacy → arrow → navigates to SecurityPrivacyScreen
>
> **Section: Support & Help**
>
> - Section label
> - Rows:
>   - Help & FAQ → arrow → navigates to HelpFAQScreen
>   - Contact Support → arrow → opens email client or shows support info alert
>
> **Section: About & Legal**
>
> - Section label
> - Rows:
>   - About CampusKobo → arrow → shows brief alert about the app
>   - About BOF OAU → arrow → shows BOF OAU description alert
>   - Version → '1.0.0' (static text, right-aligned, no arrow)
>
> **Log Out button:**
>
> - Full width, red text outline button at the bottom
> - Tapping shows a confirmation alert 'Are you sure you want to log out?'
> - On confirm: clear user session, navigate back to WelcomeScreen1"

---

### Step 38 — Notification Settings Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/profile/NotificationSettingsScreen.tsx`.
>
> **Header:**
>
> - Back arrow, Title: 'Notifications'
>
> Short description text: 'Choose what you want to be notified about'
>
> **Master toggle row:**
>
> - 'All Notifications' label + description 'Turn off to mute all notifications'
> - Toggle switch (on by default)
> - When turned off: all other toggles below visually gray out but remain visible
>
> **Section: Money Alerts**
>
> - Budget Alerts — 'When you're close to your spending limit' — Toggle ON
> - Savings Reminders — 'When to add funds to your goals' — Toggle ON
> - Bill Reminders — 'Recurring expense due date alerts' — Toggle ON
>
> **Section: Learning**
>
> - New Content — 'When new articles and videos are added' — Toggle ON
> - Finance 101 — 'New episode available alerts' — Toggle OFF
> - Podcast Updates — 'New Market Pulse episode alerts' — Toggle OFF
>
> **Section: General**
>
> - App Updates — 'Latest features and improvements' — Toggle ON
> - BOF OAU Announcements — 'News from Bureau of Finance OAU' — Toggle ON
>
> **Section: Quiet Hours**
>
> - 'Do Not Disturb' — 'Mute all notifications during set hours' — Toggle OFF
> - When turned ON: shows two time pickers below: 'From: 10:00 PM' and 'To: 7:00 AM' (static display for prototype)
>
> All toggle states are managed with local state using `useState`. Changes do not need to persist to storage for now (future enhancement)."

---

### Step 39 — Security & Privacy Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/profile/SecurityPrivacyScreen.tsx`.
>
> **Header:**
>
> - Back arrow, Title: 'Security & Privacy'
>
> Short description: 'Keep your account safe and secure'
>
> **Section: App Lock**
>
> - App Lock — 'Require authentication to open CampusKobo' — Toggle OFF
> - When App Lock is ON, two rows appear below:
>   - Face ID / Fingerprint — 'Use biometric to unlock the app' — Toggle ON
>   - PIN Lock — 'Use PIN to unlock the app' — Toggle OFF
>
> **Section: PIN**
>
> - Set PIN — 'Create a 4-digit PIN for app lock' — arrow → navigates to SetPINScreen
> - Change PIN — 'Update your current PIN' — arrow → navigates to SetPINScreen (with reset mode)
>
> **Section: Biometric**
>
> - Fingerprint Login — 'Use fingerprint to access your account' — Toggle ON
> - Face ID — 'Use Face ID to access your account' — Toggle ON
>
> **Section: Privacy**
>
> - Hide Balance — 'Mask your balance on the home screen' — Toggle OFF (when ON, Dashboard shows ₦ ••••••)
> - Data & Analytics — 'Help improve CampusKobo with usage data' — Toggle ON
>
> **Section: Account**
>
> - Change Password — 'Update your account password' — arrow (shows 'Coming soon' alert)
> - Change Email — 'Update your email address' — arrow (shows 'Coming soon' alert)
> - Delete Account — 'Permanently delete your account' — text in red — tapping opens DeleteConfirmModal with message 'This will permanently delete all your data. This action cannot be undone.' On confirm: call `clearAllData()` and navigate to WelcomeScreen1"

---

### Step 40 — Set PIN Screen

Paste this instruction into your agent:

> "Create three related files:
>
> - `/src/screens/profile/SetPINScreen.tsx`
> - `/src/screens/profile/ConfirmPINScreen.tsx`
> - `/src/screens/profile/PINSuccessScreen.tsx`
>
> **SetPINScreen:**
>
> Header: Back arrow, Title 'Set PIN'
>
> Step progress indicator: 2 steps, step 1 active (PRIMARY_GREEN dot), step 2 gray
>
> Center content:
>
> - Lock icon (large, centered)
> - Title: 'Create your PIN'
> - Subtitle: 'Choose a 4-digit PIN to secure your CampusKobo account'
>
> PIN dot indicators (4 circles in a row, centered):
>
> - Empty circle = digit not yet entered
> - Filled circle (PRIMARY_GREEN) = digit entered
> - These animate as user taps keypad numbers
>
> Number keypad (centered, bottom half of screen):
>
> - 3x4 grid layout
> - Row 1: 1, 2, 3
> - Row 2: 4, 5, 6
> - Row 3: 7, 8, 9
> - Row 4: (empty), 0, ⌫ (backspace)
> - Each key is a large rounded circle (50px)
> - Number bold, sub-letters below in smaller font (e.g. '2' with 'ABC' below)
> - Backspace removes last digit
>
> Security note at very bottom: 🔒 'Your PIN is encrypted and stored securely'
>
> Logic: track pin as state string. When 4 digits entered, auto-navigate to ConfirmPINScreen passing the entered PIN.
>
> ---
>
> **ConfirmPINScreen:**
>
> Same layout as SetPINScreen but:
>
> - Step 2 active
> - Title: 'Confirm your PIN'
> - Subtitle: 'Enter your PIN again to confirm'
>
> Logic: when 4 digits entered, compare with the PIN from SetPINScreen (received via route.params.pin). If they match: navigate to PINSuccessScreen. If they don't match: shake the dots with a brief red color animation, show 'PINs don't match. Try again.' text below the dots, and reset the dots to empty.
>
> ---
>
> **PINSuccessScreen:**
>
> Full screen white background. No header.
>
> Center content:
>
> - Large green checkmark circle (SUCCESS_GREEN background, white checkmark icon inside)
> - Title: 'PIN Created!' (large, bold)
> - Subtitle: 'Your account is now protected with a 4-digit PIN'
> - Small text: 'You can change your PIN anytime in Security & Privacy settings'
>
> Bottom button:
>
> - 'Done' — PRIMARY_GREEN full width
> - On press: save PIN to user context, navigate back to SecurityPrivacyScreen"

---

### Step 41 — Help & FAQ Screen

Paste this instruction into your agent:

> "Create the file `/src/screens/profile/HelpFAQScreen.tsx`.
>
> **Header:**
>
> - Back arrow, Title: 'Help & FAQ'
>
> **Two tabs:** 'FAQ' and 'Contact Us'
>
> - Tab indicator: PRIMARY_GREEN underline on active tab
>
> ---
>
> **FAQ TAB CONTENT:**
>
> Search bar: placeholder 'What are you looking for?'
>
> Quick Help grid (2 columns, 4 cards):
>
> - 🍽️ 'How do I track expenses?' — tapping jumps to Expenses section in the FAQ
> - 📊 'How do I create a budget?' — jumps to Budget section
> - 🎯 'How do I set a savings goal?' — jumps to Savings section
> - 🔐 'How do I reset my password?' — jumps to Account section
>
> Category filter chips: 'All' | 'Expenses' | 'Budget' | 'Savings' | 'Account'
>
> FAQ list (grouped by category, each question expandable):
>
> Expenses:
>
> - 'How do I track expenses?' → 'Tap the + button on the home screen, enter your amount, select a category and tap Save.'
> - 'How do I edit a transaction?' → 'Tap any transaction from the Expenses screen, then tap Edit Transaction.'
> - 'Can I export my transactions?' → 'Yes! On the Expenses screen, tap the export icon next to the search bar.'
>
> Budget:
>
> - 'How do budgets work?' → 'You set a spending limit for each category. The app tracks your expenses and shows how close you are to the limit.'
> - 'How do I create a budget?' → 'Go to the Budget tab and tap the + button. Choose a category and set your limit.'
> - 'Can I reset my monthly budget?' → 'Budgets reset automatically at the start of each month.'
>
> Savings:
>
> - 'How do I set a savings goal?' → 'Go to the Savings tab and tap +. Enter a goal name and target amount.'
> - 'How do I add funds to my goal?' → 'Open any savings goal and tap Add Funds. Enter the amount you want to save.'
> - 'Can I have multiple savings goals?' → 'Yes! You can create as many goals as you need.'
>
> Account:
>
> - 'How do I change my password?' → 'Go to Profile > Security & Privacy > Change Password.'
> - 'How do I delete my account?' → 'Go to Profile > Security & Privacy > Delete Account. Note: this action is permanent.'
>
> 'Still need help?' card at bottom with 'Contact Support →' button
>
> Fixed bottom button: 'Send a Message' — PRIMARY_GREEN
>
> Empty search state: when search finds no FAQ: magnifier icon, 'No results found', 'Try different keywords', 'Contact Support →' button
>
> ---
>
> **CONTACT US TAB CONTENT:**
>
> Title: 'Get in touch with us'
>
> Contact option rows:
>
> - 📧 Email Support — 'support@bofaou.com' — arrow (opens mail client)
> - 💬 WhatsApp — 'Chat with us on WhatsApp' — arrow (opens WhatsApp link)
> - 📱 Instagram — '@bofaou' — arrow (opens Instagram)
>
> Send us a message form:
>
> - 'Your name' input
> - 'Your email' input
> - 'Describe your issue' multiline text input (4 lines tall)
> - 'Send Message' PRIMARY_GREEN button
> - Tapping shows success alert: 'Your message has been sent. We will get back to you within 24 hours.'"

---

## PART 11 — FINAL WIRING AND POLISH

### Step 42 — Wire Up App.tsx

Paste this instruction into your agent:

> "Update `/App.tsx` to:
>
> 1. Wrap everything in the `AppContextProvider` from `/src/context/AppContext.tsx`
> 2. Render `AppNavigator` inside the provider
> 3. Load the Inter font family using `expo-font` and `useFonts` hook before rendering anything
> 4. Show a white splash-like loading screen while fonts are loading
> 5. Set up `react-native-gesture-handler` at the very top of the file (required for bottom sheets and swipe gestures)
> 6. Set up `react-native-reanimated` (required import at top)
> 7. Configure SafeAreaProvider from `react-native-safe-area-context` wrapping the entire app"

---

### Step 43 — Bottom Tab Navigator Styling

Paste this instruction into your agent:

> "Update the MainBottomTabNavigator in `/src/navigation/AppNavigator.tsx` to have the following styling:
>
> Tab bar style:
>
> - Background: WHITE
> - Border top: 1px, BORDER_GRAY color
> - Height: 65px
> - Padding bottom: 8px
>
> Each tab:
>
> - Active color: PRIMARY_GREEN
> - Inactive color: TEXT_SECONDARY (#6B7280)
> - Show label below icon
> - Label font size: 10px
>
> Tab icons (from @expo/vector-icons Ionicons):
>
> - Home tab: 'home' (inactive) / 'home' filled (active)
> - Expenses tab: 'receipt-outline' / 'receipt'
> - Budget tab: 'bar-chart-outline' / 'bar-chart'
> - Savings tab: 'wallet-outline' / 'wallet'
>
> Tab labels:
>
> - Home
> - Expenses
> - Budget
> - Savings"

---

### Step 44 — Number and Currency Formatting

Paste this instruction into your agent:

> "Create the file `/src/utils/formatters.ts` with the following utility functions:
>
> **formatCurrency(amount: number, currency: string = 'NGN'): string**
>
> - Returns '₦1,500' format for NGN (e.g. ₦1,500 or ₦150,000)
> - Returns '$1,500' format for USD
> - Uses `toLocaleString()` for proper comma separation
>
> **formatDate(dateString: string): string**
>
> - Returns 'Today', 'Yesterday', or 'Apr 18' format using date-fns
> - Import format, isToday, isYesterday from 'date-fns'
>
> **formatDateFull(dateString: string): string**
>
> - Returns 'April 18, 2026 • 2:15 PM' format
>
> **formatTime(dateString: string): string**
>
> - Returns '2:15 PM' format
>
> **getProgressColor(percent: number): string**
>
> - Returns PRIMARY_GREEN if percent < 70
> - Returns '#F59E0B' (yellow) if 70 ≤ percent < 90
> - Returns '#EF4444' (red) if percent ≥ 90
>
> **getDaysLeftInMonth(): number**
>
> - Returns number of days remaining in the current month
>
> **getPercentage(current: number, total: number): number**
>
> - Returns 0 if total is 0, otherwise returns Math.round((current / total) \* 100)
>
> **truncateText(text: string, maxLength: number): string**
>
> - Returns text with '...' if longer than maxLength
>
> Export all functions."

---

### Step 45 — Toast / Snackbar Notification Component

Paste this instruction into your agent:

> "Create the file `/src/components/Toast.tsx`. This is a brief notification that slides up from the bottom when an action is completed (like saving a transaction or adding funds).
>
> Props:
>
> - `visible` (boolean)
> - `message` (string)
> - `type`: 'success' | 'error' | 'info'
> - `onHide` (function)
>
> Behavior:
>
> - Slides in from bottom using `Animated`
> - Stays visible for 2 seconds then auto-dismisses
> - Success type: green background, white checkmark icon + message
> - Error type: red background, white X icon + message
> - Info type: dark gray background, info icon + message
>
> Also create a `/src/hooks/useToast.ts` custom hook that manages toast state:
>
> - Returns `showToast(message, type)` function and the toast props to spread onto the Toast component
> - Use this hook in any screen that needs to show feedback after an action"

---

### Step 46 — App-Wide Error Handling and Loading States

Paste this instruction into your agent:

> "Update all screens in the app to:
>
> 1. Show a loading spinner (ActivityIndicator in PRIMARY_GREEN color) centered on screen while data is being loaded from storage
> 2. Wrap all async operations in try/catch blocks and show the Toast component with type 'error' if anything fails
> 3. Show the EmptyState component on list screens when there is no data to display
> 4. Disable all form buttons while a save/update operation is in progress (show loading spinner inside the button instead of the label text)
> 5. On the Dashboard, if `isLoading` from context is true, show skeleton placeholder cards (gray animated rectangles that pulse) instead of the actual data cards. Use `Animated` to create the pulse effect by animating opacity between 0.3 and 1 in a loop."

---

### Step 47 — Final App Icon and Splash Screen

Paste this instruction into your agent:

> "Update the Expo configuration in `app.json`:
>
> 1. Set `name` to 'CampusKobo'
> 2. Set `slug` to 'campuskobo'
> 3. Set `version` to '1.0.0'
> 4. Set `orientation` to 'portrait'
> 5. Set `icon` to './assets/icon.png' (create a simple green square with 'CK' white initials as a placeholder)
> 6. Set `splash.backgroundColor` to '#FFFFFF'
> 7. Set `splash.resizeMode` to 'contain'
> 8. In `android`, set `adaptiveIcon.backgroundColor` to '#1A9E3F'
> 9. Set `ios.bundleIdentifier` to 'com.bofaou.campuskobo'
> 10. Set `android.package` to 'com.bofaou.campuskobo'
> 11. In `plugins`, add 'expo-font' and '@react-native-async-storage/async-storage'
>
> Also create a simple placeholder icon image at `/assets/icon.png` using a green background with 'CK' as white text."

---

### Step 48 — Testing and Running the App

Paste this instruction into your agent:

> "Add the following `scripts` to `package.json`:
>
> - `'start': 'expo start'` — starts the development server
> - `'android': 'expo start --android'` — opens on Android emulator
> - `'ios': 'expo start --ios'` — opens on iOS simulator
> - `'web': 'expo start --web'` — opens in browser for quick testing
>
> Create a README.md file in the root of the project with:
>
> - Project name: CampusKobo
> - Description: Student personal finance app for BOF OAU
> - Setup instructions:
>   1. Clone the repository
>   2. Run `npm install`
>   3. Run `npx expo start`
>   4. Scan the QR code with Expo Go on your phone
> - Tech stack list
> - Folder structure explanation
> - Feature list (all screens and what they do)
> - Credits: Designed and developed for BOF OAU"

---

## PART 12 — FEATURE COMPLETION CHECKLIST

Use this checklist to confirm every feature is built before calling the app complete.

### Onboarding & Auth ✅

- [ ] Splash Screen (auto-navigates)
- [ ] Welcome Screen 1, 2, 3 (with pagination)
- [ ] Sign Up Screen (form validation)
- [ ] Login Screen
- [ ] Goal Selection Screen (multi-select)
- [ ] Set Monthly Budget Screen (chip suggestions)
- [ ] Quick Category Setup Screen (pre-selected grid)
- [ ] First Expense Screen
- [ ] Onboarding Success Screen (confetti)

### Dashboard ✅

- [ ] Empty state (no data yet)
- [ ] Populated state (with data from context)
- [ ] Balance card with hide/show toggle
- [ ] Budget overview card
- [ ] Savings progress card
- [ ] Recent transactions list (last 5)
- [ ] FAB button to Add Transaction
- [ ] Learning Hub icon and bell icon in header

### Expenses ✅

- [ ] Expenses List Screen (with filter chips and search)
- [ ] Date-grouped transaction list
- [ ] Export bottom sheet
- [ ] Add Transaction Screen (expense + income tabs)
- [ ] Category bottom sheet picker
- [ ] Transaction Detail Screen (expense version)
- [ ] Transaction Detail Screen (income version — no budget impact)
- [ ] Delete transaction with confirmation modal
- [ ] Recurring Expenses Screen (active + paused states)
- [ ] Pause All / Resume All functionality
- [ ] Add Recurring Expense Screen

### Budget ✅

- [ ] Budget Screen (empty state)
- [ ] Budget Screen (populated with budget cards)
- [ ] Color-coded progress bars (green/yellow/red)
- [ ] Create Budget Screen
- [ ] Budget Created Success Screen
- [ ] Budget Detail Screen (with spending breakdown)
- [ ] Edit Budget (pre-filled form)
- [ ] Delete Budget with confirmation

### Savings ✅

- [ ] Savings Screen (empty state)
- [ ] Savings Screen (populated with goal cards)
- [ ] Create Savings Goal Screen
- [ ] Goal Created Success Screen
- [ ] Savings Goal Detail Screen
- [ ] Add Funds Bottom Sheet
- [ ] Edit Goal (pre-filled form)
- [ ] Delete Goal with confirmation

### Learning Hub ✅

- [ ] Learning Hub Home Screen (accessed from Dashboard icon)
- [ ] Category filter chips
- [ ] Featured content card
- [ ] Finance 101 horizontal episode scroll
- [ ] Latest content vertical list
- [ ] Content Detail Screen — Article version
- [ ] Content Detail Screen — Video version
- [ ] Content Detail Screen — Podcast version
- [ ] Key Takeaways card
- [ ] 'Apply what you learned' action CTAs
- [ ] Finance 101 Series Screen (with progress + episode list)
- [ ] Episode locked/unlocked/completed states
- [ ] Glossary Screen (search, alphabet filter, Term of Day, see more)
- [ ] Term Detail Bottom Sheet
- [ ] Suggest a Term flow
- [ ] Podcast & Newsletter Screen

### Profile & Settings ✅

- [ ] Profile & Settings Main Screen (all sections)
- [ ] Edit Profile bottom sheet
- [ ] Notification Settings Screen (all toggles)
- [ ] Quiet Hours toggle + times
- [ ] Security & Privacy Screen (all toggles and rows)
- [ ] Hide Balance feature wired to Dashboard
- [ ] Set PIN Screen (keypad)
- [ ] Confirm PIN Screen (with mismatch error animation)
- [ ] PIN Success Screen
- [ ] Help & FAQ Screen (FAQ tab + Contact Us tab)
- [ ] Expandable FAQ items
- [ ] Quick help grid
- [ ] Empty search state with suggest

### Global/Shared ✅

- [ ] Header component used consistently on all screens
- [ ] Button component (all variants)
- [ ] Input field component (with validation states)
- [ ] Category Bottom Sheet
- [ ] Progress Bar (color-coded)
- [ ] Empty State component
- [ ] Success Screen component
- [ ] Delete Confirm Modal
- [ ] Toast notification component
- [ ] Loading spinner / skeleton states
- [ ] Currency formatter (₦ with commas)
- [ ] Date formatter (Today / Yesterday / Apr 18)
- [ ] All local storage read/write working
- [ ] Global context updates reflected on all screens instantly

---

## QUICK REFERENCE — Screen Count

| Section            | Screens                    |
| ------------------ | -------------------------- |
| Onboarding & Auth  | 9                          |
| Dashboard          | 1                          |
| Expenses           | 6                          |
| Budget             | 4                          |
| Savings            | 4                          |
| Learning Hub       | 7                          |
| Profile & Settings | 7                          |
| Shared Components  | 10                         |
| **Total**          | **~48 screens/components** |

---

## IMPORTANT REMINDERS FOR YOUR VIBE CODING AGENT

1. **Paste one step at a time.** Do not paste multiple steps at once — the agent needs to complete and confirm each feature before you move to the next.

2. **After each step, test on Expo Go** by scanning the QR code. Make sure the new screen or feature works before moving on.

3. **If something breaks,** tell your agent exactly what error message you see in the terminal or on the screen. Paste the full error text.

4. **Data persists on device.** Because we use AsyncStorage, all your transactions, budgets, and goals are saved on the phone even after closing the app.

5. **All money amounts are in Nigerian Naira (₦)** — make sure the currency symbol is always ₦ and not $ unless the user switches currency in settings.

6. **Follow the design exactly.** You have a completed wireframe and high-fidelity design — reference it when building each screen. The colors, font sizes, spacing, and layout in this document are derived directly from your design.

7. **The app is offline-first.** There is no internet connection required. All data is stored locally on the device.

---

_Document prepared for: CampusKobo Mobile App — BOF OAU_
_Version: 1.0 | April 2026_
