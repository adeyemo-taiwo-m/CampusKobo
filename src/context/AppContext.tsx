import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  Transaction,
  Budget,
  SavingsGoal,
  RecurringExpense,
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

interface AppContextType {
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
    source: string,
  ) => Promise<void>;
  addRecurringExpense: (item: RecurringExpense) => Promise<void>;
  updateRecurringExpense: (
    id: string,
    data: Partial<RecurringExpense>,
  ) => Promise<void>;
  deleteRecurringExpense: (id: string) => Promise<void>;
  pauseAllRecurring: () => Promise<void>;
  resumeAllRecurring: () => Promise<void>;
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

  const addTransaction = async (transaction: Transaction) => {
    const updated = await StorageService.addTransaction(transaction);
    if (updated) setTransactions(updated);

    if (transaction.type === "expense") {
      const updatedBudgets = await StorageService.updateBudgetSpent(
        transaction.category,
        transaction.amount,
      );
      if (updatedBudgets) setBudgets(updatedBudgets);
    }
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    const updated = await StorageService.updateTransaction(id, data);
    if (updated) setTransactions(updated);
  };

  const deleteTransaction = async (id: string) => {
    const updated = await StorageService.deleteTransaction(id);
    if (updated) setTransactions(updated);
  };

  const addBudget = async (budget: Budget) => {
    const updated = await StorageService.addBudget(budget);
    if (updated) setBudgets(updated);
  };

  const updateBudget = async (id: string, data: Partial<Budget>) => {
    const updated = await StorageService.updateBudget(id, data);
    if (updated) setBudgets(updated);
  };

  const deleteBudget = async (id: string) => {
    const updated = await StorageService.deleteBudget(id);
    if (updated) setBudgets(updated);
  };

  const addSavingsGoal = async (goal: SavingsGoal) => {
    const updated = await StorageService.addSavingsGoal(goal);
    if (updated) setSavingsGoals(updated);
  };

  const updateSavingsGoal = async (id: string, data: Partial<SavingsGoal>) => {
    const updated = await StorageService.updateSavingsGoal(id, data);
    if (updated) setSavingsGoals(updated);
  };

  const deleteSavingsGoal = async (id: string) => {
    const updated = await StorageService.deleteSavingsGoal(id);
    if (updated) setSavingsGoals(updated);
  };

  const addFundsToGoal = async (
    goalId: string,
    amount: number,
    note: string,
    source: string,
  ) => {
    const goal = savingsGoals.find((g) => g.id === goalId);
    if (goal) {
      const updatedGoal = {
        ...goal,
        savedAmount: goal.savedAmount + amount,
        contributions: [
          ...goal.contributions,
          { amount, note, source, date: new Date().toISOString() },
        ],
      };
      await updateSavingsGoal(goalId, updatedGoal);
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
