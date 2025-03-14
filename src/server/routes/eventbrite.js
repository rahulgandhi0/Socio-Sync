const express = require('express');
const router = express.Router();
const eventbriteService = require('../services/eventbriteService');

/**
 * @route GET /api/events/search
 * @desc Search for events based on city, date range, and category
 */
router.get('/search', async (req, res) => {
  try {
    const { city, startDate, endDate, category } = req.query;
    
    // Validate required parameters
    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }
    
    // Format dates if provided, otherwise use defaults
    const formattedStartDate = startDate ? new Date(startDate).toISOString() : new Date().toISOString();
    const defaultEndDate = new Date();
    defaultEndDate.setMonth(defaultEndDate.getMonth() + 3); // Default to 3 months from now
    const formattedEndDate = endDate ? new Date(endDate).toISOString() : defaultEndDate.toISOString();
    
    const events = await eventbriteService.searchEvents(
      city,
      formattedStartDate,
      formattedEndDate,
      category || ''
    );
    
    res.json(events);
  } catch (error) {
    console.error('Error in events search route:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route GET /api/events/categories
 * @desc Get all event categories
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await eventbriteService.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error in categories route:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 