// src/services/auth.service.ts
// Authentication API services for job finder

import { apiClient } from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: Role;
  fullName?: string;  // For applicants
  orgName?: string;   // For nonprofits
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: Role;
    isVerified: boolean;
    hasCompletedOnboarding?: boolean;
    firstName?: string;
    lastName?: string;
    orgName?: string;
    phone?: string;
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
  hasCompletedOnboarding?: boolean;
  firstName?: string;  // From applicantProfile
  lastName?: string;   // From applicantProfile
  orgName?: string;    // From nonprofitOrg
  phone?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export const Role = {
  ADMIN: 'admin',
  APPLICANT: 'applicant',
  NONPROFIT: 'nonprofit',
} as const;

export type Role = typeof Role[keyof typeof Role];

export class AuthService {
  // Authentication endpoints
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    
    // Store token after successful login
    if (response.data.accessToken) {
      apiClient.setToken(response.data.accessToken);
    }
    
    return response.data;
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    // Store token after successful registration
    if (response.data.accessToken) {
      apiClient.setToken(response.data.accessToken);
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
    const response = await apiClient.post<{ message: string }>('/auth/forgot-password', data);
    return response.data;
  }

  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/reset-password', data);
    return response.data;
  }

  static async verifyEmail(email: string, token: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/verify-email', { email, token });
    return response.data;
  }

  static async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/resend-verification', { email });
    return response.data;
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await apiClient.post<{ accessToken: string }>('/auth/refresh', {
      refreshToken,
    });
    
    // Update stored token
    if (response.data.accessToken) {
      apiClient.setToken(response.data.accessToken);
    }
    
    return response.data;
  }

  static async completeOnboarding(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/auth/complete-onboarding');
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

  // Check if user has specific role
  static hasRole(_role: Role): boolean {
    // This would typically check the user's role from the stored user data
    // For now, we'll assume if they have a token, they have the role
    return this.isAuthenticated();
  }

  // Check if user is admin
  static isAdmin(): boolean {
    return this.hasRole(Role.ADMIN);
  }

  // Check if user is applicant
  static isApplicant(): boolean {
    return this.hasRole(Role.APPLICANT);
  }

  // Check if user is nonprofit
  static isNonprofit(): boolean {
    return this.hasRole(Role.NONPROFIT);
  }
}
