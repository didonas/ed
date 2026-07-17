"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Award, Users, BookOpen, Clock } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

export default function IntroStats() {
  const stats = [
    {
      icon: <Clock className="w-6 h-6 text-brand-gold" />,
      number: "14+",
      label: "Years of Excellence",
      description: "Mentoring students since 2012",
    },
    {
      icon: <Users className="w-6 h-6 text-brand-orange" />,
      number: "12,000+",
      label: "Alumni Guided",
      description: "Successful academic careers",
    },
    {
      icon: <Award className="w-6 h-6 text-brand-gold" />,
      number: "98.7%",
      label: "Success Rate",
      description: "In board & entrance exams",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-brand-orange" />,
      number: "50+",
      label: "Expert Faculty",
      description: "Dedicated full-time educators",
    },
  ];

  const highlights = [
    "Personalized attention with small batch sizes.",
    "Comprehensive study materials and daily practice papers.",
    "Weekly mock tests with detailed performance reports.",
    "Special mentorship for competitive examinations (JEE, NEET, CUET).",
  ];

  return (
    <section className="py-20 bg-brand-cream/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Story/Introduction */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-brand-gold">
              Welcome to Edison's Knowledge Hub
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-brand-navy leading-tight">
              A Legacy of Academic Purity and Quality Education.
            </h2>
            <div className="h-1 w-16 bg-brand-gold rounded-full" />
            <p className="text-brand-charcoal/80 font-light leading-relaxed text-[15px] md:text-base lg:text-lg">
              At Edison's Knowledge Hub, we believe in building strong fundamentals. Our courses are 
              meticulously designed to bridge the gap between classroom concepts and application, 
              instilling confidence in students to face both board exams and national level tests.
            </p>
            <p className="text-brand-charcoal/80 font-light leading-relaxed text-[15px] md:text-base lg:text-lg">
              Founded by a team of visionary educators, our institution combines traditional discipline 
              with modern learning tools. We foster an environment that respects curiosity and encourages 
              critical thinking, making education a fulfilling journey rather than a chore.
            </p>
            
            {/* Quick Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {highlights.map((text, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <span className="text-sm text-brand-charcoal/80 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Dynamic Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, boxShadow: "0 10px 30px -10px rgba(27, 35, 64, 0.15)" }}
                className="bg-white p-6 rounded-xl border border-brand-navy/5 shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-cream flex items-center justify-center border border-brand-gold/10">
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-3xl font-extrabold text-brand-navy">
                      {stat.number}
                    </h3>
                    <p className="text-sm font-semibold text-brand-charcoal mt-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-brand-muted mt-3 pt-3 border-t border-brand-cream font-light">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
