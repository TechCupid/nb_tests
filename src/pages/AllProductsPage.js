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

const allSoapProducts = processData(soapProducts, 'Soaps');
const allOtherProducts = processData(otherProducts, 'Other');
const allFaceWashProducts = processData(faceWashProducts, 'Facewash');
const allFaceMaskProducts = processData(faceMaskProducts, 'Face Masks');
const allShampooProducts = processData(shampooProducts, 'Shampoos');
const allBabyProducts = processData(babyProducts, 'Baby');

const allProducts = [
  ...allSoapProducts, ...allOtherProducts, ...allFaceWashProducts,
  ...allFaceMaskProducts, ...allShampooProducts, ...allBabyProducts
];

const bannerImages = [
  { src: './ban0.png', alt: 'Handmade Soaps' },
  { src: './ban3.png', alt: 'Hair Care' },
  { src: './ban5.jpg', alt: 'Natural lip balm products'}
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

  const [visibleProducts, setVisibleProducts] = useState(12);

  const category = searchParams.get('category') || 'All';
  
  // --- Dynamic Title Logic ---
  const { products, pageTitle, isAllProductsView } = useMemo(() => {
    if (path === '/soaps') return { products: allSoapProducts, pageTitle: 'Handmade Soaps', isAllProductsView: false };
    if (path === '/facewash') return { products: allFaceWashProducts, pageTitle: 'Powder Facewash', isAllProductsView: false };
    if (path === '/shampoos') return { products: allShampooProducts, pageTitle: 'Natural Shampoos', isAllProductsView: false };
    if (path === '/baby') return { products: allBabyProducts, pageTitle: 'Baby Products', isAllProductsView: false };
    if (path === '/other') return { products: allOtherProducts, pageTitle: 'Other Products', isAllProductsView: false };
    if (path === '/facemasks') return { products: allFaceMaskProducts, pageTitle: 'Natural Face Packs', isAllProductsView: false };
    
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
    const categories = ['All', 'Soaps', 'Facewash', 'Shampoos', 'Face Masks', 'Baby', 'Other'];
    
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