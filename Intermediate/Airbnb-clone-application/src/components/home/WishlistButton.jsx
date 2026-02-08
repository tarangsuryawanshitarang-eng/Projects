import { motion } from 'framer-motion';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';

const WishlistButton = ({ listingId }) => {
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const { isAuthenticated, openLogin } = useAuthStore();
  const { success, info } = useToastStore();

  const wishlisted = isWishlisted(listingId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      openLogin();
      return;
    }

    const added = toggleWishlist(listingId);
    if (added) {
      success('Added to wishlist');
    } else {
      info('Removed from wishlist');
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 1.2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="absolute top-3 right-3 p-2 z-10"
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {wishlisted ? (
        <MdFavorite className="w-6 h-6 text-airbnb drop-shadow-md" />
      ) : (
        <MdFavoriteBorder className="w-6 h-6 text-white drop-shadow-md hover:scale-110 transition-transform" />
      )}
    </motion.button>
  );
};

export default WishlistButton;
