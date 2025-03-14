import React, { useState, useEffect } from 'react';
import './App.css';
import EventSearch from './components/EventSearch';
import EventList from './components/EventList';
import ImageSearch from './components/ImageSearch';
import ImageList from './components/ImageList';
import CaptionGenerator from './components/CaptionGenerator';
import { getCategories } from './services/api';

function App() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load event categories. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setStep(2);
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setStep(3);
  };

  const handleCaptionGenerated = (generatedCaption) => {
    setCaption(generatedCaption);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedEvent(null);
    setSelectedImage(null);
    setCaption('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>SocioSync</h1>
          <p>Find events, select images, and generate social media captions</p>
        </div>
      </header>

      <main className="container">
        <div className="steps-container">
          <div className={`step ${step === 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-text">Find Events</span>
          </div>
          <div className={`step ${step === 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-text">Select Images</span>
          </div>
          <div className={`step ${step === 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-text">Generate Caption</span>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {step === 1 && (
          <>
            <EventSearch 
              categories={categories} 
              setEvents={setEvents} 
              setLoading={setLoading} 
              setError={setError} 
            />
            {loading ? (
              <div className="loading"></div>
            ) : (
              <EventList events={events} onSelectEvent={handleEventSelect} />
            )}
          </>
        )}

        {step === 2 && selectedEvent && (
          <>
            <div className="navigation">
              <button className="secondary-btn" onClick={handleBack}>Back to Events</button>
            </div>
            <div className="selected-event card">
              <h2>{selectedEvent.title}</h2>
              <p><strong>Date:</strong> {new Date(selectedEvent.startDate).toLocaleDateString()}</p>
              {selectedEvent.venue && (
                <p><strong>Location:</strong> {selectedEvent.venue.name}, {selectedEvent.venue.city}</p>
              )}
            </div>
            <ImageSearch 
              eventTitle={selectedEvent.title} 
              setImages={setImages} 
              setLoading={setLoading} 
              setError={setError} 
            />
            {loading ? (
              <div className="loading"></div>
            ) : (
              <ImageList images={images} onSelectImage={handleImageSelect} />
            )}
          </>
        )}

        {step === 3 && selectedEvent && selectedImage && (
          <>
            <div className="navigation">
              <button className="secondary-btn" onClick={handleBack}>Back to Images</button>
              <button className="secondary-btn" onClick={handleReset}>Start Over</button>
            </div>
            <div className="selected-content">
              <div className="selected-event card">
                <h2>{selectedEvent.title}</h2>
                <p><strong>Date:</strong> {new Date(selectedEvent.startDate).toLocaleDateString()}</p>
                {selectedEvent.venue && (
                  <p><strong>Location:</strong> {selectedEvent.venue.name}, {selectedEvent.venue.city}</p>
                )}
              </div>
              <div className="selected-image card">
                <h3>Selected Image</h3>
                <img src={selectedImage.link} alt={selectedImage.title} />
              </div>
            </div>
            <CaptionGenerator 
              event={selectedEvent} 
              image={selectedImage} 
              onCaptionGenerated={handleCaptionGenerated} 
              setLoading={setLoading} 
              setError={setError} 
            />
            {loading ? (
              <div className="loading"></div>
            ) : caption && (
              <div className="caption-result card">
                <h3>Generated Caption</h3>
                <div className="caption-box">
                  <p>{caption}</p>
                </div>
                <button 
                  className="primary-btn"
                  onClick={() => navigator.clipboard.writeText(caption)}
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} SocioSync</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 