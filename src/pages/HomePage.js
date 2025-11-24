import React, { useState } from 'react';
import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';
import BabyCollection from '../components/BabyCollection'; 

import { soapProducts, faceWashProducts, otherProducts, shampooProducts } from '../productdata';

// --- 1. Add the Quick View Modal Component here ---
function QuickViewModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className="quick-view-modal-overlay" onClick={onClose}>
      <div className="quick-view-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
        <div className="modal-image"><img src={product.img} alt={product.title} /></div>
        <div className="modal-details">
          <h2>{product.title}</h2>
          <div className="modal-rating">{product.rating} <span>({product.reviews})</span></div>
          <div className="modal-price">{product.price}</div>
          <p>{product.description}</p>
          {/* You can add an Add to Cart button here if you want */}
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  // --- 2. Add State for the Modal ---
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const closeQuickView = () => {
    setSelectedProduct(null);
  };

 
  return (
    <>
      <Hero />

      {/* Optional: Add Banner here if you want */}
      {/* <div className="shop-page-header"><ImageSlider images={bannerImages} /></div> */}
      
      <BabyCollection/>

      {/* --- 3. Pass 'onQuickView' to ALL Carousels --- */}
      
      <ProductCarousel 
          title={<>Our Soap</>}
          products={soapProducts} 
          category="Soaps"
          onQuickView={handleQuickView} 
      />
      
      <ProductCarousel 
          title={<>Powder<br />Facewash</>}
          products={faceWashProducts} 
          category="Facewash"
          onQuickView={handleQuickView}
      />

      <ProductCarousel
          title={<>Our <br />Shampoo</>}
          products={shampooProducts} 
          category="Shampoos"
          onQuickView={handleQuickView}
      />
      
      <ProductCarousel 
          title={<>Other<br />Products</>}
          products={otherProducts} 
          category="Other"
          onQuickView={handleQuickView}
      />

      {/* --- 4. Render the Modal --- */}
      <QuickViewModal product={selectedProduct} onClose={closeQuickView} />
    </>
  );
}

export default HomePage;