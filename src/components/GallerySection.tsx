import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import galleryKoi1 from "@/assets/gallery-koi-1.jpg";
import galleryKoi2 from "@/assets/gallery-koi-2.jpg";
import galleryKoi3 from "@/assets/gallery-koi-3.jpg";
import galleryKoi4 from "@/assets/gallery-koi-4.jpg";
import galleryKoi5 from "@/assets/gallery-koi-5.jpg";

const images = [
  { src: galleryKoi1, alt: "Koi fish with red flowers" },
  { src: galleryKoi2, alt: "Two koi fish with lotus" },
  { src: galleryKoi3, alt: "Koi fish with autumn leaves" },
  { src: galleryKoi4, alt: "Elegant koi fish portrait" },
  { src: galleryKoi5, alt: "Koi school in pond" },
];

const GallerySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const scrollPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, []);

  const scrollNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(scrollNext, 5000);
    return () => clearInterval(timer);
  }, [scrollNext]);

  // Get visible indices (show 3 + peek)
  const getVisibleIndices = () => {
    const indices = [];
    for (let i = -1; i <= 2; i++) {
      indices.push((currentIndex + i + images.length) % images.length);
    }
    return indices;
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section id="gallery" className="py-24 bg-koi-deep relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3 font-display">
            Showcase
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Our <span className="text-gradient-gold">Gallery</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Discover the beauty of premium koi pond solutions
          </p>
        </motion.div>

        {/* Navigation Arrows */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center gap-3 mb-10"
        >
          <button
            onClick={scrollPrev}
            className="w-11 h-11 rounded-full border border-primary/40 bg-card/60 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            className="w-11 h-11 rounded-full border border-primary/40 bg-card/60 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </motion.div>

        {/* Gallery Grid */}
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex gap-4 md:gap-6"
            animate={{ x: `calc(-${currentIndex * 25}% - ${currentIndex * 6}px)` }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          >
            {images.concat(images).map((image, i) => {
              const isCenter =
                i % images.length === (currentIndex + 1) % images.length;
              return (
                <motion.div
                  key={i}
                  className="min-w-[70%] sm:min-w-[45%] md:min-w-[30%] lg:min-w-[25%] flex-shrink-0"
                  animate={{
                    scale: isCenter ? 1.02 : 0.95,
                    opacity: isCenter ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden relative group cursor-pointer">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-koi-deep/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-md h-1 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > currentIndex ? 1 : -1);
                setCurrentIndex(i);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
