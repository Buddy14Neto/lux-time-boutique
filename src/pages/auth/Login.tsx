
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";

// Define form schema with Zod
const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Type based on the schema
type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/dashboard";

  // Initialize form with react-hook-form and zod resolver
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      navigate(from);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="font-playfair text-2xl text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
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
                          <Input placeholder="name@example.com" {...field} />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gold-DEFAULT hover:bg-gold-dark text-white"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Logging in..." : "Log in"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col items-center">
              <div className="text-center text-sm">
                <p className="text-muted-foreground mb-2">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-gold-DEFAULT hover:text-gold-dark">
                    Sign up
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  For demo purposes, use:
                  <br />
                  Email: user@example.com
                  <br />
                  Password: password123
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
