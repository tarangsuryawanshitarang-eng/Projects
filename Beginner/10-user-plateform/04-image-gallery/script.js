// ===== Image Gallery JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxLoader = document.querySelector('.lightbox-loader');

    let currentFilter = 'all';
    let currentIndex = 0;
    let filteredItems = [];

    // Initialize
    updateFilteredItems();

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            // Filter items
            currentFilter = filter;
            filterGallery(filter);
            updateFilteredItems();
        });
    });

    function filterGallery(filter) {
        galleryItems.forEach(item => {
            const category = item.dataset.category;
            
            if (filter === 'all' || category === filter) {
                item.classList.remove('fade-out');
                item.classList.remove('hidden');
                setTimeout(() => item.classList.add('fade-in'), 10);
            } else {
                item.classList.add('fade-out');
                setTimeout(() => {
                    item.classList.add('hidden');
                    item.classList.remove('fade-in');
                }, 300);
            }
        });
    }

    function updateFilteredItems() {
        filteredItems = Array.from(galleryItems).filter(item => {
            if (currentFilter === 'all') return true;
            return item.dataset.category === currentFilter;
        });
    }

    // Lightbox functionality
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('hidden')) return;
            openLightbox(item);
        });
    });

    function openLightbox(item) {
        const img = item.querySelector('img');
        const title = item.querySelector('.item-overlay h3').textContent;
        
        currentIndex = filteredItems.indexOf(item);
        
        showImage(img.src, title);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        updateNavigation();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showImage(src, title) {
        lightboxLoader.classList.remove('hidden');
        lightboxImage.style.opacity = '0';
        
        // Create new image to preload
        const newImg = new Image();
        newImg.onload = () => {
            lightboxImage.src = src;
            lightboxImage.alt = title;
            lightboxTitle.textContent = title;
            lightboxCounter.textContent = `${currentIndex + 1} of ${filteredItems.length}`;
            lightboxLoader.classList.add('hidden');
            lightboxImage.style.opacity = '1';
        };
        newImg.src = src;
    }

    function showPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            const item = filteredItems[currentIndex];
            const img = item.querySelector('img');
            const title = item.querySelector('.item-overlay h3').textContent;
            showImage(img.src, title);
            updateNavigation();
        }
    }

    function showNext() {
        if (currentIndex < filteredItems.length - 1) {
            currentIndex++;
            const item = filteredItems[currentIndex];
            const img = item.querySelector('img');
            const title = item.querySelector('.item-overlay h3').textContent;
            showImage(img.src, title);
            updateNavigation();
        }
    }

    function updateNavigation() {
        lightboxPrev.disabled = currentIndex === 0;
        lightboxNext.disabled = currentIndex === filteredItems.length - 1;
    }

    // Event Listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevious);
    lightboxNext.addEventListener('click', showNext);

    // Click outside to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevious();
                break;
            case 'ArrowRight':
                showNext();
                break;
        }
    });

    // Touch/Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                showNext();
            } else {
                // Swipe right - previous
                showPrevious();
            }
        }
    }

    // Preload adjacent images
    function preloadAdjacentImages() {
        const prevIndex = currentIndex - 1;
        const nextIndex = currentIndex + 1;

        if (prevIndex >= 0) {
            const prevImg = new Image();
            prevImg.src = filteredItems[prevIndex].querySelector('img').src;
        }

        if (nextIndex < filteredItems.length) {
            const nextImg = new Image();
            nextImg.src = filteredItems[nextIndex].querySelector('img').src;
        }
    }

    // Intersection Observer for lazy loading animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, observerOptions);

    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px) scale(0.95)';
        observer.observe(item);
    });
});
