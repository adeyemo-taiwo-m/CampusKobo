import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { Transaction } from '../types';

export interface IncomeResponse {
  id: string;
  amount: number;
  source: string;
  category: string;
  date: string;
  description?: string;
  is_recurring: boolean;
}

export interface ExpenseResponse {
  id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  is_recurring: boolean;
}

export const transactionService = {
  getIncome: async (): Promise<Transaction[]> => {
    const response = await apiClient.get(API_ENDPOINTS.INCOME);
    const data = Array.isArray(response) ? response : (response as any)?.data || [];
    return data.map((item: any) => ({
      id: item.id,
      amount: item.amount || 0,
      type: 'income',
      category: item.category || item.source || 'Other',
      categoryIcon: 'cash-outline',
      categoryColor: '#10B981',
      description: item.description || '',
      note: item.description || '',
      date: item.date || new Date().toISOString(),
      isRecurring: !!item.is_recurring,
    }));
  },

  getExpenses: async (): Promise<Transaction[]> => {
    const response = await apiClient.get(API_ENDPOINTS.EXPENSES);
    const data = Array.isArray(response) ? response : (response as any)?.data || [];
    
    if (__DEV__) {
      console.log(`📦 SYNC: Received ${data.length} expenses from API`);
      data.forEach((item: any, index: number) => {
        console.log(`   [${index}] ${item.category || item.source}: ${item.amount} (${item.date || 'no date'}) - ${item.description || 'no desc'}`);
      });
    }

    return data.map((item: any) => ({
      id: item.id,
      amount: item.amount || 0,
      type: 'expense',
      category: item.category || item.category_name || item.category_id || 'Other',
      categoryIcon: 'cart-outline',
      categoryColor: '#EF4444',
      description: item.description || '',
      note: item.description || '',
      date: item.date || new Date().toISOString(),
      isRecurring: !!item.is_recurring,
    }));
  },

  createIncome: async (data: any) => {
    return await apiClient.post(API_ENDPOINTS.INCOME, data);
  },

  createExpense: async (data: any) => {
    return await apiClient.post(API_ENDPOINTS.EXPENSES, data);
  },

  updateExpense: async (id: string, data: any) => {
    return await apiClient.put(API_ENDPOINTS.EXPENSE_BY_ID(id), data);
  },

  updateIncome: async (id: string, data: any) => {
    return await apiClient.put(API_ENDPOINTS.INCOME_BY_ID(id), data);
  },

  deleteExpense: async (id: string) => {
    return await apiClient.delete(API_ENDPOINTS.EXPENSE_BY_ID(id));
  },

  deleteIncome: async (id: string) => {
    return await apiClient.delete(API_ENDPOINTS.INCOME_BY_ID(id));
  },
};
