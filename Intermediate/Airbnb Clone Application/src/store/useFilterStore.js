import { create } from 'zustand';

export const useFilterStore = create((set, get) => ({
  // State
  activeCategory: null,
  priceRange: { min: null, max: null },
  placeType: 'any', // 'any' | 'room' | 'entire'
  bedrooms: 'any', // 'any' | '1' | '2' | '3' | '4' | '5+'
  amenities: [],
  showFilterModal: false,
  
  // Search state
  destination: '',
  checkIn: null,
  checkOut: null,
  guests: { adults: 1, children: 0 },
  
  // Actions
  setCategory: (category) => {
    set({ activeCategory: category });
  },
  
  clearCategory: () => {
    set({ activeCategory: null });
  },
  
  setPriceRange: (min, max) => {
    set({ priceRange: { min, max } });
  },
  
  setPlaceType: (type) => {
    set({ placeType: type });
  },
  
  setBedrooms: (count) => {
    set({ bedrooms: count });
  },
  
  toggleAmenity: (amenity) => {
    const current = get().amenities;
    if (current.includes(amenity)) {
      set({ amenities: current.filter(a => a !== amenity) });
    } else {
      set({ amenities: [...current, amenity] });
    }
  },
  
  setAmenities: (amenities) => {
    set({ amenities });
  },
  
  openFilterModal: () => {
    set({ showFilterModal: true });
  },
  
  closeFilterModal: () => {
    set({ showFilterModal: false });
  },
  
  clearFilters: () => {
    set({
      priceRange: { min: null, max: null },
      placeType: 'any',
      bedrooms: 'any',
      amenities: []
    });
  },
  
  clearAllFilters: () => {
    set({
      activeCategory: null,
      priceRange: { min: null, max: null },
      placeType: 'any',
      bedrooms: 'any',
      amenities: [],
      destination: '',
      checkIn: null,
      checkOut: null,
      guests: { adults: 1, children: 0 }
    });
  },
  
  // Search actions
  setDestination: (destination) => {
    set({ destination });
  },
  
  setCheckIn: (date) => {
    set({ checkIn: date });
  },
  
  setCheckOut: (date) => {
    set({ checkOut: date });
  },
  
  setGuests: (guests) => {
    set({ guests });
  },
  
  incrementAdults: () => {
    const current = get().guests;
    if (current.adults < 16) {
      set({ guests: { ...current, adults: current.adults + 1 } });
    }
  },
  
  decrementAdults: () => {
    const current = get().guests;
    if (current.adults > 1) {
      set({ guests: { ...current, adults: current.adults - 1 } });
    }
  },
  
  incrementChildren: () => {
    const current = get().guests;
    if (current.children < 8) {
      set({ guests: { ...current, children: current.children + 1 } });
    }
  },
  
  decrementChildren: () => {
    const current = get().guests;
    if (current.children > 0) {
      set({ guests: { ...current, children: current.children - 1 } });
    }
  },
  
  // Get all current filters as object
  getFilters: () => {
    const state = get();
    return {
      placeType: state.placeType,
      priceMin: state.priceRange.min,
      priceMax: state.priceRange.max,
      bedrooms: state.bedrooms,
      amenities: state.amenities,
      destination: state.destination
    };
  }
}));
