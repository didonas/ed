"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, GraduationCap, Award } from "lucide-react";
import Button from "../ui/Button";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-brand-navy overflow-hidden">
      {/* Background Image with dimming gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 hover:scale-105"
        style={{
          backgroundImage: `url('/images/hero_bg.png')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-brand-navy/60 mix-blend-multiply" />
      
      {/* Subtle glowing elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 z-10 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl text-left"
        >
          {/* Tagline Badge */}
          <motion.div variants={itemVariants} className="inline-block mb-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-gold text-brand-navy shadow-lg shadow-brand-gold/10 border border-brand-gold/20">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
              Admissions Open 2026-27
            </span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6"
          >
            <span className="block">Empowering Minds,</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-orange to-brand-gold">
              Shaping Future Leaders.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-brand-cream/80 font-light leading-relaxed mb-8 max-w-2xl"
          >
            Experience a premium academic environment with expert faculty, tailored curricula, 
            and hands-on mentorship that ensures students excel in examinations and life.
          </motion.p>

          {/* Call-to-Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 mb-16"
          >
            <Button href="/courses" variant="gold" className="px-8 py-4 text-base shadow-xl border-2 border-transparent">
              Explore Courses <ArrowRight className="w-5 h-5" />
            </Button>
            <Button href="/contact" variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-brand-navy px-8 py-4 text-base">
              Talk to Advisor
            </Button>
          </motion.div>

          {/* Trust Highlights Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10"
          >
            {[
              {
                icon: <GraduationCap className="w-5 h-5 text-brand-gold" />,
                title: "Expert Mentorship",
                desc: "IIT/IIM & PhD Faculty",
              },
              {
                icon: <BookOpen className="w-5 h-5 text-brand-gold" />,
                title: "Structured Courses",
                desc: "Science, Commerce & Humanities",
              },
              {
                icon: <Award className="w-5 h-5 text-brand-gold" />,
                title: "Proven Success",
                desc: "98% Board & Competitive Clears",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/5 h-full shadow-sm"
              >
                <div className="p-2 rounded-md bg-white/5 text-brand-gold">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{feature.title}</h4>
                  <p className="text-xs text-brand-cream/60 font-light">{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
