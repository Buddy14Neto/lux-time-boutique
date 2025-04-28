
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[800px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Watch"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/30 dark:from-background/95 dark:to-background/40"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-semibold leading-tight mb-4">
            Timeless Elegance on Your Wrist
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Discover exquisite timepieces from the world's most prestigious watchmakers,
            where tradition meets innovation in perfect harmony.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-gold-DEFAULT hover:bg-gold-dark text-white sm:text-lg h-12 px-6">
              <Link to="/products">Explore Collection</Link>
            </Button>
            <Button asChild variant="outline" className="border-gold-DEFAULT text-gold-dark dark:text-gold-DEFAULT hover:bg-gold-DEFAULT hover:text-white sm:text-lg h-12 px-6">
              <Link to="/about" className="flex items-center">
                Our Heritage
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
