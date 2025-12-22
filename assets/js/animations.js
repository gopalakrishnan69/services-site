// Animation Controller
class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initHoverEffects();
        this.initParallax();
        this.initCounters();
        this.initTypewriter();
        this.initParticles();
    }

    initScrollAnimations() {
        // Create intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe all elements with animation classes
        document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    }

    animateElement(element) {
        const animation = element.dataset.animate;
        const delay = element.dataset.delay || 0;

        setTimeout(() => {
            element.classList.add(`animate-${animation}`);
            
            // Remove animation class after completion
            if (animation.includes('in')) {
                const duration = parseFloat(getComputedStyle(element).animationDuration) * 1000;
                setTimeout(() => {
                    element.classList.remove(`animate-${animation}`);
                }, duration);
            }
        }, delay);
    }

    initHoverEffects() {
        // Add hover effects to cards
        document.querySelectorAll('.service-card, .feature-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createHoverEffect(e, card);
            });
        });
    }

    createHoverEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        element.style.setProperty('--mouse-x', `${x}px`);
        element.style.setProperty('--mouse-y', `${y}px`);
        
        element.classList.add('hover-active');
        
        setTimeout(() => {
            element.classList.remove('hover-active');
        }, 600);
    }

    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Parallax for hero section
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
            
            // Parallax for floating badges
            document.querySelectorAll('.floating-badges .badge').forEach((badge, index) => {
                badge.style.transform = `translateY(${scrolled * 0.1 * (index + 1)}px)`;
            });
        });
    }

    initCounters() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.counter').forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(counter) {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const startTime = Date.now();
        const startValue = parseInt(counter.textContent) || 0;

        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
            
            counter.textContent = currentValue.toLocaleString() + (counter.dataset.suffix || '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    initTypewriter() {
        const typewriterElement = document.querySelector('.typewriter');
        if (!typewriterElement) return;

        const text = typewriterElement.dataset.text;
        const speed = parseInt(typewriterElement.dataset.speed) || 50;
        let index = 0;

        typewriterElement.textContent = '';

        const type = () => {
            if (index < text.length) {
                typewriterElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                // Start blinking cursor
                setInterval(() => {
                    typewriterElement.classList.toggle('cursor');
                }, 500);
            }
        };

        type();
    }

    initParticles() {
        // Create particle background
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-background';
        document.body.appendChild(particlesContainer);

        // Generate particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 20 + 5;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(45deg, 
                    rgba(99, 102, 241, ${Math.random() * 0.3}), 
                    rgba(236, 72, 153, ${Math.random() * 0.3})
                );
                border-radius: ${Math.random() > 0.5 ? '50%' : '10%'};
                position: fixed;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                z-index: -1;
                animation: float ${duration}s ease-in-out ${delay}s infinite;
                opacity: ${Math.random() * 0.5 + 0.1};
            `;

            particlesContainer.appendChild(particle);
        }
    }

    // Utility method for creating confetti
    static createConfetti(count = 100) {
        const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];
        
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random properties
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shape = Math.random() > 0.5 ? 'circle' : 'rectangle';
            
            confetti.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                position: fixed;
                top: -50px;
                left: ${Math.random() * 100}vw;
                border-radius: ${shape === 'circle' ? '50%' : '2px'};
                z-index: 10000;
                transform-origin: center;
            `;

            document.body.appendChild(confetti);
            
            // Animate confetti
            const animation = confetti.animate([
                {
                    transform: 'translate(0, 0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(${Math.random() * 200 - 100}px, 100vh) rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });

            animation.onfinish = () => confetti.remove();
        }
    }

    // Utility method for creating ripple effect
    static createRipple(event, color = 'rgba(255, 255, 255, 0.5)') {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.style.backgroundColor = color;
        circle.style.position = 'absolute';
        circle.style.borderRadius = '50%';
        circle.style.transform = 'scale(0)';
        circle.style.animation = 'ripple 600ms linear';
        circle.style.pointerEvents = 'none';

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(circle);

        setTimeout(() => circle.remove(), 600);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
});

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(20px, -20px) rotate(90deg); }
        50% { transform: translate(0, -40px) rotate(180deg); }
        75% { transform: translate(-20px, -20px) rotate(270deg); }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .particles-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    }
    
    .confetti {
        pointer-events: none;
    }
    
    .hover-active {
        transition: transform 0.3s ease;
    }
    
    .animate-fade-in {
        animation: fadeIn 0.6s ease-out;
    }
    
    .animate-slide-up {
        animation: slideUp 0.6s ease-out;
    }
    
    .animate-scale-in {
        animation: scaleIn 0.6s ease-out;
    }
    
    .cursor {
        border-right: 2px solid #6366f1;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { 
            opacity: 0;
            transform: translateY(30px);
        }
        to { 
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes scaleIn {
        from { 
            opacity: 0;
            transform: scale(0.9);
        }
        to { 
            opacity: 1;
            transform: scale(1);
        }
    }
`;

document.head.appendChild(animationStyles);