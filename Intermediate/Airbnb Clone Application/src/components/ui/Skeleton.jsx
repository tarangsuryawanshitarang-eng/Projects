const Skeleton = ({ 
  className = '', 
  width, 
  height, 
  rounded = 'md',
  circle = false 
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  };

  const style = {
    width: width || '100%',
    height: height || '20px'
  };

  return (
    <div
      className={`
        skeleton 
        ${circle ? 'rounded-full' : roundedClasses[rounded]}
        ${className}
      `}
      style={style}
    />
  );
};

export default Skeleton;
