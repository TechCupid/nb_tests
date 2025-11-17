import React, { useState } from 'react';
import ImageSlider from '../components/ImageSlider';

// --- NEW: Define the banner images (copied from your other pages) ---
// ⚠️ Remember to replace these placeholder URLs with your real images
const bannerImages = [
  { src: './ban0.png', alt: 'Handmade Soaps', caption: 'Handmade Soaps' },
  { src: './ban3.png', alt: 'Woman with healthy hair', caption: 'Nourish Your Hair, Naturally' },
  { src: './ban5.jpg', alt: 'Natural lip balm products', caption: 'Hydrate & Protect Your Lips' }
];

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, topic: selectedTopic });
    alert("Thank you for your message! We'll get back to you soon.");
    
    setFormData({ name: '', email: '', message: '' });
    setSelectedTopic(null); 
  };
  
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  return (
    // --- MODIFIED: Renamed main div for clarity ---
    <div className="contact-page-interactive">

      {/* --- NEW: Add the ImageSlider here --- */}
      <div className="shop-page-header">
        <ImageSlider images={bannerImages} />
      </div>
      
      {/* --- 1. The Header --- */}
      <div className="contact-header">
        <h1>How can we help?</h1>
        <p>Your journey to natural skin is important to us. Select a topic so we can help you faster.</p>
      </div>

      {/* --- 2. The Interactive Cards --- */}
      <div className="contact-topic-selector">
        <div 
          className={`topic-card ${selectedTopic === 'Product Question' ? 'active' : ''}`}
          onClick={() => handleTopicSelect('Product Question')}
        >
          <i className="fas fa-leaf"></i>
          <h3>Product Question</h3>
          <p>Ask about ingredients, benefits, or get a recommendation.</p>
        </div>
        
        <div 
          className={`topic-card ${selectedTopic === 'Collaborations' ? 'active' : ''}`}
          onClick={() => handleTopicSelect('Collaborations')}
        >
          <i className="fas fa-handshake"></i>
          <h3>Collaborations</h3>
          <p>We love working with creators and like-minded brands.</p>
        </div>

        <div 
          className={`topic-card ${selectedTopic === 'General Inquiry' ? 'active' : ''}`}
          onClick={() => handleTopicSelect('General Inquiry')}
        >
          <i className="fas fa-hand-sparkles"></i>
          <h3>Just to Say Hi</h3>
          <p>We're a small team and love hearing from our community.</p>
        </div>
      </div>

      {/* --- 3. The Animated Form --- */}
      <div className={`contact-form-wrapper ${selectedTopic ? 'open' : ''}`}>
        {selectedTopic && (
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Your Message About: <span>{selectedTopic}</span></h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more..."
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        )}
      </div>
      
    </div>
  );
}

export default ContactPage;