// src/lib/services/auth.service.ts
// Authentication API services for job finder

import { apiClient } from '../api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'APPLICANT' | 'NONPROFIT';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
  };
  token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  phone?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  // Profile-specific fields
  firstName?: string;
  lastName?: string;
  orgName?: string;
  photoUrl?: string;
  logoUrl?: string;
  city?: string;
  country?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export class AuthService {
  // Authentication endpoints
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Store token after successful login
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response.data;
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    // Store token after successful registration
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    
    return response.data;
  }

  static async logout(): Promise<void> {
    // Clear token from client
    apiClient.setToken(null);
    
    // Optionally call logout endpoint if it exists
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
      console.warn('Logout endpoint failed:', error);
    }
  }

  static async getCurrentUser(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/auth/profile');
    return response.data;
  }

  static async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  }

  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  }

  static async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  }

  static async resendVerificationEmail(): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/resend-verification');
    return response.data;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!apiClient['token'];
  }

  // Get stored token
  static getToken(): string | null {
    return apiClient['token'];
  }
}

