// ===== Signup Form JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('signup-form');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const termsCheckbox = document.getElementById('terms');
    const submitBtn = document.getElementById('submit-btn');
    const successMessage = document.getElementById('success-message');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');

    // Validation state
    const validationState = {
        fullname: false,
        email: false,
        password: false,
        confirmPassword: false,
        terms: false
    };

    // Validation patterns
    const patterns = {
        fullname: /^[a-zA-Z\s]{2,}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: {
            minLength: 8,
            hasUppercase: /[A-Z]/,
            hasLowercase: /[a-z]/,
            hasNumber: /[0-9]/,
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/
        }
    };

    // Initialize floating labels
    [fullnameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        if (input.value) {
            input.classList.add('has-value');
        }
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const eyeOpen = this.querySelector('.eye-open');
            const eyeClosed = this.querySelector('.eye-closed');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeOpen.classList.add('hidden');
                eyeClosed.classList.remove('hidden');
            } else {
                input.type = 'password';
                eyeOpen.classList.remove('hidden');
                eyeClosed.classList.add('hidden');
            }
        });
    });

    // Validation functions
    function validateFullname(value) {
        const isValid = patterns.fullname.test(value.trim());
        const errorEl = document.getElementById('fullname-error');
        
        if (!value.trim()) {
            showError(fullnameInput, errorEl, 'Full name is required');
            return false;
        } else if (!isValid) {
            showError(fullnameInput, errorEl, 'Enter a valid name (letters only, min 2 characters)');
            return false;
        }
        
        showSuccess(fullnameInput, errorEl);
        return true;
    }

    function validateEmail(value) {
        const isValid = patterns.email.test(value.trim());
        const errorEl = document.getElementById('email-error');
        
        if (!value.trim()) {
            showError(emailInput, errorEl, 'Email is required');
            return false;
        } else if (!isValid) {
            showError(emailInput, errorEl, 'Please enter a valid email address');
            return false;
        }
        
        showSuccess(emailInput, errorEl);
        return true;
    }

    function validatePassword(value) {
        const errorEl = document.getElementById('password-error');
        const strength = calculatePasswordStrength(value);
        
        updateStrengthMeter(strength);
        
        if (!value) {
            showError(passwordInput, errorEl, 'Password is required');
            return false;
        } else if (value.length < 8) {
            showError(passwordInput, errorEl, 'Password must be at least 8 characters');
            return false;
        } else if (strength.score < 2) {
            showError(passwordInput, errorEl, 'Password is too weak');
            return false;
        }
        
        showSuccess(passwordInput, errorEl);
        
        // Re-validate confirm password if it has a value
        if (confirmPasswordInput.value) {
            validationState.confirmPassword = validateConfirmPassword(confirmPasswordInput.value);
        }
        
        return true;
    }

    function validateConfirmPassword(value) {
        const errorEl = document.getElementById('confirm-password-error');
        
        if (!value) {
            showError(confirmPasswordInput, errorEl, 'Please confirm your password');
            return false;
        } else if (value !== passwordInput.value) {
            showError(confirmPasswordInput, errorEl, 'Passwords do not match');
            return false;
        }
        
        showSuccess(confirmPasswordInput, errorEl);
        return true;
    }

    function validateTerms() {
        const errorEl = document.getElementById('terms-error');
        
        if (!termsCheckbox.checked) {
            errorEl.textContent = 'You must agree to the terms';
            errorEl.classList.add('visible');
            return false;
        }
        
        errorEl.classList.remove('visible');
        return true;
    }

    // Helper functions
    function showError(input, errorEl, message) {
        input.classList.remove('valid');
        input.classList.add('invalid');
        input.setAttribute('aria-invalid', 'true');
        errorEl.textContent = message;
        errorEl.classList.add('visible');
    }

    function showSuccess(input, errorEl) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        input.setAttribute('aria-invalid', 'false');
        errorEl.classList.remove('visible');
    }

    function calculatePasswordStrength(password) {
        let score = 0;
        const feedback = [];

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (patterns.password.hasUppercase.test(password)) score++;
        if (patterns.password.hasLowercase.test(password)) score++;
        if (patterns.password.hasNumber.test(password)) score++;
        if (patterns.password.hasSpecial.test(password)) score++;

        let level = 'weak';
        if (score >= 5) level = 'strong';
        else if (score >= 4) level = 'good';
        else if (score >= 3) level = 'fair';
        else level = 'weak';

        return { score, level };
    }

    function updateStrengthMeter(strength) {
        strengthFill.className = 'strength-fill ' + strength.level;
        strengthText.className = 'strength-text ' + strength.level;
        
        const labels = {
            weak: 'Weak',
            fair: 'Fair',
            good: 'Good',
            strong: 'Strong'
        };
        
        strengthText.textContent = labels[strength.level];
    }

    function updateSubmitButton() {
        const allValid = Object.values(validationState).every(v => v === true);
        submitBtn.disabled = !allValid;
    }

    // Event listeners
    fullnameInput.addEventListener('blur', () => {
        validationState.fullname = validateFullname(fullnameInput.value);
        updateSubmitButton();
    });

    fullnameInput.addEventListener('input', () => {
        if (fullnameInput.classList.contains('invalid') || fullnameInput.classList.contains('valid')) {
            validationState.fullname = validateFullname(fullnameInput.value);
            updateSubmitButton();
        }
    });

    emailInput.addEventListener('blur', () => {
        validationState.email = validateEmail(emailInput.value);
        updateSubmitButton();
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('invalid') || emailInput.classList.contains('valid')) {
            validationState.email = validateEmail(emailInput.value);
            updateSubmitButton();
        }
    });

    passwordInput.addEventListener('input', () => {
        validationState.password = validatePassword(passwordInput.value);
        updateSubmitButton();
    });

    passwordInput.addEventListener('blur', () => {
        validationState.password = validatePassword(passwordInput.value);
        updateSubmitButton();
    });

    confirmPasswordInput.addEventListener('blur', () => {
        validationState.confirmPassword = validateConfirmPassword(confirmPasswordInput.value);
        updateSubmitButton();
    });

    confirmPasswordInput.addEventListener('input', () => {
        if (confirmPasswordInput.classList.contains('invalid') || confirmPasswordInput.classList.contains('valid')) {
            validationState.confirmPassword = validateConfirmPassword(confirmPasswordInput.value);
            updateSubmitButton();
        }
    });

    termsCheckbox.addEventListener('change', () => {
        validationState.terms = validateTerms();
        updateSubmitButton();
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        validationState.fullname = validateFullname(fullnameInput.value);
        validationState.email = validateEmail(emailInput.value);
        validationState.password = validatePassword(passwordInput.value);
        validationState.confirmPassword = validateConfirmPassword(confirmPasswordInput.value);
        validationState.terms = validateTerms();
        
        updateSubmitButton();
        
        if (!Object.values(validationState).every(v => v === true)) {
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        form.classList.add('hidden');
        document.querySelector('.form-footer').classList.add('hidden');
        successMessage.classList.add('visible');
    });
});
