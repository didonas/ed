"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FlaskConical, Laptop, BookOpen, Presentation } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

export default function Facilities() {
  const facilities = [
    {
      title: "Interactive Science Lab",
      icon: <FlaskConical className="w-5 h-5 text-brand-gold" />,
      image: "/images/facility_science.png",
      description: "Equipped with high-precision experimental tools, models, and safety gear to bring physics, chemistry, and biology lessons to life.",
    },
    {
      title: "Smart Technology Classrooms",
      icon: <Laptop className="w-5 h-5 text-brand-orange" />,
      image: "/images/facility_smart.png",
      description: "Fully air-conditioned lecture halls featuring digital smart boards, recording setups for revision, and ergonomic seating.",
    },
    {
      title: "Curated Reference Library",
      icon: <BookOpen className="w-5 h-5 text-brand-gold" />,
      image: "/images/hero_bg.png", // Reuse hero background image
      description: "Over 5,000 reference books, competitive exam papers (JEE, NEET, CUET), quiet study desks, and digital research terminals.",
    },
    {
      title: "Modern Seminar Hall",
      icon: <Presentation className="w-5 h-5 text-brand-orange" />,
      image: "/images/course_commerce.png", // Reuse commerce course image
      description: "A spacious 150-seater auditorium used for guest webinars, career counseling seminars, academic workshops, and student awards.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="State-of-the-Art Infrastructure"
          subtitle="Our Facilities"
          description="We provide students with a comfortable, resourceful, and technologically advanced learning environment to help them focus entirely on academic growth."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="bg-brand-cream/20 rounded-2xl overflow-hidden border border-brand-navy/5 flex flex-col sm:flex-row shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image Container */}
              <div className="w-full sm:w-1/2 h-56 sm:h-auto relative overflow-hidden bg-brand-navy">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  sizes="(max-w-768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-550 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-brand-cream/10" />
              </div>

              {/* Text Content */}
              <div className="w-full sm:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-brand-navy/5 text-brand-navy flex items-center justify-center">
                      {facility.icon}
                    </div>
                    <h3 className="font-heading text-lg md:text-xl font-bold text-brand-navy">
                      {facility.title}
                    </h3>
                  </div>
                  <p className="text-sm font-light text-brand-charcoal/80 leading-relaxed">
                    {facility.description}
                  </p>
                </div>
                
                <div className="pt-2 border-t border-brand-navy/5 text-xs text-brand-gold font-semibold uppercase tracking-wider">
                  Premium Infrastructure
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
