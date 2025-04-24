import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function usePortfolio(portfolioId) {
  const queryClient = useQueryClient();

  const portfolioQuery = useQuery({
    queryKey: ['portfolio', portfolioId],
    queryFn: () => api.portfolios.getById(portfolioId),
    enabled: !!portfolioId,
  });

  const updatePortfolio = useMutation({
    mutationFn: (data) => api.portfolios.update(portfolioId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['portfolio', portfolioId]);
      queryClient.invalidateQueries(['portfolios']);
    },
  });

  return {
    portfolio: portfolioQuery.data,
    isLoading: portfolioQuery.isLoading,
    error: portfolioQuery.error,
    updatePortfolio,
  };
}