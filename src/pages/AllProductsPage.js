import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; 
import { soapProducts, otherProducts, faceWashProducts, faceMaskproducts, shampooProducts, babyProducts } from '../productdata';
import ImageSlider from '../components/ImageSlider'; 

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
const allFaceMaskProducts = faceMaskproducts.map(p => ({ ...p, id: p.title, category: 'Face Masks', primaryTag: getPrimaryTag(p.tags) }));
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

function QuickViewModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className="quick-view-modal-overlay" onClick={onClose}>
      <div className="quick-view-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><i className="fas fa-times"></i></button>
        <div className="modal-image"><img src={product.img} alt={product.title} /></div>
        <div className="modal-details">
          <h2>{product.title}</h2>
          <div className="modal-rating">{product.rating} <span>({product.reviews})</span></div>
          <p>{product.description}</p>
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
        p.description.toLowerCase().includes(lowerSearch)
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
  
  // --- RENDER FILTERS FUNCTION (Generates Unique IDs) ---
  const renderFilters = (viewType) => (
    <>
      {isAllProductsView && (
        <div className="filter-group">
          <h4>Category</h4>
          {['All', 'Soaps', 'Facewash', 'Shampoos', 'Face Masks', 'Baby', 'Other'].map(cat => {
            // --- UNIQUE ID per viewType (desktop/mobile) ---
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
            // --- UNIQUE ID per viewType (desktop/mobile) ---
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
            {/* Pass 'desktop' to create unique IDs */}
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
            {/* Pass 'mobile' to create unique IDs */}
            {renderFilters('mobile')}
          </div>
        </aside>

        <div className="shop-product-grid-wrapper">
          <div className="all-products-header-mobile">
            <Link to="/" className="back-to-home-btn" title="Back to Home">
                <i className="fas fa-arrow-left"></i>
            </Link>
            <h2 className="shop-all-products-title-mobile">{pageTitle}</h2>
            <button className="mobile-filter-btn" onClick={() => setIsFiltersOpen(true)}>
              <i className="fas fa-filter"></i>
            </button>
          </div>

          <div className={`product-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {productsToShow.length > 0 ? (
              productsToShow.map((product, index) => (
                <ProductCard 
                  key={product.id || product.title} 
                  product={product}
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