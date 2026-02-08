import { useState } from 'react';
import { MdStar } from 'react-icons/md';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';

const BookingCard = ({ listing }) => {
  const { price, rating, reviewCount } = listing;
  const { isAuthenticated, openLogin } = useAuthStore();
  const { info } = useToastStore();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  // Calculate nights between dates
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateNights();
  const subtotal = price * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  const handleReserve = () => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    info('Reservation feature coming soon!');
  };

  return (
    <div className="sticky top-28">
      <div className="border border-border rounded-xl p-6 card-shadow">
        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xl font-semibold">${price}</span>
            <span className="text-text-primary"> night</span>
          </div>
          <div className="flex items-center gap-1">
            <MdStar className="w-4 h-4" />
            <span className="font-medium">{rating}</span>
            <span className="text-text-secondary">({reviewCount} reviews)</span>
          </div>
        </div>

        {/* Date Selection */}
        <div className="border border-border rounded-xl overflow-hidden mb-4">
          <div className="grid grid-cols-2">
            <div className="p-3 border-r border-border">
              <label className="block text-[10px] font-semibold uppercase mb-1">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-sm border-none p-0 focus:outline-none"
              />
            </div>
            <div className="p-3">
              <label className="block text-[10px] font-semibold uppercase mb-1">Checkout</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn}
                className="w-full bg-transparent text-sm border-none p-0 focus:outline-none"
              />
            </div>
          </div>
          <div className="border-t border-border p-3 relative">
            <label className="block text-[10px] font-semibold uppercase mb-1">Guests</label>
            <button
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              className="w-full text-left text-sm"
            >
              {guestCount} guest{guestCount !== 1 ? 's' : ''}
            </button>
            
            {/* Guest Dropdown */}
            {showGuestDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-border rounded-xl shadow-lg z-10">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Adults</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
                      disabled={guestCount <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{guestCount}</span>
                    <button
                      onClick={() => setGuestCount(Math.min(listing.guests, guestCount + 1))}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
                      disabled={guestCount >= listing.guests}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowGuestDropdown(false)}
                  className="mt-4 text-sm underline font-medium"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reserve Button */}
        <button
          onClick={handleReserve}
          className="w-full py-3 bg-airbnb hover:bg-airbnb-dark text-white font-semibold rounded-lg transition-colors"
        >
          Reserve
        </button>

        <p className="text-center text-sm text-text-secondary mt-4">
          You won't be charged yet
        </p>

        {/* Price Breakdown */}
        {nights > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <span className="underline">${price} x {nights} night{nights !== 1 ? 's' : ''}</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="underline">Service fee</span>
              <span>${serviceFee}</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between font-semibold">
              <span>Total before taxes</span>
              <span>${total}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
