
import React, { createContext, useState, useEffect, useContext } from "react";
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
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock User Data for Demo Purposes (would be replaced with Supabase in a real implementation)
const mockUsers = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123",
    name: "John Doe",
    role: "user"
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin"
  }
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This would be replaced with a real Supabase auth call
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password
      );
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password.",
        });
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login.",
      });
      setIsLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      
      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Email already in use.",
        });
        setIsLoading(false);
        return false;
      }
      
      // This would be replaced with a real Supabase auth call
      const newUser = {
        id: `${mockUsers.length + 1}`,
        email,
        name,
        role: "user"
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred during registration.",
      });
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
