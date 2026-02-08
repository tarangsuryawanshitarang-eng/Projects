import { Link } from 'react-router-dom';
import { MdStar } from 'react-icons/md';
import ImageCarousel from './ImageCarousel';
import WishlistButton from './WishlistButton';

const ListingCard = ({ listing }) => {
  const {
    id,
    title,
    type,
    location,
    images,
    price,
    rating,
    availability,
    isGuestFavorite
  } = listing;

  return (
    <div className="group relative">
      {/* Image Carousel */}
      <div className="relative aspect-square rounded-xl overflow-hidden">
        <Link to={`/rooms/${id}`}>
          <ImageCarousel images={images} title={title} />
        </Link>
        
        {/* Wishlist Button */}
        <WishlistButton listingId={id} />
        
        {/* Guest Favorite Badge */}
        {isGuestFavorite && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-white rounded-full shadow-sm">
            <span className="text-xs font-semibold">Guest favorite</span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <Link to={`/rooms/${id}`} className="block mt-3">
        {/* Row 1: Location + Rating */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[15px] text-text-primary line-clamp-1">
            {location.city}, {location.country}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <MdStar className="w-4 h-4" />
            <span className="text-sm">{rating}</span>
          </div>
        </div>

        {/* Row 2: Type/Description */}
        <p className="text-sm text-text-secondary line-clamp-1 mt-1">
          {type}
        </p>

        {/* Row 3: Availability */}
        <p className="text-sm text-text-secondary mt-1">
          {availability}
        </p>

        {/* Row 4: Price */}
        <p className="mt-2">
          <span className="font-semibold">${price}</span>
          <span className="text-text-primary"> night</span>
        </p>
      </Link>
    </div>
  );
};

export default ListingCard;
