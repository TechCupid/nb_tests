import React, { useState } from 'react';
import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';

import { soapProducts, faceWashProducts, otherProducts, shampooProducts, faceMaskProducts, babyProducts,categoryPrices } from '../productdata';



// --- Helper to safely get tags ---
const getPrimaryTag = (tags) => {
  if (!tags) return 'General';
  const tagArray = Array.isArray(tags) ? tags : [tags];
  return tagArray.find(tag => tag !== 'general') || tagArray[0] || 'General';
};

// --- 1. PREPARE DATA ---
const safebaby = babyProducts.map(p => ({ ...p, id: p.title, category: 'Baby', primaryTag: getPrimaryTag(p.tags) }));
const safeSoaps = soapProducts.map(p => ({ ...p, id: p.title, category: 'Soap', primaryTag: getPrimaryTag(p.tags) }));
const safeFacewash = faceWashProducts.map(p => ({ ...p, id: p.title, category: 'Facewash', primaryTag: getPrimaryTag(p.tags) }));
const safeShampoos = shampooProducts.map(p => ({ ...p, id: p.title, category: 'Shampoo', primaryTag: getPrimaryTag(p.tags) }));
const safeOther = otherProducts.map(p => ({ ...p, id: p.title, category: 'Others', primaryTag: getPrimaryTag(p.tags) }));
const safeMasks = faceMaskProducts ? faceMaskProducts.map(p => ({ 
  ...p, id: p.title, category: 'Facepack', primaryTag: getPrimaryTag(p.tags) 
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

          {product.howToUse && (
            <div className="modal-how-to">
                <h4>How to Use:</h4>
                <p>{product.howToUse}</p>
            </div>
          )}
          
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
          title={<>Baby <br className="desktop-break" />Product</>}
          products={safebaby}
          category="Baby"
          startingPrice={categoryPrices.Baby}
          onQuickView={handleQuickView}
      />

      <ProductCarousel 
          title={<>Handmade <br className="desktop-break" />Soap</>}
          products={safeSoaps} 
          category="Soap"
          startingPrice={categoryPrices.Soap}
          onQuickView={handleQuickView} 
      />
      
      <ProductCarousel 
          title={<>Powder <br className="desktop-break" />Facewash</>}
          products={safeFacewash} 
          category="Facewash"
          startingPrice={categoryPrices.Facewash}
          onQuickView={handleQuickView}
      />

     {safeMasks.length > 0 && (
  // 1. Ensure wrapper is relative so badge positions inside it
  <div className="facemask-carousel-wrapper" style={{ position: 'relative' }}>
    
    {/* 2. THE BADGE (Placed before the carousel) */}
    <div className="sunscreen-floating-badge">
        <div className="sun-icon-glow">
            <i className="fas fa-sun"></i>
        </div>
        <span>Sunscreen Essential<br/>After Facepack</span>
    </div>

    {/* 3. THE CAROUSEL (Clean Title) */}
    <ProductCarousel 
        title={<>Natural <br className="desktop-break" />FacePack</>}
        products={safeMasks}
        category="FaceMask"
        startingPrice={categoryPrices.Facepack}
        onQuickView={handleQuickView}
    />
  </div>
)}
      <ProductCarousel
          title={<>Natural <br className="desktop-break" />Shampoo</>}
          products={safeShampoos} 
          category="Shampoo"
          startingPrice={categoryPrices.Shampoo}
          onQuickView={handleQuickView}
      />
      
      <ProductCarousel 
          title={<>Other <br className="desktop-break" />Products</>}
          products={safeOther} 
          category="Others"
          startingPrice={categoryPrices.Others}
          onQuickView={handleQuickView}
      />

      <QuickViewModal product={selectedProduct} onClose={closeQuickView} />
    </>
  );
}

export default HomePage;