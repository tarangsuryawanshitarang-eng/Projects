import { motion, AnimatePresence } from 'framer-motion';
import { MdCheckCircle, MdError, MdInfo, MdClose } from 'react-icons/md';
import { useToastStore } from '../../store/useToastStore';

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <MdCheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <MdError className="w-5 h-5 text-red-500" />;
      default:
        return <MdInfo className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`
              flex items-center gap-3 px-4 py-3 
              rounded-lg border shadow-lg
              min-w-[280px] max-w-[400px]
              ${getBgColor(toast.type)}
            `}
          >
            {getIcon(toast.type)}
            <span className="flex-1 text-sm text-text-primary font-medium">
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <MdClose className="w-4 h-4 text-text-secondary" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
