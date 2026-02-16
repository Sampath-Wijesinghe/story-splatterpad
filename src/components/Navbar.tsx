import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Products", href: "/#products" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Koi Majesty" className="h-10 object-contain" />
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              {l.href.startsWith("/#") ? (
                <a
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(l.href); }}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  to={l.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-4 py-6">
              {links.map((l) => (
                <li key={l.href}>
                  {l.href.startsWith("/#") ? (
                    <a
                      href={l.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(l.href); }}
                      className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      to={l.href}
                      onClick={() => setOpen(false)}
                      className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
