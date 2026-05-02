import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export interface DashboardSummary {
  total_balance: number;
  total_income: number;
  total_expenses: number;
  monthly_budget?: number;
  budget_spent?: number;
  savings_total?: number;
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_SUMMARY);
    console.log('🔌 RAW API Dashboard Summary:', response);
    return response as unknown as DashboardSummary;
  },

  getDashboardData: async (): Promise<any> => {
    return await apiClient.get(API_ENDPOINTS.DASHBOARD);
  },
};
