
export type WatchBrand = 
  | 'Rolex'
  | 'Patek Philippe'
  | 'Audemars Piguet'
  | 'Omega'
  | 'Tag Heuer'
  | 'Breitling'
  | 'Cartier'
  | 'IWC Schaffhausen'
  | 'Hublot'
  | 'Jaeger-LeCoultre';

export type WatchStyle = 
  | 'Dress'
  | 'Dive'
  | 'Sports'
  | 'Pilot'
  | 'Chronograph'
  | 'Skeleton'
  | 'Smart'
  | 'Military';

export type WatchMaterial = 
  | 'Stainless Steel'
  | 'Gold'
  | 'Rose Gold'
  | 'Platinum'
  | 'Titanium'
  | 'Ceramic'
  | 'Carbon Fiber'
  | 'Leather';

export interface WatchProduct {
  id: string;
  name: string;
  brand: WatchBrand;
  price: number;
  discountPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  specifications: {
    reference: string;
    caseMaterial: WatchMaterial;
    caseDiameter: string;
    movement: string;
    powerReserve: string;
    waterResistance: string;
    crystal: string;
    dialColor: string;
    strapMaterial: WatchMaterial;
    functions: string[];
  };
  style: WatchStyle[];
}

export interface CartItem {
  product: WatchProduct;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}
