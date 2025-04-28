
import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="text-2xl font-playfair font-bold mb-4 inline-block">
              <span className="text-foreground">Lux</span>
              <span className="text-gold-dark dark:text-gold-DEFAULT">Time</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Discover the finest luxury timepieces from the world's most prestigious watchmakers. Tradition, innovation, and timeless elegance on your wrist.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground hover:text-gold-DEFAULT transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-foreground hover:text-gold-DEFAULT transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-foreground hover:text-gold-DEFAULT transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  All Watches
                </Link>
              </li>
              <li>
                <Link to="/products?brand=Rolex" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Rolex
                </Link>
              </li>
              <li>
                <Link to="/products?brand=Patek+Philippe" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Patek Philippe
                </Link>
              </li>
              <li>
                <Link to="/products?brand=Audemars+Piguet" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Audemars Piguet
                </Link>
              </li>
              <li>
                <Link to="/products?brand=Omega" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Omega
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Warranty
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-gold-DEFAULT transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} LuxTime Boutique. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <img src="https://raw.githubusercontent.com/realvjy/payment-logos/main/public/amex.png" alt="American Express" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="https://raw.githubusercontent.com/realvjy/payment-logos/main/public/mastercard.png" alt="Mastercard" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="https://raw.githubusercontent.com/realvjy/payment-logos/main/public/visa.png" alt="Visa" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="https://raw.githubusercontent.com/realvjy/payment-logos/main/public/paypal.png" alt="PayPal" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
