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

  const checkAuthStatus = async () => {
    setAuthLoading(true);
    try {
      const hasTokens = await hasValidTokens();
      if (hasTokens) {
        try {
          const profile = await userService.getMe();
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
      let t = await StorageService.getTransactions();
      const u = await StorageService.getUser();
      const b = await StorageService.getBudgets();
      const s = await StorageService.getSavingsGoals();
      const r = await StorageService.getRecurringExpenses();

      if (u) {
        setIsBalanceHidden(!!u.hideBalance);
        
        // Migration: Change name from "Ad" or "Adeyemo..." to "Taiwo"
        if (u.name === 'Ad' || u.name === 'Adeyemo Taiwo M' || u.name === 'Adeyemo') {
          u.name = 'Taiwo';
          await StorageService.saveUser(u);
        }
      }

      // Sample data to ensure it matches the latest mockup
      const sampleTransactions: Transaction[] = [
        {
          id: "sample-1",
          amount: 60000,
          type: "income",
          category: "Salary",
          categoryIcon: "cash-outline",
          categoryColor: "#10B981",
          description: "Monthly salary payment for October performance",
          note: "Monthly salary payment for October performance",
          date: new Date().toISOString(),
          isRecurring: true,
        },
        {
          id: "sample-2",
          amount: 1500,
          type: "expense",
          category: "Food",
          categoryIcon: "restaurant-outline",
          categoryColor: "#EF4444",
          description: "Lunch at Shade's store with the study group",
          note: "Lunch at Shade's store with the study group",
          date: new Date().toISOString(),
          isRecurring: false,
        },
        {
          id: "sample-3",
          amount: 2200,
          type: "expense",
          category: "Transport",
          categoryIcon: "car-sport-outline",
          categoryColor: "#F59E0B",
          description: "Uber to Island for the weekend hackathon event",
          note: "Uber to Island for the weekend hackathon event",
          date: new Date().toISOString(),
          isRecurring: false,
        },
        {
          id: "sample-4",
          amount: 5000,
          type: "expense",
          category: "Shopping",
          categoryIcon: "cart-outline",
          categoryColor: "#EC4899",
          description: "Shoprite groceries for the hostel party tonight",
          note: "Shoprite groceries for the hostel party tonight",
          date: new Date().toISOString(),
          isRecurring: false,
        },
        {
          id: "sample-5",
          amount: 1800,
          type: "expense",
          category: "Food",
          categoryIcon: "cafe-outline",
          categoryColor: "#EF4444",
          description: "Breakfast at Chicken Republic after morning class",
          note: "Breakfast at Chicken Republic after morning class",
          date: new Date(Date.now() - 86400000).toISOString(),
          isRecurring: false,
        },
        {
          id: "sample-6",
          amount: 500,
          type: "expense",
          category: "Airtime",
          categoryIcon: "call-outline",
          categoryColor: "#3B82F6",
          description: "MTN recharge for mobile data subscription",
          note: "MTN recharge for mobile data subscription",
          date: new Date(Date.now() - 86400000).toISOString(),
          isRecurring: false,
        },
        {
          id: "sample-7",
          amount: 8000,
          type: "expense",
          category: "Utilities",
          categoryIcon: "flash-outline",
          categoryColor: "#EF4444",
          description: "EKEDC electricity bill for the apartment complex",
          note: "EKEDC electricity bill for the apartment complex",
          date: new Date(2025, 3, 18, 10, 0).toISOString(),
          isRecurring: true,
        },
        {
          id: "sample-8",
          amount: 3500,
          type: "expense",
          category: "Health",
          categoryIcon: "heart-outline",
          categoryColor: "#EF4444",
          description: "Pharmacy - Medplus for multivitamins and minerals",
          note: "Pharmacy - Medplus for multivitamins and minerals",
          date: new Date(2025, 3, 18, 13, 30).toISOString(),
          isRecurring: false,
        },
        {
          id: "sample-9",
          amount: 1000,
          type: "expense",
          category: "Airtime",
          categoryIcon: "call-outline",
          categoryColor: "#EF4444",
          description: "MTN recharge for emergency calls",
          note: "MTN recharge for emergency calls",
          date: new Date(2025, 3, 18, 18, 0).toISOString(),
          isRecurring: false,
        },
      ];

      const sampleBudgets: Budget[] = [
        {
          id: "b1",
          category: "Food",
          categoryIcon: "restaurant-outline",
          limitAmount: 15000,
          spentAmount: 12000,
          period: "monthly",
          startDate: new Date().toISOString(),
          color: "#3CB96A",
        },
        {
          id: "b2",
          category: "Data & Airtime",
          categoryIcon: "wifi-outline",
          limitAmount: 8000,
          spentAmount: 2400,
          period: "monthly",
          startDate: new Date().toISOString(),
          color: "#3CB96A",
        },
        {
          id: "b3",
          category: "Transport",
          categoryIcon: "car-outline",
          limitAmount: 10000,
          spentAmount: 11000,
          period: "monthly",
          startDate: new Date().toISOString(),
          color: "#3CB96A",
        },
      ];

      const sampleSavings: SavingsGoal[] = [
        {
          id: "s1",
          name: "New Laptop",
          targetAmount: 250000,
          savedAmount: 150000,
          deadline: "2025-12-20",
          emoji: "💻",
          createdAt: new Date().toISOString(),
          contributions: [],
        },
        {
          id: "s2",
          name: "Phone Upgrade",
          targetAmount: 120000,
          savedAmount: 30000,
          deadline: "2025-10-15",
          emoji: "📱",
          createdAt: new Date().toISOString(),
          contributions: [],
        },
      ];

      // If existing data is empty, replace with samples
      if (t.length === 0 || t.some((tr) => tr.id.startsWith("sample"))) {
        await StorageService.saveTransactions(sampleTransactions);
        t = sampleTransactions;
      }
      if (b.length === 0) {
        await StorageService.saveBudgets(sampleBudgets);
        b = sampleBudgets;
      }
      if (s.length === 0) {
        await StorageService.saveSavingsGoals(sampleSavings);
        s = sampleSavings;
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
