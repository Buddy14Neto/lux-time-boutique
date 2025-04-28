
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, ArrowLeft } from "lucide-react";
import { sampleWatches } from "@/lib/sample-data";
import { useCart } from "@/components/cart/CartProvider";
import { WatchProduct } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<WatchProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<WatchProduct[]>([]);
  const { addItem } = useCart();
  
  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      const foundProduct = sampleWatches.find(watch => watch.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Get related products (same brand or style)
        const related = sampleWatches
          .filter(watch => 
            watch.id !== id && 
            (watch.brand === foundProduct.brand || 
             watch.style.some(style => foundProduct.style.includes(style)))
          )
          .slice(0, 4);
        
        setRelatedProducts(related);
      }
      setLoading(false);
    }, 500);
    
    // Reset scroll position when product changes
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };
  
  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-20 pb-12 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Image skeleton */}
                <div className="lg:w-1/2">
                  <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-muted rounded-lg"></div>
                    ))}
                  </div>
                </div>
                
                {/* Content skeleton */}
                <div className="lg:w-1/2">
                  <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-10 bg-muted rounded w-2/3 mb-6"></div>
                  <div className="h-6 bg-muted rounded w-1/4 mb-8"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-8"></div>
                  
                  <div className="h-10 bg-muted rounded w-full mb-6"></div>
                  
                  <div className="h-12 bg-muted rounded mb-6"></div>
                  
                  <div className="h-8 bg-muted rounded w-full mb-2"></div>
                  <div className="h-8 bg-muted rounded w-full mb-2"></div>
                  <div className="h-8 bg-muted rounded w-full mb-2"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-20 pb-12 min-h-screen">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The watch you're looking for doesn't exist or may have been removed.</p>
            <Button asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
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
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex text-sm text-muted-foreground">
              <li className="hover:text-foreground">
                <Link to="/">Home</Link>
              </li>
              <li className="mx-2">/</li>
              <li className="hover:text-foreground">
                <Link to="/products">Watches</Link>
              </li>
              <li className="mx-2">/</li>
              <li className="hover:text-foreground">
                <Link to={`/products?brand=${product.brand}`}>{product.brand}</Link>
              </li>
              <li className="mx-2">/</li>
              <li className="text-foreground">{product.name}</li>
            </ol>
          </nav>
          
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Product Images */}
            <div className="lg:w-1/2">
              <div className="aspect-square mb-4 overflow-hidden rounded-lg border border-border bg-background">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border ${
                      selectedImage === index 
                        ? "border-gold-DEFAULT ring-1 ring-gold-DEFAULT" 
                        : "border-border hover:border-gold-DEFAULT/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Details */}
            <div className="lg:w-1/2">
              <h1 className="font-playfair text-3xl md:text-4xl font-semibold mb-2">
                {product.name}
              </h1>
              <h2 className="text-xl md:text-2xl text-muted-foreground mb-6">
                {product.brand}
              </h2>
              
              {/* Price */}
              <div className="mb-8">
                {product.discountPrice ? (
                  <div className="flex items-center">
                    <span className="text-2xl md:text-3xl font-semibold text-destructive mr-4">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className="text-lg md:text-xl text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl md:text-3xl font-semibold">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <p className="text-muted-foreground">
                  {product.shortDescription}
                </p>
              </div>
              
              {/* Availability */}
              <div className="mb-8">
                <span className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  In Stock
                </span>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-8 flex items-center">
                <span className="mr-4 text-sm font-medium">Quantity</span>
                <div className="flex items-center border border-input rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-2 text-muted-foreground hover:text-foreground"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Add to Cart and Wishlist */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gold-DEFAULT hover:bg-gold-dark text-white py-6"
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="border-gold-DEFAULT text-gold-dark dark:text-gold-DEFAULT hover:bg-gold-DEFAULT hover:text-white"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </Button>
              </div>
              
              {/* Specifications */}
              <div className="border-t border-border pt-8 space-y-4">
                <h3 className="font-playfair text-lg font-semibold mb-4">Specifications</h3>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="text-muted-foreground">Reference</div>
                  <div>{product.specifications.reference}</div>
                  
                  <div className="text-muted-foreground">Case Material</div>
                  <div>{product.specifications.caseMaterial}</div>
                  
                  <div className="text-muted-foreground">Case Diameter</div>
                  <div>{product.specifications.caseDiameter}</div>
                  
                  <div className="text-muted-foreground">Movement</div>
                  <div>{product.specifications.movement}</div>
                  
                  <div className="text-muted-foreground">Power Reserve</div>
                  <div>{product.specifications.powerReserve}</div>
                  
                  <div className="text-muted-foreground">Water Resistance</div>
                  <div>{product.specifications.waterResistance}</div>
                  
                  <div className="text-muted-foreground">Crystal</div>
                  <div>{product.specifications.crystal}</div>
                  
                  <div className="text-muted-foreground">Dial Color</div>
                  <div>{product.specifications.dialColor}</div>
                  
                  <div className="text-muted-foreground">Strap Material</div>
                  <div>{product.specifications.strapMaterial}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-16">
            <h2 className="text-2xl font-playfair font-semibold mb-6">Description</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>{product.description}</p>
            </div>
          </div>
          
          {/* Functions */}
          <div className="mt-12">
            <h2 className="text-2xl font-playfair font-semibold mb-6">Functions</h2>
            <ul className="list-disc pl-6 space-y-2">
              {product.specifications.functions.map((func, index) => (
                <li key={index}>{func}</li>
              ))}
            </ul>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-playfair font-semibold mb-8">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(watch => (
                  <ProductCard key={watch.id} product={watch} />
                ))}
              </div>
            </div>
          )}
          
          {/* Back to Products */}
          <div className="mt-16">
            <Button asChild variant="outline">
              <Link to="/products" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
