import React, { useState } from 'react';
import './ImageCropper.css';

const ImageCropper = ({ images, onImagesCropped }) => {
  const [cropRatio, setCropRatio] = useState('1:1'); // Default to 1:1 (square)
  const [croppedImages, setCroppedImages] = useState([]);
  
  // Handle crop ratio change
  const handleRatioChange = (e) => {
    setCropRatio(e.target.value);
  };
  
  // Apply the selected aspect ratio to all images
  const handleApplyCrop = () => {
    // In a real implementation, this would apply actual cropping
    // For now, we'll just simulate returning the images with metadata about cropping
    const processedImages = images.map(image => ({
      ...image,
      cropRatio: cropRatio,
      isCropped: true
    }));
    
    setCroppedImages(processedImages);
    onImagesCropped(processedImages);
  };
  
  return (
    <div className="image-cropper">
      <div className="crop-controls card">
        <h2>Adjust Images for Instagram</h2>
        <p>Instagram requires consistent aspect ratios. Choose how you want to crop all selected images:</p>
        
        <div className="ratio-selector">
          <div className="form-group">
            <label htmlFor="cropRatio">Aspect Ratio:</label>
            <select 
              id="cropRatio" 
              value={cropRatio}
              onChange={handleRatioChange}
            >
              <option value="1:1">Square (1:1)</option>
              <option value="4:5">Portrait (4:5)</option>
            </select>
          </div>
          
          <div className="crop-preview">
            <div className={`preview-box ${cropRatio === '1:1' ? 'square' : 'portrait'}`}>
              <span>{cropRatio}</span>
            </div>
          </div>
        </div>
        
        <button className="primary-btn" onClick={handleApplyCrop}>
          Apply to All Images & Continue
        </button>
      </div>
      
      <div className="images-to-crop">
        <h3>Selected Images ({images.length})</h3>
        <div className="images-grid">
          {images.map((image, index) => (
            <div key={index} className="crop-image-container">
              <div className={`crop-outline ${cropRatio === '1:1' ? 'square' : 'portrait'}`}>
                <img src={image.link} alt={image.title} />
              </div>
              <p className="image-title">{image.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCropper; 