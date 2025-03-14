import React, { useState } from 'react';
import { generateCaption } from '../services/api';
import './CaptionGenerator.css';

const CaptionGenerator = ({ event, image, onCaptionGenerated, setLoading, setError }) => {
  const [captionType, setCaptionType] = useState('event');

  const handleGenerateCaption = async () => {
    try {
      setLoading(true);
      setError('');
      
      let data;
      if (captionType === 'event') {
        data = event;
      } else {
        data = image;
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
              Selected Image
            </label>
          </div>
        </div>
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