/**
 * HTTP Client with automatic JWT handling
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '@/config';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: Automatically attach JWT token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    
    if (token) {
      config.headers.Authorization = `${AUTH_CONFIG.TOKEN_TYPE} ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle JWT expiration and errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      // Trigger logout event (will be handled by auth context)
      window.dispatchEvent(new CustomEvent('logout'));
    }
    
    return Promise.reject(error);
  }
);

/**
 * Get current auth token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
};

/**
 * Set auth token in storage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
};

/**
 * Clear auth token from storage
 */
export const clearAuthToken = (): void => {
  localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
};

export default apiClient;
