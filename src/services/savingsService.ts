import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { SavingsGoal } from '../types';

export const savingsService = {
  getSavingsGoals: async (): Promise<SavingsGoal[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SAVINGS_GOALS);
    return (response as any[]).map(item => ({
      id: item.id,
      name: item.name,
      targetAmount: item.target_amount,
      savedAmount: item.current_amount || 0,
      deadline: item.target_date,
      emoji: item.icon || '💰',
      createdAt: item.created_at || new Date().toISOString(),
      contributions: (item.contributions || []).map((c: any) => ({
        amount: c.amount,
        note: c.note || '',
        source: c.source || '',
        date: c.date,
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
