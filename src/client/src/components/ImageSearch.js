import React, { useState, useRef } from 'react';
import { getImages } from '../services/api';
import './ImageSearch.css';

const ImageSearch = ({ eventTitle, setImages, setLoading, setError, onProceed }) => {
  const [query, setQuery] = useState(eventTitle || '');
  const [aspectRatio, setAspectRatio] = useState('wide');
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      const images = await getImages(query, aspectRatio, 'high');
      setImages(images);
      
      if (images.length === 0) {
        setError('No images found. Try a different search query.');
      }
    } catch (err) {
      setError('Failed to fetch images. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setError('Please upload only image files');
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const newImage = {
            link: event.target.result,
            title: file.name,
            width: img.width,
            height: img.height,
            isUploaded: true
          };
          setImages(prevImages => [...prevImages, newImage]);
          if (onProceed) {
            onProceed();
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-search">
      {/* Upload Section */}
      <section className="upload-section card">
        <h2>Upload Your Images</h2>
        <p className="section-description">Upload your own images to use in your post</p>
        
        <div className="upload-container">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="file-input"
            id="image-upload"
            multiple
          />
          <label htmlFor="image-upload" className="upload-button">
            Choose Images
          </label>
          <p className="upload-hint">You can select multiple images</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section card">
        <h2>Search for Images</h2>
        <p className="section-description">Search for high-quality images related to your event</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="query">Search Query</label>
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter search terms"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="aspectRatio">Aspect Ratio</label>
              <select
                id="aspectRatio"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
              >
                <option value="wide">Wide (Landscape)</option>
                <option value="tall">Tall (Portrait)</option>
                <option value="square">Square</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Image Quality</label>
              <div className="quality-display">High Quality Photos Only</div>
            </div>
          </div>
          
          <button type="submit" className="primary-btn">
            Search Images
          </button>
        </form>
      </section>
    </div>
  );
};

export default ImageSearch; 