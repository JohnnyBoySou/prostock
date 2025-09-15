import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

export interface UseFetchOptions<TData = unknown, TError = Error> {
  key: string | string[];
  fetcher: () => Promise<TData>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  retry?: number | boolean;
  retryDelay?: number | ((retryCount: number) => number);
}

export interface UseFetchResult<TData = unknown, TError = Error> {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: TError | null;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
}

/**
 * Hook personalizado que abstrai o useQuery do TanStack Query
 * 
 * @param options - Configurações do hook
 * @returns Resultado da query com dados, loading, error, etc.
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useFetch({
 *   key: ['users'],
 *   fetcher: () => fetchUsers(),
 *   enabled: true,
 *   staleTime: 5 * 60 * 1000, // 5 minutos
 * });
 * ```
 */
export function useFetch<TData = unknown, TError = Error>(
  options: UseFetchOptions<TData, TError>
): UseFetchResult<TData, TError> {
  const {
    key,
    fetcher,
    enabled = true,
    staleTime = 0,
    gcTime = 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus = false,
    refetchOnMount = true,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const queryResult = useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: fetcher,
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    retryDelay,
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error as TError | null,
    refetch: queryResult.refetch,
    isFetching: queryResult.isFetching,
    isSuccess: queryResult.isSuccess,
  };
}

export default useFetch;
