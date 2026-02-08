import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdSearch } from 'react-icons/md';
import { FaAirbnb } from 'react-icons/fa';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useClickOutside } from '../../hooks/useClickOutside';

const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { isScrolled } = useScrollPosition(50);
  
  const searchRef = useClickOutside(() => {
    if (isSearchExpanded) {
      setIsSearchExpanded(false);
    }
  }, isSearchExpanded);

  return (
    <header 
      className={`
        sticky top-0 z-40 bg-white
        transition-shadow duration-200
        ${isScrolled ? 'navbar-shadow' : 'border-b border-border'}
      `}
    >
      <nav className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20">
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-1 text-airbnb hover:opacity-90 transition-opacity"
          >
            <FaAirbnb className="w-8 h-8" />
            <span className="font-bold text-xl hidden lg:block">airbnb</span>
          </Link>

          {/* Search Bar */}
          <div ref={searchRef} className="flex-1 flex justify-center max-w-2xl">
            <SearchBar 
              isExpanded={isSearchExpanded}
              onExpand={() => setIsSearchExpanded(true)}
              onCollapse={() => setIsSearchExpanded(false)}
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <button className="hidden lg:block px-4 py-2 text-sm font-medium rounded-full hover:bg-bg-gray transition-colors">
              Airbnb your home
            </button>
            <UserMenu />
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden py-4">
          <button 
            onClick={() => setIsSearchExpanded(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-border rounded-full card-shadow hover:shadow-md transition-shadow"
          >
            <MdSearch className="w-6 h-6 text-text-primary" />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-text-primary">Where to?</p>
              <p className="text-xs text-text-secondary">Anywhere · Any week · Add guests</p>
            </div>
          </button>
        </div>
      </nav>

      {/* Expanded Search Overlay for Mobile */}
      {isSearchExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-white z-50 overflow-y-auto"
        >
          <div className="p-4">
            <SearchBar 
              isExpanded={true}
              onExpand={() => {}}
              onCollapse={() => setIsSearchExpanded(false)}
              isMobile={true}
            />
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
