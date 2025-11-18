import Hero from '../components/Hero';
import ProductCarousel from '../components/ProductCarousel';
import { soapProducts, faceWashProducts, otherProducts,shampooProducts } from '../productdata';



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
          title={<>Powder<br />Facewash</>}
          products={faceWashProducts} 
          category="Facewash"
      />

     
      {/* --- MODIFIED: Changed to Other Products --- */}
      <ProductCarousel 
          title={<>Other<br />Products</>}
          products={otherProducts} 
          category="Other"
      />
     
    </>
  );
}
export default HomePage;