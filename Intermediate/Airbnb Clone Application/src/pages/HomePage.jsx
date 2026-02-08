import { useState, useEffect, useCallback } from 'react';
import CategoryBar from '../components/home/CategoryBar';
import ListingGrid from '../components/home/ListingGrid';
import FilterModal from '../components/modals/FilterModal';
import { fetchListings } from '../services/api';
import { useFilterStore } from '../store/useFilterStore';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [displayedListings, setDisplayedListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMoreLoading, setShowMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const { 
    activeCategory, 
    getFilters,
    destination,
    priceRange,
    placeType,
    bedrooms,
    amenities
  } = useFilterStore();

  const loadListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters = getFilters();
      const data = await fetchListings(activeCategory, filters);
      setListings(data);
      setDisplayedListings(data.slice(0, 12));
      setHasMore(data.length > 12);
    } catch (error) {
      console.error('Error loading listings:', error);
      setListings([]);
      setDisplayedListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, getFilters]);

  useEffect(() => {
    loadListings();
  }, [activeCategory, destination, priceRange.min, priceRange.max, placeType, bedrooms, amenities]);

  const handleShowMore = () => {
    setShowMoreLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayedListings(listings);
      setHasMore(false);
      setShowMoreLoading(false);
    }, 500);
  };

  return (
    <main className="min-h-screen">
      <CategoryBar onFilterClick={() => setShowFilterModal(true)} />
      
      <ListingGrid
        listings={displayedListings}
        isLoading={isLoading}
        onShowMore={handleShowMore}
        hasMore={hasMore}
        showMoreLoading={showMoreLoading}
      />

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
      />
    </main>
  );
};

export default HomePage;
