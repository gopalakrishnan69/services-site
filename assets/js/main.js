// Main Application Controller
class LapDocApp {
    constructor() {
        this.init();
    }

    init() {
        this.initLoadingScreen();
        this.initNavigation();
        this.initScrollEffects();
        this.initCounterAnimations();
        this.initContactForm();
        this.initFloatingActions();
        this.initImageHandling();
        this.optimizePerformance();
    }

    // Loading Screen
    initLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 300);
                }
            }, 500);
        });
    }

    // Navigation
    initNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');
        const body = document.body;

        // Toggle mobile menu
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });
        }

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navToggle && navMenu) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.style.overflow = '';
                }
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Scroll Effects
    initScrollEffects() {
        const navbar = document.getElementById('navbar');
        const backToTop = document.querySelector('.back-to-top');

        window.addEventListener('scroll', () => {
            // Sticky navbar
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            // Back to top button
            if (backToTop) {
                if (window.scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }
        });
    }

    // Counter Animations
    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        let current = 0;
        const increment = target / 50;
        const duration = 1500;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current) + suffix;
        }, duration / 50);
    }

    // Contact Form - FIXED VERSION
    initContactForm() {
        const form = document.getElementById('enquiryForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form first using FormHandler
            const isValid = window.formHandler.validateForm();
            
            if (!isValid) {
                this.showNotification('Please fill all required fields correctly.', 'error');
                return;
            }
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                // Show success message
                this.showNotification('Thank you! Your enquiry has been submitted. We will contact you shortly.', 'success');
                
                // Reset form
                form.reset();
                
                // IMPORTANT: Reset button to original state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Floating Actions
    initFloatingActions() {
        const backToTop = document.querySelector('.back-to-top');
        
        if (backToTop) {
            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // WhatsApp float
        const whatsappFloat = document.querySelector('.whatsapp-float');
        if (whatsappFloat) {
            whatsappFloat.addEventListener('click', (e) => {
                e.preventDefault();
                window.open('https://wa.me/919143178910', '_blank');
            });
        }
    }

    // Image Handling
    initImageHandling() {
        this.lazyLoadImages();
        this.handleImageErrors();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('.product-img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, { threshold: 0.1 });

            images.forEach(img => {
                img.classList.add('loading');
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        const src = img.getAttribute('src');
        
        // Create a new image to check if it loads properly
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.classList.remove('loading');
            img.classList.add('loaded');
            img.style.opacity = '1';
        };
        
        tempImg.onerror = () => {
            img.classList.remove('loading');
            img.classList.add('error');
            this.showImagePlaceholder(img);
        };
        
        tempImg.src = src;
    }

    showImagePlaceholder(img) {
        const parent = img.parentElement;
        parent.classList.add('error');
        
        // Add a default image or icon
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.innerHTML = '<i class="fas fa-laptop"></i>';
        parent.appendChild(placeholder);
    }

    handleImageErrors() {
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG' && e.target.classList.contains('product-img')) {
                e.target.classList.add('error');
                this.showImagePlaceholder(e.target);
            }
        }, true);
    }

    // Notification System
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto remove after 5 seconds
        const removeTimeout = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(removeTimeout);
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Performance optimizations
    optimizePerformance() {
        // Lazy load images
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new LapDocApp();
});

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        border-left: 4px solid #10b981;
        max-width: 350px;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-error {
        border-left-color: #ef4444;
    }
    
    .notification i {
        color: #10b981;
        font-size: 1.25rem;
        flex-shrink: 0;
    }
    
    .notification-error i {
        color: #ef4444;
    }
    
    .notification span {
        flex: 1;
        color: #1f2937;
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 0.25rem;
        font-size: 0.875rem;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    
    .notification-close:hover {
        background: #f3f4f6;
        color: #1f2937;
    }
    
    @media (max-width: 480px) {
        .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(notificationStyles);