// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('backToTop');

    // Mobile navigation toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Back to top functionality
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Active navigation link
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form functionality
    const contactForm = document.getElementById('contactForm');
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');

    // Character counter for message textarea
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            if (count > 500) {
                charCount.style.color = 'var(--color-error)';
            } else {
                charCount.style.color = 'var(--color-text-light)';
            }
        });
    }

    // Form validation and submission
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.btn-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            // Show loading state
            btnText.classList.add('hidden');
            btnLoading.classList.add('show');
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handling)
            try {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                alert('Thank you for your message! We\'ll get back to you soon.');
                this.reset();
                charCount.textContent = '0';
                
            } catch (error) {
                alert('Sorry, there was an error sending your message. Please try again.');
            } finally {
                // Hide loading state
                btnText.classList.remove('hidden');
                btnLoading.classList.remove('show');
                submitBtn.disabled = false;
            }
        });
    }

    // Gallery image modal (optional enhancement)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('.gallery-image');
            if (img) {
                // You can implement a modal here to show larger images
                console.log('Gallery item clicked:', img.src);
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.about-card, .feature-card, .gallery-item, .impact-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Image Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...

    // Image Modal Setup
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalBadges = document.getElementById('modalBadges');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const modalLoading = document.querySelector('.modal-loading');

    let currentImageIndex = 0;
    let galleryImages = [];

    // Collect all gallery images
    function initializeGallery() {
        galleryImages = Array.from(document.querySelectorAll('.gallery-image')).map((img, index) => {
            const galleryItem = img.closest('.gallery-item');
            const overlayContent = galleryItem.querySelector('.overlay-content');
            const badges = galleryItem.querySelectorAll('.badge');
            
            return {
                src: img.src,
                alt: img.alt,
                title: overlayContent ? overlayContent.querySelector('h4').textContent : img.alt,
                description: overlayContent ? overlayContent.querySelector('p').textContent : '',
                badges: Array.from(badges).map(badge => badge.textContent),
                index: index
            };
        });
    }

    // Open modal with specific image
    function openModal(imageData, index) {
        currentImageIndex = index;
        
        // Show modal
        imageModal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Show loading
        modalLoading.style.display = 'flex';
        modalImage.classList.remove('loaded');
        
        // Load image
        const img = new Image();
        img.onload = function() {
            modalImage.src = imageData.src;
            modalImage.alt = imageData.alt;
            modalTitle.textContent = imageData.title;
            modalDescription.textContent = imageData.description;
            
            // Add badges
            modalBadges.innerHTML = '';
            imageData.badges.forEach(badgeText => {
                const badge = document.createElement('span');
                badge.className = 'badge';
                badge.textContent = badgeText;
                modalBadges.appendChild(badge);
            });
            
            // Hide loading and show image
            setTimeout(() => {
                modalLoading.style.display = 'none';
                modalImage.classList.add('loaded');
            }, 300);
        };
        
        img.onerror = function() {
            modalLoading.style.display = 'none';
            modalImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
            modalImage.classList.add('loaded');
        };
        
        img.src = imageData.src;
        
        // Update navigation buttons
        updateNavigationButtons();
    }

    // Close modal
    function closeModal() {
        imageModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        // Reset image
        setTimeout(() => {
            modalImage.src = '';
            modalImage.classList.remove('loaded');
        }, 300);
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        prevBtn.classList.toggle('visible', galleryImages.length > 1);
        nextBtn.classList.toggle('visible', galleryImages.length > 1);
        
        prevBtn.disabled = currentImageIndex === 0;
        nextBtn.disabled = currentImageIndex === galleryImages.length - 1;
    }

    // Navigate to previous image
    function showPreviousImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            openModal(galleryImages[currentImageIndex], currentImageIndex);
        }
    }

    // Navigate to next image
    function showNextImage() {
        if (currentImageIndex < galleryImages.length - 1) {
            currentImageIndex++;
            openModal(galleryImages[currentImageIndex], currentImageIndex);
        }
    }

    // Event listeners
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', showPreviousImage);
    nextBtn.addEventListener('click', showNextImage);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!imageModal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // Initialize gallery and add click listeners to images
    initializeGallery();
    
    document.querySelectorAll('.gallery-image').forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal(galleryImages[index], index);
        });
    });

    // Also handle clicks on gallery items
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function(e) {
            // Only open modal if not clicking on overlay content directly
            if (!e.target.closest('.gallery-overlay')) {
                openModal(galleryImages[index], index);
            }
        });
    });

    // Handle RTO image click
    const rtoImage = document.querySelector('.rto-image');
    if (rtoImage) {
        rtoImage.style.cursor = 'pointer';
        rtoImage.addEventListener('click', function() {
            const rtoImageData = {
                src: rtoImage.src,
                alt: rtoImage.alt,
                title: 'RTO Support Documentation',
                description: 'Official moral support letter from Regional Transport Office for AeroWave assistive technology validation.',
                badges: ['Government', 'Official', 'Support']
            };
            
            // Temporarily add RTO image to gallery for modal
            const tempIndex = galleryImages.length;
            galleryImages.push(rtoImageData);
            openModal(rtoImageData, tempIndex);
        });
    }
});
