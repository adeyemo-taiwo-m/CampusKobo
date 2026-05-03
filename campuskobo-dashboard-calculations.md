# CampusKobo — Dashboard Calculations & Balance Logic Guide

> **Who this is for:** Your AI coding agent. This document explains exactly how every number on the Dashboard is calculated, where the data comes from, and how to wire it all up so the screen always shows live, accurate figures. Paste this as one complete instruction.

---

## THE CORE QUESTION: WHERE DOES "CURRENT BALANCE" COME FROM?

The balance shown on the dashboard (e.g. ₦42,500) is **not stored anywhere**. It is calculated live, every time, from the transactions array.

```
Current Balance = Sum of ALL income transactions (ever) − Sum of ALL expense transactions (ever)
```

**Example from your design:**
```
Income logged:   ₦60,000  (e.g. salary received)
Expenses logged: ₦17,500  (e.g. food, transport, etc.)
Balance shown:   ₦42,500  ← 60,000 − 17,500
```

This means:
- Every time the user adds an income → balance goes UP
- Every time the user adds an expense → balance goes DOWN
- Every time a transaction is edited or deleted → balance recalculates instantly
- The dashboard NEVER stores a "balance" value — it always derives it fresh from transactions

---

## PART 1 — EVERY NUMBER ON THE DASHBOARD AND HOW IT IS CALCULATED

### 1.1 — Current Balance (the big number)

**What it shows:** How much money the user effectively has right now.

**Formula:**
```typescript
currentBalance = 
  transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  −
  transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
```

**Key rules:**
- Uses ALL transactions ever logged, not just this month
- Can be negative (if user has spent more than they earned)
- Updates instantly when any transaction is added, edited, or deleted
- The eye icon hides/shows this number using local `useState(false)` — the calculation never stops, only the display toggles

**In your design:** ₦42,500 = ₦60,000 income − ₦17,500 expenses ✓

---

### 1.2 — Income This Month (the +₦60,000 figure)

**What it shows:** Total money received in the current calendar month only.

**Formula:**
```typescript
totalIncomeThisMonth = transactions
  .filter(t => 
    t.type === 'income' && 
    new Date(t.date).getMonth() === new Date().getMonth() &&
    new Date(t.date).getFullYear() === new Date().getFullYear()
  )
  .reduce((sum, t) => sum + t.amount, 0)
```

**Key rules:**
- Resets to 0 on the 1st of every new month automatically (because the date filter changes)
- Shows with a green upward arrow and '+' prefix
- Only counts transactions dated within the current month

---

### 1.3 — Expenses This Month (the −₦17,500 figure)

**What it shows:** Total money spent in the current calendar month only.

**Formula:**
```typescript
totalExpensesThisMonth = transactions
  .filter(t => 
    t.type === 'expense' && 
    new Date(t.date).getMonth() === new Date().getMonth() &&
    new Date(t.date).getFullYear() === new Date().getFullYear()
  )
  .reduce((sum, t) => sum + t.amount, 0)
```

**Key rules:**
- Resets to 0 on the 1st of every new month
- Shows with a red downward arrow and '−' prefix
- Does NOT include income transactions

---

### 1.4 — Month Label (e.g. "OCTOBER 2025")

**What it shows:** The current month name and year.

**Formula:**
```typescript
monthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()
// → "OCTOBER 2025"
```

---

### 1.5 — "12% vs Last Month" comparison

**What it shows:** Whether the user spent more or less compared to last month.

**Formula:**
```typescript
// Get last month's total expenses
const now = new Date()
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)

lastMonthExpenses = transactions
  .filter(t =>
    t.type === 'expense' &&
    new Date(t.date).getMonth() === lastMonth.getMonth() &&
    new Date(t.date).getFullYear() === lastMonth.getFullYear()
  )
  .reduce((sum, t) => sum + t.amount, 0)

// Calculate percentage change
percentChange = lastMonthExpenses === 0
  ? 0
  : Math.round(((totalExpensesThisMonth - lastMonthExpenses) / lastMonthExpenses) * 100)

// Display logic
if (percentChange > 0) → show red "↑ {n}% vs Last month" (spending increased)
if (percentChange < 0) → show green "↓ {n}% vs Last month" (spending decreased)
if (percentChange === 0) → show "Same as last month"
```

---

### 1.6 — Budget Section (₦30,000/₦50,000 · 64%)

**What it shows:** How much of the total budget has been spent this month.

**Formula:**
```typescript
// Total budget limit = sum of all budget limitAmounts
totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limitAmount, 0)
// → ₦50,000

// Total budget spent = sum of all budget spentAmounts
// (spentAmounts are recalculated from transactions every time a transaction is saved)
totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0)
// → ₦30,000

// Budget remaining
totalBudgetRemaining = totalBudgetLimit - totalBudgetSpent
// → ₦20,000

// Budget used percentage (for progress bar)
budgetUsedPercent = totalBudgetLimit === 0 
  ? 0 
  : Math.min(100, Math.round((totalBudgetSpent / totalBudgetLimit) * 100))
// → 64%
```

**Progress bar color:**
```typescript
if (budgetUsedPercent < 70)  → GREEN  (#1A9E3F) — "You are doing well"
if (budgetUsedPercent < 90)  → YELLOW (#F59E0B) — "Getting close ⚠️"
if (budgetUsedPercent >= 90) → RED    (#EF4444) — "Budget exceeded! 🚨"
```

**Display:** `₦{totalBudgetSpent} / ₦{totalBudgetLimit}` and `₦{totalBudgetRemaining} left`

---

### 1.7 — Savings Progress Section (New Laptop · ₦45,000/₦150,000 · 30%)

**What it shows:** Progress towards the user's primary (first or most-progressed) savings goal.

**Formula:**
```typescript
// Get the primary goal (highest savedAmount, or first if none started)
primaryGoal = savingsGoals.sort((a, b) => b.savedAmount - a.savedAmount)[0]

// Percentage achieved
goalPercent = primaryGoal.targetAmount === 0
  ? 0
  : Math.min(100, Math.round((primaryGoal.savedAmount / primaryGoal.targetAmount) * 100))
// → 30%

// Amount still needed
goalRemaining = primaryGoal.targetAmount - primaryGoal.savedAmount
// → ₦105,000
```

**Display:** `₦{primaryGoal.savedAmount} / ₦{primaryGoal.targetAmount}` and `{goalPercent}%`

The circular progress ring: `progress = goalPercent / 100` (a value between 0 and 1)

---

### 1.8 — Recent Transactions List

**What it shows:** The last 5 transactions logged, newest first.

**Formula:**
```typescript
recentTransactions = [...transactions]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5)
```

**Each transaction card shows:**
- Category icon (colored circle)
- Name/description
- Date label ('Today', 'Yesterday', or formatted date)
- Amount: green with '+' for income, red with '−' for expense

---

## PART 2 — HOW BUDGET SPENTAMOUNT STAYS ACCURATE

This is the most important wiring in the app. The `spentAmount` on each Budget must always match the actual expense transactions.

**The rule:** `spentAmount` is NEVER entered manually. It is always recalculated from the transactions array.

### When does recalculation happen?

Every time ANY of these actions occurs:
1. User adds a new expense transaction
2. User edits an existing transaction (amount or category changed)
3. User deletes a transaction
4. User creates a new budget (must calculate from existing transactions immediately)

### The recalculation function (must exist in AppContext):

```typescript
const recalculateAllBudgetSpending = async (updatedTransactions: Transaction[]) => {
  const now = new Date()
  
  const updatedBudgets = budgets.map(budget => {
    // Sum only expenses in this category, in the current month
    const spent = updatedTransactions
      .filter(t =>
        t.type === 'expense' &&
        t.category === budget.category &&
        new Date(t.date).getMonth() === now.getMonth() &&
        new Date(t.date).getFullYear() === now.getFullYear()
      )
      .reduce((sum, t) => sum + t.amount, 0)
    
    return { ...budget, spentAmount: spent }
  })
  
  setBudgets(updatedBudgets)
  await StorageService.saveBudgets(updatedBudgets)
}
```

This function must be called at the end of `addTransaction`, `updateTransaction`, and `deleteTransaction` in AppContext — passing the updated transactions array each time.

---

## PART 3 — COMPLETE APPCONTEXT COMPUTED VALUES

Paste this instruction to your agent:

> "In `/src/context/AppContext.tsx`, add all of the following `useMemo` computed values. These are the values every dashboard screen reads from — they are never recalculated inside individual screens."

```typescript
import { useMemo } from 'react'

// ─── DATE HELPERS ────────────────────────────────────────────────────────────

const isThisMonth = (dateString: string): boolean => {
  const d = new Date(dateString)
  const now = new Date()
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

const isLastMonth = (dateString: string): boolean => {
  const d = new Date(dateString)
  const now = new Date()
  const last = new Date(now.getFullYear(), now.getMonth() - 1)
  return d.getMonth() === last.getMonth() && d.getFullYear() === last.getFullYear()
}

const getDaysLeftThisMonth = (): number => {
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  return Math.max(0, lastDay - now.getDate())
}

const getDaysElapsedThisMonth = (): number => Math.max(1, new Date().getDate())

// ─── TRANSACTION TOTALS ───────────────────────────────────────────────────────

const totalIncomeThisMonth = useMemo(() =>
  transactions
    .filter(t => t.type === 'income' && isThisMonth(t.date))
    .reduce((sum, t) => sum + t.amount, 0),
[transactions])

const totalExpensesThisMonth = useMemo(() =>
  transactions
    .filter(t => t.type === 'expense' && isThisMonth(t.date))
    .reduce((sum, t) => sum + t.amount, 0),
[transactions])

const totalIncomeLastMonth = useMemo(() =>
  transactions
    .filter(t => t.type === 'income' && isLastMonth(t.date))
    .reduce((sum, t) => sum + t.amount, 0),
[transactions])

const totalExpensesLastMonth = useMemo(() =>
  transactions
    .filter(t => t.type === 'expense' && isLastMonth(t.date))
    .reduce((sum, t) => sum + t.amount, 0),
[transactions])

// The main balance: ALL income ever minus ALL expenses ever
const currentBalance = useMemo(() => {
  const allIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const allExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  return allIncome - allExpenses
}, [transactions])

// Month-over-month expense change percentage
const expenseChangeVsLastMonth = useMemo(() => {
  if (totalExpensesLastMonth === 0) return null // can't calculate with no last month data
  return Math.round(
    ((totalExpensesThisMonth - totalExpensesLastMonth) / totalExpensesLastMonth) * 100
  )
}, [totalExpensesThisMonth, totalExpensesLastMonth])

// Last 5 transactions, newest first
const recentTransactions = useMemo(() =>
  [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5),
[transactions])

// All transactions sorted newest first (used by Expenses list screen)
const allTransactionsSorted = useMemo(() =>
  [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
[transactions])

// ─── BUDGET TOTALS ────────────────────────────────────────────────────────────

const totalBudgetLimit = useMemo(() =>
  budgets.reduce((sum, b) => sum + b.limitAmount, 0),
[budgets])

const totalBudgetSpent = useMemo(() =>
  budgets.reduce((sum, b) => sum + b.spentAmount, 0),
[budgets])

const totalBudgetRemaining = useMemo(() =>
  Math.max(0, totalBudgetLimit - totalBudgetSpent),
[totalBudgetLimit, totalBudgetSpent])

const budgetUsedPercent = useMemo(() =>
  totalBudgetLimit === 0
    ? 0
    : Math.min(100, Math.round((totalBudgetSpent / totalBudgetLimit) * 100)),
[totalBudgetSpent, totalBudgetLimit])

const budgetStatusLabel = useMemo(() => {
  if (budgetUsedPercent >= 100) return 'exceeded'
  if (budgetUsedPercent >= 90)  return 'critical'
  if (budgetUsedPercent >= 70)  return 'warning'
  return 'healthy'
}, [budgetUsedPercent])

// Each budget enriched with percent, remaining, and status
const enrichedBudgets = useMemo(() =>
  budgets.map(b => {
    const percent = b.limitAmount === 0
      ? 0
      : Math.min(100, Math.round((b.spentAmount / b.limitAmount) * 100))
    const remaining = Math.max(0, b.limitAmount - b.spentAmount)
    const status =
      percent >= 100 ? 'exceeded' :
      percent >= 90  ? 'critical' :
      percent >= 70  ? 'warning'  : 'healthy'
    return { ...b, percent, remaining, status }
  }),
[budgets])

// ─── SAVINGS TOTALS ───────────────────────────────────────────────────────────

const totalSaved = useMemo(() =>
  savingsGoals.reduce((sum, g) => sum + g.savedAmount, 0),
[savingsGoals])

const totalSavingsTarget = useMemo(() =>
  savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0),
[savingsGoals])

// Primary goal for dashboard savings card (most progress first)
const primarySavingsGoal = useMemo(() => {
  if (savingsGoals.length === 0) return null
  return [...savingsGoals].sort((a, b) => b.savedAmount - a.savedAmount)[0]
}, [savingsGoals])

// Primary goal enriched with percent and remaining
const primarySavingsGoalEnriched = useMemo(() => {
  if (!primarySavingsGoal) return null
  const g = primarySavingsGoal
  const percent = g.targetAmount === 0
    ? 0
    : Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100))
  const remaining = Math.max(0, g.targetAmount - g.savedAmount)
  return { ...g, percent, remaining }
}, [primarySavingsGoal])

// All goals enriched
const enrichedSavingsGoals = useMemo(() =>
  savingsGoals.map(g => {
    const percent = g.targetAmount === 0
      ? 0
      : Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100))
    const remaining = Math.max(0, g.targetAmount - g.savedAmount)
    let daysLeft: number | null = null
    if (g.deadline) {
      daysLeft = Math.max(0, Math.ceil(
        (new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ))
    }
    return { ...g, percent, remaining, daysLeft }
  }),
[savingsGoals])
```

Add ALL of these to the context `value` object so screens can access them.

---

## PART 4 — DASHBOARD SCREEN IMPLEMENTATION

Paste this to your agent:

> "Open `/src/screens/dashboard/DashboardScreen.tsx`. Replace the entire file content with the following implementation. This wires every display value to the correct context computed value."

```typescript
import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useAppContext } from '../../context/AppContext'
import { formatCurrency, formatCurrencyWithSign, formatDate } from '../../utils/formatters'
import { ProgressBar } from '../../components/ProgressBar'
import { TransactionCard } from '../../components/TransactionCard'
import { EmptyState } from '../../components/EmptyState'
import { Ionicons } from '@expo/vector-icons'
import { PRIMARY_GREEN, DARK_CARD, TEXT_SECONDARY, RED } from '../../constants/colors'

export const DashboardScreen = ({ navigation }) => {
  const [balanceVisible, setBalanceVisible] = useState(true)

  const {
    user,
    currentBalance,
    totalIncomeThisMonth,
    totalExpensesThisMonth,
    expenseChangeVsLastMonth,
    totalBudgetLimit,
    totalBudgetSpent,
    totalBudgetRemaining,
    budgetUsedPercent,
    budgetStatusLabel,
    primarySavingsGoalEnriched,
    recentTransactions,
    getDaysLeftThisMonth,
  } = useAppContext()

  // Motivational text for budget section
  const budgetMotivation = {
    healthy:  'You are doing well 👍',
    warning:  'Getting close ⚠️',
    critical: 'Budget exceeded! 🚨',
    exceeded: 'Budget exceeded! 🚨',
  }[budgetStatusLabel]

  // Month-vs-last-month display
  const changeLabel = expenseChangeVsLastMonth === null
    ? null
    : expenseChangeVsLastMonth > 0
      ? `↑ ${expenseChangeVsLastMonth}% vs Last month`
      : expenseChangeVsLastMonth < 0
        ? `↓ ${Math.abs(expenseChangeVsLastMonth)}% vs Last month`
        : 'Same as last month'

  const changeColor = expenseChangeVsLastMonth !== null && expenseChangeVsLastMonth > 0
    ? RED
    : PRIMARY_GREEN

  // Current month label
  const monthLabel = new Date()
    .toLocaleString('default', { month: 'long', year: 'numeric' })
    .toUpperCase()

  return (
    <ScrollView style={styles.container}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileSettingsScreen')}>
          {/* User avatar circle with initials */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CK'}
            </Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.greeting}>Hi, {user?.name?.split(' ')[0] || 'there'}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('LearningHubScreen')}>
            <Ionicons name="school-outline" size={24} color={PRIMARY_GREEN} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="notifications-outline" size={24} color={PRIMARY_GREEN} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── BALANCE CARD ── */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>
            {balanceVisible ? formatCurrency(currentBalance) : '₦ ••••••'}
          </Text>
          <TouchableOpacity onPress={() => setBalanceVisible(v => !v)}>
            <Ionicons
              name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color="rgba(255,255,255,0.7)"
            />
          </TouchableOpacity>
        </View>

        {/* Month label + vs last month */}
        <View style={styles.monthRow}>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          {changeLabel && (
            <Text style={[styles.changeLabel, { color: changeColor }]}>
              {changeLabel}
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Income and Expenses */}
        <View style={styles.incomeExpenseRow}>
          <View style={styles.incomeBlock}>
            <Ionicons name="arrow-up" size={14} color="#22C55E" />
            <Text style={styles.incomeLabel}>Income</Text>
            <Text style={styles.incomeAmount}>
              +{formatCurrency(totalIncomeThisMonth)}
            </Text>
          </View>
          <View style={styles.expenseBlock}>
            <Ionicons name="arrow-down" size={14} color="#EF4444" />
            <Text style={styles.expenseLabel}>Expenses</Text>
            <Text style={styles.expenseAmount}>
              -{formatCurrency(totalExpensesThisMonth)}
            </Text>
          </View>
        </View>
      </View>

      {/* ── BUDGET SECTION ── */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BudgetScreen')}
      >
        <Text style={styles.cardTitle}>Budget</Text>
        <View style={styles.budgetAmountRow}>
          <Text style={styles.budgetAmount}>
            {formatCurrency(totalBudgetSpent)}/{formatCurrency(totalBudgetLimit)}
          </Text>
          <Text style={styles.budgetPercent}>{budgetUsedPercent}%</Text>
        </View>
        <ProgressBar progress={budgetUsedPercent / 100} height={8} />
        <Text style={styles.budgetFooter}>
          {formatCurrency(totalBudgetRemaining)} left  •  {budgetMotivation}
        </Text>
      </TouchableOpacity>

      {/* ── SAVINGS SECTION ── */}
      {primarySavingsGoalEnriched ? (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SavingsScreen')}
        >
          <Text style={styles.cardTitle}>Savings Progress</Text>
          <Text style={styles.savingsGoalName}>{primarySavingsGoalEnriched.name}</Text>
          <View style={styles.savingsAmountRow}>
            <Text style={styles.savingsAmount}>
              {formatCurrency(primarySavingsGoalEnriched.savedAmount)}
              <Text style={styles.savingsTarget}>
                /{formatCurrency(primarySavingsGoalEnriched.targetAmount)}
              </Text>
            </Text>
            {/* Circular progress indicator */}
            <Text style={styles.savingsPercent}>{primarySavingsGoalEnriched.percent}%</Text>
          </View>
          <ProgressBar progress={primarySavingsGoalEnriched.percent / 100} height={6} />
          <TouchableOpacity
            style={styles.addFundsButton}
            onPress={() => navigation.navigate('SavingsScreen')}
          >
            <Text style={styles.addFundsText}>Add funds</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SavingsScreen')}
        >
          <Text style={styles.cardTitle}>Savings Progress</Text>
          <Text style={styles.emptyText}>No savings goals yet. Tap to create one.</Text>
        </TouchableOpacity>
      )}

      {/* ── RECENT TRANSACTIONS ── */}
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ExpensesListScreen')}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      {recentTransactions.length === 0 ? (
        <EmptyState
          icon="wallet-outline"
          title="No transactions yet"
          subtitle="Tap + to add your first expense or income"
        />
      ) : (
        recentTransactions.map(t => (
          <TransactionCard
            key={t.id}
            transaction={t}
            onPress={() => navigation.navigate('TransactionDetailScreen', { transactionId: t.id })}
          />
        ))
      )}

      {/* Bottom padding for FAB */}
      <View style={{ height: 100 }} />
    </ScrollView>
  )
}
```

---

## PART 5 — THE HIDE BALANCE FEATURE

The eye icon on the balance card toggles between showing the real number and showing `₦ ••••••`.

```typescript
// In DashboardScreen.tsx
const [balanceVisible, setBalanceVisible] = useState(true)

// In the balance display:
<Text style={styles.balanceAmount}>
  {balanceVisible
    ? formatCurrency(currentBalance)   // shows ₦42,500
    : '₦ ••••••'                       // hides the number
  }
</Text>

// Eye icon button:
<TouchableOpacity onPress={() => setBalanceVisible(v => !v)}>
  <Ionicons
    name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
    size={22}
    color="rgba(255,255,255,0.7)"
  />
</TouchableOpacity>
```

**Important:** The calculation never stops — `currentBalance` is always computed. Only the display is toggled. This means the underlying number is always accurate even when hidden.

**Optional:** If the user has "Hide Balance" turned ON in Security & Privacy settings, initialize `balanceVisible` to `false` on mount:

```typescript
const { user } = useAppContext()
const [balanceVisible, setBalanceVisible] = useState(!user?.hideBalance)
```

---

## PART 6 — CURRENCY FORMATTING (must match the design exactly)

The balance in your design shows `₦42,500.00` with the `.00` in a smaller font. Here is how to implement that:

```typescript
// In formatters.ts
export const formatCurrencyParts = (amount: number): { whole: string; decimal: string } => {
  const abs = Math.abs(amount)
  const whole = Math.floor(abs).toLocaleString('en-NG')
  const decimal = (abs % 1).toFixed(2).slice(1) // → ".00" or ".50"
  return { whole: `₦${whole}`, decimal }
}
```

In the dashboard balance display:

```tsx
const { whole, decimal } = formatCurrencyParts(currentBalance)

<View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
  <Text style={styles.balanceLarge}>{whole}</Text>
  <Text style={styles.balanceDecimal}>{decimal}</Text>
</View>
```

Style the `.00` at a smaller font size (e.g. 24px) while the main number is large (e.g. 48px) — this matches your design exactly.

---

## PART 7 — WHAT TRIGGERS A RE-RENDER

React automatically re-renders the Dashboard when context values change. Here is the exact chain of events when the user adds an expense:

```
User taps + FAB
  → navigates to AddTransactionScreen
  → fills in amount (e.g. ₦5,000), selects category "Food"
  → taps "Save Expense"
  → AddTransactionScreen calls: await addTransaction(newTransaction)

Inside AppContext.addTransaction():
  1. Adds transaction to transactions array in state
  2. Saves updated transactions array to AsyncStorage
  3. Calls recalculateAllBudgetSpending(updatedTransactions)
     → finds the "Food" budget
     → sums all Food expenses this month from updatedTransactions
     → updates Food budget's spentAmount
     → saves updated budgets to AsyncStorage

React detects state changes:
  → transactions array changed → all useMemo values recalculate:
     - totalExpensesThisMonth increases by ₦5,000
     - currentBalance decreases by ₦5,000
     - budgetUsedPercent increases
  → budgets array changed → enrichedBudgets recalculates:
     - Food budget's spentAmount, percent, remaining all update

DashboardScreen re-renders:
  → Balance card shows new lower balance ✓
  → Budget card shows updated spent/remaining/percent ✓
  → Recent transactions shows new expense at top ✓

ExpensesListScreen (if open):
  → Transaction list updates automatically ✓

BudgetScreen (if open):
  → Budget cards update automatically ✓
```

No manual refresh needed. No navigation required. Everything updates in place.

---

## PART 8 — MONTH RESET BEHAVIOUR

The app does NOT manually reset anything at the start of a new month. Instead:

- `totalIncomeThisMonth` and `totalExpensesThisMonth` are always filtered by the current month's date
- On the 1st of November, they start fresh because `isThisMonth()` now returns false for all October transactions
- Budget `spentAmount` values will be 0 at the start of a new month because `recalculateAllBudgetSpending` filters by current month
- This means: if you open the app on November 1st and add a transaction, `recalculateAllBudgetSpending` will recalculate and correctly show ₦0 spent from the previous month's transactions

**No cron job or timer needed.** The date filter handles month resets automatically.

---

## PART 9 — VERIFICATION TEST

After wiring up the dashboard, paste this test sequence to your agent:

> "Test the dashboard calculations by performing these actions in order and confirming the dashboard updates after each step:
>
> **Test 1 — Starting state:**
> - Open the app fresh (no data)
> - Dashboard should show: Balance ₦0, Income ₦0, Expenses ₦0
> - Budget section should show empty state or ₦0/₦0
>
> **Test 2 — Add income:**
> - Tap +, select 'Income' tab, enter ₦60,000, category 'Salary', save
> - Dashboard should show: Balance ₦60,000, Income +₦60,000
>
> **Test 3 — Add expense:**
> - Tap +, select 'Expense' tab, enter ₦17,500, category 'Food', save
> - Dashboard should show: Balance ₦42,500, Expenses −₦17,500
> - If a Food budget exists: Food budget spentAmount should now show ₦17,500
>
> **Test 4 — Create a budget:**
> - Go to Budget tab, create budget: Food, ₦30,000
> - Go back to Dashboard
> - Budget section should show: ₦17,500/₦30,000 · 58%
>
> **Test 5 — Add savings goal:**
> - Go to Savings tab, create goal: 'New Laptop', target ₦150,000, initial deposit ₦45,000
> - Go back to Dashboard
> - Savings section should show: New Laptop · ₦45,000/₦150,000 · 30%
>
> **Test 6 — Delete an expense:**
> - Go to Expenses tab, tap the ₦17,500 Food expense, tap Delete, confirm
> - Go back to Dashboard
> - Balance should return to ₦60,000
> - Food budget spentAmount should return to ₦0
> - Expenses this month should show ₦0
>
> If any test fails, the issue is in the context function (add/update/delete) — confirm that `recalculateAllBudgetSpending` is being called with the updated transactions array in each function."

---

## SUMMARY — EVERY NUMBER ON THE DASHBOARD AT A GLANCE

| Display Element | Source | Formula |
|---|---|---|
| Current Balance (₦42,500) | All transactions ever | All income − All expenses |
| Income this month (+₦60,000) | This month's income transactions | Sum of income where date = this month |
| Expenses this month (−₦17,500) | This month's expense transactions | Sum of expenses where date = this month |
| Month label (OCTOBER 2025) | System date | `new Date().toLocaleString(...)` |
| vs Last month (12%) | Last month's expenses vs this month | `((thisMonth − lastMonth) / lastMonth) × 100` |
| Budget spent (₦30,000) | budgets[].spentAmount | Sum of all budget spentAmounts |
| Budget limit (₦50,000) | budgets[].limitAmount | Sum of all budget limitAmounts |
| Budget percent (64%) | Derived | `(spent / limit) × 100` |
| Budget remaining (₦20,000) | Derived | `limit − spent` |
| Savings goal name | savingsGoals[0].name | Most-progressed goal |
| Savings saved (₦45,000) | savingsGoals[0].savedAmount | Stored + updated via addFundsToGoal |
| Savings target (₦150,000) | savingsGoals[0].targetAmount | Set when goal is created |
| Savings percent (30%) | Derived | `(saved / target) × 100` |
| Recent transactions | transactions array | Last 5, sorted newest first |

---

_CampusKobo Dashboard Calculations Guide — BOF OAU_
_Version 1.0 | May 2026_
