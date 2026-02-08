import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdHome } from 'react-icons/md';

const PhotoModal = ({ isOpen, onClose, images, title }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-border z-10">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
              <button
                onClick={onClose}
                className="p-2 -ml-2 rounded-full hover:bg-bg-gray transition-colors"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="space-y-4">
              {images.map((image, index) => (
                <div key={index} className="w-full">
                  <img
                    src={image}
                    alt={`${title} - Photo ${index + 1}`}
                    className="w-full rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-64 bg-bg-gray rounded-lg flex items-center justify-center">
                          <svg class="w-16 h-16 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoModal;
