import React, { useState } from 'react';
import ImageSlider from '../components/ImageSlider'; 

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: '', email: '', message: '' });
  };

  const bannerImages = [
  { src: './ban0.png', alt: 'Handmade Soaps', caption: 'Handmade Soaps' },
  { src: './ban3.png', alt: 'Woman with healthy hair', caption: 'Nourish Your Hair, Naturally' },
  { src: './ban5.jpg', alt: 'Natural lip balm products', caption: 'Hydrate & Protect Your Lips' }
];

  return (
    <div className="contact-page-split">
       <div className="shop-page-header">
        <ImageSlider images={bannerImages} />
      </div>
      <div className="contact-split-container">

         
        
        {/* --- Left Side: Info --- */}
        <div className="contact-info-panel">
          <h1 className="contact-info-title">Get in Touch</h1>
          <p className="contact-info-subtitle">
            Have a question, a suggestion, or just want to share your experience? We're a small team and we love to hear from our community.
          </p>
          
          <div className="contact-info-group">
            <div className="contact-info-item">
              <i className="fas fa-envelope"></i>
              <span>hello@naturebubble.com</span>
            </div>
            <div className="contact-info-item">
              <i className="fas fa-phone-alt"></i>
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-info-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Nature Lane, Bangalore, India</span>
            </div>
          </div>
          
          <h4 className="contact-info-subtitle-small">Follow Our Journey</h4>
          <div className="contact-social-icons">
            <a href="www.ggole.com" title="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="www.com" title="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="www.com" title="Twitter"><i className="fab fa-twitter"></i></a>
          </div>
        </div>

        {/* --- Right Side: Form --- */}
        <div className="contact-form-panel">
          <form className="contact-form" onSubmit={handleSubmit}>
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
                placeholder="How can we help?"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default ContactPage;