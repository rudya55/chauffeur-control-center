import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userStatus: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  userStatus: null,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkUserStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      setUserStatus(data.status);
      
      if (data.status === 'pending') {
        toast.info('Votre compte est en attente d\'approbation');
      } else if (data.status === 'rejected') {
        toast.error('Votre compte a été rejeté');
        await supabase.auth.signOut();
        navigate('/auth');
      }
    }
  };

  useEffect(() => {
    // Timeout de sécurité pour éviter un chargement infini
    const loadingTimeout = setTimeout(() => {
      console.warn('Auth loading timeout - setting loading to false');
      setLoading(false);
    }, 5000); // 5 secondes maximum

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        clearTimeout(loadingTimeout);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          setTimeout(() => {
            checkUserStatus(session.user.id);
          }, 0);
        } else {
          // Utilisateur déconnecté: ne pas forcer de redirection ici
          // Les pages protégées sont gérées par ProtectedRoute
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(loadingTimeout);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          setTimeout(() => {
            checkUserStatus(session.user.id);
          }, 0);
        } else {
          // Rediriger vers la landing page si pas de session (laisser accès aux pages publiques)
          const publicPaths = ['/welcome', '/auth', '/booking'] as const;
          if (!publicPaths.includes(window.location.pathname as typeof publicPaths[number])) {
            navigate('/welcome');
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching session:', error);
        clearTimeout(loadingTimeout);
        setLoading(false);
      });

    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserStatus(null);
    navigate('/welcome');
  };

  const value = {
    user,
    session,
    loading,
    userStatus,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
