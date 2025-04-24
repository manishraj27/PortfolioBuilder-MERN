import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogOut, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: api.admin.getAllUsers,
  });
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users?.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{user.name}</span>
                  {user.isAdmin && <Badge>Admin</Badge>}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium mb-2">Published Portfolios</h3>
                <div className="space-y-2">
                  {user.publishedPortfolios.length > 0 ? (
                    user.publishedPortfolios.map((portfolio) => (
                      <div 
                        key={portfolio.id} 
                        className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                      >
                        <span className="font-medium">{portfolio.title}</span>
                        <Button 
                          variant="link" 
                          asChild 
                          className="text-primary"
                        >
                          <a
                            href={portfolio.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Portfolio
                          </a>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No published portfolios
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}