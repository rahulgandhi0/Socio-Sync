const express = require('express');
const router = express.Router();
const ticketmasterService = require('../services/ticketmasterService');

/**
 * @route GET /api/events/cities
 * @desc Get list of major US cities
 */
router.get('/cities', (req, res) => {
  try {
    const cities = ticketmasterService.getMajorUSCities();
    res.json(cities);
  } catch (error) {
    console.error('Error getting cities:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route GET /api/events/categories
 * @desc Get list of event categories
 */
router.get('/categories', (req, res) => {
  try {
    const categories = ticketmasterService.getEventCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route POST /api/events/search
 * @desc Search for events using Ticketmaster API
 */
router.post('/search', async (req, res) => {
  try {
    const { city, startDateTime, endDateTime, categoryId, size } = req.body;
    
    if (!city) {
      return res.status(400).json({ message: 'Please select a city' });
    }
    
    const events = await ticketmasterService.searchEvents({
      city,
      startDateTime,
      endDateTime,
      categoryId,
      size
    });
    
    res.json(events);
  } catch (error) {
    console.error('Error in events search route:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route GET /api/events/:id
 * @desc Get event details by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Event ID is required' });
    }
    
    const event = await ticketmasterService.getEventById(id);
    res.json(event);
  } catch (error) {
    console.error('Error in event details route:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 