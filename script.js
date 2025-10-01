/*
|--------------------------------------------------------------------------
| JIME Developers Cinematic Flow - Main Script
|--------------------------------------------------------------------------
| Handles all animations, interactivity, and scrolling effects.
| Uses IntersectionObserver for scroll-based entrance animations.
*/

// --- DOM ELEMENTS ---
const DOMElements = {
    navbar: document.getElementById('navbar'),
    mobileMenuToggle: document.getElementById('mobileMenuToggle'),
    navLinks: document.getElementById('navLinks'),
    scrollIndicator: document.getElementById('scrollIndicator'),
    contactForm: document.getElementById('contactForm'),
    toast: document.getElementById('toast'),
    testimonialCards: document.querySelectorAll('.testimonial-card'),
    testimonialDots: document.querySelectorAll('.testimonials-dots .dot'),
    animatedElements: document.querySelectorAll('.section-title, .section-description, .milestone-card, .service-card, .project-item, .course-card-wrapper, .contact-info, .contact-form'),
    aboutSection: document.getElementById('about'),
};


// --- UTILITY FUNCTIONS ---

/**
 * Shows a brief toast notification at the bottom right.
 * @param {string} message The message to display.
 */
function showToast(message) {
    const { toast } = DOMElements;
    if (!toast) return;

    // Reset and set message
    toast.textContent = message;
    
    // Show toast
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
    
    const isOpen = navLinks.style.display === 'flex';
    navLinks.style.display = isOpen ? 'none' : 'flex';
}

/**
 * Handles the navbar shrinking/background change on scroll.
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
    // Start observing when 20% of the element is visible
    threshold: 0.2, 
    // Margin allows pre-loading before element reaches viewport center
    rootMargin: '0px 0px -100px 0px' 
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Special parallax effect for the about section
            if (entry.target.id === 'about') {
                entry.target.classList.add('visible');
            }
        }
    });
}, observerOptions);

/**
 * Attaches the IntersectionObserver to all animatable elements.
 */
function setupScrollAnimations() {
    DOMElements.animatedElements.forEach(el => {
        // Delay logic is handled by CSS transition-delay property set in HTML
        animationObserver.observe(el);
    });
    
    // Special observer for the About section parallax effect
    if (DOMElements.aboutSection) {
        animationObserver.observe(DOMElements.aboutSection);
    }
}


// --- TESTIMONIALS CAROUSEL LOGIC ---

let currentTestimonialIndex = 0;
let testimonialInterval;
const TESTIMONIAL_DURATION = 5000;

function showTestimonial(index) {
    const { testimonialCards, testimonialDots } = DOMElements;
    
    // Safety check
    if (index < 0 || index >= testimonialCards.length) return;

    // Remove active class from all
    testimonialCards.forEach(card => card.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current
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

    // Initial load
    showTestimonial(0);
    startTestimonialRotation();

    // Dot click handlers
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Stop, show selected, and restart
            clearInterval(testimonialInterval);
            showTestimonial(index);
            startTestimonialRotation();
        });
    });
}


// --- MAIN INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial setup
    handleNavbarScroll();
    
    // 2. Event Listeners
    window.addEventListener('scroll', handleNavbarScroll);

    if (DOMElements.mobileMenuToggle) {
        DOMElements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (DOMElements.navLinks && window.innerWidth < 768) {
                    DOMElements.navLinks.style.display = 'none'; // Close mobile menu on click
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

    // General Button/Link demo handler
    document.querySelectorAll('button, .project-link').forEach(button => {
        button.addEventListener('click', (e) => {
            // Check if it's a submission button, otherwise prevent default for demo purposes
            if (button.type !== 'submit' && button.tagName === 'BUTTON') {
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
});

// For course cards: simplified hover flip using CSS-only.
// If more complex hover state was needed, logic would go here.