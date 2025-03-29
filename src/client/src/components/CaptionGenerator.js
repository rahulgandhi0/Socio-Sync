import React, { useState } from 'react';
import './CaptionGenerator.css';

const EVENT_CAPTIONS = [
  "🔥 Don't miss out on {title}! Join us on {date} at {venue}. Tickets selling fast! #MustAttend #EventOfTheYear",
  "✨ Join us for {title} on {date} at {venue}! Tag a friend you'd bring along to this amazing event. Limited spots available! #ExcitingEvent #GetYourTickets",
  "🎉 The countdown begins for {title}! This is your chance to be part of something special on {date}. Early bird tickets available now! #SaveTheDate #CantWait",
  "🚀 Ready for the experience of a lifetime? {title} is going to be epic! Secure your spot for {date} at {venue}. #DontMissOut #BookNow",
  "⭐ The most anticipated event of the year is here! {title} at {venue} on {date}. Get your tickets before they're gone. #HotTickets #MustSee"
];

const IMAGE_CAPTIONS = [
  "✨ Capturing moments that last a lifetime at {title}. What's your favorite memory from an event like this? #PerfectMoment #EventMagic",
  "🔥 When the vibes are just right! Tag someone you'd bring to {title}. #GoodVibesOnly #EventLife",
  "💫 Some experiences are worth every penny. {title} is definitely one of them! #BucketList #MustExperience",
  "📸 Picture perfect moments from {title}. Double tap if you wish you were here! #EventGoals #InstaWorthy",
  "🎭 Behind every great event is an even greater story. What would yours be at {title}? #EventStories #MemoriesMade"
];

const CaptionGenerator = ({ event, images = [], onCaptionGenerated, setLoading, setError }) => {
  const [captionType, setCaptionType] = useState('event');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [generatedCaption, setGeneratedCaption] = useState('');

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleGenerateCaption = () => {
    try {
      setLoading(true);
      setError('');
      
      const templates = captionType === 'event' ? EVENT_CAPTIONS : IMAGE_CAPTIONS;
      const randomIndex = Math.floor(Math.random() * templates.length);
      let caption = templates[randomIndex];

      if (captionType === 'event') {
        caption = caption
          .replace(/{title}/g, event.title)
          .replace(/{date}/g, formatDate(event.startDate))
          .replace(/{venue}/g, event.venue?.name || 'the venue');
      } else {
        const title = images[selectedImageIndex].title || event.title;
        caption = caption.replace(/{title}/g, title);
      }

      setGeneratedCaption(caption);
    } catch (err) {
      setError('Failed to generate caption. Please try again.');
      console.error('Caption generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!generatedCaption) {
      setError('Please generate a caption first');
      return;
    }
    onCaptionGenerated(generatedCaption);
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
              Select which image to base your caption on.
            </p>
            <div className="image-selector">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className={`image-option ${selectedImageIndex === index ? 'selected' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                  title={`Image ${index + 1}`}
                >
                  <img src={img.croppedImage || img.link} alt={`Option ${index + 1}`} />
                  {selectedImageIndex === index && (
                    <div className="selected-indicator">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {generatedCaption && (
        <div className="generated-caption">
          <h3>Generated Caption</h3>
          <p>{generatedCaption}</p>
          <button 
            className="secondary-btn"
            onClick={() => navigator.clipboard.writeText(generatedCaption)}
          >
            Copy to Clipboard
          </button>
        </div>
      )}

      <div className="button-container">
        <button 
          className="primary-btn generate-btn"
          onClick={handleGenerateCaption}
        >
          Generate Caption
        </button>
        {generatedCaption && (
          <button 
            className="primary-btn next-btn"
            onClick={handleNext}
          >
            Next: Prepare for Instagram
          </button>
        )}
      </div>
    </div>
  );
};

export default CaptionGenerator; 