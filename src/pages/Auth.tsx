import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, Mail, Car } from "lucide-react";
import { loginSchema, signupSchema, resetPasswordSchema } from "@/lib/validations/auth";
import type { LoginFormData, SignupFormData, ResetPasswordFormData } from "@/lib/validations/auth";
import ThemeToggle from "@/components/ThemeToggle";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  
  // Reset state
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const formData: LoginFormData = {
        email: loginEmail,
        password: loginPassword,
      };
      
      const validation = loginSchema.safeParse(formData);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        toast.error(firstError.message);
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: validation.data.email,
        password: validation.data.password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou mot de passe incorrect");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Connexion réussie");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const formData: SignupFormData = {
        email: signupEmail,
        password: signupPassword,
        name: signupName,
        phone: signupPhone,
      };
      
      const validation = signupSchema.safeParse(formData);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        toast.error(firstError.message);
        setLoading(false);
        return;
      }

      // Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: validation.data.email,
        password: validation.data.password,
        options: {
          data: {
            name: validation.data.name,
            phone: validation.data.phone,
          },
        },
      });

      if (signUpError) {
        toast.error(signUpError.message);
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: validation.data.email,
            full_name: validation.data.name,
            phone: validation.data.phone,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }

        toast.success("Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.");
        setMode('login');
        setLoginEmail(validation.data.email);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la création du compte");
    } finally {
      setLoading(false);
    }
  };


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const formData: ResetPasswordFormData = {
        email: resetEmail,
      };
      
      const validation = resetPasswordSchema.safeParse(formData);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        toast.error(firstError.message);
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(validation.data.email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Email de réinitialisation envoyé ! Vérifiez votre boîte mail.");
        setMode('login');
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      {/* Theme toggle in top-right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
            <Car className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {mode === 'reset' ? 'Réinitialiser le mot de passe' : mode === 'signup' ? 'Créer un compte' : 'Connexion'}
          </CardTitle>
          <CardDescription>
            {mode === 'reset' 
              ? 'Entrez votre email pour recevoir un lien de réinitialisation' 
              : mode === 'signup'
              ? 'Créez votre compte chauffeur VTC'
              : 'Connectez-vous à votre espace chauffeur'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {mode === 'reset' ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-background"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Envoyer le lien de réinitialisation
              </Button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-primary hover:underline"
                  disabled={loading}
                >
                  Retour à la connexion
                </button>
              </div>
            </form>
          ) : mode === 'signup' ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Nom complet</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Jean Dupont"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-phone">Téléphone</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Mot de passe
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-background"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer mon compte
              </Button>

              <div className="text-center mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-primary hover:underline block w-full"
                  disabled={loading}
                >
                  Déjà un compte ? Se connecter
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Identifiant (Email)
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="votre@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Mot de passe
              </Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-background"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </Button>

            <div className="text-center mt-4 space-y-2">
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="text-sm text-primary hover:underline block w-full"
                disabled={loading}
              >
                Mot de passe oublié ?
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-sm text-muted-foreground hover:text-primary hover:underline block w-full"
                disabled={loading}
              >
                Pas encore de compte ? S'inscrire
              </button>
            </div>
          </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
