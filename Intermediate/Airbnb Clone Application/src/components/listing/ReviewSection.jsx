import { useState } from 'react';
import { MdStar } from 'react-icons/md';
import ReviewCard from './ReviewCard';

const ReviewSection = ({ listing }) => {
  const { rating, reviewCount, reviews, ratingBreakdown } = listing;
  const [showAll, setShowAll] = useState(false);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 4);

  const categories = [
    { label: 'Cleanliness', value: ratingBreakdown.cleanliness },
    { label: 'Accuracy', value: ratingBreakdown.accuracy },
    { label: 'Check-in', value: ratingBreakdown.checkIn },
    { label: 'Communication', value: ratingBreakdown.communication },
    { label: 'Location', value: ratingBreakdown.location },
    { label: 'Value', value: ratingBreakdown.value }
  ];

  return (
    <div className="py-8" id="reviews">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MdStar className="w-6 h-6" />
        <span className="text-xl font-semibold">{rating}</span>
        <span className="text-xl font-semibold">·</span>
        <span className="text-xl font-semibold">{reviewCount} reviews</span>
      </div>

      {/* Rating Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {categories.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-32 text-sm">{label}</span>
            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-text-primary rounded-full"
                style={{ width: `${(value / 5) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium w-8 text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Show All Button */}
      {!showAll && reviews.length > 4 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-8 px-6 py-3 border border-text-primary rounded-lg font-medium hover:bg-bg-gray transition-colors"
        >
          Show all {reviewCount} reviews
        </button>
      )}
    </div>
  );
};

export default ReviewSection;
