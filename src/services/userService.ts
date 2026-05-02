import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

export interface UserProfileResponse {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  is_verified: boolean;
  created_at: string;
  // Add other fields as the API returns them
}

export interface UserProfileUpdateRequest {
  full_name?: string;
  // Other updatable fields
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
 * Revoke a specific session.
 */
export const revokeSession = async (sessionId: string): Promise<any> => {
  return await apiClient.delete(API_ENDPOINTS.REVOKE_SESSION(sessionId));
};

export const userService = {
  getMe,
  updateProfile,
  uploadAvatar,
  listSessions,
  revokeSession,
};
