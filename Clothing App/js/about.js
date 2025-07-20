/**
 * Tomato Bar Pizza Bakery
 * About Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all about page components
    initTestimonialSlider();
    initProcessSteps();
    initTeamMembers();
});

/**
 * Testimonial Slider Functionality
 */
function initTestimonialSlider() {
    // Check if slick.js is loaded
    if (typeof $.fn.slick !== 'undefined') {
        // Initialize testimonial slider
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
    }
}

/**
 * Process Steps Animation
 */
function initProcessSteps() {
    const processSteps = document.querySelectorAll('.process-step');
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // Observe process steps
    processSteps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
        observer.observe(step);
    });
    
    // Add CSS for animation
    if (!document.querySelector('#process-animation-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'process-animation-styles';
        styleSheet.textContent = `
            .process-step.fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

/**
 * Team Members Hover Effects
 */
function initTeamMembers() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        const memberImage = member.querySelector('.member-image img');
        const memberInfo = member.querySelector('.member-bio');
        
        // Add hover effect
        member.addEventListener('mouseenter', function() {
            if (memberImage) {
                memberImage.style.transform = 'scale(1.05)';
            }
        });
        
        member.addEventListener('mouseleave', function() {
            if (memberImage) {
                memberImage.style.transform = 'scale(1)';
            }
        });
        
        // Add click event for mobile
        member.addEventListener('click', function() {
            // Toggle active class on mobile
            if (window.innerWidth < 768) {
                teamMembers.forEach(m => {
                    if (m !== member) {
                        m.classList.remove('active');
                    }
                });
                
                member.classList.toggle('active');
            }
        });
    });
    
    // Add CSS for mobile interaction
    if (!document.querySelector('#team-mobile-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'team-mobile-styles';
        styleSheet.textContent = `
            @media (max-width: 767px) {
                .team-member .member-bio {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                    padding-top: 0;
                    padding-bottom: 0;
                }
                
                .team-member.active .member-bio {
                    max-height: 200px;
                    padding: 0 var(--spacing-md) var(--spacing-lg);
                }
                
                .team-member:after {
                    content: '+';
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 25px;
                    height: 25px;
                    background-color: var(--primary-color);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    transition: transform 0.3s ease;
                }
                
                .team-member.active:after {
                    transform: rotate(45deg);
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

/**
 * Scroll to Process Step
 */
function scrollToProcessStep(stepNumber) {
    const processStep = document.querySelector(`.process-step:nth-child(${stepNumber})`);
    
    if (processStep) {
        const headerOffset = 150;
        const elementPosition = processStep.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Highlight the step
        processStep.classList.add('highlight');
        
        setTimeout(() => {
            processStep.classList.remove('highlight');
        }, 2000);
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