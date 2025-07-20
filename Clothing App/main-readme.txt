# Clothing Recognition App

An AI-powered application that allows users to upload images of clothing items and find exact matches with product details, including brand, pricing, and purchase links.

## Features

- **Image Upload:** Upload images from your device or capture using your camera
- **AI Recognition:** Advanced deep learning for accurate clothing item recognition
- **Detailed Results:** Get comprehensive product details including brand, price, and where to buy
- **User Accounts:** Save your search history and revisit previous results
- **Responsive Design:** Works on both desktop and mobile devices

## Tech Stack

### Backend
- FastAPI (Python)
- SQLAlchemy with PostgreSQL
- PyTorch with CLIP model for image processing
- FAISS for vector similarity search

### Frontend
- React.js
- React Router for navigation
- CSS for styling

### Infrastructure
- Docker and Docker Compose for containerization

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/clothing-recognition-app.git
cd clothing-recognition-app
```

2. Create necessary directories:
```bash
mkdir -p uploads
```

3. Start the application using Docker Compose:
```bash
docker-compose up
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Project Structure

```
clothing-recognition-app/
├── backend/                      # FastAPI backend
│   ├── app/                      # Application code
│   ├── tests/                    # Backend tests
│   ├── main.py                   # Entry point
│   ├── requirements.txt          # Python dependencies
│   └── Dockerfile                # Backend Docker configuration
├── frontend/                     # React frontend
│   ├── public/                   # Public assets
│   ├── src/                      # React components and logic
│   ├── package.json              # Node.js dependencies
│   └── Dockerfile                # Frontend Docker configuration
├── uploads/                      # Image uploads directory
├── docker-compose.yml            # Docker services configuration
└── README.md                     # Project documentation
```

## Usage

1. **Home Page:** Start by uploading an image of clothing you want to find
2. **Results Page:** View matching products with details and purchase links
3. **User Account:** Register/login to save your search history
4. **History Page:** Access your previous searches

## Development

To run the application in development mode with hot-reloading:

```bash
docker-compose up
```

Changes to the code will automatically reload the application.

## Future Enhancements

- **Enhanced Pattern Recognition:** Improve recognition for items with partial logos
- **More Retail Integrations:** Connect with additional e-commerce platforms
- **Personal Recommendations:** Suggest items based on user preferences
- **Social Sharing:** Share found items with friends
- **Augmented Reality:** Virtual try-on features

## License

This project is licensed under the MIT License - see the LICENSE file for details.
