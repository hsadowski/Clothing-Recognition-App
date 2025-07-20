from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, images, products
from app.core.config import settings
from app.db.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered clothing item recognition API",
    version="0.1.0",
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api", tags=["authentication"])
app.include_router(images.router, prefix="/api", tags=["images"])
app.include_router(products.router, prefix="/api", tags=["products"])

@app.get("/")
def root():
    return {"message": "Welcome to the Clothing Recognition API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
