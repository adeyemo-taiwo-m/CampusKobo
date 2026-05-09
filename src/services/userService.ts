import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export interface UserProfileResponse {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  is_email_verified: boolean;
  created_at: string;
  app_lock_enabled?: boolean;
  biometric_enabled?: boolean;
  pin_lock_enabled?: boolean;
  fingerprint_enabled?: boolean;
  face_id_enabled?: boolean;
  hide_balance?: boolean;
  allow_analytics?: boolean;
  has_pin?: boolean;
}

export interface UserProfileUpdateRequest {
  full_name?: string;
  // Other updatable fields
}

export interface BiometricSettingsRequest {
  biometric_enabled?: boolean;
  face_id_enabled?: boolean;
  fingerprint_enabled?: boolean;
  app_lock_enabled?: boolean;
  pin_lock_enabled?: boolean;
}

export interface PrivacySettingsRequest {
  hide_balance?: boolean;
  allow_analytics?: boolean;
}

/**
 * Get current user profile.
 */
export const getMe = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.GET_ME);
  return response as unknown as UserProfileResponse;
};

/**
 * Update current user profile.
 */
export const updateProfile = async (data: UserProfileUpdateRequest): Promise<UserProfileResponse> => {
  const response = await apiClient.put(API_ENDPOINTS.UPDATE_PROFILE, data);
  return response as unknown as UserProfileResponse;
};

/**
 * Upload a new avatar image.
 */
export const uploadAvatar = async (imageUri: string): Promise<{ avatar_url: string }> => {
  const formData = new FormData();
  
  // Extract file name and type from URI
  const uriParts = imageUri.split('.');
  const fileType = uriParts[uriParts.length - 1];
  const fileName = imageUri.split('/').pop();

  // @ts-ignore - FormData expects a specific object structure in RN
  formData.append('file', {
    uri: imageUri,
    name: fileName || `avatar.${fileType}`,
    type: `image/${fileType}`,
  });

  const response = await apiClient.post(API_ENDPOINTS.UPLOAD_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response as unknown as { avatar_url: string };
};

/**
 * List all active user sessions.
 */
export const listSessions = async (): Promise<any[]> => {
  const response = await apiClient.get(API_ENDPOINTS.LIST_SESSIONS);
  return response as unknown as any[];
};

/**
 * Revoke a specific user session.
 */
export const revokeSession = async (sessionId: string): Promise<any> => {
  const response = await apiClient.delete(API_ENDPOINTS.REVOKE_SESSION(sessionId));
  return response;
};

/**
 * Update biometric security settings.
 */
export const updateBiometricSettings = async (data: BiometricSettingsRequest): Promise<any> => {
  return await apiClient.put(API_ENDPOINTS.UPDATE_BIOMETRICS, data);
};

/**
 * Update privacy settings.
 */
export const updatePrivacySettings = async (data: PrivacySettingsRequest): Promise<any> => {
  return await apiClient.put(API_ENDPOINTS.UPDATE_PRIVACY, data);
};

export const userService = {
  getMe,
  getProfile: getMe,
  updateProfile,
  uploadAvatar,
  listSessions,
  revokeSession,
  updateBiometricSettings,
  updatePrivacySettings,
};
