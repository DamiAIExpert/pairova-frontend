// src/services/api.ts
// Base API configuration and utilities for the job finder frontend

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
  response?: Response;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.pairova.com';
const API_VERSION = ''; // Backend doesn't use /api/v1 prefix

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = this.getStoredToken();
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${API_VERSION}${endpoint}`;
    
    // Create abort controller for timeout
    // - 60 seconds for file uploads (Cloudinary can be slow)
    // - 45 seconds for job creation (can be slow with many fields and database operations)
    // - 30 seconds for registration, saved-jobs, and nonprofit job queries (database operations can be slow)
    // - 15 seconds for others
    const isUpload = endpoint.includes('/upload');
    const isRegistration = endpoint.includes('/register');
    const isSavedJobs = endpoint.includes('/saved-jobs');
    const isNonprofitJobs = endpoint.includes('/ngos/me/jobs');
    const isJobCreation = endpoint.includes('/ngos/me/jobs') && options.method === 'POST';
    const timeoutMs = isUpload ? 60000 : (isJobCreation ? 45000 : (isRegistration || isSavedJobs || isNonprofitJobs ? 30000 : 15000));
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    // Don't set Content-Type for FormData - browser will set it with boundary
    const isFormData = options.body instanceof FormData;
    
    const config: RequestInit = {
      headers: {
        // Only set Content-Type if not FormData
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || 'An error occurred',
          status: response.status,
          details: errorData,
          response: response, // Add response for easier access
        };
        
        // Automatically handle 401 errors (token expired/invalid)
        if (response.status === 401) {
          authUtils.clearToken();
          // Clear auth store if available
          if (typeof window !== 'undefined') {
            // Dispatch a custom event that auth store can listen to
            window.dispatchEvent(new CustomEvent('auth:token-expired'));
            // Redirect to login with current path as redirect
            const currentPath = window.location.pathname + window.location.search;
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
        
        throw error;
      }

      // Handle 204 No Content (DELETE endpoints) - no body to parse
      if (response.status === 204) {
        return {
          data: null as any,
          status: response.status,
        };
      }

      // Check if response has content to parse
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If no JSON content, return empty data
        return {
          data: null as any,
          status: response.status,
        };
      }

      const responseData = await response.json();
      
      // Backend wraps responses in { success, statusCode, data } format
      // Extract the actual data from the wrapper
      const actualData = responseData.data !== undefined ? responseData.data : responseData;
      
      return {
        data: actualData,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw {
          message: `Request timed out after ${timeoutMs / 1000} seconds. Please try again.`,
          status: 0,
        } as ApiError;
      }
      
      if (error instanceof TypeError) {
        throw {
          message: 'Network error. Please check your connection.',
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${API_VERSION}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(endpoint + (params ? `?${url.searchParams.toString()}` : ''), {
      method: 'GET',
    });
  }

  async post<T>(
    endpoint: string, 
    data?: any, 
    options?: RequestInit & { onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void }
  ): Promise<ApiResponse<T>> {
    // Don't stringify FormData - it breaks file uploads!
    const isFormData = data instanceof FormData;
    
    // Extract onUploadProgress if present (not part of RequestInit)
    const { onUploadProgress, ...requestOptions } = options || {};
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      ...requestOptions,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Auth utilities
export const authUtils = {
  setToken: (token: string) => apiClient.setToken(token),
  clearToken: () => apiClient.setToken(null),
  isAuthenticated: () => !!apiClient['token'],
  getToken: () => apiClient['token'],
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.status === 401) {
    authUtils.clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return 'Session expired. Please login again.';
  }
  
  if (error.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.status === 404) {
    return 'The requested resource was not found.';
  }
  
  if (error.status === 500) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
};
