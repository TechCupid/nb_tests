import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard'; 

// --- Helper function to get the correct rem breakpoint -

// --- A helper object to map categories to their page links ---
const categoryLinks = {
  Soaps: '/soaps',
  Facewash: '/facewash',
  Other: '/other',
};

function ProductCarousel({ title, products, category }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3); // Default to 3
  
  // --- NEW: State to track touch swipe ---
  const [touchStartPos, setTouchStartPos] = useState(0);
  const [touchEndPos, setTouchEndPos] = useState(0);

  const sliderTrackRef = useRef(null);
  const wrapperRef = useRef(null); 

  // --- This effect watches the SLIDER WRAPPER's width ---
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined' || !wrapper) {
      return;
    }

    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const wrapperWidth = entries[0].contentRect.width;
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const widthInRem = wrapperWidth / rootFontSize;
        
        if (widthInRem >= 80) { // 4-card layout
          setCardsPerView(4);
        } else if (widthInRem >= 60) { // 3-card layout
          setCardsPerView(3);
        } else if (widthInRem >= 39) { // 2-card layout
          setCardsPerView(2);
        } else { // 1-card layout
          setCardsPerView(1);
        }
      }
    });

    observer.observe(wrapper);
    return () => observer.disconnect();
    
  }, []); 

  
  const maxPage = Math.max(0, products.length - cardsPerView);
  const viewAllLink = categoryLinks[category] || '/shop';

  const slide = (direction) => {
      const newPage = currentPage + direction;
      // Clamp the page to be between 0 and maxPage
      if (newPage < 0) {
        setCurrentPage(0);
      } else if (newPage > maxPage) {
        setCurrentPage(maxPage);
      } else {
        setCurrentPage(newPage);
      }
  };

  // This effect moves the slider when 'currentPage' changes
  useEffect(() => {
    const scrollAmountInRem = 20.625; // Card (18.75rem) + Gap (1.875rem)
    const newTransformX = -currentPage * scrollAmountInRem;

    if (sliderTrackRef.current) {
        sliderTrackRef.current.style.transform = `translateX(${newTransformX}rem)`;
    }
  }, [currentPage]);

  // This effect resets the slider if the layout changes (e.g., on zoom)
  useEffect(() => {
    setCurrentPage(0); // Reset to first slide on resize/zoom
  }, [cardsPerView]);

  // --- NEW: Touch event handlers ---
  const handleTouchStart = (e) => {
    setTouchEndPos(0); // Reset end position
    setTouchStartPos(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndPos(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartPos === 0 || touchEndPos === 0) {
      return; // Not a swipe
    }

    const diff = touchStartPos - touchEndPos;
    const swipeThreshold = 50; // User must swipe at least 50px

    if (diff > swipeThreshold) {
      // Swiped Left (Next)
      slide(1);
    } else if (diff < -swipeThreshold) {
      // Swiped Right (Previous)
      slide(-1);
    }

    // Reset positions
    setTouchStartPos(0);
    setTouchEndPos(0);
  };


  return (
      <section className="product-carousel">
          <div className="carousel-sidebar">
              <h2>{title}</h2>
              
              <Link to={viewAllLink} className="view-all-btn">
                View All
              </Link>

          </div>
          <div className="slider-container">
              {currentPage > 0 && (
                  <button className="slider-btn prev" onClick={() => slide(-1)}>
                      <i className="fas fa-chevron-left"></i>
                  </button>
              )}
              
              <div className="slider-wrapper" ref={wrapperRef}>
                  {/* --- NEW: Added touch event listeners --- */}
                  <div 
                    className="slider-track" 
                    ref={sliderTrackRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                      {products.map((product) => (
                          <ProductCard key={product.title} product={product} />
                      ))}
                  </div>
              </div>
              
              {currentPage < maxPage && (
                  <button className="slider-btn next" onClick={() => slide(1)}>
                      <i className="fas fa-chevron-right"></i>
                  </button>
              )}
          </div>
      </section>
  );
}
export default ProductCarousel;