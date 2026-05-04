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
    if (__DEV__) console.log('📤 API CREATE SAVINGS GOAL:', data);
    const response = await apiClient.post(API_ENDPOINTS.SAVINGS_GOALS, data);
    if (__DEV__) console.log('✅ API CREATE SAVINGS GOAL SUCCESS:', response);
    return response;
  },

  updateSavingsGoal: async (id: string, data: any) => {
    if (__DEV__) console.log(`📤 API UPDATE SAVINGS GOAL [${id}]:`, data);
    const response = await apiClient.put(API_ENDPOINTS.SAVINGS_GOAL_BY_ID(id), data);
    if (__DEV__) console.log(`✅ API UPDATE SAVINGS GOAL SUCCESS [${id}]`);
    return response;
  },

  deleteSavingsGoal: async (id: string) => {
    if (__DEV__) console.log(`🗑️ API DELETE SAVINGS GOAL [${id}]`);
    const response = await apiClient.delete(API_ENDPOINTS.SAVINGS_GOAL_BY_ID(id));
    if (__DEV__) console.log(`✅ API DELETE SAVINGS GOAL SUCCESS [${id}]`);
    return response;
  },

  addContribution: async (goalId: string, data: any) => {
    if (__DEV__) console.log(`📤 API ADD CONTRIBUTION to [${goalId}]:`, data);
    const response = await apiClient.post(API_ENDPOINTS.SAVINGS_CONTRIBUTIONS(goalId), data);
    if (__DEV__) console.log(`✅ API ADD CONTRIBUTION SUCCESS for [${goalId}]`);
    return response;
  },
};
