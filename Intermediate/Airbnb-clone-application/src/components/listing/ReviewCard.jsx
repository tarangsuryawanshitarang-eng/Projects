import { MdStar } from 'react-icons/md';

const ReviewCard = ({ review }) => {
  const { name, avatar, date, rating, comment } = review;

  return (
    <div>
      {/* Reviewer Info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={avatar}
          alt={name}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-text-secondary">{date}</p>
        </div>
      </div>

      {/* Star Rating */}
      <div className="flex gap-1 mb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <MdStar
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-text-primary' : 'text-border'}`}
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-text-primary line-clamp-3">{comment}</p>
    </div>
  );
};

export default ReviewCard;
