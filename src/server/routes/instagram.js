const express = require('express');
const router = express.Router();
const axios = require('axios');

// Instagram Graph API base URL
const INSTAGRAM_API_URL = 'https://graph.facebook.com/v18.0';

// Middleware to check for required Instagram credentials
const requireInstagramAuth = (req, res, next) => {
  const { INSTAGRAM_USER_ID, INSTAGRAM_ACCESS_TOKEN } = process.env;
  
  if (!INSTAGRAM_USER_ID || !INSTAGRAM_ACCESS_TOKEN) {
    return res.status(401).json({ 
      error: 'Instagram credentials not configured' 
    });
  }
  
  // Trim any whitespace from the access token
  req.instagramUserId = INSTAGRAM_USER_ID.trim();
  req.instagramAccessToken = INSTAGRAM_ACCESS_TOKEN.trim();
  next();
};

// Create single image post
router.post('/media/single', requireInstagramAuth, async (req, res) => {
  try {
    const { instagramUserId, instagramAccessToken } = req;
    const { image_url, caption, user_tags, location_id, collaborators } = req.body;
    
    const response = await axios.post(
      `${INSTAGRAM_API_URL}/${instagramUserId}/media`,
      {
        media_type: 'IMAGE',
        image_url,
        caption,
        user_tags,
        location_id,
        collaborators,
        access_token: instagramAccessToken
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error creating single image post:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to create single image post',
      details: error.response?.data
    });
  }
});

// Create carousel item
router.post('/media/carousel-item', requireInstagramAuth, async (req, res) => {
  try {
    const { instagramUserId, instagramAccessToken } = req;
    const { image_url } = req.body;
    
    const response = await axios.post(
      `${INSTAGRAM_API_URL}/${instagramUserId}/media`,
      {
        media_type: 'IMAGE',
        image_url,
        is_carousel_item: true,
        access_token: instagramAccessToken
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error creating carousel item:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to create carousel item',
      details: error.response?.data
    });
  }
});

// Create carousel container
router.post('/media/carousel', requireInstagramAuth, async (req, res) => {
  try {
    const { instagramUserId, instagramAccessToken } = req;
    const { children, caption, user_tags, location_id, collaborators } = req.body;
    
    const response = await axios.post(
      `${INSTAGRAM_API_URL}/${instagramUserId}/media`,
      {
        media_type: 'CAROUSEL',
        children,
        caption,
        user_tags,
        location_id,
        collaborators,
        access_token: instagramAccessToken
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error creating carousel container:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to create carousel container',
      details: error.response?.data
    });
  }
});

// Publish media
router.post('/media_publish', requireInstagramAuth, async (req, res) => {
  try {
    const { instagramUserId, instagramAccessToken } = req;
    const { creation_id } = req.body;
    
    const response = await axios.post(
      `${INSTAGRAM_API_URL}/${instagramUserId}/media_publish`,
      {
        creation_id,
        access_token: instagramAccessToken
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error publishing media:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to publish media',
      details: error.response?.data
    });
  }
});

// Check media status
router.get('/media/:containerId', requireInstagramAuth, async (req, res) => {
  try {
    const { instagramAccessToken } = req;
    const { containerId } = req.params;
    
    const response = await axios.get(
      `${INSTAGRAM_API_URL}/${containerId}`,
      {
        params: {
          fields: 'id,status_code,status',
          access_token: instagramAccessToken
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error checking media status:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to check media status',
      details: error.response?.data
    });
  }
});

// Search locations using Facebook Pages API
router.get('/locations/search', requireInstagramAuth, async (req, res) => {
  try {
    const { instagramAccessToken } = req;
    const { query } = req.query;
    
    const response = await axios.get(
      `${INSTAGRAM_API_URL}/pages/search`,
      {
        params: {
          q: query,
          fields: 'id,name,location',
          type: 'place',
          access_token: instagramAccessToken
        }
      }
    );
    
    // Filter results to only include places with location data
    const locations = response.data.data.filter(page => page.location);
    
    res.json(locations);
  } catch (error) {
    console.error('Error searching locations:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to search locations',
      details: error.response?.data
    });
  }
});

// Check publishing limit
router.get('/publishing_limit', requireInstagramAuth, async (req, res) => {
  try {
    const { instagramUserId, instagramAccessToken } = req;
    
    const response = await axios.get(
      `${INSTAGRAM_API_URL}/${instagramUserId}/content_publishing_limit`,
      {
        params: {
          fields: 'quota_usage,quota_total',
          access_token: instagramAccessToken
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error checking publishing limit:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to check publishing limit',
      details: error.response?.data
    });
  }
});

module.exports = router; 