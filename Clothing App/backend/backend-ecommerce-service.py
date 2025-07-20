import json
import requests
from typing import Dict, List, Any, Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

class EcommerceService:
    """
    Service for interacting with e-commerce APIs.
    For the MVP, we'll use a simplified implementation that supports
    a mock API and could be extended to work with real e-commerce platforms.
    """
    
    def __init__(self):
        self.api_key = settings.ECOMMERCE_API_KEY
        self.api_url = settings.ECOMMERCE_API_URL
    
    def get_product_by_id(self, product_id: str) -> Optional[Dict[str, Any]]:
        """
        Get product details by ID from the e-commerce API.
        
        Args:
            product_id: Product ID
            
        Returns:
            Product details dictionary or None if not found
        """
        # For MVP, we'll simulate this with a mock implementation
        # In a real app, this would make an API call to the e-commerce platform
        
        try:
            # If the API_URL is set, make a real request
            if self.api_url:
                headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
                response = requests.get(
                    f"{self.api_url}/products/{product_id}",
                    headers=headers
                )
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"Failed to get product {product_id}: {response.status_code}")
                    return None
            
            # Mock implementation for MVP
            return self._mock_get_product(product_id)
            
        except Exception as e:
            logger.error(f"Error getting product {product_id}: {str(e)}")
            return None
    
    def search_products(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Search for products using a text query.
        
        Args:
            query: Search query
            limit: Maximum number of results
            
        Returns:
            List of product dictionaries
        """
        try:
            # If the API_URL is set, make a real request
            if self.api_url:
                headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
                response = requests.get(
                    f"{self.api_url}/products/search",
                    params={"q": query, "limit": limit},
                    headers=headers
                )
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.error(f"Failed to search products: {response.status_code}")
                    return []
            
            # Mock implementation for MVP
            return self._mock_search_products(query, limit)
            
        except Exception as e:
            logger.error(f"Error searching products: {str(e)}")
            return []
    
    def get_multiple_products(self, product_ids: List[str]) -> List[Dict[str, Any]]:
        """
        Get details for multiple products by their IDs.
        
        Args:
            product_ids: List of product IDs
            
        Returns:
            List of product dictionaries
        """
        products = []
        for product_id in product_ids:
            product = self.get_product_by_id(product_id)
            if product:
                products.append(product)
        return products
    
    def _mock_get_product(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Mock implementation for product retrieval"""
        # This is a simplified mock database for the MVP
        # In a real app, this would be replaced with actual API calls
        products = self._get_mock_products()
        
        # Find product by ID
        for product in products:
            if product.get("id") == product_id:
                return product
        
        return None
    
    def _mock_search_products(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Mock implementation for product search"""
        products = self._get_mock_products()
        
        # Simple search by brand, name, and description
        query = query.lower()
        results = []
        
        for product in products:
            brand = product.get("brand", "").lower()
            name = product.get("name", "").lower()
            description = product.get("description", "").lower()
            
            if query in brand or query in name or query in description:
                results.append(product)
                
                if len(results) >= limit:
                    break
        
        return results
    
    def _get_mock_products(self) -> List[Dict[str, Any]]:
        """Get mock product data for MVP"""
        return [
            {
                "id": "clothing_1",
                "external_id": "12345",
                "brand": "FashionBrand",
                "name": "Classic White T-Shirt",
                "category": "Shirts",
                "description": "A comfortable classic white t-shirt made from 100% cotton.",
                "price": 19.99,
                "currency": "USD",
                "image_url": "https://example.com/images/white-tshirt.jpg",
                "product_url": "https://example.com/products/white-tshirt"
            },
            {
                "id": "clothing_2",
                "external_id": "23456",
                "brand": "DenimCo",
                "name": "Slim Fit Jeans",
                "category": "Pants",
                "description": "Stylish slim fit jeans in dark blue wash.",
                "price": 49.99,
                "currency": "USD",
                "image_url": "https://example.com/images/slim-jeans.jpg",
                "product_url": "https://example.com/products/slim-jeans"
            },
            {
                "id": "clothing_3",
                "external_id": "34567",
                "brand": "SportyLife",
                "name": "Athletic Jacket",
                "category": "Outerwear",
                "description": "Lightweight athletic jacket perfect for running and workouts.",
                "price": 59.99,
                "currency": "USD",
                "image_url": "https://example.com/images/athletic-jacket.jpg",
                "product_url": "https://example.com/products/athletic-jacket"
            },
            {
                "id": "clothing_4",
                "external_id": "45678",
                "brand": "LuxuryWear",
                "name": "Cashmere Sweater",
                "category": "Sweaters",
                "description": "Premium cashmere sweater in navy blue.",
                "price": 129.99,
                "currency": "USD",
                "image_url": "https://example.com/images/cashmere-sweater.jpg",
                "product_url": "https://example.com/products/cashmere-sweater"
            },
            {
                "id": "clothing_5",
                "external_id": "56789",
                "brand": "StreetStyle",
                "name": "Graphic Hoodie",
                "category": "Sweatshirts",
                "description": "Urban graphic hoodie with street art design.",
                "price": 39.99,
                "currency": "USD",
                "image_url": "https://example.com/images/graphic-hoodie.jpg",
                "product_url": "https://example.com/products/graphic-hoodie"
            },
        ]

# Singleton instance of the e-commerce service
_ecommerce_service = None

def get_ecommerce_service() -> EcommerceService:
    """Get singleton instance of EcommerceService"""
    global _ecommerce_service
    if _ecommerce_service is None:
        _ecommerce_service = EcommerceService()
    return _ecommerce_service
