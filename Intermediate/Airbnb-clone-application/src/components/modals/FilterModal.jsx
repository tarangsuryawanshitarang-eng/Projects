import { useState } from 'react';
import Modal from '../ui/Modal';
import { useFilterStore } from '../../store/useFilterStore';

const FilterModal = ({ isOpen, onClose }) => {
  const { 
    placeType, 
    setPlaceType,
    priceRange,
    setPriceRange,
    bedrooms,
    setBedrooms,
    amenities,
    toggleAmenity,
    clearFilters
  } = useFilterStore();

  // Local state for editing
  const [localPlaceType, setLocalPlaceType] = useState(placeType);
  const [localPriceMin, setLocalPriceMin] = useState(priceRange.min || '');
  const [localPriceMax, setLocalPriceMax] = useState(priceRange.max || '');
  const [localBedrooms, setLocalBedrooms] = useState(bedrooms);
  const [localAmenities, setLocalAmenities] = useState(amenities);

  const amenityOptions = [
    'Wifi',
    'Kitchen',
    'Pool',
    'Free parking',
    'AC',
    'Washer',
    'Hot tub'
  ];

  const bedroomOptions = ['any', '1', '2', '3', '4', '5+'];

  const handleToggleAmenity = (amenity) => {
    if (localAmenities.includes(amenity)) {
      setLocalAmenities(localAmenities.filter(a => a !== amenity));
    } else {
      setLocalAmenities([...localAmenities, amenity]);
    }
  };

  const handleClearAll = () => {
    setLocalPlaceType('any');
    setLocalPriceMin('');
    setLocalPriceMax('');
    setLocalBedrooms('any');
    setLocalAmenities([]);
  };

  const handleApply = () => {
    setPlaceType(localPlaceType);
    setPriceRange(
      localPriceMin ? parseInt(localPriceMin) : null,
      localPriceMax ? parseInt(localPriceMax) : null
    );
    setBedrooms(localBedrooms);
    
    // Clear and set amenities
    amenityOptions.forEach(amenity => {
      const isSelected = localAmenities.includes(amenity);
      const wasSelected = amenities.includes(amenity);
      if (isSelected !== wasSelected) {
        toggleAmenity(amenity);
      }
    });

    onClose();
  };

  // Sync local state when modal opens
  useState(() => {
    if (isOpen) {
      setLocalPlaceType(placeType);
      setLocalPriceMin(priceRange.min || '');
      setLocalPriceMax(priceRange.max || '');
      setLocalBedrooms(bedrooms);
      setLocalAmenities(amenities);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      size="md"
    >
      <div className="p-6 space-y-8">
        {/* Type of Place */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Type of place</h3>
          <div className="flex gap-3">
            {[
              { id: 'any', label: 'Any type' },
              { id: 'room', label: 'Room' },
              { id: 'entire', label: 'Entire home' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setLocalPlaceType(option.id)}
                className={`
                  flex-1 py-3 px-4 rounded-full border text-sm font-medium transition-colors
                  ${localPlaceType === option.id
                    ? 'bg-text-primary text-white border-text-primary'
                    : 'border-border hover:border-text-primary'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Price Range */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Price range</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs text-text-secondary mb-1">Minimum</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
                <input
                  type="number"
                  value={localPriceMin}
                  onChange={(e) => setLocalPriceMin(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-text-primary"
                />
              </div>
            </div>
            <span className="text-text-secondary mt-4">—</span>
            <div className="flex-1">
              <label className="block text-xs text-text-secondary mb-1">Maximum</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
                <input
                  type="number"
                  value={localPriceMax}
                  onChange={(e) => setLocalPriceMax(e.target.value)}
                  placeholder="1000+"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-text-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Bedrooms */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Bedrooms</h3>
          <div className="flex flex-wrap gap-2">
            {bedroomOptions.map((option) => (
              <button
                key={option}
                onClick={() => setLocalBedrooms(option)}
                className={`
                  py-2 px-6 rounded-full border text-sm font-medium transition-colors
                  ${localBedrooms === option
                    ? 'bg-text-primary text-white border-text-primary'
                    : 'border-border hover:border-text-primary'
                  }
                `}
              >
                {option === 'any' ? 'Any' : option}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Amenities</h3>
          <div className="grid grid-cols-2 gap-4">
            {amenityOptions.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localAmenities.includes(amenity)}
                  onChange={() => handleToggleAmenity(amenity)}
                  className="w-5 h-5 rounded border-border text-text-primary focus:ring-text-primary"
                />
                <span className="text-sm">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t border-border p-4 flex items-center justify-between">
        <button
          onClick={handleClearAll}
          className="font-medium underline hover:text-text-secondary"
        >
          Clear all
        </button>
        <button
          onClick={handleApply}
          className="px-6 py-3 bg-text-primary hover:bg-black text-white font-semibold rounded-lg transition-colors"
        >
          Show places
        </button>
      </div>
    </Modal>
  );
};

export default FilterModal;
