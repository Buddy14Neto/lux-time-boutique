
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
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
  const { login, isAuthenticated, isAdmin, user, session } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [userChecked, setUserChecked] = useState(false);

  const addDebugLog = (message: string) => {
    console.log(`[AdminLogin Debug] ${message}`);
    setDebugLogs(prev => [...prev, message]);
  };

  // Add detailed logging of all state changes
  useEffect(() => {
    addDebugLog(`Auth state updated: isAuthenticated=${isAuthenticated}, isAdmin=${isAdmin}, userId=${user?.id}`);
    addDebugLog(`Session state: ${session ? 'active' : 'none'}, userId=${session?.user?.id}`);
    
    // More detailed user info if available
    if (user) {
      addDebugLog(`User details: email=${user.email}, name=${user.name}, isAdmin=${user.isAdmin}, role=${user.role}`);
    }

    // Check if we have a session but not a fully authenticated user yet
    if (session?.user?.id && !isAuthenticated && !userChecked) {
      addDebugLog("Session exists but user not authenticated yet, checking admin status directly");
      checkAdminStatus(session.user.id);
    }
    
    if (isAuthenticated && isAdmin) {
      addDebugLog("User is authenticated and is admin, redirecting to /admin");
      navigate("/admin");
    } else if (isAuthenticated && !isAdmin && userChecked) {
      addDebugLog("User is authenticated but NOT admin, showing error toast");
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Sua conta não tem privilégios administrativos.",
      });
      navigate("/dashboard");
    }
  }, [isAuthenticated, isAdmin, navigate, user, session, userChecked]);

  // Direct check for admin status when we have a session but no user object yet
  const checkAdminStatus = async (userId: string) => {
    try {
      addDebugLog(`Directly checking admin status for user: ${userId}`);
      setUserChecked(true);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin, name, role')
        .eq('id', userId)
        .single();
      
      if (error) {
        addDebugLog(`Error checking admin status: ${error.message}`);
        return;
      }
      
      if (profile?.is_admin) {
        addDebugLog(`User confirmed as admin directly: ${profile.name}`);
        // Force navigation to admin even if context hasn't updated
        navigate("/admin");
      } else {
        addDebugLog("User is NOT an admin (direct check)");
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Sua conta não tem privilégios administrativos.",
        });
        setLoginError("Esta conta não possui privilégios administrativos.");
      }
    } catch (error: any) {
      addDebugLog(`Error in direct admin check: ${error?.message}`);
    }
  };

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
      setUserChecked(false);
      
      addDebugLog(`Attempting admin login with email: ${data.email}`);
      addDebugLog(`Starting auth state: isAuthenticated=${isAuthenticated}, isAdmin=${isAdmin}`);
      
      // First perform the login
      addDebugLog("Calling login function");
      const success = await login(data.email, data.password);
      addDebugLog(`Login function returned: ${success}`);
      
      if (!success) {
        addDebugLog("Login failed");
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "Credenciais inválidas. Por favor, tente novamente.",
        });
        setLoginError("Credenciais inválidas. Por favor, tente novamente.");
        setIsLoading(false);
        return;
      }
      
      addDebugLog("Login successful, checking admin status");
      
      // Get current user ID directly from Supabase to avoid race conditions
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        addDebugLog("ERROR: Could not get current user from Supabase");
        setLoginError("Erro ao verificar sessão de usuário. Tente novamente em alguns instantes.");
        setIsLoading(false);
        return;
      }
      
      addDebugLog(`Current user from Supabase: ${currentUser.id}`);
      setUserChecked(true);
      
      // Direct database check for admin status
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin, name')
        .eq('id', currentUser.id)
        .single();
      
      addDebugLog(`Direct database check result: ${JSON.stringify({ profile, error })}`);
      
      if (error) {
        addDebugLog(`Error fetching admin status directly: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "Erro ao verificar privilégios administrativos.",
        });
        setLoginError(`Erro ao verificar privilégios administrativos: ${error.message}`);
        setIsLoading(false);
        return;
      }
      
      if (profile?.is_admin) {
        addDebugLog(`User confirmed as admin (${profile.name}), redirecting to admin dashboard`);
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo ao painel administrativo, ${profile.name || 'Administrador'}!`,
        });
        // We'll force navigate even if the context hasn't updated yet
        navigate("/admin");
      } else {
        addDebugLog("User is NOT an admin, showing error");
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Sua conta não tem privilégios administrativos.",
        });
        setLoginError("Esta conta não possui privilégios administrativos.");
      }
    } catch (error: any) {
      addDebugLog(`Error in login process: ${error?.message || 'Unknown error'}`);
      console.error("Erro no login:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro ao processar o login.",
      });
      setLoginError(`Ocorreu um erro ao processar o login: ${error?.message || 'Tente novamente.'}`);
    } finally {
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
            {session && !user && !loginError && (
              <Alert className="mb-4 bg-amber-50 dark:bg-amber-900/30 border-amber-300">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-300">
                  Verificando sessão e permissões administrativas...
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
                          placeholder="helioarreche@gmail.com" 
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
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
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
                
                {/* Debug logs shown on screen for easier troubleshooting */}
                <div className="mt-6 border border-amber-500 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md">
                  <p className="font-bold text-amber-800 dark:text-amber-400 mb-1">Logs de depuração:</p>
                  <div className="text-xs font-mono text-amber-700 dark:text-amber-300 max-h-40 overflow-auto">
                    {debugLogs.map((log, i) => (
                      <div key={i} className="py-0.5 border-b border-amber-100 dark:border-amber-800/30">
                        {log}
                      </div>
                    ))}
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
