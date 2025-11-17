import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';
import { soapProducts, faceWashProducts, otherProducts } from '../productdata';



function HomePage() {
  return (
    <>
      <Hero />

      <ProductCarousel 
          title="Soaps" 
          products={soapProducts} 
          category="Soaps"
      />
      {/* --- MODIFIED: Changed to Facewash --- */}
      <ProductCarousel 
          title="Powder Facewash"
          products={faceWashProducts} 
          category="Facewash"
      />
      {/* --- MODIFIED: Changed to Other Products --- */}
      <ProductCarousel 
          title="Other Products"
          products={otherProducts} 
          category="Other"
      />
     
    </>
  );
}
export default HomePage;