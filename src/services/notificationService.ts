import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export interface NotificationPreferences {
  all_notifications: boolean;
  budget_alerts: boolean;
  savings_reminders: boolean;
  bill_reminders: boolean;
  new_content: boolean;
  finance_101: boolean;
  podcast_updates: boolean;
  app_updates: boolean;
  bof_announcements: boolean;
  do_not_disturb: boolean;
  quiet_hours_start?: string; // e.g. '22:00'
  quiet_hours_end?: string;   // e.g. '08:00'
}

/**
 * Get the user's saved notification preferences from the server.
 */
export const getPreferences = async (): Promise<NotificationPreferences> => {
  const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION_PREFERENCES);
  return response as unknown as NotificationPreferences;
};

/**
 * Update the user's notification preferences.
 */
export const updatePreferences = async (data: Partial<NotificationPreferences>): Promise<NotificationPreferences> => {
  const response = await apiClient.put(API_ENDPOINTS.NOTIFICATION_PREFERENCES, data);
  return response as unknown as NotificationPreferences;
};

export const notificationService = {
  getPreferences,
  updatePreferences,
};

export default notificationService;
