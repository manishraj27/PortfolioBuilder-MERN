import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolios } from '@/hooks/usePortfolios';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Pencil, Globe } from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Badge } from '@/components/ui/badge';

export default function Profile() {
  const { user } = useAuth();
  const { portfolios, createPortfolio } = usePortfolios();
  const [isCreating, setIsCreating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState('');

  const handleCreatePortfolio = async () => {
    setIsCreating(true);
    try {
      const portfolio = await createPortfolio.mutateAsync({
        title: newPortfolioTitle || 'Untitled Portfolio'
      });
      window.location.href = `/portfolio-builder/${portfolio._id}`;
    } finally {
      setIsCreating(false);
      setShowDialog(false);
      setNewPortfolioTitle('');
    }
  };

  return (
    <UserLayout>
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome, {user?.name}! 👋
          </h1>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Portfolios</h2>
            <p className="text-muted-foreground mt-2">
              Create and manage your professional portfolios
            </p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Portfolio
          </Button>
        </div>

        {/* Portfolio Creation Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Enter portfolio title"
                value={newPortfolioTitle}
                onChange={(e) => setNewPortfolioTitle(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePortfolio} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {portfolios?.map((portfolio) => (
            <Card key={portfolio._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{portfolio.title || 'Untitled Portfolio'}</span>
                  {portfolio.isPublished && (
                    <Badge variant="secondary">Published</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolio.isPublished && (
                    <p className="text-sm text-muted-foreground">
                      Published at: /portfolio/{portfolio.slug}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button asChild>
                      <Link to={`/portfolio-builder/${portfolio._id}`}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    {portfolio.isPublished && (
                      <Button variant="outline" asChild>
                        <Link 
                          to={`/portfolio/${portfolio.slug}`}
                          target="_blank"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </UserLayout>
  );
}