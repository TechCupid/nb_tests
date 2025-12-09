import React from 'react';
import { Link } from 'react-router-dom';

// --- Placeholder images ---
// Replace these with your own high-quality images
const heroImageUrl = "./ban6.png"; // A beautiful, wide shot of nature, herbs, or a rustic workshop
 // A picture of hands mixing ingredients, or a close-up of soap

function AboutPage() {
  return (
    <div className="about-page">
        
      {/* --- 1. Hero Section --- */}
      <section 
        className="about-hero" 
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      >
        <div className="about-hero-overlay">
          <h1>Crafted by Hand, Inspired by Nature.</h1>
        </div>
      </section>

      {/* --- 2. Our Story Section --- */}
      <section className="about-section about-story">
        <div className="about-content-text">
          <h2 className="section-title">Our Story</h2>
          <p>
            <b>Nature Bubbles</b> began with a simple idea: skincare should be kind. Tired of harsh chemicals and long, unpronounceable ingredient lists, we turned to nature for an answer. 
          </p>
          <p>
            What started in a small kitchen, inspired by traditional recipes and a passion for herbalism, has blossomed into a full line of products. We believe that what you put on your body is as important as what you put in it.
          </p>
          <p>
            Every product is handcrafted in small batches, ensuring the utmost care and quality. We're here to bring you a moment of pure, natural indulgence every day.
          </p>
        </div>
        <div className="about-content-image">
          <img src="./ban4.png" alt="Crafting natural soap" />
        </div>
      </section>

      {/* --- 3. Our Philosophy Section --- */}
      <section className="about-section our-philosophy">
        <h2 className="section-title">Our Philosophy</h2>
        <div className="philosophy-grid">
          <div className="philosophy-item">
            <i className="fas fa-leaf"></i>
            <h3>Pure Ingredients</h3>
            <p>We only use high-quality, natural ingredients. No synthetic fragrances, no harsh sulfates, no parabens. Ever.</p>
          </div>
          <div className="philosophy-item">
            <i className="fas fa-hand-sparkles"></i>
            <h3>Handcrafted with Care</h3>
            <p>Every bar, bottle, and balm is made by hand in our small workshop to ensure quality and freshness.</p>
          </div>
          <div className="philosophy-item">
            <i className="fas fa-paw"></i>
            <h3>Cruelty-Free</h3>
            <p>We love our furry friends. Our products are only tested on willing humans, never on animals.</p>
          </div>
          <div className="philosophy-item">
            <i className="fas fa-globe-americas"></i>
            <h3>Eco-Conscious</h3>
            <p>From sustainable sourcing to minimal, recyclable packaging, we strive to be as gentle on the planet as we are on your skin.</p>
          </div>
        </div>
      </section>

{/* --- NEW: Meet the Founder Section --- */}
      <section className="about-section about-founder">
        <div className="about-content-image">
          {/* Replace with a photo of the founder */}
          <img src="./ban1.png" alt="Founder of Nature Bubbles" />
        </div>
        <div className="about-content-text">
          <h2 className="section-title">A Word From Our Founder</h2>
          <blockquote className="founder-quote">
            "We're not just making soap. We're crafting a small moment of peace and purity in your day. My dream was to create products that I could trust for my own family, and it's a joy to share them with yours."
          </blockquote>
         
        </div>
      </section>

      
      {/* --- 4. Call to Action --- */}
      <section className="about-cta">
        <h2>Ready to feel the difference?</h2>
        <p>Discover your new natural ritual.</p>
        <Link to="/shop" className="cta-button">
          Shop All Products
          <i className="fas fa-arrow-right"></i>
        </Link>
      </section>

    </div>
  );
}

export default AboutPage;