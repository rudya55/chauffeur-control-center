
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Load authentication state when the component mounts
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
    console.log("Auth status loaded:", authStatus === 'true');
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real application, you would validate credentials with your backend
    if (email === 'admin@example.com' && password === 'password123') {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      console.log("Login successful, auth state set to true");
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    navigate('/login');
  };

  console.log("AuthProvider render, isAuthenticated:", isAuthenticated);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
