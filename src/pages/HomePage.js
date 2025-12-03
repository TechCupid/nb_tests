import React, { useState } from 'react';
import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';
import BabyCollection from '../components/BabyCollection'; 

import { soapProducts, faceWashProducts, otherProducts, shampooProducts, faceMaskProducts } from '../productdata';

// --- 1. Add the Quick View Modal Component here ---
function QuickViewModal({ product, onClose }) {
  if (!product) return null;

  // --- FIX: Ensure tags is always an array before mapping ---
  // This prevents the crash if tags is just a string like "Oily Skin"
  const tags = product.tags 
    ? (Array.isArray(product.tags) ? product.tags : [product.tags]) 
    : [];

  return (
    <div className="quick-view-modal-overlay" onClick={onClose}>
      <div className="quick-view-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
        <div className="modal-image"><img src={product.img} alt={product.title} /></div>
        <div className="modal-details">
          <h2>{product.title}</h2>
          
          <p>{product.description}</p>
          
          {/* UPDATED: Safely render tags */}
          {tags.length > 0 && (
            <div className="modal-tags-container">
                <h4>Key Benefits:</h4>
                <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                {tags.map((tag, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>
                    {tag}
                    </li>
                ))}
                </ul>
            </div>
          )}

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
              title={<>Powder<br />FaceMask</>}
              products={faceMaskProducts}
              category="FaceMask"
              onQuickView={handleQuickView}
          />
      )y

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