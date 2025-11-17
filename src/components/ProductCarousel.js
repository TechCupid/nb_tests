import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard'; 

// --- MODIFIED: Added new links ---
const categoryLinks = {
  Soaps: '/soaps',
  Facewash: '/facewash',
  Other: '/other',
  // --- Old links (can be left or removed) ---
  Shampoos: '/shampoos',
  'Lip Balms': '/lipbalms'
};

function ProductCarousel({ title, products, category }) {
    const [currentPage, setCurrentPage] = useState(0);
    const sliderTrackRef = useRef(null); 
    
    const CARDS_PER_VIEW = 3;
    // --- Fix: Ensure maxPage isn't negative if there are few products ---
    const maxPage = Math.max(0, products.length - CARDS_PER_VIEW);

    const viewAllLink = categoryLinks[category] || '/shop';

    const slide = (direction) => {
        const newPage = currentPage + direction;

        if (newPage < 0 || newPage > maxPage) return;

        const scrollAmount = (360 + 40); 
        
        const newTransformX = -newPage * scrollAmount;

        if (sliderTrackRef.current) {
            sliderTrackRef.current.style.transform = `translateX(${newTransformX}px)`;
        }
        
        setCurrentPage(newPage);
    };

    return (
        <section className="product-carousel">
            <div className="carousel-sidebar">
                <h2> {title}</h2>
                
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
                
                <div className="slider-wrapper">
                    <div className="slider-track" ref={sliderTrackRef}>
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