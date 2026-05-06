import { supabase } from '../lib/supabase';

export interface SecurityPreferences {
  app_lock_enabled: boolean;
  biometric_enabled: boolean;
  pin_lock_enabled: boolean;
  fingerprint_enabled: boolean;
  face_id_enabled: boolean;
  hide_balance: boolean;
  data_analytics_enabled: boolean;
}

/**
 * Returns the user's security preferences directly from Supabase.
 */
export const getSecurityPreferences = async (): Promise<SecurityPreferences | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_security_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('❌ Supabase Fetch Security Error:', error);
    throw error;
  }

  return data as SecurityPreferences;
};

/**
 * Update the user's security preferences directly in Supabase.
 */
export const updateSecurityPreferences = async (data: Partial<SecurityPreferences>): Promise<any> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error, data: updatedData } = await supabase
    .from('user_security_settings')
    .upsert({
      user_id: user.id,
      ...data,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Supabase Update Security Error:', error);
    throw new Error(error.message || 'Failed to update security settings');
  }
  
  return updatedData;
};

export const securityService = {
  getSecurityPreferences,
  updateSecurityPreferences,
};

export default securityService;
