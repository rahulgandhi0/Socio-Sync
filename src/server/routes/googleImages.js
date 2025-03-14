const express = require('express');
const router = express.Router();
const googleImagesService = require('../services/googleImagesService');

/**
 * @route GET /api/images/search
 * @desc Search for images based on query and image requirements
 */
router.get('/search', async (req, res) => {
  try {
    const { query, aspectRatio, quality } = req.query;
    
    // Validate required parameters
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const imageRequirements = {
      aspectRatio: aspectRatio || 'wide',
      quality: quality || 'high'
    };
    
    const images = await googleImagesService.searchImages(query, imageRequirements);
    res.json(images);
  } catch (error) {
    console.error('Error in images search route:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 