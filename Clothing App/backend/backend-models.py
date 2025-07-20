from datetime import datetime
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Float, Text, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    searches = relationship("SearchHistory", back_populates="user")

class SearchHistory(Base):
    __tablename__ = "search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_path = Column(String)
    search_date = Column(DateTime, default=datetime.utcnow)
    results = relationship("SearchResult", back_populates="search")
    
    user = relationship("User", back_populates="searches")

class SearchResult(Base):
    __tablename__ = "search_results"
    
    id = Column(Integer, primary_key=True, index=True)
    search_id = Column(Integer, ForeignKey("search_history.id"))
    product_id = Column(String, index=True)
    similarity_score = Column(Float)
    result_data = Column(JSON)  # Store product details (brand, model, price, etc.)
    
    search = relationship("SearchHistory", back_populates="results")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, index=True)  # ID from e-commerce API
    brand = Column(String, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    currency = Column(String, default="USD")
    image_url = Column(String)
    product_url = Column(String)
    feature_vector = Column(Text)  # Serialized feature vector for FAISS
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
