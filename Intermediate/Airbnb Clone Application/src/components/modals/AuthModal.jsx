import { useState } from 'react';
import { FaGoogle, FaApple } from 'react-icons/fa';
import Modal from '../ui/Modal';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';

const AuthModal = () => {
  const {
    showAuthModal,
    authView,
    closeModal,
    switchToLogin,
    switchToSignup,
    login
  } = useAuthStore();
  const { success, error } = useToastStore();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (authView === 'signup') {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userName = authView === 'signup' 
      ? formData.firstName 
      : formData.email.split('@')[0];

    login({
      name: userName,
      email: formData.email
    });

    success(`Welcome, ${userName}!`);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({ firstName: '', lastName: '', email: '', password: '' });
    setErrors({});
  };

  const handleClose = () => {
    closeModal();
    setFormData({ firstName: '', lastName: '', email: '', password: '' });
    setErrors({});
  };

  const title = authView === 'login' ? 'Log in' : 'Sign up';

  return (
    <Modal
      isOpen={showAuthModal}
      onClose={handleClose}
      title={title}
      size="sm"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Welcome to Airbnb</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Signup Name Fields */}
          {authView === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1
                    ${errors.firstName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-border focus:ring-text-primary'
                    }
                  `}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1
                    ${errors.lastName 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-border focus:ring-text-primary'
                    }
                  `}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1
                ${errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-border focus:ring-text-primary'
                }
              `}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1
                ${errors.password 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-border focus:ring-text-primary'
                }
              `}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-airbnb hover:bg-airbnb-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Please wait...' : title}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-text-secondary">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-3 py-3 border border-text-primary rounded-lg hover:bg-bg-gray transition-colors font-medium">
            <FaGoogle className="w-5 h-5 text-[#4285F4]" />
            Continue with Google
          </button>
          <button className="w-full flex items-center justify-center gap-3 py-3 border border-text-primary rounded-lg hover:bg-bg-gray transition-colors font-medium">
            <FaApple className="w-5 h-5" />
            Continue with Apple
          </button>
        </div>

        {/* Toggle Link */}
        <p className="text-center mt-6 text-sm">
          {authView === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={switchToSignup}
                className="font-semibold underline hover:text-text-secondary"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={switchToLogin}
                className="font-semibold underline hover:text-text-secondary"
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </Modal>
  );
};

export default AuthModal;
