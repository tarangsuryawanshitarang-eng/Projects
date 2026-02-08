import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdMenu, MdAccountCircle } from 'react-icons/md';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useAuthStore } from '../../store/useAuthStore';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, openLogin, openSignup, logout } = useAuthStore();
  
  const menuRef = useClickOutside(() => {
    if (isOpen) setIsOpen(false);
  }, isOpen);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const menuItems = isAuthenticated
    ? [
        { label: 'Wishlists', onClick: () => setIsOpen(false) },
        { label: 'Account', onClick: () => setIsOpen(false) },
        { divider: true },
        { label: 'Airbnb your home', onClick: () => setIsOpen(false) },
        { label: 'Help Center', onClick: () => setIsOpen(false) },
        { divider: true },
        { label: 'Log out', onClick: handleLogout },
      ]
    : [
        { label: 'Sign up', onClick: () => { openSignup(); setIsOpen(false); }, bold: true },
        { label: 'Log in', onClick: () => { openLogin(); setIsOpen(false); } },
        { divider: true },
        { label: 'Airbnb your home', onClick: () => setIsOpen(false) },
        { label: 'Help Center', onClick: () => setIsOpen(false) },
      ];

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 p-2 pl-3
          border border-border rounded-full
          hover:shadow-md transition-shadow
          ${isOpen ? 'shadow-md' : ''}
        `}
      >
        <MdMenu className="w-5 h-5 text-text-primary" />
        {isAuthenticated && user ? (
          <div className="w-8 h-8 rounded-full bg-airbnb flex items-center justify-center text-white font-semibold text-sm">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        ) : (
          <MdAccountCircle className="w-8 h-8 text-text-secondary" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50"
          >
            <div className="py-2">
              {menuItems.map((item, index) => {
                if (item.divider) {
                  return <div key={index} className="my-2 border-t border-border" />;
                }
                return (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`
                      w-full px-4 py-3 text-left text-sm
                      hover:bg-bg-gray transition-colors
                      ${item.bold ? 'font-semibold' : ''}
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
