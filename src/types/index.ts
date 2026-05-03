export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
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
  frequency: "daily" | "weekly" | "monthly";
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
  period: "monthly" | "termly";
  startDate: string;
  color: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
  emoji?: string;
  createdAt: string;
  contributions: {
    amount: number;
    date: string;
    note: string;
    source: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  currency: "NGN" | "USD";
  monthlyBudget: number;
  selectedGoals: string[];
  selectedCategories: string[];
  hasPIN: boolean;
  pin?: string;
  hideBalance?: boolean;
  hasCompletedOnboarding: boolean;
}

export interface LearningContent {
  id: string;
  title: string;
  type: "article" | "video" | "podcast";
  category: string;
  duration: string;
  content: string;
  keyTakeaways?: string[];
  relatedContentIds?: string[];
  isFeatured: boolean;
}

export interface FinanceSeriesEpisode {
  id: string;
  title: string;
  duration: string;
  episodeNumber: number;
  content: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  partOfSpeech: "noun" | "verb";
  definition: string;
  example: string;
  relatedTerms: string[];
}

export interface EnrichedBudget extends Budget {
  percent: number;       // 0–100
  remaining: number;     // limitAmount - spentAmount, min 0
  status: "healthy" | "warning" | "critical" | "exceeded";
}

export interface EnrichedSavingsGoal extends SavingsGoal {
  percent: number;       // 0–100
  remaining: number;     // targetAmount - savedAmount, min 0
  daysLeft: number | null;  // null if no deadline set
}
