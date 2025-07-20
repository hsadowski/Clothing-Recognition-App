import torch
import clip
import numpy as np
from typing import Union, List
from pathlib import Path
from PIL import Image

from app.core.config import settings
from app.ml.image_processor import preprocess_image, extract_region_of_interest, normalize_image, augment_image

class FeatureExtractor:
    def __init__(self):
        """Initialize the CLIP model for feature extraction"""
        # Load CLIP model
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model, _ = clip.load("ViT-B/32", device=self.device)
        self.model.eval()  # Set to evaluation mode
        print(f"Loaded CLIP model on {self.device}")

    def extract_features(self, image_path: Union[str, Path]) -> np.ndarray:
        """
        Extract visual features from an image using CLIP.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Feature vector as a numpy array
        """
        # Preprocess the image
        image_tensor = preprocess_image(image_path)
        image_tensor = image_tensor.to(self.device)
        
        # Extract features
        with torch.no_grad():
            features = self.model.encode_image(image_tensor)
            
        # Normalize feature vector to unit length
        features = features / features.norm(dim=-1, keepdim=True)
        
        # Convert to numpy array
        features_np = features.cpu().numpy().astype(np.float32).flatten()
        
        return features_np

    def extract_clothing_features(self, image_path: Union[str, Path]) -> np.ndarray:
        """
        Extract features from the main clothing item in the image.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Feature vector as a numpy array
        """
        # Extract region of interest
        clothing_item, _ = extract_region_of_interest(image_path)
        
        # Normalize image lighting
        normalized_img = normalize_image(clothing_item)
        
        # Create temporary file to save normalized image
        temp_path = settings.UPLOAD_FOLDER / "temp_clothing_item.jpg"
        normalized_img.save(temp_path)
        
        # Extract features
        features = self.extract_features(temp_path)
        
        # Clean up
        temp_path.unlink(missing_ok=True)
        
        return features

    def extract_features_with_augmentation(self, image_path: Union[str, Path]) -> List[np.ndarray]:
        """
        Extract features from original and augmented versions of the image.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            List of feature vectors
        """
        # Extract region of interest
        clothing_item, _ = extract_region_of_interest(image_path)
        
        # Normalize image
        normalized_img = normalize_image(clothing_item)
        
        # Generate augmentations
        augmented_images = augment_image(normalized_img, num_augmentations=3)
        
        # Extract features from each augmentation
        feature_vectors = []
        for i, aug_img in enumerate(augmented_images):
            # Save temporary image
            temp_path = settings.UPLOAD_FOLDER / f"temp_aug_{i}.jpg"
            aug_img.save(temp_path)
            
            # Extract features
            features = self.extract_features(temp_path)
            feature_vectors.append(features)
            
            # Clean up
            temp_path.unlink(missing_ok=True)
        
        return feature_vectors

# Singleton instance of the feature extractor
_feature_extractor = None

def get_feature_extractor() -> FeatureExtractor:
    """Get singleton instance of FeatureExtractor"""
    global _feature_extractor
    if _feature_extractor is None:
        _feature_extractor = FeatureExtractor()
    return _feature_extractor
