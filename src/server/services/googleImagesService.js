const axios = require('axios');

// Using environment variables for Google API key and Search Engine ID
const GOOGLE_API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;
const BASE_URL = 'https://www.googleapis.com/customsearch/v1';

/**
 * Search for images based on query and image requirements
 * @param {string} query - Search query
 * @param {Object} imageRequirements - Image requirements (aspectRatio, quality)
 * @returns {Promise<Array>} - List of images
 */
async function searchImages(query, imageRequirements = {}) {
  try {
    const { aspectRatio = 'wide' } = imageRequirements;
    
    // Map aspect ratio to Google's imgSize parameter
    let imgSize;
    if (aspectRatio === 'square') {
      imgSize = 'medium';
    } else if (aspectRatio === 'wide') {
      imgSize = 'xlarge';
    } else if (aspectRatio === 'tall') {
      imgSize = 'large';
    } else {
      imgSize = 'xlarge'; // default
    }
    
    const response = await axios.get(BASE_URL, {
      params: {
        key: GOOGLE_API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: query,
        searchType: 'image',
        imgSize: imgSize,
        imgType: 'photo', // Always use high quality photos
        num: 10, // Get top 10 images
        safe: 'off' // Disable safe search
      }
    });
    
    if (!response.data.items || response.data.items.length === 0) {
      return [];
    }
    
    return response.data.items.map(item => ({
      title: item.title,
      link: item.link,
      thumbnail: item.image.thumbnailLink,
      context: item.image.contextLink,
      width: item.image.width,
      height: item.image.height
    }));
  } catch (error) {
    console.error('Error fetching images from Google:', error.response?.data || error.message);
    throw new Error('Failed to fetch images from Google');
  }
}

module.exports = {
  searchImages
}; 