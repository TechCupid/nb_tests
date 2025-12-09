import React, { useState } from 'react';
import ImageSlider from '../components/ImageSlider'; 

const bannerImages = [
  { src: './ban7.jpg', alt: 'Handmade Soaps' },
];

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

    // --- 1. YOUR WHATSAPP NUMBER ---
    // Replace this with your real number (Country Code + Number)
    const phoneNumber = "919492978284"; 

    // --- 2. MESSAGE WITH DIRECT EMOJIS ---
    // We use template literals (backticks `) to keep the formatting and emojis.
    const text = `
🌿 New Inquiry from Nature Bubbles 🌿

👤 Name: ${formData.name}
📧 Email: ${formData.email}

💬 Message:
${formData.message}


`.trim();

    // --- 3. USE THE API URL ---
    // "api.whatsapp.com" is the standard endpoint for sending messages.
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;

    // Open WhatsApp in a new tab
    window.open(url, '_blank');

    // Reset Form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page-wrapper">
      
      <div className="shop-page-header">
        <ImageSlider images={bannerImages} />
      </div>

      <div className="contact-page-split">
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
                <span>info@naturebubbles.in</span>
              </div>
              <div className="contact-info-item">
                <i className="fas fa-phone"></i>
                <span>+91 94929 78284</span>
              </div>
              <div className="contact-info-item">
                <i className="fas fa-location-dot"></i>
                <span>75, R.K.Avenue, Thinnur, Hosur.</span>
              </div>
            </div>
            
            <h4 className="contact-info-subtitle-small">Follow Our Journey</h4>
            <div className="contact-social-icons">
              <p title="Facebook"><i className="fab fa-facebook-f"></i></p>
              <p title="Instagram"><i className="fab fa-instagram"></i></p>
              <p title="Twitter"><i className="fab fa-twitter"></i></p>
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
              <button type="submit" className="submit-btn">
                <i className="fab fa-whatsapp" style={{marginRight: '8px'}}></i>
                Send via WhatsApp
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ContactPage;