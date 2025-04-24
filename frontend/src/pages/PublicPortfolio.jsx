import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import PortfolioPreview from '@/components/PortfolioPreview';

export default function PublicPortfolio() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await api.portfolios.getBySlug(slug);
        setPortfolio(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: Portfolio not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <PortfolioPreview components={portfolio?.components || []}   theme={portfolio.theme} />
    </div>
  );
}