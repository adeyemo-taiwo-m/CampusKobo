import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT, API_ENDPOINTS } from '../constants/api';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '../storage/TokenStorage';
import { authEvents, AUTH_EVENTS } from '../utils/authEvents';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
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
    
    // Auto-detect FormData and remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData) {
      if (config.headers['Content-Type']) {
        delete config.headers['Content-Type'];
      }
    }
    
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data ? { payload: config.data } : '');
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

    // Handle general errors
    const status = error.response?.status;
    const detail = (error.response?.data as any)?.detail;
    
    let message = detail || error.message || 'An unexpected error occurred';
    
    // Specific handling for common HTTP errors
    if (status === 413) {
      message = 'The image file is too large. Please choose a smaller file (under 5MB).';
    } else if (status === 403) {
      message = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      message = 'The requested resource was not found on the server.';
    } else if (error.message === 'Network Error') {
      message = 'Network error: Cannot reach the server. This may be due to CORS restrictions on web or your internet connection.';
    }
    
    const enhancedError = new Error(message);
    (enhancedError as any).status = status;
    (enhancedError as any).data = error.response?.data;
    
    if (__DEV__) {
      console.error(`[API ERROR] ${error.response?.status || 'NETWORK'} - ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        message,
        data: error.response?.data,
        originalError: error
      });
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
