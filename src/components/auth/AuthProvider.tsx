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

  // Função para buscar o perfil do usuário a partir de um ID
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log(`[AuthProvider] Fetching profile for user: ${userId}`);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[AuthProvider] Error fetching profile:', error);
        setUser(null);
        return null;
      }

      if (profile) {
        console.log(`[AuthProvider] Profile found for user ${userId}, admin status: ${profile.is_admin}`);
        const authUser = {
          id: userId,
          email: profile.email || '',
          name: profile.name || '',
          role: profile.role || 'user',
          isAdmin: profile.is_admin || false
        };
        setUser(authUser);
        return authUser;
      } else {
        console.log(`[AuthProvider] No profile found for user ${userId}`);
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('[AuthProvider] Error fetching user profile:', error);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    console.log("[AuthProvider] Initializing...");
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`[AuthProvider] Auth state changed: ${event}`, newSession?.user?.id);
        
        if (!mounted) return;
        
        // Update session state immediately
        setSession(newSession);
        
        if (event === 'SIGNED_OUT') {
          console.log('[AuthProvider] User signed out, resetting user to null');
          setUser(null);
          return;
        }
        
        if (newSession?.user) {
          // Defer the profile fetch slightly to avoid Supabase call recursion
          setTimeout(async () => {
            if (!mounted) return;
            await fetchUserProfile(newSession.user!.id);
          }, 0);
        } else {
          console.log('[AuthProvider] No session user, resetting user to null');
          setUser(null);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('[AuthProvider] Checking for existing session...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        console.log(`[AuthProvider] Existing session found: ${!!currentSession}`, currentSession?.user?.id);
        // Update session state immediately
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Fetch user profile
          await fetchUserProfile(currentSession.user.id);
        } else {
          console.log('[AuthProvider] No existing session found');
          setUser(null);
        }
      } catch (error) {
        console.error('[AuthProvider] Error getting session:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      mounted = false;
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
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id);
        
        if (profile) {
          console.log(`[AuthProvider] User profile after login: ${JSON.stringify(profile)}`);
          toast({
            title: "Login realizado com sucesso",
            description: `Bem-vindo de volta, ${profile.name || 'Usuário'}!`,
          });
          return true;
        }
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
