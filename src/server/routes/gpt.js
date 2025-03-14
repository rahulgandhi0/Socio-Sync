const express = require('express');
const router = express.Router();
const gptService = require('../services/gptService');

/**
 * @route POST /api/captions/generate
 * @desc Generate a social media caption based on event details or image
 */
router.post('/generate', async (req, res) => {
  try {
    const { data, type } = req.body;
    
    // Validate required parameters
    if (!data) {
      return res.status(400).json({ message: 'Data is required' });
    }
    
    if (!type || (type !== 'event' && type !== 'image')) {
      return res.status(400).json({ message: 'Valid type is required (event or image)' });
    }
    
    const caption = await gptService.generateCaption(data, type);
    res.json({ caption });
  } catch (error) {
    console.error('Error in caption generation route:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 