import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { SavingsGoal } from '../types';

export const savingsService = {
  getSavingsGoals: async (): Promise<SavingsGoal[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SAVINGS_GOALS);
    const data = Array.isArray(response) ? response : (response as any)?.data || [];
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      targetAmount: item.target_amount || 0,
      savedAmount: item.current_amount || 0,
      deadline: item.target_date,
      emoji: item.icon || '💰',
      createdAt: item.created_at || new Date().toISOString(),
      contributions: (item.contributions || []).map((c: any) => ({
        amount: c.amount || 0,
        note: c.note || '',
        source: c.source || '',
        date: c.date || new Date().toISOString(),
      })),
    }));
  },

  createSavingsGoal: async (data: any) => {
    return await apiClient.post(API_ENDPOINTS.SAVINGS_GOALS, data);
  },

  addContribution: async (goalId: string, data: any) => {
    return await apiClient.post(API_ENDPOINTS.SAVINGS_CONTRIBUTIONS(goalId), data);
  },
};
