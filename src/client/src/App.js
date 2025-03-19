import React, { useState } from 'react';
import './App.css';
import EventSearch from './components/EventSearch';
import EventList from './components/EventList';
import ImageSearch from './components/ImageSearch';
import ImageList from './components/ImageList';
import CaptionGenerator from './components/CaptionGenerator';
import ImageCropper from './components/ImageCropper';

function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [caption, setCaption] = useState('');

  const MAX_IMAGES = 8;

  const handleEventsFound = (foundEvents) => {
    setEvents(foundEvents);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setStep(2);
  };

  const handleImageSelect = (image) => {
    // Skip broken images
    if (image.broken) {
      setError("This image couldn't be loaded and can't be selected");
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSelectedImages(prevSelectedImages => {
      // Check if image is already selected
      const isAlreadySelected = prevSelectedImages.some(img => img.link === image.link);
      
      if (isAlreadySelected) {
        // If already selected, remove it
        return prevSelectedImages.filter(img => img.link !== image.link);
      } else if (prevSelectedImages.length < MAX_IMAGES) {
        // Check if the aspect ratios are compatible for Instagram
        if (prevSelectedImages.length > 0) {
          // Calculate all ratios with more precision
          const firstImage = prevSelectedImages[0];
          const firstImageRatio = firstImage.width / firstImage.height;
          const newImageRatio = image.width / image.height;
          
          // Log ratios for debugging
          console.log(`First image ratio: ${firstImageRatio.toFixed(2)}, New image ratio: ${newImageRatio.toFixed(2)}`);
          
          // Use more adaptive ratio grouping
          const isRatioCompatible = (ratio1, ratio2) => {
            // Both square (1:1)
            if (Math.abs(ratio1 - 1.0) <= 0.15 && Math.abs(ratio2 - 1.0) <= 0.15) {
              return true;
            }
            
            // Both portrait (4:5) which is 0.8
            if (Math.abs(ratio1 - 0.8) <= 0.15 && Math.abs(ratio2 - 0.8) <= 0.15) {
              return true;
            }
            
            // Or they're just generally close to each other
            if (Math.abs(ratio1 - ratio2) <= 0.15) {
              return true;
            }
            
            return false;
          };
          
          if (!isRatioCompatible(firstImageRatio, newImageRatio)) {
            let message = 'Instagram requires consistent aspect ratios. All selected images must have similar ratios.';
            
            if (Math.abs(firstImageRatio - 1.0) <= 0.15) {
              message += ' Your first image has a square (1:1) ratio.';
            } else if (Math.abs(firstImageRatio - 0.8) <= 0.15) {
              message += ' Your first image has a portrait (4:5) ratio.';
            } else {
              message += ` Your first image has a ratio of ${firstImageRatio.toFixed(2)}.`;
            }
            
            setError(message);
            setTimeout(() => setError(''), 5000);
            return prevSelectedImages;
          }
        }
        
        // If not selected and under the limit, add it
        return [...prevSelectedImages, image];
      } else {
        // If at the limit, show error
        setError(`You can select a maximum of ${MAX_IMAGES} images`);
        setTimeout(() => setError(''), 3000);
        return prevSelectedImages;
      }
    });
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
    setSelectedImages([]);
    setCaption('');
  };

  const handleProceedToCaption = () => {
    if (selectedImages.length > 0) {
      setStep(3); // Step 3 is now crop step
    } else {
      setError('Please select at least one image');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleImagesCropped = (croppedImages) => {
    setSelectedImages(croppedImages);
    setStep(4); // Move to caption step after cropping
  };

  const removeSelectedImage = (image) => {
    setSelectedImages(prevSelectedImages => 
      prevSelectedImages.filter(img => img.link !== image.link)
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>SocioSync</h1>
          <p>Create engaging social media content for events</p>
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
            <span className="step-text">Crop Images</span>
          </div>
          <div className={`step ${step === 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-text">Generate Caption</span>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        {loading && (
          <div className="loading">Loading...</div>
        )}

        {!loading && (
          <>
            {step === 1 && (
              <>
                <EventSearch
                  onEventFound={handleEventsFound}
                  setLoading={setLoading}
                  setError={setError}
                />
                
                {events.length > 0 && (
                  <EventList
                    events={events}
                    onSelectEvent={handleEventSelect}
                  />
                )}
              </>
            )}

            {step === 2 && selectedEvent && (
              <>
                <div className="navigation">
                  <button className="secondary-btn" onClick={handleBack}>Back to Events</button>
                  <button 
                    className="primary-btn" 
                    onClick={handleProceedToCaption} 
                    disabled={selectedImages.length === 0}
                  >
                    Continue with {selectedImages.length} {selectedImages.length === 1 ? 'Image' : 'Images'}
                  </button>
                </div>
                
                <div className="selected-event card">
                  <h2>{selectedEvent.title}</h2>
                  <p><strong>Date:</strong> {new Date(selectedEvent.startDate).toLocaleDateString()}</p>
                  {selectedEvent.venue && (
                    <p><strong>Location:</strong> {selectedEvent.venue.name}{selectedEvent.venue.city ? `, ${selectedEvent.venue.city}` : ''}</p>
                  )}
                </div>
                
                <div className="image-selection-layout">
                  <div className="image-selection-main">
                    <ImageSearch 
                      eventTitle={selectedEvent.title} 
                      setImages={setImages} 
                      setLoading={setLoading} 
                      setError={setError} 
                    />
                    
                    {loading ? (
                      <div className="loading"></div>
                    ) : (
                      <ImageList 
                        images={images} 
                        selectedImages={selectedImages}
                        onSelectImage={handleImageSelect} 
                        maxImages={MAX_IMAGES}
                      />
                    )}
                  </div>
                  
                  {selectedImages.length > 0 && (
                    <div className="image-selection-sidebar">
                      <div className="selected-images-preview card">
                        <h3>
                          Selected Images 
                          <span className="selected-images-count">{selectedImages.length}/{MAX_IMAGES}</span>
                        </h3>
                        <div className="selected-images-grid">
                          {selectedImages.map((image, index) => (
                            <div key={index} className="selected-image-thumbnail">
                              <img src={image.link} alt={image.title} />
                              <button 
                                className="remove-image-btn" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSelectedImage(image);
                                }}
                                title="Remove image"
                              >
                                ✕
                              </button>
                              <div className="checkmark-indicator">✓</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {step === 3 && selectedEvent && selectedImages.length > 0 && (
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
                      <p><strong>Location:</strong> {selectedEvent.venue.name}{selectedEvent.venue.city ? `, ${selectedEvent.venue.city}` : ''}</p>
                    )}
                  </div>
                  <div className="selected-images-grid-container card">
                    <h3>Selected Images</h3>
                    <div className="selected-images-grid">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="selected-image-thumbnail">
                          <img src={image.link} alt={image.title} />
                          <div className="checkmark-indicator">✓</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <ImageCropper 
                  images={selectedImages}
                  onImagesCropped={handleImagesCropped}
                />
              </>
            )}

            {step === 4 && selectedEvent && selectedImages.length > 0 && (
              <>
                <div className="navigation">
                  <button className="secondary-btn" onClick={() => setStep(3)}>Back to Crop</button>
                  <button className="secondary-btn" onClick={handleReset}>Start Over</button>
                </div>
                <div className="selected-content">
                  <div className="selected-event card">
                    <h2>{selectedEvent.title}</h2>
                    <p><strong>Date:</strong> {new Date(selectedEvent.startDate).toLocaleDateString()}</p>
                    {selectedEvent.venue && (
                      <p><strong>Location:</strong> {selectedEvent.venue.name}{selectedEvent.venue.city ? `, ${selectedEvent.venue.city}` : ''}</p>
                    )}
                  </div>
                  <div className="selected-images-grid-container card">
                    <h3>Selected Images</h3>
                    <div className="selected-images-grid">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="selected-image-thumbnail">
                          <img src={image.link} alt={image.title} />
                          <div className="checkmark-indicator">✓</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <CaptionGenerator 
                  event={selectedEvent} 
                  image={selectedImages[0]} // Using the first image for caption generation
                  images={selectedImages}
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
          </>
        )}
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 SocioSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 