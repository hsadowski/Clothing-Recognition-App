/**
 * API service for communicating with the backend
 */

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Default request headers
let headers = {
  'Content-Type': 'application/json',
};

// API error class
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/**
 * Set the authentication token for API requests
 * @param {string} token - JWT token
 */
const setAuthToken = (token) => {
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    delete headers['Authorization'];
  }
};

/**
 * Make an API request
 * @param {string} endpoint - API endpoint
 * @param {object} options - Request options
 * @returns {Promise<any>} - Response data
 */
const request = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };
    
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();
    
    if (!response.ok) {
      // Handle API error
      const message = isJson && data.detail ? data.detail : 'An error occurred';
      throw new ApiError(message, response.status);
    }
    
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(error.message || 'Network error', 0);
    }
  }
};

/**
 * User authentication API
 */
const auth = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - Login response with token
   */
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    return request('/auth/login', {
      method: 'POST',
      headers: {
        // Don't include Content-Type for FormData
      },
      body: formData,
    });
  },
  
  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} - User profile
   */
  register: async (email, password) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  /**
   * Get current user profile
   * @returns {Promise<object>} - User profile
   */
  getUserProfile: async () => {
    return request('/auth/me');
  },
};

/**
 * Image API
 */
const images = {
  /**
   * Upload an image
   * @param {File} file - Image file
   * @returns {Promise<object>} - Upload response
   */
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return request('/images/upload', {
      method: 'POST',
      headers: {
        // Don't include Content-Type for FormData
      },
      body: formData,
    });
  },
};

/**
 * Products API
 */
const products = {
  /**
   * Search for products using an image
   * @param {string} imageId - Image ID
   * @param {object} options - Search options
   * @returns {Promise<object>} - Search results
   */
  searchByImage: async (imageId, options = {}) => {
    const { limit = 5, threshold = 0.5 } = options;
    return request(`/products/search/${imageId}?limit=${limit}&threshold=${threshold}`);
  },
  
  /**
   * Get product details
   * @param {string} productId - Product ID
   * @returns {Promise<object>} - Product details
   */
  getProductDetails: async (productId) => {
    return request(`/products/${productId}`);
  },
  
  /**
   * Get user's search history
   * @param {number} limit - Maximum number of results
   * @returns {Promise<Array>} - Search history
   */
  getSearchHistory: async (limit = 10) => {
    return request(`/products/history?limit=${limit}`);
  },
};

// Export API service
const api = {
  setAuthToken,
  login: auth.login,
  register: auth.register,
  getUserProfile: auth.getUserProfile,
  uploadImage: images.uploadImage,
  searchByImage: products.searchByImage,
  getProductDetails: products.getProductDetails,
  getSearchHistory: products.getSearchHistory,
};

export default api;
