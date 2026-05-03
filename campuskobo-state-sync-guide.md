# CampusKobo — Complete State Synchronization & Calculation Guide

> **Who this is for:** Your AI coding agent. This document tells you exactly how every number, total, progress bar, and balance in CampusKobo must be calculated, where the calculation must live, and how it must flow to every screen that shows it. Paste one section at a time. Do not skip sections.

> **Core rule:** Every piece of data has ONE place it is calculated — inside `AppContext.tsx`. Every screen reads from context. No screen calculates its own totals. No screen stores its own copy of financial data. When context updates, every screen re-renders automatically because React re-renders all consumers of a context when its value changes.

---

## PART 1 — THE SINGLE SOURCE OF TRUTH ARCHITECTURE

### What must live in AppContext (and nowhere else)

The following calculated values must be **computed inside AppContext** and exposed through the context value. Screens must import these values directly — they must never recalculate them.

Paste this instruction to your agent:

> "Open `/src/context/AppContext.tsx`. Below all the existing state variables and functions, add a section called `// --- DERIVED CALCULATIONS ---`. This section uses `useMemo` to compute all financial totals from the raw state arrays. These memos re-run automatically whenever `transactions`, `budgets`, or `savingsGoals` arrays change. Add ALL of the following computed values to the context value object so every screen can access them.
>
> Install the `useMemo` hook from React if not already imported."

---

## PART 2 — ALL CALCULATIONS THAT MUST EXIST IN APPCONTEXT

Paste this entire block to your agent as one instruction:

> "Inside `/src/context/AppContext.tsx`, add the following `useMemo` computed values. Each one depends on the raw state arrays (`transactions`, `budgets`, `savingsGoals`). They must all be added to the returned context value object at the bottom of the file.
>
> ---
>
> ### 2.1 — Date helpers (add these as plain functions inside the context file, not memos)
>
> ```typescript
> // Returns true if a date string falls within the current calendar month
> const isThisMonth = (dateString: string): boolean => {
>   const date = new Date(dateString);
>   const now = new Date();
>   return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
> };
>
> // Returns true if a date string falls within the current calendar week (Mon–Sun)
> const isThisWeek = (dateString: string): boolean => {
>   const date = new Date(dateString);
>   const now = new Date();
>   const startOfWeek = new Date(now);
>   startOfWeek.setDate(now.getDate() - now.getDay() + 1);
>   startOfWeek.setHours(0, 0, 0, 0);
>   return date >= startOfWeek && date <= now;
> };
>
> // Returns number of days elapsed so far in the current month (minimum 1)
> const getDaysElapsedThisMonth = (): number => {
>   return Math.max(1, new Date().getDate());
> };
>
> // Returns number of days remaining in the current month (minimum 0)
> const getDaysLeftThisMonth = (): number => {
>   const now = new Date();
>   const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
>   return Math.max(0, lastDay - now.getDate());
> };
>
> // Returns total days in the current month
> const getTotalDaysThisMonth = (): number => {
>   const now = new Date();
>   return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
> };
> ```
>
> ---
>
> ### 2.2 — Transaction totals (this month)
>
> ```typescript
> const totalIncomeThisMonth = useMemo(() => {
>   return transactions
>     .filter(t => t.type === 'income' && isThisMonth(t.date))
>     .reduce((sum, t) => sum + t.amount, 0);
> }, [transactions]);
>
> const totalExpensesThisMonth = useMemo(() => {
>   return transactions
>     .filter(t => t.type === 'expense' && isThisMonth(t.date))
>     .reduce((sum, t) => sum + t.amount, 0);
> }, [transactions]);
>
> // Current balance = all-time income minus all-time expenses
> const currentBalance = useMemo(() => {
>   const allIncome = transactions
>     .filter(t => t.type === 'income')
>     .reduce((sum, t) => sum + t.amount, 0);
>   const allExpenses = transactions
>     .filter(t => t.type === 'expense')
>     .reduce((sum, t) => sum + t.amount, 0);
>   return allIncome - allExpenses;
> }, [transactions]);
>
> // Net this month = income this month minus expenses this month
> const netThisMonth = useMemo(() => {
>   return totalIncomeThisMonth - totalExpensesThisMonth;
> }, [totalIncomeThisMonth, totalExpensesThisMonth]);
>
> // Last 5 transactions sorted newest first
> const recentTransactions = useMemo(() => {
>   return [...transactions]
>     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
>     .slice(0, 5);
> }, [transactions]);
>
> // All transactions sorted newest first
> const allTransactionsSorted = useMemo(() => {
>   return [...transactions]
>     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
> }, [transactions]);
> ```
>
> ---
>
> ### 2.3 — Budget totals
>
> ```typescript
> const totalBudgetLimit = useMemo(() => {
>   return budgets.reduce((sum, b) => sum + b.limitAmount, 0);
> }, [budgets]);
>
> const totalBudgetSpent = useMemo(() => {
>   // spentAmount on each budget is updated live every time an expense is added
>   return budgets.reduce((sum, b) => sum + b.spentAmount, 0);
> }, [budgets]);
>
> const totalBudgetRemaining = useMemo(() => {
>   return Math.max(0, totalBudgetLimit - totalBudgetSpent);
> }, [totalBudgetLimit, totalBudgetSpent]);
>
> // 0–100 percent of total budget used
> const budgetUsedPercent = useMemo(() => {
>   if (totalBudgetLimit === 0) return 0;
>   return Math.min(100, Math.round((totalBudgetSpent / totalBudgetLimit) * 100));
> }, [totalBudgetSpent, totalBudgetLimit]);
>
> // Budget status string used by multiple screens
> const budgetStatusLabel = useMemo(() => {
>   if (budgetUsedPercent >= 100) return 'exceeded';
>   if (budgetUsedPercent >= 90) return 'critical';
>   if (budgetUsedPercent >= 70) return 'warning';
>   return 'healthy';
> }, [budgetUsedPercent]);
>
> // Per-budget enriched data (adds percent, remaining, status to each budget object)
> const enrichedBudgets = useMemo(() => {
>   return budgets.map(b => {
>     const percent = b.limitAmount === 0 ? 0 : Math.min(100, Math.round((b.spentAmount / b.limitAmount) * 100));
>     const remaining = Math.max(0, b.limitAmount - b.spentAmount);
>     let status: 'healthy' | 'warning' | 'critical' | 'exceeded' = 'healthy';
>     if (percent >= 100) status = 'exceeded';
>     else if (percent >= 90) status = 'critical';
>     else if (percent >= 70) status = 'warning';
>     return { ...b, percent, remaining, status };
>   });
> }, [budgets]);
> ```
>
> ---
>
> ### 2.4 — Savings totals
>
> ```typescript
> const totalSaved = useMemo(() => {
>   return savingsGoals.reduce((sum, g) => sum + g.savedAmount, 0);
> }, [savingsGoals]);
>
> const totalSavingsTarget = useMemo(() => {
>   return savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
> }, [savingsGoals]);
>
> const overallSavingsPercent = useMemo(() => {
>   if (totalSavingsTarget === 0) return 0;
>   return Math.min(100, Math.round((totalSaved / totalSavingsTarget) * 100));
> }, [totalSaved, totalSavingsTarget]);
>
> // Primary goal = the one with the most progress (or the first one if none started)
> const primarySavingsGoal = useMemo(() => {
>   if (savingsGoals.length === 0) return null;
>   return [...savingsGoals].sort((a, b) => b.savedAmount - a.savedAmount)[0];
> }, [savingsGoals]);
>
> // Enriched goals (adds percent, remaining, daysLeft to each goal object)
> const enrichedSavingsGoals = useMemo(() => {
>   return savingsGoals.map(g => {
>     const percent = g.targetAmount === 0 ? 0 : Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
>     const remaining = Math.max(0, g.targetAmount - g.savedAmount);
>     let daysLeft: number | null = null;
>     if (g.deadline) {
>       const diff = new Date(g.deadline).getTime() - Date.now();
>       daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
>     }
>     return { ...g, percent, remaining, daysLeft };
>   });
> }, [savingsGoals]);
> ```
>
> ---
>
> ### 2.5 — Category-level spending (used by Budget Detail screen)
>
> ```typescript
> // Returns total expenses this month grouped by category
> const expensesByCategory = useMemo(() => {
>   const map: Record<string, number> = {};
>   transactions
>     .filter(t => t.type === 'expense' && isThisMonth(t.date))
>     .forEach(t => {
>       map[t.category] = (map[t.category] || 0) + t.amount;
>     });
>   return map;
> }, [transactions]);
>
> // Returns transactions filtered to a specific category, sorted newest first
> const getTransactionsByCategory = (category: string) => {
>   return [...transactions]
>     .filter(t => t.category === category)
>     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
> };
>
> // Returns the highest single transaction amount for a given category this month
> const getHighestExpenseInCategory = (category: string): number => {
>   const amounts = transactions
>     .filter(t => t.type === 'expense' && t.category === category && isThisMonth(t.date))
>     .map(t => t.amount);
>   return amounts.length > 0 ? Math.max(...amounts) : 0;
> };
>
> // Returns daily average spend in a category this month
> const getDailyAverageInCategory = (category: string): number => {
>   const total = transactions
>     .filter(t => t.type === 'expense' && t.category === category && isThisMonth(t.date))
>     .reduce((sum, t) => sum + t.amount, 0);
>   return Math.round(total / getDaysElapsedThisMonth());
> };
> ```
>
> ---
>
> ### 2.6 — Recurring expense totals
>
> ```typescript
> const totalRecurringMonthly = useMemo(() => {
>   return recurringExpenses
>     .filter(r => !r.isPaused)
>     .reduce((sum, r) => {
>       if (r.frequency === 'monthly') return sum + r.amount;
>       if (r.frequency === 'weekly') return sum + r.amount * 4;
>       if (r.frequency === 'daily') return sum + r.amount * 30;
>       return sum;
>     }, 0);
> }, [recurringExpenses]);
> ```
>
> ---
>
> ### 2.7 — Add ALL computed values to the context value object
>
> Find the `value` object returned by the context provider (near the bottom of the file). Add every computed value to it:
>
> ```typescript
> const value = {
>   // ... all existing state and functions ...
>
>   // Computed totals
>   totalIncomeThisMonth,
>   totalExpensesThisMonth,
>   currentBalance,
>   netThisMonth,
>   recentTransactions,
>   allTransactionsSorted,
>   totalBudgetLimit,
>   totalBudgetSpent,
>   totalBudgetRemaining,
>   budgetUsedPercent,
>   budgetStatusLabel,
>   enrichedBudgets,
>   totalSaved,
>   totalSavingsTarget,
>   overallSavingsPercent,
>   primarySavingsGoal,
>   enrichedSavingsGoals,
>   expensesByCategory,
>   getTransactionsByCategory,
>   getHighestExpenseInCategory,
>   getDailyAverageInCategory,
>   totalRecurringMonthly,
>   getDaysLeftThisMonth,
>   getDaysElapsedThisMonth,
>   getTotalDaysThisMonth,
>   isThisMonth,
> };
> ```"

---

## PART 3 — FIX THE BUDGET SPENT CALCULATION (CRITICAL)

This is the most important wiring fix. Every time an expense is added, edited, or deleted, the matching budget's `spentAmount` must update immediately.

Paste this to your agent:

> "In `/src/context/AppContext.tsx`, find the `addTransaction` function. Replace it entirely with the version below. This version recalculates ALL budget `spentAmount` values from scratch every time any transaction changes. This is called 'derived state' — the budget's spent amount is never stored independently; it is always recalculated from the real transaction records.
>
> ```typescript
> // Call this after ANY change to transactions (add, edit, delete)
> // It rebuilds spentAmount on every budget from actual transaction data
> const recalculateAllBudgetSpending = async (updatedTransactions: Transaction[]) => {
>   const updatedBudgets = budgets.map(budget => {
>     const spent = updatedTransactions
>       .filter(t =>
>         t.type === 'expense' &&
>         t.category === budget.category &&
>         isThisMonth(t.date)
>       )
>       .reduce((sum, t) => sum + t.amount, 0);
>     return { ...budget, spentAmount: spent };
>   });
>   setBudgets(updatedBudgets);
>   await StorageService.saveBudgets(updatedBudgets);
> };
>
> const addTransaction = async (transaction: Transaction) => {
>   try {
>     const updatedTransactions = [...transactions, transaction];
>     setTransactions(updatedTransactions);
>     await StorageService.saveTransactions(updatedTransactions);
>     await recalculateAllBudgetSpending(updatedTransactions);
>   } catch (error) {
>     console.error('addTransaction error:', error);
>   }
> };
>
> const updateTransaction = async (id: string, updatedData: Partial<Transaction>) => {
>   try {
>     const updatedTransactions = transactions.map(t =>
>       t.id === id ? { ...t, ...updatedData } : t
>     );
>     setTransactions(updatedTransactions);
>     await StorageService.saveTransactions(updatedTransactions);
>     await recalculateAllBudgetSpending(updatedTransactions);
>   } catch (error) {
>     console.error('updateTransaction error:', error);
>   }
> };
>
> const deleteTransaction = async (id: string) => {
>   try {
>     const updatedTransactions = transactions.filter(t => t.id !== id);
>     setTransactions(updatedTransactions);
>     await StorageService.saveTransactions(updatedTransactions);
>     await recalculateAllBudgetSpending(updatedTransactions);
>   } catch (error) {
>     console.error('deleteTransaction error:', error);
>   }
> };
> ```
>
> Also update `addBudget` and `deleteBudget` so that when a new budget is created or deleted, it immediately recalculates spending for the new budget list:
>
> ```typescript
> const addBudget = async (budget: Budget) => {
>   try {
>     const newBudgets = [...budgets, budget];
>     // Immediately calculate spent for this new budget from existing transactions
>     const recalculated = newBudgets.map(b => {
>       const spent = transactions
>         .filter(t => t.type === 'expense' && t.category === b.category && isThisMonth(t.date))
>         .reduce((sum, t) => sum + t.amount, 0);
>       return { ...b, spentAmount: spent };
>     });
>     setBudgets(recalculated);
>     await StorageService.saveBudgets(recalculated);
>   } catch (error) {
>     console.error('addBudget error:', error);
>   }
> };
>
> const deleteBudget = async (id: string) => {
>   try {
>     const updatedBudgets = budgets.filter(b => b.id !== id);
>     setBudgets(updatedBudgets);
>     await StorageService.saveBudgets(updatedBudgets);
>   } catch (error) {
>     console.error('deleteBudget error:', error);
>   }
> };
> ```"

---

## PART 4 — FIX THE SAVINGS GOAL CALCULATION

Paste this to your agent:

> "In `/src/context/AppContext.tsx`, replace the `addFundsToGoal` function with this version. It correctly updates the `savedAmount` and appends to the `contributions` array, then saves both to storage:
>
> ```typescript
> const addFundsToGoal = async (goalId: string, amount: number, note: string = '') => {
>   try {
>     const updatedGoals = savingsGoals.map(g => {
>       if (g.id !== goalId) return g;
>       const newContribution = {
>         amount,
>         date: new Date().toISOString(),
>         note,
>       };
>       return {
>         ...g,
>         savedAmount: g.savedAmount + amount,
>         contributions: [...(g.contributions || []), newContribution],
>       };
>     });
>     setSavingsGoals(updatedGoals);
>     await StorageService.saveSavingsGoals(updatedGoals);
>   } catch (error) {
>     console.error('addFundsToGoal error:', error);
>   }
> };
>
> const updateSavingsGoal = async (id: string, updatedData: Partial<SavingsGoal>) => {
>   try {
>     const updatedGoals = savingsGoals.map(g =>
>       g.id === id ? { ...g, ...updatedData } : g
>     );
>     setSavingsGoals(updatedGoals);
>     await StorageService.saveSavingsGoals(updatedGoals);
>   } catch (error) {
>     console.error('updateSavingsGoal error:', error);
>   }
> };
>
> const deleteSavingsGoal = async (id: string) => {
>   try {
>     const updatedGoals = savingsGoals.filter(g => g.id !== id);
>     setSavingsGoals(updatedGoals);
>     await StorageService.saveSavingsGoals(updatedGoals);
>   } catch (error) {
>     console.error('deleteSavingsGoal error:', error);
>   }
> };
> ```"

---

## PART 5 — UPDATE THE TYPESCRIPT CONTEXT TYPE

Paste this to your agent:

> "In `/src/types/index.ts`, update the `AppContextType` interface to include all the new computed values. This ensures TypeScript will error if any screen tries to use a value that doesn't exist in context. Add these to the interface:
>
> ```typescript
> export interface AppContextType {
>   // Raw state
>   user: User | null;
>   transactions: Transaction[];
>   budgets: Budget[];
>   savingsGoals: SavingsGoal[];
>   recurringExpenses: RecurringExpense[];
>   isLoading: boolean;
>
>   // Computed transaction totals
>   totalIncomeThisMonth: number;
>   totalExpensesThisMonth: number;
>   currentBalance: number;
>   netThisMonth: number;
>   recentTransactions: Transaction[];
>   allTransactionsSorted: Transaction[];
>
>   // Computed budget totals
>   totalBudgetLimit: number;
>   totalBudgetSpent: number;
>   totalBudgetRemaining: number;
>   budgetUsedPercent: number;
>   budgetStatusLabel: 'healthy' | 'warning' | 'critical' | 'exceeded';
>   enrichedBudgets: EnrichedBudget[];
>
>   // Computed savings totals
>   totalSaved: number;
>   totalSavingsTarget: number;
>   overallSavingsPercent: number;
>   primarySavingsGoal: SavingsGoal | null;
>   enrichedSavingsGoals: EnrichedSavingsGoal[];
>
>   // Category helpers
>   expensesByCategory: Record<string, number>;
>   getTransactionsByCategory: (category: string) => Transaction[];
>   getHighestExpenseInCategory: (category: string) => number;
>   getDailyAverageInCategory: (category: string) => number;
>
>   // Recurring
>   totalRecurringMonthly: number;
>
>   // Date helpers
>   getDaysLeftThisMonth: () => number;
>   getDaysElapsedThisMonth: () => number;
>   getTotalDaysThisMonth: () => number;
>   isThisMonth: (dateString: string) => boolean;
>
>   // All existing action functions
>   loadAllData: () => Promise<void>;
>   addTransaction: (transaction: Transaction) => Promise<void>;
>   updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
>   deleteTransaction: (id: string) => Promise<void>;
>   addBudget: (budget: Budget) => Promise<void>;
>   updateBudget: (id: string, data: Partial<Budget>) => Promise<void>;
>   deleteBudget: (id: string) => Promise<void>;
>   addSavingsGoal: (goal: SavingsGoal) => Promise<void>;
>   updateSavingsGoal: (id: string, data: Partial<SavingsGoal>) => Promise<void>;
>   deleteSavingsGoal: (id: string) => Promise<void>;
>   addFundsToGoal: (goalId: string, amount: number, note?: string) => Promise<void>;
>   addRecurringExpense: (item: RecurringExpense) => Promise<void>;
>   updateRecurringExpense: (id: string, data: Partial<RecurringExpense>) => Promise<void>;
>   deleteRecurringExpense: (id: string) => Promise<void>;
>   pauseAllRecurring: () => Promise<void>;
>   resumeAllRecurring: () => Promise<void>;
>   updateUser: (data: Partial<User>) => Promise<void>;
>   setUser: (user: User) => void;
> }
>
> // Add these two new enriched types to the file:
> export interface EnrichedBudget extends Budget {
>   percent: number;       // 0–100
>   remaining: number;     // limitAmount - spentAmount, min 0
>   status: 'healthy' | 'warning' | 'critical' | 'exceeded';
> }
>
> export interface EnrichedSavingsGoal extends SavingsGoal {
>   percent: number;       // 0–100
>   remaining: number;     // targetAmount - savedAmount, min 0
>   daysLeft: number | null;  // null if no deadline set
> }
> ```"

---

## PART 6 — UPDATE EACH SCREEN TO USE CONTEXT VALUES

### 6.1 — Dashboard Screen

Paste this to your agent:

> "Open `/src/screens/dashboard/DashboardScreen.tsx`. Remove ALL local calculation functions (`getTotalIncome`, `getTotalExpenses`, `getTotalBalance`, `getBudgetTotal`, `getBudgetSpent`, `getDaysLeftInMonth`). Replace them by pulling the pre-computed values from context.
>
> Update the destructuring at the top of the component to:
>
> ```typescript
> const {
>   totalIncomeThisMonth,
>   totalExpensesThisMonth,
>   currentBalance,
>   totalBudgetLimit,
>   totalBudgetSpent,
>   totalBudgetRemaining,
>   budgetUsedPercent,
>   budgetStatusLabel,
>   primarySavingsGoal,
>   enrichedSavingsGoals,
>   recentTransactions,
>   getDaysLeftThisMonth,
>   user,
> } = useAppContext();
> ```
>
> Update every display value to use these context values:
>
> - Balance card: show `formatCurrency(currentBalance)`
> - Income row: show `formatCurrency(totalIncomeThisMonth)`
> - Expenses row: show `formatCurrency(totalExpensesThisMonth)`
> - Budget progress bar: `progress={budgetUsedPercent / 100}` (0–1 range)
> - Budget text: `₦${formatCurrency(totalBudgetSpent)} of ₦${formatCurrency(totalBudgetLimit)} used`
> - Budget days remaining: `${getDaysLeftThisMonth()} days left this month`
> - Budget motivational text: derive from `budgetStatusLabel`:
>   - `'healthy'` → `'You are doing well 👍'`
>   - `'warning'` → `'Getting close ⚠️'`
>   - `'critical'` or `'exceeded'` → `'Budget exceeded! 🚨'`
> - Savings card: use `primarySavingsGoal` from context (already enriched with percent and remaining)
> - Recent transactions list: use `recentTransactions` from context (already sorted and sliced to 5)
>
> Do NOT recalculate anything locally. If a value is not in context yet, go back to Part 2 and add it."

---

### 6.2 — Expenses List Screen

Paste this to your agent:

> "Open `/src/screens/expenses/ExpensesListScreen.tsx`. Update the destructuring to pull from context:
>
> ```typescript
> const {
>   allTransactionsSorted,
>   totalIncomeThisMonth,
>   totalExpensesThisMonth,
> } = useAppContext();
> ```
>
> The filter chips ('This Month', 'Last Month', 'This Week', 'All') must filter the `allTransactionsSorted` array locally using the dates on each transaction. This is the ONE place filtering is allowed in a screen — but the base data still comes from context.
>
> ```typescript
> const filteredTransactions = useMemo(() => {
>   const now = new Date();
>   switch (activeFilter) {
>     case 'This Month':
>       return allTransactionsSorted.filter(t => {
>         const d = new Date(t.date);
>         return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
>       });
>     case 'Last Month':
>       return allTransactionsSorted.filter(t => {
>         const d = new Date(t.date);
>         const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
>         return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
>       });
>     case 'This Week':
>       return allTransactionsSorted.filter(t => {
>         const d = new Date(t.date);
>         const startOfWeek = new Date(now);
>         startOfWeek.setDate(now.getDate() - now.getDay() + 1);
>         startOfWeek.setHours(0, 0, 0, 0);
>         return d >= startOfWeek;
>       });
>     default:
>       return allTransactionsSorted;
>   }
> }, [allTransactionsSorted, activeFilter]);
> ```
>
> Apply the search filter on top of `filteredTransactions`:
>
> ```typescript
> const displayTransactions = useMemo(() => {
>   if (!searchQuery.trim()) return filteredTransactions;
>   const q = searchQuery.toLowerCase();
>   return filteredTransactions.filter(t =>
>     t.description.toLowerCase().includes(q) ||
>     t.category.toLowerCase().includes(q) ||
>     t.amount.toString().includes(q)
>   );
> }, [filteredTransactions, searchQuery]);
> ```
>
> Group `displayTransactions` by date for the section list:
>
> ```typescript
> const groupedTransactions = useMemo(() => {
>   const groups: Record<string, Transaction[]> = {};
>   displayTransactions.forEach(t => {
>     const label = formatDate(t.date); // 'Today', 'Yesterday', or 'Apr 18'
>     if (!groups[label]) groups[label] = [];
>     groups[label].push(t);
>   });
>   return Object.entries(groups).map(([title, data]) => ({ title, data }));
> }, [displayTransactions]);
> ```
>
> The dark summary card at the top always shows `totalIncomeThisMonth` and `totalExpensesThisMonth` from context — these never change based on the active filter. The filter only affects the list below."

---

### 6.3 — Add Transaction Screen

Paste this to your agent:

> "Open `/src/screens/expenses/AddTransactionScreen.tsx`. The save logic must call the correct context function and then navigate back immediately — context will update all screens automatically.
>
> The save function must be:
>
> ```typescript
> const handleSave = async () => {
>   if (!amount || !category) return;
>   setIsLoading(true);
>   try {
>     const transaction: Transaction = {
>       id: uuid(),
>       amount: parseFloat(amount),
>       type: activeTab === 'Expense' ? 'expense' : 'income',
>       category,
>       categoryIcon: selectedCategoryIcon,
>       description,
>       date: new Date().toISOString(),
>       note,
>       isRecurring: false,
>     };
>     await addTransaction(transaction); // context function — also updates budgets automatically
>     navigation.goBack();
>   } catch (error) {
>     setApiError('Failed to save. Please try again.');
>   } finally {
>     setIsLoading(false);
>   }
> };
> ```
>
> For edit mode (when `route.params.transaction` exists):
>
> ```typescript
> const handleSave = async () => {
>   setIsLoading(true);
>   try {
>     await updateTransaction(route.params.transaction.id, {
>       amount: parseFloat(amount),
>       type: activeTab === 'Expense' ? 'expense' : 'income',
>       category,
>       description,
>       note,
>     });
>     navigation.goBack();
>   } catch (error) {
>     setApiError('Failed to update. Please try again.');
>   } finally {
>     setIsLoading(false);
>   }
> };
> ```
>
> DO NOT manually update budgets here. The `addTransaction` and `updateTransaction` context functions call `recalculateAllBudgetSpending` automatically."

---

### 6.4 — Budget Screen

Paste this to your agent:

> "Open `/src/screens/budget/BudgetScreen.tsx`. Remove all local calculation logic. Pull from context:
>
> ```typescript
> const {
>   enrichedBudgets,
>   totalBudgetLimit,
>   totalBudgetSpent,
>   totalBudgetRemaining,
>   budgetUsedPercent,
>   budgetStatusLabel,
>   getDaysLeftThisMonth,
> } = useAppContext();
> ```
>
> Dark summary card values:
> - Total budget: `formatCurrency(totalBudgetLimit)`
> - Progress bar: `progress={budgetUsedPercent / 100}`
> - Text: `₦${formatCurrency(totalBudgetRemaining)} remaining`
> - Motivational text: derive from `budgetStatusLabel`
> - Month label: use `new Date().toLocaleString('default', { month: 'long', year: 'numeric' })`
>
> Budget cards list: iterate over `enrichedBudgets` from context (NOT the raw `budgets` array). Each card already has `percent`, `remaining`, and `status` — use them directly:
>
> ```tsx
> {enrichedBudgets.map(budget => (
>   <BudgetCard
>     key={budget.id}
>     budget={budget}
>     daysLeft={getDaysLeftThisMonth()}
>     onPress={() => navigation.navigate('BudgetDetailScreen', { budgetId: budget.id })}
>   />
> ))}
> ```"

---

### 6.5 — Budget Detail Screen

Paste this to your agent:

> "Open `/src/screens/budget/BudgetDetailScreen.tsx`. This screen receives a `budgetId` via route params (not the full budget object — IDs are safer because the budget object in context might update). Derive the current budget from context on every render so it always shows fresh data.
>
> ```typescript
> const {
>   enrichedBudgets,
>   getTransactionsByCategory,
>   getHighestExpenseInCategory,
>   getDailyAverageInCategory,
>   getDaysLeftThisMonth,
>   getDaysElapsedThisMonth,
> } = useAppContext();
>
> // Always re-derive from enrichedBudgets so the screen auto-updates
> const budget = enrichedBudgets.find(b => b.id === route.params.budgetId);
>
> // If budget was deleted, navigate back
> useEffect(() => {
>   if (!budget) navigation.goBack();
> }, [budget]);
>
> const categoryTransactions = getTransactionsByCategory(budget?.category || '');
> const highestExpense = getHighestExpenseInCategory(budget?.category || '');
> const dailyAverage = getDailyAverageInCategory(budget?.category || '');
> ```
>
> Display values:
> - Amount: `₦${formatCurrency(budget.spentAmount)} / ₦${formatCurrency(budget.limitAmount)}`
> - Circular ring: `progress={budget.percent / 100}`
> - Text below ring: `${budget.percent}%`
> - `₦${formatCurrency(budget.remaining)} left • ${getDaysLeftThisMonth()} days remaining`
> - Daily Average mini-card: `formatCurrency(dailyAverage)`
> - Highest Spend mini-card: `formatCurrency(highestExpense)`
> - Days Left mini-card: `getDaysLeftThisMonth()`
> - Status message: derive from `budget.status`:
>   - `'healthy'` → green card, `'You're on track with your {category} budget 👍'`
>   - `'warning'` → yellow card, `'You're getting close to your limit ⚠️'`
>   - `'critical'` or `'exceeded'` → red card, `'You've almost exceeded your budget 🚨'`"

---

### 6.6 — Savings Screen

Paste this to your agent:

> "Open `/src/screens/savings/SavingsScreen.tsx`. Pull from context:
>
> ```typescript
> const {
>   enrichedSavingsGoals,
>   totalSaved,
>   overallSavingsPercent,
> } = useAppContext();
> ```
>
> Dark summary card:
> - Total savings: `formatCurrency(totalSaved)`
> - Subtitle: `Across ${enrichedSavingsGoals.length} active goal${enrichedSavingsGoals.length !== 1 ? 's' : ''}`
>
> Goals list: iterate over `enrichedSavingsGoals` (NOT raw `savingsGoals`). Each already has `percent`, `remaining`, `daysLeft`:
>
> ```tsx
> {enrichedSavingsGoals.map(goal => (
>   <GoalCard
>     key={goal.id}
>     goal={goal}
>     onAddFunds={() => openAddFundsSheet(goal.id)}
>     onViewDetails={() => navigation.navigate('SavingsGoalDetailScreen', { goalId: goal.id })}
>   />
> ))}
> ```
>
> Each GoalCard shows:
> - Progress bar: `progress={goal.percent / 100}`
> - Amount text: `₦${formatCurrency(goal.savedAmount)} / ₦${formatCurrency(goal.targetAmount)}`
> - Percentage: `${goal.percent}%`
> - Due date (if set): `Due: ${formatDateFull(goal.deadline)}`"

---

### 6.7 — Savings Goal Detail Screen

Paste this to your agent:

> "Open `/src/screens/savings/SavingsGoalDetailScreen.tsx`. Derive the goal from context using `goalId` from route params (same pattern as Budget Detail):
>
> ```typescript
> const { enrichedSavingsGoals, getDaysLeftThisMonth } = useAppContext();
>
> const goal = enrichedSavingsGoals.find(g => g.id === route.params.goalId);
>
> useEffect(() => {
>   if (!goal) navigation.goBack();
> }, [goal]);
>
> // Daily target: remaining divided by days left (if deadline set)
> const dailyTarget = goal?.daysLeft && goal.daysLeft > 0
>   ? Math.ceil(goal.remaining / goal.daysLeft)
>   : null;
>
> // Monthly target: remaining divided by months left (if deadline set)
> const monthlyTarget = goal?.daysLeft && goal.daysLeft > 0
>   ? Math.ceil(goal.remaining / Math.max(1, Math.ceil(goal.daysLeft / 30)))
>   : null;
> ```
>
> Display:
> - Progress bar/ring: `progress={goal.percent / 100}`
> - `${goal.percent}% achieved`
> - `₦${formatCurrency(goal.remaining)} still needed`
> - Daily Target mini-card: `dailyTarget ? formatCurrency(dailyTarget) : 'No deadline'`
> - Monthly Target mini-card: `monthlyTarget ? formatCurrency(monthlyTarget) : 'No deadline'`
> - Days Left mini-card: `goal.daysLeft !== null ? goal.daysLeft : 'No deadline'`
>
> Motivational message based on `goal.percent`:
> - `< 30` → `'You're just getting started! Every kobo counts 🚀'`
> - `30–69` → `'Great progress! You're ${goal.percent}% closer to your ${goal.name}! 🔥'`
> - `70–99` → `'Almost there! Keep going — you're nearly at your goal 🏆'`
> - `100` → `'Goal Achieved! 🎉'` + confetti
>
> Recent contributions: use `goal.contributions`, sorted newest first, show last 3."

---

### 6.8 — Add Funds Bottom Sheet

Paste this to your agent:

> "Open `/src/components/AddFundsBottomSheet.tsx`. The save button must call `addFundsToGoal` from context, not update state locally.
>
> ```typescript
> const { addFundsToGoal } = useAppContext();
>
> const handleSave = async () => {
>   if (!amount || parseFloat(amount) <= 0) return;
>   setIsLoading(true);
>   try {
>     await addFundsToGoal(goal.id, parseFloat(amount), note);
>     onSuccess(); // parent callback — used to show toast
>     onClose();
>   } catch (error) {
>     setError('Failed to add funds. Try again.');
>   } finally {
>     setIsLoading(false);
>   }
> };
> ```
>
> The progress bar INSIDE the bottom sheet should pull from the PARENT goal prop (passed from the list screen). After saving, context updates the goal, and the parent screen re-renders automatically — the user will see the updated progress when the sheet closes."

---

### 6.9 — Transaction Detail Screen

Paste this to your agent:

> "Open `/src/screens/expenses/TransactionDetailScreen.tsx`. The 'Budget Impact' section must pull live budget data from context, not from route params. This ensures it always shows the current budget status, not a stale snapshot.
>
> ```typescript
> const { enrichedBudgets } = useAppContext();
>
> // Find the budget that matches this transaction's category
> const matchingBudget = enrichedBudgets.find(
>   b => b.category === transaction.category
> );
> ```
>
> Budget Impact section (only for expenses):
>
> ```tsx
> {transaction.type === 'expense' && matchingBudget && (
>   <View style={styles.budgetImpactCard}>
>     <Text>Budget Impact</Text>
>     <Text>{matchingBudget.category}: ₦{formatCurrency(matchingBudget.spentAmount)} / ₦{formatCurrency(matchingBudget.limitAmount)}</Text>
>     <ProgressBar progress={matchingBudget.percent / 100} />
>   </View>
> )}
> ```"

---

## PART 7 — THE FORMATCURRENCY FUNCTION (CRITICAL FOR CONSISTENCY)

Paste this to your agent:

> "Open `/src/utils/formatters.ts`. Replace the `formatCurrency` function with this version that correctly handles all Naira amounts with comma separators and no decimal places for whole numbers:
>
> ```typescript
> export const formatCurrency = (amount: number, showSymbol: boolean = true): string => {
>   if (isNaN(amount) || amount === null || amount === undefined) return showSymbol ? '₦0' : '0';
>   const formatted = Math.abs(amount).toLocaleString('en-NG', {
>     minimumFractionDigits: 0,
>     maximumFractionDigits: 2,
>   });
>   const symbol = showSymbol ? '₦' : '';
>   return `${symbol}${formatted}`;
> };
>
> // Use this when you want negative values to show as red (pass the sign separately to the style)
> export const formatCurrencyWithSign = (amount: number, type: 'income' | 'expense'): string => {
>   const prefix = type === 'income' ? '+₦' : '-₦';
>   return `${prefix}${Math.abs(amount).toLocaleString('en-NG', {
>     minimumFractionDigits: 0,
>     maximumFractionDigits: 2,
>   })}`;
> };
> ```
>
> Make sure this function is used consistently on EVERY screen that displays a money amount. Search for any hardcoded `₦` characters concatenated with raw numbers and replace them with `formatCurrency(amount)`."

---

## PART 8 — THE PROGRESSBAR COLOR LOGIC (MUST MATCH EVERYWHERE)

Paste this to your agent:

> "Open `/src/components/ProgressBar.tsx`. The color logic must be the same everywhere. Replace any existing color logic with this single source:
>
> ```typescript
> import { getProgressColor } from '../utils/formatters';
>
> // In ProgressBar.tsx:
> const fillColor = getProgressColor(Math.round(progress * 100));
> ```
>
> In `/src/utils/formatters.ts`, make sure `getProgressColor` is:
>
> ```typescript
> export const getProgressColor = (percent: number): string => {
>   if (percent >= 100) return '#EF4444'; // red — exceeded
>   if (percent >= 90) return '#EF4444';  // red — critical
>   if (percent >= 70) return '#F59E0B';  // yellow — warning
>   return '#1A9E3F';                     // green — healthy
> };
> ```
>
> This exact function must be used by:
> - `ProgressBar.tsx` component
> - `BudgetScreen.tsx` budget cards
> - `BudgetDetailScreen.tsx` circular ring
> - `DashboardScreen.tsx` budget overview card
>
> No screen or component should have its own hardcoded color logic for progress."

---

## PART 9 — ONBOARDING DATA WIRING

Paste this to your agent:

> "The monthly budget set during onboarding (in `SetMonthlyBudgetScreen.tsx`) must be saved as the user's `monthlyBudget` value AND also create a default 'General' budget entry if no budgets exist yet.
>
> In `SetMonthlyBudgetScreen.tsx`, update the Continue handler:
>
> ```typescript
> const handleContinue = async () => {
>   setIsLoading(true);
>   try {
>     // Save to user profile
>     await updateUser({ monthlyBudget: budgetAmount });
>
>     // If no budgets exist, create a general budget with this amount
>     if (budgets.length === 0) {
>       await addBudget({
>         id: uuid(),
>         category: 'General',
>         categoryIcon: 'grid',
>         limitAmount: budgetAmount,
>         spentAmount: 0,
>         period: 'monthly',
>         startDate: new Date().toISOString(),
>         color: '#1A9E3F',
>       });
>     }
>
>     navigation.navigate('QuickCategorySetupScreen');
>   } catch (error) {
>     console.error(error);
>     navigation.navigate('QuickCategorySetupScreen'); // always proceed
>   } finally {
>     setIsLoading(false);
>   }
> };
> ```
>
> This means the Dashboard budget overview card will not be empty after onboarding — it will already show the total monthly budget the user set."

---

## PART 10 — FIRST EXPENSE ONBOARDING WIRING

Paste this to your agent:

> "In `FirstExpenseScreen.tsx`, the save function must use the exact same `addTransaction` from context as AddTransactionScreen — not a custom implementation:
>
> ```typescript
> const { addTransaction } = useAppContext();
>
> const handleSave = async () => {
>   if (!amount || !category) return;
>   setIsLoading(true);
>   try {
>     await addTransaction({
>       id: uuid(),
>       amount: parseFloat(amount),
>       type: 'expense',
>       category,
>       categoryIcon: selectedIcon,
>       description: note || category,
>       date: new Date().toISOString(),
>       note,
>       isRecurring: false,
>     });
>     navigation.navigate('OnboardingSuccessScreen');
>   } catch (error) {
>     setError('Failed to save. You can add this later.');
>   } finally {
>     setIsLoading(false);
>   }
> };
> ```
>
> This means even the onboarding expense flows through context and immediately updates budgets, the dashboard, and the expenses list."

---

## PART 11 — RECURRING EXPENSES WIRING TO TRANSACTIONS

Paste this to your agent:

> "Recurring expenses do not currently auto-generate transaction records. Add the following function to `AppContext.tsx` that converts a recurring expense into a real transaction record when it is due:
>
> ```typescript
> const processRecurringExpense = async (recurringId: string) => {
>   const item = recurringExpenses.find(r => r.id === recurringId);
>   if (!item || item.isPaused) return;
>
>   // Create a real transaction from the recurring expense
>   await addTransaction({
>     id: uuid(),
>     amount: item.amount,
>     type: 'expense',
>     category: item.category,
>     categoryIcon: item.categoryIcon || 'repeat',
>     description: item.name,
>     date: new Date().toISOString(),
>     note: `Auto-generated from recurring expense`,
>     isRecurring: true,
>   });
>
>   // Update the nextDueDate based on frequency
>   const next = new Date();
>   if (item.frequency === 'daily') next.setDate(next.getDate() + 1);
>   if (item.frequency === 'weekly') next.setDate(next.getDate() + 7);
>   if (item.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
>
>   await updateRecurringExpense(recurringId, {
>     nextDueDate: next.toISOString(),
>   });
> };
> ```
>
> Expose `processRecurringExpense` through the context value. On `RecurringExpensesScreen`, add a 'Mark as Paid' button to each recurring expense card that calls this function — it will create the real transaction and update all dashboards instantly."

---

## PART 12 — VERIFICATION CHECKLIST

After completing all parts above, paste this final verification instruction to your agent:

> "Perform the following verification checks across the entire codebase:
>
> **Check 1 — No orphaned calculations:**
> Search for these patterns in all screen files (NOT in AppContext.tsx or formatters.ts). If found anywhere else, delete them and replace with context values:
> - `.reduce((sum, t) => sum + t.amount`
> - `transactions.filter`
> - `budgets.reduce`
> - `savingsGoals.reduce`
> - `Math.round((` when used for percentages
>
> **Check 2 — Context is always the data source:**
> Every screen file that shows financial data must have `useAppContext()` at the top and must NOT import from `StorageService` directly (only `AppContext.tsx` imports from StorageService).
>
> **Check 3 — Budget spent is never manually set:**
> Search for any place that does `spentAmount: someValue` outside of `recalculateAllBudgetSpending`. There should be none. The ONLY place `spentAmount` is set is inside `recalculateAllBudgetSpending` in AppContext.
>
> **Check 4 — All money values use formatCurrency:**
> Search for backtick strings containing '₦' followed by a variable: `₦${`. Every one of these must be replaced with `formatCurrency()` from formatters.ts.
>
> **Check 5 — Progress bars always receive 0–1 values:**
> The `ProgressBar` component's `progress` prop must always receive a value between 0 and 1. Search for `progress={` and verify every call divides by 100: `progress={somePercent / 100}`.
>
> **Check 6 — Live update test:**
> Run the app. Do the following sequence and confirm each step updates instantly without navigating away and back:
> 1. Open Dashboard. Note the balance, income, and expense values.
> 2. Navigate to Add Transaction. Add a ₦5,000 expense in the 'Food' category.
> 3. Navigate back to Dashboard. Confirm total expenses increased by ₦5,000 and balance decreased by ₦5,000.
> 4. Navigate to Budget tab. Confirm the Food budget's spentAmount increased by ₦5,000.
> 5. Navigate to Expenses tab. Confirm the new transaction appears at the top of the list.
> 6. Navigate to Budget Detail for Food. Confirm the spending breakdown includes the new ₦5,000.
> 7. Navigate to Savings tab. Add ₦2,000 to any goal. Confirm totalSaved increases by ₦2,000.
> 8. Navigate back to Dashboard. Confirm the savings card shows the updated amount.
>
> If any step fails to update, the issue is that the screen is using a local state variable instead of pulling from context. Fix by removing local state and using context values."

---

## QUICK REFERENCE — What Updates What

| User Action | Context Function Called | What Gets Recalculated Automatically |
|---|---|---|
| Add expense | `addTransaction()` | `totalExpensesThisMonth`, `currentBalance`, `netThisMonth`, `recentTransactions`, `allTransactionsSorted`, ALL budget `spentAmount`, `budgetUsedPercent`, `enrichedBudgets` |
| Add income | `addTransaction()` | `totalIncomeThisMonth`, `currentBalance`, `netThisMonth`, `recentTransactions`, `allTransactionsSorted` |
| Edit transaction | `updateTransaction()` | Everything above for both old and new values |
| Delete transaction | `deleteTransaction()` | Everything above |
| Create budget | `addBudget()` | `totalBudgetLimit`, `enrichedBudgets`, immediately calculates `spentAmount` from existing transactions |
| Edit budget | `updateBudget()` | `totalBudgetLimit`, `enrichedBudgets` |
| Delete budget | `deleteBudget()` | `totalBudgetLimit`, `totalBudgetSpent`, `enrichedBudgets` |
| Add funds to savings | `addFundsToGoal()` | `totalSaved`, `overallSavingsPercent`, `enrichedSavingsGoals`, `primarySavingsGoal` |
| Create savings goal | `addSavingsGoal()` | `totalSaved`, `totalSavingsTarget`, `enrichedSavingsGoals` |
| Delete savings goal | `deleteSavingsGoal()` | `totalSaved`, `totalSavingsTarget`, `enrichedSavingsGoals` |
| Set monthly budget (onboarding) | `updateUser()` + `addBudget()` | Everything in budgets |

---

## IMPORTANT RULES FOR YOUR CODING AGENT

1. **One calculation, one place.** AppContext calculates. Screens display. Never both.

2. **`useMemo` is mandatory for derived values.** Without it, calculations re-run on every render even when the data hasn't changed. Every computed value in AppContext must use `useMemo` with the correct dependency array.

3. **Pass `budgetId` and `goalId` through navigation, not full objects.** Objects passed through navigation params become stale snapshots. IDs stay valid and the screen re-derives fresh data from context on every render.

4. **`recalculateAllBudgetSpending` must run after every transaction change.** It is called inside `addTransaction`, `updateTransaction`, and `deleteTransaction`. Never add a new transaction mutation without calling it.

5. **The `spentAmount` field on Budget objects in storage is a cache.** The real source of truth is the transactions array. `spentAmount` exists so the app works offline without recalculating from scratch on every app open. It is always overwritten by `recalculateAllBudgetSpending` when any transaction changes.

6. **All amounts are stored as plain numbers (no currency symbol, no commas).** Only `formatCurrency()` adds the ₦ symbol and commas for display. Never store formatted strings — always store raw numbers like `5000`, not `'₦5,000'`.

7. **`enrichedBudgets` and `enrichedSavingsGoals` are the arrays screens should use.** They contain all the original fields plus `percent`, `remaining`, and `status` (or `daysLeft`) pre-calculated. Using the raw `budgets` or `savingsGoals` arrays in screens means re-calculating these values locally — which breaks the single source of truth rule.

---

_CampusKobo State Synchronization Guide — BOF OAU_
_Version 1.0 | May 2026_
