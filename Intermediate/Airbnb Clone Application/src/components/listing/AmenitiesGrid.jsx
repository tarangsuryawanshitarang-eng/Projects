import { useState } from 'react';
import { 
  MdWifi, MdKitchen, MdPool, MdLocalParking, MdAcUnit, MdTv, 
  MdLocalLaundryService, MdHotTub, MdOutdoorGrill, MdLandscape,
  MdFireplace, MdBeachAccess, MdDirectionsBoat, MdSpa, MdFitnessCenter,
  MdBalcony, MdDeck, MdYard, MdPets, MdSmokeFree, MdCheck
} from 'react-icons/md';
import Modal from '../ui/Modal';

// Icon mapping for amenities
const getAmenityIcon = (amenity) => {
  const iconMap = {
    'Wifi': MdWifi,
    'Kitchen': MdKitchen,
    'Pool': MdPool,
    'Free parking': MdLocalParking,
    'AC': MdAcUnit,
    'TV': MdTv,
    'Washer': MdLocalLaundryService,
    'Hot tub': MdHotTub,
    'BBQ grill': MdOutdoorGrill,
    'Ocean view': MdLandscape,
    'Mountain view': MdLandscape,
    'Lake view': MdLandscape,
    'Vineyard view': MdLandscape,
    'Rice paddy view': MdLandscape,
    'Forest view': MdLandscape,
    'Desert view': MdLandscape,
    'City view': MdLandscape,
    'Canal view': MdLandscape,
    'Jungle view': MdLandscape,
    'Fireplace': MdFireplace,
    'Heating': MdFireplace,
    'Beach access': MdBeachAccess,
    'Private dock': MdDirectionsBoat,
    'Kayaks': MdDirectionsBoat,
    'Snorkeling gear': MdDirectionsBoat,
    'Hammam': MdSpa,
    'Sauna': MdSpa,
    'Gym': MdFitnessCenter,
    'Gym access': MdFitnessCenter,
    'Balcony': MdBalcony,
    'Terrace': MdDeck,
    'Rooftop terrace': MdDeck,
    'Private deck': MdDeck,
    'Deck': MdDeck,
    'Garden': MdYard,
    'Courtyard': MdYard,
    'Yoga deck': MdSpa,
    'Fire pit': MdOutdoorGrill,
    'Dryer': MdLocalLaundryService,
    'Coffee maker': MdKitchen,
    'Outdoor shower': MdSpa,
    'Glass floor': MdLandscape,
    'Stargazing': MdLandscape,
    'Wine tasting': MdKitchen,
    'Breakfast included': MdKitchen,
    'Bikes included': MdLocalParking,
    'Ski-in/ski-out': MdLandscape,
    'Hiking trails': MdLandscape,
    'Historic building': MdLandscape,
    'Library access': MdLandscape
  };

  return iconMap[amenity] || MdCheck;
};

const AmenitiesGrid = ({ amenities }) => {
  const [showModal, setShowModal] = useState(false);
  const displayedAmenities = amenities.slice(0, 6);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
      
      {/* Grid of first 6 amenities */}
      <div className="grid grid-cols-2 gap-4">
        {displayedAmenities.map((amenity) => {
          const Icon = getAmenityIcon(amenity);
          return (
            <div key={amenity} className="flex items-center gap-4">
              <Icon className="w-6 h-6 text-text-primary" />
              <span>{amenity}</span>
            </div>
          );
        })}
      </div>

      {/* Show all button */}
      {amenities.length > 6 && (
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 px-6 py-3 border border-text-primary rounded-lg font-medium hover:bg-bg-gray transition-colors"
        >
          Show all {amenities.length} amenities
        </button>
      )}

      {/* Amenities Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="What this place offers"
        size="md"
      >
        <div className="p-6">
          <div className="space-y-6">
            {amenities.map((amenity) => {
              const Icon = getAmenityIcon(amenity);
              return (
                <div key={amenity} className="flex items-center gap-4 pb-4 border-b border-border last:border-0">
                  <Icon className="w-6 h-6 text-text-primary" />
                  <span>{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AmenitiesGrid;
