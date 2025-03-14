import React, { useState } from 'react';
import { getImages } from '../services/api';
import './ImageSearch.css';

const ImageSearch = ({ eventTitle, setImages, setLoading, setError }) => {
  const [query, setQuery] = useState(eventTitle || '');
  const [aspectRatio, setAspectRatio] = useState('wide');
  const [quality, setQuality] = useState('high');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      const images = await getImages(query, aspectRatio, quality);
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

  return (
    <div className="image-search card">
      <h2>Find Images</h2>
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
            <label htmlFor="quality">Image Quality</label>
            <select
              id="quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option value="high">High (Photos)</option>
              <option value="medium">Medium (Clipart)</option>
            </select>
          </div>
        </div>
        
        <button type="submit" className="primary-btn">
          Search Images
        </button>
      </form>
    </div>
  );
};

export default ImageSearch; 