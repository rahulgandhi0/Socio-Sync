import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Event API calls
export const getCities = async () => {
  try {
    const response = await api.get('/api/events/cities');
    return response.data;
  } catch (error) {
    console.error('Error getting cities:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/api/events/categories');
    return response.data;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

export const searchEvents = async (params) => {
  try {
    const response = await api.post('/api/events/search', params);
    return response.data;
  } catch (error) {
    console.error('Error searching events:', error);
    throw error;
  }
};

export const getEventById = async (eventId) => {
  try {
    const response = await api.get(`/api/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting event details:', error);
    throw error;
  }
};

// Image API calls
export const getImages = async (query, aspectRatio) => {
  try {
    const response = await api.get('/api/images/search', {
      params: { query, aspectRatio }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

// Caption API calls
export const generateCaption = async (data, type) => {
  try {
    const response = await api.post('/api/captions/generate', { data, type });
    return response.data;
  } catch (error) {
    console.error('Error generating caption:', error);
    throw error;
  }
}; 