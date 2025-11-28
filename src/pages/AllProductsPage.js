import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; 
import { soapProducts, otherProducts, faceWashProducts, faceMaskProducts, shampooProducts, babyProducts } from '../productdata';
import ImageSlider from '../components/ImageSlider'; 

// --- 1. REMOVED: import { FiSliders } from "react-icons/fi"; ---

// --- Helper Function to sanitize IDs ---
const sanitizeId = (text) => {
  if (!text) return 'unknown';
  return text.toString().toLowerCase().replace(/\s+/g, '-');
};

// --- Helper Function to get primary tag ---
const getPrimaryTag = (tags) => {
  if (!tags) return 'general';
  const tagArray = Array.isArray(tags) ? tags : [tags];
  return tagArray.find(tag => tag !== 'general') || 'general';
};

// --- Process all product lists ---
const allSoapProducts = soapProducts.map(p => ({ ...p, id: p.title, category: 'Soaps', primaryTag: getPrimaryTag(p.tags) }));
const allOtherProducts = otherProducts.map(p => ({ ...p, id: p.title, category: 'Other', primaryTag: getPrimaryTag(p.tags) }));
const allFaceWashProducts = faceWashProducts.map(p => ({ ...p, id: p.title, category: 'Facewash', primaryTag: getPrimaryTag(p.tags) }));
const allFaceMaskProducts = faceMaskProducts.map(p => ({ ...p, id: p.title, category: 'Face Masks', primaryTag: getPrimaryTag(p.tags) }));
const allShampooProducts = shampooProducts.map(p => ({ ...p, id: p.title, category: 'Shampoos', primaryTag: getPrimaryTag(p.tags) }));
const allBabyProducts = babyProducts.map(p => ({ ...p, id: p.title, category: 'Baby', primaryTag: getPrimaryTag(p.tags) }));

const allProducts = [
  ...allSoapProducts,
  ...allOtherProducts,
  ...allFaceWashProducts,
  ...allFaceMaskProducts,
  ...allShampooProducts,
  ...allBabyProducts
];

const bannerImages = [
  { src: './ban0.png', alt: 'Handmade Soaps', caption: 'Handmade Soaps' },
  { src: './ban3.png', alt: 'Woman with healthy hair', caption: 'Nourish Your Hair, Naturally' },
  { src: './ban5.jpg', alt: 'Natural lip balm products', caption: 'Hydrate & Protect Your Lips' }
];

// --- 2. NEW: Custom Filter Button Component (No Install Needed) ---
function FilterButton({ onClick }) {
    return (
      <button 
        className="mobile-filter-btn-custom" 
        onClick={onClick} 
        title="Open Filters"
        style={{
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: '#fff', border: '1px solid #ddd', 
            padding: '8px 16px', borderRadius: '20px', cursor: 'pointer'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
          <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
          <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line>
          <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
        <span style={{ fontSize: '14px', fontWeight: '600' }}>Filter</span>
      </button>
    );
  }

// --- 3. UPDATED: Quick View Modal with "Best For" List ---
function QuickViewModal({ product, onClose }) {
  if (!product) return null;
  
  // Ensure we have an array of tags to map over
  const tagsToDisplay = Array.isArray(product.tags) ? product.tags : [product.primaryTag];

  return (
    <div className="quick-view-modal-overlay" onClick={onClose}>
      <div className="quick-view-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
        <div className="modal-image"><img src={product.img} alt={product.title} /></div>
        <div className="modal-details">
          <h2>{product.title}</h2>
          <p>{product.subtitle}</p>
          <p>{product.description}</p>
          
          <div className="modal-tags-container" style={{ marginTop: '15px' }}>
            <h4>Best For:</h4>
            <ul style={{ paddingLeft: '20px', listStyleType: 'disc', marginTop: '5px' }}>
              {tagsToDisplay.map((tag, index) => (
                <li key={index} style={{ marginBottom: '5px', textTransform: 'capitalize' }}>
                  {tag.toString().replace(/-/g, ' ')}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

function AllProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation(); 
  const path = location.pathname; 

  const category = searchParams.get('category') || 'All';
  const concern = searchParams.get('concern') || 'All';

  const { products, pageTitle,  isAllProductsView } = useMemo(() => {
    if (path === '/soaps') return { products: allSoapProducts, pageTitle: 'Shop Soaps', isAllProductsView: false };
    if (path === '/facewash') return { products: allFaceWashProducts, pageTitle: 'Shop Facewash', isAllProductsView: false };
    if (path === '/shampoos') return { products: allShampooProducts, pageTitle: 'Shop Shampoos', isAllProductsView: false };
    if (path === '/baby') return { products: allBabyProducts, pageTitle: 'Shop Baby Care', isAllProductsView: false };
    if (path === '/other') return { products: allOtherProducts, pageTitle: 'Shop Other Products', isAllProductsView: false };
    return { products: allProducts, pageTitle: 'Shop All Products', isAllProductsView: true };
  }, [path]); 

  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); 
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null); 

  // --- DYNAMIC CONCERN TITLE ---
  const getConcernTitle = () => {
    if (category === 'Shampoos' || path === '/shampoos') return 'Hair Concern';
    if (category === 'Baby' || path === '/baby') return 'Benefit';
    if (category === 'Other' || path === '/other') return 'Type';
    return 'Skin Concern';
  };

  // --- DYNAMIC TAG GENERATION ---
  const allConcerns = useMemo(() => {
    let relevantProducts = products;
    if (isAllProductsView && category !== 'All') {
      relevantProducts = products.filter(p => p.category === category);
    }
    const allTags = relevantProducts.flatMap(p => Array.isArray(p.tags) ? p.tags : [p.tags]);
    const uniqueTags = [...new Set(allTags)]; 
    return ['All', ...uniqueTags.sort()];
  }, [products, category, isAllProductsView]);

  
  // --- Filter Logic ---
  const filteredProducts = useMemo(() => {
    let prods = [...products];

    if (isAllProductsView && category !== 'All') {
      prods = prods.filter(p => p.category === category);
    }

    if (concern !== 'All') {
      prods = prods.filter(p => {
          const pTags = Array.isArray(p.tags) ? p.tags : [p.tags];
          return pTags.includes(concern);
      });
    }
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      prods = prods.filter(p => 
        p.title.toLowerCase().includes(lowerSearch) ||
        (p.description && p.description.toLowerCase().includes(lowerSearch))
      );
    }

    if (sort === 'name-asc') prods.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'name-desc') prods.sort((a, b) => b.title.localeCompare(a.title));
    
    return prods;
  }, [products, searchTerm, category, concern, sort, isAllProductsView]); 

  useEffect(() => {
    setVisibleProducts(12);
  }, [filteredProducts]);

  const productsToShow = filteredProducts.slice(0, visibleProducts);

  // --- Handlers ---
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        if (newCategory === 'All') newParams.delete('category');
        else newParams.set('category', newCategory);
        newParams.delete('concern'); 
        return newParams;
    });
  };

  const handleConcernChange = (e) => {
    const newConcern = e.target.value;
    setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        if (newConcern === 'All') newParams.delete('concern');
        else newParams.set('concern', newConcern);
        return newParams;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSort('default');
    setSearchParams({}); 
  };

  const loadMore = () => setVisibleProducts(prev => prev + 12); 
  const openQuickView = (product) => setSelectedProduct(product);
  const closeQuickView = () => setSelectedProduct(null);
  
  // --- RENDER FILTERS FUNCTION ---
  const renderFilters = (viewType) => (
    <>
      {isAllProductsView && (
        <div className="filter-group">
          <h4>Category</h4>
          {['All', 'Soaps', 'Facewash', 'Shampoos', 'Face Masks', 'Baby', 'Other'].map(cat => {
            const uniqueId = `cat-${sanitizeId(cat)}-${viewType}`;
            return (
              <div key={cat} className="radio-group">
                <input 
                  type="radio" 
                  id={uniqueId} 
                  name={`category-${viewType}`} 
                  value={cat}
                  checked={category === cat}
                  onChange={handleCategoryChange} 
                />
                <label htmlFor={uniqueId}>{cat}</label>
              </div>
            );
          })}
        </div>
      )}

      <div className="filter-group">
        <h4>{getConcernTitle()}</h4>
        {allConcerns.length > 1 ? (
           allConcerns.map(con => {
            const uniqueId = `concern-${sanitizeId(con)}-${viewType}`;
            return (
              <div key={con} className="radio-group">
                <input 
                  type="radio" 
                  id={uniqueId} 
                  name={`concern-${viewType}`} 
                  value={con}
                  checked={concern === con}
                  onChange={handleConcernChange} 
                />
                <label htmlFor={uniqueId}>
                    {con === 'All' ? 'All' : con.charAt(0).toUpperCase() + con.slice(1).replace(/-/g, ' ')}
                </label>
              </div>
            );
          })
        ) : (
          <p style={{fontSize: '0.9rem', color: '#888'}}>No filters available.</p>
        )}
      </div>
      
      <button className="clear-filters-btn" onClick={clearFilters}>
        Clear All Filters
      </button>
    </>
  );

  
  const sidebarControlsJSX = (
    <>
      <div className="product-count">
        Showing {productsToShow.length} of {filteredProducts.length} products
      </div>
      <div className="search-bar">
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>
      <div className="sidebar-controls">
        <div className="control-group">
          <label htmlFor="sort-by">Sort by</label>
          <select id="sort-by" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Default</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
        <div className="view-controls">
          <button 
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')} title="Grid View"
          >
            <i className="fas fa-th-large"></i>
          </button>
          <button 
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')} title="List View"
          >
            <i className="fas fa-list"></i>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="all-products-page-wrapper">
      <div className="shop-page-header">
        <ImageSlider images={bannerImages} />
      </div>

      <div className="shop-layout-container">
        
        {/* --- LEFT SIDEBAR (Desktop) --- */}
        <aside className="shop-sidebar">
          <Link to="/" className="back-to-home-btn" title="Back to Home">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <h2 className="shop-all-products-title-desktop">{pageTitle}</h2>
          {sidebarControlsJSX}
          <div className="sidebar-header"><h3>Filters</h3></div>
          <div className="filters-sidebar">
            {renderFilters('desktop')}
          </div>
        </aside>

        {/* --- MOBILE Filter Popup --- */}
        <aside className={`filters-sidebar-mobile ${isFiltersOpen ? 'open' : ''}`}>
          <div className="mobile-filter-overlay-CLICK-TARGET" onClick={() => setIsFiltersOpen(false)}></div>
          <div className="sidebar-content-wrapper">
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button className="mobile-close-filter" onClick={() => setIsFiltersOpen(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="mobile-sidebar-controls">
              {sidebarControlsJSX}
            </div>
            {renderFilters('mobile')}
          </div>
        </aside>

        <div className="shop-product-grid-wrapper">
          <div className="all-products-header-mobile">
            <Link to="/" className="back-to-home-btn" title="Back to Home">
                <i className="fas fa-arrow-left"></i>
            </Link>
            <h2 className="shop-all-products-title-mobile">{pageTitle}</h2>
            
            {/* --- 4. REPLACED: New Filter Button Component --- */}
            <FilterButton onClick={() => setIsFiltersOpen(true)} />

          </div>

          <div className={`product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {productsToShow.length > 0 ? (
              productsToShow.map((product, index) => (
                <ProductCard 
                  key={product.id || product.title} 
                  product={product}
                  subtitle={product.subtitle}
                  viewMode={viewMode}
                  onQuickView={() => openQuickView(product)}
                />
              ))
            ) : (
              <div className="empty-state-container">
                <i className="fas fa-boxes"></i>
                <h3>No Products Found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {productsToShow.length < filteredProducts.length && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={loadMore}>
                Load More Products
              </button>
            </div>
          )}
        </div>
      </div>

      <QuickViewModal product={selectedProduct} onClose={closeQuickView} />
    </div>
  );
}

export default AllProductsPage;