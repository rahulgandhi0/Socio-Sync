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
    
    // Extract description - clean up to remove excessive whitespace
    let description = '';
    $('.eds-text--left').each(function() {
      const text = $(this).text().trim();
      if (text && text.length > description.length) {
        description = text;
      }
    });
    
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
    
    // Improved location extraction with better filtering
    let venueName = '';
    let venueAddress = '';
    let city = '';
    
    // Look for location information in structured data
    const structuredData = $('script[type="application/ld+json"]').html();
    if (structuredData) {
      try {
        const jsonData = JSON.parse(structuredData);
        if (jsonData.location) {
          if (jsonData.location.name) {
            venueName = jsonData.location.name;
          }
          if (jsonData.location.address) {
            if (typeof jsonData.location.address === 'object') {
              venueAddress = [
                jsonData.location.address.streetAddress,
                jsonData.location.address.addressLocality,
                jsonData.location.address.addressRegion,
                jsonData.location.address.postalCode
              ].filter(Boolean).join(', ');
              
              city = jsonData.location.address.addressLocality || '';
            } else if (typeof jsonData.location.address === 'string') {
              venueAddress = jsonData.location.address;
              // Try to extract city from address string
              const cityMatch = venueAddress.match(/([^,]+),\s*([A-Z]{2})/);
              if (cityMatch) {
                city = cityMatch[1].trim();
              }
            }
          }
        }
      } catch (e) {
        console.log('Error parsing structured data:', e);
      }
    }
    
    // If structured data didn't work, try DOM-based extraction
    if (!venueName) {
      // Look for location section
      let locationText = '';
      $('*:contains("Location")').each(function() {
        const $element = $(this);
        // Skip elements with too much text (likely not a header)
        if ($element.text().length > 30) return;
        
        // Get parent elements to find nearby location data
        const $parent = $element.parent().parent();
        const fullText = $parent.text().trim();
        
        if (fullText.includes('Location') && fullText.length < 200) {
          locationText = fullText;
        }
      });
      
      // Parse location text if found
      if (locationText) {
        // Extract venue name from location text
        // Common pattern: "LocationVENUE_NAME ADDRESS"
        const locationMatch = locationText.match(/Location\s*([^0-9,]+)/i);
        if (locationMatch) {
          venueName = locationMatch[1].trim();
        } else {
          // Try another pattern: look for venue name after "Location"
          const venueMatch = locationText.match(/Location\s*([^,\n]+)/i);
          if (venueMatch) {
            venueName = venueMatch[1].trim();
          }
        }
      }
      
      // If we still don't have venue info, try a more direct approach
      if (!venueName) {
        // Look for venue name in the title or nearby elements
        const titleParts = title.split('@');
        if (titleParts.length > 1) {
          venueName = titleParts[1].split('-')[0].trim();
        }
      }
    }
    
    // Clean up venue name
    if (venueName) {
      // Remove any CSS or HTML artifacts
      venueName = venueName.replace(/\.css-[a-z0-9]+/g, '')
                          .replace(/{[^}]+}/g, '')
                          .replace(/\s+/g, ' ')
                          .trim();
      
      // Remove "Location" prefix if it exists
      venueName = venueName.replace(/^Location\s*/i, '');
      
      // Extract just the venue name if it contains address
      if (venueName.includes('Street') || venueName.includes('Avenue') || venueName.includes('Blvd') || 
          venueName.includes('St ') || venueName.includes('Ave ') || venueName.includes('Rd ') ||
          /\d+\s+[A-Za-z]/.test(venueName)) {
        
        // If venue name contains a street number, extract just the venue part
        const streetNumberMatch = venueName.match(/^([^0-9]+)(\d+.+)/);
        if (streetNumberMatch) {
          venueName = streetNumberMatch[1].trim();
        } else {
          // Try to extract venue name before any address indicators
          const streetMatch = venueName.match(/^(.+?)(?=\s+\d+|\s+Street|\s+St|\s+Avenue|\s+Ave|\s+Road|\s+Rd|\s+Boulevard|\s+Blvd|\s+Lane|\s+Ln|\s+Drive|\s+Dr|\s+Court|\s+Ct|\s+Plaza|\s+Plz|\s+Square|\s+Sq|\s+Highway|\s+Hwy|\s+Parkway|\s+Pkwy|\s+Way|\s+Terrace|\s+Ter|\s+Place|\s+Pl)/i);
          if (streetMatch) {
            venueName = streetMatch[1].trim();
          }
        }
      }
      
      // Remove "Show map" text if present
      venueName = venueName.replace(/\s*Show\s*map\s*$/i, '').trim();
      
      // Remove any state abbreviations at the end (e.g., "PA", "NY")
      venueName = venueName.replace(/\s+[A-Z]{2}\s*$/i, '').trim();
      
      // Remove zip codes
      venueName = venueName.replace(/\s+\d{5}(-\d{4})?\s*$/i, '').trim();
      
      // Remove city names that might be at the end of venue name
      if (city) {
        venueName = venueName.replace(new RegExp(`\\s+${city}\\s*$`, 'i'), '').trim();
      }
      
      // COMPLETELY NEW APPROACH: Direct string manipulation to ensure no trailing commas
      // First, remove all trailing punctuation of any kind
      venueName = venueName.replace(/[\s,.:;!?'")\]}>-]+$/, '').trim();
      
      // Second, split by comma and take just the first part if there are multiple parts
      if (venueName.includes(',')) {
        venueName = venueName.split(',')[0].trim();
      }
      
      // Final cleanup to ensure no trailing punctuation remains
      venueName = venueName.replace(/[\s,.:;!?'")\]}>-]+$/, '').trim();
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
        name: venueName || 'Online Event'
      },
      organizer,
      ticketAvailability: true, // Default to true since we're viewing an active event page
      imageUrl
    };

    console.log('Scraped event venue:', event.venue);
    
    // Additional debug log to verify no trailing commas
    console.log('Final venue name (length: ' + event.venue.name.length + '):', JSON.stringify(event.venue.name));
    
    return event;
  } catch (error) {
    console.error('Error scraping Eventbrite event:', error);
    throw new Error(`Failed to scrape event: ${error.message}`);
  }
}

module.exports = {
  scrapeEventbriteEvent
}; 