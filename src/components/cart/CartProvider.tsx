
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { WatchProduct, CartState, CartItem } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

type CartAction = 
  | { type: 'ADD_ITEM'; product: WatchProduct; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; cart: CartState };

interface CartContextValue {
  cart: CartState;
  addItem: (product: WatchProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const defaultCartState: CartState = {
  items: [],
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0
};

const CART_STORAGE_KEY = 'luxtime-cart';

const calculateCartTotals = (items: CartItem[]): Pick<CartState, 'subtotal' | 'shipping' | 'tax' | 'total'> => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);
  
  // Free shipping over $50,000, otherwise $250
  const shipping = subtotal > 50000 ? 0 : 250;
  
  // 7.5% tax
  const tax = subtotal * 0.075;
  
  const total = subtotal + shipping + tax;
  
  return { subtotal, shipping, tax, total };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.product.id === action.product.id);
      
      let updatedItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.quantity
        };
      } else {
        // New item
        updatedItems = [...state.items, { product: action.product, quantity: action.quantity }];
      }
      
      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems)
      };
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.product.id !== action.productId);
      
      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item => 
        item.product.id === action.productId 
          ? { ...item, quantity: action.quantity }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        ...calculateCartTotals(updatedItems)
      };
    }
    
    case 'CLEAR_CART':
      return defaultCartState;
      
    case 'LOAD_CART':
      return action.cart;
      
    default:
      return state;
  }
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, defaultCartState);
  const { toast } = useToast();
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        dispatch({ type: 'LOAD_CART', cart: JSON.parse(storedCart) });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);
  
  const addItem = (product: WatchProduct, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', product, quantity });
    toast({
      title: "Item added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };
  
  const value: CartContextValue = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
