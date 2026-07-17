"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Eye } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";

export default function GalleryPreview() {
  const images = [
    {
      src: "/images/facility_science.png",
      title: "Science Lab Experiments",
      category: "Academic",
    },
    {
      src: "/images/facility_smart.png",
      title: "Smart Classroom Lecture",
      category: "Infrastructure",
    },
    {
      src: "/images/course_science.png",
      title: "Engineering Prep Workshop",
      category: "Workshops",
    },
    {
      src: "/images/course_commerce.png",
      title: "Commerce Case Studies",
      category: "Seminars",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Campus Life & Activities"
          subtitle="Gallery Preview"
          description="Take a visual tour through our state-of-the-art labs, modern smart classrooms, interactive seminars, and student activities."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="relative h-72 rounded-xl overflow-hidden shadow-sm group border border-brand-navy/5"
            >
              {/* Image */}
              <Image
                src={image.src}
                alt={image.title}
                fill
                sizes="(max-w-768px) 100vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-108"
                loading="lazy"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-brand-navy/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white z-10">
                <span className="self-start text-[10px] uppercase font-bold tracking-widest bg-brand-gold text-brand-navy px-2 py-0.5 rounded">
                  {image.category}
                </span>
                
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-brand-gold" />
                  </div>
                  <h3 className="font-heading text-base font-bold leading-tight">
                    {image.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button href="/gallery" variant="outline" className="px-8">
            View Campus Gallery <ArrowRight className="w-4.5 h-4.5 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
