import React, { useState } from 'react';
import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';

import { soapProducts, faceWashProducts, otherProducts, shampooProducts, faceMaskProducts, babyProducts } from '../productdata';

// --- Helper to safely get tags ---
const getPrimaryTag = (tags) => {
  if (!tags) return 'General';
  const tagArray = Array.isArray(tags) ? tags : [tags];
  return tagArray.find(tag => tag !== 'general') || tagArray[0] || 'General';
};

// --- 1. PREPARE DATA ---
const safebaby = babyProducts.map(p => ({ ...p, id: p.title, category: 'Baby', primaryTag: getPrimaryTag(p.tags) }));
const safeSoaps = soapProducts.map(p => ({ ...p, id: p.title, category: 'Soaps', primaryTag: getPrimaryTag(p.tags) }));
const safeFacewash = faceWashProducts.map(p => ({ ...p, id: p.title, category: 'Facewash', primaryTag: getPrimaryTag(p.tags) }));
const safeShampoos = shampooProducts.map(p => ({ ...p, id: p.title, category: 'Shampoos', primaryTag: getPrimaryTag(p.tags) }));
const safeOther = otherProducts.map(p => ({ ...p, id: p.title, category: 'Other', primaryTag: getPrimaryTag(p.tags) }));
const safeMasks = faceMaskProducts ? faceMaskProducts.map(p => ({ 
  ...p, id: p.title, category: 'FaceMasks', primaryTag: getPrimaryTag(p.tags) 
})) : [];


// --- 2. Quick View Modal Component ---
function QuickViewModal({ product, onClose }) {
  if (!product) return null;
  const tags = product.tags ? (Array.isArray(product.tags) ? product.tags : [product.tags]) : [];

  return (
    <div className="quick-view-modal-overlay" onClick={onClose}>
      <div className="quick-view-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
        <div className="modal-image"><img src={product.img} alt={product.title} /></div>
        <div className="modal-details">
          <h2>{product.title}</h2>
          
          <p>{product.description}</p>
          
          {tags.length > 0 && (
            <div className="modal-tags-container">
                <h4>Key Benefits:</h4>
                <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                {tags.map((tag, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{tag}</li>
                ))}
                </ul>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleQuickView = (product) => setSelectedProduct(product);
  const closeQuickView = () => setSelectedProduct(null);

  return (
    <>
      <Hero />
      
      <ProductCarousel 
          title={<>Baby<br />Products</>}
          products={safebaby}
          category="Baby"
          onQuickView={handleQuickView}
      />

      <ProductCarousel 
          title={<>Handmade<br />Soaps</>}
          products={safeSoaps} 
          category="Soaps"
          onQuickView={handleQuickView} 
      />
      
      <ProductCarousel 
          title={<>Powder<br />Facewash</>}
          products={safeFacewash} 
          category="Facewash"
          onQuickView={handleQuickView}
      />

      {safeMasks.length > 0 && (
          <div className="facemask-carousel-wrapper">
            <ProductCarousel 
                title={
                    <div style={{ position:'relative', display: 'inline-block' }}>
                        <div className="sunscreen-floating-badge">
                            <div className="sun-icon-glow">
                                <i className="fas fa-sun"></i>
                            </div>
                            <span>Sunscreen Essential<br/>After Face Packs</span>
                        </div><br />
                        <>Natural<br />Face Packs</>
                    </div>
                }
                products={safeMasks}
                category="FaceMask"
                onQuickView={handleQuickView}
            />
          </div>
      )}

      <ProductCarousel
          title={<>Natural<br />Shampoos</>}
          products={safeShampoos} 
          category="Shampoos"
          onQuickView={handleQuickView}
      />
      
      <ProductCarousel 
          title={<>Other<br />Products</>}
          products={safeOther} 
          category="Other"
          onQuickView={handleQuickView}
      />

      <QuickViewModal product={selectedProduct} onClose={closeQuickView} />
    </>
  );
}

export default HomePage;