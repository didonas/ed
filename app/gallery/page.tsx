"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Eye, X, ZoomIn } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function GalleryPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; category: string; description: string } | null>(null);

  useEffect(() => {
    const handleFilterChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSelectedFilter(customEvent.detail);
      const filterSection = document.getElementById("gallery-filters-bar");
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("eddie-gallery-filter", handleFilterChange);
    return () => window.removeEventListener("eddie-gallery-filter", handleFilterChange);
  }, []);

  const filters = [
    { name: "All Media", id: "all" },
    { name: "Academic Labs", id: "lab" },
    { name: "Smart Classrooms", id: "classroom" },
    { name: "Student Activities", id: "activity" },
  ];

  const galleryItems = [
    {
      src: "/images/facility_science.png",
      title: "Interactive Chemistry Board Practicals",
      category: "lab",
      description: "Students performing physical titration experiments under teacher guidance.",
    },
    {
      src: "/images/facility_smart.png",
      title: "Geometry Lecture in Smart Classroom",
      category: "classroom",
      description: "Smart whiteboards displaying 3D structures for mathematical visualization.",
    },
    {
      src: "/images/course_science.png",
      title: "Physics Mechanics Workshop",
      category: "activity",
      description: "A special seminar solving competitive physics mechanics sheets.",
    },
    {
      src: "/images/course_commerce.png",
      title: "Chartered Accountancy Seminar",
      category: "activity",
      description: "Guest lecture introducing students to financial markets and audits.",
    },
    {
      src: "/images/course_humanities.png",
      title: "Historical Case Studies Analysis",
      category: "activity",
      description: "Collaborative study sessions focusing on world polity and governance.",
    },
    {
      src: "/images/hero_bg.png",
      title: "State-of-the-Art Lecture Hall",
      category: "classroom",
      description: "Spacious seating designed for high focus and premium study comfort.",
    },
  ];

  const filteredItems =
    selectedFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedFilter);

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-brand-navy text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('/images/hero_bg.png')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 to-brand-navy" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
          <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-brand-gold">
            Visual Tour
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Campus Gallery
          </h1>
          <div className="h-1 w-16 bg-brand-gold mx-auto rounded-full" />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24 bg-brand-cream/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters Bar */}
          <div id="gallery-filters-bar" className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                  selectedFilter === f.id
                    ? "bg-brand-navy text-white shadow-md border-b-2 border-brand-gold"
                    : "bg-white text-brand-navy hover:bg-brand-cream border border-brand-navy/10"
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <AnimatePresence mode="wait">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setLightboxImage(item)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-brand-navy/5 group cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-64 overflow-hidden bg-brand-navy w-full">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-w-768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Hover eye icon */}
                    <div className="absolute inset-0 bg-brand-navy/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <ZoomIn className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-brand-navy/90 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-5 text-left space-y-2">
                    <h3 className="font-heading text-base font-bold text-brand-navy group-hover:text-brand-gold transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-charcoal/80 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Interactive Lightbox Overlay */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-navy/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white hover:bg-brand-gold hover:text-brand-navy transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Image Column */}
              <div className="w-full md:w-2/3 h-64 md:h-[480px] relative bg-brand-navy">
                <Image
                  src={lightboxImage.src}
                  alt={lightboxImage.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Right Details Column */}
              <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-between text-left bg-brand-cream/30">
                <div className="space-y-4">
                  <span className="inline-block text-[10px] uppercase font-bold tracking-widest bg-brand-gold text-brand-navy px-3 py-1 rounded">
                    {lightboxImage.category}
                  </span>
                  <h2 className="font-heading text-lg md:text-xl font-extrabold text-brand-navy leading-tight">
                    {lightboxImage.title}
                  </h2>
                  <p className="text-sm font-light text-brand-charcoal leading-relaxed">
                    {lightboxImage.description || "Take a look at the state-of-the-art facilities and student activities hosted regularly at Edison's Knowledge Hub."}
                  </p>
                </div>

                <div className="pt-6 border-t border-brand-navy/10 space-y-4">
                  <p className="text-xs text-brand-muted">
                    Looking for a physical tour of our campus? Get in touch with our admissions office today.
                  </p>
                  <Button href="/contact" variant="gold" className="w-full text-xs py-2 uppercase font-semibold">
                    Schedule Visit
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
