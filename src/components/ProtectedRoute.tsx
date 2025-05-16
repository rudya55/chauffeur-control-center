
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  console.log("ProtectedRoute component, isAuthenticated:", isAuthenticated);
  
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("Authenticated, showing protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
