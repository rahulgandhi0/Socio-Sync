import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getEvents } from '../services/api';
import './EventSearch.css';

// List of popular cities for autocomplete
const POPULAR_CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Fort Worth', 'Columbus', 'San Francisco', 'Charlotte', 'Indianapolis',
  'Seattle', 'Denver', 'Washington DC', 'Boston', 'El Paso', 'Nashville',
  'Detroit', 'Portland', 'Las Vegas', 'Oklahoma City', 'Memphis', 'Louisville',
  'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento',
  'Kansas City', 'Long Beach', 'Mesa', 'Atlanta', 'Colorado Springs', 'Miami',
  'Raleigh', 'Omaha', 'Minneapolis', 'Tulsa', 'Cleveland', 'Wichita', 'Arlington',
  'New Orleans', 'Bakersfield', 'Tampa', 'Honolulu', 'Aurora', 'Anaheim',
  'Santa Ana', 'St. Louis', 'Riverside', 'Corpus Christi', 'Pittsburgh',
  'Lexington', 'Anchorage', 'Stockton', 'Cincinnati', 'Saint Paul', 'Toledo',
  'Newark', 'Greensboro', 'Plano', 'Henderson', 'Lincoln', 'Buffalo', 'Fort Wayne',
  'Jersey City', 'Chula Vista', 'Orlando', 'St. Petersburg', 'Norfolk', 'Chandler',
  'Laredo', 'Madison', 'Durham', 'Lubbock', 'Winston-Salem', 'Garland', 'Glendale',
  'Hialeah', 'Reno', 'Baton Rouge', 'Irvine', 'Chesapeake', 'Irving', 'Scottsdale',
  'North Las Vegas', 'Fremont', 'Gilbert', 'San Bernardino', 'Boise', 'Birmingham'
];

const EventSearch = ({ categories, setEvents, setLoading, setError }) => {
  const [city, setCity] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    return date;
  });
  const [category, setCategory] = useState('');
  const [mockDataNotice, setMockDataNotice] = useState(true);
  const dropdownRef = useRef(null);

  // Filter cities based on input
  useEffect(() => {
    if (city.trim() === '') {
      setFilteredCities([]);
      return;
    }

    const filtered = POPULAR_CITIES.filter(
      c => c.toLowerCase().includes(city.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions
    
    setFilteredCities(filtered);
  }, [city]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setShowDropdown(true);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!city.trim()) {
      setError('Please enter a city');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      const events = await getEvents(city, startDate, endDate, category);
      setEvents(events);
      
      if (events.length === 0) {
        setError('No events found for this city. Try a different city or search criteria.');
      }
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-search card">
      <h2>Find Events</h2>
      
      {mockDataNotice && (
        <div className="mock-data-notice">
          <p>
            <strong>Demo Mode:</strong> Using sample event data instead of live Eventbrite API.
            Try searching for events in New York, San Francisco, Chicago, Los Angeles, or other major cities.
            <button 
              className="dismiss-btn"
              onClick={() => setMockDataNotice(false)}
            >
              ✕
            </button>
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group" ref={dropdownRef}>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={handleCityChange}
            onFocus={() => setShowDropdown(true)}
            placeholder="Enter city name"
            autoComplete="off"
            required
          />
          {showDropdown && filteredCities.length > 0 && (
            <ul className="city-dropdown">
              {filteredCities.map((city, index) => (
                <li 
                  key={index} 
                  onClick={() => handleCitySelect(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={date => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              className="date-picker"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="date-picker"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category (Optional)</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <button type="submit" className="primary-btn">
          Search Events
        </button>
      </form>
      
      <div className="eventbrite-direct">
        <p>
          Looking for real events? 
          <a 
            href={`https://www.eventbrite.com/d/${city ? city.replace(/\s+/g, '-').toLowerCase() : 'us'}--${city || 'local'}/events/`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Visit Eventbrite
          </a>
        </p>
      </div>
    </div>
  );
};

export default EventSearch; 