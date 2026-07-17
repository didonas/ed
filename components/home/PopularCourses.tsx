"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion as framerMotion } from "framer-motion";
import { Clock, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import Button from "../ui/Button";
import SectionHeading from "../ui/SectionHeading";

export default function PopularCourses() {
  const courses = [
    {
      title: "Science Stream (Integrated)",
      stream: "Science",
      image: "/images/course_science.png",
      description: "Rigorous training for board exams alongside JEE (Mains & Advanced) and NEET preparation. Ideal for engineering and medical aspirants.",
      duration: "2 Years",
      target: "Class 11 & 12 Students",
      badge: "Popular",
      features: [
        "Interactive Physics & Chemistry labs",
        "Rigorous JEE/NEET Mock tests",
        "Doubt resolution desk (10 AM - 6 PM)",
      ],
    },
    {
      title: "Commerce & Financial Markets",
      stream: "Commerce",
      image: "/images/course_commerce.png",
      description: "Comprehensive study of Accountancy, Economics, and Business Studies combined with core preparation for CUET and CA Foundation.",
      duration: "2 Years",
      target: "Class 11 & 12 Students",
      badge: "Trending",
      features: [
        "Practical tally & spreadsheet training",
        "CA Foundation syllabus coverage",
        "Expert webinars with industry leaders",
      ],
    },
    {
      title: "Humanities & Liberal Arts",
      stream: "Humanities",
      image: "/images/course_humanities.png",
      description: "Nurturing analytical skills in History, Political Science, and English Literature, integrated with CUET and Civil Services foundation prep.",
      duration: "2 Years",
      target: "Class 11 & 12 Students",
      badge: "Niche",
      features: [
        "Focus on creative writing & debates",
        "CUET humanities preparation",
        "Specialized sessions on polity & history",
      ],
    },
  ];

  return (
    <section className="py-20 bg-brand-cream/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Premium Course Programs"
          subtitle="Explore Streams"
          description="Designed by veteran educators, our structured courses ensure conceptual mastery, regular evaluation, and holistic success in examinations."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {courses.map((course, index) => (
            <framerMotion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl overflow-hidden border border-brand-navy/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-full"
            >
              {/* Image Section with hover zoom */}
              <div className="h-60 relative w-full overflow-hidden bg-brand-navy">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="(max-w-768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-108 group-hover:opacity-90"
                  loading="lazy"
                />
                
                {/* Badges on top of image */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-brand-navy text-white text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider">
                    {course.stream}
                  </span>
                  {course.badge && (
                    <span className="bg-brand-gold text-brand-navy text-xs font-semibold px-3 py-1 rounded-md uppercase tracking-wider">
                      {course.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="font-heading text-xl md:text-2xl font-extrabold text-brand-navy group-hover:text-brand-gold transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-sm font-light text-brand-charcoal/80 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <ul className="space-y-2 pt-2 border-t border-brand-cream/60">
                    {course.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4.5 h-4.5 text-brand-orange shrink-0 mt-0.5" />
                        <span className="text-xs text-brand-charcoal/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  {/* Meta Specs */}
                  <div className="flex justify-between items-center bg-brand-cream/35 p-3 rounded-lg border border-brand-gold/10">
                    <div className="flex items-center gap-1.5 text-xs text-brand-navy font-semibold">
                      <Clock className="w-4 h-4 text-brand-orange" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-brand-navy font-semibold">
                      <Users className="w-4 h-4 text-brand-navy" />
                      <span>{course.target}</span>
                    </div>
                  </div>

                  {/* CTA button */}
                  <Button
                    href="/courses"
                    variant="outline"
                    className="w-full justify-center group-hover:bg-brand-navy group-hover:text-white transition-colors duration-300"
                  >
                    Learn Syllabus <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </framerMotion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
