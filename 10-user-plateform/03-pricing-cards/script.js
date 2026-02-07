// ===== Pricing Cards JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    const billingToggle = document.getElementById('billing-toggle');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    const priceAmounts = document.querySelectorAll('.amount');
    const periodTexts = document.querySelectorAll('.period-text');
    
    let isYearly = false;

    // Initialize
    updateActiveLabel();

    // Toggle billing period
    billingToggle.addEventListener('click', () => {
        isYearly = !isYearly;
        billingToggle.classList.toggle('active', isYearly);
        billingToggle.setAttribute('aria-pressed', isYearly);
        
        updatePrices();
        updateActiveLabel();
    });

    function updateActiveLabel() {
        toggleLabels.forEach(label => {
            const billing = label.dataset.billing;
            if ((billing === 'yearly' && isYearly) || (billing === 'monthly' && !isYearly)) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }

    function updatePrices() {
        priceAmounts.forEach(amount => {
            const monthlyPrice = parseInt(amount.dataset.monthly);
            const yearlyPrice = parseInt(amount.dataset.yearly);
            const newPrice = isYearly ? yearlyPrice : monthlyPrice;
            
            // Add animation class
            amount.classList.add('changing');
            
            setTimeout(() => {
                amount.textContent = newPrice;
                amount.classList.remove('changing');
                amount.classList.add('animate');
                
                setTimeout(() => {
                    amount.classList.remove('animate');
                }, 300);
            }, 150);
        });

        // Update period text
        periodTexts.forEach(text => {
            text.textContent = isYearly ? 'year' : 'month';
        });
    }

    // Keyboard accessibility for toggle
    billingToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            billingToggle.click();
        }
    });

    // Add hover effect to cards
    const cards = document.querySelectorAll('.pricing-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => {
                if (c !== card && !c.classList.contains('popular')) {
                    c.style.opacity = '0.7';
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            cards.forEach(c => {
                c.style.opacity = '1';
            });
        });
    });

    // Button click handlers
    const planButtons = document.querySelectorAll('.plan-button');
    
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.pricing-card');
            const planName = card.querySelector('.plan-name').textContent;
            const price = card.querySelector('.amount').textContent;
            const period = isYearly ? 'year' : 'month';
            
            // Show selection feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<span>✓ Selected!</span>';
            this.style.background = 'var(--secondary)';
            this.style.color = 'white';
            this.style.borderColor = 'var(--secondary)';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
                this.style.color = '';
                this.style.borderColor = '';
                
                alert(`You selected the ${planName} plan at $${price}/${period}. This is a demo!`);
            }, 800);
        });
    });

    // Intersection Observer for card animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = entry.target.classList.contains('popular') 
                        ? 'scale(1.05)' 
                        : 'translateY(0)';
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));

    // FAQ items animation
    const faqItems = document.querySelectorAll('.faq-item');
    const faqObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                
                faqObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    faqItems.forEach(item => faqObserver.observe(item));
});
