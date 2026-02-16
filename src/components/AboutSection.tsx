import { motion } from "framer-motion";
import aboutImg from "@/assets/about-pond.jpg";
import { Eye, Target, Leaf } from "lucide-react";

const cards = [
  {
    icon: Eye,
    title: "Our Vision",
    text: "Turn your koi keeping dream into reality. We're here to make your dream pond affordable to maintain in premium quality with simple & easy solutions.",
  },
  {
    icon: Target,
    title: "Our Mission",
    text: "We deliver simple, effective and affordable solutions that make premium pond care effortless, empowering every koi keeper with the tools needed for a thriving, beautiful pond.",
  },
  {
    icon: Leaf,
    title: "Nature First",
    text: "We develop symbiotic relationships among all parts in the system, making pond care more nature-friendly and sustainable for the long term.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 bg-section-alt">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3 font-display">About Us</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            The Art of <span className="text-gradient-gold">Koi Keeping</span>
          </h2>
        </motion.div>

        {/* Image + Cards */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl overflow-hidden glow-gold"
          >
            <img src={aboutImg} alt="Beautiful koi pond garden" className="w-full h-80 lg:h-[480px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </motion.div>

          <div className="space-y-6">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
