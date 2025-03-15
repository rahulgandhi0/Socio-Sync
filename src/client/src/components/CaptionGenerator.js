import React, { useState } from 'react';
import { generateCaption } from '../services/api';
import './CaptionGenerator.css';

const CaptionGenerator = ({ event, image, images = [], onCaptionGenerated, setLoading, setError }) => {
  const [captionType, setCaptionType] = useState('event');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleGenerateCaption = async () => {
    try {
      setLoading(true);
      setError('');
      
      let data;
      if (captionType === 'event') {
        data = event;
      } else {
        data = images[selectedImageIndex] || image;
      }
      
      const response = await generateCaption(data, captionType);
      onCaptionGenerated(response.caption);
    } catch (err) {
      setError('Failed to generate caption. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="caption-generator card">
      <h2>Generate Caption</h2>
      <div className="caption-options">
        <div className="form-group">
          <label>Caption Based On:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="captionType"
                value="event"
                checked={captionType === 'event'}
                onChange={() => setCaptionType('event')}
              />
              Event Details
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="captionType"
                value="image"
                checked={captionType === 'image'}
                onChange={() => setCaptionType('image')}
              />
              Image Content
            </label>
          </div>
        </div>

        {captionType === 'image' && images.length > 1 && (
          <div className="image-selector-container">
            <h3>Choose Image for Caption</h3>
            <p className="image-selector-help">
              Select which image to base your caption on. The AI will analyze this image to generate a relevant caption.
            </p>
            <div className="image-selector">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className={`image-option ${selectedImageIndex === index ? 'selected' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                  title={`Image ${index + 1}`}
                >
                  <img src={img.link} alt={`Option ${index + 1}`} />
                  {selectedImageIndex === index && (
                    <div className="selected-indicator">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <button 
        className="primary-btn generate-btn"
        onClick={handleGenerateCaption}
      >
        Generate Caption
      </button>
    </div>
  );
};

export default CaptionGenerator; 