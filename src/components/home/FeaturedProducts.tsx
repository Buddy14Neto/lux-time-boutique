
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { sampleWatches } from "@/lib/sample-data";

export function FeaturedProducts() {
  // Get featured watches and add a few more if needed
  const featuredWatches = sampleWatches.filter(watch => watch.featured);
  const bestSellerWatches = sampleWatches.filter(watch => watch.bestseller);
  const watchesToShow = [...featuredWatches, ...bestSellerWatches].slice(0, 5);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h2 className="section-title">Featured Timepieces</h2>
            <p className="section-subtitle">Discover our curated selection of exceptional watches that epitomize the pinnacle of horological craftsmanship.</p>
          </div>
          <Link 
            to="/products" 
            className="group mt-4 md:mt-0 inline-flex items-center text-gold-dark dark:text-gold-DEFAULT hover:text-gold-DEFAULT hover:dark:text-gold-light transition-colors"
          >
            View All Collection
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchesToShow.map((watch, index) => (
            <div 
              key={watch.id} 
              className={index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}
            >
              <ProductCard 
                product={watch} 
                featured={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
