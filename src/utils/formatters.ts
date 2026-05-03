import { format, isToday, isYesterday, parseISO, endOfMonth, differenceInDays } from 'date-fns';
import { PRIMARY_GREEN } from '../constants';

export const formatCurrency = (amount: number, showSymbol: boolean = true): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return showSymbol ? '₦0' : '0';
  const formatted = Math.abs(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const symbol = showSymbol ? '₦' : '';
  return `${symbol}${formatted}`;
};

// Use this when you want negative values to show as red (pass the sign separately to the style)
export const formatCurrencyWithSign = (amount: number, type: 'income' | 'expense'): string => {
  const prefix = type === 'income' ? '+₦' : '-₦';
  return `${prefix}${Math.abs(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Formats a date string into a human-readable format.
 * @param dateInput The date string or Date object to format
 * @returns 'Today', 'Yesterday', or 'MMM d' (e.g., Apr 18)
 */
export const formatDate = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;

  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'MMM d');
};

/**
 * Formats a date string into a full descriptive format.
 * @param dateInput The date string or Date object to format
 * @returns 'MMMM d, yyyy • h:mm a' (e.g., April 18, 2026 • 2:15 PM)
 */
export const formatDateFull = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return format(date, 'MMMM d, yyyy • h:mm a');
};

/**
 * Formats a date string into a simple time format.
 * @param dateInput The date string or Date object to format
 * @returns 'h:mm a' (e.g., 2:15 PM)
 */
export const formatTime = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return format(date, 'h:mm a');
};

/**
 * Returns a color based on the percentage of a budget or savings used.
 * @param percent The percentage used
 * @returns '#1A9E3F', yellow (#F59E0B), or red (#EF4444)
 */
export const getProgressColor = (percent: number): string => {
  if (percent >= 100) return '#EF4444'; // red — exceeded
  if (percent >= 90) return '#EF4444';  // red — critical
  if (percent >= 70) return '#F59E0B';  // yellow — warning
  return '#1A9E3F';                     // green — healthy
};

/**
 * Calculates the number of days remaining in the current month.
 * @returns number of days remaining
 */
export const getDaysLeftInMonth = (): number => {
  const today = new Date();
  const lastDay = endOfMonth(today);
  return differenceInDays(lastDay, today);
};

/**
 * Safely calculates a percentage.
 * @param current The current value
 * @param total The total value
 * @returns The percentage rounded to nearest integer
 */
export const getPercentage = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
};

/**
 * Truncates text if it exceeds a maximum length.
 * @param text The text to truncate
 * @param maxLength The maximum allowed length
 * @returns Truncated text with '...' if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formats a currency amount into parts for special UI rendering.
 * @param amount The currency amount
 * @returns An object with whole and decimal parts
 */
export const formatCurrencyParts = (amount: number): { whole: string; decimal: string } => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return { whole: '₦0', decimal: '.00' };
  }
  const abs = Math.abs(amount);
  const whole = Math.floor(abs).toLocaleString('en-NG');
  const decimal = (abs % 1).toFixed(2).slice(1); // → ".00" or ".50"
  return { whole: `₦${whole}`, decimal };
};
