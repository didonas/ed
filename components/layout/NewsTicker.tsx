"use client";

import React from "react";
import { Sparkles, Calendar, Award } from "lucide-react";

export default function NewsTicker() {
  const newsItems = [
    {
      icon: <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />,
      text: "Admissions Open for Academic Year 2026-27 — Secure your seat today!",
    },
    {
      icon: <Award className="w-4 h-4 text-brand-navy" />,
      text: "Ranked #1 Coaching Institution for Science & Commerce streams in the Region.",
    },
    {
      icon: <Calendar className="w-4 h-4 text-brand-orange" />,
      text: "New batches starting from August 1st. Early Bird 15% discount till July 31st.",
    },
    {
      icon: <Sparkles className="w-4 h-4 text-brand-navy" />,
      text: "Free trial workshop this weekend. Register now to experience academic excellence.",
    },
  ];

  // Double the array to make a seamless scrolling loop
  const scrollItems = [...newsItems, ...newsItems];

  return (
    <div className="w-full bg-brand-gold text-brand-navy text-xs md:text-sm font-semibold py-2 border-b border-brand-gold/20 overflow-hidden relative z-50">
      <div className="flex w-max items-center animate-marquee whitespace-nowrap">
        {scrollItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mx-12">
            {item.icon}
            <span>{item.text}</span>
            <span className="ml-8 text-brand-navy/40 font-light">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
