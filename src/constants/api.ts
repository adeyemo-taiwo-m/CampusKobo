export const API_BASE_URL = 'https://campus-kobo-backend-gmiq.vercel.app/api/v1';

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  GOOGLE_AUTH: '/auth/google',
  REFRESH_TOKEN: '/auth/refresh',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification',
  CHANGE_PASSWORD: '/auth/change-password',
  CHANGE_EMAIL: '/auth/change-email',
  CREATE_PIN: '/auth/create-pin',
  LOGOUT: '/auth/logout',

  // Onboarding
  ONBOARDING_PROGRESS: '/onboarding/progress',
  ONBOARDING_GOAL: '/onboarding/goal',
  ONBOARDING_BUDGET: '/onboarding/budget',
  ONBOARDING_CATEGORIES: '/onboarding/categories',

  // Users
  GET_ME: '/users/me',
  UPDATE_PROFILE: '/users/profile',
  UPLOAD_AVATAR: '/users/avatar',
  UPDATE_BIOMETRICS: '/users/security/biometrics',
  UPDATE_PRIVACY: '/users/privacy',
  LIST_SESSIONS: '/users/sessions',
  REVOKE_SESSION: (sessionId: string) => `/users/sessions/${sessionId}`,

  // Dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_SUMMARY: '/dashboard/summary',

  // Income
  INCOME: '/income',
  INCOME_BY_ID: (id: string) => `/income/${id}`,

  // Expenses
  EXPENSES: '/expenses',
  EXPENSE_BY_ID: (id: string) => `/expenses/${id}`,

  // Budgets
  BUDGETS: '/budgets',
  BUDGET_BY_ID: (id: string) => `/budgets/${id}`,

  // Savings
  SAVINGS: '/savings',
  SAVINGS_GOALS: '/savings/goals',
  SAVINGS_GOAL_BY_ID: (id: string) => `/savings/${id}`,
  SAVINGS_CONTRIBUTIONS: (goalId: string) => `/savings/goals/${goalId}/contributions`,

  // Notifications
  NOTIFICATION_PREFERENCES: '/notifications/preferences',

  // Support
  FAQS: '/support/faqs',
  SUPPORT_MESSAGES: '/support/messages',

  // Health
  HEALTH: '/health',
};

export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'campuskobo_access_token',
  REFRESH_TOKEN: 'campuskobo_refresh_token',
  TOKEN_EXPIRY: 'campuskobo_token_expiry',
};

export const API_TIMEOUT = 15000; // 15 seconds
