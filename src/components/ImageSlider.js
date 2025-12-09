import React, { useState, useEffect, useRef } from 'react';

function ImageSlider({ images }) {
  // 1. Create a new list that has a CLONE of the first image at the end
  const slides = images && images.length > 0 ? [...images, images[0]] : [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true); // Control animation
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    
    // Only set the timer if we are not currently fixing the loop (at the clone)
    if (currentIndex < slides.length - 1) {
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }, 4000);
    } else {
        // If we are at the last slide (the clone), the handleTransitionEnd will fix it.
        // But strictly for safety, we trigger the next slide logic if needed.
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }, 4000);
    }

    return () => resetTimeout();
  }, [currentIndex, slides.length]);

  // --- THE MAGIC LOGIC ---
  const handleTransitionEnd = () => {
    // If we have reached the CLONE (the last item in our new list)
    if (currentIndex === slides.length - 1) {
      // 1. Turn off animation immediately
      setIsTransitioning(false);
      // 2. Jump instantly to the REAL first slide (index 0)
      setCurrentIndex(0);
      
      // 3. Turn animation back on after a tiny delay so the next slide is smooth
      setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
    }
  };

  const goToSlide = (slideIndex) => {
    setIsTransitioning(true);
    setCurrentIndex(slideIndex);
  };

  if (!images || images.length === 0) {
    return null; 
  }

  return (
    <div className="shop-slider-container">
      <div 
        className="shop-slider-track" 
        style={{ 
            // Calculate width based on extended slides
            transform: `translateX(-${currentIndex * 100}%)`,
            // Toggle transition: Turn it OFF when jumping from Clone -> Start
            transition: isTransitioning ? 'transform 1s ease-in-out' : 'none' 
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((img, index) => (
          <div className="shop-slide" key={index}>
            <img src={img.src} alt={img.alt} />
            {/* Only show caption if it's not the clone, or handle it simply */}
            <div className="shop-slide-caption">{img.caption}</div>
          </div>
        ))}
      </div>

      {/* Dots (We use the original 'images' array so we don't get an extra dot) */}
      <div className="shop-slider-dots">
        {images.map((_, index) => (
          <div
            key={index}
            // Logic to highlight dot even if we are on the 'clone' slide
            className={`shop-slider-dot ${currentIndex % images.length === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default ImageSlider;