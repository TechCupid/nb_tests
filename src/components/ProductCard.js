import React from 'react';

function ProductCard({ product, viewMode, onQuickView }) {

  if (!product) return null;

  return (
    <div className={`product-card ${viewMode === 'list' ? 'list-view' : ''}`}>
      
      {/* --- ADDED onClick HERE --- */}
      <div 
        className="card-image-container" 
        onClick={() => onQuickView && onQuickView(product)}
        style={{ cursor: 'pointer' }} /* Makes it look clickable */
      >
        <img src={product.img} alt={product.title} />

        {/* This button still works for Desktop hover effects */}
        <button 
          className="quick-view-btn" 
          onClick={(e) => {
            e.stopPropagation(); // Prevents double-firing if button is clicked
            onQuickView(product);
          }}
        >
          Quick View
        </button>
      </div>
      
      <div className="card-content-container">
        <h3>{product.title}</h3>
        <p>{product.subtitle}</p>
        <p>{product.description}</p>
        
        {/* --- REMOVED: All "Add to Cart" buttons --- */}
        
      </div>
    </div>
  );
}

export default ProductCard;