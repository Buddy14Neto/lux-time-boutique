
import React, { createContext, useState, useEffect, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Define User Type
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
}

// Define Auth Context
interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  promoteToAdmin: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("[AuthProvider] Initializing...");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[AuthProvider] Auth state changed: ${event}`, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          try {
            console.log(`[AuthProvider] Fetching profile for user: ${session.user.id}`);
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error('[AuthProvider] Error fetching profile:', error);
            }

            if (profile) {
              console.log(`[AuthProvider] Profile found for user ${session.user.id}, admin status: ${profile.is_admin}`);
              setUser({
                id: session.user.id,
                email: session.user.email!,
                name: profile.name || '',
                role: profile.role || 'user',
                isAdmin: profile.is_admin || false
              });
            } else {
              console.log(`[AuthProvider] No profile found for user ${session.user.id}`);
              setUser(null);
            }
          } catch (error) {
            console.error('[AuthProvider] Error in onAuthStateChange handler:', error);
          }
        } else {
          console.log('[AuthProvider] No session, resetting user to null');
          setUser(null);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('[AuthProvider] Checking for existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log(`[AuthProvider] Existing session found: ${!!session}`, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          try {
            console.log(`[AuthProvider] Fetching profile for existing session user: ${session.user.id}`);
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (error) {
              console.error('[AuthProvider] Error fetching profile for existing session:', error);
            }

            if (profile) {
              console.log(`[AuthProvider] Profile for existing session found, admin status: ${profile.is_admin}`);
              setUser({
                id: session.user.id,
                email: session.user.email!,
                name: profile.name || '',
                role: profile.role || 'user',
                isAdmin: profile.is_admin || false
              });
            } else {
              console.log('[AuthProvider] No profile found for existing session user');
            }
          } catch (error) {
            console.error('[AuthProvider] Error in checkSession:', error);
          } finally {
            setIsLoading(false);
          }
        } else {
          console.log('[AuthProvider] No existing session found');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[AuthProvider] Error getting session:', error);
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log(`[AuthProvider] Attempting login for: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[AuthProvider] Login error:', error.message);
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: error.message,
        });
        return false;
      }

      console.log('[AuthProvider] Login successful, session established:', data.session?.user?.id);
      
      // After successful login, immediately check for admin status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user?.id)
        .single();
        
      if (profileError) {
        console.error('[AuthProvider] Error fetching profile after login:', profileError);
      } else {
        console.log(`[AuthProvider] Profile after login, admin status: ${profile?.is_admin}`);
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      return true;
    } catch (error) {
      console.error("[AuthProvider] Error during login:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro durante o login.",
      });
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro no registro",
          description: error.message,
        });
        return false;
      }

      toast({
        title: "Registro realizado com sucesso",
        description: `Bem-vindo, ${name}!`,
      });
      return true;
    } catch (error) {
      console.error("Erro no registro:", error);
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description: "Ocorreu um erro durante o registro.",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado com sucesso",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        variant: "destructive",
        title: "Erro no logout",
        description: "Ocorreu um erro durante o logout.",
      });
    }
  };

  // Função para promover um usuário para administrador
  const promoteToAdmin = async (userId: string): Promise<boolean> => {
    try {
      if (!user?.isAdmin) {
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Apenas administradores podem promover outros usuários.",
        });
        return false;
      }

      const { error } = await supabase.rpc('set_user_admin', {
        user_id: userId,
        is_admin_status: true
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao promover usuário",
          description: error.message,
        });
        return false;
      }

      toast({
        title: "Sucesso",
        description: "Usuário promovido a administrador com sucesso.",
      });
      return true;
    } catch (error) {
      console.error("Erro ao promover usuário:", error);
      toast({
        variant: "destructive",
        title: "Erro ao promover usuário",
        description: "Ocorreu um erro inesperado.",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        isLoading,
        login,
        register,
        logout,
        promoteToAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
