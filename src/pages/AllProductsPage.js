import React, { useState, useMemo } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard'; 
import { soapProducts, otherProducts, faceWashProducts, faceMaskproducts } from '../productdata';
import ImageSlider from '../components/ImageSlider'; 

// --- Reusable Helper Functions ---


// --- Process all product lists with tags ---
const allSoapProducts = soapProducts.map(p => ({ 
  ...p, id: p.id || p.title, category: 'Soaps', 
}));
const allOtherProducts = otherProducts.map(p => ({ 
  ...p, id: p.id || p.title, category: 'Other'
}));
const allFaceWashProducts = faceWashProducts.map(p => ({ 
  ...p, id: p.id || p.title, category: 'Facewash'
}));
const allFaceMaskProducts = faceMaskproducts.map(p => ({ 
  ...p, id: p.id || p.title, category: 'Face Masks'
}));


const allProducts = [
  ...allSoapProducts,
  ...allOtherProducts,
  ...allFaceWashProducts,
  ...allFaceMaskProducts
];

// Data for the top banner slider
const bannerImages = [
  { src: './ban0.png', alt: 'Handmade Soaps', caption: 'Handmade Soaps' },
  { src: './ban3.png', alt: 'Woman with healthy hair', caption: 'Nourish Your Hair, Naturally' },
  { src: './ban5.jpg', alt: 'Natural lip balm products', caption: 'Hydrate & Protect Your Lips' }
];

// --- Quick View Modal Component ---
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

// --- Main AllProductsPage Component ---
function AllProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation(); 
  const path = location.pathname; 

  const { 
    products, 
    pageTitle, 
    concernTitle, 
    isAllProductsView 
  } = useMemo(() => {
    if (path === '/soaps') {
      return { products: allSoapProducts, pageTitle: 'Shop Soaps', concernTitle: 'Skin Concern', isAllProductsView: false };
    }
    if (path === '/facewash') {
      return { products: allFaceWashProducts, pageTitle: 'Shop Facewash', concernTitle: 'Skin Concern', isAllProductsView: false };
    }
    if (path === '/other') {
      return { products: allOtherProducts, pageTitle: 'Shop Other Products', concernTitle: 'Category', isAllProductsView: false };
    }
    return { products: allProducts, pageTitle: 'Shop All Products', concernTitle: 'Concern', isAllProductsView: true };
  }, [path]); 

  const allConcerns = useMemo(() => {
    const allTags = products.flatMap(p => p.tags || []); // Get all tags, even duplicates
    const uniqueTags = [...new Set(allTags)]; // Get only unique tags
    return ['All', ...uniqueTags.sort()];
  }, [products]);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [concern, setConcern] = useState('All'); 
  const [sort, setSort] = useState('default');
  const [viewMode, setViewMode] = useState('grid'); 
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null); 

  const filteredProducts = useMemo(() => {
    let prods = [...products];

    if (isAllProductsView && category !== 'All') {
      prods = prods.filter(p => p.category === category);
    }

    if (concern !== 'All') {
      prods = prods.filter(p => p.tags && p.tags.includes(concern));
    }
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      prods = prods.filter(p => 
        p.title.toLowerCase().includes(lowerSearch) ||
        p.description.toLowerCase().includes(lowerSearch)
      );
    }

    if (sort === 'name-asc') {
      prods.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'name-desc') {
      prods.sort((a, b) => b.title.localeCompare(a.title));
    }
    
    setVisibleProducts(12); 
    
    return prods;
  }, [products, searchTerm, category, concern, sort, isAllProductsView]); 

  const productsToShow = filteredProducts.slice(0, visibleProducts);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory); 
    
    if (newCategory === 'All') {
      setSearchParams(prev => { prev.delete('category'); return prev; });
    } else {
      setSearchParams(prev => { prev.set('category', newCategory); return prev; });
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setConcern('All'); 
    setSort('default');
    setSearchParams({}); 
  };

  const loadMore = () => {
    setVisibleProducts(prev => prev + 12); 
  };

  const openQuickView = (product) => {
    setSelectedProduct(product);
  };
  const closeQuickView = () => {
    setSelectedProduct(null);
  };
  
  const filtersJSX = (
    <>
      {isAllProductsView && (
        <div className="filter-group">
          <h4>Category</h4>
          {['All', 'Soaps', 'Facewash', 'Other'].map(cat => (
            <div key={cat} className="radio-group">
              <input 
                type="radio" 
                id={`cat-${cat}`} 
                name="category" 
                value={cat}
                checked={category === cat}
                onChange={handleCategoryChange} 
              />
              <label htmlFor={`cat-${cat}`}>{cat}</label>
            </div>
          ))}
        </div>
      )}

      <div className="filter-group">
        <h4>{concernTitle}</h4>
        {allConcerns.map(con => (
          <div key={con} className="radio-group">
            <input 
              type="radio" 
              id={`concern-${con}`} 
              name="concern" 
              value={con}
              checked={concern === con}
              onChange={(e) => setConcern(e.target.value)} 
            />
            <label htmlFor={`concern-${con}`}>{con.charAt(0).toUpperCase() + con.slice(1).replace('-', ' ')}</label>
          </div>
        ))}
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
    <>
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
            {filtersJSX}
          </div>
        </aside>

        {/* --- NEW MOBILE Filter Popup (with integrated overlay) --- */}
        <aside className={`filters-sidebar-mobile ${isFiltersOpen ? 'open' : ''}`}>
          
          {/* This is now the click target *behind* the menu */}
          <div className="mobile-filter-overlay-CLICK-TARGET" onClick={() => setIsFiltersOpen(false)}></div>
          
          {/* This is the white menu content that slides in */}
          <div className="sidebar-content-wrapper">
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button className="mobile-close-filter" onClick={() => setIsFiltersOpen(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="mobile-sidebar-controls">
              {sidebarControlsJSX}
            </div>
            {filtersJSX}
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
    </>
  );
}

export default AllProductsPage;