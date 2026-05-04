import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { Budget } from '../types';

export const budgetService = {
  getBudgets: async (): Promise<Budget[]> => {
    const response = await apiClient.get(API_ENDPOINTS.BUDGETS);
    
    // Extremely robust data extraction
    let data: any[] = [];
    
    const extractData = (obj: any): any[] => {
      if (!obj) return [];
      if (Array.isArray(obj)) return obj;
      
      // Look for common list keys
      if (obj.budgets && Array.isArray(obj.budgets)) return obj.budgets;
      if (obj.data) {
         if (Array.isArray(obj.data)) return obj.data;
         if (typeof obj.data === 'object' && obj.data.budgets && Array.isArray(obj.data.budgets)) return obj.data.budgets;
         if (typeof obj.data === 'object' && obj.data.budget) return [obj.data];
      }
      
      // If it's a single object with a budget or category field, treat as single item
      if (obj.budget || obj.category || obj.limit_amount) return [obj];
      
      return [];
    };

    data = extractData(response);
    
    if (__DEV__) {
      console.log(`📦 BUDGET SYNC: Found ${data.length} budgets in response`);
      console.log('EXTRACTED DATA:', JSON.stringify(data, null, 2));
    }

    return data.map((item: any) => {
      // Aggressively find the amount
      const amount = item.limit_amount || item.budget || item.monthly_budget || item.total_budget || item.amount || item.limit || 0;
      const spent = item.spent_amount || item.amount_spent || item.total_spent || item.current_spent || item.spent || 0;
      const categoryName = item.category || item.category_name || item.category_id || item.name || item.title || item.label || 'Other';
      
      return {
        id: item.id || Math.random().toString(36).substr(2, 9),
        category: categoryName,
        categoryIcon: item.icon || item.categoryIcon || 'wallet-outline',
        limitAmount: typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : Number(amount),
        spentAmount: typeof spent === 'string' ? parseFloat(spent.replace(/[^0-9.]/g, '')) : Number(spent),
        period: item.period || 'monthly',
        startDate: item.start_date || item.created_at || new Date().toISOString(),
        color: item.color || '#3CB96A',
      };
    });
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
