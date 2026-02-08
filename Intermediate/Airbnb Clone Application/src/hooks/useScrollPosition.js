import { useState, useEffect } from 'react';

/**
 * Hook that tracks the current scroll position
 * @param {number} threshold - The scroll threshold to track (default: 50)
 * @returns {{ scrollY: number, isScrolled: boolean }}
 */
export const useScrollPosition = (threshold = 50) => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > threshold);
    };

    // Set initial value
    handleScroll();

    // Add event listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return { scrollY, isScrolled };
};

export default useScrollPosition;
