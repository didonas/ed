"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "Edison's Knowledge Hub completely transformed my approach to Physics and Math. The faculty's focus on basic concepts helped me secure a Rank of 482 in JEE Advanced. The doubt desk was a lifesaver during revision months.",
      author: "Aditya Vardhan",
      role: "Alumnus (Batch of 2025)",
      achievement: "JEE Advanced AIR 482 | 97.6% Boards",
      stars: 5,
    },
    {
      quote: "As a parent, enrolling my daughter in Edison's Knowledge Hub was the best decision. The monthly audits, detailed feedback, and regular parent-teacher meets kept us in the loop. Her CBSE Accountancy score (98/100) speaks volumes.",
      author: "Mrs. Meenakshi Sharma",
      role: "Parent of Priyanshi Sharma",
      achievement: "Priyanshi scored 96.4% in CBSE Class 12 Commerce",
      stars: 5,
    },
    {
      quote: "The teachers here treat doubts with absolute patience. Weekly mock tests and practice sheets mapped precisely to CUET syllabus gave me the edge I needed to get into SRCC, Delhi University.",
      author: "Rohan Kapoor",
      role: "Alumnus (Batch of 2025)",
      achievement: "CUET 99.8 Percentile | Commerce Stream",
      stars: 5,
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 bg-brand-navy text-white relative overflow-hidden">
      {/* Decorative vector arches */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="What Parents & Students Say"
          subtitle="Testimonials"
          description="True stories of dedication, mentorship, and outstanding academic results from our alumni and their families."
          light={true}
        />

        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[320px] sm:min-h-[260px] bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10 flex flex-col justify-between">
            <Quote className="absolute top-6 right-8 w-16 h-16 text-brand-gold/10 pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Rating stars */}
                <div className="flex gap-1">
                  {[...Array(testimonials[currentIndex].stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-base md:text-lg font-light leading-relaxed text-brand-cream/90 italic">
                  &ldquo;{testimonials[currentIndex].quote}&rdquo;
                </p>

                {/* Author Info */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h4 className="font-heading text-lg font-semibold text-white">
                      {testimonials[currentIndex].author}
                    </h4>
                    <p className="text-xs text-brand-cream/60">{testimonials[currentIndex].role}</p>
                  </div>
                  <div className="bg-brand-gold text-brand-navy text-xs font-bold px-3 py-1 rounded-md">
                    {testimonials[currentIndex].achievement}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controls */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-brand-navy transition-all duration-300 cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIndex ? "w-6 bg-brand-gold" : "w-2 bg-white/30"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-brand-navy transition-all duration-300 cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
