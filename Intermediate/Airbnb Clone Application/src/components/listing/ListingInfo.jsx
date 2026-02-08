import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdVerified, MdLocationOn, MdDoorFront, MdEventAvailable, MdStar } from 'react-icons/md';
import AmenitiesGrid from './AmenitiesGrid';

const ListingInfo = ({ listing }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const {
    title,
    type,
    host,
    guests,
    bedrooms,
    beds,
    bathrooms,
    description,
    amenities,
    location,
    rating,
    reviewCount
  } = listing;

  return (
    <div className="space-y-8">
      {/* Title and Host */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {type} hosted by {host.name}
            </h2>
            <p className="text-text-secondary mt-1">
              {guests} guests · {bedrooms} bedroom{bedrooms !== 1 ? 's' : ''} · {beds} bed{beds !== 1 ? 's' : ''} · {bathrooms} bath{bathrooms !== 1 ? 's' : ''}
            </p>
          </div>
          <img
            src={host.avatar}
            alt={host.name}
            className="w-14 h-14 rounded-full"
          />
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Highlights */}
      <div className="space-y-6">
        {host.isSuperhost && (
          <div className="flex items-start gap-4">
            <MdVerified className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{host.name} is a Superhost</p>
              <p className="text-sm text-text-secondary">
                Superhosts are experienced, highly rated hosts who are committed to providing great stays.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-4">
          <MdLocationOn className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Great location</p>
            <p className="text-sm text-text-secondary">
              95% of recent guests gave the location a 5-star rating.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MdDoorFront className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Self check-in</p>
            <p className="text-sm text-text-secondary">
              Check yourself in with the lockbox.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MdEventAvailable className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Free cancellation for 48 hours</p>
            <p className="text-sm text-text-secondary">
              Get a full refund if you change your mind.
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Description */}
      <div>
        <h3 className="text-xl font-semibold mb-4">About this place</h3>
        <AnimatePresence mode="wait">
          <motion.div
            key={showFullDescription ? 'full' : 'truncated'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className={`text-text-primary leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>
              {description}
            </p>
          </motion.div>
        </AnimatePresence>
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="mt-3 font-medium underline hover:text-text-secondary"
        >
          {showFullDescription ? 'Show less' : 'Show more'}
        </button>
      </div>

      <div className="h-px bg-border" />

      {/* Amenities */}
      <AmenitiesGrid amenities={amenities} />
    </div>
  );
};

export default ListingInfo;
