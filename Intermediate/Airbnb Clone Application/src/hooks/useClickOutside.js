import { useEffect, useRef } from 'react';

/**
 * Hook that detects clicks outside of the passed ref element
 * @param {Function} handler - Callback function to run when click outside is detected
 * @param {boolean} active - Whether the hook should be active (default: true)
 */
export const useClickOutside = (handler, active = true) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!active) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler, active]);

  return ref;
};

export default useClickOutside;
