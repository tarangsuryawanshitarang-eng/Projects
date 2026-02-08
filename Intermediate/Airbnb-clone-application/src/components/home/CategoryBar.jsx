import { useRef, useState, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight, MdTune } from 'react-icons/md';
import { 
  MdLandscape, MdBeachAccess, MdCabin, MdCastle, MdGrass, MdDesignServices,
  MdAgriculture, MdSailing, MdWater, MdDiamond, MdVilla, MdForest,
  MdRocketLaunch, MdPool, MdDownhillSkiing, MdSurfing, MdHouse, MdTrendingUp,
  MdLocalFlorist, MdPark, MdWineBar, MdTerrain, MdDirectionsBoat, MdAccountBalance, MdAir
} from 'react-icons/md';
import { categories } from '../../data/categories';
import { useFilterStore } from '../../store/useFilterStore';

// Icon mapping
const iconMap = {
  MdLandscape, MdBeachAccess, MdCabin, MdCastle, MdGrass, MdDesignServices,
  MdAgriculture, MdSailing, MdWater, MdDiamond, MdVilla, MdForest,
  MdRocketLaunch, MdPool, MdDownhillSkiing, MdSurfing, MdHouse, MdTrendingUp,
  MdLocalFlorist, MdPark, MdWineBar, MdTerrain, MdDirectionsBoat, MdAccountBalance, MdAir
};

const CategoryBar = ({ onFilterClick }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const { activeCategory, setCategory } = useFilterStore();

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollPosition);
      return () => scrollElement.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (activeCategory === categoryId) {
      setCategory(null); // Toggle off
    } else {
      setCategory(categoryId);
    }
  };

  return (
    <div className="sticky top-20 z-30 bg-white border-b border-border">
      <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-4">
        <div className="flex items-center gap-4">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-border bg-white hover:shadow-md transition-shadow flex-shrink-0"
            >
              <MdChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Categories Scroll Container */}
          <div
            ref={scrollRef}
            className="flex-1 flex items-center gap-8 overflow-x-auto hide-scrollbar"
          >
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon];
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                    flex flex-col items-center gap-2 px-2 pb-3 pt-1
                    flex-shrink-0 cursor-pointer
                    border-b-2 transition-all
                    ${isActive 
                      ? 'border-text-primary opacity-100' 
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-border'
                    }
                  `}
                >
                  {IconComponent && (
                    <IconComponent className="w-6 h-6" />
                  )}
                  <span className={`text-xs whitespace-nowrap ${isActive ? 'font-semibold' : ''}`}>
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-border bg-white hover:shadow-md transition-shadow flex-shrink-0"
            >
              <MdChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Filters Button */}
          <button
            onClick={onFilterClick}
            className="flex items-center gap-2 px-4 py-3 border border-border rounded-xl hover:border-text-primary transition-colors flex-shrink-0"
          >
            <MdTune className="w-5 h-5" />
            <span className="text-sm font-medium hidden md:block">Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
