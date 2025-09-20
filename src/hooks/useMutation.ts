import { useMutation as useTanStackMutation, UseMutationOptions as TanStackUseMutationOptions, UseMutationResult as TanStackUseMutationResult } from '@tanstack/react-query';

export interface UseMutationOptions<TData = unknown, TError = Error, TVariables = unknown> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
  retry?: number | boolean;
  retryDelay?: number | ((retryCount: number) => number);
}

export interface UseMutationResult<TData = unknown, TError = Error, TVariables = unknown> {
  data: TData | undefined;
  error: TError | null;
  isError: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

/**
 * Hook personalizado que abstrai o useMutation do TanStack Query
 * 
 * @param options - Configurações do hook
 * @returns Resultado da mutation com dados, loading, error, etc.
 * 
 * @example
 * ```tsx
 * const updateCategory = useMutation({
 *   mutationFn: (data) => CategoryService.update(data.id, data),
 *   onSuccess: (data) => {
 *     console.log('Categoria atualizada:', data);
 *   },
 *   onError: (error) => {
 *     console.error('Erro ao atualizar:', error);
 *   },
 * });
 * 
 * // Usar a mutation
 * updateCategory.mutate({ id: '1', name: 'Nova categoria' });
 * ```
 */
export function useMutation<TData = unknown, TError = Error, TVariables = unknown>(
  options: UseMutationOptions<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> {
  const {
    mutationFn,
    onSuccess,
    onError,
    onSettled,
    retry = 3,
    retryDelay = 1000,
  } = options;

  const mutationResult = useTanStackMutation({
    mutationFn,
    onSuccess,
    onError,
    onSettled,
    retry,
    retryDelay,
  });

  return {
    data: mutationResult.data,
    error: mutationResult.error as TError | null,
    isError: mutationResult.isError,
    isIdle: mutationResult.isIdle,
    isLoading: mutationResult.isPending,
    isSuccess: mutationResult.isSuccess,
    mutate: mutationResult.mutate,
    mutateAsync: mutationResult.mutateAsync,
    reset: mutationResult.reset,
  };
}

export default useMutation;
