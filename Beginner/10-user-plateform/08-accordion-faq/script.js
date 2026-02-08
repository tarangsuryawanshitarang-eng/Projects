// ===== Accordion FAQ JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const accordionItems = document.querySelectorAll('.accordion-item');
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    const searchInput = document.getElementById('faq-search');
    const searchClear = document.getElementById('search-clear');
    const expandAllBtn = document.getElementById('expand-all');
    const collapseAllBtn = document.getElementById('collapse-all');
    const noResults = document.getElementById('no-results');
    const sections = document.querySelectorAll('.accordion-section');

    // Toggle single accordion
    function toggleAccordion(item) {
        const isOpen = item.classList.contains('open');
        const trigger = item.querySelector('.accordion-trigger');
        
        if (isOpen) {
            item.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        } else {
            item.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
        }
    }

    // Event listeners for accordion triggers
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            toggleAccordion(item);
        });

        // Keyboard accessibility
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const item = trigger.closest('.accordion-item');
                toggleAccordion(item);
            }
        });
    });

    // Expand all
    expandAllBtn.addEventListener('click', () => {
        accordionItems.forEach(item => {
            if (!item.classList.contains('hidden')) {
                item.classList.add('open');
                item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Collapse all
    collapseAllBtn.addEventListener('click', () => {
        accordionItems.forEach(item => {
            item.classList.remove('open');
            item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        });
    });

    // Search functionality
    function performSearch(query) {
        query = query.toLowerCase().trim();
        let hasResults = false;

        // Clear previous highlights
        document.querySelectorAll('.highlight').forEach(el => {
            el.outerHTML = el.textContent;
        });

        if (!query) {
            // Show all items when search is empty
            accordionItems.forEach(item => {
                item.classList.remove('hidden');
            });
            sections.forEach(section => {
                section.classList.remove('hidden');
            });
            noResults.classList.add('hidden');
            searchClear.classList.add('hidden');
            return;
        }

        searchClear.classList.remove('hidden');

        // Search through items
        accordionItems.forEach(item => {
            const questionText = item.querySelector('.trigger-text').textContent.toLowerCase();
            const answerText = item.querySelector('.content-inner').textContent.toLowerCase();
            const fullText = questionText + ' ' + answerText;

            if (fullText.includes(query)) {
                item.classList.remove('hidden');
                hasResults = true;

                // Highlight matches in question
                highlightText(item.querySelector('.trigger-text'), query);
                
                // Open item if it has a match
                item.classList.add('open');
                item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'true');
            } else {
                item.classList.add('hidden');
                item.classList.remove('open');
                item.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
            }
        });

        // Hide empty sections
        sections.forEach(section => {
            const visibleItems = section.querySelectorAll('.accordion-item:not(.hidden)');
            if (visibleItems.length === 0) {
                section.classList.add('hidden');
            } else {
                section.classList.remove('hidden');
            }
        });

        // Show no results message
        if (hasResults) {
            noResults.classList.add('hidden');
        } else {
            noResults.classList.remove('hidden');
        }
    }

    // Highlight matching text
    function highlightText(element, query) {
        const text = element.textContent;
        const lowerText = text.toLowerCase();
        const startIndex = lowerText.indexOf(query);

        if (startIndex !== -1) {
            const before = text.substring(0, startIndex);
            const match = text.substring(startIndex, startIndex + query.length);
            const after = text.substring(startIndex + query.length);
            element.innerHTML = `${before}<span class="highlight">${match}</span>${after}`;
        }
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Search input event listener (debounced)
    const debouncedSearch = debounce((e) => {
        performSearch(e.target.value);
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);

    // Clear search
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        performSearch('');
        searchInput.focus();
    });

    // Keyboard shortcut for search
    document.addEventListener('keydown', (e) => {
        // Focus search on /
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        
        // Clear search on Escape
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            performSearch('');
            searchInput.blur();
        }
    });

    // Intersection Observer for animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });

    // Initialize - make first section visible
    setTimeout(() => {
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
});
