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
    return (response as any[]).map(item => ({
      id: item.id,
      amount: item.amount,
      type: 'income',
      category: item.category || item.source || 'Other',
      categoryIcon: 'cash-outline',
      categoryColor: '#10B981',
      description: item.description || '',
      note: item.description || '',
      date: item.date,
      isRecurring: item.is_recurring,
    }));
  },

  getExpenses: async (): Promise<Transaction[]> => {
    const response = await apiClient.get(API_ENDPOINTS.EXPENSES);
    return (response as any[]).map(item => ({
      id: item.id,
      amount: item.amount,
      type: 'expense',
      category: item.category || 'Other',
      categoryIcon: 'cart-outline',
      categoryColor: '#EF4444',
      description: item.description || '',
      note: item.description || '',
      date: item.date,
      isRecurring: item.is_recurring,
    }));
  },

  createIncome: async (data: any) => {
    return await apiClient.post(API_ENDPOINTS.INCOME, data);
  },

  createExpense: async (data: any) => {
    return await apiClient.post(API_ENDPOINTS.EXPENSES, data);
  },
};
