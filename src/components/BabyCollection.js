import React from 'react';
import { Link } from 'react-router-dom';
import { babyProducts } from '../productdata';


function BabyCollection() {
 return (
    <section className="baby-section">
      
     

      {/* 2. ANIMATED DECORATIONS */}
      <div className="baby-sky">
        <div className="sun-wrapper">
            <div className="sun-rays"></div>
            <div className="sun-core"></div>
        </div>
        <div className="cloud c1"></div>
        <div className="cloud c2"></div>
      </div>

      <div className="baby-header">
        <span className="baby-pill">
            <i className="fas fa-leaf"></i> 100% Plant Based
        </span>
        <h2>Gentle Touch for <span className="highlight-arch">Baby Skin</span></h2>
        <p>Nature's softest ingredients, curated for your little sunshine.</p>
      </div>

      <div className="baby-grid">
        {babyProducts.map((product, index) => (
          // Added 'swing' animation class
          <div className="baby-arch-card" key={product.id} style={{ animationDelay: `${index * 0.2}s` }}>
            
            <div className="arch-image-container">
              <span className="floating-tag">{product.tags}</span>
              <img src={product.img} alt={product.title} />
            </div>
            
            <div className="arch-content">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              
              
            </div>

            {/* String decoration to look like it's hanging */}
            <div className="hanging-string"></div>
          </div>
        ))}
      </div>

      <div className="baby-footer">
        <Link to="/shop?category=Baby" className="view-shop-btn">
            Explore Nursery
        </Link>
      </div>

      {/* 3. BOTTOM WAVE DIVIDER */}
      

    </section>
  );
}

export default BabyCollection;