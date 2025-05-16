
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().email("Entrez une adresse email valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Already authenticated, redirecting to home");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        toast.success("Connexion réussie");
        navigate("/");
      } else {
        toast.error("Email ou mot de passe incorrect");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Login page render, isAuthenticated:", isAuthenticated);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card className="border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour vous connecter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                          <div className="pl-3">
                            <User size={18} className="text-muted-foreground" />
                          </div>
                          <Input
                            {...field}
                            placeholder="votre@email.com"
                            type="email"
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                          <div className="pl-3">
                            <Lock size={18} className="text-muted-foreground" />
                          </div>
                          <Input
                            {...field}
                            placeholder="••••••••"
                            type="password"
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="text-sm text-center text-muted-foreground mt-2">
              Identifiants de démonstration:
              <br />
              Email: admin@example.com
              <br />
              Mot de passe: password123
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
