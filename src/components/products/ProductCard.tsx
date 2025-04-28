
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WatchProduct } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";

interface ProductCardProps {
  product: WatchProduct;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addItem } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <Link 
      to={`/products/${product.id}`}
      className={`group block rounded-lg overflow-hidden bg-card border border-border relative watch-card ${
        featured ? "lg:col-span-2 lg:row-span-2" : ""
      }`}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80";
          }}
        />
        <div className="watch-card-shine"></div>
        
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        {product.discountPrice && (
          <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
            SALE
          </div>
        )}
        
        {product.featured && !product.discountPrice && (
          <div className="absolute top-3 left-3 bg-gold-DEFAULT text-white text-xs font-medium px-2 py-1 rounded">
            FEATURED
          </div>
        )}
        
        {product.bestseller && !product.featured && !product.discountPrice && (
          <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
            BESTSELLER
          </div>
        )}
        
        {product.newArrival && !product.bestseller && !product.featured && !product.discountPrice && (
          <div className="absolute top-3 left-3 bg-accent-foreground text-accent text-xs font-medium px-2 py-1 rounded">
            NEW
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-lg">{product.brand}</h3>
            <h4 className="font-playfair text-xl">{product.name}</h4>
          </div>
          
          <div className={`text-right ${product.discountPrice ? "space-y-1" : ""}`}>
            {product.discountPrice ? (
              <>
                <p className="text-muted-foreground line-through text-sm">
                  {formatPrice(product.price)}
                </p>
                <p className="font-semibold text-destructive">
                  {formatPrice(product.discountPrice)}
                </p>
              </>
            ) : (
              <p className="font-semibold">{formatPrice(product.price)}</p>
            )}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.shortDescription}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {product.style.slice(0, 2).join(" · ")}
          </div>
          
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="text-xs py-0 px-3 h-8 border-gold-DEFAULT text-gold-dark dark:text-gold-DEFAULT hover:bg-gold-DEFAULT hover:text-white"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};
