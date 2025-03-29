import React, { useState } from 'react';
import './InstagramPublish.css';

function InstagramPublish({ 
  selectedImages, 
  selectedEvent, 
  caption,
  onPublish,
  setError 
}) {
  const [publishParams, setPublishParams] = useState({
    userTags: [], // [{username: string, x: number, y: number}]
    locationId: '', // from Pages Search API
    collaborators: [], // array of usernames
    imageOrder: selectedImages.map((_, index) => index) // maintain carousel order
  });

  const [locationSearch, setLocationSearch] = useState('');
  const [userTagInput, setUserTagInput] = useState('');
  const [collaboratorInput, setCollaboratorInput] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [tagMode, setTagMode] = useState(false); // for user tagging UI

  // Handle image click for user tagging
  const handleImageClick = (e) => {
    if (!tagMode || !userTagInput) return;

    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setPublishParams(prev => ({
      ...prev,
      userTags: [...prev.userTags, {
        username: userTagInput,
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(y.toFixed(2))
      }]
    }));

    setUserTagInput('');
    setTagMode(false);
  };

  // Handle image reordering for carousel
  const moveImage = (index, direction) => {
    const newOrder = [...publishParams.imageOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + direction];
    newOrder[index + direction] = temp;
    setPublishParams(prev => ({ ...prev, imageOrder: newOrder }));
  };

  // Add collaborator
  const addCollaborator = () => {
    if (!collaboratorInput || publishParams.collaborators.length >= 3) return;
    
    setPublishParams(prev => ({
      ...prev,
      collaborators: [...prev.collaborators, collaboratorInput]
    }));
    setCollaboratorInput('');
  };

  // Remove collaborator
  const removeCollaborator = (index) => {
    setPublishParams(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter((_, i) => i !== index)
    }));
  };

  // Remove user tag
  const removeUserTag = (index) => {
    setPublishParams(prev => ({
      ...prev,
      userTags: prev.userTags.filter((_, i) => i !== index)
    }));
  };

  const handlePublish = async () => {
    try {
      await onPublish({
        ...publishParams,
        images: publishParams.imageOrder.map(i => ({
          ...selectedImages[i],
          // Use the cropped image data instead of the original link
          link: selectedImages[i].croppedImage || selectedImages[i].link
        })),
        caption,
        eventDetails: selectedEvent
      });
    } catch (err) {
      setError('Failed to prepare Instagram post. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="instagram-publish card">
      <h2>Prepare Instagram Post</h2>
      
      <div className="carousel-preview">
        <h3>Image Order</h3>
        <div className="image-order-container">
          {publishParams.imageOrder.map((imageIndex, currentIndex) => (
            <div key={imageIndex} className="carousel-image-container">
              <img 
                src={selectedImages[imageIndex].croppedImage || selectedImages[imageIndex].link} 
                alt={`Selected ${currentIndex + 1}`}
                className={activeImageIndex === currentIndex ? 'active' : ''}
                onClick={() => setActiveImageIndex(currentIndex)}
              />
              <div className="image-controls">
                {currentIndex > 0 && (
                  <button onClick={() => moveImage(currentIndex, -1)}>←</button>
                )}
                {currentIndex < selectedImages.length - 1 && (
                  <button onClick={() => moveImage(currentIndex, 1)}>→</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tagging-section">
        <h3>User Tags</h3>
        <div className="tag-input">
          <input
            type="text"
            value={userTagInput}
            onChange={(e) => setUserTagInput(e.target.value)}
            placeholder="Enter Instagram username"
            className="form-control"
          />
          <button 
            className="secondary-btn"
            onClick={() => setTagMode(!tagMode)}
            disabled={!userTagInput}
          >
            {tagMode ? 'Cancel Tag' : 'Add Tag'}
          </button>
        </div>
        {tagMode && <p className="tag-instruction">Click on the image to place the tag</p>}
        
        <div className="active-image-container">
          <img
            src={selectedImages[publishParams.imageOrder[activeImageIndex]].croppedImage || 
                 selectedImages[publishParams.imageOrder[activeImageIndex]].link}
            alt="Active for tagging"
            onClick={handleImageClick}
            className={tagMode ? 'tagging-mode' : ''}
          />
          {publishParams.userTags.map((tag, index) => (
            <div
              key={index}
              className="user-tag"
              style={{ left: `${tag.x * 100}%`, top: `${tag.y * 100}%` }}
              onClick={() => removeUserTag(index)}
            >
              @{tag.username}
            </div>
          ))}
        </div>
      </div>

      <div className="collaborators-section">
        <h3>Collaborators (Max 3)</h3>
        <div className="collaborator-input">
          <input
            type="text"
            value={collaboratorInput}
            onChange={(e) => setCollaboratorInput(e.target.value)}
            placeholder="Enter collaborator's username"
            className="form-control"
            disabled={publishParams.collaborators.length >= 3}
          />
          <button 
            className="secondary-btn"
            onClick={addCollaborator}
            disabled={!collaboratorInput || publishParams.collaborators.length >= 3}
          >
            Add
          </button>
        </div>
        <div className="collaborators-list">
          {publishParams.collaborators.map((username, index) => (
            <div key={index} className="collaborator-tag">
              @{username}
              <button onClick={() => removeCollaborator(index)}>×</button>
            </div>
          ))}
        </div>
      </div>

      <div className="location-section">
        <h3>Location</h3>
        <input
          type="text"
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
          placeholder="Search for a location"
          className="form-control"
        />
        {/* Location search results would go here */}
      </div>

      <div className="caption-preview">
        <h3>Caption Preview</h3>
        <div className="caption-text">
          {caption}
        </div>
      </div>

      <button 
        className="primary-btn"
        onClick={handlePublish}
      >
        Prepare for Instagram
      </button>
    </div>
  );
}

export default InstagramPublish; 