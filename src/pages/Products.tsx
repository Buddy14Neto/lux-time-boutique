
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { sampleWatches } from "@/lib/sample-data";
import { WatchBrand, WatchStyle, WatchProduct, WatchMaterial } from "@/lib/types";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [watches, setWatches] = useState<WatchProduct[]>(sampleWatches);
  const [filteredWatches, setFilteredWatches] = useState<WatchProduct[]>(sampleWatches);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<WatchBrand[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<WatchStyle[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<WatchMaterial[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get unique list of brands, styles, etc.
  const brands = Array.from(new Set(sampleWatches.map(watch => watch.brand))) as WatchBrand[];
  const styles = Array.from(new Set(sampleWatches.flatMap(watch => watch.style))) as WatchStyle[];
  const materials = Array.from(new Set(sampleWatches.map(watch => watch.specifications.caseMaterial))) as WatchMaterial[];

  // Handle URL params on initial load
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    const styleParam = searchParams.get("style");
    
    if (brandParam) {
      setSelectedBrands([brandParam as WatchBrand]);
    }
    
    if (styleParam) {
      setSelectedStyles([styleParam as WatchStyle]);
    }
  }, [searchParams]);
  
  // Apply filters when any filter changes
  useEffect(() => {
    let filtered = [...watches];
    
    // Apply brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(watch => selectedBrands.includes(watch.brand));
    }
    
    // Apply style filter
    if (selectedStyles.length > 0) {
      filtered = filtered.filter(watch => 
        watch.style.some(style => selectedStyles.includes(style))
      );
    }
    
    // Apply material filter
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(watch => 
        selectedMaterials.includes(watch.specifications.caseMaterial)
      );
    }
    
    // Apply price range filter
    filtered = filtered.filter(watch => {
      const price = watch.discountPrice || watch.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Apply search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(watch => 
        watch.name.toLowerCase().includes(term) || 
        watch.brand.toLowerCase().includes(term) ||
        watch.description.toLowerCase().includes(term)
      );
    }
    
    // Update filtered watches
    setFilteredWatches(filtered);
    
    // Update URL params for shareable filters
    const params = new URLSearchParams();
    
    if (selectedBrands.length === 1) {
      params.set("brand", selectedBrands[0]);
    }
    
    if (selectedStyles.length === 1) {
      params.set("style", selectedStyles[0]);
    }
    
    if (searchTerm) {
      params.set("q", searchTerm);
    }
    
    setSearchParams(params, { replace: true });
    
  }, [selectedBrands, selectedStyles, selectedMaterials, priceRange, searchTerm, watches]);
  
  // Toggle brand selection
  const toggleBrand = (brand: WatchBrand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };
  
  // Toggle style selection
  const toggleStyle = (style: WatchStyle) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };
  
  // Toggle material selection
  const toggleMaterial = (material: WatchMaterial) => {
    setSelectedMaterials(prev => 
      prev.includes(material) 
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedStyles([]);
    setSelectedMaterials([]);
    setPriceRange([0, 50000]);
    setSearchTerm("");
    setSearchParams({});
  };
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <div className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="section-title">Luxury Watches</h1>
            <p className="section-subtitle">
              Browse our curated collection of prestigious timepieces from the world's finest watchmakers.
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          {/* Search and filters toggle for mobile */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search watches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>
            
            <div className="flex justify-between md:justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden"
              >
                Filters
              </Button>
              
              {(selectedBrands.length > 0 || selectedStyles.length > 0 || selectedMaterials.length > 0 || priceRange[0] > 0 || priceRange[1] < 50000) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Clear Filters
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
              
              <span className="text-sm text-muted-foreground self-center hidden md:inline-flex">
                {filteredWatches.length} results
              </span>
            </div>
          </div>
          
          {/* Active filters display */}
          {(selectedBrands.length > 0 || selectedStyles.length > 0 || selectedMaterials.length > 0) && (
            <div className="mb-6 flex flex-wrap gap-2">
              {selectedBrands.map(brand => (
                <span 
                  key={brand}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm"
                >
                  {brand}
                  <button 
                    onClick={() => toggleBrand(brand)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
              {selectedStyles.map(style => (
                <span 
                  key={style}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm"
                >
                  {style}
                  <button 
                    onClick={() => toggleStyle(style)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              
              {selectedMaterials.map(material => (
                <span 
                  key={material}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-sm"
                >
                  {material}
                  <button 
                    onClick={() => toggleMaterial(material)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <aside className="hidden md:block w-full lg:w-64 shrink-0">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h3 className="font-medium text-lg mb-4">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={50000}
                      step={1000}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-6"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Brands</h3>
                  <div className="space-y-3">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <label 
                          htmlFor={`brand-${brand}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Watch Style</h3>
                  <div className="space-y-3">
                    {styles.map((style) => (
                      <div key={style} className="flex items-center">
                        <Checkbox
                          id={`style-${style}`}
                          checked={selectedStyles.includes(style)}
                          onCheckedChange={() => toggleStyle(style)}
                        />
                        <label 
                          htmlFor={`style-${style}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {style}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-4">Case Material</h3>
                  <div className="space-y-3">
                    {materials.map((material) => (
                      <div key={material} className="flex items-center">
                        <Checkbox
                          id={`material-${material}`}
                          checked={selectedMaterials.includes(material)}
                          onCheckedChange={() => toggleMaterial(material)}
                        />
                        <label 
                          htmlFor={`material-${material}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {material}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
            
            {/* Mobile Filters */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 bg-background flex flex-col md:hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-xl font-medium">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex-1 overflow-auto p-4 space-y-8">
                  <div>
                    <h3 className="font-medium text-lg mb-4">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={50000}
                        step={1000}
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        className="mb-6"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Brands</h3>
                    <div className="space-y-3">
                      {brands.map((brand) => (
                        <div key={brand} className="flex items-center">
                          <Checkbox
                            id={`mobile-brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => toggleBrand(brand)}
                          />
                          <label 
                            htmlFor={`mobile-brand-${brand}`}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Watch Style</h3>
                    <div className="space-y-3">
                      {styles.map((style) => (
                        <div key={style} className="flex items-center">
                          <Checkbox
                            id={`mobile-style-${style}`}
                            checked={selectedStyles.includes(style)}
                            onCheckedChange={() => toggleStyle(style)}
                          />
                          <label 
                            htmlFor={`mobile-style-${style}`}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {style}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">Case Material</h3>
                    <div className="space-y-3">
                      {materials.map((material) => (
                        <div key={material} className="flex items-center">
                          <Checkbox
                            id={`mobile-material-${material}`}
                            checked={selectedMaterials.includes(material)}
                            onCheckedChange={() => toggleMaterial(material)}
                          />
                          <label 
                            htmlFor={`mobile-material-${material}`}
                            className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {material}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                    >
                      Clear All
                    </Button>
                    <Button
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Products Grid */}
            <div className="flex-1">
              {filteredWatches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWatches.map((watch) => (
                    <ProductCard key={watch.id} product={watch} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 border border-border rounded-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-2">No watches found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters or search term</p>
                    <Button onClick={clearFilters}>Clear Filters</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Products;
