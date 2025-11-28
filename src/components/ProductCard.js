import React from 'react';

function ProductCard({ product, viewMode, onQuickView }) {



  return (
    <div className={`product-card ${viewMode === 'list' ? 'list-view' : ''}`}>
      <div className="card-image-container">
        <img src={product.img} alt={product.title} />

        <button className="quick-view-btn" onClick={() => onQuickView(product)}>
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