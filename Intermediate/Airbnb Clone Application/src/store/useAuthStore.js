import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  // State
  isAuthenticated: false,
  user: null,
  showAuthModal: false,
  authView: 'login', // 'login' | 'signup'
  
  // Actions
  login: (userData) => {
    set({
      isAuthenticated: true,
      user: userData,
      showAuthModal: false
    });
  },
  
  logout: () => {
    set({
      isAuthenticated: false,
      user: null
    });
  },
  
  openLogin: () => {
    set({
      showAuthModal: true,
      authView: 'login'
    });
  },
  
  openSignup: () => {
    set({
      showAuthModal: true,
      authView: 'signup'
    });
  },
  
  closeModal: () => {
    set({
      showAuthModal: false
    });
  },
  
  switchToLogin: () => {
    set({ authView: 'login' });
  },
  
  switchToSignup: () => {
    set({ authView: 'signup' });
  }
}));
