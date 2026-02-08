// ===== Dashboard Cards JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const refreshBtn = document.getElementById('refresh-btn');
    const currentDate = document.getElementById('current-date');
    const statNumbers = document.querySelectorAll('.card-value .number');
    const bars = document.querySelectorAll('.bar');
    const chartTabs = document.querySelectorAll('.chart-tab');

    // Set current date
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    currentDate.textContent = now.toLocaleDateString('en-US', options);

    // Mobile menu toggle
    let sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
    });

    // Animated counter
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    // Initialize mini charts
    function createMiniCharts() {
        const chartData = {
            'revenue-chart': [30, 45, 60, 35, 70, 55, 80],
            'users-chart': [40, 35, 50, 45, 60, 75, 65],
            'orders-chart': [20, 45, 35, 60, 40, 55, 70]
        };

        Object.entries(chartData).forEach(([chartId, data]) => {
            const chart = document.getElementById(chartId);
            if (chart) {
                chart.innerHTML = '';
                data.forEach((value, i) => {
                    const bar = document.createElement('div');
                    bar.className = 'mini-bar';
                    bar.style.height = '0%';
                    bar.style.transitionDelay = `${i * 50}ms`;
                    chart.appendChild(bar);
                    
                    setTimeout(() => {
                        bar.style.height = `${value}%`;
                    }, 100);
                });
            }
        });
    }

    // Animate progress ring
    function animateProgressRing() {
        const ring = document.querySelector('.ring-progress');
        if (ring) {
            const circumference = 2 * Math.PI * 40; // r=40
            const percent = 64; // conversion rate percentage
            const offset = circumference - (percent / 100) * circumference;
            
            // Create gradient definition
            const svg = ring.closest('svg');
            if (svg && !svg.querySelector('defs')) {
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                defs.innerHTML = `
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#EC4899"/>
                        <stop offset="100%" stop-color="#BE185D"/>
                    </linearGradient>
                `;
                svg.insertBefore(defs, svg.firstChild);
            }
            
            setTimeout(() => {
                ring.style.strokeDashoffset = offset;
            }, 500);
        }
    }

    // Animate bar chart
    function animateBarChart() {
        bars.forEach((bar, index) => {
            // Set the CSS variable from data-value if not already set
            if (!bar.style.getPropertyValue('--value')) {
                const value = bar.dataset.value;
                bar.style.setProperty('--value', `${value}%`);
            }
            
            setTimeout(() => {
                bar.classList.add('animate');
            }, 100 + (index * 100));
        });
    }

    // Intersection Observer for stat cards
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate numbers
                statNumbers.forEach(numEl => {
                    const target = parseInt(numEl.dataset.target);
                    animateCounter(numEl, target, 2000);
                });
                
                // Initialize mini charts
                createMiniCharts();
                
                // Animate progress ring
                animateProgressRing();
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        statsObserver.observe(statsGrid);
    }

    // Observer for bar chart
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateBarChart();
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const chartContainer = document.getElementById('main-chart');
    if (chartContainer) {
        chartObserver.observe(chartContainer);
    }

    // Chart tabs
    chartTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            chartTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Animate bars with new random data
            bars.forEach(bar => {
                bar.classList.remove('animate');
                const newValue = Math.floor(Math.random() * 60) + 30;
                bar.style.setProperty('--value', `${newValue}%`);
                bar.dataset.value = newValue;
            });
            
            setTimeout(animateBarChart, 100);
        });
    });

    // Refresh button
    refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('spinning');
        
        // Reset and re-animate everything
        statNumbers.forEach(numEl => {
            numEl.textContent = '0';
        });
        
        bars.forEach(bar => {
            bar.classList.remove('animate');
        });
        
        const ring = document.querySelector('.ring-progress');
        if (ring) {
            ring.style.strokeDashoffset = '251.2';
        }
        
        setTimeout(() => {
            statNumbers.forEach(numEl => {
                // Generate slightly different numbers
                const baseTarget = parseInt(numEl.dataset.target);
                const variance = Math.floor(baseTarget * 0.1);
                const newTarget = baseTarget + Math.floor(Math.random() * variance * 2) - variance;
                animateCounter(numEl, newTarget, 2000);
            });
            
            createMiniCharts();
            animateProgressRing();
            animateBarChart();
            
            refreshBtn.classList.remove('spinning');
        }, 500);
    });

    // Activity items animation
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach((item, index) => {
        // Use classes for animation instead of inline for cleaner code
        item.classList.add('ready');
        
        setTimeout(() => {
            item.classList.add('visible');
        }, 200 + (index * 100));
    });
});
