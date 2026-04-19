export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  categoryIcon: string;
  categoryColor: string;
  description: string;
  date: string; // ISO date string
  note?: string;
  isRecurring: boolean;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  nextDueDate: string;
  isPaused: boolean;
}

export interface Budget {
  id: string;
  category: string;
  categoryIcon: string;
  limitAmount: number;
  spentAmount: number;
  period: 'monthly' | 'termly';
  startDate: string;
  color: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
  createdAt: string;
  contributions: {
    amount: number;
    date: string;
    note: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  currency: 'NGN' | 'USD';
  monthlyBudget: number;
  selectedGoals: string[];
  selectedCategories: string[];
  hasPIN: boolean;
  pin?: string;
  hasCompletedOnboarding: boolean;
}

export interface LearningContent {
  id: string;
  title: string;
  type: 'article' | 'video' | 'podcast';
  category: string;
  duration: string;
  content: string;
  keyTakeaways: string[];
  relatedContentIds: string[];
  isFeatured: boolean;
}
