import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
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
  const [direction, setDirection] = useState(0);

  const navigate = useCallback((newDir: number) => {
    setDirection(newDir);
    setActiveIndex((prev) =>
      newDir > 0
        ? (prev + 1) % cards.length
        : (prev - 1 + cards.length) % cards.length
    );
  }, []);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => navigate(1), 6000);
    return () => clearInterval(timer);
  }, [navigate]);

  // Card positions: the active card is center, others fan out behind
  const getCardStyle = (index: number) => {
    const total = cards.length;
    let offset = index - activeIndex;
    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.floor(total / 2)) offset += total;

    const absOffset = Math.abs(offset);

    return {
      x: offset * 60,
      y: absOffset * 8,
      scale: 1 - absOffset * 0.08,
      rotateY: offset * -5,
      zIndex: total - absOffset,
      opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.2,
    };
  };

  return (
    <section id="gallery" className="py-24 md:py-32 bg-koi-deep relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

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
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Discover the beauty of premium koi pond solutions
          </p>
        </motion.div>

        {/* Stacked Cards Gallery */}
        <div className="relative flex items-center justify-center" style={{ height: "520px", perspective: "1200px" }}>
          <AnimatePresence mode="popLayout">
            {cards.map((card, index) => {
              const style = getCardStyle(index);
              return (
                <motion.div
                  key={card.title}
                  className="absolute cursor-pointer"
                  style={{ zIndex: style.zIndex }}
                  animate={{
                    x: style.x,
                    y: style.y,
                    scale: style.scale,
                    rotateY: style.rotateY,
                    opacity: style.opacity,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  onClick={() => {
                    const diff = index - activeIndex;
                    if (diff !== 0) {
                      setDirection(diff > 0 ? 1 : -1);
                      setActiveIndex(index);
                    }
                  }}
                  whileHover={index === activeIndex ? { scale: 1.03, y: -5 } : {}}
                >
                  <div className="w-[280px] sm:w-[320px] md:w-[360px] aspect-[3/4] rounded-2xl overflow-hidden relative group shadow-2xl shadow-black/40">
                    {/* Image */}
                    <img
                      src={card.src}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Tag */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-display font-semibold bg-primary/90 text-primary-foreground backdrop-blur-sm">
                        {card.tag}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <motion.div
                        initial={false}
                        animate={{ opacity: index === activeIndex ? 1 : 0, y: index === activeIndex ? 0 : 10 }}
                        transition={{ delay: 0.15 }}
                      >
                        <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1">
                          {card.title}
                        </h3>
                        <p className="text-muted-foreground text-sm flex items-center gap-1.5">
                          <MapPin size={14} className="text-primary" />
                          {card.subtitle}
                        </p>
                      </motion.div>
                    </div>

                    {/* Shine effect on active */}
                    {index === activeIndex && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-12">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-full border border-primary/40 bg-card/60 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > activeIndex ? 1 : -1);
                  setActiveIndex(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => navigate(1)}
            className="w-12 h-12 rounded-full border border-primary/40 bg-card/60 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Counter */}
        <div className="text-center mt-6">
          <span className="font-display text-3xl font-bold text-primary">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground mx-2">/</span>
          <span className="text-muted-foreground font-display">
            {String(cards.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
