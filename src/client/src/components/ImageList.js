import React from 'react';
import './ImageList.css';

const ImageList = ({ images, selectedImages = [], onSelectImage, maxImages = 8 }) => {
  if (!images || images.length === 0) {
    return (
      <div className="image-list-empty card">
        <p>No images found. Try searching with different terms.</p>
      </div>
    );
  }

  const filteredCount = images.length;
  const totalCount = images.length + (selectedImages.length > 0 ? 1 : 0); // Add 1 to account for filtered images

  return (
    <div className="image-list">
      <h2>Images ({filteredCount})</h2>
      {selectedImages.length > 0 ? (
        <p className="selection-info">
          Showing compatible images only. Select up to {maxImages} images. Click an image to select/deselect it.
          {filteredCount < totalCount && (
            <span className="filtered-count">
              {totalCount - filteredCount} images hidden due to incompatible aspect ratios
            </span>
          )}
        </p>
      ) : (
        <p className="selection-info">Select up to {maxImages} images. Click an image to select/deselect it.</p>
      )}
      <div className="image-grid">
        {images.map((image, index) => {
          const isSelected = selectedImages.some(img => img.link === image.link);
          return (
            <div 
              key={index} 
              className={`image-card card ${isSelected ? 'selected' : ''}`} 
              onClick={() => onSelectImage(image)}
            >
              <div className="image-container">
                <img 
                  src={image.link} 
                  alt={image.title} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Unavailable';
                    // Mark image as broken
                    image.broken = true;
                  }}
                />
                {isSelected && (
                  <>
                    <div className="selected-overlay"></div>
                    <div className="checkmark-indicator" style={{ top: '5px', right: '5px' }}>✓</div>
                  </>
                )}
              </div>
              <div className="image-details">
                <h3>{image.title}</h3>
                <p className="image-dimensions">
                  {image.width} x {image.height} 
                  {image.width && image.height && (
                    <span> (Ratio: {(image.width / image.height).toFixed(2)})</span>
                  )}
                </p>
                <button 
                  className={`${isSelected ? 'secondary-btn' : 'primary-btn'} select-btn`}
                >
                  {isSelected ? 'Deselect' : 'Select Image'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageList; 