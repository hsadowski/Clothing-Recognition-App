import os
import json
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.config import settings
from app.db.database import get_db
from app.db.models import User, SearchHistory, SearchResult, Product
from app.core.security import get_current_user, get_current_user_optional
from app.ml.feature_extractor import get_feature_extractor
from app.ml.vector_search import get_vector_search
from app.services.ecommerce import get_ecommerce_service

router = APIRouter()

class ProductMatch(BaseModel):
    """Model for a matched product"""
    product_id: str
    similarity_score: float
    brand: str
    name: str
    category: str
    description: str
    price: float
    currency: str
    image_url: str
    product_url: str

class SearchResponse(BaseModel):
    """Response model for search endpoint"""
    search_id: Optional[int] = None
    matches: List[ProductMatch]
    message: str

@router.get("/products/search/{image_id}", response_model=SearchResponse)
async def search_products_by_image(
    image_id: str,
    limit: int = Query(5, ge=1, le=20),
    threshold: float = Query(0.5, ge=0, le=1.0),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Search for products similar to an uploaded image.
    
    Args:
        image_id: Image ID (filename)
        limit: Maximum number of results (1-20)
        threshold: Similarity threshold (0-1)
        db: Database session
        current_user: Current user (optional)
        
    Returns:
        Search results with matched products
    """
    try:
        # Check if image exists
        image_path = settings.UPLOAD_FOLDER / image_id
        if not os.path.exists(image_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Image not found"
            )
        
        # Get feature extractor and vector search
        feature_extractor = get_feature_extractor()
        vector_search = get_vector_search()
        
        # Extract features from the image
        features = feature_extractor.extract_clothing_features(image_path)
        
        # Search for similar products
        matches = vector_search.search(features, k=limit)
        
        # Filter by threshold
        matches = [(pid, score) for pid, score in matches if score >= threshold]
        
        # Get product details
        ecommerce_service = get_ecommerce_service()
        product_matches = []
        
        for product_id, similarity_score in matches:
            # Get product from database
            product = db.query(Product).filter(Product.id == product_id).first()
            
            if product:
                # Use database product
                product_match = ProductMatch(
                    product_id=str(product.id),
                    similarity_score=similarity_score,
                    brand=product.brand,
                    name=product.name,
                    category=product.category,
                    description=product.description,
                    price=product.price,
                    currency=product.currency,
                    image_url=product.image_url,
                    product_url=product.product_url
                )
            else:
                # Fallback to e-commerce API
                product_data = ecommerce_service.get_product_by_id(f"clothing_{product_id}")
                if product_data:
                    product_match = ProductMatch(
                        product_id=str(product_id),
                        similarity_score=similarity_score,
                        brand=product_data.get("brand", ""),
                        name=product_data.get("name", ""),
                        category=product_data.get("category", ""),
                        description=product_data.get("description", ""),
                        price=product_data.get("price", 0.0),
                        currency=product_data.get("currency", "USD"),
                        image_url=product_data.get("image_url", ""),
                        product_url=product_data.get("product_url", "")
                    )
                else:
                    # Skip if product not found
                    continue
            
            product_matches.append(product_match)
        
        # Record search results if user is logged in
        search_id = None
        if current_user:
            # Find search history or create new
            search_history = db.query(SearchHistory).filter(
                SearchHistory.user_id == current_user.id,
                SearchHistory.image_path == os.path.basename(image_path)
            ).first()
            
            if not search_history:
                search_history = SearchHistory(
                    user_id=current_user.id,
                    image_path=os.path.basename(image_path)
                )
                db.add(search_history)
                db.commit()
                db.refresh(search_history)
            
            search_id = search_history.id
            
            # Record search results
            for match in product_matches:
                search_result = SearchResult(
                    search_id=search_id,
                    product_id=match.product_id,
                    similarity_score=match.similarity_score,
                    result_data={
                        "brand": match.brand,
                        "name": match.name,
                        "price": match.price,
                        "currency": match.currency,
                        "image_url": match.image_url,
                        "product_url": match.product_url
                    }
                )
                db.add(search_result)
            
            db.commit()
        
        # For MVP, if no matches are found, return sample products
        if not product_matches:
            ecommerce_service = get_ecommerce_service()
            sample_products = ecommerce_service._get_mock_products()[:limit]
            
            for product in sample_products:
                product_match = ProductMatch(
                    product_id=product.get("id", ""),
                    similarity_score=0.5,  # Default similarity
                    brand=product.get("brand", ""),
                    name=product.get("name", ""),
                    category=product.get("category", ""),
                    description=product.get("description", ""),
                    price=product.get("price", 0.0),
                    currency=product.get("currency", "USD"),
                    image_url=product.get("image_url", ""),
                    product_url=product.get("product_url", "")
                )
                product_matches.append(product_match)
            
            return {
                "search_id": search_id,
                "matches": product_matches,
                "message": "No exact matches found. Showing suggested products."
            }
        
        return {
            "search_id": search_id,
            "matches": product_matches,
            "message": f"Found {len(product_matches)} matching products"
        }
        
    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle other exceptions
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error searching products: {str(e)}"
        )

class ProductDetails(BaseModel):
    """Model for product details"""
    id: str
    brand: str
    name: str
    category: str
    description: str
    price: float
    currency: str
    image_url: str
    product_url: str

@router.get("/products/{product_id}", response_model=ProductDetails)
async def get_product_details(
    product_id: str,
    db: Session = Depends(get_db),
):
    """
    Get details for a specific product.
    
    Args:
        product_id: Product ID
        db: Database session
        
    Returns:
        Product details
    """
    try:
        # Try to get product from database
        product = None
        
        # Check if product ID is numeric
        if product_id.isdigit():
            product = db.query(Product).filter(Product.id == int(product_id)).first()
        
        # If not found, check by external ID
        if not product:
            product = db.query(Product).filter(Product.external_id == product_id).first()
        
        # If still not found, try e-commerce API
        if not product:
            ecommerce_service = get_ecommerce_service()
            product_data = ecommerce_service.get_product_by_id(product_id)
            
            if product_data:
                return ProductDetails(
                    id=product_data.get("id", ""),
                    brand=product_data.get("brand", ""),
                    name=product_data.get("name", ""),
                    category=product_data.get("category", ""),
                    description=product_data.get("description", ""),
                    price=product_data.get("price", 0.0),
                    currency=product_data.get("currency", "USD"),
                    image_url=product_data.get("image_url", ""),
                    product_url=product_data.get("product_url", "")
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Product not found"
                )
        
        # Return product from database
        return ProductDetails(
            id=str(product.id),
            brand=product.brand,
            name=product.name,
            category=product.category,
            description=product.description,
            price=product.price,
            currency=product.currency,
            image_url=product.image_url,
            product_url=product.product_url
        )
        
    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle other exceptions
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting product details: {str(e)}"
        )

class SearchHistoryItem(BaseModel):
    """Model for a search history item"""
    id: int
    image_path: str
    search_date: str
    result_count: int

@router.get("/products/history", response_model=List[SearchHistoryItem])
async def get_search_history(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get search history for the current user.
    
    Args:
        limit: Maximum number of results
        db: Database session
        current_user: Current user
        
    Returns:
        List of search history items
    """
    try:
        # Get user's search history
        searches = db.query(SearchHistory).filter(
            SearchHistory.user_id == current_user.id
        ).order_by(SearchHistory.search_date.desc()).limit(limit).all()
        
        # Format response
        history_items = []
        for search in searches:
            # Count results
            result_count = db.query(SearchResult).filter(
                SearchResult.search_id == search.id
            ).count()
            
            # Add to response
            history_items.append(SearchHistoryItem(
                id=search.id,
                image_path=search.image_path,
                search_date=search.search_date.isoformat(),
                result_count=result_count
            ))
        
        return history_items
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting search history: {str(e)}"
        )
