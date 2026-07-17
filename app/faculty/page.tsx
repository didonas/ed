"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Briefcase, Award, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function FacultyPage() {
  const [selectedDept, setSelectedDept] = useState("all");

  useEffect(() => {
    const handleFilterChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSelectedDept(customEvent.detail);
      const filterSection = document.getElementById("faculty-filters-bar");
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("eddie-faculty-filter", handleFilterChange);
    return () => window.removeEventListener("eddie-faculty-filter", handleFilterChange);
  }, []);

  const depts = [
    { name: "All Faculty", id: "all" },
    { name: "Science", id: "science" },
    { name: "Commerce", id: "commerce" },
    { name: "Humanities & Languages", id: "humanities" },
  ];

  const facultyList = [
    {
      name: "Dr. Arvind Mukhopadhyay",
      dept: "science",
      role: "Director & HOD Chemistry",
      qualification: "Ph.D. in Organic Chemistry, IISc Bangalore",
      experience: "22+ Years",
      subject: "Organic & Physical Chemistry",
      initials: "AM",
      color: "bg-brand-navy text-brand-gold border-brand-gold",
      bio: "Dr. Mukhopadhyay has published over 15 research papers and has spent two decades mentoring students for national engineering & medical gates.",
    },
    {
      name: "Prof. Sonal Khandelwal",
      dept: "commerce",
      role: "HOD Commerce & Business Studies",
      qualification: "M.Com, Chartered Accountant (CA)",
      experience: "15+ Years",
      subject: "Accountancy & Auditing",
      initials: "SK",
      color: "bg-brand-gold text-brand-navy border-brand-navy",
      bio: "Former finance consultant, CA Khandelwal specializes in simplifying auditing, partnership accounts, and business management concepts.",
    },
    {
      name: "Prof. Vikram Malhotra",
      dept: "science",
      role: "Senior Physics Faculty",
      qualification: "M.Tech, IIT Kharagpur (AIR 142)",
      experience: "12+ Years",
      subject: "Physics (JEE / NEET)",
      initials: "VM",
      color: "bg-brand-orange text-white border-brand-orange",
      bio: "An IIT alumnus, Prof. Malhotra is famous for his visual experiments that clarify mechanics and electrodynamics equations.",
    },
    {
      name: "Dr. Reena Sen",
      dept: "humanities",
      role: "HOD Humanities",
      qualification: "Ph.D. in History, JNU New Delhi",
      experience: "18+ Years",
      subject: "History & Political Science",
      initials: "RS",
      color: "bg-brand-navy text-white border-brand-gold",
      bio: "Dr. Sen is a recognized board evaluator and guides students in developing high-scoring answer-writing structures for boards & CUET.",
    },
    {
      name: "Prof. Rajesh Dixit",
      dept: "science",
      role: "Senior Mathematics Specialist",
      qualification: "M.Sc. in Mathematics, Delhi University",
      experience: "14+ Years",
      subject: "Mathematics (Calculus & Algebra)",
      initials: "RD",
      color: "bg-brand-orange/20 text-brand-navy border-brand-orange",
      bio: "Specializes in quick-solving mathematics methods for JEE Mains, helping students optimize speed and accuracy.",
    },
    {
      name: "Mrs. Anjali Mehta",
      dept: "humanities",
      role: "Senior English Faculty",
      qualification: "M.A. in English Literature, EFL University",
      experience: "10+ Years",
      subject: "English Literature & Grammar",
      initials: "AM",
      color: "bg-brand-gold/25 text-brand-navy border-brand-navy",
      bio: "Expert in soft skills training and creative writing, mentoring students for English core boards and CUET verbal sections.",
    },
  ];

  const filteredFaculty =
    selectedDept === "all"
      ? facultyList
      : facultyList.filter((f) => f.dept === selectedDept);

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-brand-navy text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('/images/hero_bg.png')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 to-brand-navy" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
          <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-brand-gold">
            Mentors & Educators
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Meet Our Faculty Team
          </h1>
          <div className="h-1 w-16 bg-brand-gold mx-auto rounded-full" />
        </div>
      </section>

      {/* Faculty Catalog Section */}
      <section className="py-16 md:py-24 bg-brand-cream/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Filtering */}
          <div id="faculty-filters-bar" className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16">
            {depts.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDept(d.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                  selectedDept === d.id
                    ? "bg-brand-navy text-white shadow-md border-b-2 border-brand-gold"
                    : "bg-white text-brand-navy hover:bg-brand-cream border border-brand-navy/10"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          {/* Faculty Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <AnimatePresence mode="wait">
              {filteredFaculty.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl p-6 md:p-8 border border-brand-navy/5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-6 text-left">
                    {/* Head/Profile layout */}
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center font-heading font-extrabold text-xl border-2 shadow-inner shrink-0 ${member.color}`}>
                        {member.initials}
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-brand-navy">
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Bio details */}
                    <p className="text-xs md:text-sm font-light text-brand-charcoal/80 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Metrics/Stats list */}
                    <div className="space-y-3 pt-4 border-t border-brand-cream">
                      <div className="flex items-center gap-2.5 text-xs text-brand-charcoal/80">
                        <GraduationCap className="w-4 h-4 text-brand-gold shrink-0" />
                        <span>{member.qualification}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-brand-charcoal/80">
                        <Briefcase className="w-4 h-4 text-brand-orange shrink-0" />
                        <span>{member.experience} lecturing experience</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-brand-charcoal/85">
                        <Award className="w-4 h-4 text-brand-navy shrink-0" />
                        <span className="font-semibold text-brand-navy">Subject: {member.subject}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card footer details */}
                  <div className="mt-8 pt-4 border-t border-brand-cream/60 flex justify-between items-center text-xs font-semibold text-brand-gold uppercase">
                    <span className="capitalize">{member.dept} Department</span>
                    <span className="w-2 h-2 rounded-full bg-brand-gold" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 bg-brand-navy text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Have Questions for Our Mentors?</h2>
          <p className="text-sm font-light text-brand-cream/80 leading-relaxed">
            Schedule a virtual or physical consultation meet to map your academic roadmap directly with our experts.
          </p>
          <Button href="/contact" variant="gold">Schedule Faculty Meet</Button>
        </div>
      </section>
    </div>
  );
}
