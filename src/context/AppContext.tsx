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
  ApiUser,
  Transaction,
  Budget,
  SavingsGoal,
  RecurringExpense,
  EnrichedBudget,
  EnrichedSavingsGoal,
} from "../types";
import { StorageService } from "../storage/StorageService";
import { userService } from "../services/userService";
import { authService } from "../services/authService";
import { hasValidTokens, clearTokens } from "../storage/TokenStorage";
import { authEvents, AUTH_EVENTS } from "../utils/authEvents";
import { transactionService } from "../services/transactionService";
import { budgetService } from "../services/budgetService";
import { savingsService } from "../services/savingsService";
import { dashboardService, DashboardSummary } from "../services/dashboardService";
import { notificationService, NotificationPreferences } from "../services/notificationService";
import { API_ENDPOINTS } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translate } from "../utils/i18n";
import * as formatters from "../utils/formatters";

export interface AppContextType {
  // Raw state
  user: User | null;
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  recurringExpenses: RecurringExpense[];
  isLoading: boolean;
  apiUser: ApiUser | null;
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
  toggleBalanceVisibility: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  loginWithApi: (email: string, password: string) => Promise<void>;
  registerWithApi: (full_name: string, email: string, password: string) => Promise<any>;
  logoutFromApi: () => Promise<void>;
  setApiUser: (user: ApiUser | null) => void;
  notificationPrefs: NotificationPreferences | null;
  prefsLoading: boolean;
  loadNotificationPrefs: () => Promise<void>;
  saveNotificationPrefs: (prefs: Partial<NotificationPreferences>) => Promise<void>;
  
  // Settings
  currency: { code: string; symbol: string; name: string };
  language: { code: string; name: string };
  setCurrency: (currency: { code: string; symbol: string; name: string }) => Promise<void>;
  setLanguage: (language: { code: string; name: string }) => Promise<void>;

  // Formatting & i18n
  t: (key: string) => string;
  formatCurrency: (amount: number, showSymbol?: boolean) => string;
  formatCurrencyWithSign: (amount: number, type: 'income' | 'expense') => string;
  formatCurrencyParts: (amount: number) => { whole: string; decimal: string };
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
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [networkError, setNetworkError] = useState<boolean>(false);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences | null>(null);
  const [prefsLoading, setPrefsLoading] = useState(false);
  const [currency, setCurrencyState] = useState({ code: 'NGN', symbol: '₦', name: 'Nigerian Naira' });
  const [language, setLanguageState] = useState({ code: 'en', name: 'English' });

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
      setNotificationPrefs(null);
      await clearTokens();
      authEvents.emit(AUTH_EVENTS.LOGGED_OUT);
    }
  };

  const loadNotificationPrefs = async () => {
    setPrefsLoading(true);
    try {
      const prefs = await notificationService.getPreferences();
      setNotificationPrefs(prefs);
    } catch (error) {
      // Server not reachable — load from local AsyncStorage fallback
      try {
        const local = await AsyncStorage.getItem(
          "campuskobo_notification_prefs",
        );
        if (local) setNotificationPrefs(JSON.parse(local));
      } catch {
        // No local data either — use defaults (handled in the screen)
      }
    } finally {
      setPrefsLoading(false);
    }
  };

  const saveNotificationPrefs = async (
    prefs: Partial<NotificationPreferences>,
  ) => {
    // Optimistic update: immediately update local context state
    const merged = {
      ...notificationPrefs,
      ...prefs,
    } as NotificationPreferences;
    setNotificationPrefs(merged);

    // Persist locally as cache
    try {
      await AsyncStorage.setItem(
        "campuskobo_notification_prefs",
        JSON.stringify(merged),
      );
    } catch {
      console.warn("Could not save notification prefs to local storage");
    }

    // Sync to server in the background — do not block UI or throw
    try {
      await notificationService.updatePreferences(prefs);
    } catch (error) {
      console.warn("Could not sync notification prefs to server:", error);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // 1. Call API logout
      await logoutFromApi();
      
      // 2. Clear ALL persistent storage
      await StorageService.clearAllData();
      
      // 3. Reset local states
      setUserState(null);
      setTransactions([]);
      setBudgets([]);
      setSavingsGoals([]);
      setRecurringExpenses([]);
      setDashboardSummary(null);
      setApiUser(null);
      setIsAuthenticated(false);
      
    } catch (error) {
      console.error('Logout implementation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBalanceVisibility = async () => {
    const newVal = !isBalanceHidden;
    setIsBalanceHidden(newVal);
    if (user) {
      await updateUser({ hideBalance: newVal });
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

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Load Local Storage Data (for offline fallback)
      let t = await StorageService.getTransactions();
      const u = await StorageService.getUser();
      let b = await StorageService.getBudgets();
      let s = await StorageService.getSavingsGoals();
      let r = await StorageService.getRecurringExpenses();
      
      // Load settings
      try {
        const savedCurrency = await AsyncStorage.getItem('campuskobo_currency');
        if (savedCurrency) setCurrencyState(JSON.parse(savedCurrency));
        
        const savedLanguage = await AsyncStorage.getItem('campuskobo_language');
        if (savedLanguage) setLanguageState(JSON.parse(savedLanguage));
      } catch (e) {
        console.warn('Failed to load settings from storage', e);
      }

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
            // Support both 'monthly_budget' and 'budget' field names
            const totalBudget = apiSummary.monthly_budget || (apiSummary as any).budget || 0;
            setDashboardSummary({
              ...apiSummary,
              monthly_budget: typeof totalBudget === 'string' ? parseFloat(totalBudget) : totalBudget
            });
            console.log('📊 Dashboard Data Synced from Backend:', {
              balance: apiSummary.total_balance,
              income: apiSummary.total_income,
              expenses: apiSummary.total_expenses,
              budget: totalBudget,
              transactionsCount: t.length,
              savingsGoalsCount: s.length
            });
          }

          if (__DEV__) {
            console.log('🚨 FINAL BUDGETS IN APP STATE:', JSON.stringify(b, null, 2));
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
        if (__DEV__) {
          console.log('🚨 FINAL BUDGETS IN APP STATE:', JSON.stringify(b, null, 2));
        }

        // Save to local storage for offline use
        await StorageService.saveTransactions(t);
        await StorageService.saveBudgets(b);
        await StorageService.saveSavingsGoals(s);
        console.error('ℹ️ No active tokens found, skipping API sync.');
      }

      // 3. Update State
      setUserState(u);
      setSavingsGoals(s);
      setRecurringExpenses(r);

      // 4. Run Recurring Auto-Sync
      if (r.length > 0) {
        await syncRecurringExpenses(r);
      }

      setIsLoading(false);

      // Recalculate spending based on the loaded transactions
      const recalculatedBudgets = b.map((budget: any) => {
        const budgetCategory = String(budget.category || '').toLowerCase().trim();
        const spent = t
          .filter((trans: any) =>
            trans.type === 'expense' &&
            String(trans.category || '').toLowerCase().trim() === budgetCategory &&
            isThisMonth(trans.date)
          )
          .reduce((sum: number, trans: any) => sum + (Number(trans.amount) || 0), 0);
        return { ...budget, spentAmount: spent };
      });
      
      setBudgets(recalculatedBudgets);
      setTransactions(t);
      
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrency = async (newCurrency: { code: string; symbol: string; name: string }) => {
    setCurrencyState(newCurrency);
    await AsyncStorage.setItem('campuskobo_currency', JSON.stringify(newCurrency));
  };

  const setLanguage = async (newLanguage: { code: string; name: string }) => {
    setLanguageState(newLanguage);
    await AsyncStorage.setItem('campuskobo_language', JSON.stringify(newLanguage));
  };

  // Helper functions for formatting & i18n
  const t = (key: string) => translate(key, language.code);
  
  const formatCurrency = (amount: number, showSymbol: boolean = true) => 
    formatters.formatCurrency(amount, showSymbol, { symbol: currency.symbol, code: currency.code });

  const formatCurrencyWithSign = (amount: number, type: 'income' | 'expense') =>
    formatters.formatCurrencyWithSign(amount, type, { symbol: currency.symbol, code: currency.code });

  const formatCurrencyParts = (amount: number) =>
    formatters.formatCurrencyParts(amount, { symbol: currency.symbol, code: currency.code });

  useEffect(() => {
    // 1. Run auth check and data load in parallel
    checkAuthStatus();
    loadAllData();

    // 2. Load API User (Step 2.4 from Guide)
    const loadApiUser = async () => {
      try {
        const profile = await userService.getMe(); 
        setApiUser(profile as ApiUser);
      } catch (e) {
        console.warn('Could not load API user', e);
      }
    };
    loadApiUser();
    loadNotificationPrefs();

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
      const budgetCategory = String(budget.category).toLowerCase().trim();
      const spent = updatedTransactions
        .filter(t =>
          t.type === 'expense' &&
          String(t.category).toLowerCase().trim() === budgetCategory &&
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
      const hasTokens = await hasValidTokens();
      if (hasTokens) {
        const apiData = {
          amount: Number(transaction.amount),
          title: transaction.category, // Map category to title for backend
          description: transaction.description || transaction.note || transaction.category,
          spent_on: transaction.date.split('T')[0], // format: YYYY-MM-DD
          is_recurring: transaction.isRecurring || false,
          currency: 'NGN', // Default to NGN as seen in Supabase
          status: 'completed' // Required field in schema
        };

        if (transaction.type === 'income') {
          const incomePayload = {
            amount: Number(transaction.amount),
            category: transaction.category,
            date: transaction.date.split('T')[0], // format: date
            note: transaction.description || transaction.note || null
          };
          const response = await transactionService.createIncome(incomePayload);
          // Handle different API response structures (direct object, nested data, or array)
          const newId = (response as any).id || (response as any).data?.id || (Array.isArray(response) && response[0]?.id);
          if (newId) transaction.id = String(newId);
        } else {
          const response = await transactionService.createExpense(apiData);
          // Handle different API response structures
          const newId = (response as any).id || (response as any).data?.id || (Array.isArray(response) && response[0]?.id);
          if (newId) transaction.id = String(newId);
        }
      }

      const updatedTransactions = [...transactions, transaction];
      setTransactions(updatedTransactions);
      await StorageService.saveTransactions(updatedTransactions);
      await recalculateAllBudgetSpending(updatedTransactions);
    } catch (error) {
      console.error('addTransaction error:', error);
      throw error;
    }
  };

  const updateTransaction = async (id: string, updatedData: Partial<Transaction>) => {
    try {
      const hasTokens = await hasValidTokens();
      if (hasTokens) {
        const apiData: any = {};
        if (updatedData.amount !== undefined) apiData.amount = Number(updatedData.amount);
        if (updatedData.category) {
          apiData.title = updatedData.category; // Map category to title for backend
          apiData.category_name = updatedData.category; 
          apiData.source = updatedData.category; // For income endpoints
        }
        if (updatedData.date) {
          apiData.spent_on = updatedData.date.split('T')[0];
          apiData.date = updatedData.date.split('T')[0]; // Keep for income compatibility
        }
        if (updatedData.description || updatedData.note) apiData.description = updatedData.description || updatedData.note;
        if (updatedData.isRecurring !== undefined) apiData.is_recurring = updatedData.isRecurring;
        apiData.currency = 'NGN';
        apiData.status = 'completed';

        // ALWAYS try to update the backend if we have an ID
        if (id) {
          if (__DEV__) console.log(`📝 API UPDATE: Requesting backend update for ID: ${id}`);
          
          // We need to know if it's an expense or income to choose the right endpoint
          // If we can't find it locally, we'll try expense as default or check updatedData
          const transactionToUpdate = transactions.find(t => String(t.id) === String(id));
          const type = transactionToUpdate?.type || (id.startsWith('inc') ? 'income' : 'expense');

          if (type === 'income') {
            const incomePayload = {
              amount: Number(updatedData.amount !== undefined ? updatedData.amount : transactionToUpdate?.amount),
              category: updatedData.category || transactionToUpdate?.category || 'Other',
              date: (updatedData.date || transactionToUpdate?.date || new Date().toISOString()).split('T')[0],
              note: updatedData.description || updatedData.note || transactionToUpdate?.note || null
            };
            await transactionService.updateIncome(String(id), incomePayload);
          } else {
            // For expenses, use the schema fields
            const expensePayload = {
              amount: Number(updatedData.amount !== undefined ? updatedData.amount : transactionToUpdate?.amount),
              title: updatedData.category || transactionToUpdate?.category || 'Expense',
              description: updatedData.description || updatedData.note || transactionToUpdate?.note || transactionToUpdate?.description || '',
              spent_on: (updatedData.date || transactionToUpdate?.date || new Date().toISOString()).split('T')[0],
              is_recurring: updatedData.isRecurring !== undefined ? updatedData.isRecurring : (transactionToUpdate?.isRecurring || false),
              currency: 'NGN',
              status: 'completed'
            };
            await transactionService.updateExpense(String(id), expensePayload);
          }
          
          if (__DEV__) console.log(`✅ API UPDATE: Successfully updated ${id} on backend`);
        } else {
          if (__DEV__) console.warn(`⚠️ API UPDATE SKIPPED: ID "${id}" looks like a local-only ID.`);
        }
      }

      const updatedTransactions = transactions.map(t =>
        String(t.id) === String(id) ? { ...t, ...updatedData } : t
      );
      setTransactions(updatedTransactions);
      await StorageService.saveTransactions(updatedTransactions);
      await recalculateAllBudgetSpending(updatedTransactions);
    } catch (error) {
      console.error('updateTransaction error:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    console.log(`🗑️ deleteTransaction called for ID: ${id}`);
    const isTemporaryId = id.length < 15 && !id.includes('-');
    const transactionToDelete = transactions.find(t => String(t.id) === String(id));
    
    try {
      let apiSuccess = false;

      if (isTemporaryId || !transactionToDelete) {
        console.log('ℹ️ Local-only or missing item, performing local removal');
        apiSuccess = true;
      } else {
        const hasTokens = await hasValidTokens();
        if (hasTokens) {
          try {
            if (transactionToDelete.type === 'income') {
              await transactionService.deleteIncome(String(id));
            } else {
              await transactionService.deleteExpense(String(id));
            }
            console.log('✅ API response for transaction deletion success');
            apiSuccess = true;
          } catch (apiError: any) {
            const status = apiError.status || apiError.response?.status;
            console.error('❌ API transaction deletion failed:', {
              status,
              message: apiError.message,
              data: apiError.data || apiError.response?.data
            });
            
            if (status === 404) {
              console.log('ℹ️ Transaction already missing on server (404), proceeding');
              apiSuccess = true;
            } else if (status === 500) {
              console.warn('⚠️ Server 500 error on transaction delete. Removing locally.');
              apiSuccess = true;
            } else {
              apiSuccess = false;
              throw new Error(`Failed to delete transaction on server (Status: ${status})`);
            }
          }
        } else {
          apiSuccess = false; 
          throw new Error('You must be logged in to delete a transaction from the cloud.');
        }
      }

      if (apiSuccess) {
        const updatedTransactions = transactions.filter(t => String(t.id) !== String(id));
        setTransactions(updatedTransactions);
        await StorageService.saveTransactions(updatedTransactions);
        await recalculateAllBudgetSpending(updatedTransactions);
        console.log('✅ Transaction deleted locally and saved to storage');
        return true;
      }
      return false;
    } catch (error) {
      console.error('deleteTransaction critical error:', error);
      throw error;
    }
  };

  const addBudget = async (budget: Budget) => {
    try {
      const hasTokens = await hasValidTokens();
      if (hasTokens) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const apiData = {
          name: budget.category,
          amount: budget.limitAmount,
          period_start: firstDay,
          period_end: lastDay,
          currency: 'NGN'
        };
        const response = await budgetService.createBudget(apiData);
        // Use the ID from the API
        budget.id = (response as any).id || (response as any).data?.id || budget.id;
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
        const targetBudget = budgets.find(b => String(b.id) === String(id));
        
        apiData.name = data.category || targetBudget?.category || 'Budget';
        apiData.amount = data.limitAmount !== undefined ? data.limitAmount : (targetBudget?.limitAmount || 0);
        
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        
        apiData.period_start = firstDay;
        apiData.period_end = lastDay;
        apiData.currency = 'NGN';
        
        await budgetService.updateBudget(id, apiData);
      }

      const updatedBudgets = budgets.map(b =>
        String(b.id) === String(id) ? { ...b, ...data } : b
      );
      setBudgets(updatedBudgets);
      await StorageService.saveBudgets(updatedBudgets);
    } catch (error) {
      console.error('updateBudget error:', error);
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    console.log(`🗑️ deleteBudget called for ID: ${id}`);
    const isTemporaryId = id.length < 15 && !id.includes('-');
    
    try {
      let apiSuccess = false;

      if (isTemporaryId) {
        console.log('ℹ️ Item has a temporary ID, performing local-only deletion');
        apiSuccess = true;
      } else {
        const hasTokens = await hasValidTokens();
        if (hasTokens) {
          try {
            await budgetService.deleteBudget(id);
            console.log('✅ API response for budget deletion success');
            apiSuccess = true;
          } catch (apiError: any) {
            const status = apiError.status || apiError.response?.status;
            console.error('❌ API budget deletion failed:', {
              status,
              message: apiError.message,
              data: apiError.data || apiError.response?.data
            });
            
            if (status === 404) {
              console.log('ℹ️ Budget already missing on server (404), proceeding');
              apiSuccess = true;
            } else if (status === 500) {
              console.warn('⚠️ Server 500 error on budget delete. Removing locally.');
              apiSuccess = true;
            } else {
              apiSuccess = false;
              throw new Error(`Failed to delete budget on server (Status: ${status})`);
            }
          }
        } else {
          apiSuccess = false; 
          throw new Error('You must be logged in to delete a budget from the cloud.');
        }
      }

      if (apiSuccess) {
        const updatedBudgets = budgets.filter(b => String(b.id) !== String(id));
        setBudgets(updatedBudgets);
        await StorageService.saveBudgets(updatedBudgets);
        console.log('✅ Budget deleted locally and saved to storage');
        return true;
      }
      return false;
    } catch (error) {
      console.error('deleteBudget critical error:', error);
      throw error;
    }
  };

  const addSavingsGoal = async (goal: SavingsGoal) => {
    try {
      const hasTokens = await hasValidTokens();
      if (hasTokens) {
        const apiData = {
          goal_name: goal.name,
          target_amount: goal.targetAmount,
          initial_deposit: goal.savedAmount || 0,
          target_date: goal.deadline ? goal.deadline.split('T')[0] : null,
          note: goal.emoji || '💰'
        };
        const response = await savingsService.createSavingsGoal(apiData);
        // Use the ID from the API
        goal.id = (response as any).id || (response as any).data?.id || goal.id;
      }

      const updatedGoals = [...savingsGoals, goal];
      setSavingsGoals(updatedGoals);
      await StorageService.saveSavingsGoals(updatedGoals);
    } catch (error) {
      console.error('addSavingsGoal error:', error);
      throw error;
    }
  };

  const addFundsToGoal = async (goalId: string, amount: number, note: string = '') => {
    console.log(`💰 addFundsToGoal called for ID: ${goalId}, Amount: ${amount}`);
    const isTemporaryId = goalId.length < 15 && !goalId.includes('-');
    
    try {
      if (!isTemporaryId) {
        const hasTokens = await hasValidTokens();
        if (hasTokens) {
          try {
            const apiData = {
              amount: amount,
              note: note || 'Goal contribution',
              source: 'app'
            };
            await savingsService.addContribution(goalId, apiData);
            console.log('✅ API contribution success');
          } catch (apiError: any) {
            console.error('❌ API contribution failed:', apiError.message);
            // We proceed locally anyway, but log it
          }
        }
      } else {
        console.log('ℹ️ Adding funds to a temporary local goal');
      }

      const updatedGoals = savingsGoals.map(g => {
        if (String(g.id) !== String(goalId)) return g;
        const newContribution = {
          amount,
          date: new Date().toISOString(),
          note,
          source: 'app',
        };
        return {
          ...g,
          savedAmount: g.savedAmount + amount,
          contributions: [...(g.contributions || []), newContribution],
        };
      });
      setSavingsGoals(updatedGoals);
      await StorageService.saveSavingsGoals(updatedGoals);
      console.log('✅ Goal funds updated locally');
    } catch (error) {
      console.error('addFundsToGoal error:', error);
      throw error;
    }
  };

  const updateSavingsGoal = async (id: string, updatedData: Partial<SavingsGoal>) => {
    try {
      const hasTokens = await hasValidTokens();
      if (hasTokens) {
        const apiData: any = {};
        const targetGoal = savingsGoals.find(g => String(g.id) === String(id));
        
        apiData.goal_name = updatedData.name || targetGoal?.name || 'Goal';
        apiData.target_amount = updatedData.targetAmount !== undefined ? updatedData.targetAmount : (targetGoal?.targetAmount || 0);
        apiData.initial_deposit = updatedData.savedAmount !== undefined ? updatedData.savedAmount : (targetGoal?.savedAmount || 0);
        
        if (updatedData.deadline) apiData.target_date = updatedData.deadline.split('T')[0];
        else if (targetGoal?.deadline) apiData.target_date = targetGoal.deadline.split('T')[0];
        
        if (updatedData.emoji) apiData.note = updatedData.emoji;
        else if (targetGoal?.emoji) apiData.note = targetGoal.emoji;
        
        await savingsService.updateSavingsGoal(id, apiData);
      }

      const updatedGoals = savingsGoals.map(g =>
        String(g.id) === String(id) ? { ...g, ...updatedData } : g
      );
      setSavingsGoals(updatedGoals);
      await StorageService.saveSavingsGoals(updatedGoals);
    } catch (error) {
      console.error('updateSavingsGoal error:', error);
      throw error;
    }
  };

  const deleteSavingsGoal = async (id: string) => {
    console.log(`🗑️ deleteSavingsGoal called for ID: ${id}`);
    
    // Check if ID is a temporary random ID (no hyphens) or a UUID
    const isTemporaryId = id.length < 15 && !id.includes('-');
    
    try {
      let apiSuccess = false;

      if (isTemporaryId) {
        console.log('ℹ️ Item has a temporary ID, performing local-only deletion');
        apiSuccess = true;
      } else {
        // 1. Attempt API deletion
        const hasTokens = await hasValidTokens();
        if (hasTokens) {
          try {
            const endpoint = API_ENDPOINTS.SAVINGS_GOAL_BY_ID(id);
            console.log(`📡 Sending DELETE request to: ${endpoint}`);
            const response = await savingsService.deleteSavingsGoal(id);
            console.log('✅ API response for deletion:', response);
            apiSuccess = true;
          } catch (apiError: any) {
            const status = apiError.status || apiError.response?.status;
            console.error('❌ API deletion failed:', {
              status,
              message: apiError.message,
              data: apiError.data || apiError.response?.data
            });
            
            // If 404, we can treat it as success locally because it doesn't exist on server
            if (status === 404) {
              console.log('ℹ️ Goal already missing on server (404), proceeding with local removal');
              apiSuccess = true;
            } else if (status === 500) {
              console.warn('⚠️ Server 500 error: backend is crashing. Removing locally to prevent UI block.');
              apiSuccess = true;
            } else {
              apiSuccess = false;
              throw new Error(`Failed to delete goal on server (Status: ${status})`);
            }
          }
        } else {
          // No tokens, can't delete from server
          apiSuccess = false; 
          throw new Error('You must be logged in to delete a goal from the database.');
        }
      }

      // 2. Local deletion - ONLY IF API SUCCEEDED OR WAS LOCAL-ONLY
      if (apiSuccess) {
        const initialCount = savingsGoals.length;
        const updatedGoals = savingsGoals.filter(g => String(g.id) !== String(id));
        setSavingsGoals(updatedGoals);
        await StorageService.saveSavingsGoals(updatedGoals);
        console.log('✅ Savings goal deleted locally and saved to storage');
        return true;
      }
      return false;
    } catch (error) {
      console.error('deleteSavingsGoal critical error:', error);
      throw error;
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


  const processRecurringExpense = async (recurringId: string) => {
    const item = recurringExpenses.find(r => r.id === recurringId);
    if (!item || item.isPaused) return;

    // 1. Create a non-recurring transaction for this period
    await addTransaction({
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      amount: item.amount,
      type: 'expense',
      category: item.category,
      categoryIcon: item.categoryIcon || 'repeat',
      categoryColor: item.categoryColor || '#FF3B30',
      description: item.name,
      date: item.nextDueDate || new Date().toISOString(),
      note: `Automatic payment for ${item.name}`,
      isRecurring: false, // This is the record of the payment
    });

    // 2. Calculate the NEXT due date
    const currentDue = new Date(item.nextDueDate || new Date());
    const next = new Date(currentDue);
    
    if (item.frequency === 'daily') next.setDate(next.getDate() + 1);
    else if (item.frequency === 'weekly') next.setDate(next.getDate() + 7);
    else if (item.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
    else if (item.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);

    // 3. Update the recurring template with the new due date
    await updateRecurringExpense(recurringId, {
      nextDueDate: next.toISOString(),
      lastProcessedDate: new Date().toISOString(),
    });
  };

  const syncRecurringExpenses = async (items: RecurringExpense[]) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Check up to the end of today

    for (const item of items) {
      if (item.isPaused || !item.nextDueDate) continue;
      
      const dueDate = new Date(item.nextDueDate);
      if (dueDate <= today) {
        await processRecurringExpense(item.id);
      }
    }
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
    const apiIncome = dashboardSummary?.total_income;
    if (apiIncome !== undefined) return Number(apiIncome);
    return transactions
      .filter(t => t.type === 'income' && isThisMonth(t.date))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [transactions, dashboardSummary]);

  const totalExpensesThisMonth = useMemo(() => {
    const apiExpenses = dashboardSummary?.total_expenses ?? dashboardSummary?.total_spent;
    if (apiExpenses !== undefined) return Number(apiExpenses);
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
    const apiBalance = dashboardSummary?.total_balance;
    if (apiBalance !== undefined) return Number(apiBalance);
    // If balance isn't provided, we can fallback to calculating it or just use 0 if not sync'd yet
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
      const remaining = Math.max(0, numTarget - numSaved);
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
        notificationPrefs,
        prefsLoading,
        loadNotificationPrefs,
        saveNotificationPrefs,
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
        currency,
        language,
        setCurrency,
        setLanguage,
        t,
        formatCurrency,
        formatCurrencyWithSign,
        formatCurrencyParts,
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
