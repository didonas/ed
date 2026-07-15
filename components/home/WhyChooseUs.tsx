"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, BookOpenCheck, LineChart, HelpCircle, GraduationCap } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <GraduationCap className="w-8 h-8 text-brand-gold" />,
      title: "Highly Qualified Faculty",
      description: "Our instructors are veteran professors, IITians, and board examiners who have years of experience in simplifying complex syllabus concepts.",
    },
    {
      icon: <BookOpenCheck className="w-8 h-8 text-brand-orange" />,
      title: "Customized Study Material",
      description: "We provide in-house notes, conceptual workbooks, and topic-wise exercise sheets designed to keep students ahead of their school syllabus.",
    },
    {
      icon: <LineChart className="w-8 h-8 text-brand-gold" />,
      title: "Continuous Progress Audits",
      description: "Detailed evaluation reports are shared with parents monthly. We track errors and design special revision sessions to fix conceptual gaps.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-orange" />,
      title: "Holistic Academic Support",
      description: "Beyond core classes, we offer doubt-solving sessions, personal counseling for exam stress, and extensive career guidance workshops.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white relative">
      {/* Decorative background grid/dots */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#1B2340_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="Why Choose Edison's Knowledge Hub?"
          subtitle="Our Strengths"
          description="We provide more than just lectures. We curate an ecosystem that inspires discipline, builds understanding, and delivers excellent academic results."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-brand-cream/30 p-8 rounded-2xl border border-brand-navy/5 hover:border-brand-gold/30 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-lg flex flex-col items-start text-left"
            >
              <div className="p-3 bg-white rounded-xl border border-brand-gold/10 shadow-sm mb-6 flex items-center justify-center">
                {reason.icon}
              </div>
              <h3 className="font-heading text-lg font-bold text-brand-navy mb-3">
                {reason.title}
              </h3>
              <p className="text-sm text-brand-charcoal/80 font-light leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
