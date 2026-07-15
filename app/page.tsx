import React from "react";
import Hero from "@/components/home/Hero";
import IntroStats from "@/components/home/IntroStats";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PopularCourses from "@/components/home/PopularCourses";
import Facilities from "@/components/home/Facilities";
import FacultyHighlight from "@/components/home/FacultyHighlight";
import Testimonials from "@/components/home/Testimonials";
import GalleryPreview from "@/components/home/GalleryPreview";
import AdmissionCTA from "@/components/home/AdmissionCTA";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. Fullscreen Hero Section */}
      <Hero />
      
      {/* 2. Introduction & Performance Metrics */}
      <IntroStats />
      
      {/* 3. Core Strengths / Why Choose Us */}
      <WhyChooseUs />
      
      {/* 4. Stream Highlighting / Popular Courses */}
      <PopularCourses />
      
      {/* 5. Physical Infrastructure / Facilities */}
      <Facilities />
      
      {/* 6. Lead Academicians / Faculty Highlights */}
      <FacultyHighlight />
      
      {/* 7. Student Ranks / Testimonials Carousel */}
      <Testimonials />
      
      {/* 8. Campus Visuals Preview / Gallery */}
      <GalleryPreview />
      
      {/* 9. Enrolment Banner / Admissions CTA */}
      <AdmissionCTA />
    </div>
  );
}
