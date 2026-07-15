"use client";

import React from "react";
import { MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppFAB() {
  const whatsappNumber = "919876543210";
  const whatsappText = encodeURIComponent(
    "Hello Edison's Knowledge Hub! I would like to enquire about course details and admissions for the upcoming batch."
  );
  const phoneNumber = "+919876543210";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Phone Call Floating Button */}
      <motion.a
        href={`tel:${phoneNumber}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.8 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-brand-navy border border-brand-gold/30 text-white flex items-center justify-center shadow-lg hover:shadow-brand-navy/30 hover:bg-brand-gold hover:text-brand-navy transition-all duration-300"
        title="Call Admissions Office"
        aria-label="Call Admissions Office"
      >
        <Phone className="w-5 h-5" />
      </motion.a>

      {/* WhatsApp Message Floating Button */}
      <motion.a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
        target="_blank"
        rel="noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-[#25D366]/30 hover:bg-[#20ba59] transition-all duration-300 relative group"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        
        {/* Pulsing indicator to capture interest */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-bounce" />
        
        {/* Hover Label */}
        <span className="absolute right-14 top-2 bg-brand-navy text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-brand-gold/20">
          Enquire on WhatsApp
        </span>
      </motion.a>
    </div>
  );
}
