
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const BrandsSection = () => {
  const brands = [
    "Rolex", "Patek Philippe", "Audemars Piguet", 
    "Omega", "Cartier", "Tag Heuer", "Breitling", "IWC"
  ];
  
  return (
    <section className="py-12 bg-muted/50">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-sm text-muted-foreground uppercase tracking-wider mb-8">
          Premier Watch Brands
        </h3>
        <div className="flex justify-between items-center flex-wrap gap-8">
          {brands.map(brand => (
            <div key={brand} className="flex-1 min-w-[120px] text-center">
              <span className="font-playfair text-lg md:text-xl text-foreground/80">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CategorySection = () => {
  const categories = [
    {
      name: "Dive Watches",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80",
      link: "/products?style=Dive"
    },
    {
      name: "Dress Watches",
      image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=600&q=80",
      link: "/products?style=Dress"
    },
    {
      name: "Chronographs",
      image: "https://images.unsplash.com/photo-1614946973939-1ab35362d7db?auto=format&fit=crop&w=600&q=80",
      link: "/products?style=Chronograph"
    }
  ];
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">Shop by Category</h2>
        <p className="section-subtitle text-center mx-auto">
          Explore our different watch categories, each representing a distinct horological tradition
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {categories.map((category) => (
            <Link
              to={category.link}
              key={category.name}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-playfair font-medium text-white mb-2">
                  {category.name}
                </h3>
                <p className="inline-flex items-center text-white/90 group-hover:text-gold-light transition-colors">
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">Client Testimonials</h2>
        <p className="section-subtitle text-center mx-auto">
          Hear what our clients have to say about their experience with LuxTime Boutique
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg p-6 border border-border">
              <div className="flex mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#D4AF37"
                    stroke="#D4AF37"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-muted-foreground mb-6">
                {i === 1 && "The customer service at LuxTime is exceptional. I received personalized attention and found the perfect Patek Philippe for my collection. Will definitely be a returning customer."}
                {i === 2 && "My Rolex Submariner arrived in perfect condition with all documentation. The shopping experience was seamless from browsing the site to delivery. Highly recommended!"}
                {i === 3 && "As a watch enthusiast, I appreciate LuxTime's attention to detail and authentication process. Their selection is outstanding and their expertise is evident in every interaction."}
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden mr-4">
                  <img
                    src={`https://randomuser.me/api/portraits/${i === 2 ? 'women' : 'men'}/${i + 5}.jpg`}
                    alt="Customer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">
                    {i === 1 && "James Anderson"}
                    {i === 2 && "Emily Washington"}
                    {i === 3 && "Michael Chen"}
                  </h4>
                  <p className="text-xs text-muted-foreground">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <BrandsSection />
        <FeaturedProducts />
        <CategorySection />
        <TestimonialSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
