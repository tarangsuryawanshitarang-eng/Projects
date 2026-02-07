// ===== Modal Components JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('[data-close]');
    const confirmBtn = document.getElementById('confirm-btn');
    const retryBtn = document.getElementById('retry-btn');
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');

    // Open modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset animations
        const animatedIcon = modal.querySelector('.modal-icon.animated');
        if (animatedIcon) {
            animatedIcon.style.animation = 'none';
            animatedIcon.offsetHeight; // Trigger reflow
            animatedIcon.style.animation = '';
        }

        const shakeIcon = modal.querySelector('.modal-icon.shake');
        if (shakeIcon) {
            shakeIcon.style.animation = 'none';
            shakeIcon.offsetHeight;
            shakeIcon.style.animation = '';
        }

        const checkAnimation = modal.querySelector('.check-animation');
        if (checkAnimation) {
            checkAnimation.style.animation = 'none';
            checkAnimation.offsetHeight;
            checkAnimation.style.animation = '';
        }

        // Focus first focusable element
        setTimeout(() => {
            const focusable = modal.querySelector('button, input, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable) focusable.focus();
        }, 100);

        // Trap focus
        trapFocus(modal);
    }

    // Close modal
    function closeModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to trigger
        const trigger = document.querySelector(`[data-modal="${modal.id}"]`);
        if (trigger) trigger.focus();
    }

    // Close all modals
    function closeAllModals() {
        modals.forEach(modal => closeModal(modal));
    }

    // Trap focus within modal
    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    }

    // Event Listeners for triggers
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modal;
            openModal(modalId);
        });
    });

    // Event listeners for close buttons
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Close on overlay click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    // Confirm button action
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const modal = document.getElementById('confirm-modal');
            closeModal(modal);
            showToast('Action confirmed successfully!', 'success');
        });
    }

    // Retry button action
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            const modal = document.getElementById('error-modal');
            closeModal(modal);
            showToast('Retrying action...', 'info');
            
            // Simulate retry
            setTimeout(() => {
                showToast('Action completed successfully!', 'success');
            }, 1500);
        });
    }

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Simple validation
            if (!name || !email || !message) {
                showToast('Please fill in all fields', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            setTimeout(() => {
                const modal = document.getElementById('form-modal');
                closeModal(modal);
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                showToast('Message sent successfully!', 'success');
            }, 1500);
        });
    }

    // Toast notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);

        // Remove after delay
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Add animation on card hover
    const showcaseCards = document.querySelectorAll('.showcase-card');
    showcaseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.card-icon');
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.card-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Intersection Observer for card animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    showcaseCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});
