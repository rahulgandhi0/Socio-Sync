import React from 'react';
import './ImageList.css';

const ImageList = ({ images, onSelectImage }) => {
  if (!images || images.length === 0) {
    return (
      <div className="image-list-empty card">
        <p>No images found. Try searching with different terms.</p>
      </div>
    );
  }

  return (
    <div className="image-list">
      <h2>Images ({images.length})</h2>
      <div className="image-grid">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="image-card card" 
            onClick={() => onSelectImage(image)}
          >
            <div className="image-container">
              <img src={image.link} alt={image.title} />
            </div>
            <div className="image-details">
              <h3>{image.title}</h3>
              <p className="image-dimensions">
                {image.width} x {image.height}
              </p>
              <button className="primary-btn select-btn">Select Image</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageList; 