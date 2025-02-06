// Gallery Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Gallery Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 500);
                }
            });
        });
    });

    // Lightbox Functionality
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    document.body.appendChild(lightbox);

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            
            lightbox.innerHTML = '';
            lightbox.appendChild(lightboxImg);
            lightbox.classList.add('active');
        });
    });

    lightbox.addEventListener('click', function() {
        this.classList.remove('active');
    });

    // Lazy Loading for Images
    const lazyLoadImages = () => {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        const imgs = document.querySelectorAll('img.lazy');
        imgs.forEach(img => imageObserver.observe(img));
    };

    lazyLoadImages();

    // Masonry Layout Effect
    const updateLayout = () => {
        const grid = document.querySelector('.gallery-grid');
        const items = Array.from(grid.children);
        const getGridAutoRows = () => {
            const style = window.getComputedStyle(grid);
            return parseInt(style.gridAutoRows);
        };

        const rowGap = parseInt(window.getComputedStyle(grid).rowGap);
        const rowHeight = getGridAutoRows();

        items.forEach(item => {
            const rowSpan = Math.ceil(
                (item.querySelector('.gallery-item').getBoundingClientRect().height + rowGap) /
                (rowHeight + rowGap)
            );
            item.style.gridRowEnd = `span ${rowSpan}`;
        });
    };

    window.addEventListener('load', updateLayout);
    window.addEventListener('resize', updateLayout);
});