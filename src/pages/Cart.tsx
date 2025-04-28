import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CartItem = ({ 
  id, 
  name, 
  brand,
  price, 
  discountPrice,
  image, 
  quantity, 
  onUpdateQuantity, 
  onRemove 
}: {
  id: string;
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  image: string;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) => {
  const actualPrice = discountPrice || price;
  
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    onUpdateQuantity(id, newQuantity);
  };
  
  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-border">
      <div className="sm:w-32 sm:h-32 flex-shrink-0 mb-4 sm:mb-0 rounded-lg overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80";
          }}
        />
      </div>
      
      <div className="flex-1 sm:ml-6">
        <div className="flex justify-between mb-2">
          <div>
            <h3 className="text-lg font-medium">
              <Link to={`/products/${id}`} className="hover:text-gold-DEFAULT">
                {name}
              </Link>
            </h3>
            <p className="text-muted-foreground">{brand}</p>
          </div>
          <button 
            onClick={() => onRemove(id)}
            className="text-muted-foreground hover:text-destructive h-6 w-6 flex items-center justify-center rounded-full"
            aria-label="Remove item"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
          <div className="flex items-center border border-input rounded-md mb-4 sm:mb-0">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="px-3 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="px-3 py-1 text-muted-foreground hover:text-foreground"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
              }).format(actualPrice * quantity)}
            </p>
            <p className="text-sm text-muted-foreground">
              {quantity > 1
                ? `${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  }).format(actualPrice)} each`
                : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in or create an account to complete your purchase",
      });
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    
    toast({
      title: "Proceeding to checkout",
      description: "Preparing your order...",
    });
  };
  
  if (cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-20 pb-12 min-h-screen">
          <div className="container mx-auto px-4">
            <h1 className="font-playfair text-3xl md:text-4xl font-semibold mb-12 text-center">Shopping Cart</h1>
            
            <div className="max-w-md mx-auto text-center py-12">
              <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any watches to your cart yet.
              </p>
              <Button asChild className="bg-gold-DEFAULT hover:bg-gold-dark text-white px-8">
                <Link to="/products">Browse Collection</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-12 min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="font-playfair text-3xl md:text-4xl font-semibold mb-12 text-center">Shopping Cart</h1>
          
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <h2 className="text-xl font-medium">
                  {cart.items.length} {cart.items.length === 1 ? 'Item' : 'Items'}
                </h2>
                <Button 
                  variant="ghost" 
                  onClick={clearCart}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Clear Cart
                </Button>
              </div>
              
              {cart.items.map((item) => (
                <CartItem
                  key={item.product.id}
                  id={item.product.id}
                  name={item.product.name}
                  brand={item.product.brand}
                  price={item.product.price}
                  discountPrice={item.product.discountPrice}
                  image={item.product.images[0]}
                  quantity={item.quantity}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
              
              <div className="mt-8">
                <Button 
                  asChild 
                  variant="outline" 
                  className="flex items-center"
                >
                  <Link to="/products">
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    {!isAuthenticated && "Login required to complete purchase"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(cart.subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {cart.shipping === 0 
                          ? "Free" 
                          : formatPrice(cart.shipping)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatPrice(cart.tax)}</span>
                    </div>
                    
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(cart.total)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full mt-6 bg-gold-DEFAULT hover:bg-gold-dark text-white"
                  >
                    {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
                  </Button>
                  
                  {!isAuthenticated && (
                    <p className="mt-4 text-sm text-center text-muted-foreground">
                      Please{" "}
                      <Link to="/login" className="text-gold-DEFAULT hover:text-gold-dark">
                        login
                      </Link>
                      {" "}or{" "}
                      <Link to="/register" className="text-gold-DEFAULT hover:text-gold-dark">
                        create an account
                      </Link>
                      {" "}to complete your purchase
                    </p>
                  )}
                  
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p className="mb-2">We accept</p>
                    <div className="flex justify-center space-x-2">
                      <img src="https://raw.githubusercontent.com/realvjy/payment-logos/main/public/visa.png" alt="Visa" className="h-6" />
                      <img src="https://raw.githubusercontent.com/realvjy/payment-logos/main/public/mastercard.png" alt="Mastercard" className="h-6" />
                      <img src="https://raw.githubusercontent.com/realvjy/payment-logos/main/public/amex.png" alt="American Express" className="h-6" />
                      <img src="https://raw.githubusercontent.com/realvjy/payment-logos/main/public/paypal.png" alt="PayPal" className="h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
