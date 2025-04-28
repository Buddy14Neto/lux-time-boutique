
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, AlertCircle, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email("Por favor, insira um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

const AdminLogin = () => {
  const { login, isAuthenticated, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);
  
  // Monitor auth state for redirects
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isAuthenticated) {
        if (isAdmin) {
          console.log("[AdminLogin] User is authenticated and admin, redirecting to admin dashboard");
          navigate("/admin");
        } else if (user) {
          console.log("[AdminLogin] User is authenticated but not admin, showing error");
          setLoginError("Esta conta não possui privilégios administrativos.");
          toast({
            variant: "destructive",
            title: "Acesso negado",
            description: "Sua conta não tem privilégios administrativos.",
          });
          // Small delay before redirecting non-admin users
          setTimeout(() => navigate("/dashboard"), 1500);
        }
      }
    };
    
    checkAdminStatus();
  }, [isAuthenticated, isAdmin, user, navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setLoginError(null);
      setIsVerifyingAdmin(false);
      
      console.log(`[AdminLogin] Attempting admin login with email: ${data.email}`);
      
      // Perform login
      const success = await login(data.email, data.password);
      
      if (!success) {
        console.log("[AdminLogin] Login failed");
        setLoginError("Credenciais inválidas. Por favor, tente novamente.");
        setIsLoading(false);
        return;
      }
      
      // After successful login, set verifying admin state
      // (The auth state changes will trigger the navigation in the useEffect)
      console.log("[AdminLogin] Login successful, waiting for auth state update");
      setIsVerifyingAdmin(true);
      
      // Add a timeout as fallback in case the auth state doesn't update
      setTimeout(async () => {
        setIsLoading(false);
        // Fix: Use await to properly resolve the Promise before accessing its data property
        const { data: { user } } = await supabase.auth.getUser();
        if (user && !isAdmin) {
          setLoginError("Verificação de administrador em andamento. Aguarde...");
        }
      }, 2000);
      
    } catch (error: any) {
      console.error("[AdminLogin] Error in login process:", error?.message || 'Unknown error');
      setLoginError(`Ocorreu um erro ao processar o login: ${error?.message || 'Tente novamente.'}`);
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30">
      <div className="w-full max-w-md px-4">
        <Card className="border-gold-light shadow-lg">
          <CardHeader className="pb-4 space-y-2 text-center border-b border-border/30">
            <CardTitle className="font-playfair text-3xl">
              <span className="text-foreground">Lux</span>
              <span className="text-gold-DEFAULT">Time</span>
            </CardTitle>
            <CardDescription className="text-lg font-medium text-muted-foreground">
              Painel Administrativo
            </CardDescription>
            <p className="text-sm text-muted-foreground font-normal">
              Faça login para acessar o painel administrativo
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {isVerifyingAdmin && (
              <Alert className="mb-4 bg-amber-50 dark:bg-amber-900/30 border-amber-300">
                <Loader className="h-4 w-4 text-amber-600 dark:text-amber-400 animate-spin" />
                <AlertDescription className="text-amber-800 dark:text-amber-300 ml-2">
                  Verificando permissões administrativas...
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin@example.com" 
                          type="email"
                          className="border-gold-light/50 focus-visible:ring-gold-DEFAULT" 
                          {...field} 
                        />
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
                      <FormLabel className="text-foreground">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="border-gold-light/50 focus-visible:ring-gold-DEFAULT pr-10" 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                            onClick={toggleShowPassword}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {loginError && (
                  <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
                    {loginError}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-gold-dark hover:bg-gold-DEFAULT text-white font-medium py-2.5"
                  disabled={isLoading || isVerifyingAdmin}
                >
                  {isLoading || isVerifyingAdmin ? "Entrando..." : "Entrar"}
                </Button>

                <div className="rounded-md bg-muted/40 p-4 mt-6">
                  <p className="text-center text-sm text-muted-foreground font-medium">
                    Acesso de demonstração:
                  </p>
                  <div className="mt-2 text-center text-sm">
                    <p className="text-muted-foreground">Email: helioarreche@gmail.com</p>
                    <p className="text-muted-foreground">Senha: 300323</p>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
