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
      description: item.note || item.description || '',
      note: item.note || item.description || '',
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
    if (__DEV__) console.log('📤 API CREATE INCOME:', data);
    const response = await apiClient.post(API_ENDPOINTS.INCOME, data);
    if (__DEV__) console.log('✅ API CREATE INCOME SUCCESS:', response);
    return response;
  },

  createExpense: async (data: any) => {
    if (__DEV__) console.log('📤 API CREATE EXPENSE:', data);
    const response = await apiClient.post(API_ENDPOINTS.EXPENSES, data);
    if (__DEV__) console.log('✅ API CREATE EXPENSE SUCCESS:', response);
    return response;
  },

  updateExpense: async (id: string, data: any) => {
    if (__DEV__) console.log(`📤 API UPDATE EXPENSE [${id}]:`, data);
    const response = await apiClient.put(API_ENDPOINTS.EXPENSE_BY_ID(id), data);
    if (__DEV__) console.log(`✅ API UPDATE EXPENSE SUCCESS [${id}]`);
    return response;
  },

  updateIncome: async (id: string, data: any) => {
    if (__DEV__) console.log(`📤 API UPDATE INCOME [${id}]:`, data);
    const response = await apiClient.put(API_ENDPOINTS.INCOME_BY_ID(id), data);
    if (__DEV__) console.log(`✅ API UPDATE INCOME SUCCESS [${id}]`);
    return response;
  },

  deleteExpense: async (id: string) => {
    if (__DEV__) console.log(`🗑️ API DELETE EXPENSE [${id}]`);
    const response = await apiClient.delete(API_ENDPOINTS.EXPENSE_BY_ID(id));
    if (__DEV__) console.log(`✅ API DELETE EXPENSE SUCCESS [${id}]`);
    return response;
  },

  deleteIncome: async (id: string) => {
    if (__DEV__) console.log(`🗑️ API DELETE INCOME [${id}]`);
    const response = await apiClient.delete(API_ENDPOINTS.INCOME_BY_ID(id));
    if (__DEV__) console.log(`✅ API DELETE INCOME SUCCESS [${id}]`);
    return response;
  },
};
