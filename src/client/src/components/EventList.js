import React from 'react';
import './EventList.css';

const EventList = ({ events, onSelectEvent }) => {
  if (!events || events.length === 0) {
    return (
      <div className="event-list-empty card">
        <p>No events found. Try searching with different criteria.</p>
      </div>
    );
  }

  return (
    <div className="event-list">
      <h2>Events ({events.length})</h2>
      <div className="event-grid">
        {events.map(event => (
          <div key={event.id} className="event-card card" onClick={() => onSelectEvent(event)}>
            {event.imageUrl && (
              <div className="event-image">
                <img src={event.imageUrl} alt={event.title} />
              </div>
            )}
            <div className="event-details">
              <h3>{event.title}</h3>
              <p className="event-date">
                {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              {event.venue && (
                <p className="event-location">
                  {event.venue.name}{event.venue.city ? `, ${event.venue.city}` : ''}
                </p>
              )}
              <button className="primary-btn select-btn">Select Event</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList; 