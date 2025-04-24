import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function usePortfolios() {
  const queryClient = useQueryClient();

  const portfoliosQuery = useQuery({
    queryKey: ['portfolios'],
    queryFn: api.portfolios.getAll,
  });

  const createPortfolio = useMutation({
    mutationFn: api.portfolios.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['portfolios']);
    },
  });

  const deletePortfolio = useMutation({
    mutationFn: api.portfolios.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['portfolios']);
    },
  });

  return {
    portfolios: portfoliosQuery.data || [],
    isLoading: portfoliosQuery.isLoading,
    error: portfoliosQuery.error,
    createPortfolio,
    deletePortfolio,
  };
}