import { Platform } from 'react-native';
import apiClient from './apiClient';
import { API_ENDPOINTS, API_BASE_URL } from '../constants/api';

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
  const fileName = imageUri.split('/').pop() || 'avatar';
  const hasExtension = fileName.includes('.');
  const finalFileName = hasExtension ? fileName : `${fileName}.${fileType || 'jpg'}`;

  if (typeof window !== 'undefined' && window.navigator) {
    // Web platform
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const file = new File([blob], finalFileName, { type: blob.type || 'image/jpeg' });
    formData.append('file', file);
    if (__DEV__) console.log('📁 Web FormData created with File:', finalFileName, file.type, file.size);
  } else {
    // React Native platform
    // @ts-ignore - FormData expects a specific object structure in RN
    formData.append('file', {
      uri: imageUri,
      name: finalFileName,
      type: `image/${fileType || 'jpg'}`,
    });
  }

  if (__DEV__) console.log('🚀 Bypassing axios for avatar upload to resolve potential CORS and FormData issues...');
  
  const token = await (async () => {
    try {
      const { getAccessToken } = await import('../storage/TokenStorage');
      return await getAccessToken();
    } catch (e) {
      return null;
    }
  })();

  const isWeb = Platform.OS === 'web';
  if (__DEV__) console.log(`🔄 Using FETCH (Unified) path for upload on ${isWeb ? 'Web' : 'Native'}`);

  // Unified fetch approach for both Web and Native
  // Native fetch handles FormData perfectly in React Native, avoiding axios/interceptor pitfalls
  const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOAD_AVATAR}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: formData as any,
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    let errorMsg = `Upload failed with status ${res.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMsg = errorJson.detail || errorJson.message || errorMsg;
    } catch (e) {}
    throw new Error(errorMsg);
  }
  
  const responseData = await res.json();
  const result = responseData;
  let avatar_url = result.avatar_url || result.data?.avatar_url || result.url || result.data?.url;
  
  if (!avatar_url) {
    if (__DEV__) console.error('❌ Upload Response missing avatar_url:', JSON.stringify(result));
    throw new Error('The server uploaded the image but did not return a valid URL.');
  }

  // Handle relative URLs from backend
  if (avatar_url && !avatar_url.startsWith('http')) {
    // Remove /api/v1 from base URL if the returned path already includes it or is intended to be relative to root
    const baseUrl = API_BASE_URL.replace('/api/v1', '');
    avatar_url = `${baseUrl}${avatar_url.startsWith('/') ? '' : '/'}${avatar_url}`;
  }
  
  return { avatar_url };
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
