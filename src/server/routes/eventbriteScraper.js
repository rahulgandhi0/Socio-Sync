const express = require('express');
const router = express.Router();
const eventbriteScraper = require('../services/eventbriteScraper');

/**
 * @route POST /api/scraper/eventbrite
 * @desc Scrape event details from an Eventbrite URL
 */
router.post('/eventbrite', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'Eventbrite URL is required' });
    }
    
    const event = await eventbriteScraper.scrapeEventbriteEvent(url);
    res.json(event);
  } catch (error) {
    console.error('Error in scraper route:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 