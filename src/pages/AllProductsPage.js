import React, { useState, useMemo} from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; 
import { soapProducts, otherProducts, faceWashProducts, faceMaskProducts, shampooProducts, babyProducts } from '../productdata';
import ImageSlider from '../components/ImageSlider'; 

// --- Helper Functions ---
const getPrimaryTag = (tags) => {
  if (!tags) return 'General';
  const tagArray = Array.isArray(tags) ? tags : [tags];
  return tagArray.find(tag => tag !== 'general') || 'general';
};

// --- Process Data ---
const processData = (products, categoryName) => {
  if (!products) return [];
  return products.map((p, i) => ({
    ...p,
    id: typeof p.title === 'string' 
        ? p.title.toLowerCase().replace(/\s+/g, '-') 
        : `${categoryName.toLowerCase().replace(/\s/g, '')}-${i}`,
    category: categoryName,
    primaryTag: getPrimaryTag(p.tags)
  }));
};

const allSoapProducts = processData(soapProducts, 'Soap');
const allOtherProducts = processData(otherProducts, 'Others');
const allFaceWashProducts = processData(faceWashProducts, 'Facewash');
const allFaceMaskProducts = processData(faceMaskProducts, 'Facepack');
const allShampooProducts = processData(shampooProducts, 'Shampoo');
const allBabyProducts = processData(babyProducts, 'Baby');

const allProducts = [
  ...allSoapProducts, ...allOtherProducts, ...allFaceWashProducts,
  ...allFaceMaskProducts, ...allShampooProducts, ...allBabyProducts
];

const bannerImages = [
  { src: './banner/soapbanner.png', alt: 'Banner - 1' },
  { src: './banner/shampoobanner.png', alt: 'Banner - 2'},
  { src: './banner/packbanner.png', alt: 'Banner - 3'},
  { src: './banner/washbanner.png', alt: 'Banner - 4' }
];

function QuickViewModal({ product, onClose }) {
  if (!product) return null;
  const tags = product.tags ? (Array.isArray(product.tags) ? product.tags : [product.tags]) : [];

  return (
    <div className="quick-view-modal-overlay" onClick={onClose}>
      <div className="quick-view-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
        <div className="modal-image"><img src={product.img} alt={product.title} /></div>
        <div className="modal-details">
          <h2>{product.title}</h2>
          
          <p>{product.description}</p>

          {product.howToUse && (
            <div className="modal-how-to">
                <h4>How to Use:</h4>
                <p>{product.howToUse}</p>
            </div>
          )}
          
          {tags.length > 0 && (
            <div className="modal-tags-container">
                <h4>Key Benefits:</h4>
                <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                {tags.map((tag, index) => (
                    <li key={index} style={{ marginBottom: '5px' }}>{tag}</li>
                ))}
                </ul>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

function AllProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation(); 
  const path = location.pathname; 

  const [visibleProducts, setVisibleProducts] = useState(12);

  const category = searchParams.get('category') || 'All';
  
  // --- Dynamic Title Logic ---
  const { products, pageTitle, isAllProductsView } = useMemo(() => {
    if (path === '/soap') return { products: allSoapProducts, pageTitle: 'Handmade Soap', isAllProductsView: false };
    if (path === '/facewash') return { products: allFaceWashProducts, pageTitle: 'Powder Facewash', isAllProductsView: false };
    if (path === '/shampoo') return { products: allShampooProducts, pageTitle: 'Natural Shampoo', isAllProductsView: false };
    if (path === '/baby') return { products: allBabyProducts, pageTitle: 'Baby Product', isAllProductsView: false };
    if (path === '/others') return { products: allOtherProducts, pageTitle: 'Other Products', isAllProductsView: false };
    if (path === '/facemask') return { products: allFaceMaskProducts, pageTitle: 'Natural Facepack', isAllProductsView: false };
    
    let dynamicTitle = 'All Collection';
    if (category !== 'All') dynamicTitle = category; 
    
    return { products: allProducts, pageTitle: dynamicTitle, isAllProductsView: true };
  }, [path, category]); 

  // --- Filtering Logic (Simplified) ---
  const filteredProducts = useMemo(() => {
    let prods = [...products];
    // Filter by Category only (since filter button is gone)
    if (isAllProductsView && category !== 'All') {
      prods = prods.filter(p => p.category === category);
    }
    return prods;
  }, [products, category, isAllProductsView]); 

  const productsToShow = filteredProducts.slice(0, visibleProducts);

  const handleCategoryChange = (val) => {
    setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        if (val === 'All') newParams.delete('category');
        else newParams.set('category', val);
        return newParams;
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  // --- TOP BAR (Categories Only) ---
  const TopCategoryBar = () => {
    const categories = ['All', 'Soap', 'Facewash', 'Shampoo', 'Facepack', 'Baby', 'Others'];
    
    // If not on "All Products" view (e.g. inside /soaps), we don't need categories
    if (!isAllProductsView) return null;

    return (
      <div className="sticky-filter-header">
        <div className="filter-bar-layout">
          <div className="categories-scroll-section full-width-scroll">
             {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rail-chip ${category === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  

   const [selectedProduct, setSelectedProduct] = useState(null);
    const handleQuickView = (product) => setSelectedProduct(product);
    const closeQuickView = () => setSelectedProduct(null);

   // --- INFINITE SCROLL LOGIC ---
  const loaderRef = React.useRef(null); // The sensor

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        // Automatically add 12 more products when scrolled to bottom
        setVisibleProducts((prev) => prev + 12);
      }
    }, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    });

    const currentLoader = loaderRef.current; // Copy ref to variable for cleanup safety

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, []);


  

  return (
    <div className="all-products-page-wrapper">
      <div className="shop-page-header">
        <ImageSlider images={bannerImages} />
      </div>

      <div className="shop-layout-container">
        <div className="shop-product-grid-wrapper full-width">
          
          <div className="dynamic-page-header">
             <Link to="/" className="header-back-arrow" title="Back to Home"><i className="fas fa-arrow-left"></i></Link>
             <div className="header-text-group">
                <h1 className="header-title">{pageTitle}</h1>
                <span className="header-count">{filteredProducts.length} Products</span>
             </div>
          </div>

          <TopCategoryBar />

          <div className="product-grid">
            {productsToShow.length > 0 ? (
              productsToShow.map(product => (
                <ProductCard key={product.id || product.title} product={product}  onQuickView={handleQuickView}/>
              ))
            ) : (
              <div className="empty-state-container">
                <h3>No Products Found</h3>
                <button className="clear-filters-btn" onClick={clearFilters}>View All</button>
              </div>
            )}
          </div>

          {/* --- INFINITE SCROLL SENSOR --- */}
{productsToShow.length < filteredProducts.length && (
    <div 
      ref={loaderRef} 
      className="load-more-container" 
      style={{ height: '60px', margin: '20px 0', textAlign: 'center', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
    >
      <i className="fas fa-spinner fa-spin"></i> Loading more...
    </div>
)}
        </div>
        <QuickViewModal product={selectedProduct} onClose={closeQuickView} />
      </div>
    </div>
  );
}

export default AllProductsPage;