import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  // State
  toasts: [],
  
  // Actions
  addToast: (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type, duration };
    
    set((state) => ({
      toasts: [...state.toasts, toast]
    }));
    
    // Auto-dismiss after duration
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
    
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  },
  
  // Convenience methods
  success: (message, duration) => {
    return get().addToast(message, 'success', duration);
  },
  
  error: (message, duration) => {
    return get().addToast(message, 'error', duration);
  },
  
  info: (message, duration) => {
    return get().addToast(message, 'info', duration);
  },
  
  clearAll: () => {
    set({ toasts: [] });
  }
}));
