import React, { useState } from 'react';
import './EventScraper.css';
import { searchEvents } from '../services/api';

function EventSearch({ onEventFound, setLoading, setError }) {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    city: '',
    startDateTime: '',
    endDateTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!searchParams.keyword && !searchParams.city) {
      setError('Please enter a keyword or city');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setLoading(true);
      setError('');
      
      const events = await searchEvents(searchParams);
      
      if (events && events.length > 0) {
        onEventFound(events);
      } else {
        setError('No events found. Try different search criteria.');
      }
    } catch (err) {
      setError('Failed to search events: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="event-search card">
      <h2>Find Events</h2>
      <p className="search-description">
        Search for events by keyword, city, or date to create social media content.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="keyword">Keyword (Event name, artist, team, etc.)</label>
          <input
            id="keyword"
            name="keyword"
            type="text"
            placeholder="Enter keywords..."
            value={searchParams.keyword}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="Enter city name..."
            value={searchParams.city}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDateTime">Start Date</label>
          <input
            id="startDateTime"
            name="startDateTime"
            type="date"
            value={searchParams.startDateTime}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDateTime">End Date</label>
          <input
            id="endDateTime"
            name="endDateTime"
            type="date"
            value={searchParams.endDateTime}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        
        <button 
          type="submit" 
          className="primary-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Searching...' : 'Search Events'}
        </button>
      </form>
      
      <div className="search-note">
        <p><strong>How it works:</strong> This tool searches for events using the Ticketmaster API. 
        You can search by keyword (event name, artist, team, etc.), city, and date range.</p>
        <p><strong>Search tips:</strong></p>
        <ul>
          <li>Enter a keyword to find specific events or artists</li>
          <li>Specify a city to find local events</li>
          <li>Use date range to find upcoming events</li>
        </ul>
      </div>
    </div>
  );
}

export default EventSearch; 