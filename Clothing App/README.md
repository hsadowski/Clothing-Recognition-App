# Tomato Bar Pizza Bakery Website

A modern, responsive website for Tomato Bar Pizza Bakery, showcasing their menu, locations, and brand.

## Project Overview

This project is a complete redesign of the Tomato Bar Pizza Bakery website, focusing on improved user experience, visual appeal, and functionality. The website is built with HTML, CSS, and JavaScript, making it easy to maintain and update.

## Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI/UX**: Clean, intuitive interface with smooth animations and transitions
- **Interactive Menu**: Filterable menu with detailed item information
- **Location Pages**: Interactive maps and location-specific information
- **Build Your Own Pizza**: Interactive pizza customization tool
- **Image Gallery**: Location photo galleries with thumbnail navigation
- **Mobile-First Approach**: Optimized for mobile devices with appropriate touch targets
- **Performance Optimized**: Fast loading times and optimized assets
- **SEO Friendly**: Proper semantic markup and meta information

## Project Structure

```
tomato-bar-website/
├── css/
│   ├── normalize.css
│   ├── styles.css
│   ├── menu.css
│   └── locations.css
├── js/
│   ├── main.js
│   ├── menu.js
│   └── locations.js
├── images/
│   ├── (various image assets)
│   └── required-images.txt
├── index.html
├── menu.html
├── locations.html
└── README.md
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/your-username/tomato-bar-website.git
   ```

2. Navigate to the project directory:
   ```
   cd tomato-bar-website
   ```

3. Open the project in your code editor.

4. To view the website locally, you can use a local development server:
   - If you have Node.js installed, you can use `http-server`:
     ```
     npm install -g http-server
     http-server
     ```
   - If you have Python installed:
     ```
     # Python 3
     python -m http.server
     # Python 2
     python -m SimpleHTTPServer
     ```
   - Or simply open the HTML files directly in your browser.

5. For the Google Maps functionality on the locations page, you'll need to:
   - Get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
   - Replace `YOUR_API_KEY` in the locations.html file with your actual API key

## Development Guidelines

### HTML
- Use semantic HTML5 elements
- Maintain proper document structure
- Include appropriate meta tags for SEO
- Ensure accessibility with proper ARIA attributes and alt text

### CSS
- Follow the BEM (Block Element Modifier) naming convention
- Use CSS variables for consistent theming
- Maintain responsive design principles
- Comment complex CSS sections

### JavaScript
- Use modern ES6+ syntax
- Organize code into logical functions
- Add comments for complex logic
- Ensure cross-browser compatibility

### Images
- Optimize all images for web
- Use descriptive filenames
- Include appropriate alt text
- See `images/required-images.txt` for a complete list of required images

## Browser Support

The website is designed to work on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- iOS Safari
- Android Chrome

## Performance Considerations

- Minimize HTTP requests
- Optimize image sizes
- Use appropriate image formats (WebP where supported)
- Minimize JavaScript execution time
- Implement lazy loading for images
- Use browser caching

## Future Enhancements

- Online ordering system integration
- User accounts and loyalty program
- Beer menu with real-time tap list
- Events calendar
- Blog/news section
- Newsletter signup with email marketing integration

## Contact

For questions or support regarding this project, please contact:
- Email: [your-email@example.com](mailto:your-email@example.com)
- Website: [your-website.com](https://your-website.com)

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

Copyright © 2025 Tomato Bar Pizza Bakery. All rights reserved.