import React from 'react';
import './StatusScreen.css';

function StatusScreen({ status, error, onReset }) {
  // Check for success in multiple ways:
  // 1. Status code 200
  // 2. Message includes "successfully published"
  // 3. Message includes "Published"
  const isSuccess = 
    status?.status_code === 200 || 
    status?.message?.toLowerCase().includes('successfully published') ||
    status?.message?.toLowerCase().includes('published');

  return (
    <div className="status-screen">
      <div className={`status-card ${isSuccess ? 'success' : 'error'}`}>
        {isSuccess ? (
          <>
            <div className="status-icon success">✓</div>
            <h2>Success!</h2>
            <p>Your post has been successfully published to Instagram.</p>
            <p className="status-details">Status: {status?.message}</p>
          </>
        ) : (
          <>
            <div className="status-icon error">✕</div>
            <h2>Failed to Publish</h2>
            <p>{error || 'There was an error publishing your post to Instagram.'}</p>
            {status?.message && (
              <p className="status-details">Error: {status.message}</p>
            )}
          </>
        )}
        <button 
          className="reset-button" 
          onClick={onReset}
        >
          Create Another Post
        </button>
      </div>
    </div>
  );
}

export default StatusScreen; 