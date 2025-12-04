import React, { useState, useMemo, useEffect, useRef } from 'react';
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
const allSoapProducts = soapProducts.map(p => ({ ...p, id: p.title, category: 'Soaps', primaryTag: getPrimaryTag(p.tags) }));
const allOtherProducts = otherProducts.map(p => ({ ...p, id: p.title, category: 'Other', primaryTag: getPrimaryTag(p.tags) }));
const allFaceWashProducts = faceWashProducts.map(p => ({ ...p, id: p.title, category: 'Facewash', primaryTag: getPrimaryTag(p.tags) }));
const allFaceMaskProducts = faceMaskProducts.map(p => ({ ...p, id: p.title, category: 'Face Masks', primaryTag: getPrimaryTag(p.tags) }));
const allShampooProducts = shampooProducts.map(p => ({ ...p, id: p.title, category: 'Shampoos', primaryTag: getPrimaryTag(p.tags) }));
const allBabyProducts = babyProducts.map(p => ({ ...p, id: p.title, category: 'Baby', primaryTag: getPrimaryTag(p.tags) }));

const allProducts = [
  ...allSoapProducts, ...allOtherProducts, ...allFaceWashProducts,
  ...allFaceMaskProducts, ...allShampooProducts, ...allBabyProducts
];

const bannerImages = [
  { src: './ban0.png', alt: 'Handmade Soaps' },
  { src: './ban3.png', alt: 'Hair Care' },
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

   const [selectedProduct, setSelectedProduct] = useState(null);
    const handleQuickView = (product) => setSelectedProduct(product);
    const closeQuickView = () => setSelectedProduct(null);

  const [sort, setSort] = useState('default');
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef(null); 

  const category = searchParams.get('category') || 'All';
  const concern = searchParams.get('concern') || 'All';

  // --- Dynamic Title Logic ---
  const { products, pageTitle, isAllProductsView } = useMemo(() => {
    if (path === '/soaps') return { products: allSoapProducts, pageTitle: 'Handmade Soaps', isAllProductsView: false };
    if (path === '/facewash') return { products: allFaceWashProducts, pageTitle: 'Natural Facewash', isAllProductsView: false };
    if (path === '/shampoos') return { products: allShampooProducts, pageTitle: 'Herbal Shampoos', isAllProductsView: false };
    if (path === '/baby') return { products: allBabyProducts, pageTitle: 'Baby Care', isAllProductsView: false };
    if (path === '/other') return { products: allOtherProducts, pageTitle: 'Wellness & More', isAllProductsView: false };
    
    let dynamicTitle = 'All Collection';
    if (category !== 'All') dynamicTitle = category; 
    
    return { products: allProducts, pageTitle: dynamicTitle, isAllProductsView: true };
  }, [path, category]); 

  // --- Filter Logic ---
  const allConcerns = useMemo(() => {
    let relevantProducts = products;
    if (isAllProductsView && category !== 'All') {
      relevantProducts = products.filter(p => p.category === category);
    }
    const allTags = relevantProducts.flatMap(p => Array.isArray(p.tags) ? p.tags : [p.tags]);
    return ['All', ...[...new Set(allTags)].filter(t => t !== 'General').sort()];
  }, [products, category, isAllProductsView]);

  const filteredProducts = useMemo(() => {
    let prods = [...products];
    if (isAllProductsView && category !== 'All') prods = prods.filter(p => p.category === category);
    if (concern !== 'All') prods = prods.filter(p => (Array.isArray(p.tags) ? p.tags : [p.tags]).includes(concern));
    
    if (sort === 'name-asc') prods.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'name-desc') prods.sort((a, b) => b.title.localeCompare(a.title));
    
    return prods;
  }, [products, category, concern, sort, isAllProductsView]); 

  const productsToShow = filteredProducts.slice(0, visibleProducts);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);



  // Handlers
  const handleCategoryChange = (val) => {
    setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        if (val === 'All') newParams.delete('category');
        else newParams.set('category', val);
        newParams.delete('concern'); 
        return newParams;
    });
  };

  const handleConcernChange = (val) => {
    setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        if (val === 'All') newParams.delete('concern');
        else newParams.set('concern', val);
        return newParams;
    });
    setIsDropdownOpen(false); 
  };

  const clearFilters = () => {
    setSort('default');
    setSearchParams({});
    setIsDropdownOpen(false);
  };

 // --- COMPONENT: Top Filter Bar ---
  const TopFilterBar = () => {
    const categories = ['All', 'Soaps', 'Facewash', 'Shampoos', 'Face Masks', 'Baby', 'Other'];
    const filterLabel = category === 'All' ? 'All' : category;

    return (
      <div className="sticky-filter-header">
        <div className="filter-bar-layout">
          
          <div className="categories-scroll-section">
             {isAllProductsView && categories.map(cat => (
              <button 
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rail-chip ${category === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
             <div style={{minWidth: '40px'}}></div>
          </div>

          <div className="fixed-filter-section" ref={dropdownRef}>
            <div className="filter-separator"></div>
            
            <button 
              className={`filter-pill-btn ${isDropdownOpen || concern !== 'All' ? 'active-filter' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title="Filter"
            >
              <span className="filter-label-text">{filterLabel}</span>
              <i className="fas fa-sliders-h"></i>
              {concern !== 'All' && <span className="filter-dot"></span>}
            </button>

            {isDropdownOpen && (
              <div className="elegant-dropdown-menu">
                {/* --- SORT SECTION REMOVED --- */}
                
                <div className="dropdown-section">
                  <h4>Filter by Needs</h4>
                  {/* Changed class to 'dropdown-tags-grid' for 3-column layout */}
                  <div className="dropdown-tags-grid">
                    {allConcerns.map(con => (
                      <button 
                        key={con} 
                        onClick={() => handleConcernChange(con)}
                        className={`dropdown-tag ${concern === con ? 'selected' : ''}`}
                      >
                        {con}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="dropdown-footer">
                  <button onClick={clearFilters} className="text-btn">Reset</button>
                  <button onClick={() => setIsDropdownOpen(false)} className="done-btn">Show Results</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="all-products-page-wrapper">
      <div className="shop-page-header">
        <ImageSlider images={bannerImages} />
      </div>

      <div className="shop-layout-container">
        
        {/* --- LEFT SIDEBAR REMOVED --- */}
        
        <div className="shop-product-grid-wrapper full-width">
          
          {/* --- NEW HEADER: Arrow + Dynamic Title --- */}
          <div className="dynamic-page-header">
             <Link to="/" className="header-back-arrow" title="Back to Home"><i className="fas fa-arrow-left"></i></Link>
             <div className="header-text-group">
                <h1 className="header-title">{pageTitle}</h1>
                <span className="header-count">{filteredProducts.length} Products</span>
             </div>
          </div>

          {/* --- NEW FILTER BAR --- */}
          <TopFilterBar />

          <div className="product-grid">
            {productsToShow.length > 0 ? (
              productsToShow.map(product => (
                <ProductCard key={product.id || product.title} product={product} 
                onQuickView={() => setSelectedProduct(product)}
                />
                
              ))
            ) : (
              <div className="empty-state-container">
                <h3>No Products Found</h3>
                <button className="clear-filters-btn" onClick={clearFilters}>Clear All Filters</button>
              </div>
            )}
          </div>

          {productsToShow.length < filteredProducts.length && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={() => setVisibleProducts(p => p + 12)}>Load More</button>
            </div>
          )}
        </div>

        <QuickViewModal product={selectedProduct} onClose={closeQuickView} />
      </div>
    </div>
  );
}

export default AllProductsPage;