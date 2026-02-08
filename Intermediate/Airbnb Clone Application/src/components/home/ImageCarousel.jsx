import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { MdHome } from 'react-icons/md';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ImageCarousel = ({ images, title }) => {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="listing-card-swiper w-full h-full">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={images.length > 1}
        className="w-full h-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            {imageErrors[index] ? (
              // Fallback placeholder
              <div className="w-full h-full bg-bg-gray flex items-center justify-center">
                <MdHome className="w-16 h-16 text-text-secondary" />
              </div>
            ) : (
              <img
                src={image}
                alt={`${title} - Image ${index + 1}`}
                loading="lazy"
                onError={() => handleImageError(index)}
                className="w-full h-full object-cover"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
