import apiClient from './apiClient';
import { saveTokens, clearTokens } from '../storage/TokenStorage';
import { API_ENDPOINTS } from '../constants/api';

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user?: AuthUserResponse;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  full_name: string;
  is_verified: boolean;
  created_at: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface GoogleAuthRequest {
  id_token: string;
}

/**
 * Register a new user.
 */
export const register = async (data: RegisterRequest): Promise<AuthUserResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.REGISTER, data);
  return response as unknown as AuthUserResponse;
};

/**
 * Login an existing user and save tokens.
 */
export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.LOGIN, data);
  const tokenResponse = response as unknown as TokenResponse;
  
  if (tokenResponse.access_token && tokenResponse.refresh_token) {
    await saveTokens(tokenResponse.access_token, tokenResponse.refresh_token);
  }
  
  return tokenResponse;
};

/**
 * Authenticate with Google.
 */
export const googleAuth = async (data: GoogleAuthRequest): Promise<TokenResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.GOOGLE_AUTH, data);
  const tokenResponse = response as unknown as TokenResponse;
  
  if (tokenResponse.access_token && tokenResponse.refresh_token) {
    await saveTokens(tokenResponse.access_token, tokenResponse.refresh_token);
  }
  
  return tokenResponse;
};

/**
 * Verify email address with a code.
 */
export const verifyEmail = async (data: VerifyEmailRequest): Promise<any> => {
  return await apiClient.post(API_ENDPOINTS.VERIFY_EMAIL, data);
};

/**
 * Resend verification email.
 */
export const resendVerification = async (email: string): Promise<any> => {
  return await apiClient.post(API_ENDPOINTS.RESEND_VERIFICATION, { email });
};

/**
 * Refresh the access token manually.
 */
export const refreshToken = async (refreshTokenValue: string): Promise<TokenResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.REFRESH_TOKEN, { refresh_token: refreshTokenValue });
  const tokenResponse = response as unknown as TokenResponse;
  
  if (tokenResponse.access_token && tokenResponse.refresh_token) {
    await saveTokens(tokenResponse.access_token, tokenResponse.refresh_token);
  }
  
  return tokenResponse;
};

/**
 * Change the user's password.
 */
export const changePassword = async (data: { old_password: string; new_password: string }): Promise<any> => {
  return await apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, data);
};

/**
 * Change the user's email address.
 */
export const changeEmail = async (data: { new_email: string; password: string }): Promise<any> => {
  return await apiClient.post(API_ENDPOINTS.CHANGE_EMAIL, data);
};

/**
 * Create or update the user's transaction PIN.
 */
export const createPin = async (data: { pin: string }): Promise<any> => {
  return await apiClient.post(API_ENDPOINTS.CREATE_PIN, data);
};

/**
 * Log the user out and clear tokens locally.
 */
export const logout = async (): Promise<void> => {
  try {
    // Fire and forget the logout request
    await apiClient.post(API_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.warn('Server logout failed, but clearing local tokens anyway.');
  } finally {
    await clearTokens();
  }
};
