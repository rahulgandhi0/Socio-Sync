import React, { useState, useEffect } from 'react';
import './EventSearch.css';
import { searchEvents, getCities, getCategories } from '../services/api';

function EventSearch({ onEventFound, setLoading, setError }) {
  const [searchParams, setSearchParams] = useState(() => {
    // Initialize from localStorage if available
    const savedParams = localStorage.getItem('searchParams');
    return savedParams ? JSON.parse(savedParams) : {
      city: '',
      categoryId: '',
      startDateTime: '',
      endDateTime: ''
    };
  });

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];
  
  // List of major US cities
  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
    'Austin', 'Jacksonville', 'Fort Worth', 'San Francisco', 'Charlotte',
    'Seattle', 'Denver', 'Washington DC', 'Boston', 'Las Vegas',
    'Miami', 'Atlanta', 'Nashville', 'Portland', 'New Orleans'
  ];

  // List of event categories
  const categories = [
    { id: 'KZFzniwnSyZfZ7v7nJ', name: 'Music' },
    { id: 'KZFzniwnSyZfZ7v7nJ&classificationName=Pop', name: 'Top Concerts' },
    { id: 'KZFzniwnSyZfZ7v7na', name: 'Arts & Theatre' },
    { id: 'KZFzniwnSyZfZ7v7n1&subGenreId=KZFzniwnSyZfZ7vAe1', name: 'Comedy Shows' },
    { id: 'KZFzniwnSyZfZ7v7nE', name: 'Sports' },
    { id: 'KZFzniwnSyZfZ7v7nn', name: 'Film' },
    { id: 'KZFzniwnSyZfZ7v7n1', name: 'Miscellaneous' }
  ];

  // Save search params to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('searchParams', JSON.stringify(searchParams));
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      const response = await searchEvents(searchParams);
      onEventFound(response);
      
      if (response.length === 0) {
        setError('No events found. Try different search criteria.');
      }
    } catch (err) {
      setError('Failed to fetch events. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-search card">
      <h2>Find Events</h2>
      <p className="search-description">
        Search for events in major US cities by location, date, and category.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <select
            id="city"
            name="city"
            value={searchParams.city}
            onChange={handleInputChange}
            className="form-control"
            required
          >
            <option value="">Select a city</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">Event Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={searchParams.categoryId}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="date-selection-container">
          <div className="date-column">
            <label htmlFor="startDateTime">Start Date</label>
            <input
              type="date"
              id="startDateTime"
              name="startDateTime"
              value={searchParams.startDateTime}
              onChange={handleInputChange}
              min={today}
              className="form-control"
            />
          </div>

          <div className="date-column">
            <label htmlFor="endDateTime">End Date</label>
            <input
              type="date"
              id="endDateTime"
              name="endDateTime"
              value={searchParams.endDateTime}
              onChange={handleInputChange}
              min={searchParams.startDateTime || today}
              className="form-control"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="primary-btn"
        >
          Search Events
        </button>
      </form>
    </div>
  );
}

export default EventSearch; 