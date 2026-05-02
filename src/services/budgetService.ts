import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { Budget } from '../types';

export const budgetService = {
  getBudgets: async (): Promise<Budget[]> => {
    const response = await apiClient.get(API_ENDPOINTS.BUDGETS);
    return (response as any[]).map(item => ({
      id: item.id,
      category: item.category,
      categoryIcon: item.icon || 'restaurant-outline',
      limitAmount: item.limit_amount,
      spentAmount: item.spent_amount || 0,
      period: item.period || 'monthly',
      startDate: item.start_date || new Date().toISOString(),
      color: item.color || '#3CB96A',
    }));
  },

  createBudget: async (data: any) => {
    return await apiClient.post(API_ENDPOINTS.BUDGETS, data);
  },

  updateBudget: async (id: string, data: any) => {
    return await apiClient.put(API_ENDPOINTS.BUDGET_BY_ID(id), data);
  },

  deleteBudget: async (id: string) => {
    return await apiClient.delete(API_ENDPOINTS.BUDGET_BY_ID(id));
  },
};
