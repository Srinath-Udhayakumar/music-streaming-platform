/**
 * Authentication API Service
 * Handles login, token management, and JWT lifecycle
 */

import { apiClient, setAuthToken, clearAuthToken } from './client';
import { API_CONFIG } from '@/config';
import type { AuthResponse, LoginRequest, User } from '@/types/api';
import { parseJwt } from '@/utils/jwt';

const endpoint = API_CONFIG.ENDPOINTS.AUTH;

export const authAPI = {
  /**
   * Login user with email and password
   * Returns JWT token for subsequent authenticated requests
   */
  login: async (request: LoginRequest): Promise<{ token: string; user: User }> => {
    try {
      const response = await apiClient.post<AuthResponse>(
        `${endpoint}/login`,
        request
      );
      
      const { token } = response.data;
      
      // Store token
      setAuthToken(token);
      
      // Parse user info from JWT
      const user = parseJwt(token);
      
      return { token, user };
    } catch (error) {
      clearAuthToken();
      throw error;
    }
  },

  /**
   * Logout user by clearing stored token
   */
  logout: (): void => {
    clearAuthToken();
  },

  /**
   * Get current user from stored token
   * Returns null if no valid token exists
   */
  getCurrentUser: (): User | null => {
    const token = localStorage.getItem('music_app_token');
    if (!token) return null;
    
    try {
      return parseJwt(token);
    } catch {
      clearAuthToken();
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('music_app_token');
    if (!token) return false;
    
    try {
      const user = parseJwt(token);
      return !!user;
    } catch {
      clearAuthToken();
      return false;
    }
  },
};
