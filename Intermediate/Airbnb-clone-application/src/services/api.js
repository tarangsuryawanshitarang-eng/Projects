// Simulated API service with network delays
import { listings, generateReviews, ratingBreakdown } from '../data/listings';

// Fetch all listings with optional category filter
export const fetchListings = (category = null, filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = [...listings];
      
      // Filter by category
      if (category) {
        results = results.filter(l => l.categories.includes(category));
      }
      
      // Filter by place type
      if (filters.placeType && filters.placeType !== 'any') {
        results = results.filter(l => {
          if (filters.placeType === 'room') {
            return l.type.toLowerCase().includes('room');
          } else if (filters.placeType === 'entire') {
            return l.type.toLowerCase().includes('entire');
          }
          return true;
        });
      }
      
      // Filter by price range
      if (filters.priceMin !== undefined && filters.priceMin !== null) {
        results = results.filter(l => l.price >= filters.priceMin);
      }
      if (filters.priceMax !== undefined && filters.priceMax !== null) {
        results = results.filter(l => l.price <= filters.priceMax);
      }
      
      // Filter by bedrooms
      if (filters.bedrooms && filters.bedrooms !== 'any') {
        const bedroomCount = parseInt(filters.bedrooms);
        if (filters.bedrooms === '5+') {
          results = results.filter(l => l.bedrooms >= 5);
        } else {
          results = results.filter(l => l.bedrooms >= bedroomCount);
        }
      }
      
      // Filter by amenities
      if (filters.amenities && filters.amenities.length > 0) {
        results = results.filter(l => 
          filters.amenities.every(amenity => 
            l.amenities.some(a => a.toLowerCase() === amenity.toLowerCase())
          )
        );
      }
      
      // Filter by search query (destination)
      if (filters.destination) {
        const query = filters.destination.toLowerCase();
        results = results.filter(l => 
          l.location.city.toLowerCase().includes(query) ||
          l.location.country.toLowerCase().includes(query) ||
          l.title.toLowerCase().includes(query)
        );
      }
      
      resolve(results);
    }, 800); // Simulate network delay
  });
};

// Fetch a single listing by ID
export const fetchListingById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const listing = listings.find(l => l.id === id);
      if (listing) {
        // Add reviews to the listing
        resolve({
          ...listing,
          reviews: generateReviews(),
          ratingBreakdown: ratingBreakdown
        });
      } else {
        reject(new Error("Listing not found"));
      }
    }, 500);
  });
};

// Fetch listings with pagination
export const fetchListingsPaginated = (page = 1, limit = 12, category = null, filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = [...listings];
      
      // Apply all filters (same as fetchListings)
      if (category) {
        results = results.filter(l => l.categories.includes(category));
      }
      
      if (filters.placeType && filters.placeType !== 'any') {
        results = results.filter(l => {
          if (filters.placeType === 'room') {
            return l.type.toLowerCase().includes('room');
          } else if (filters.placeType === 'entire') {
            return l.type.toLowerCase().includes('entire');
          }
          return true;
        });
      }
      
      if (filters.priceMin !== undefined && filters.priceMin !== null) {
        results = results.filter(l => l.price >= filters.priceMin);
      }
      if (filters.priceMax !== undefined && filters.priceMax !== null) {
        results = results.filter(l => l.price <= filters.priceMax);
      }
      
      if (filters.bedrooms && filters.bedrooms !== 'any') {
        const bedroomCount = parseInt(filters.bedrooms);
        if (filters.bedrooms === '5+') {
          results = results.filter(l => l.bedrooms >= 5);
        } else {
          results = results.filter(l => l.bedrooms >= bedroomCount);
        }
      }
      
      if (filters.amenities && filters.amenities.length > 0) {
        results = results.filter(l => 
          filters.amenities.every(amenity => 
            l.amenities.some(a => a.toLowerCase() === amenity.toLowerCase())
          )
        );
      }
      
      if (filters.destination) {
        const query = filters.destination.toLowerCase();
        results = results.filter(l => 
          l.location.city.toLowerCase().includes(query) ||
          l.location.country.toLowerCase().includes(query) ||
          l.title.toLowerCase().includes(query)
        );
      }
      
      // Paginate
      const start = (page - 1) * limit;
      const paginatedResults = results.slice(start, start + limit);
      
      resolve({
        listings: paginatedResults,
        total: results.length,
        hasMore: start + limit < results.length,
        page,
        totalPages: Math.ceil(results.length / limit)
      });
    }, 800);
  });
};
