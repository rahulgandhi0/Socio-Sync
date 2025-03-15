const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrape event details from an Eventbrite event page URL
 * @param {string} url - The Eventbrite event URL to scrape
 * @returns {Promise<Object>} - Event details extracted from the page
 */
async function scrapeEventbriteEvent(url) {
  try {
    // Validate URL format
    if (!url || !url.includes('eventbrite.com/e/')) {
      throw new Error('Invalid Eventbrite event URL');
    }

    // Fetch the HTML content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract event details
    const title = $('h1').first().text().trim();
    
    // Extract description
    const description = $('.eds-text--left').text().trim();
    
    // Extract date information
    const dateText = $('.date-info').text().trim() || 
                    $('.eds-event-details__formatted-date').text().trim();
    
    // Parse date information
    let startDate = new Date();
    let endDate = new Date();
    
    // Try to find date information in various formats
    const dateMatch = dateText.match(/(\w+ \d+, \d{4})/);
    if (dateMatch) {
      startDate = new Date(dateMatch[0]);
      endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 3); // Default to 3 hours if no end time
    }
    
    // Extract venue information
    const venueName = $('.location-info .location-address').first().text().trim() || 
                     $('.eds-event-details__sub-section--venue .eds-text-color--grey-600').text().trim();
    
    const venueAddress = $('.location-info .location-address-line2').text().trim() || 
                        $('.eds-event-details__sub-section--venue .eds-text-color--grey-600').eq(1).text().trim();
    
    // Extract city from address
    let city = 'Unknown';
    const cityMatch = venueAddress.match(/([^,]+),\s*([A-Z]{2})/);
    if (cityMatch) {
      city = cityMatch[1].trim();
    }
    
    // Extract organizer
    const organizer = $('.eds-event-details__sub-section--organizer .eds-text-color--grey-600').text().trim();
    
    // Extract image URL
    const imageUrl = $('meta[property="og:image"]').attr('content') || 
                    $('.eds-event-details-page__image').find('img').attr('src');
    
    // Construct the event object
    const event = {
      id: url.split('/').pop().split('?')[0], // Extract ID from URL
      title,
      description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      url,
      venue: {
        name: venueName,
        address: venueAddress,
        city
      },
      organizer,
      ticketAvailability: true, // Default to true since we're viewing an active event page
      imageUrl
    };

    return event;
  } catch (error) {
    console.error('Error scraping Eventbrite event:', error);
    throw new Error(`Failed to scrape event: ${error.message}`);
  }
}

module.exports = {
  scrapeEventbriteEvent
}; 