import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Transaction, Budget, SavingsGoal, RecurringExpense } from '../types';

const KEYS = {
  USER: 'campuskobo_user',
  TRANSACTIONS: 'campuskobo_transactions',
  BUDGETS: 'campuskobo_budgets',
  SAVINGS: 'campuskobo_savings',
  RECURRING: 'campuskobo_recurring',
};

export const StorageService = {
  // User
  saveUser: async (user: User) => {
    try {
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },
  getUser: async (): Promise<User | null> => {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  // Transactions
  saveTransactions: async (transactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  },
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      const data = await AsyncStorage.getItem(KEYS.TRANSACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  },
  addTransaction: async (transaction: Transaction) => {
    try {
      const transactions = await StorageService.getTransactions();
      const updated = [transaction, ...transactions];
      await StorageService.saveTransactions(updated);
      return updated;
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  },
  updateTransaction: async (id: string, updatedData: Partial<Transaction>) => {
    try {
      const transactions = await StorageService.getTransactions();
      const updated = transactions.map(t => t.id === id ? { ...t, ...updatedData } : t);
      await StorageService.saveTransactions(updated);
      return updated;
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  },
  deleteTransaction: async (id: string) => {
    try {
      const transactions = await StorageService.getTransactions();
      const updated = transactions.filter(t => t.id !== id);
      await StorageService.saveTransactions(updated);
      return updated;
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  },

  // Budgets
  saveBudgets: async (budgets: Budget[]) => {
    try {
      await AsyncStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (error) {
      console.error('Error saving budgets:', error);
    }
  },
  getBudgets: async (): Promise<Budget[]> => {
    try {
      const data = await AsyncStorage.getItem(KEYS.BUDGETS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting budgets:', error);
      return [];
    }
  },
  addBudget: async (budget: Budget) => {
    try {
      const budgets = await StorageService.getBudgets();
      const updated = [...budgets, budget];
      await StorageService.saveBudgets(updated);
      return updated;
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  },
  updateBudget: async (id: string, updatedData: Partial<Budget>) => {
    try {
      const budgets = await StorageService.getBudgets();
      const updated = budgets.map(b => b.id === id ? { ...b, ...updatedData } : b);
      await StorageService.saveBudgets(updated);
      return updated;
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  },
  deleteBudget: async (id: string) => {
    try {
      const budgets = await StorageService.getBudgets();
      const updated = budgets.filter(b => b.id !== id);
      await StorageService.saveBudgets(updated);
      return updated;
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  },
  updateBudgetSpent: async (category: string, amount: number) => {
    try {
      const budgets = await StorageService.getBudgets();
      const updated = budgets.map(b => 
        b.category === category ? { ...b, spentAmount: b.spentAmount + amount } : b
      );
      await StorageService.saveBudgets(updated);
      return updated;
    } catch (error) {
      console.error('Error updating budget spent:', error);
    }
  },

  // Savings Goals
  saveSavingsGoals: async (goals: SavingsGoal[]) => {
    try {
      await AsyncStorage.setItem(KEYS.SAVINGS, JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving savings goals:', error);
    }
  },
  getSavingsGoals: async (): Promise<SavingsGoal[]> => {
    try {
      const data = await AsyncStorage.getItem(KEYS.SAVINGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting savings goals:', error);
      return [];
    }
  },
  addSavingsGoal: async (goal: SavingsGoal) => {
    try {
      const goals = await StorageService.getSavingsGoals();
      const updated = [...goals, goal];
      await StorageService.saveSavingsGoals(updated);
      return updated;
    } catch (error) {
      console.error('Error adding savings goal:', error);
    }
  },
  updateSavingsGoal: async (id: string, updatedData: Partial<SavingsGoal>) => {
    try {
      const goals = await StorageService.getSavingsGoals();
      const updated = goals.map(g => g.id === id ? { ...g, ...updatedData } : g);
      await StorageService.saveSavingsGoals(updated);
      return updated;
    } catch (error) {
      console.error('Error updating savings goal:', error);
    }
  },
  deleteSavingsGoal: async (id: string) => {
    try {
      const goals = await StorageService.getSavingsGoals();
      const updated = goals.filter(g => g.id !== id);
      await StorageService.saveSavingsGoals(updated);
      return updated;
    } catch (error) {
      console.error('Error deleting savings goal:', error);
    }
  },

  // Recurring Expenses
  saveRecurringExpenses: async (items: RecurringExpense[]) => {
    try {
      await AsyncStorage.setItem(KEYS.RECURRING, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving recurring expenses:', error);
    }
  },
  getRecurringExpenses: async (): Promise<RecurringExpense[]> => {
    try {
      const data = await AsyncStorage.getItem(KEYS.RECURRING);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting recurring expenses:', error);
      return [];
    }
  },
  addRecurringExpense: async (item: RecurringExpense) => {
    try {
      const items = await StorageService.getRecurringExpenses();
      const updated = [...items, item];
      await StorageService.saveRecurringExpenses(updated);
      return updated;
    } catch (error) {
      console.error('Error adding recurring expense:', error);
    }
  },
  updateRecurringExpense: async (id: string, updatedData: Partial<RecurringExpense>) => {
    try {
      const items = await StorageService.getRecurringExpenses();
      const updated = items.map(i => i.id === id ? { ...i, ...updatedData } : i);
      await StorageService.saveRecurringExpenses(updated);
      return updated;
    } catch (error) {
      console.error('Error updating recurring expense:', error);
    }
  },
  deleteRecurringExpense: async (id: string) => {
    try {
      const items = await StorageService.getRecurringExpenses();
      const updated = items.filter(i => i.id !== id);
      await StorageService.saveRecurringExpenses(updated);
      return updated;
    } catch (error) {
      console.error('Error deleting recurring expense:', error);
    }
  },

  clearAllData: async () => {
    try {
      await AsyncStorage.multiRemove(Object.values(KEYS));
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
};
