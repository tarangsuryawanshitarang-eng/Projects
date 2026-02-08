// ===== Testimonial Slider JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sliderTrack = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('slider-dots');
    const autoplayToggle = document.getElementById('autoplay-toggle');
    const playIcon = autoplayToggle.querySelector('.play-icon');
    const pauseIcon = autoplayToggle.querySelector('.pause-icon');

    let currentIndex = 0;
    let isAutoPlaying = true;
    let autoplayInterval;
    const autoplayDelay = 5000;

    // Initialize
    function init() {
        createDots();
        updateSlider();
        startAutoplay();
        
        // Set first slide as active
        slides[0].classList.add('active');
    }

    // Create pagination dots
    function createDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    // Update slider position
    function updateSlider() {
        // Update track position
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active states
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
        
        // Reset autoplay timer on manual interaction
        if (isAutoPlaying) {
            stopAutoplay();
            startAutoplay();
        }
    }

    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    }

    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    }

    // Autoplay functions
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
        isAutoPlaying = true;
        autoplayToggle.classList.add('playing');
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
        isAutoPlaying = false;
        autoplayToggle.classList.remove('playing');
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }

    function toggleAutoplay() {
        if (isAutoPlaying) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    }

    // Event Listeners
    prevBtn.addEventListener('click', () => {
        prevSlide();
        if (isAutoPlaying) {
            stopAutoplay();
            startAutoplay();
        }
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        if (isAutoPlaying) {
            stopAutoplay();
            startAutoplay();
        }
    });

    autoplayToggle.addEventListener('click', toggleAutoplay);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            if (isAutoPlaying) {
                stopAutoplay();
                startAutoplay();
            }
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            if (isAutoPlaying) {
                stopAutoplay();
                startAutoplay();
            }
        }
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;

    sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isSwiping = true;
    }, { passive: true });

    sliderTrack.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        touchEndX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderTrack.addEventListener('touchend', () => {
        if (!isSwiping) return;
        isSwiping = false;
        
        const diff = touchStartX - touchEndX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            
            if (isAutoPlaying) {
                stopAutoplay();
                startAutoplay();
            }
        }
    });

    // Pause autoplay when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (isAutoPlaying) {
                clearInterval(autoplayInterval);
            }
        } else {
            if (isAutoPlaying) {
                startAutoplay();
            }
        }
    });

    // Pause on hover (optional)
    const sliderContainer = document.querySelector('.slider-container');
    
    sliderContainer.addEventListener('mouseenter', () => {
        if (isAutoPlaying) {
            clearInterval(autoplayInterval);
        }
    });

    sliderContainer.addEventListener('mouseleave', () => {
        if (isAutoPlaying) {
            autoplayInterval = setInterval(nextSlide, autoplayDelay);
        }
    });

    // Initialize slider
    init();

    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const numMatch = text.match(/[\d.]+/);
                    if (numMatch) {
                        const num = parseFloat(numMatch[0]);
                        const suffix = text.replace(numMatch[0], '');
                        const isDecimal = text.includes('.');
                        
                        animateNumber(stat, num, suffix, isDecimal);
                    }
                });
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateNumber(element, target, suffix, isDecimal) {
        const duration = 2000;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = target * eased;
            
            element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
            }
        };
        
        requestAnimationFrame(update);
    }
});
