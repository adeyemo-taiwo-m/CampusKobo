import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import {
  User,
  Transaction,
  Budget,
  SavingsGoal,
  RecurringExpense,
  EnrichedBudget,
  EnrichedSavingsGoal,
} from "../types";
import { StorageService } from "../storage/StorageService";
import { UserProfileResponse, userService } from "../services/userService";
import { authService } from "../services/authService";
import { hasValidTokens, clearTokens } from "../storage/TokenStorage";
import { authEvents, AUTH_EVENTS } from "../utils/authEvents";
import { transactionService } from "../services/transactionService";
import { budgetService } from "../services/budgetService";
import { savingsService } from "../services/savingsService";
import { dashboardService, DashboardSummary } from "../services/dashboardService";

export interface AppContextType {
  // Raw state
  user: User | null;
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  recurringExpenses: RecurringExpense[];
  isLoading: boolean;
  apiUser: UserProfileResponse | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  networkError: boolean;
  dashboardSummary: DashboardSummary | null;

  // Computed transaction totals
  totalIncomeLastMonth: number;
  totalExpensesLastMonth: number;
  expenseChangeVsLastMonth: number | null;
  currentBalance: number;
  netThisMonth: number;
  recentTransactions: Transaction[];
  allTransactionsSorted: Transaction[];

  // Computed budget totals
  totalBudgetLimit: number;
  totalBudgetSpent: number;
  totalBudgetRemaining: number;
  budgetUsedPercent: number;
  budgetStatusLabel: 'healthy' | 'warning' | 'critical' | 'exceeded';
  enrichedBudgets: EnrichedBudget[];

  // Computed savings totals
  totalSaved: number;
  totalSavingsTarget: number;
  overallSavingsPercent: number;
  primarySavingsGoal: SavingsGoal | null;
  primarySavingsGoalEnriched: any;
  enrichedSavingsGoals: EnrichedSavingsGoal[];

  // Category helpers
  expensesByCategory: Record<string, number>;
  getTransactionsByCategory: (category: string) => Transaction[];
  getHighestExpenseInCategory: (category: string) => number;
  getDailyAverageInCategory: (category: string) => number;

  // Recurring
  totalRecurringMonthly: number;

  // Date helpers
  getDaysLeftThisMonth: () => number;
  getDaysElapsedThisMonth: () => number;
  getTotalDaysThisMonth: () => number;
  isThisMonth: (dateString: string) => boolean;
  isLastMonth: (dateString: string) => boolean;

  // All existing action functions
  loadAllData: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (budget: Budget) => Promise<void>;
  updateBudget: (id: string, data: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addSavingsGoal: (goal: SavingsGoal) => Promise<void>;
  updateSavingsGoal: (id: string, data: Partial<SavingsGoal>) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  addFundsToGoal: (
    goalId: string,
    amount: number,
    note: string,
    source?: string,
  ) => Promise<void>;
  addRecurringExpense: (item: RecurringExpense) => Promise<void>;
  updateRecurringExpense: (
    id: string,
    data: Partial<RecurringExpense>,
  ) => Promise<void>;
  deleteRecurringExpense: (id: string) => Promise<void>;
  pauseAllRecurring: () => Promise<void>;
  resumeAllRecurring: () => Promise<void>;
  processRecurringExpense: (recurringId: string) => Promise<void>;
  isBalanceHidden: boolean;
  toggleBalanceVisibility: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  loginWithApi: (email: string, password: string) => Promise<void>;
  registerWithApi: (full_name: string, email: string, password: string) => Promise<any>;
  logoutFromApi: () => Promise<void>;
  setApiUser: (user: UserProfileResponse | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpense[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  // API Auth State
  const [apiUser, setApiUser] = useState<UserProfileResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);

  const checkAuthStatus = async () => {
    setAuthLoading(true);
    try {
      const hasTokens = await hasValidTokens();
      if (hasTokens) {
        console.log('🔑 Auth Check - Tokens found');
        try {
          const profile = await userService.getMe();
          console.log('✅ User profile fetched:', profile.email);
          setApiUser(profile);
          setIsAuthenticated(true);
          
          // Sync API user with local user if needed
          if (user && user.email === profile.email) {
            const updatedLocal = { ...user, name: profile.full_name };
            setUserState(updatedLocal);
            StorageService.saveUser(updatedLocal);
          }
        } catch (error: any) {
          if (error.message && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
            await clearTokens();
            setIsAuthenticated(false);
          } else {
            // Likely a network error, assume authenticated but set network error flag
            setIsAuthenticated(true);
            setNetworkError(true);
            console.warn('Network error while checking auth, assuming session is valid');
          }
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithApi = async (email: string, password: string) => {
    try {
      await authService.login({ email, password });
      setIsAuthenticated(true);
      const profile = await userService.getMe();
      setApiUser(profile);
      
      // Load all local data alongside
      await loadAllData();
      
      authEvents.emit(AUTH_EVENTS.LOGGED_IN);
    } catch (error) {
      throw error;
    }
  };

  const registerWithApi = async (full_name: string, email: string, password: string) => {
    try {
      const result = await authService.register({ full_name, email, password });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logoutFromApi = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('API logout failed:', error);
    } finally {
      setIsAuthenticated(false);
      setApiUser(null);
      await clearTokens();
      await loadAllData(); // Reset local state
      authEvents.emit(AUTH_EVENTS.LOGGED_OUT);
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Load Local Storage Data (for offline fallback)
      let t = await StorageService.getTransactions();
      const u = await StorageService.getUser();
      let b = await StorageService.getBudgets();
      let s = await StorageService.getSavingsGoals();
      let r = await StorageService.getRecurringExpenses();

      if (u) {
        setIsBalanceHidden(!!u.hideBalance);
        // Migration: Change name from "Ad" or "Adeyemo..." to "Taiwo"
        if (u.name === 'Ad' || u.name === 'Adeyemo Taiwo M' || u.name === 'Adeyemo') {
          u.name = 'Taiwo';
          await StorageService.saveUser(u);
        }
      }

      // 2. If Authenticated, Sync with API
      const hasTokens = await hasValidTokens();
      console.log('🔑 Auth Check - Has Tokens:', hasTokens);

      if (hasTokens) {
        try {
          console.log('🔄 Syncing financial data with API...');
          const [apiIncome, apiExpenses, apiBudgets, apiSavings, apiSummary] = await Promise.all([
            transactionService.getIncome().catch((e) => { console.error('Income Sync Error:', e); return []; }),
            transactionService.getExpenses().catch((e) => { console.error('Expense Sync Error:', e); return []; }),
            budgetService.getBudgets().catch((e) => { console.error('Budget Sync Error:', e); return []; }),
            savingsService.getSavingsGoals().catch((e) => { console.error('Savings Sync Error:', e); return []; }),
            dashboardService.getSummary().catch((e) => { console.error('Summary Sync Error:', e); return null; }),
          ]);

          console.log('✅ API Sync Complete');

          t = [...apiIncome, ...apiExpenses];
          b = apiBudgets;
          s = apiSavings;
          if (apiSummary) {
            setDashboardSummary(apiSummary);
            console.log('📊 Dashboard Data Synced from Backend:', {
              balance: apiSummary.total_balance,
              income: apiSummary.total_income,
              expenses: apiSummary.total_expenses,
              budget: apiSummary.monthly_budget,
              transactionsCount: t.length,
              savingsGoalsCount: s.length
            });
          }

          // Save to local storage for offline use
          await Promise.all([
            StorageService.saveTransactions(t),
            StorageService.saveBudgets(b),
            StorageService.saveSavingsGoals(s),
          ]);
        } catch (apiError) {
          console.error('❌ Critical Sync Error:', apiError);
        }
      } else {
        console.log('ℹ️ No active tokens found, skipping API sync.');
      }

      setUserState(u);
      setTransactions(t);
      setBudgets(b);
      setSavingsGoals(s);
      setRecurringExpenses(r);
    } catch (error) {
      console.error("Error loading data in context:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Run auth check and data load in parallel
    checkAuthStatus();
    loadAllData();

    // Listen for auth events
    const onExpired = () => {
      logoutFromApi();
      // Toast notification would be called here
      console.warn('Session expired. Please log in again.');
    };

    authEvents.on(AUTH_EVENTS.TOKEN_EXPIRED, onExpired);

    return () => {
      authEvents.off(AUTH_EVENTS.TOKEN_EXPIRED, onExpired);
    };
  }, []);

  // Call this after ANY change to transactions (add, edit, delete)
  // It rebuilds spentAmount on every budget from actual transaction data
  const recalculateAllBudgetSpending = async (updatedTransactions: Transaction[]) => {
    const updatedBudgets = budgets.map(budget => {
      const spent = updatedTransactions
        .filter(t =>
          t.type === 'expense' &&
          t.category === budget.category &&
          isThisMonth(t.date)
        )
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      return { ...budget, spentAmount: spent };
    });
    setBudgets(updatedBudgets);
    await StorageService.saveBudgets(updatedBudgets);
  };

  const addTransaction = async (transaction: Transaction) => {
    try {
      const updatedTransactions = [...transactions, transaction];
      setTransactions(updatedTransactions);
      await StorageService.saveTransactions(updatedTransactions);
      await recalculateAllBudgetSpending(updatedTransactions);
    } catch (error) {
      console.error('addTransaction error:', error);
    }
  };

  const updateTransaction = async (id: string, updatedData: Partial<Transaction>) => {
    try {
      const updatedTransactions = transactions.map(t =>
        t.id === id ? { ...t, ...updatedData } : t
      );
      setTransactions(updatedTransactions);
      await StorageService.saveTransactions(updatedTransactions);
      await recalculateAllBudgetSpending(updatedTransactions);
    } catch (error) {
      console.error('updateTransaction error:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const updatedTransactions = transactions.filter(t => t.id !== id);
      setTransactions(updatedTransactions);
      await StorageService.saveTransactions(updatedTransactions);
      await recalculateAllBudgetSpending(updatedTransactions);
    } catch (error) {
      console.error('deleteTransaction error:', error);
    }
  };

  const addBudget = async (budget: Budget) => {
    try {
      const hasTokens = await hasValidTokens();
      if (hasTokens) {
        const apiData = {
          category: budget.category,
          limit_amount: budget.limitAmount,
          period: budget.period || 'monthly',
          color: budget.color || '#3CB96A',
          icon: budget.categoryIcon || 'restaurant-outline'
        };
        const response = await budgetService.createBudget(apiData);
        // Use the ID from the API
        budget.id = (response as any).id || budget.id;
      }

      const newBudgets = [...budgets, budget];
      // Immediately calculate spent for this new budget from existing transactions
      const recalculated = newBudgets.map(b => {
        const spent = transactions
          .filter(t => t.type === 'expense' && t.category === b.category && isThisMonth(t.date))
          .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        return { ...b, spentAmount: spent };
      });
      setBudgets(recalculated);
      await StorageService.saveBudgets(recalculated);
    } catch (error) {
      console.error('addBudget error:', error);
      throw error; // Rethrow to show in UI
    }
  };

  const updateBudget = async (id: string, data: Partial<Budget>) => {
    try {
      const hasTokens = await hasValidTokens();
      if (hasTokens) {
        const apiData: any = {};
        if (data.category) apiData.category = data.category;
        if (data.limitAmount !== undefined) apiData.limit_amount = data.limitAmount;
        if (data.period) apiData.period = data.period;
        
        await budgetService.updateBudget(id, apiData);
      }

      const updatedBudgets = budgets.map(b =>
        b.id === id ? { ...b, ...data } : b
      );
      setBudgets(updatedBudgets);
      await StorageService.saveBudgets(updatedBudgets);
    } catch (error) {
      console.error('updateBudget error:', error);
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const hasTokens = await hasValidTokens();
      if (hasTokens) {
        await budgetService.deleteBudget(id);
      }

      const updatedBudgets = budgets.filter(b => b.id !== id);
      setBudgets(updatedBudgets);
      await StorageService.saveBudgets(updatedBudgets);
    } catch (error) {
      console.error('deleteBudget error:', error);
      throw error;
    }
  };

  const addSavingsGoal = async (goal: SavingsGoal) => {
    try {
      const updatedGoals = [...savingsGoals, goal];
      setSavingsGoals(updatedGoals);
      await StorageService.saveSavingsGoals(updatedGoals);
    } catch (error) {
      console.error('addSavingsGoal error:', error);
    }
  };

  const addFundsToGoal = async (goalId: string, amount: number, note: string = '') => {
    try {
      const updatedGoals = savingsGoals.map(g => {
        if (g.id !== goalId) return g;
        const newContribution = {
          amount,
          date: new Date().toISOString(),
          note,
          source: 'manual',
        };
        return {
          ...g,
          savedAmount: g.savedAmount + amount,
          contributions: [...(g.contributions || []), newContribution],
        };
      });
      setSavingsGoals(updatedGoals);
      await StorageService.saveSavingsGoals(updatedGoals);
    } catch (error) {
      console.error('addFundsToGoal error:', error);
    }
  };

  const updateSavingsGoal = async (id: string, updatedData: Partial<SavingsGoal>) => {
    try {
      const updatedGoals = savingsGoals.map(g =>
        g.id === id ? { ...g, ...updatedData } : g
      );
      setSavingsGoals(updatedGoals);
      await StorageService.saveSavingsGoals(updatedGoals);
    } catch (error) {
      console.error('updateSavingsGoal error:', error);
    }
  };

  const deleteSavingsGoal = async (id: string) => {
    try {
      const updatedGoals = savingsGoals.filter(g => g.id !== id);
      setSavingsGoals(updatedGoals);
      await StorageService.saveSavingsGoals(updatedGoals);
    } catch (error) {
      console.error('deleteSavingsGoal error:', error);
    }
  };

  const addRecurringExpense = async (item: RecurringExpense) => {
    const updated = await StorageService.addRecurringExpense(item);
    if (updated) setRecurringExpenses(updated);
  };

  const updateRecurringExpense = async (
    id: string,
    data: Partial<RecurringExpense>,
  ) => {
    const updated = await StorageService.updateRecurringExpense(id, data);
    if (updated) setRecurringExpenses(updated);
  };

  const deleteRecurringExpense = async (id: string) => {
    const updated = await StorageService.deleteRecurringExpense(id);
    if (updated) setRecurringExpenses(updated);
  };

  const pauseAllRecurring = async () => {
    const updated = recurringExpenses.map((r) => ({ ...r, isPaused: true }));
    await StorageService.saveRecurringExpenses(updated);
    setRecurringExpenses(updated);
  };

  const resumeAllRecurring = async () => {
    const updated = recurringExpenses.map((r) => ({ ...r, isPaused: false }));
    await StorageService.saveRecurringExpenses(updated);
    setRecurringExpenses(updated);
  };

  const toggleBalanceVisibility = async () => {
    const newValue = !isBalanceHidden;
    setIsBalanceHidden(newValue);
    if (user) {
      await updateUser({ hideBalance: newValue });
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      await StorageService.saveUser(updated);
      setUserState(updated);
    }
  };

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) StorageService.saveUser(u);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await StorageService.clearAllData();
      setUserState(null);
      setTransactions([]);
      setBudgets([]);
      setSavingsGoals([]);
      setRecurringExpenses([]);
      
      // Also logout from API if needed
      await logoutFromApi();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processRecurringExpense = async (recurringId: string) => {
    const item = recurringExpenses.find(r => r.id === recurringId);
    if (!item || item.isPaused) return;

    // Create a real transaction from the recurring expense
    await addTransaction({
      id: Math.random().toString(36).substr(2, 9), // Use simple uuid substitute if uuid is not imported, wait, let's assume they have uuid. Wait, I will use Date.now().toString() as ID just to be safe. Actually, the app has a uuid generator or uses `Math.random` elsewhere. Let's use Date.now().toString() to be safe.
      amount: item.amount,
      type: 'expense',
      category: item.category,
      categoryIcon: item.categoryIcon || 'repeat',
      categoryColor: item.categoryColor || '#FF3B30',
      description: item.name,
      date: new Date().toISOString(),
      note: `Auto-generated from recurring expense`,
      isRecurring: true,
    });

    // Update the nextDueDate based on frequency
    const next = new Date();
    if (item.frequency === 'daily') next.setDate(next.getDate() + 1);
    if (item.frequency === 'weekly') next.setDate(next.getDate() + 7);
    if (item.frequency === 'monthly') next.setMonth(next.getMonth() + 1);

    await updateRecurringExpense(recurringId, {
      nextDueDate: next.toISOString(),
    });
  };

  // --- DERIVED CALCULATIONS ---

  // Date helpers
  const isThisMonth = (dateString: string): boolean => {
    const d = new Date(dateString);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const isLastMonth = (dateString: string): boolean => {
    const d = new Date(dateString);
    const now = new Date();
    const last = new Date(now.getFullYear(), now.getMonth() - 1);
    return d.getMonth() === last.getMonth() && d.getFullYear() === last.getFullYear();
  };

  const isThisWeek = (dateString: string): boolean => {
    const date = new Date(dateString);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    return date >= startOfWeek && date <= now;
  };

  const getDaysElapsedThisMonth = (): number => Math.max(1, new Date().getDate());

  const getDaysLeftThisMonth = (): number => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Math.max(0, lastDay - now.getDate());
  };

  const getTotalDaysThisMonth = (): number => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  const totalIncomeThisMonth = useMemo(() => {
    if (dashboardSummary?.total_income !== undefined) return dashboardSummary.total_income;
    return transactions
      .filter(t => t.type === 'income' && isThisMonth(t.date))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [transactions, dashboardSummary]);

  const totalExpensesThisMonth = useMemo(() => {
    if (dashboardSummary?.total_expenses !== undefined) return dashboardSummary.total_expenses;
    return transactions
      .filter(t => t.type === 'expense' && isThisMonth(t.date))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [transactions, dashboardSummary]);

  const totalIncomeLastMonth = useMemo(() =>
    transactions
      .filter(t => t.type === 'income' && isLastMonth(t.date))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
  [transactions]);

  const totalExpensesLastMonth = useMemo(() =>
    transactions
      .filter(t => t.type === 'expense' && isLastMonth(t.date))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
  [transactions]);

  const currentBalance = useMemo(() => {
    if (dashboardSummary?.total_balance !== undefined) return dashboardSummary.total_balance;
    const allIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const allExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    return allIncome - allExpenses;
  }, [transactions, dashboardSummary]);

  const expenseChangeVsLastMonth = useMemo(() => {
    if (totalExpensesLastMonth === 0) return null;
    return Math.round(
      ((totalExpensesThisMonth - totalExpensesLastMonth) / totalExpensesLastMonth) * 100
    );
  }, [totalExpensesThisMonth, totalExpensesLastMonth]);

  const netThisMonth = useMemo(() => {
    return totalIncomeThisMonth - totalExpensesThisMonth;
  }, [totalIncomeThisMonth, totalExpensesThisMonth]);

  const recentTransactions = useMemo(() =>
    [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5),
  [transactions]);

  const allTransactionsSorted = useMemo(() =>
    [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [transactions]);

  // Budget totals
  const totalBudgetLimit = useMemo(() => {
    return budgets.reduce((sum, b) => sum + (Number(b.limitAmount) || 0), 0);
  }, [budgets]);

  const totalBudgetSpent = useMemo(() => {
    if (dashboardSummary?.budget_spent !== undefined) return dashboardSummary.budget_spent;
    return budgets.reduce((sum, b) => sum + (Number(b.spentAmount) || 0), 0);
  }, [budgets, dashboardSummary]);

  const totalBudgetRemaining = useMemo(() => {
    return Math.max(0, totalBudgetLimit - totalBudgetSpent);
  }, [totalBudgetLimit, totalBudgetSpent]);

  const budgetUsedPercent = useMemo(() => {
    if (totalBudgetLimit === 0) return 0;
    return Math.min(100, Math.round((totalBudgetSpent / totalBudgetLimit) * 100));
  }, [totalBudgetSpent, totalBudgetLimit]);

  const budgetStatusLabel = useMemo(() => {
    if (budgetUsedPercent >= 100) return 'exceeded';
    if (budgetUsedPercent >= 90) return 'critical';
    if (budgetUsedPercent >= 70) return 'warning';
    return 'healthy';
  }, [budgetUsedPercent]);

  const enrichedBudgets = useMemo(() => {
    return budgets.map(b => {
      const percent = b.limitAmount === 0 ? 0 : Math.min(100, Math.round((b.spentAmount / b.limitAmount) * 100));
      const remaining = Math.max(0, b.limitAmount - b.spentAmount);
      let status: 'healthy' | 'warning' | 'critical' | 'exceeded' = 'healthy';
      if (percent >= 100) status = 'exceeded';
      else if (percent >= 90) status = 'critical';
      else if (percent >= 70) status = 'warning';
      return { ...b, percent, remaining, status } as any; // Cast as any locally if types aren't strictly updated yet
    });
  }, [budgets]);

  // Savings totals
  const totalSaved = useMemo(() => {
    if (dashboardSummary?.savings_total !== undefined) return dashboardSummary.savings_total;
    return savingsGoals.reduce((sum, g) => sum + (Number(g.savedAmount) || 0), 0);
  }, [savingsGoals, dashboardSummary]);

  const totalSavingsTarget = useMemo(() => {
    return savingsGoals.reduce((sum, g) => sum + (Number(g.targetAmount) || 0), 0);
  }, [savingsGoals]);

  const overallSavingsPercent = useMemo(() => {
    if (totalSavingsTarget === 0) return 0;
    return Math.min(100, Math.round((totalSaved / totalSavingsTarget) * 100));
  }, [totalSaved, totalSavingsTarget]);

  const primarySavingsGoal = useMemo(() => {
    if (savingsGoals.length === 0) return null;
    return [...savingsGoals].sort((a, b) => b.savedAmount - a.savedAmount)[0];
  }, [savingsGoals]);

  const primarySavingsGoalEnriched = useMemo(() => {
    if (!primarySavingsGoal) return null;
    const g = primarySavingsGoal;
    const numSaved = Number(String(g.savedAmount).replace(/,/g, '')) || 0;
    const numTarget = Number(String(g.targetAmount).replace(/,/g, '')) || 0;
    const percent = numTarget === 0 ? 0 : Math.min(100, Math.round((numSaved / numTarget) * 100));
    const remaining = Math.max(0, numTarget - numSaved);
    return { ...g, percent, remaining };
  }, [primarySavingsGoal]);

  const enrichedSavingsGoals = useMemo(() => {
    return savingsGoals.map(g => {
      const numSaved = Number(String(g.savedAmount).replace(/,/g, '')) || 0;
      const numTarget = Number(String(g.targetAmount).replace(/,/g, '')) || 0;
      const percent = numTarget === 0 ? 0 : Math.min(100, Math.round((numSaved / numTarget) * 100));
      const remaining = Math.max(0, g.targetAmount - g.savedAmount);
      let daysLeft: number | null = null;
      if (g.deadline) {
        const diff = new Date(g.deadline).getTime() - Date.now();
        daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }
      return { ...g, percent, remaining, daysLeft } as any;
    });
  }, [savingsGoals]);

  // Category helpers
  const expensesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense' && isThisMonth(t.date))
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + (Number(t.amount) || 0);
      });
    return map;
  }, [transactions]);

  const getTransactionsByCategory = (category: string) => {
    return [...transactions]
      .filter(t => t.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getHighestExpenseInCategory = (category: string): number => {
    const amounts = transactions
      .filter(t => t.type === 'expense' && t.category === category && isThisMonth(t.date))
      .map(t => t.amount);
    return amounts.length > 0 ? Math.max(...amounts) : 0;
  };

  const getDailyAverageInCategory = (category: string): number => {
    const total = transactions
      .filter(t => t.type === 'expense' && t.category === category && isThisMonth(t.date))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    return Math.round(total / getDaysElapsedThisMonth());
  };

  // Recurring
  const totalRecurringMonthly = useMemo(() => {
    return recurringExpenses
      .filter(r => !r.isPaused)
      .reduce((sum, r) => {
        if (r.frequency === 'monthly') return sum + (Number(r.amount) || 0);
        if (r.frequency === 'weekly') return sum + (Number(r.amount) || 0) * 4;
        if (r.frequency === 'daily') return sum + (Number(r.amount) || 0) * 30;
        return sum;
      }, 0);
  }, [recurringExpenses]);

  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        budgets,
        savingsGoals,
        recurringExpenses,
        isLoading,
        apiUser,
        isAuthenticated,
        authLoading,
        networkError,
        loadAllData,
        checkAuthStatus,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        addFundsToGoal,
        addRecurringExpense,
        updateRecurringExpense,
        deleteRecurringExpense,
        pauseAllRecurring,
        resumeAllRecurring,
        isBalanceHidden,
        toggleBalanceVisibility,
        updateUser,
        setUser,
        logout,
        loginWithApi,
        registerWithApi,
        logoutFromApi,
        setApiUser,
        dashboardSummary,
        totalIncomeLastMonth,
        totalExpensesLastMonth,
        expenseChangeVsLastMonth,
        totalIncomeThisMonth,
        totalExpensesThisMonth,
        currentBalance,
        netThisMonth,
        recentTransactions,
        allTransactionsSorted,
        totalBudgetLimit,
        totalBudgetSpent,
        totalBudgetRemaining,
        budgetUsedPercent,
        budgetStatusLabel,
        enrichedBudgets,
        totalSaved,
        totalSavingsTarget,
        overallSavingsPercent,
        primarySavingsGoal,
        primarySavingsGoalEnriched,
        enrichedSavingsGoals,
        expensesByCategory,
        getTransactionsByCategory,
        getHighestExpenseInCategory,
        getDailyAverageInCategory,
        totalRecurringMonthly,
        getDaysLeftThisMonth,
        getDaysElapsedThisMonth,
        getTotalDaysThisMonth,
        isThisMonth,
        isLastMonth,
        processRecurringExpense,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
