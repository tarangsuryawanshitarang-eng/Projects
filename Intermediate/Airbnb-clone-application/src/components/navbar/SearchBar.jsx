import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSearch, MdClose } from 'react-icons/md';
import GuestCounter from './GuestCounter';
import { useFilterStore } from '../../store/useFilterStore';

const SearchBar = ({ isExpanded, onExpand, onCollapse, isMobile = false }) => {
  const [activeTab, setActiveTab] = useState('where');
  const { 
    destination, 
    setDestination, 
    checkIn, 
    setCheckIn, 
    checkOut, 
    setCheckOut,
    guests,
    clearAllFilters
  } = useFilterStore();

  const handleSearch = () => {
    onCollapse();
    // Trigger search - the filter store is already updated
  };

  const totalGuests = guests.adults + guests.children;

  // Collapsed Search Pill
  if (!isExpanded && !isMobile) {
    return (
      <button
        onClick={onExpand}
        className="flex items-center border border-border rounded-full shadow-sm hover:shadow-md transition-shadow"
      >
        <span className="px-4 py-3 text-sm font-medium border-r border-border">
          Anywhere
        </span>
        <span className="px-4 py-3 text-sm font-medium border-r border-border">
          Any week
        </span>
        <span className="px-4 py-3 text-sm text-text-secondary">
          Add guests
        </span>
        <span className="p-2 mr-1 bg-airbnb rounded-full">
          <MdSearch className="w-4 h-4 text-white" />
        </span>
      </button>
    );
  }

  // Expanded Search Bar
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`
        ${isMobile ? 'w-full' : 'w-full max-w-[850px]'}
      `}
    >
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onCollapse}
            className="p-2 rounded-full border border-border hover:bg-bg-gray transition-colors"
          >
            <MdClose className="w-5 h-5" />
          </button>
          <button
            onClick={clearAllFilters}
            className="text-sm font-medium underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Search Tabs */}
      <div className={`
        bg-white rounded-full border border-border
        ${isMobile ? 'rounded-3xl' : 'shadow-lg'}
      `}>
        <div className={`
          ${isMobile ? 'flex flex-col gap-0 p-4' : 'flex items-center'}
        `}>
          {/* Where */}
          <div 
            className={`
              flex-1 relative cursor-pointer
              ${isMobile ? 'border-b border-border pb-4 mb-4' : 'border-r border-border'}
              ${activeTab === 'where' ? 'bg-bg-gray rounded-full' : ''}
            `}
            onClick={() => setActiveTab('where')}
          >
            <div className={`px-6 py-3 ${isMobile ? 'px-0' : ''}`}>
              <label className="block text-xs font-semibold mb-1">Where</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search destinations"
                className="w-full bg-transparent border-none p-0 text-sm placeholder:text-text-secondary focus:outline-none"
              />
            </div>
          </div>

          {/* Check In */}
          <div 
            className={`
              flex-1 relative cursor-pointer
              ${isMobile ? 'border-b border-border pb-4 mb-4' : 'border-r border-border'}
              ${activeTab === 'checkin' ? 'bg-bg-gray rounded-full' : ''}
            `}
            onClick={() => setActiveTab('checkin')}
          >
            <div className={`px-6 py-3 ${isMobile ? 'px-0' : ''}`}>
              <label className="block text-xs font-semibold mb-1">Check in</label>
              <input
                type="date"
                value={checkIn || ''}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-sm text-text-secondary focus:outline-none"
              />
            </div>
          </div>

          {/* Check Out */}
          <div 
            className={`
              flex-1 relative cursor-pointer
              ${isMobile ? 'border-b border-border pb-4 mb-4' : 'border-r border-border'}
              ${activeTab === 'checkout' ? 'bg-bg-gray rounded-full' : ''}
            `}
            onClick={() => setActiveTab('checkout')}
          >
            <div className={`px-6 py-3 ${isMobile ? 'px-0' : ''}`}>
              <label className="block text-xs font-semibold mb-1">Check out</label>
              <input
                type="date"
                value={checkOut || ''}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-sm text-text-secondary focus:outline-none"
              />
            </div>
          </div>

          {/* Who */}
          <div 
            className={`
              flex-1 relative cursor-pointer
              ${activeTab === 'who' ? 'bg-bg-gray rounded-full' : ''}
            `}
            onClick={() => setActiveTab('who')}
          >
            <div className={`px-6 py-3 ${isMobile ? 'px-0' : 'flex items-center justify-between'}`}>
              <div>
                <label className="block text-xs font-semibold mb-1">Who</label>
                <span className="text-sm text-text-secondary">
                  {totalGuests > 1 ? `${totalGuests} guests` : 'Add guests'}
                </span>
              </div>
              {!isMobile && (
                <button
                  onClick={handleSearch}
                  className="flex items-center gap-2 px-4 py-3 bg-airbnb hover:bg-airbnb-dark text-white rounded-full transition-colors"
                >
                  <MdSearch className="w-5 h-5" />
                  <span className="font-medium">Search</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Guest Counter Dropdown */}
        <AnimatePresence>
          {activeTab === 'who' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`
                border-t border-border overflow-hidden
                ${isMobile ? '' : 'absolute right-0 mt-2 w-96 bg-white rounded-3xl shadow-lg border'}
              `}
            >
              <GuestCounter />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Search Button */}
      {isMobile && (
        <button
          onClick={handleSearch}
          className="w-full mt-4 py-4 bg-airbnb hover:bg-airbnb-dark text-white rounded-xl font-semibold text-lg transition-colors"
        >
          Search
        </button>
      )}
    </motion.div>
  );
};

export default SearchBar;
