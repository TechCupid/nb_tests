import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AllProductsPage from './pages/AllProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// --- MODIFIED: Import all your new product data ---
import { 
  soapProducts, 
  otherProducts, 
  faceWashProducts,
  faceMaskProducts,
  shampooProducts
} from './productdata';

const allProducts = [
  ...soapProducts.map((p, i) => ({ ...p, id: `soap-${i}`, category: 'Soaps' })),
  ...otherProducts.map((p, i) => ({ ...p, id: `other-${i}`, category: 'Other' })),
  ...faceWashProducts.map((p, i) => ({ ...p, id: `facewash-${i}`, category: 'Facewash' })),
  ...faceMaskProducts.map((p, i) => ({ ...p, id: `facemask-${i}`, category: 'Face Masks' })),
  ...shampooProducts.map((p, i) => ({ ...p, id: `shampoo-${i}`, category: 'Shampoos' }))
];

// --- Create Toast Context ---
export const ToastContext = createContext();

// --- Toast Provider Component ---
function ToastProvider({ children }) {
  const [toast, setToast] = useState({ message: '', isVisible: false });

  const showToast = (message) => {
    setToast({ message, isVisible: true });
    setTimeout(() => {
      setToast({ message: '', isVisible: false });
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast.message} isVisible={toast.isVisible} />
    </ToastContext.Provider>
  );
}

// --- Toast Component (The pop-up) ---
function Toast({ message, isVisible }) {
  if (!isVisible) return null;
  return (
    <div className="toast-notification">
      <i className="fas fa-check-circle"></i> {message}
    </div>
  );
}

// Scrolls to top on page change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// --- Main App Component ---
function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // Make sure <BrowserRouter> is in your index.js file!
    <ToastProvider> 
      <div className="browser-frame">
          <Header />
          <main>
            <ScrollToTop /> 
            <Routes> 
              <Route path="/" element={<HomePage />} />
              
              <Route path="/shop" element={<AllProductsPage products={allProducts} />} />
              <Route path="/soaps" element={<AllProductsPage products={allProducts} />} />
              <Route path="/shampoos" element={<AllProductsPage products={allProducts} />} />
              <Route path="/facewash" element={<AllProductsPage products={allProducts} />} />
              <Route path="/other" element={<AllProductsPage products={allProducts} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </main>
          <Footer /> 
      </div>

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-to-top-btn" title="Go to top">
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </ToastProvider>
  );
}

export default App;