import { format, isToday, isYesterday, parseISO, endOfMonth, differenceInDays } from 'date-fns';
import { PRIMARY_GREEN } from '../constants';

/**
 * Formats a number as a currency string.
 * @param amount The amount to format
 * @param currency The currency code (default: NGN)
 * @returns A formatted currency string (e.g., ₦1,500)
 */
export const formatCurrency = (amount: number, currency: string = 'NGN'): string => {
  const symbol = currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : currency;
  
  // Use toLocaleString for comma separation
  const formattedAmount = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const sign = amount < 0 ? '-' : '';
  
  return `${sign}${symbol}${formattedAmount}`;
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
 * @returns PRIMARY_GREEN, yellow (#F59E0B), or red (#EF4444)
 */
export const getProgressColor = (percent: number): string => {
  if (percent < 70) return PRIMARY_GREEN;
  if (percent < 90) return '#F59E0B';
  return '#EF4444';
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
