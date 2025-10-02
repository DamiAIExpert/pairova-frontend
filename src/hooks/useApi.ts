// src/hooks/useApi.ts
// Custom React hooks for API state management in job finder

import { useState, useEffect, useCallback } from 'react';
import { handleApiError } from '../lib/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: UseApiOptions = {}
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { immediate = true, onSuccess, onError } = options;

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<T, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { onSuccess, onError } = options;

  const mutate = useCallback(async (variables: V) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mutationFn(variables);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
}

// Hook for paginated data
export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number) => Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
  }>,
  initialPage: number = 1,
  initialLimit: number = 10
) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [allData, setAllData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(page, limit);
      setAllData(result.data);
      setTotal(result.total);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nextPage = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage(prev => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  return {
    data: allData,
    total,
    page,
    limit,
    loading,
    error,
    refetch: fetchData,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
    totalPages: Math.ceil(total / limit),
  };
}

