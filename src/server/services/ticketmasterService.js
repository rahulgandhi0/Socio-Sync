const axios = require('axios');

/**
 * Get list of major US cities
 * @returns {Array<string>} List of city names
 */
const getMajorUSCities = () => [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'Fort Worth', 'San Francisco', 'Charlotte',
  'Seattle', 'Denver', 'Washington DC', 'Boston', 'Las Vegas',
  'Miami', 'Atlanta', 'Nashville', 'Portland', 'New Orleans'
];

/**
 * Get list of event categories
 * @returns {Array<Object>} List of categories with id and name
 */
const getEventCategories = () => [
  { id: 'KZFzniwnSyZfZ7v7nJ', name: 'Music' },
  { id: 'KZFzniwnSyZfZ7v7nJ&classificationName=Pop', name: 'Top Concerts' },
  { id: 'KZFzniwnSyZfZ7v7na', name: 'Arts & Theatre' },
  { id: 'KZFzniwnSyZfZ7v7n1&subGenreId=KZFzniwnSyZfZ7vAe1', name: 'Comedy Shows' },
  { id: 'KZFzniwnSyZfZ7v7nE', name: 'Sports' },
  { id: 'KZFzniwnSyZfZ7v7nn', name: 'Film' },
  { id: 'KZFzniwnSyZfZ7v7n1', name: 'Miscellaneous' }
];

/**
 * Search for events using the Ticketmaster API
 * @param {Object} params - Search parameters
 * @param {string} params.city - City name
 * @param {string} params.startDateTime - Start date (ISO format)
 * @param {string} params.endDateTime - End date (ISO format)
 * @param {string} params.categoryId - Category ID
 * @param {number} params.size - Number of results to return
 * @returns {Promise<Array>} - List of events
 */
async function searchEvents(params) {
  try {
    const apiParams = {
      apikey: process.env.TICKETMASTER_API_KEY,
      countryCode: 'US',  // US events only
      city: params.city,
      startDateTime: params.startDateTime ? `${params.startDateTime}T00:00:00Z` : undefined,
      endDateTime: params.endDateTime ? `${params.endDateTime}T23:59:59Z` : undefined,
      size: params.size || 20,
      sort: 'date,asc',
      page: 0
    };

    // Handle special category cases
    if (params.categoryId) {
      if (params.categoryId.includes('classificationName=')) {
        // For Top Concerts
        const [baseId, classParam] = params.categoryId.split('&');
        apiParams.segmentId = baseId;
        apiParams.classificationName = classParam.split('=')[1];
      } else if (params.categoryId.includes('subGenreId=')) {
        // For Comedy Shows
        const [baseId, subGenreParam] = params.categoryId.split('&');
        apiParams.segmentId = baseId;
        apiParams.subGenreId = subGenreParam.split('=')[1];
      } else {
        // Regular categories
        apiParams.segmentId = params.categoryId;
      }
    }

    const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
      params: apiParams
    });

    if (!response.data._embedded || !response.data._embedded.events) {
      return [];
    }

    return response.data._embedded.events.map(event => ({
      id: event.id,
      title: event.name,
      description: event.description || event.info || '',
      startDate: event.dates.start.dateTime || event.dates.start.localDate,
      endDate: event.dates.end ? (event.dates.end.dateTime || event.dates.end.localDate) : null,
      url: event.url,
      venue: {
        name: event._embedded?.venues?.[0]?.name || 'Venue TBA',
        city: event._embedded?.venues?.[0]?.city?.name || '',
        address: event._embedded?.venues?.[0]?.address?.line1 || ''
      },
      organizer: event.promoter?.name || '',
      imageUrl: event.images?.[0]?.url || '',
      ticketAvailability: event.dates?.status?.code !== 'offsale',
      priceRange: event.priceRanges ? {
        min: event.priceRanges[0].min,
        max: event.priceRanges[0].max,
        currency: event.priceRanges[0].currency
      } : null
    }));
  } catch (error) {
    console.error('Error fetching events from Ticketmaster:', error.response?.data || error.message);
    throw new Error('Failed to fetch events from Ticketmaster');
  }
}

/**
 * Get event details by ID
 * @param {string} eventId - Ticketmaster event ID
 * @returns {Promise<Object>} - Event details
 */
async function getEventById(eventId) {
  try {
    const response = await axios.get(`https://app.ticketmaster.com/discovery/v2/events/${eventId}`, {
      params: {
        apikey: process.env.TICKETMASTER_API_KEY
      }
    });

    const event = response.data;
    return {
      id: event.id,
      title: event.name,
      description: event.description || event.info || '',
      startDate: event.dates.start.dateTime || event.dates.start.localDate,
      endDate: event.dates.end ? (event.dates.end.dateTime || event.dates.end.localDate) : null,
      url: event.url,
      venue: {
        name: event._embedded?.venues?.[0]?.name || 'Venue TBA',
        city: event._embedded?.venues?.[0]?.city?.name || '',
        address: event._embedded?.venues?.[0]?.address?.line1 || ''
      },
      organizer: event.promoter?.name || '',
      imageUrl: event.images?.[0]?.url || '',
      ticketAvailability: event.dates?.status?.code !== 'offsale',
      priceRange: event.priceRanges ? {
        min: event.priceRanges[0].min,
        max: event.priceRanges[0].max,
        currency: event.priceRanges[0].currency
      } : null
    };
  } catch (error) {
    console.error('Error fetching event details from Ticketmaster:', error.response?.data || error.message);
    throw new Error('Failed to fetch event details from Ticketmaster');
  }
}

module.exports = {
  searchEvents,
  getEventById,
  getMajorUSCities,
  getEventCategories
}; 