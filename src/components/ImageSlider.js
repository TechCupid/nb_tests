import React, { useState, useEffect, useRef } from 'react';

function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    // Slide every 4 seconds
    timeoutRef.current = setTimeout(
      () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length),
      4000 
    );
    return () => resetTimeout();
  }, [currentIndex, images.length]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  }

  if (!images || images.length === 0) {
    return null; 
  }

  return (
    <div className="shop-slider-container">
      <div 
        className="shop-slider-track" 
        // This math makes it show 3 slides at once
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, index) => (
          <div className="shop-slide" key={index}>
            <img src={img.src} alt={img.alt} />
            <div className="shop-slide-caption">{img.caption}</div>
          </div>
        ))}
      </div>
      <div className="shop-slider-dots">
        {images.map((_, index) => (
          <div
            key={index}
            className={`shop-slider-dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}
export default ImageSlider;