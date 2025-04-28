
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth/AuthProvider";
import { User, ShoppingBag, Heart, LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-3xl md:text-4xl font-semibold mb-6">My Account</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="font-medium">{user?.name}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent text-foreground w-full"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  
                  <Link 
                    to="/dashboard/orders" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent text-foreground w-full"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Orders</span>
                  </Link>
                  
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent text-foreground w-full justify-start font-normal"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </Button>
                </nav>
              </div>
            </div>
            
            {/* Main content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>Manage your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Name</label>
                          <p className="font-medium">{user?.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <p className="font-medium">{user?.email}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                        <p className="font-medium capitalize">{user?.role}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button disabled>Edit Profile</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                      <CardDescription>View your past orders and their status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">No Orders Yet</h3>
                        <p className="text-muted-foreground mb-6">
                          You haven't placed any orders yet.
                        </p>
                        <Button asChild className="bg-gold-DEFAULT hover:bg-gold-dark text-white">
                          <Link to="/products">Start Shopping</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="wishlist">
                  <Card>
                    <CardHeader>
                      <CardTitle>Wishlist</CardTitle>
                      <CardDescription>Products you've saved for later</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">Your Wishlist is Empty</h3>
                        <p className="text-muted-foreground mb-6">
                          Save items you love to your wishlist.
                        </p>
                        <Button asChild className="bg-gold-DEFAULT hover:bg-gold-dark text-white">
                          <Link to="/products">Browse Collection</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Dashboard;
