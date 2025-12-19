// src/components/ImageDisclaimer.js
import React from 'react';

function ImageDisclaimer() {
  return (
    <div className="ai-disclaimer-container">
      <div className="ai-disclaimer-content">
        <i className="fas fa-info-circle"></i>
        <span>
          <strong>Disclaimer:</strong> Images shown on this website are for visual representation only. 
          Actual product packaging and appearance may vary.
        </span>
      </div>
    </div>
  );
}

export default ImageDisclaimer;