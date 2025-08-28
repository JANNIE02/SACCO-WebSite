// Academics Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab Switching Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const levelContents = document.querySelectorAll('.level-content');

    function switchTab(targetLevel) {
        // Remove active class from all buttons and content
        tabButtons.forEach(btn => btn.classList.remove('active'));
        levelContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });

        // Add active class to clicked button and show corresponding content
        const activeButton = document.querySelector(`[data-level="${targetLevel}"]`);
        const activeContent = document.getElementById(targetLevel);

        if (activeButton && activeContent) {
            activeButton.classList.add('active');
            activeContent.style.display = 'block';
            // Add fade-in animation
            setTimeout(() => {
                activeContent.classList.add('active');
            }, 50);
        }
    }

    // Event listeners for tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            switchTab(level);
        });
    });

    // Initialize with first tab active
    if (tabButtons.length > 0) {
        const firstTab = tabButtons[0].getAttribute('data-level');
        switchTab(firstTab);
    }

    // Subject Card Hover Effects
    const subjectCards = document.querySelectorAll('.subject-card');
    
    subjectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Activity Cards Image Loading
    const activityCards = document.querySelectorAll('.activity-card img');
    
    activityCards.forEach(img => {
        img.addEventListener('load', function() {
            this.parentElement.classList.add('loaded');
        });

        img.addEventListener('error', function() {
            // Replace broken images with a placeholder
            this.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
        });
    });

    // Smooth Scroll for Navigation
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Results Tabs
    const resultsTabs = document.querySelectorAll('.results-tab');
    const resultsContents = document.querySelectorAll('.results-content');

    resultsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            resultsTabs.forEach(t => t.classList.remove('active'));
            resultsContents.forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const target = tab.getAttribute('data-target');
            const targetContent = document.querySelector(`.results-content[data-content="${target}"]`);
            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
            }
        });
    });

    // Performance Tabs
    const performanceTabs = document.querySelectorAll('.performance-tab');
    const performanceContents = document.querySelectorAll('.performance-content');

    performanceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            performanceTabs.forEach(t => t.classList.remove('active'));
            performanceContents.forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding content
            const target = tab.getAttribute('data-target');
            const targetContent = document.querySelector(`.performance-content[data-content="${target}"]`);
            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
            }
        });
    });
});