import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductCategory, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from "@/lib/types";
import productPumps from "@/assets/product-pumps.jpg";
import productAerators from "@/assets/product-aerators.jpg";
import productFilters from "@/assets/product-filters.jpg";
import productAccessories from "@/assets/product-accessories.jpg";

const products: { title: string; description: string; image: string; category: ProductCategory }[] = [
  { title: CATEGORY_LABELS.pond_pumps, description: CATEGORY_DESCRIPTIONS.pond_pumps, image: productPumps, category: 'pond_pumps' },
  { title: CATEGORY_LABELS.pond_aerators, description: CATEGORY_DESCRIPTIONS.pond_aerators, image: productAerators, category: 'pond_aerators' },
  { title: CATEGORY_LABELS.pond_filters, description: CATEGORY_DESCRIPTIONS.pond_filters, image: productFilters, category: 'pond_filters' },
  { title: CATEGORY_LABELS.accessories, description: CATEGORY_DESCRIPTIONS.accessories, image: productAccessories, category: 'accessories' },
];

const ProductsSection = () => {
  return (
    <section id="products" className="py-24 bg-water-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3 font-display">Our Products</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
            Everything for Your <span className="text-gradient-gold">Koi Pond</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={`/products/${product.category}`}
                className="group block relative rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-square overflow-hidden bg-secondary">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{product.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                    View Details <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
