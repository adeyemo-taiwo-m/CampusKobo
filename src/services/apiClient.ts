import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT, API_ENDPOINTS } from '../constants/api';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '../storage/TokenStorage';
import { authEvents, AUTH_EVENTS } from '../utils/authEvents';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 (Unauthorized)
    if (error.response?.status === 401 && originalRequest && !originalRequest.url?.includes(API_ENDPOINTS.REFRESH_TOKEN)) {
      try {
        const refreshTokenValue = await getRefreshToken();
        if (!refreshTokenValue) {
          throw new Error('No refresh token available');
        }

        // Direct axios call to refresh token
        const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.REFRESH_TOKEN}`, {
          refresh_token: refreshTokenValue,
        });

        const { access_token, refresh_token } = response.data;
        await saveTokens(access_token, refresh_token);

        // Update authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        await clearTokens();
        authEvents.emit(AUTH_EVENTS.TOKEN_EXPIRED);
        return Promise.reject(refreshError);
      }
    }

    // Handle 422 (FastAPI validation errors)
    if (error.response?.status === 422) {
      const detail = (error.response.data as any)?.detail;
      if (Array.isArray(detail)) {
        const formattedError = detail
          .map((err: any) => {
            const field = err.loc[err.loc.length - 1];
            return `${field}: ${err.msg}`;
          })
          .join('\n');
        throw new Error(formattedError);
      }
    }

    // For all other errors
    const errorMessage = (error.response?.data as any)?.detail || error.message || 'Something went wrong';
    throw new Error(errorMessage);
  }
);

export default apiClient;
