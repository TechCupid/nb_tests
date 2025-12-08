import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard'; 

// --- A helper object to map categories to their page links ---
const categoryLinks = {
  Soaps: '/soaps',
  Facewash: '/facewash',
  Other: '/other',
  Baby: '/baby',
  Shampoos: '/shampoos',
  // FIX: Changed key to match the prop passed from HomePage ("FaceMask")
  FaceMask: '/facemasks', 
};

function ProductCarousel({ title, products, category, onQuickView }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3); 
  
  const [touchStartPos, setTouchStartPos] = useState(0);
  const [touchEndPos, setTouchEndPos] = useState(0);

  const sliderTrackRef = useRef(null);
  const wrapperRef = useRef(null); 

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
        
        if (widthInRem >= 55) { 
          setCardsPerView(3);
        } else if (widthInRem >= 39) { 
          setCardsPerView(2);
        } else { 
          setCardsPerView(1);
        }
      }
    });

    observer.observe(wrapper);
    return () => observer.disconnect();
    
  }, []); 

  const maxPage = Math.max(0, products.length - cardsPerView);
  
  // --- FIX: Logic to ensure a valid link ---
  // If the category exists in our map, use it. Otherwise default to /shop
  const viewAllLink = categoryLinks[category] || '/shop';

  const slide = (direction) => {
      const newPage = currentPage + direction;
      if (newPage < 0) {
        setCurrentPage(0);
      } else if (newPage > maxPage) {
        setCurrentPage(maxPage);
      } else {
        setCurrentPage(newPage);
      }
  };

  useEffect(() => {
    const scrollAmountInRem = 20.625; 
    const newTransformX = -currentPage * scrollAmountInRem;

    if (sliderTrackRef.current) {
        sliderTrackRef.current.style.transform = `translateX(${newTransformX}rem)`;
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(0); 
  }, [cardsPerView]);

  const handleTouchStart = (e) => {
    setTouchEndPos(0); 
    setTouchStartPos(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndPos(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartPos === 0 || touchEndPos === 0) return; 

    const diff = touchStartPos - touchEndPos;
    const swipeThreshold = 50; 

    if (diff > swipeThreshold) {
      slide(1);
    } else if (diff < -swipeThreshold) {
      slide(-1);
    }
    setTouchStartPos(0);
    setTouchEndPos(0);
  };


  return (
      <section className="product-carousel">
          <div className="carousel-sidebar">
              <h2>{title}</h2>
              
              {/* This link now correctly points to /baby, /soaps, etc. */}
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
                  <div 
                    className="slider-track" 
                    ref={sliderTrackRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                      {products.map((product) => (
                          <ProductCard 
                            key={product.title} 
                            product={product} 
                            onQuickView={() => onQuickView && onQuickView(product)}
                          />
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