
import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const Orders = () => {
  const { user } = useAuth();
  
  // In a real application, we would fetch user's orders from the backend
  const orders: any[] = [];
  
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-3xl md:text-4xl font-semibold mb-6">Order History</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>Track and manage your purchases</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-border rounded-lg p-4">
                      Order details would appear here
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Orders;
