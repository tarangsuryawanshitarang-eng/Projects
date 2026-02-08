import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      wishlist: [], // Array of listing IDs
      
      // Actions
      toggleWishlist: (id) => {
        const current = get().wishlist;
        if (current.includes(id)) {
          set({ wishlist: current.filter(itemId => itemId !== id) });
          return false; // Removed
        } else {
          set({ wishlist: [...current, id] });
          return true; // Added
        }
      },
      
      isWishlisted: (id) => {
        return get().wishlist.includes(id);
      },
      
      addToWishlist: (id) => {
        const current = get().wishlist;
        if (!current.includes(id)) {
          set({ wishlist: [...current, id] });
        }
      },
      
      removeFromWishlist: (id) => {
        const current = get().wishlist;
        set({ wishlist: current.filter(itemId => itemId !== id) });
      },
      
      clearWishlist: () => {
        set({ wishlist: [] });
      },
      
      getWishlistCount: () => {
        return get().wishlist.length;
      }
    }),
    {
      name: 'airbnb-wishlist', // localStorage key
    }
  )
);
