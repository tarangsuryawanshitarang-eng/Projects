import ListingCard from './ListingCard';
import SkeletonCard from './SkeletonCard';

const ListingGrid = ({ listings, isLoading, onShowMore, hasMore, showMoreLoading }) => {
  return (
    <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-8">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          // Show 8 skeleton cards while loading
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          // Show listing cards
          listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        )}
      </div>

      {/* Show More Button */}
      {!isLoading && hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={onShowMore}
            disabled={showMoreLoading}
            className="px-8 py-3 bg-text-primary text-white rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50"
          >
            {showMoreLoading ? 'Loading...' : 'Show more'}
          </button>
        </div>
      )}

      {/* No Results */}
      {!isLoading && listings.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl font-semibold mb-2">No exact matches</p>
          <p className="text-text-secondary">Try changing or removing some of your filters</p>
        </div>
      )}
    </div>
  );
};

export default ListingGrid;
