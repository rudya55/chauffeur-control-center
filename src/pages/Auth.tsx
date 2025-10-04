import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, Mail, User, ArrowLeft, Car } from "lucide-react";
import { loginSchema, signupSchema, resetPasswordSchema } from "@/lib/validations/auth";
import type { LoginFormData, SignupFormData, ResetPasswordFormData } from "@/lib/validations/auth";

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
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
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
        confirmPassword: signupConfirmPassword,
        fullName: fullName,
      };
      
      const validation = signupSchema.safeParse(formData);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        toast.error(firstError.message);
        setLoading(false);
        return;
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: validation.data.email,
        password: validation.data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: validation.data.fullName
          }
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("Cet email est déjà utilisé");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Inscription réussie ! Votre compte est en attente d'approbation.");
        setMode('login');
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-card/95 shadow-2xl animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
            <Car className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {mode === 'login' && "Connexion"}
            {mode === 'signup' && "Créer un compte"}
            {mode === 'reset' && "Réinitialiser le mot de passe"}
          </CardTitle>
          <CardDescription>
            {mode === 'login' && "Connectez-vous à votre espace chauffeur"}
            {mode === 'signup' && "Rejoignez notre plateforme de chauffeurs"}
            {mode === 'reset' && "Entrez votre email pour recevoir un lien de réinitialisation"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {mode === 'login' && (
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

              <button
                type="button"
                onClick={() => setMode('reset')}
                className="text-sm text-primary hover:underline"
              >
                Mot de passe oublié ?
              </button>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Se connecter
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Vous n'avez pas encore de compte ?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setMode('signup')}
                  disabled={loading}
                >
                  Créer un compte
                </Button>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nom complet
                </Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Jean Dupont"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  placeholder="Minimum 6 caractères"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-background"
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-background"
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer mon compte
              </Button>

              <div className="text-center pt-4 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setMode('login')}
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la connexion
                </Button>
              </div>
            </form>
          )}

          {mode === 'reset' && (
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

              <div className="text-center pt-4 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setMode('login')}
                  disabled={loading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à la connexion
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
