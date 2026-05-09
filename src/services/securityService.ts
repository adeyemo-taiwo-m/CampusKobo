import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { userService } from './userService';

export interface SecurityPreferences {
  app_lock_enabled: boolean;
  biometric_enabled: boolean;
  pin_lock_enabled: boolean;
  fingerprint_enabled: boolean;
  face_id_enabled: boolean;
  hide_balance: boolean;
  allow_analytics: boolean;
}

/**
 * Returns the user's security preferences from the user endpoint.
 */
export const getSecurityPreferences = async (): Promise<SecurityPreferences | null> => {
  try {
    const user = await userService.getMe();
    if (!user) return null;

    return {
      app_lock_enabled: user.app_lock_enabled ?? false,
      biometric_enabled: user.biometric_enabled ?? false,
      pin_lock_enabled: user.pin_lock_enabled ?? false,
      fingerprint_enabled: user.fingerprint_enabled ?? false,
      face_id_enabled: user.face_id_enabled ?? false,
      hide_balance: user.hide_balance ?? false,
      allow_analytics: user.allow_analytics ?? true,
    };
  } catch (error) {
    console.error('❌ Fetch Security Error:', error);
    throw error;
  }
};

/**
 * Update the user's security preferences via the specific security/privacy endpoints.
 */
export const updateSecurityPreferences = async (data: Partial<SecurityPreferences>): Promise<any> => {
  try {
    // Separate biometric and privacy updates as they use different endpoints
    const biometricFields = ['biometric_enabled', 'face_id_enabled', 'fingerprint_enabled', 'app_lock_enabled', 'pin_lock_enabled'];
    const privacyFields = ['hide_balance', 'allow_analytics'];

    const biometricUpdates: any = {};
    const privacyUpdates: any = {};

    Object.keys(data).forEach(key => {
      if (biometricFields.includes(key)) {
        biometricUpdates[key] = (data as any)[key];
      } else if (privacyFields.includes(key)) {
        privacyUpdates[key] = (data as any)[key];
      }
    });

    let result = {};

    if (Object.keys(biometricUpdates).length > 0) {
      result = await userService.updateBiometricSettings(biometricUpdates);
    }

    if (Object.keys(privacyUpdates).length > 0) {
      const privacyResult = await userService.updatePrivacySettings(privacyUpdates);
      result = { ...result, ...privacyResult };
    }

    return result;
  } catch (error: any) {
    console.error('❌ Update Security Error:', error);
    throw new Error(error.message || 'Failed to update security settings');
  }
};

export const securityService = {
  getSecurityPreferences,
  updateSecurityPreferences,
};

export default securityService;
