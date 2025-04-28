
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
}

// Define Auth Context
interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser({
                id: session.user.id,
                email: session.user.email!,
                name: profile.name || '',
                role: profile.role || 'user'
              });
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({
                id: session.user.id,
                email: session.user.email!,
                name: profile.name || '',
                role: profile.role || 'user'
              });
            }
          })
          .catch((error) => {
            console.error('Error fetching user profile:', error);
          })
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: error.message,
        });
        return false;
      }

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
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
