import os
import json
import numpy as np
import faiss
from typing import List, Dict, Tuple, Any, Optional
from pathlib import Path
import pickle

from app.core.config import settings
from app.db.models import Product
from sqlalchemy.orm import Session

class VectorSearch:
    def __init__(self, vector_dim: int = 512):
        """
        Initialize the FAISS index for vector similarity search.
        
        Args:
            vector_dim: Dimension of feature vectors (512 for CLIP ViT-B/32)
        """
        self.vector_dim = vector_dim
        self.index = None
        self.product_ids = []
        self.index_path = settings.VECTOR_INDEX_PATH / "product_index.faiss"
        self.product_ids_path = settings.VECTOR_INDEX_PATH / "product_ids.pkl"
        
        # Load index if it exists
        self.load_index()
    
    def load_index(self) -> None:
        """Load the FAISS index from disk if it exists"""
        if os.path.exists(self.index_path) and os.path.exists(self.product_ids_path):
            try:
                # Load FAISS index
                self.index = faiss.read_index(str(self.index_path))
                
                # Load product IDs
                with open(self.product_ids_path, 'rb') as f:
                    self.product_ids = pickle.load(f)
                    
                print(f"Loaded FAISS index with {len(self.product_ids)} products")
            except Exception as e:
                print(f"Error loading index: {e}")
                self.create_empty_index()
        else:
            self.create_empty_index()
    
    def create_empty_index(self) -> None:
        """Create a new empty FAISS index"""
        self.index = faiss.IndexFlatIP(self.vector_dim)  # Inner product (cosine similarity for normalized vectors)
        self.product_ids = []
        print("Created new empty FAISS index")
    
    def save_index(self) -> None:
        """Save the FAISS index to disk"""
        if self.index is not None:
            os.makedirs(settings.VECTOR_INDEX_PATH, exist_ok=True)
            
            # Save FAISS index
            faiss.write_index(self.index, str(self.index_path))
            
            # Save product IDs
            with open(self.product_ids_path, 'wb') as f:
                pickle.dump(self.product_ids, f)
                
            print(f"Saved FAISS index with {len(self.product_ids)} products")
    
    def add_product(self, product_id: int, feature_vector: np.ndarray) -> None:
        """
        Add a product feature vector to the index.
        
        Args:
            product_id: Product ID
            feature_vector: Feature vector as a numpy array
        """
        if self.index is None:
            self.create_empty_index()
        
        # Ensure the vector is a 2D array with shape (1, vector_dim)
        vector = feature_vector.reshape(1, -1).astype(np.float32)
        
        # Add to index
        self.index.add(vector)
        self.product_ids.append(product_id)
    
    def remove_product(self, product_id: int) -> bool:
        """
        Remove a product from the index.
        In FAISS we can't directly remove vectors, so we rebuild the index.
        
        Args:
            product_id: Product ID to remove
            
        Returns:
            True if successful, False otherwise
        """
        if product_id not in self.product_ids:
            return False
        
        # Get all vectors except the one to remove
        indices_to_keep = [i for i, pid in enumerate(self.product_ids) if pid != product_id]
        if not indices_to_keep:
            self.create_empty_index()
            return True
        
        if self.index is None or self.index.ntotal == 0:
            return False
        
        # Get vectors to keep
        vectors_to_keep = np.vstack([self.index.reconstruct(i) for i in indices_to_keep])
        product_ids_to_keep = [self.product_ids[i] for i in indices_to_keep]
        
        # Create new index
        new_index = faiss.IndexFlatIP(self.vector_dim)
        new_index.add(vectors_to_keep)
        
        # Update index and product IDs
        self.index = new_index
        self.product_ids = product_ids_to_keep
        
        return True
    
    def search(self, query_vector: np.ndarray, k: int = 5) -> List[Tuple[int, float]]:
        """
        Search for similar products using a query vector.
        
        Args:
            query_vector: Query feature vector
            k: Number of results to return
            
        Returns:
            List of (product_id, similarity_score) tuples
        """
        if self.index is None or self.index.ntotal == 0:
            return []
        
        # Ensure the vector is a 2D array with shape (1, vector_dim)
        vector = query_vector.reshape(1, -1).astype(np.float32)
        
        # Search the index
        scores, indices = self.index.search(vector, min(k, self.index.ntotal))
        
        # Return product IDs and scores
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.product_ids):
                results.append((self.product_ids[idx], float(scores[0][i])))
        
        return results
    
    def update_index_from_db(self, db: Session) -> None:
        """
        Update the index using products from the database.
        
        Args:
            db: Database session
        """
        # Get all products with feature vectors
        products = db.query(Product).filter(Product.feature_vector.isnot(None)).all()
        
        # Create new index
        self.create_empty_index()
        
        # Add each product to the index
        for product in products:
            # Deserialize feature vector from text
            feature_vector = np.array(json.loads(product.feature_vector), dtype=np.float32)
            
            # Add to index
            self.add_product(product.id, feature_vector)
        
        # Save the index
        self.save_index()
        
        print(f"Updated index with {len(products)} products from database")

# Singleton instance of the vector search
_vector_search = None

def get_vector_search() -> VectorSearch:
    """Get singleton instance of VectorSearch"""
    global _vector_search
    if _vector_search is None:
        _vector_search = VectorSearch()
    return _vector_search
