const axios = require('axios');

// Using the provided private token
const EVENTBRITE_API_KEY = 'SQ2MKOLIUNGMKQUNBXMP';
const BASE_URL = 'https://www.eventbriteapi.com/v3';

// Mock data for events since Eventbrite API is no longer accessible for public search
const MOCK_EVENTS = [
  {
    id: '11',
    title: 'Post Malone Presents: The BIG ASS Stadium Tour',
    description: 'Post Malone brings his electrifying BIG ASS Stadium Tour to New York City. Experience an unforgettable night of music featuring his biggest hits and new tracks from his latest album. Special guests and surprise performances expected.',
    startDate: '2025-05-13T19:30:00',
    endDate: '2025-05-13T23:00:00',
    url: 'https://www.eventbrite.com/e/post-malone-big-ass-stadium-tour',
    venue: {
      name: 'Madison Square Garden',
      address: '4 Pennsylvania Plaza',
      city: 'New York',
    },
    organizer: 'Live Nation Entertainment',
    ticketAvailability: true,
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: '1',
    title: 'Tech Conference 2023',
    description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders, workshops, and networking opportunities.',
    startDate: '2023-11-15T09:00:00',
    endDate: '2023-11-17T18:00:00',
    url: 'https://www.eventbrite.com/e/tech-conference-2023',
    venue: {
      name: 'Convention Center',
      address: '123 Main St',
      city: 'New York',
    },
    organizer: 'Tech Events Inc.',
    ticketAvailability: true,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: '2',
    title: 'Music Festival',
    description: 'A three-day music festival featuring top artists from around the world, food vendors, and art installations.',
    startDate: '2023-12-01T14:00:00',
    endDate: '2023-12-03T23:00:00',
    url: 'https://www.eventbrite.com/e/music-festival',
    venue: {
      name: 'Central Park',
      address: '5th Ave',
      city: 'New York',
    },
    organizer: 'Music Events Co.',
    ticketAvailability: true,
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: '3',
    title: 'Food & Wine Festival',
    description: 'Sample delicious food and wine from top chefs and wineries in the region.',
    startDate: '2023-10-20T12:00:00',
    endDate: '2023-10-22T20:00:00',
    url: 'https://www.eventbrite.com/e/food-wine-festival',
    venue: {
      name: 'Waterfront Park',
      address: '200 Harbor Dr',
      city: 'San Diego',
    },
    organizer: 'Culinary Events',
    ticketAvailability: true,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: '4',
    title: 'Art Exhibition',
    description: 'Featuring works from contemporary artists exploring themes of nature and technology.',
    startDate: '2023-11-05T10:00:00',
    endDate: '2023-12-15T18:00:00',
    url: 'https://www.eventbrite.com/e/art-exhibition',
    venue: {
      name: 'Modern Art Museum',
      address: '151 3rd St',
      city: 'San Francisco',
    },
    organizer: 'Arts Council',
    ticketAvailability: true,
    imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: '5',
    title: 'Marathon',
    description: 'Annual city marathon with full and half marathon options, as well as a 5K fun run.',
    startDate: '2023-10-08T07:00:00',
    endDate: '2023-10-08T14:00:00',
    url: 'https://www.eventbrite.com/e/marathon',
    venue: {
      name: 'City Center',
      address: 'Downtown',
      city: 'Chicago',
    },
    organizer: 'Running Events',
    ticketAvailability: true,
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: '6',
    title: 'Business Workshop',
    description: 'Learn strategies for growing your business from industry experts.',
    startDate: '2023-11-10T09:00:00',
    endDate: '2023-11-10T17:00:00',
    url: 'https://www.eventbrite.com/e/business-workshop',
    venue: {
      name: 'Business Center',
      address: '555 Market St',
      city: 'San Francisco',
    },
    organizer: 'Business Growth Network',
    ticketAvailability: true,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: '7',
    title: 'Comedy Night',
    description: 'An evening of stand-up comedy featuring both established and up-and-coming comedians.',
    startDate: '2023-10-15T20:00:00',
    endDate: '2023-10-15T23:00:00',
    url: 'https://www.eventbrite.com/e/comedy-night',
    venue: {
      name: 'Laugh Factory',
      address: '8001 Sunset Blvd',
      city: 'Los Angeles',
    },
    organizer: 'Comedy Productions',
    ticketAvailability: true,
    imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
  },
  {
    id: '8',
    title: 'Yoga Retreat',
    description: 'A weekend of yoga, meditation, and wellness activities in a peaceful natural setting.',
    startDate: '2023-11-24T15:00:00',
    endDate: '2023-11-26T12:00:00',
    url: 'https://www.eventbrite.com/e/yoga-retreat',
    venue: {
      name: 'Mountain Retreat Center',
      address: '1 Retreat Way',
      city: 'Denver',
    },
    organizer: 'Wellness Collective',
    ticketAvailability: true,
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: '9',
    title: 'Film Festival',
    description: 'Showcasing independent films from around the world with director Q&As and panel discussions.',
    startDate: '2023-12-08T10:00:00',
    endDate: '2023-12-10T22:00:00',
    url: 'https://www.eventbrite.com/e/film-festival',
    venue: {
      name: 'Cinema Complex',
      address: '123 Theater Row',
      city: 'Austin',
    },
    organizer: 'Film Society',
    ticketAvailability: true,
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: '10',
    title: 'Career Fair',
    description: 'Connect with employers from various industries and attend career development workshops.',
    startDate: '2023-10-25T10:00:00',
    endDate: '2023-10-25T16:00:00',
    url: 'https://www.eventbrite.com/e/career-fair',
    venue: {
      name: 'University Center',
      address: '123 University Ave',
      city: 'Boston',
    },
    organizer: 'Career Network',
    ticketAvailability: true,
    imageUrl: 'https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  }
];

// Mock categories data
const MOCK_CATEGORIES = [
  { id: '101', name: 'Business & Professional' },
  { id: '102', name: 'Science & Technology' },
  { id: '103', name: 'Music' },
  { id: '104', name: 'Film, Media & Entertainment' },
  { id: '105', name: 'Performing & Visual Arts' },
  { id: '106', name: 'Fashion & Beauty' },
  { id: '107', name: 'Health & Wellness' },
  { id: '108', name: 'Sports & Fitness' },
  { id: '109', name: 'Travel & Outdoor' },
  { id: '110', name: 'Food & Drink' },
  { id: '111', name: 'Charity & Causes' },
  { id: '112', name: 'Government & Politics' },
  { id: '113', name: 'Community & Culture' },
  { id: '114', name: 'Religion & Spirituality' },
  { id: '115', name: 'Family & Education' },
  { id: '116', name: 'Seasonal & Holiday' },
  { id: '117', name: 'Home & Lifestyle' },
  { id: '118', name: 'Auto, Boat & Air' },
  { id: '119', name: 'Hobbies & Special Interest' },
  { id: '199', name: 'Other' }
];

/**
 * Search for events based on location, date range, and category
 * @param {string} city - City name
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @param {string} category - Category ID
 * @returns {Promise<Array>} - List of events
 */
async function searchEvents(city, startDate, endDate, category) {
  try {
    console.log(`Searching for events in ${city} from ${startDate} to ${endDate}, category: ${category || 'All'}`);
    
    // Convert parameters to Date objects for filtering
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    // Filter mock events based on search criteria
    let filteredEvents = MOCK_EVENTS;
    
    // Filter by city if provided
    if (city) {
      const cityLower = city.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.venue && 
        event.venue.city && 
        event.venue.city.toLowerCase().includes(cityLower)
      );
    }
    
    // Filter by date range
    filteredEvents = filteredEvents.filter(event => {
      const eventStartDate = new Date(event.startDate);
      return eventStartDate >= startDateObj && eventStartDate <= endDateObj;
    });
    
    // Filter by category if provided
    if (category) {
      // In a real app, we would filter by category ID
      // For mock data, we'll just return all events since we don't have category IDs in our mock data
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return filteredEvents;
  } catch (error) {
    console.error('Error in mock events service:', error);
    throw new Error('Failed to fetch events');
  }
}

/**
 * Get event categories
 * @returns {Promise<Array>} - List of categories
 */
async function getCategories() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return MOCK_CATEGORIES;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

module.exports = {
  searchEvents,
  getCategories
}; 