import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import heroVideo from "@/assets/hero-koi-video.mp4";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-koi-deep"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-koi-deep via-background to-koi-teal/20" />

      <div className="relative z-10 container mx-auto px-6 md:px-12 py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left — Typography */}
        <div className="flex flex-col gap-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.35em] text-primary font-display"
          >
            Premium Koi Pond Products
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.95] tracking-tight"
          >
            <span className="text-foreground">The Art</span>
            <br />
            <span className="text-foreground">of&nbsp;</span>
            <span className="text-gradient-gold italic font-light">Serenity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-muted-foreground max-w-md text-base md:text-lg font-body leading-relaxed"
          >
            Making premium koi pond care affordable and effortless.
            Experience the beauty of natural balance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex gap-4 items-center flex-wrap mt-2"
          >
            <a
              href="#products"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tracking-wide hover:brightness-110 transition-all glow-gold"
            >
              Explore Products
              <ArrowRight size={16} />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-border text-foreground font-display font-semibold text-sm tracking-wide hover:bg-secondary transition-all"
            >
              Our Story
            </a>
          </motion.div>

          {/* Bottom links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-center gap-6 mt-8 text-xs text-muted-foreground font-display tracking-widest uppercase"
          >
            <span>Pumps</span>
            <span className="w-8 h-px bg-border" />
            <span>Filters</span>
            <span className="w-8 h-px bg-border" />
            <span>Aerators</span>
          </motion.div>
        </div>

        {/* Right — Video Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md lg:max-w-lg aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
            <video
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* Play badge */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-background/60 backdrop-blur-md rounded-full px-4 py-2 cursor-pointer hover:bg-background/80 transition-colors">
              <Play size={14} className="text-primary fill-primary" />
              <span className="text-xs font-display tracking-wider text-foreground uppercase">
                Watch Video
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
