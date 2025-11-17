import React, { useState } from 'react';
// --- MODIFIED: Removed useContext ---
import { Link, NavLink } from 'react-router-dom';
// --- REMOVED: CartContext import ---

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // --- REMOVED: useContext and cartItems logic ---

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header>
          <Link to="/" className="logo-link">
              <div className="logo">Nature Bubble</div>
          </Link>
          
          <nav className={isMobileMenuOpen ? 'active' : ''}>
            <button className="nav-close-btn" onClick={toggleMobileMenu}>
              <i className="fas fa-times"></i>
            </button>

            <NavLink to="/" onClick={toggleMobileMenu}>Home</NavLink>
            
            <div className="nav-dropdown">
              <NavLink to="/shop" className="nav-dropdown-toggle" onClick={toggleMobileMenu}>
                All Products
              </NavLink>
            </div>

            <NavLink to="/contact" onClick={toggleMobileMenu}>Contact Us</NavLink>
            <NavLink to="/about" onClick={toggleMobileMenu}>About Us</NavLink>
          </nav>

          <div className="header-icons">
            {/* --- REMOVED: Cart Icon & Badge --- */}

            <button className="mobile-nav-toggle" onClick={toggleMobileMenu}>
              <i className="fas fa-bars"></i>
            </button>
          </div>
      </header>
      {isMobileMenuOpen && <div className="mobile-nav-overlay" onClick={toggleMobileMenu}></div>}
    </>
  );
}
export default Header;