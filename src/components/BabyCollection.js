import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { babyProducts } from '../productdata';

/* =========================== */
/* === 1. HELPER COMPONENTS === */
/* =========================== */

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" className="mobile-toy"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" /></svg>
);

const CloudIcon = () => (
  <svg viewBox="0 0 24 24" className="mobile-toy"><path d="M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878" /></svg>
);

const DuckIcon = () => (
    <svg viewBox="0 0 24 24" fill="#FFD700" className="peekaboo-icon">
        <path d="M11 17a3 3 0 0 1 -2.75 -4.24l.58 -.89a2 2 0 0 0 -.32 -2.57l-.3 -.29a2.5 2.5 0 0 1 3.54 -3.54l.29 .3a2 2 0 0 0 2.57 .32l.89 -.58a3 3 0 0 1 4.24 2.75v1a6 6 0 0 1 -6 6h-2z" />
        <path d="M16 4l1 -1" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
        <path d="M4 18h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="9" r="1" fill="#000"/>
    </svg>
);

const Star = ({ style }) => (
    <div className="twinkle-star" style={style}>✦</div>
);

/* =========================== */
/* === 2. MAIN COMPONENT    === */
/* =========================== */

function BabyCollection() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // --- Generate Stars Once ---
  const [stars] = useState(() => 
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      delay: Math.random() * 5 + 's',
      size: Math.random() * 10 + 8 + 'px'
    }))
  );

  // --- Mouse Parallax ---
  const handleMouseMove = (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 40; 
    const y = (window.innerHeight / 2 - e.clientY) / 40;
    setOffset({ x, y });
  };

  // --- SCROLL CHECK LOGIC (THE FIX) ---
  const checkForScroll = () => {
    const { current } = scrollRef;
    if (current) {
      const { scrollLeft, scrollWidth, clientWidth } = current;

      // 1. If all content fits (e.g. tablet with few items), hide BOTH arrows
      if (scrollWidth <= clientWidth + 2) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }

      // 2. Left Arrow: Only show if scrolled MORE than 4px
      // This fixes the issue where iPhone shows the arrow at the very start
      setCanScrollLeft(scrollLeft > 4);

      // 3. Right Arrow: Hide if near the end
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 4);
    }
  };

  useEffect(() => {
    checkForScroll();
    // Double check after render to catch layout shifts
    const timer = setTimeout(checkForScroll, 100); 
    window.addEventListener('resize', checkForScroll);
    
    return () => {
        window.removeEventListener('resize', checkForScroll);
        clearTimeout(timer);
    };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Scroll amount = 220px (Card) + 32px (Gap) = 252px
      const scrollAmount = direction === 'left' ? -252 : 252; 
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkForScroll, 500);
    }
  };

  const getTags = (tags) => {
    if (Array.isArray(tags)) return tags; 
    if (typeof tags === 'string') return tags.split(','); 
    return ['Pure']; 
  };

  return (
    <section className="baby-section" onMouseMove={handleMouseMove}>
      
      {/* === BACKGROUND PARTICLES === */}
      <div className="particles-layer">
        {stars.map(s => (
            <Star key={s.id} style={{ top: s.top, left: s.left, animationDelay: s.delay, fontSize: s.size }} />
        ))}
        {/* Bubbles */}
        <div className="soap-bubble" style={{ left: '10%', animationDuration: '8s', width: '60px', height: '60px' }}><div className="bubble-shine"></div></div>
        <div className="soap-bubble" style={{ left: '80%', animationDuration: '10s', width: '80px', height: '80px', animationDelay: '4s' }}><div className="bubble-shine"></div></div>
      </div>

      {/* === TOP WAVE === */}
      <div className="baby-wave-top">
          <svg preserveAspectRatio="none" viewBox="0 0 1200 120">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
      </div>

      {/* === HANGING MOBILE === */}
      <div className="mobile-string string-1" style={{ transform: `rotate(2deg) translateX(${offset.x}px)` }}> <MoonIcon /> </div>
      <div className="mobile-string string-2" style={{ transform: `rotate(-1deg) translateX(${offset.x * 1.5}px)` }}> <CloudIcon /> </div>
      <div className="mobile-string string-3" style={{ transform: `rotate(1deg) translateX(${offset.x * 0.8}px)` }}> <MoonIcon /> </div>
      <div className="mobile-string string-4" style={{ transform: `rotate(-2deg) translateX(${offset.x * 1.2}px)` }}> <CloudIcon /> </div>

      {/* === HEADER === */}
      <div className="baby-header" style={{ transform: `translateY(${offset.y * -0.5}px)` }}>
        <div className="baby-tag-wrapper">
             <span className="baby-tag">Soft & Dreamy</span>
        </div>
        <h2>The Nursery Collection</h2>
        <p>Gentle care, stitched with love & magic.</p>
      </div>

      {/* === SLIDER === */}
      <div className="baby-slider-wrapper">
        <button 
          className="baby-arrow left" 
          aria-label="Scroll Left"
          onClick={() => scroll('left')}
          style={{ opacity: canScrollLeft ? 1 : 0, pointerEvents: canScrollLeft ? 'all' : 'none' }}
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        <div 
          className="baby-grid" 
          ref={scrollRef}
          onScroll={checkForScroll} 
        >
          {babyProducts.map((product) => (
            <div className="baby-frame-card" key={product.id}>
              
              <DuckIcon />

              <div className="tag-container">
                {getTags(product.tags).map((tag, index) => (
                    <span key={index} className="baby-pill">{tag.trim()}</span>
                ))}
              </div>

              <div className="frame-image">
                   <img src={product.img} alt={product.title} />
              </div>
              
              <div className="frame-details">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="baby-arrow right" 
          aria-label="Scroll Right"
          onClick={() => scroll('right')}
          style={{ opacity: canScrollRight ? 1 : 0, pointerEvents: canScrollRight ? 'all' : 'none' }}
        >
          <i className="fas fa-chevron-right"></i>
        </button>

      </div>

      <div className="baby-footer">
        <Link to="/shop?category=Baby" className="view-collection-btn">
            View Full Collection
        </Link>
      </div>
    </section>
  );
}

export default BabyCollection;