import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Nurturing You With Nature's Touch</h1>
                <p>Parmer your skin with the purity of handirrated botanicals and earth-born goodness.</p>
                {/* This button now navigates to the /shop page */}
                <Link to="/shop" className="cta-button">
                    Shop Now <i className="fas fa-arrow-right"></i>
                </Link>
            </div>
            <div className="hero-image">
                <img src="./home1.jpg " alt="Handmade soap products" />
            </div>
        </section>
    );
}
export default Hero;