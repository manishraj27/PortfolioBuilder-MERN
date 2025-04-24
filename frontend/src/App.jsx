import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider } from '@/contexts/AuthContext';

// Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Profile from './pages/Profile';
import PortfolioBuilder from './pages/PortfolioBuilder';
import ProtectedRoute from './components/ProtectedRoute';
import PublicPortfolio from './pages/PublicPortfolio';

// Add import
import AdminDashboard from './pages/admin/Dashboard';
import AdminRoute from './components/AdminRoute';
import Landing from './pages/Landing';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DndProvider backend={HTML5Backend}>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/portfolio/:slug" element={<PublicPortfolio />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/portfolio-builder/:id" element={<PortfolioBuilder />} />
                  <Route 
                    path="/admin" 
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } 
                  />
                </Route>
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </Router>
        </DndProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;