import React, { useState } from 'react';
import './EventScraper.css';
import { scrapeEventbriteUrl } from '../services/api';

function EventScraper({ onEventScraped, setLoading, setError }) {
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter an Eventbrite URL');
      return;
    }
    
    if (!url.includes('eventbrite.com/e/')) {
      setError('Please enter a valid Eventbrite event URL');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setLoading(true);
      setError('');
      
      const event = await scrapeEventbriteUrl(url);
      
      if (event) {
        onEventScraped(event);
      }
    } catch (err) {
      setError('Failed to scrape event: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="event-scraper">
      <h3>Scrape Eventbrite URL</h3>
      <p className="scraper-description">
        Paste an Eventbrite event URL to extract event details directly.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="url"
            placeholder="https://www.eventbrite.com/e/event-name-tickets-123456789"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="form-control"
          />
        </div>
        
        <button 
          type="submit" 
          className="primary-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Scraping...' : 'Scrape Event'}
        </button>
      </form>
      
      <div className="scraper-note">
        <p><strong>Note:</strong> This feature extracts data directly from Eventbrite pages. 
        Use it for events that don't appear in the search results.</p>
      </div>
    </div>
  );
}

export default EventScraper; 