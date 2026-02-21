import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import galleryKoi1 from "@/assets/gallery-koi-1.jpg";
import galleryKoi2 from "@/assets/gallery-koi-2.jpg";
import galleryKoi3 from "@/assets/gallery-koi-3.jpg";
import galleryKoi4 from "@/assets/gallery-koi-4.jpg";
import galleryKoi5 from "@/assets/gallery-koi-5.jpg";

const cards = [
  { src: galleryKoi1, title: "Golden Harmony", subtitle: "Premium Koi Collection", tag: "Featured" },
  { src: galleryKoi2, title: "Lotus Dream", subtitle: "Paired Beauty Series", tag: "Popular" },
  { src: galleryKoi3, title: "Autumn Drift", subtitle: "Seasonal Showcase", tag: "New" },
  { src: galleryKoi4, title: "Crimson Grace", subtitle: "Champion Bloodline", tag: "Exclusive" },
  { src: galleryKoi5, title: "Ocean School", subtitle: "Community Collection", tag: "Classic" },
];

const GallerySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useCallback((dir: number) => {
    setActiveIndex((prev) =>
      dir > 0
        ? (prev + 1) % cards.length
        : (prev - 1 + cards.length) % cards.length
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => navigate(1), 6000);
    return () => clearInterval(timer);
  }, [navigate]);

  // Compute offset from center for each card (-2, -1, 0, 1, 2)
  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    const half = Math.floor(cards.length / 2);
    if (offset > half) offset -= cards.length;
    if (offset < -half) offset += cards.length;
    return offset;
  };

  // Layout: 5 cards visible, center is big, sides fan out with 3D rotation
  const getCardStyle = (offset: number) => {
    const abs = Math.abs(offset);
    const isCenter = offset === 0;

    return {
      x: offset * 220,
      y: abs * 15,
      scale: isCenter ? 1 : 0.75 - abs * 0.05,
      rotateY: offset * 15,
      zIndex: 10 - abs,
      opacity: abs > 2 ? 0 : 1 - abs * 0.15,
    };
  };

  return (
    <section id="gallery" className="py-24 md:py-32 bg-koi-deep relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3 font-display">
            Showcase
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Our <span className="text-gradient-gold">Gallery</span>
          </h2>
        </motion.div>

        {/* 3D Card Carousel */}
        <div
          className="relative flex items-center justify-center mx-auto"
          style={{ height: "560px", perspective: "1500px" }}
        >
          {/* Left arrow */}
          <button
            onClick={() => navigate(-1)}
            className="absolute left-2 md:left-8 z-20 w-12 h-12 rounded-full border border-primary/30 bg-card/40 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Cards */}
          {cards.map((card, index) => {
            const offset = getOffset(index);
            const abs = Math.abs(offset);
            if (abs > 2) return null;
            const style = getCardStyle(offset);
            const isCenter = offset === 0;

            return (
              <motion.div
                key={card.title}
                className="absolute cursor-pointer"
                style={{
                  zIndex: style.zIndex,
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  x: style.x,
                  y: style.y,
                  scale: style.scale,
                  rotateY: style.rotateY,
                  opacity: style.opacity,
                }}
                transition={{ type: "spring", stiffness: 200, damping: 28 }}
                onClick={() => {
                  if (offset !== 0) {
                    setActiveIndex(index);
                  }
                }}
              >
                <div
                  className={`rounded-2xl overflow-hidden relative group shadow-2xl shadow-black/50 transition-shadow duration-500 ${
                    isCenter ? "w-[300px] sm:w-[360px] md:w-[420px]" : "w-[220px] sm:w-[260px] md:w-[300px]"
                  }`}
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={card.src}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Tag */}
                  {isCenter && (
                    <motion.div
                      className="absolute top-4 right-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="px-3 py-1 rounded-full text-xs font-display font-semibold bg-primary/90 text-primary-foreground backdrop-blur-sm">
                        #{card.tag}
                      </span>
                    </motion.div>
                  )}

                  {/* Title overlay on center card */}
                  {isCenter && (
                    <motion.div
                      className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                    >
                      <h3 className="font-display text-2xl md:text-4xl font-bold text-foreground uppercase tracking-wider leading-tight">
                        {card.title}
                      </h3>
                      <div className="w-10 h-0.5 bg-primary my-3 rounded-full" />
                      <p className="text-muted-foreground text-sm">
                        {card.subtitle}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Right arrow */}
          <button
            onClick={() => navigate(1)}
            className="absolute right-2 md:right-8 z-20 w-12 h-12 rounded-full border border-primary/30 bg-card/40 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Dots + counter */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <div className="flex gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
