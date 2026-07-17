"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Clock, Users, ArrowRight, BookOpen, Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const handleFilterChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setSelectedCategory(customEvent.detail);
      const filterSection = document.getElementById("courses-filters-bar");
      if (filterSection) {
        filterSection.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("eddie-courses-filter", handleFilterChange);
    return () => window.removeEventListener("eddie-courses-filter", handleFilterChange);
  }, []);

  const categories = [
    { name: "All Programs", id: "all" },
    { name: "Science", id: "science" },
    { name: "Commerce", id: "commerce" },
    { name: "Humanities", id: "humanities" },
  ];

  const courseList = [
    {
      title: "Science Stream: Medical (PCB)",
      category: "science",
      image: "/images/course_science.png",
      duration: "2 Years",
      target: "Class 11 & 12",
      description: "Integrated preparation for CBSE/State Board Exams and NEET. Focuses on in-depth concepts, diagram structures, and mock testing.",
      syllabus: [
        "Physics: Mechanics, Electromagnetism, Optics, Modern Physics",
        "Chemistry: Organic, Inorganic, Physical Chemistry",
        "Biology: Zoology, Botany, Human Physiology, Genetics",
      ],
      highlights: ["Regular NCERT-oriented tests", "Complete NEET past year drills", "Biology laboratory workshop"],
    },
    {
      title: "Science Stream: Engineering (PCM)",
      category: "science",
      image: "/images/course_science.png",
      duration: "2 Years",
      target: "Class 11 & 12",
      description: "Rigorous analytical training mapped to JEE Main & Advanced alongside Boards. Focuses on speed drills and mathematics application.",
      syllabus: [
        "Physics: Thermodynamics, Waves, Electrodynamics",
        "Chemistry: Reaction kinetics, Coordination chemistry",
        "Mathematics: Calculus, Coordinate geometry, Algebra",
      ],
      highlights: ["Weekly JEE pattern test series", "Specialized problem solving desks", "Online testing portal simulation"],
    },
    {
      title: "Commerce & CA Foundation",
      category: "commerce",
      image: "/images/course_commerce.png",
      duration: "2 Years",
      target: "Class 11 & 12",
      description: "Rigorous grounding in financial structures and economics. Integrated with CUET and Chartered Accountancy (CA) entrance concepts.",
      syllabus: [
        "Accountancy: Partnership, Company accounts, Ratios",
        "Business Studies: Management, Finance, Marketing",
        "Economics: Micro, Macro, Indian Economic Development",
      ],
      highlights: ["CA Foundation specific mock series", "CUET section 2 prep material", "Accounting software fundamentals"],
    },
    {
      title: "Liberal Arts & Civil Prep",
      category: "humanities",
      image: "/images/course_humanities.png",
      duration: "2 Years",
      target: "Class 11 & 12",
      description: "Integrated course covering humanities subjects, developing analytical faculties and setting foundation for UPSC/Civil services.",
      syllabus: [
        "History: Ancient, Medieval, Modern World History",
        "Political Science: Constitution, Global Politics, Theory",
        "English Literature: Critical analysis, Grammar, Writing",
      ],
      highlights: ["Answer writing skill workshops", "CUET domain test guides", "Current affairs weekly analysis"],
    },
  ];

  const filteredCourses =
    selectedCategory === "all"
      ? courseList
      : courseList.filter((c) => c.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-brand-navy text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('/images/hero_bg.png')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 to-brand-navy" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
          <span className="text-xs md:text-sm font-semibold uppercase tracking-widest text-brand-gold">
            Study Programs
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold">
            Available Course Streams
          </h1>
          <div className="h-1 w-16 bg-brand-gold mx-auto rounded-full" />
        </div>
      </section>

      {/* Courses Catalog Section */}
      <section className="py-16 md:py-24 bg-brand-cream/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Filtering Buttons */}
          <div id="courses-filters-bar" className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 md:mb-16">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-brand-navy text-white shadow-md border-b-2 border-brand-gold"
                    : "bg-white text-brand-navy hover:bg-brand-cream border border-brand-navy/10"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Courses Listing Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
            <AnimatePresence mode="wait">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-2xl overflow-hidden border border-brand-navy/5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group h-full"
                >
                  <div>
                    {/* Top image bar */}
                    <div className="h-56 relative w-full overflow-hidden bg-brand-navy">
                      <Image
                        src={course.image}
                        alt={course.title}
                        fill
                        sizes="(max-w-1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-brand-navy text-white text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    {/* Course Details Content */}
                    <div className="p-6 md:p-8 space-y-6 text-left">
                      <div className="space-y-3">
                        <h3 className="font-heading text-xl md:text-2xl font-bold text-brand-navy">
                          {course.title}
                        </h3>
                        <p className="text-sm font-light text-brand-charcoal/80 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      {/* Course Core Specs */}
                      <div className="flex gap-4 border-y border-brand-cream py-4 my-4">
                        <div className="flex items-center gap-1.5 text-xs text-brand-charcoal/90 font-medium">
                          <Clock className="w-4.5 h-4.5 text-brand-orange" />
                          <span>Duration: {course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-brand-charcoal/90 font-medium">
                          <Users className="w-4.5 h-4.5 text-brand-navy" />
                          <span>Target: {course.target}</span>
                        </div>
                      </div>

                      {/* Syllabus Breakout */}
                      <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-brand-gold flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-brand-orange" />
                          Syllabus Overview
                        </h4>
                        <div className="space-y-2">
                          {course.syllabus.map((syl, sIdx) => (
                            <div key={sIdx} className="text-xs md:text-sm font-light text-brand-charcoal/90 pl-3 border-l-2 border-brand-cream/65">
                              {syl}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Highlight Checklist */}
                      <div className="space-y-2 pt-2">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-brand-navy">
                          Features & Deliverables
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {course.highlights.map((hl, hIdx) => (
                            <div key={hIdx} className="flex items-center gap-2 text-xs font-light text-brand-charcoal/95">
                              <Check className="w-4 h-4 text-brand-orange text-left" />
                              <span>{hl}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card bottom CTA */}
                  <div className="p-6 md:p-8 bg-brand-cream/20 border-t border-brand-cream/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-xs text-brand-muted uppercase font-semibold">Admissions Open 2026-27</span>
                    <Button href="/contact" variant="gold" className="w-full sm:w-auto text-xs py-2 px-4 uppercase font-semibold">
                      Enquire Now <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Trust Quote Banner */}
      <section className="py-12 bg-brand-navy text-white text-center border-t border-brand-gold/15">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h3 className="font-heading text-lg md:text-xl font-medium tracking-wide">
            Not sure which stream is right for you?
          </h3>
          <p className="text-xs font-light text-brand-cream/70">
            Talk to our academic directors for a one-on-one counseling session to align your aptitude with the right career path.
          </p>
          <Button href="/contact" variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-brand-navy">
            Register Counselling Request
          </Button>
        </div>
      </section>
    </div>
  );
}
