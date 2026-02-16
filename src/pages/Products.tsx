import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '@/lib/types';
import productPumps from '@/assets/product-pumps.jpg';
import productAerators from '@/assets/product-aerators.jpg';
import productFilters from '@/assets/product-filters.jpg';
import productAccessories from '@/assets/product-accessories.jpg';

const CATEGORY_IMAGES: Record<ProductCategory, string> = {
  pond_pumps: productPumps,
  pond_aerators: productAerators,
  pond_filters: productFilters,
  accessories: productAccessories,
};

const Products = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const cat = category as ProductCategory;
  const isValidCategory = cat && Object.keys(CATEGORY_LABELS).includes(cat);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isValidCategory) { setLoading(false); return; }
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category', cat)
        .order('created_at', { ascending: false });
      setProducts((data as Product[]) || []);
      setLoading(false);
    };
    fetchProducts();
  }, [cat, isValidCategory]);

  if (!isValidCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Category Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Go Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
      <section className="relative pt-16">
        <div className="h-64 md:h-80 relative overflow-hidden">
          <img src={CATEGORY_IMAGES[cat]} alt={CATEGORY_LABELS[cat]} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-koi-deep/70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-primary mb-2 font-display">Our Products</p>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold">{CATEGORY_LABELS[cat]}</h1>
              <p className="text-muted-foreground mt-3 max-w-lg mx-auto">{CATEGORY_DESCRIPTIONS[cat]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 container mx-auto px-4">
        <Link to="/#products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to All Categories
        </Link>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products available yet in this category.</p>
            <p className="text-sm text-muted-foreground mt-2">Check back soon!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
              >
                {product.image_url ? (
                  <div className="aspect-square overflow-hidden bg-secondary">
                    <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="aspect-square bg-secondary flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">{product.description}</p>
                  {product.price && (
                    <p className="font-display font-bold text-primary text-lg">
                      Rs. {Number(product.price).toLocaleString()}
                    </p>
                  )}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border space-y-1">
                      {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{key}</span>
                          <span className="text-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Products;
