// Modern Gallery JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentFilter = 'all';
    
    // Add loading state to images
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        item.classList.add('loading');
        
        img.onload = () => {
            item.classList.remove('loading');
            item.style.opacity = '1';
        };
        
        img.onerror = () => {
            item.classList.remove('loading');
            img.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
        };
    });

    // Smooth filter transitions
    function filterGallery(category) {
        currentFilter = category;
        
        galleryItems.forEach(item => {
            const matches = category === 'all' || item.getAttribute('data-category') === category;
            
            if (matches) {
                item.style.display = 'block';
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                });
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    if (currentFilter !== 'all' && item.getAttribute('data-category') !== currentFilter) {
                        item.style.display = 'none';
                    }
                }, 400);
            }
        });
    }

    // Filter button click handlers
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            filterGallery(this.getAttribute('data-filter'));
        });
    });

    // Enhanced Lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    document.body.appendChild(lightbox);

    let currentImageIndex = 0;
    const images = Array.from(galleryItems);

    function showImage(index) {
        const item = images[index];
        const img = item.querySelector('img');
        const caption = item.querySelector('.overlay h3')?.textContent;
        const description = item.querySelector('.overlay p')?.textContent;

        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img src="${img.src}" alt="${img.alt || caption}">
                ${caption ? `
                    <div class="lightbox-caption">
                        <h3>${caption}</h3>
                        ${description ? `<p>${description}</p>` : ''}
                    </div>
                ` : ''}
            </div>
        `;

        requestAnimationFrame(() => lightbox.classList.add('active'));
    }

    // Gallery item click handlers
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            currentImageIndex = index;
            showImage(currentImageIndex);
            document.body.style.overflow = 'hidden';
        });
    });

    // Lightbox navigation and close
    lightbox.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox-close') || e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
                break;
            case 'ArrowLeft':
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                showImage(currentImageIndex);
                break;
            case 'ArrowRight':
                currentImageIndex = (currentImageIndex + 1) % images.length;
                showImage(currentImageIndex);
                break;
        }
    });

    // Preload adjacent images
    function preloadImage(src) {
        const img = new Image();
        img.src = src;
    }

    function preloadAdjacentImages(index) {
        const prev = (index - 1 + images.length) % images.length;
        const next = (index + 1) % images.length;
        
        preloadImage(images[prev].querySelector('img').src);
        preloadImage(images[next].querySelector('img').src);
    }

    // Initialize with all images visible
    filterGallery('all');
});