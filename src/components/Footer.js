function Footer() {
    return (
    <footer className="wavy-footer">
      
      {/* --- The SVG Wave --- */}
      <div className="footer-wave-container">
        <svg 
          viewBox="0 0 1440 320" 
          className="footer-wave-svg" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path 
            fill="#4f554c" 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* --- Footer Content --- */}
      <div className="footer-content">
        
        {/* 1. Social Icons */}
        <div className="footer-socials">
          <a href="#fb"><i className="fab fa-facebook-f"></i></a>
          <a href="#tw"><i className="fab fa-twitter"></i></a>
          <a href="#li"><i className="fab fa-linkedin-in"></i></a>
          <a href="#ig"><i className="fab fa-instagram"></i></a>
        </div>

        {/* 2. Copyright */}
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Nature Bubble | Designed and Developed by TECH INFORMATIC SOLUTIONS</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;