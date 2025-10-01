/*
|--------------------------------------------------------------------------
| JIME Developers Cinematic Flow - Main Script
|--------------------------------------------------------------------------
| Handles all animations, interactivity, and scrolling effects.
| Uses IntersectionObserver for scroll-based entrance animations.
*/

// --- CONFIGURATION ---
const TESTIMONIAL_DURATION = 5000;

// --- DOM ELEMENTS CACHING ---
const DOMElements = {
    navbar: document.getElementById('navbar'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    navLinks: document.getElementById('navLinks'),
    scrollIndicator: document.getElementById('scrollIndicator'),
    contactForm: document.getElementById('contactForm'),
    toast: document.getElementById('toast'),
    testimonialCards: document.querySelectorAll('.testimonial-card'),
    testimonialDots: document.querySelectorAll('.testimonials-dots .dot'),
    // Grouping elements for the IntersectionObserver
    animatedElements: document.querySelectorAll('.section-title, .section-description, .milestone-card, .service-card, .project-item, .course-card-wrapper, .contact-info, .contact-form'),
    aboutSection: document.getElementById('about'),
};


// --- UTILITY FUNCTIONS ---

/**
 * Shows a brief toast notification.
 * @param {string} message The message to display.
 */
function showToast(message) {
    const { toast } = DOMElements;
    if (!toast) return;

    // Reset and set message
    toast.textContent = message;
    
    // Show toast (using rAF for smooth transition application)
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


// --- NAVBAR LOGIC ---

/**
 * Toggles the mobile menu visibility.
 */
function toggleMobileMenu() {
    const { navLinks } = DOMElements;
    if (!navLinks) return;
    
    // Toggle the display property for responsiveness
    const isVisible = navLinks.style.display === 'flex';
    navLinks.style.display = isVisible ? 'none' : 'flex';

    // Update button icon (optional, but good UX)
    const icon = DOMElements.mobileMenuToggle.querySelector('.menu-icon');
    if (icon) {
        icon.innerHTML = isVisible 
            ? '<line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>'
            : '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
    }
}

/**
 * Handles the navbar shrinking/background change on scroll (blur effect in CSS).
 */
function handleNavbarScroll() {
    const { navbar } = DOMElements;
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// --- ANIMATION LOGIC (IntersectionObserver) ---

const observerOptions = {
    // Fire callback when 20% of the element is visible
    threshold: 0.2, 
    // Allows animations to start slightly early
    rootMargin: '0px 0px -100px 0px' 
};

// Main observer for slide-in/fade-up animations
const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once visible to prevent re-triggering
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

// Special observer for the About section's parallax background effect
const parallaxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (DOMElements.aboutSection) {
            // Apply a "visible" class as soon as the section starts intersecting
            if (entry.isIntersecting) {
                DOMElements.aboutSection.classList.add('visible');
            } else {
                DOMElements.aboutSection.classList.remove('visible');
            }
        }
    });
}, { threshold: 0.1 });


/**
 * Attaches the IntersectionObserver to all animatable elements.
 */
function setupScrollAnimations() {
    DOMElements.animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
    
    // Attach the dedicated parallax observer
    if (DOMElements.aboutSection) {
        parallaxObserver.observe(DOMElements.aboutSection);
    }
}


// --- TESTIMONIALS CAROUSEL LOGIC ---

let currentTestimonialIndex = 0;
let testimonialInterval;

function showTestimonial(index) {
    const { testimonialCards, testimonialDots } = DOMElements;
    
    if (index < 0 || index >= testimonialCards.length) return;

    // Reset visibility and active state for all elements
    testimonialCards.forEach(card => card.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    // Set active state for the current index
    testimonialCards[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    currentTestimonialIndex = index;
}

function startTestimonialRotation() {
    // Clear any existing interval
    if (testimonialInterval) clearInterval(testimonialInterval);

    testimonialInterval = setInterval(() => {
        const nextIndex = (currentTestimonialIndex + 1) % DOMElements.testimonialCards.length;
        showTestimonial(nextIndex);
    }, TESTIMONIAL_DURATION);
}

function setupTestimonials() {
    const { testimonialCards, testimonialDots } = DOMElements;
    if (testimonialCards.length === 0) return;

    // Initial display and rotation start
    showTestimonial(0);
    startTestimonialRotation();

    // Dot click handlers: select testimonial and restart timer
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(testimonialInterval);
            showTestimonial(index);
            startTestimonialRotation();
        });
    });
}


// --- MAIN INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar setup
    handleNavbarScroll();
    
    // 2. Event Listeners
    window.addEventListener('scroll', handleNavbarScroll);

    if (DOMElements.mobileMenuToggle) {
        DOMElements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scroll for internal links & Mobile Menu closing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (DOMElements.navLinks && window.innerWidth < 768) {
                    DOMElements.navLinks.style.display = 'none'; // Close mobile menu
                }
            }
        });
    });
    // Scroll Indicator/Button
    if (DOMElements.scrollIndicator) {
        DOMElements.scrollIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            const aboutSection = document.getElementById('about');
            aboutSection?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // General Button/Link demo handler (Prevent default action for demo)
    document.querySelectorAll('button, .project-link').forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.type !== 'submit' && button.tagName === 'BUTTON' || button.classList.contains('project-link')) {
                e.preventDefault();
                showToast('Thanks for your interest! This is a demo.');
            }
        });
    });

    // Contact Form Submission Handler
    if (DOMElements.contactForm) {
        DOMElements.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Message sent! We\'ll get back to you soon.');
            DOMElements.contactForm.reset();
        });
    }

    // 3. Setup Animations and Carousels
    setupScrollAnimations();
    setupTestimonials();

    console.log('JIME Developers Cinematic Flow loaded successfully!');
});