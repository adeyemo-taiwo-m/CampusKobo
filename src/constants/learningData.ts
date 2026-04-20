export interface LearningContent {
  id: string;
  type: 'article' | 'video' | 'podcast';
  category: string;
  title: string;
  duration: string;
  content?: string;
  keyTakeaways?: string[];
  isFeatured?: boolean;
}

export const LEARNING_CONTENT: LearningContent[] = [
  {
    id: 'art-001',
    type: 'article',
    category: 'Budgeting',
    title: 'How to Stop Overspending as a Student',
    duration: '3 min read',
    isFeatured: true,
    keyTakeaways: ['Separate needs from wants', 'Use the 50/30/20 rule', 'Track every expense daily', 'Review your spending weekly'],
    content: `Budgeting is the most important skill you can learn as a student. With limited allowance and high campus costs, every kobo counts.

The 50/30/20 rule suggests spending 50% on needs (housing, food), 30% on wants (entertainment), and saving 20%. For OAU students, this might mean prioritizing Optop kitchen over eating out every day.

Tracking every expense, no matter how small, helps you see where leaks happen. That quick ₦200 snack adds up over a month!`
  },
  {
    id: 'art-002',
    type: 'article',
    category: 'Saving',
    title: 'Why You Always Run Out of Money',
    duration: '3 min read',
  },
  {
    id: 'vid-001',
    type: 'video',
    category: 'Budgeting',
    title: 'How to Create Your First Budget',
    duration: '5 min',
  },
  {
    id: 'pod-001',
    type: 'podcast',
    category: 'Finance',
    title: 'Market Pulse Podcast — EP 01',
    duration: '15 min',
    content: 'BOF OAU breaks down why students run out of money and how to fix it for good.'
  },
];

export const FINANCE_101_SERIES = [
  { id: '1', title: 'Budgeting Basics', duration: '5 min read', color: '#4ADE80' },
  { id: '2', title: 'Saving as a Student', duration: '4 min read', color: '#60A5FA' },
  { id: '3', title: 'Intro to Investing', duration: '6 min read', color: '#A78BFA' },
  { id: '4', title: 'Understanding Loans', duration: '5 min read', color: '#FBBF24' },
  { id: '5', title: 'Credit Scores Explained', duration: '4 min read', color: '#2DD4BF' },
  { id: '6', title: 'How Inflation Affects You', duration: '3 min read', color: '#F87171' },
  { id: '7', title: 'Building an Emergency Fund', duration: '5 min read', color: '#F472B6' },
  { id: '8', title: 'Financial Goals Setting', duration: '4 min read', color: '#FCD34D' },
];

export const GLOSSARY_TERMS = [
  { id: '1', term: 'Asset', partOfSpeech: 'noun', definition: 'Something of value that you own.', example: 'Your laptop or savings account are assets.', relatedTerms: ['Equity', 'Balance Sheet'] },
  { id: '2', term: 'Budget', partOfSpeech: 'noun', definition: 'A plan for how to spend and save your money.', example: 'Setting a ₦10,000 budget for food this week.', relatedTerms: ['Expense', 'Cash Flow'] },
  // ... Add more as needed
];
