/**
 * Tomato Bar Pizza Bakery
 * Menu Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all menu components
    initMenuNavigation();
    initMenuFilter();
    initBuildYourOwn();
    initMenuItemInfo();
    initAddToOrder();
    initViewMore();
});

/**
 * Menu Navigation Functionality
 */
function initMenuNavigation() {
    const menuLinks = document.querySelectorAll('.menu-nav-list a');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            menuLinks.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Scroll to the section with offset for header
                const headerOffset = 150;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active section on scroll
    window.addEventListener('scroll', debounce(function() {
        const sections = document.querySelectorAll('.menu-section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200 && window.pageYOffset < sectionTop + sectionHeight - 200) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }, 100));
}

/**
 * Menu Filter Functionality
 */
function initMenuFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    // Filter by category
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            menuItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'flex';
                } else {
                    const categories = item.getAttribute('data-categories');
                    if (categories && categories.includes(filter)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // Search functionality
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search is empty, show all items
            menuItems.forEach(item => {
                item.style.display = 'flex';
            });
            
            // Reset filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-filter="all"]').classList.add('active');
            
            return;
        }
        
        menuItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            const itemDescription = item.querySelector('p').textContent.toLowerCase();
            
            if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

/**
 * Build Your Own Pizza Functionality
 */
function initBuildYourOwn() {
    // Step navigation
    const buildSteps = document.querySelectorAll('.build-step');
    
    buildSteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            // Remove active class from all steps
            buildSteps.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked step
            this.classList.add('active');
        });
    });
    
    // Toppings categories
    const toppingsCategoryButtons = document.querySelectorAll('.toppings-category');
    const toppingsLists = document.querySelectorAll('.toppings-list');
    
    toppingsCategoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            toppingsCategoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding toppings list
            toppingsLists.forEach(list => {
                list.classList.add('hidden');
                if (list.getAttribute('data-toppings') === category) {
                    list.classList.remove('hidden');
                }
            });
        });
    });
    
    // Pizza customization
    const sizeInputs = document.querySelectorAll('input[name="size"]');
    const baseInputs = document.querySelectorAll('input[name="base"]');
    const cheeseInputs = document.querySelectorAll('.build-step:nth-child(3) input[type="checkbox"]');
    const toppingInputs = document.querySelectorAll('.toppings-list input[type="checkbox"]');
    
    // Update pizza preview and price when options change
    function updatePizzaPreview() {
        // Get selected size
        let selectedSize;
        sizeInputs.forEach(input => {
            if (input.checked) {
                selectedSize = input.id;
            }
        });
        
        // Get selected base
        let selectedBase;
        baseInputs.forEach(input => {
            if (input.checked) {
                selectedBase = input.id;
            }
        });
        
        // Get selected cheeses
        const selectedCheeses = [];
        cheeseInputs.forEach(input => {
            if (input.checked) {
                selectedCheeses.push(input.id.replace('cheese-', ''));
            }
        });
        
        // Get selected toppings
        const selectedToppings = [];
        toppingInputs.forEach(input => {
            if (input.checked) {
                selectedToppings.push(input.id.replace('topping-', ''));
            }
        });
        
        // Calculate price
        let basePrice = 0;
        switch (selectedSize) {
            case 'size-10':
                basePrice = 10;
                break;
            case 'size-14':
                basePrice = 14;
                break;
            case 'size-gf':
                basePrice = 12;
                break;
            case 'size-calzone':
                basePrice = 11;
                break;
        }
        
        // Add cheese price
        const premiumCheeses = ['goat', 'vegan'];
        let cheesePrice = 0;
        selectedCheeses.forEach(cheese => {
            if (premiumCheeses.includes(cheese)) {
                cheesePrice += 2;
            }
        });
        
        // Add toppings price
        const regularToppings = ['mushrooms', 'onions', 'green-peppers', 'pepperoni', 'sausage', 'ham'];
        const premiumToppings = ['bacon', 'chicken', 'steak'];
        let toppingsPrice = 0;
        
        selectedToppings.forEach(topping => {
            if (premiumToppings.includes(topping)) {
                toppingsPrice += 2;
            } else if (regularToppings.includes(topping)) {
                toppingsPrice += 1;
            }
        });
        
        // Update price display
        const totalPrice = basePrice + cheesePrice + toppingsPrice;
        document.querySelector('.price-value').textContent = `$${totalPrice.toFixed(2)}`;
        
        // Update pizza visualization
        // This would be more complex in a real implementation with images for each topping
        const pizzaBase = document.querySelector('.pizza-base');
        if (selectedSize === 'size-calzone') {
            pizzaBase.src = 'images/calzone-base.png';
        } else {
            pizzaBase.src = 'images/pizza-base.png';
        }
        
        // In a real implementation, you would add/remove topping images here
    }
    
    // Add event listeners to all customization inputs
    sizeInputs.forEach(input => {
        input.addEventListener('change', updatePizzaPreview);
    });
    
    baseInputs.forEach(input => {
        input.addEventListener('change', updatePizzaPreview);
    });
    
    cheeseInputs.forEach(input => {
        input.addEventListener('change', updatePizzaPreview);
    });
    
    toppingInputs.forEach(input => {
        input.addEventListener('change', updatePizzaPreview);
    });
    
    // Initialize pizza preview
    updatePizzaPreview();
}

/**
 * Menu Item Info Functionality
 */
function initMenuItemInfo() {
    const infoButtons = document.querySelectorAll('.menu-item-info');
    
    infoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            const itemName = menuItem.querySelector('h3').textContent;
            const itemDescription = menuItem.querySelector('p').textContent;
            
            // Create modal for item info
            const modal = document.createElement('div');
            modal.className = 'menu-item-modal';
            
            // Get dietary information
            const badges = menuItem.querySelectorAll('.menu-item-badge');
            let dietaryInfo = '';
            
            badges.forEach(badge => {
                dietaryInfo += `<span class="modal-badge ${badge.className.split(' ')[1]}">${badge.textContent}</span>`;
            });
            
            // Create modal content
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <h3>${itemName}</h3>
                    <div class="modal-badges">${dietaryInfo}</div>
                    <p>${itemDescription}</p>
                    <div class="nutritional-info">
                        <h4>Nutritional Information</h4>
                        <div class="nutrition-grid">
                            <div class="nutrition-item">
                                <span class="nutrition-label">Calories</span>
                                <span class="nutrition-value">320</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Fat</span>
                                <span class="nutrition-value">12g</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Carbs</span>
                                <span class="nutrition-value">42g</span>
                            </div>
                            <div class="nutrition-item">
                                <span class="nutrition-label">Protein</span>
                                <span class="nutrition-value">15g</span>
                            </div>
                        </div>
                        <p class="nutrition-note">* Nutritional values are approximate and may vary.</p>
                    </div>
                    <div class="allergen-info">
                        <h4>Allergen Information</h4>
                        <p>Contains: Wheat, Dairy</p>
                    </div>
                </div>
            `;
            
            // Add modal to the page
            document.body.appendChild(modal);
            
            // Show modal
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // Close modal when clicking the close button
            const closeButton = modal.querySelector('.modal-close');
            closeButton.addEventListener('click', function() {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
            
            // Close modal when clicking outside the content
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                }
            });
        });
    });
    
    // Add modal styles if they don't exist
    if (!document.querySelector('#modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .menu-item-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            
            .menu-item-modal.active {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-content {
                background-color: white;
                border-radius: 10px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                transform: translateY(20px);
                transition: transform 0.3s ease;
            }
            
            .menu-item-modal.active .modal-content {
                transform: translateY(0);
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                font-size: 24px;
                cursor: pointer;
                color: #333;
            }
            
            .modal-badges {
                display: flex;
                margin-bottom: 15px;
                flex-wrap: wrap;
            }
            
            .modal-badge {
                padding: 3px 8px;
                border-radius: 3px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                margin-right: 8px;
                margin-bottom: 8px;
            }
            
            .modal-badge.vegetarian {
                background-color: #4CAF50;
                color: white;
            }
            
            .modal-badge.vegan {
                background-color: #8BC34A;
                color: white;
            }
            
            .modal-badge.gluten-free {
                background-color: #FF9800;
                color: white;
            }
            
            .modal-badge.spicy {
                background-color: #F44336;
                color: white;
            }
            
            .nutritional-info, .allergen-info {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #eee;
            }
            
            .nutritional-info h4, .allergen-info h4 {
                margin-bottom: 10px;
                font-size: 18px;
            }
            
            .nutrition-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-bottom: 10px;
            }
            
            .nutrition-item {
                display: flex;
                justify-content: space-between;
                padding: 5px 0;
                border-bottom: 1px dashed #eee;
            }
            
            .nutrition-label {
                font-weight: 600;
            }
            
            .nutrition-value {
                color: #666;
            }
            
            .nutrition-note {
                font-size: 12px;
                color: #666;
                font-style: italic;
            }
        `;
        
        document.head.appendChild(modalStyles);
    }
}

/**
 * Add to Order Functionality
 */
function initAddToOrder() {
    const addToOrderButtons = document.querySelectorAll('.add-to-order');
    
    addToOrderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const menuItem = this.closest('.menu-item');
            let itemName, itemPrice;
            
            if (menuItem) {
                // Regular menu item
                itemName = menuItem.querySelector('h3').textContent;
                itemPrice = menuItem.querySelector('.menu-item-price').textContent.split('|')[0].trim();
            } else {
                // Build your own pizza
                itemName = 'Custom Pizza';
                itemPrice = document.querySelector('.price-value').textContent;
            }
            
            // Create notification
            const notification = document.createElement('div');
            notification.className = 'add-to-cart-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-check-circle"></i>
                    <div class="notification-text">
                        <p><strong>${itemName}</strong> added to your order</p>
                        <p class="notification-price">${itemPrice}</p>
                    </div>
                </div>
                <div class="notification-actions">
                    <button class="btn btn-small view-cart-btn">View Cart</button>
                    <button class="btn btn-small continue-btn">Continue Shopping</button>
                </div>
            `;
            
            // Add notification to the page
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
                notification.classList.add('active');
            }, 10);
            
            // Auto-hide notification after 5 seconds
            const hideTimeout = setTimeout(() => {
                hideNotification();
            }, 5000);
            
            // View cart button
            const viewCartBtn = notification.querySelector('.view-cart-btn');
            viewCartBtn.addEventListener('click', function() {
                // In a real implementation, this would redirect to the cart page
                window.location.href = '#';
                hideNotification();
            });
            
            // Continue shopping button
            const continueBtn = notification.querySelector('.continue-btn');
            continueBtn.addEventListener('click', function() {
                hideNotification();
            });
            
            function hideNotification() {
                clearTimeout(hideTimeout);
                notification.classList.remove('active');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        });
    });
    
    // Add notification styles if they don't exist
    if (!document.querySelector('#notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.id = 'notification-styles';
        notificationStyles.textContent = `
            .add-to-cart-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                padding: 15px;
                width: 300px;
                transform: translateX(350px);
                transition: transform 0.3s ease;
                z-index: 999;
            }
            
            .add-to-cart-notification.active {
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .notification-content i {
                font-size: 24px;
                color: #4CAF50;
                margin-right: 15px;
            }
            
            .notification-text p {
                margin: 0;
                font-size: 14px;
            }
            
            .notification-price {
                color: #d62828;
                font-weight: 600;
            }
            
            .notification-actions {
                display: flex;
                justify-content: space-between;
            }
            
            .notification-actions button {
                flex: 1;
                margin: 0 5px;
                font-size: 12px;
            }
        `;
        
        document.head.appendChild(notificationStyles);
    }
}

/**
 * View More Functionality
 */
function initViewMore() {
    const viewMoreButtons = document.querySelectorAll('.view-more button');
    
    viewMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.closest('.menu-section');
            const menuGrid = section.querySelector('.menu-grid');
            const hiddenItems = menuGrid.querySelectorAll('.menu-item.hidden');
            
            if (hiddenItems.length > 0) {
                // Show hidden items
                hiddenItems.forEach(item => {
                    item.classList.remove('hidden');
                });
                
                // Update button text
                this.textContent = 'Show Less';
            } else {
                // Hide items beyond the first 4
                const allItems = menuGrid.querySelectorAll('.menu-item');
                
                for (let i = 4; i < allItems.length; i++) {
                    allItems[i].classList.add('hidden');
                }
                
                // Update button text
                this.textContent = 'View More';
                
                // Scroll to the top of the section
                const headerOffset = 150;
                const elementPosition = section.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
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