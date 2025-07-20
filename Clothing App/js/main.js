/**
 * Tomato Bar Pizza Bakery
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSliders();
    initScrollAnimations();
    initLocationSelector();
    initStickyHeader();
    initFloatingOrderButton();
    initNewsletterForm();
});

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const body = document.body;
    
    // Create mobile menu elements if they don't exist
    if (!document.querySelector('.mobile-menu')) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        body.appendChild(overlay);
        
        // Create mobile menu
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        
        // Create close button
        const closeBtn = document.createElement('div');
        closeBtn.className = 'mobile-menu-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        mobileMenu.appendChild(closeBtn);
        
        // Clone navigation
        const mainNav = document.querySelector('.main-nav ul');
        if (mainNav) {
            const mobileNav = mainNav.cloneNode(true);
            mobileMenu.appendChild(mobileNav);
            
            // Add order button
            const orderBtn = document.querySelector('.order-button a');
            if (orderBtn) {
                const mobileOrderBtn = orderBtn.cloneNode(true);
                mobileOrderBtn.className = 'btn btn-primary';
                mobileOrderBtn.style.display = 'block';
                mobileOrderBtn.style.marginTop = '2rem';
                mobileOrderBtn.style.textAlign = 'center';
                mobileMenu.appendChild(mobileOrderBtn);
            }
        }
        
        body.appendChild(mobileMenu);
        
        // Add event listeners
        closeBtn.addEventListener('click', toggleMobileMenu);
        overlay.addEventListener('click', toggleMobileMenu);
    }
    
    // Toggle mobile menu
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    function toggleMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
            
            // Animate hamburger icon
            if (mobileToggle) {
                mobileToggle.classList.remove('active');
            }
        } else {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow = 'hidden';
            
            // Animate hamburger icon
            if (mobileToggle) {
                mobileToggle.classList.add('active');
            }
        }
    }
}

/**
 * Initialize Sliders
 */
function initSliders() {
    // Check if slick.js is loaded
    if (typeof $.fn.slick !== 'undefined') {
        // Hero Slider
        $('.hero-slider').slick({
            dots: true,
            arrows: false,
            infinite: true,
            speed: 500,
            fade: true,
            cssEase: 'linear',
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: false
        });
        
        // Testimonial Slider
        $('.testimonial-slider').slick({
            dots: true,
            arrows: false,
            infinite: true,
            speed: 500,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            pauseOnHover: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    } else {
        console.warn('Slick slider not loaded');
        
        // Fallback for hero slider if slick is not loaded
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider) {
            const slides = heroSlider.querySelectorAll('.hero-slide');
            if (slides.length > 1) {
                let currentSlide = 0;
                
                // Hide all slides except the first one
                for (let i = 1; i < slides.length; i++) {
                    slides[i].style.display = 'none';
                }
                
                // Simple auto-rotation
                setInterval(() => {
                    slides[currentSlide].style.display = 'none';
                    currentSlide = (currentSlide + 1) % slides.length;
                    slides[currentSlide].style.display = 'flex';
                }, 5000);
            }
        }
    }
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    // Add fade-in class to elements when they come into view
    const elements = document.querySelectorAll('.about-preview, .featured-menu, .locations-preview, .testimonials, .newsletter, .app-download');
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe elements
    elements.forEach((element, index) => {
        element.classList.add(`delay-${index % 5 + 1}`);
        observer.observe(element);
    });
}

/**
 * Location Selector
 */
function initLocationSelector() {
    const locationDropdown = document.getElementById('location-dropdown');
    
    if (locationDropdown) {
        // Check if there's a saved location preference
        const savedLocation = localStorage.getItem('preferredLocation');
        if (savedLocation) {
            locationDropdown.value = savedLocation;
        }
        
        // Save location preference when changed
        locationDropdown.addEventListener('change', function() {
            const selectedLocation = this.value;
            localStorage.setItem('preferredLocation', selectedLocation);
            
            // Update content based on location
            updateLocationContent(selectedLocation);
        });
    }
}

/**
 * Update content based on selected location
 */
function updateLocationContent(location) {
    // This function would update content specific to the selected location
    // For example, showing the correct address, hours, specials, etc.
    console.log(`Location changed to: ${location}`);
    
    // Example: Update order button URL
    const orderButtons = document.querySelectorAll('.order-button a, .floating-order-button a');
    orderButtons.forEach(button => {
        // Set different order URLs based on location
        switch(location) {
            case 'valparaiso':
                button.href = 'https://order.tomatobarpizza.com/valparaiso';
                break;
            case 'schererville':
                button.href = 'https://order.tomatobarpizza.com/schererville';
                break;
            case 'crownpoint':
                button.href = 'https://order.tomatobarpizza.com/crownpoint';
                break;
            default:
                button.href = 'https://order.tomatobarpizza.com';
        }
    });
}

/**
 * Sticky Header
 */
function initStickyHeader() {
    const header = document.querySelector('.site-header');
    const locationSelector = document.querySelector('.location-selector');
    
    if (header && locationSelector) {
        const locationHeight = locationSelector.offsetHeight;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > locationHeight) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    }
}

/**
 * Floating Order Button
 */
function initFloatingOrderButton() {
    const floatingButton = document.querySelector('.floating-order-button');
    
    if (floatingButton) {
        // Show button after scrolling down
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                floatingButton.style.opacity = '1';
                floatingButton.style.transform = 'translateY(0)';
            } else {
                floatingButton.style.opacity = '0';
                floatingButton.style.transform = 'translateY(20px)';
            }
        });
    }
}

/**
 * Newsletter Form
 */
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Simulate form submission
                const formData = new FormData();
                formData.append('email', email);
                
                // Show loading state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Subscribing...';
                submitButton.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    // Success message
                    newsletterForm.innerHTML = '<p class="success-message">Thank you for subscribing! Check your email for a special offer.</p>';
                    
                    // In a real implementation, you would send the form data to your server
                    // fetch('/api/subscribe', {
                    //     method: 'POST',
                    //     body: formData
                    // })
                    // .then(response => response.json())
                    // .then(data => {
                    //     if (data.success) {
                    //         newsletterForm.innerHTML = '<p class="success-message">Thank you for subscribing!</p>';
                    //     } else {
                    //         showFormError(data.message);
                    //     }
                    // })
                    // .catch(error => {
                    //     showFormError('An error occurred. Please try again.');
                    //     console.error('Error:', error);
                    // })
                    // .finally(() => {
                    //     submitButton.textContent = originalText;
                    //     submitButton.disabled = false;
                    // });
                    
                }, 1500);
            } else {
                showFormError('Please enter a valid email address.');
            }
        });
    }
    
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
    
    function showFormError(message) {
        // Remove any existing error message
        const existingError = newsletterForm.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and add error message
        const errorElement = document.createElement('p');
        errorElement.className = 'error-message';
        errorElement.style.color = '#ff3333';
        errorElement.style.marginTop = '0.5rem';
        errorElement.style.fontSize = '0.9rem';
        errorElement.textContent = message;
        
        const submitButton = newsletterForm.querySelector('button[type="submit"]');
        submitButton.parentNode.insertBefore(errorElement, submitButton.nextSibling);
    }
}

/**
 * Utility Functions
 */

// Debounce function to limit how often a function can be called
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Smooth scroll to element
function scrollToElement(element, duration = 1000) {
    const target = document.querySelector(element);
    if (!target) return;
    
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}