import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Transaction, Budget, SavingsGoal, RecurringExpense } from '../types';
import { StorageService } from '../storage/StorageService';

interface AppContextType {
  user: User | null;
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  recurringExpenses: RecurringExpense[];
  isLoading: boolean;
  loadAllData: () => Promise<void>;
  addTransaction: (transaction: Transaction) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addBudget: (budget: Budget) => Promise<void>;
  updateBudget: (id: string, data: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addSavingsGoal: (goal: SavingsGoal) => Promise<void>;
  updateSavingsGoal: (id: string, data: Partial<SavingsGoal>) => Promise<void>;
  deleteSavingsGoal: (id: string) => Promise<void>;
  addFundsToGoal: (goalId: string, amount: number, note: string) => Promise<void>;
  addRecurringExpense: (item: RecurringExpense) => Promise<void>;
  updateRecurringExpense: (id: string, data: Partial<RecurringExpense>) => Promise<void>;
  deleteRecurringExpense: (id: string) => Promise<void>;
  pauseAllRecurring: () => Promise<void>;
  resumeAllRecurring: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      let t = await StorageService.getTransactions();
      const u = await StorageService.getUser();
      const b = await StorageService.getBudgets();
      const s = await StorageService.getSavingsGoals();
      const r = await StorageService.getRecurringExpenses();

      // Sample data to ensure it matches the latest mockup
      const sampleTransactions: Transaction[] = [
        {
          id: 'sample-1',
          amount: 60000,
          type: 'income',
          category: 'Salary',
          categoryIcon: 'cash-outline',
          categoryColor: '#10B981',
          description: 'Monthly Salary',
          date: new Date().toISOString(),
          isRecurring: true,
        },
        {
          id: 'sample-2',
          amount: 1500,
          type: 'expense',
          category: 'Food',
          categoryIcon: 'restaurant-outline',
          categoryColor: '#EF4444',
          description: 'Lunch at Shade\'s store',
          date: new Date().toISOString(),
          isRecurring: false,
        },
        {
          id: 'sample-3',
          amount: 2200,
          type: 'expense',
          category: 'Transport',
          categoryIcon: 'car-sport-outline',
          categoryColor: '#F59E0B',
          description: 'Uber to Island',
          date: new Date().toISOString(),
          isRecurring: false,
        },
        {
          id: 'sample-4',
          amount: 5000,
          type: 'expense',
          category: 'Shopping',
          categoryIcon: 'cart-outline',
          categoryColor: '#EC4899',
          description: 'Shoprite groceries',
          date: new Date().toISOString(),
          isRecurring: false,
        },
        {
          id: 'sample-5',
          amount: 1800,
          type: 'expense',
          category: 'Food',
          categoryIcon: 'cafe-outline',
          categoryColor: '#EF4444',
          description: 'Breakfast at Chicken Republic',
          date: new Date(Date.now() - 86400000).toISOString(),
          isRecurring: false,
        },
        {
          id: 'sample-6',
          amount: 500,
          type: 'expense',
          category: 'Airtime',
          categoryIcon: 'call-outline',
          categoryColor: '#3B82F6',
          description: 'MTN recharge',
          date: new Date(Date.now() - 86400000).toISOString(),
          isRecurring: false,
        },
        {
          id: 'sample-7',
          amount: 8000,
          type: 'expense',
          category: 'Utilities',
          categoryIcon: 'flash-outline',
          categoryColor: '#EF4444',
          description: 'EKEDC electricity bill',
          date: new Date(2025, 3, 18, 10, 0).toISOString(), 
          isRecurring: true,
        },
        {
          id: 'sample-8',
          amount: 3500,
          type: 'expense',
          category: 'Health',
          categoryIcon: 'heart-outline',
          categoryColor: '#EF4444',
          description: 'Pharmacy - Medplus',
          date: new Date(2025, 3, 18, 13, 30).toISOString(),
          isRecurring: false,
        },
        {
          id: 'sample-9',
          amount: 1000,
          type: 'expense',
          category: 'Airtime',
          categoryIcon: 'call-outline',
          categoryColor: '#EF4444',
          description: 'MTN recharge',
          date: new Date(2025, 3, 18, 18, 0).toISOString(),
          isRecurring: false,
        }
      ];

      // If existing transactions are just the old samples, replace them
      if (t.length === 0 || t.some(tr => tr.id.startsWith('sample'))) {
        await StorageService.saveTransactions(sampleTransactions);
        t = sampleTransactions;
      }

      setUserState(u);
      setTransactions(t);
      setBudgets(b);
      setSavingsGoals(s);
      setRecurringExpenses(r);
    } catch (error) {
      console.error('Error loading data in context:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const addTransaction = async (transaction: Transaction) => {
    const updated = await StorageService.addTransaction(transaction);
    if (updated) setTransactions(updated);
    
    if (transaction.type === 'expense') {
      const updatedBudgets = await StorageService.updateBudgetSpent(transaction.category, transaction.amount);
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

  const addFundsToGoal = async (goalId: string, amount: number, note: string) => {
    const goal = savingsGoals.find(g => g.id === goalId);
    if (goal) {
      const updatedGoal = {
        ...goal,
        savedAmount: goal.savedAmount + amount,
        contributions: [...goal.contributions, { amount, note, date: new Date().toISOString() }]
      };
      await updateSavingsGoal(goalId, updatedGoal);
    }
  };

  const addRecurringExpense = async (item: RecurringExpense) => {
    const updated = await StorageService.addRecurringExpense(item);
    if (updated) setRecurringExpenses(updated);
  };

  const updateRecurringExpense = async (id: string, data: Partial<RecurringExpense>) => {
    const updated = await StorageService.updateRecurringExpense(id, data);
    if (updated) setRecurringExpenses(updated);
  };

  const deleteRecurringExpense = async (id: string) => {
    const updated = await StorageService.deleteRecurringExpense(id);
    if (updated) setRecurringExpenses(updated);
  };

  const pauseAllRecurring = async () => {
    const updated = recurringExpenses.map(r => ({ ...r, isPaused: true }));
    await StorageService.saveRecurringExpenses(updated);
    setRecurringExpenses(updated);
  };

  const resumeAllRecurring = async () => {
    const updated = recurringExpenses.map(r => ({ ...r, isPaused: false }));
    await StorageService.saveRecurringExpenses(updated);
    setRecurringExpenses(updated);
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

  return (
    <AppContext.Provider value={{
      user, transactions, budgets, savingsGoals, recurringExpenses, isLoading,
      loadAllData, addTransaction, updateTransaction, deleteTransaction,
      addBudget, updateBudget, deleteBudget,
      addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, addFundsToGoal,
      addRecurringExpense, updateRecurringExpense, deleteRecurringExpense,
      pauseAllRecurring, resumeAllRecurring,
      updateUser, setUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
