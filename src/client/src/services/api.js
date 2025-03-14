import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Event API calls
export const getEvents = async (city, startDate, endDate, category) => {
  try {
    const response = await api.get('/api/events/search', {
      params: {
        city,
        startDate,
        endDate,
        category,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/api/events/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Image API calls
export const getImages = async (query, aspectRatio, quality) => {
  try {
    const response = await api.get('/api/images/search', {
      params: {
        query,
        aspectRatio,
        quality,
      },
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
    const response = await api.post('/api/captions/generate', {
      data,
      type,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating caption:', error);
    throw error;
  }
}; 