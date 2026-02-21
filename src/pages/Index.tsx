import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import ProductsSection from "@/components/ProductsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WaterBubbles from "@/components/WaterBubbles";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <WaterBubbles />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <GallerySection />
      <ProductsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
