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
    <div className="event-scraper card">
      <h2>Find an Event</h2>
      <p className="scraper-description">
        Paste an Eventbrite event URL to extract event details and create social media content.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eventbrite-url">Eventbrite Event URL</label>
          <input
            id="eventbrite-url"
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
        <p><strong>How it works:</strong> This tool extracts event information directly from Eventbrite event pages. 
        Simply copy and paste the URL of any Eventbrite event to get started.</p>
        <p><strong>Example URLs:</strong></p>
        <ul>
          <li>https://www.eventbrite.com/e/concert-name-tickets-123456789</li>
          <li>https://www.eventbrite.com/e/conference-name-tickets-987654321</li>
        </ul>
      </div>
    </div>
  );
}

export default EventScraper; 