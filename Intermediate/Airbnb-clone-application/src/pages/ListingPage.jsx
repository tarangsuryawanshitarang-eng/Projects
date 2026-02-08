import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MdStar, MdShare, MdFavorite, MdFavoriteBorder, MdArrowBack } from 'react-icons/md';
import PhotoGrid from '../components/listing/PhotoGrid';
import ListingInfo from '../components/listing/ListingInfo';
import BookingCard from '../components/listing/BookingCard';
import ReviewSection from '../components/listing/ReviewSection';
import LocationMap from '../components/listing/LocationMap';
import HostInfo from '../components/listing/HostInfo';
import Skeleton from '../components/ui/Skeleton';
import { fetchListingById } from '../services/api';
import { useWishlistStore } from '../store/useWishlistStore';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

const ListingPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const { isAuthenticated, openLogin } = useAuthStore();
  const { success, info } = useToastStore();

  useEffect(() => {
    const loadListing = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchListingById(id);
        setListing(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [id]);

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    const added = toggleWishlist(id);
    if (added) {
      success('Added to wishlist');
    } else {
      info('Removed from wishlist');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Link copied!');
  };

  // Loading State
  if (isLoading) {
    return (
      <main className="max-w-[1120px] mx-auto px-6 md:px-10 lg:px-20 py-8">
        <Skeleton height="40px" width="60%" className="mb-4" />
        <Skeleton height="24px" width="40%" className="mb-6" />
        <Skeleton className="aspect-[2/1] mb-8" rounded="xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton height="80px" />
            <Skeleton height="200px" />
            <Skeleton height="150px" />
          </div>
          <div>
            <Skeleton height="350px" rounded="xl" />
          </div>
        </div>
      </main>
    );
  }

  // Error State
  if (error) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <p className="text-text-secondary mb-6">
            Sorry, we couldn't find the listing you're looking for.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-airbnb hover:bg-airbnb-dark text-white rounded-lg font-medium transition-colors"
          >
            <MdArrowBack className="w-5 h-5" />
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  const wishlisted = isWishlisted(id);

  return (
    <main className="max-w-[1120px] mx-auto px-6 md:px-10 lg:px-20 py-8">
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">{listing.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <MdStar className="w-4 h-4" />
              <span className="font-medium">{listing.rating}</span>
            </div>
            <span>·</span>
            <span className="underline">{listing.reviewCount} reviews</span>
            {listing.host.isSuperhost && (
              <>
                <span>·</span>
                <span>Superhost</span>
              </>
            )}
            <span>·</span>
            <span className="underline">
              {listing.location.city}, {listing.location.country}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm font-medium underline hover:text-text-secondary"
            >
              <MdShare className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handleWishlistToggle}
              className="flex items-center gap-2 text-sm font-medium underline hover:text-text-secondary"
            >
              {wishlisted ? (
                <MdFavorite className="w-4 h-4 text-airbnb" />
              ) : (
                <MdFavoriteBorder className="w-4 h-4" />
              )}
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <PhotoGrid images={listing.images} title={listing.title} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
        {/* Left Column - Listing Info */}
        <div className="lg:col-span-2">
          <ListingInfo listing={listing} />
          <ReviewSection listing={listing} />
          <LocationMap location={listing.location} />
          <HostInfo host={listing.host} reviewCount={listing.reviewCount} />
        </div>

        {/* Right Column - Booking Card */}
        <div className="hidden lg:block">
          <BookingCard listing={listing} />
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-30">
        <div className="flex items-center justify-between">
          <div>
            <p>
              <span className="font-semibold">${listing.price}</span>
              <span className="text-text-primary"> night</span>
            </p>
            <div className="flex items-center gap-1 text-sm">
              <MdStar className="w-4 h-4" />
              <span>{listing.rating}</span>
            </div>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                openLogin();
                return;
              }
              info('Reservation feature coming soon!');
            }}
            className="px-6 py-3 bg-airbnb hover:bg-airbnb-dark text-white font-semibold rounded-lg transition-colors"
          >
            Check availability
          </button>
        </div>
      </div>

      {/* Spacer for mobile bottom bar */}
      <div className="lg:hidden h-20" />
    </main>
  );
};

export default ListingPage;
