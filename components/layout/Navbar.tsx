"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Button from "../ui/Button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Faculty", href: "/faculty" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`sticky top-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? "bg-brand-navy/95 backdrop-blur-md shadow-lg py-3 text-white"
          : "bg-brand-navy py-5 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo / Brand Name */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 rounded-full border border-brand-gold bg-brand-navy flex items-center justify-center overflow-hidden shrink-0 relative transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/eddy/avatar_head.png"
                alt="Edison Logo"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <span className="font-heading font-extrabold text-lg md:text-xl tracking-wider text-white flex items-center gap-1">
              EDISON'S <span className="text-brand-gold font-light">KNOWLEDGE HUB</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative font-heading text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-brand-gold py-1 ${
                    isActive ? "text-brand-gold font-semibold" : "text-white/90"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Call to Action */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-1.5 text-sm text-white/80 hover:text-brand-gold transition-colors font-medium"
            >
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>+91 98765 43210</span>
            </a>
            <Button href="/contact" variant="gold" className="!py-2 !px-4 text-xs uppercase font-semibold">
              Enquire Now <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className="p-2 text-white/90 hover:text-brand-gold transition-colors"
              aria-label="Call Us"
            >
              <Phone className="w-5 h-5 text-brand-gold" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-white hover:text-brand-gold focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-brand-navy border-t border-white/10 overflow-hidden shadow-inner"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-3 py-3 rounded-md text-base font-medium tracking-wide uppercase transition-colors ${
                      isActive
                        ? "text-brand-gold bg-white/5 font-semibold"
                        : "text-white/80 hover:text-brand-gold hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 px-3 flex flex-col gap-4">
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 text-white/80 hover:text-brand-gold transition-colors py-2 font-medium"
                >
                  <Phone className="w-4 h-4 text-brand-gold" />
                  <span>+91 98765 43210</span>
                </a>
                <Button
                  href="/contact"
                  variant="gold"
                  className="w-full text-center py-3 text-sm uppercase font-semibold flex items-center justify-center gap-2"
                >
                  Enquire Now <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
