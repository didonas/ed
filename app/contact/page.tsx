"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    stream: "science",
    message: "",
  });

  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) tempErrors.name = "Full name is required.";
    if (!formData.email.trim()) {
      tempErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email.";
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      tempErrors.phone = "Please enter a valid 10-digit number.";
    }
    if (!formData.message.trim()) tempErrors.message = "Message is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState("submitting");

    // Simulate API Submission delay
    setTimeout(() => {
      setFormState("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        stream: "science",
        message: "",
      });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-brand-navy text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('/images/hero_bg.png')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 to-brand-navy" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
          <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-brand-gold">
            Get In Touch
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Contact Admissions
          </h1>
          <div className="h-1 w-16 bg-brand-gold mx-auto rounded-full" />
        </div>
      </section>

      {/* Main Details & Form grid */}
      <section className="py-16 md:py-24 bg-brand-cream/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Contact Information on Left */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">Office Details</span>
                <h2 className="font-heading text-3xl font-bold text-brand-navy">Admissions Office</h2>
                <p className="text-sm font-light text-brand-charcoal/80 leading-relaxed">
                  Have questions about seats availability, scholarship syllabus, or batch timings? 
                  Reach out directly to our helpdesk or visit our campus.
                </p>
              </div>

              {/* Physical/Digital Info Cards */}
              <div className="space-y-5">
                {/* MapPin */}
                <div className="flex gap-4 p-5 bg-white rounded-xl border border-brand-navy/5 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-brand-navy mb-1">Campus Location</h3>
                    <p className="text-xs md:text-sm font-light text-brand-charcoal/85 leading-relaxed">
                      102, Academic Chambers, Sector 15,
                      <br />
                      Chanakyapuri, New Delhi - 110021
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4 p-5 bg-white rounded-xl border border-brand-navy/5 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-brand-navy mb-1">Phone Helpline</h3>
                    <p className="text-xs md:text-sm font-semibold text-brand-charcoal/90">
                      Admissions Desk:{" "}
                      <a href="tel:+919876543210" className="text-brand-orange hover:text-brand-navy transition-colors">
                        +91 98765 43210
                      </a>
                    </p>
                    <p className="text-xs text-brand-muted font-light mt-0.5">Available Mon-Sat (8:00 AM - 7:00 PM)</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4 p-5 bg-white rounded-xl border border-brand-navy/5 shadow-sm">
                  <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-brand-navy mb-1">Email Queries</h3>
                    <p className="text-xs md:text-sm font-semibold text-brand-charcoal/90">
                      Admissions:{" "}
                      <a href="mailto:admissions@Edisonacademy.edu" className="text-brand-navy hover:text-brand-gold transition-colors">
                        admissions@Edisonacademy.edu
                      </a>
                    </p>
                    <p className="text-xs md:text-sm font-semibold text-brand-charcoal/90">
                      General:{" "}
                      <a href="mailto:info@Edisonacademy.edu" className="text-brand-navy hover:text-brand-gold transition-colors">
                        info@Edisonacademy.edu
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="p-6 bg-brand-navy text-white rounded-xl border border-brand-gold/20 space-y-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-brand-gold" />
                  <h4 className="font-heading text-base font-bold">Prefer Instant Messaging?</h4>
                </div>
                <p className="text-xs text-brand-cream/80 font-light leading-relaxed">
                  Chat directly with our administrative counsellors via WhatsApp. Get quick answers regarding courses, eligibility, and fees.
                </p>
                <a
                  href="https://wa.me/919876543210?text=Hello%20Edison%20Academy%21%20I%20would%20like%20to%20enquire%20about%20admissions."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs uppercase font-bold tracking-wider bg-[#25D366] text-white hover:bg-[#20ba59] transition-colors w-full"
                >
                  Message on WhatsApp
                </a>
              </div>
            </div>

            {/* Simulated Contact Form on Right */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-10 border border-brand-navy/5 shadow-sm text-left">
              <AnimatePresence mode="wait">
                {formState === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center space-y-6"
                  >
                    <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-2xl font-extrabold text-brand-navy">Enquiry Registered!</h3>
                      <p className="text-sm font-light text-brand-charcoal/80 max-w-md mx-auto leading-relaxed">
                        Thank you for reaching out to Edison's Knowledge Hub. Our admissions supervisor will call you within 
                        the next 24 business hours to address your queries.
                      </p>
                    </div>
                    <Button onClick={() => setFormState("idle")} variant="outline" className="px-6 !py-2 text-xs">
                      Submit Another Query
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-heading text-xl md:text-2xl font-extrabold text-brand-navy">Online Enquiry Form</h3>
                      <p className="text-xs text-brand-muted font-light">Fill out the fields below, and our coordinator will connect with you.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-xs font-semibold text-brand-navy uppercase tracking-wider">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="E.g. Rohan Sharma"
                          className={`w-full px-4 py-3 rounded-lg border text-sm font-light focus:outline-none focus:ring-1 ${
                            errors.name ? "border-red-500 focus:ring-red-500" : "border-brand-navy/10 focus:ring-brand-gold focus:border-brand-gold"
                          }`}
                        />
                        {errors.name && <span className="text-[10px] text-red-500 font-semibold">{errors.name}</span>}
                      </div>

                      {/* Email */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-xs font-semibold text-brand-navy uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="E.g. rohan@gmail.com"
                          className={`w-full px-4 py-3 rounded-lg border text-sm font-light focus:outline-none focus:ring-1 ${
                            errors.email ? "border-red-500 focus:ring-red-500" : "border-brand-navy/10 focus:ring-brand-gold focus:border-brand-gold"
                          }`}
                        />
                        {errors.email && <span className="text-[10px] text-red-500 font-semibold">{errors.email}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Phone */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="phone" className="text-xs font-semibold text-brand-navy uppercase tracking-wider">
                          Phone Number (10 Digit)
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="E.g. 9876543210"
                          className={`w-full px-4 py-3 rounded-lg border text-sm font-light focus:outline-none focus:ring-1 ${
                            errors.phone ? "border-red-500 focus:ring-red-500" : "border-brand-navy/10 focus:ring-brand-gold focus:border-brand-gold"
                          }`}
                        />
                        {errors.phone && <span className="text-[10px] text-red-500 font-semibold">{errors.phone}</span>}
                      </div>

                      {/* Course Dropdown */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="stream" className="text-xs font-semibold text-brand-navy uppercase tracking-wider">
                          Preferred Stream
                        </label>
                        <select
                          id="stream"
                          name="stream"
                          value={formData.stream}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-brand-navy/10 text-sm font-light focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold bg-white"
                        >
                          <option value="science">Science Stream (Integrated JEE/NEET)</option>
                          <option value="commerce">Commerce Stream (Integrated CA/CUET)</option>
                          <option value="humanities">Humanities Stream (CUET/Civil Foundations)</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="message" className="text-xs font-semibold text-brand-navy uppercase tracking-wider">
                        Message / Query Details
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your doubts or requirements here..."
                        rows={5}
                        className={`w-full px-4 py-3 rounded-lg border text-sm font-light focus:outline-none focus:ring-1 ${
                          errors.message ? "border-red-500 focus:ring-red-500" : "border-brand-navy/10 focus:ring-brand-gold focus:border-brand-gold"
                        }`}
                      />
                      {errors.message && <span className="text-[10px] text-red-500 font-semibold">{errors.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="gold"
                      disabled={formState === "submitting"}
                      className="w-full py-4 text-sm font-bold uppercase tracking-wider shadow-md justify-center"
                    >
                      {formState === "submitting" ? "Sending Enquiry..." : "Send Message"} <Send className="w-4 h-4 ml-1" />
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="w-full h-[450px] relative bg-brand-cream border-t border-brand-gold/10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.8315264380625!2d77.1843231!3d28.5912836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1d6438b4d8d1%3A0xe5a3637e6f8ef94!2sChanakyapuri%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Edison's Knowledge Hub Campus Location Map"
          className="grayscale hover:grayscale-0 transition-all duration-500"
        />
      </section>
    </div>
  );
}
