import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export interface OnboardingProgressResponse {
  completed: boolean;
  current_step: string | null;
  goal_selected: boolean;
  budget_setup: boolean;
  categories_setup: boolean;
}

export interface GoalSelectionRequest {
  goal: string; // e.g. 'track_spending' | 'control_budget' | 'save_goals'
}

export interface BudgetSetupRequest {
  monthly_income: number;
  currency: string; // 'NGN' | 'USD'
}

export interface CategorySetupRequest {
  category_ids: string[];
}

/**
 * Get user's current onboarding progress.
 */
export const getProgress = async (): Promise<OnboardingProgressResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.ONBOARDING_PROGRESS);
  return response as unknown as OnboardingProgressResponse;
};

/**
 * Record a selected goal during onboarding.
 */
export const selectGoal = async (data: GoalSelectionRequest): Promise<any> => {
  return await apiClient.post(API_ENDPOINTS.ONBOARDING_GOAL, data);
};

/**
 * Record monthly budget setup during onboarding.
 */
export const setupBudget = async (data: BudgetSetupRequest): Promise<any> => {
  return await apiClient.post(API_ENDPOINTS.ONBOARDING_BUDGET, data);
};

/**
 * Record selected categories during onboarding.
 */
export const setupCategories = async (data: CategorySetupRequest): Promise<any> => {
  return await apiClient.post(API_ENDPOINTS.ONBOARDING_CATEGORIES, data);
};
