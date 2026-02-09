/**
 * JWT Utilities
 * Helper functions for JWT token handling and parsing
 */

import type { User } from '@/types/api';

/**
 * Parse JWT token and extract claims
 * @param token - JWT token string
 * @returns User object with id, email, and role
 */
export const parseJwt = (token: string): User => {
  try {
    // JWT format: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    throw new Error('Invalid JWT token');
  }
};

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    
    return Date.now() >= expirationTime;
  } catch (error) {
    return true; // Consider invalid tokens as expired
  }
};

/**
 * Get time until token expiration
 * @param token - JWT token string
 * @returns Milliseconds until expiration, or 0 if expired
 */
export const getTokenExpirationTime = (token: string): number => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    const expirationTime = payload.exp * 1000;
    const timeRemaining = expirationTime - Date.now();
    
    return timeRemaining > 0 ? timeRemaining : 0;
  } catch (error) {
    return 0;
  }
};
