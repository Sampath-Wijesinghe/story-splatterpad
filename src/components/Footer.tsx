const Footer = () => {
  return (
    <footer className="py-8 border-t border-border bg-background">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display text-sm font-bold tracking-wider text-gradient-gold">KOI MAJESTY</p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Koi Majesty. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <a href="#home" className="hover:text-primary transition-colors">Home</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#products" className="hover:text-primary transition-colors">Products</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
