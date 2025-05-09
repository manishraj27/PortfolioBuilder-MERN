import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formData = new FormData(e.target);
      const credentials = {
        email: formData.get('email'),
        password: formData.get('password'),
        isAdmin: e.target.dataset.type === 'admin'
      };

      const user = await login(credentials);
      if (user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="user">User Login</TabsTrigger>
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <form onSubmit={handleSubmit} data-type="user">
                <div className="space-y-4">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                  />
                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                  {error && (
                    <p className="text-sm text-destructive text-center">{error}</p>
                  )}
                </div>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleSubmit} data-type="admin">
                <div className="space-y-4">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Admin Email"
                    required
                  />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Admin Password"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Admin Login'}
                  </Button>
                  {error && (
                    <p className="text-sm text-destructive text-center">{error}</p>
                  )}
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}