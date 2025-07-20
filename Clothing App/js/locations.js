/**
 * Tomato Bar Pizza Bakery
 * Locations Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all locations components
    initLocationTabs();
    initGallery();
    // Map will be initialized by the Google Maps API callback
});

/**
 * Location Tabs Functionality
 */
function initLocationTabs() {
    const locationTabs = document.querySelectorAll('.location-tab');
    const locationDetails = document.querySelectorAll('.location-detail');
    
    locationTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const location = this.getAttribute('data-location');
            
            // Update active tab
            locationTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding location detail
            locationDetails.forEach(detail => {
                detail.classList.remove('active');
                if (detail.id === location) {
                    detail.classList.add('active');
                }
            });
            
            // Update map marker
            if (window.map && window.markers) {
                // Center map on selected location
                const marker = window.markers.find(m => m.id === location);
                if (marker) {
                    window.map.setCenter(marker.position);
                    window.map.setZoom(15);
                    
                    // Open info window for this marker
                    if (window.infoWindow) {
                        window.infoWindow.close();
                        window.infoWindow.setContent(marker.content);
                        window.infoWindow.open(window.map, marker);
                    }
                }
            }
            
            // Update location dropdown if it exists
            const locationDropdown = document.getElementById('location-dropdown');
            if (locationDropdown) {
                locationDropdown.value = location;
                
                // Trigger change event to update any other elements that depend on location
                const event = new Event('change');
                locationDropdown.dispatchEvent(event);
            }
        });
    });
    
    // Sync location dropdown with tabs
    const locationDropdown = document.getElementById('location-dropdown');
    if (locationDropdown) {
        locationDropdown.addEventListener('change', function() {
            const location = this.value;
            
            // Find and click the corresponding tab
            const tab = document.querySelector(`.location-tab[data-location="${location}"]`);
            if (tab && !tab.classList.contains('active')) {
                tab.click();
            }
        });
    }
}

/**
 * Gallery Functionality
 */
function initGallery() {
    const locationDetails = document.querySelectorAll('.location-detail');
    
    locationDetails.forEach(detail => {
        const galleryMain = detail.querySelector('.gallery-main img');
        const galleryThumbs = detail.querySelectorAll('.gallery-thumbs img');
        
        galleryThumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Update main image
                galleryMain.src = this.src;
                galleryMain.alt = this.alt;
                
                // Update active thumbnail
                galleryThumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });
}

/**
 * Google Maps Initialization
 * This function will be called by the Google Maps API when it loads
 */
function initMap() {
    // Create map centered on the first location
    const mapOptions = {
        zoom: 10,
        center: { lat: 41.4731, lng: -87.0736 }, // Center on Northwest Indiana
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "saturation": 36
                    },
                    {
                        "color": "#333333"
                    },
                    {
                        "lightness": 40
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#fefefe"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#fefefe"
                    },
                    {
                        "lightness": 17
                    },
                    {
                        "weight": 1.2
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f5f5"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dedede"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 29
                    },
                    {
                        "weight": 0.2
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 18
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ffffff"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    },
                    {
                        "lightness": 19
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e9e9e9"
                    },
                    {
                        "lightness": 17
                    }
                ]
            }
        ]
    };
    
    // Create map
    window.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    // Create info window
    window.infoWindow = new google.maps.InfoWindow();
    
    // Define locations
    const locations = [
        {
            id: 'valparaiso',
            name: 'Tomato Bar Valparaiso',
            position: { lat: 41.4731, lng: -87.0736 },
            address: '2310 Laporte Ave, Valparaiso, IN 46383',
            phone: '219-462-7499',
            hours: 'Sun-Thu: 11am-9pm, Fri-Sat: 11am-10pm'
        },
        {
            id: 'schererville',
            name: 'Tomato Bar Schererville',
            position: { lat: 41.4858, lng: -87.4520 },
            address: '79 US-41, Schererville, IN 46375',
            phone: '219-713-9611',
            hours: 'Sun-Thu: 11am-9pm, Fri-Sat: 11am-10pm'
        },
        {
            id: 'crownpoint',
            name: 'Tomato Bar Crown Point',
            position: { lat: 41.4172, lng: -87.3653 },
            address: '2661 Pratt St, Crown Point, IN 46307',
            phone: '219-333-2178',
            hours: 'Sun-Thu: 11am-9pm, Fri-Sat: 11am-10pm'
        }
    ];
    
    // Create markers
    window.markers = [];
    
    locations.forEach(location => {
        // Create info window content
        const content = `
            <div class="map-info-window">
                <h3>${location.name}</h3>
                <p>${location.address}</p>
                <p>${location.phone}</p>
                <p>${location.hours}</p>
                <a href="https://maps.google.com/?q=${location.address}" target="_blank" class="directions-link">Get Directions</a>
            </div>
        `;
        
        // Create marker
        const marker = new google.maps.Marker({
            position: location.position,
            map: window.map,
            title: location.name,
            icon: {
                url: 'images/map-marker.png',
                scaledSize: new google.maps.Size(40, 40)
            },
            animation: google.maps.Animation.DROP,
            id: location.id,
            content: content
        });
        
        // Add click event to marker
        marker.addListener('click', function() {
            // Open info window
            window.infoWindow.close();
            window.infoWindow.setContent(content);
            window.infoWindow.open(window.map, marker);
            
            // Update active tab
            const tab = document.querySelector(`.location-tab[data-location="${location.id}"]`);
            if (tab) {
                tab.click();
            }
        });
        
        // Add marker to array
        window.markers.push(marker);
    });
    
    // Create bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();
    window.markers.forEach(marker => bounds.extend(marker.position));
    
    // Fit map to bounds
    window.map.fitBounds(bounds);
    
    // Set minimum zoom level
    google.maps.event.addListenerOnce(window.map, 'bounds_changed', function() {
        if (window.map.getZoom() > 12) {
            window.map.setZoom(12);
        }
    });
    
    // Show active location
    const activeTab = document.querySelector('.location-tab.active');
    if (activeTab) {
        const locationId = activeTab.getAttribute('data-location');
        const marker = window.markers.find(m => m.id === locationId);
        
        if (marker) {
            // Center map on active location
            window.map.setCenter(marker.position);
            window.map.setZoom(15);
            
            // Open info window
            window.infoWindow.setContent(marker.content);
            window.infoWindow.open(window.map, marker);
        }
    }
}

/**
 * Fallback Map Initialization
 * This will be used if the Google Maps API fails to load
 */
function handleMapError() {
    const mapContainer = document.getElementById('map');
    
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div class="map-error">
                <p>Unable to load the map. Please try again later.</p>
                <div class="location-links">
                    <a href="https://maps.google.com/?q=2310+Laporte+Ave,+Valparaiso,+IN+46383" target="_blank">Valparaiso Location</a>
                    <a href="https://maps.google.com/?q=79+US-41,+Schererville,+IN+46375" target="_blank">Schererville Location</a>
                    <a href="https://maps.google.com/?q=2661+Pratt+St,+Crown+Point,+IN+46307" target="_blank">Crown Point Location</a>
                </div>
            </div>
        `;
        
        // Add error styles
        const style = document.createElement('style');
        style.textContent = `
            .map-error {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                padding: 20px;
                text-align: center;
                background-color: #f8f8f8;
            }
            
            .map-error p {
                margin-bottom: 20px;
                font-weight: 500;
                color: #d62828;
            }
            
            .location-links {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .location-links a {
                color: #003049;
                font-weight: 600;
                text-decoration: underline;
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Add error handler for Google Maps
window.gm_authFailure = handleMapError;

// Check if Google Maps failed to load after 5 seconds
setTimeout(function() {
    if (!window.google || !window.google.maps) {
        handleMapError();
    }
}, 5000);