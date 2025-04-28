
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X, Search, Heart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl md:text-3xl font-playfair font-bold tracking-tight"
        >
          <span className="text-foreground">Lux</span>
          <span className="text-gold-dark dark:text-gold-DEFAULT">Time</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-gold-DEFAULT transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-foreground hover:text-gold-DEFAULT transition-colors">
            Watches
          </Link>
          <Link to="/about" className="text-foreground hover:text-gold-DEFAULT transition-colors">
            About
          </Link>
          <Link to="/blog" className="text-foreground hover:text-gold-DEFAULT transition-colors">
            Blog
          </Link>
          <Link to="/contact" className="text-foreground hover:text-gold-DEFAULT transition-colors">
            Contact
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Button>
          
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" aria-label="Account" className="relative">
                <User className="h-5 w-5" />
                {user?.role === "admin" && (
                  <span className="absolute -top-1 -right-1 bg-gold-DEFAULT dark:bg-gold-dark text-white text-xs rounded-full h-2 w-2"></span>
                )}
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="icon" aria-label="Login">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-DEFAULT dark:bg-gold-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-3">
          <ThemeToggle />
          
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-DEFAULT dark:bg-gold-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="container mx-auto py-4 px-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-gold-DEFAULT transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-foreground hover:text-gold-DEFAULT transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Watches
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-gold-DEFAULT transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/blog" 
              className="text-foreground hover:text-gold-DEFAULT transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className="text-foreground hover:text-gold-DEFAULT transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-foreground hover:text-gold-DEFAULT transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-foreground hover:text-gold-DEFAULT transition-colors py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-foreground hover:text-gold-DEFAULT transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login / Register
              </Link>
            )}
            
            <div className="flex space-x-4 py-2">
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
