
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
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

const formSchema = z.object({
  email: z.string().email("Por favor, insira um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

const AdminLogin = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check if user is already authenticated and is admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin");
    } else if (isAuthenticated && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Sua conta não tem privilégios administrativos.",
      });
      navigate("/dashboard");
    }
  }, [isAuthenticated, isAdmin, navigate]);

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
      
      console.log("Attempting admin login with:", data.email);
      const success = await login(data.email, data.password);
      
      if (success) {
        console.log("Login successful, checking admin status...");
        // Check admin status after successful login
        setTimeout(() => {
          // We use setTimeout to allow the auth state to update first
          if (isAdmin) {
            console.log("User is admin, redirecting to admin dashboard");
            toast({
              title: "Login realizado com sucesso",
              description: "Bem-vindo ao painel administrativo!",
            });
            navigate("/admin");
          } else {
            console.log("User is not admin, showing error");
            toast({
              variant: "destructive",
              title: "Acesso negado",
              description: "Sua conta não tem privilégios administrativos.",
            });
            setLoginError("Esta conta não possui privilégios administrativos.");
          }
          setIsLoading(false);
        }, 1000);
      } else {
        console.log("Login failed");
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "Credenciais inválidas. Por favor, tente novamente.",
        });
        setLoginError("Credenciais inválidas. Por favor, tente novamente.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro ao processar o login.",
      });
      setLoginError("Ocorreu um erro ao processar o login. Tente novamente.");
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
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>

                <div className="rounded-md bg-muted/40 p-4 mt-6">
                  <p className="text-center text-sm text-muted-foreground font-medium">
                    Acesso de demonstração:
                  </p>
                  <div className="mt-2 text-center text-sm">
                    <p className="text-muted-foreground">Email: admin@example.com</p>
                    <p className="text-muted-foreground">Senha: admin123</p>
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
