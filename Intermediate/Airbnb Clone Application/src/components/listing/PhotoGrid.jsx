import { useState } from 'react';
import { MdHome } from 'react-icons/md';
import PhotoModal from './PhotoModal';

const PhotoGrid = ({ images, title }) => {
  const [showModal, setShowModal] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const renderImage = (index, className) => {
    if (imageErrors[index] || !images[index]) {
      return (
        <div className={`bg-bg-gray flex items-center justify-center ${className}`}>
          <MdHome className="w-12 h-12 text-text-secondary" />
        </div>
      );
    }

    return (
      <img
        src={images[index]}
        alt={`${title} - Photo ${index + 1}`}
        onError={() => handleImageError(index)}
        className={`object-cover ${className}`}
      />
    );
  };

  return (
    <>
      {/* Desktop Grid: 1 large + 4 small */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[400px] lg:h-[500px] rounded-xl overflow-hidden">
        {/* Main large image */}
        <div className="col-span-2 row-span-2 relative cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setShowModal(true)}>
          {renderImage(0, 'w-full h-full')}
        </div>

        {/* Top right images */}
        <div className="relative cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setShowModal(true)}>
          {renderImage(1, 'w-full h-full')}
        </div>
        <div className="relative cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setShowModal(true)}>
          {renderImage(2, 'w-full h-full')}
        </div>

        {/* Bottom right images */}
        <div className="relative cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setShowModal(true)}>
          {renderImage(3, 'w-full h-full')}
        </div>
        <div className="relative cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setShowModal(true)}>
          {renderImage(4, 'w-full h-full')}
        </div>
      </div>

      {/* Show all photos button */}
      <div className="hidden md:flex justify-end mt-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-white border border-text-primary rounded-lg text-sm font-medium hover:bg-bg-gray transition-colors"
        >
          Show all photos
        </button>
      </div>

      {/* Mobile: Single image carousel */}
      <div className="md:hidden relative aspect-[4/3] rounded-xl overflow-hidden">
        {renderImage(0, 'w-full h-full')}
        <button
          onClick={() => setShowModal(true)}
          className="absolute bottom-4 right-4 px-3 py-1.5 bg-white border border-text-primary rounded-lg text-xs font-medium"
        >
          Show all photos
        </button>
      </div>

      {/* Photo Modal */}
      <PhotoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        images={images}
        title={title}
      />
    </>
  );
};

export default PhotoGrid;
