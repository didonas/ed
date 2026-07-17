"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, MessageSquare } from "lucide-react";
import Button from "../ui/Button";

export default function AdmissionCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-brand-navy via-brand-navy to-brand-navy/95 rounded-3xl overflow-hidden p-8 md:p-14 border border-brand-gold/25 shadow-xl text-white"
        >
          {/* Decorative background geometry */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* CTA Text Column */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <span className="inline-block px-3 py-1 bg-brand-gold text-brand-navy text-xs font-bold uppercase tracking-widest rounded">
                Admissions Session 2026-27
              </span>
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Unlock Your True Academic Potential.
              </h2>
              <p className="text-brand-cream/80 font-light leading-relaxed text-[15px] md:text-base lg:text-lg max-w-2xl">
                Seats are limited for the upcoming batches to ensure high quality attention. 
                Register for our free counseling session and secure your admission at Edison's Knowledge Hub today.
              </p>
              
              {/* Info Badges */}
              <div className="flex flex-wrap gap-6 pt-4 text-xs font-semibold text-brand-gold">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  <span>Limited Batch Sizes (Max 30)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                  <span>Scholarships Available for Meritorious Students</span>
                </div>
              </div>
            </div>

            {/* CTA Action Buttons Column */}
            <div className="lg:col-span-4 flex flex-col gap-4 w-full justify-end">
              <Button
                href="/contact"
                variant="gold"
                className="w-full justify-center shadow-lg py-3 sm:py-4 text-sm sm:text-base font-bold uppercase tracking-wider"
              >
                Register Enquiry <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
              </Button>
              <a
                href="tel:+919876543210"
                className="w-full py-3 sm:py-4 rounded-lg border-2 border-white/20 hover:border-white text-white hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide"
              >
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-brand-gold shrink-0" />
                <span className="break-words text-center">Call Admissions: +91 98765 43210</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
