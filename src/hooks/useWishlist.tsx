import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './useAuth';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  materials: string[];
  inStock: boolean;
}

interface WishlistItem {
  id: string;
  product: Product;
  addedAt: Date;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { user } = useAuth();

  const refreshWishlist = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      const response = await wishlistAPI.getItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setItems([]);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const addToWishlist = async (product: Product) => {
    if (!user) return;

    try {
      await wishlistAPI.addItem(parseInt(product.id));
      await refreshWishlist();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      await wishlistAPI.removeItem(parseInt(productId));
      await refreshWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      refreshWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}