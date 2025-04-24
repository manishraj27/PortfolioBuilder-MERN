import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Portfolio Builder</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Create and manage your professional portfolio with ease
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            Are you an admin?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}