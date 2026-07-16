"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Briefcase, GraduationCap } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import Button from "../ui/Button";

export default function FacultyHighlight() {
  const teachers = [
    {
      name: "Dr. Arvind Mukhopadhyay",
      role: "Director & HOD Chemistry",
      qualification: "Ph.D. in Organic Chemistry, IISc Bangalore",
      experience: "22+ Years",
      subject: "Chemistry",
      bgInitials: "AM",
      color: "bg-brand-navy text-brand-gold",
      accent: "border-brand-gold",
      quote: "Fundamentals are the bedrock of competitive success. We don't teach to memorize, we teach to understand.",
    },
    {
      name: "Prof. Sonal Khandelwal",
      role: "HOD Commerce & Business Studies",
      qualification: "M.Com, Chartered Accountant (CA)",
      experience: "15+ Years",
      subject: "Accountancy & Business",
      bgInitials: "SK",
      color: "bg-brand-gold text-brand-navy",
      accent: "border-brand-navy",
      quote: "Commerce is the study of practical markets. We connect classroom ledgers with actual corporate workflows.",
    },
    {
      name: "Prof. Vikram Malhotra",
      role: "Senior Physics Faculty",
      qualification: "M.Tech, IIT Kharagpur (Air 142)",
      experience: "12+ Years",
      subject: "Physics (JEE / NEET)",
      bgInitials: "VM",
      color: "bg-brand-orange text-white",
      accent: "border-brand-orange",
      quote: "Physics is visual. Once you visualize the forces and equations, problem-solving becomes second nature.",
    },
  ];

  return (
    <section className="py-20 bg-brand-cream/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Guided by Academic Experts"
          subtitle="Our Faculty Highlights"
          description="Meet our team of visionary educators, veteran teachers, and researchers dedicated to mentoring students towards outstanding academic landmarks."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-12">
          {teachers.map((teacher, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-6 md:p-8 border border-brand-navy/5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Profile Placeholder (Initials Avatar with Ring) */}
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-heading font-extrabold text-xl border-2 shadow-inner shrink-0 ${teacher.color} ${teacher.accent}`}>
                    {teacher.bgInitials}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-brand-navy">
                      {teacher.name}
                    </h3>
                    <p className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
                      {teacher.role}
                    </p>
                  </div>
                </div>

                {/* Teacher Quote */}
                <p className="text-sm font-light text-brand-charcoal/80 leading-relaxed italic relative pl-4 border-l-2 border-brand-gold">
                  &ldquo;{teacher.quote}&rdquo;
                </p>

                {/* Professional Specs */}
                <div className="space-y-3.5 pt-4 border-t border-brand-cream">
                  <div className="flex items-center gap-2.5 text-xs text-brand-charcoal/80">
                    <GraduationCap className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>{teacher.qualification}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-brand-charcoal/80">
                    <Briefcase className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>{teacher.experience} of teaching experience</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-brand-charcoal/80">
                    <Award className="w-4 h-4 text-brand-navy shrink-0" />
                    <span className="font-semibold text-brand-navy">Subject: {teacher.subject}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-brand-cream/60 flex justify-between items-center text-xs font-semibold text-brand-gold uppercase">
                <span>Edison Faculty Team</span>
                <span className="w-2 h-2 rounded-full bg-brand-gold" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button href="/faculty" variant="outline" className="px-8">
            View All Instructors
          </Button>
        </div>
      </div>
    </section>
  );
}
