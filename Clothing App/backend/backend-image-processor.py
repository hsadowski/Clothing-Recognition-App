import io
import os
from pathlib import Path
from typing import Tuple, Union

import numpy as np
from PIL import Image
import torch
from torchvision import transforms
from app.core.config import settings

# Image preprocessing constants
IMAGE_SIZE = 224  # CLIP model expects 224x224 images
MEAN = [0.48145466, 0.4578275, 0.40821073]
STD = [0.26862954, 0.26130258, 0.27577711]

# Set up image transformations for CLIP model
preprocess = transforms.Compose([
    transforms.Resize(IMAGE_SIZE, interpolation=transforms.InterpolationMode.BICUBIC),
    transforms.CenterCrop(IMAGE_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(mean=MEAN, std=STD)
])

def save_uploaded_image(file_bytes: bytes, filename: str) -> Path:
    """
    Save an uploaded image file to disk.
    
    Args:
        file_bytes: Image file bytes
        filename: Original filename
        
    Returns:
        Path to the saved file
    """
    # Create unique filename to avoid collisions
    timestamp = int(os.path.getmtime(settings.UPLOAD_FOLDER) if os.path.exists(settings.UPLOAD_FOLDER) else 0)
    unique_filename = f"{timestamp}_{filename}"
    file_path = settings.UPLOAD_FOLDER / unique_filename
    
    # Save the file
    with open(file_path, "wb") as f:
        f.write(file_bytes)
    
    return file_path

def preprocess_image(image_path: Union[str, Path]) -> torch.Tensor:
    """
    Preprocess an image for use with the CLIP model.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Preprocessed image tensor
    """
    # Open and convert the image
    image = Image.open(image_path).convert("RGB")
    
    # Apply preprocessing
    image_tensor = preprocess(image)
    
    # Add batch dimension
    image_tensor = image_tensor.unsqueeze(0)
    
    return image_tensor

def extract_region_of_interest(image_path: Union[str, Path]) -> Tuple[Image.Image, Tuple[int, int, int, int]]:
    """
    Extract the main clothing item from an image (simplified version).
    In a real app, this would use object detection to identify clothing items.
    
    Args:
        image_path: Path to the image file
        
    Returns:
        Cropped image and bounding box (left, top, right, bottom)
    """
    # In a real app, this would use a clothing detection model
    # For MVP, we'll just use the center crop as a simplification
    
    image = Image.open(image_path).convert("RGB")
    width, height = image.size
    
    # Simple center crop (60% of the image)
    crop_percentage = 0.6
    left = width * (1 - crop_percentage) // 2
    top = height * (1 - crop_percentage) // 2
    right = left + width * crop_percentage
    bottom = top + height * crop_percentage
    
    bbox = (int(left), int(top), int(right), int(bottom))
    cropped_img = image.crop(bbox)
    
    return cropped_img, bbox

def normalize_image(image: Image.Image) -> Image.Image:
    """
    Apply normalization to handle varied lighting conditions.
    
    Args:
        image: Input PIL Image
        
    Returns:
        Normalized image
    """
    # Convert to numpy array for processing
    img_array = np.array(image).astype(np.float32)
    
    # Simple contrast normalization
    for i in range(3):  # For each RGB channel
        channel = img_array[:, :, i]
        min_val = np.min(channel)
        max_val = np.max(channel)
        if max_val > min_val:
            img_array[:, :, i] = (channel - min_val) * (255.0 / (max_val - min_val))
    
    # Convert back to PIL Image
    normalized_img = Image.fromarray(np.uint8(img_array))
    return normalized_img

def augment_image(image: Image.Image, num_augmentations: int = 3) -> list:
    """
    Create augmentations of the image to improve matching.
    
    Args:
        image: Input PIL Image
        num_augmentations: Number of augmented images to create
        
    Returns:
        List of augmented images
    """
    augmentations = [image]  # Start with the original image
    
    # Basic augmentations
    augmentation_transforms = [
        transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1, hue=0.05),
        transforms.RandomAffine(degrees=0, translate=(0.05, 0.05), scale=(0.95, 1.05)),
        transforms.RandomPerspective(distortion_scale=0.05, p=1.0),
    ]
    
    # Apply each augmentation
    for i in range(min(num_augmentations, len(augmentation_transforms))):
        aug_img = augmentation_transforms[i](image)
        augmentations.append(aug_img)
    
    return augmentations
