import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-section-alt">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3 font-display">Get In Touch</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Contact <span className="text-gradient-gold">Us</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-muted-foreground leading-relaxed">
              Ready to start your koi keeping journey? We'd love to hear from you. Reach out for product inquiries, pond consultation, or any questions.
            </p>
            <div className="space-y-4">
              {[
                { icon: Phone, text: "+94 77 173 4462", href: "tel:+94771734462" },
                { icon: Mail, text: "team@koimajesty.com", href: "mailto:team@koimajesty.com" },
                { icon: MapPin, text: "Worldwide Shipping Available" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  {item.href ? (
                    <a href={item.href} className="text-foreground hover:text-primary transition-colors">
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-foreground">{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <textarea
              rows={4}
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full px-8 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tracking-wide hover:brightness-110 transition-all glow-gold"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
