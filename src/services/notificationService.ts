import { supabase } from '../lib/supabase';

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
 * Returns the user's notification preferences directly from Supabase.
 */
export const getPreferences = async (): Promise<NotificationPreferences> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
    console.error('❌ Supabase Fetch Preferences Error:', error);
    throw error;
  }

  // If no preferences exist, return defaults
  if (!data) {
    return {
      all_notifications: true,
      budget_alerts: true,
      savings_reminders: true,
      bill_reminders: true,
      new_content: true,
      finance_101: true,
      podcast_updates: true,
      app_updates: true,
      bof_announcements: true,
      do_not_disturb: false,
    };
  }

  return data as NotificationPreferences;
};

/**
 * Update the user's notification preferences directly in Supabase.
 */
export const updatePreferences = async (data: Partial<NotificationPreferences>): Promise<any> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  console.log('📤 Updating notification preferences in Supabase:', data);

  const { error, data: updatedData } = await supabase
    .from('notification_preferences')
    .upsert({
      user_id: user.id,
      ...data,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Supabase Update Preferences Error:', error);
    throw new Error(error.message || 'Failed to update preferences in database');
  }
  
  return updatedData;
};

export const notificationService = {
  getPreferences,
  updatePreferences,
};

export default notificationService;
