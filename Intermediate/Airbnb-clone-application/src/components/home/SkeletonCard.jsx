import Skeleton from '../ui/Skeleton';

const SkeletonCard = () => {
  return (
    <div className="animate-pulse">
      {/* Image Skeleton */}
      <Skeleton 
        className="aspect-square mb-3" 
        rounded="xl" 
      />
      
      {/* Text Skeletons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton width="70%" height="16px" rounded="md" />
          <Skeleton width="40px" height="16px" rounded="md" />
        </div>
        <Skeleton width="50%" height="14px" rounded="md" />
        <Skeleton width="40%" height="14px" rounded="md" />
        <Skeleton width="30%" height="16px" rounded="md" className="mt-2" />
      </div>
    </div>
  );
};

export default SkeletonCard;
