"use client";

import React from "react";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  align?: "center" | "left";
  badge?: string;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  description,
  align = "center",
  badge,
  light = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const titleColor = light ? "text-white" : "text-brand-navy";
  const descColor = light ? "text-brand-cream/80" : "text-brand-charcoal/80";
  const subColor = "text-brand-gold";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`max-w-3xl mb-12 md:mb-16 ${alignClass}`}
    >
      {badge && (
        <span className="inline-block px-4 py-1.5 mb-3 text-xs font-semibold uppercase tracking-widest text-brand-navy bg-brand-gold rounded-full shadow-sm">
          {badge}
        </span>
      )}
      
      {subtitle && (
        <p className={`text-xs md:text-sm font-semibold uppercase tracking-widest ${subColor} mb-2`}>
          {subtitle}
        </p>
      )}

      <h2 className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${titleColor}`}>
        {title}
      </h2>

      {/* Decorative accent divider */}
      <div className={`h-1 w-16 bg-brand-gold mt-4 mb-5 ${align === "center" ? "mx-auto" : "mr-auto"} rounded-full`} />

      {description && (
        <p className={`text-base md:text-lg font-light leading-relaxed ${descColor}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
