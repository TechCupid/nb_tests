import React from 'react';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-grid">
          <div className="footer-col about-col"><div className="footer-logo">Nature Bubble</div><p>Pure, natural, and handcrafted...</p><div className="social-icons"><a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a><a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a><a href="#" aria-label="Pinterest"><i className="fab fa-pinterest-p"></i></a></div></div>
          <div className="footer-col"><h4>Shop</h4><ul><li><a href="#">Natural Soaps</a></li><li><a href="#">Herbal Shampoos</a></li><li><a href="#">Lip Balms</a></li><li><a href="#">Powder Dyes</a></li></ul></div>
          <div className="footer-col"><h4>Support</h4><ul><li><a href="#">About Us</a></li><li><a href="#">Contact</a></li><li><a href="#">FAQs</a></li><li><a href="#">Shipping & Returns</a></li></ul></div>
          <div className="footer-col newsletter-col"><h4>Join Our List</h4><p>Get 10% off your first order...</p><form className="newsletter-form"><label htmlFor="footer-email" className="sr-only">Email</label><input id="footer-email" type="email" placeholder="Your email..." /><button type="submit" className="submit-btn">Subscribe</button></form></div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="payment-icons"><i className="fab fa-cc-visa"></i><i className="fab fa-cc-mastercard"></i><i className="fab fa-cc-paypal"></i><i className="fab fa-cc-amex"></i></div>
        <p>© {new Date().getFullYear()} Nature Bubble. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
export default Footer;