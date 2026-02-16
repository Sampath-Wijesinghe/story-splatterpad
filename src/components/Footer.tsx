import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border bg-background">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Koi Majesty" className="h-8 object-contain" />
        </Link>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Koi Majesty. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <a href="/#products" className="hover:text-primary transition-colors">Products</a>
          <a href="/#contact" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
