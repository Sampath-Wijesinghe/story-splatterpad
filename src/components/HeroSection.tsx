import { motion } from "framer-motion";
import heroImg from "@/assets/hero-koi.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Koi fish swimming in clear pond"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-koi-deep/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-[0.3em] text-primary mb-4 font-display"
        >
          Koi Pond Products
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          <span className="text-gradient-gold">Koi Majesty</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-secondary-foreground/80 max-w-xl mx-auto mb-10 font-body"
        >
          Make it affordable — your premium koi pond. Turn your koi keeping dream into reality with simple &amp; easy solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <a
            href="#products"
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tracking-wide hover:brightness-110 transition-all glow-gold"
          >
            Explore Products
          </a>
          <a
            href="#about"
            className="px-8 py-3 rounded-lg border border-border text-foreground font-display font-semibold text-sm tracking-wide hover:bg-secondary transition-all"
          >
            Learn More
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/40 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-2.5 rounded-full bg-primary" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
