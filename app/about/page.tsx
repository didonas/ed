"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Target, Eye, Quote, Shield, Milestone } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function AboutPage() {
  const coreValues = [
    {
      icon: <Target className="w-6 h-6 text-brand-gold" />,
      title: "Our Mission",
      desc: "To deliver top-tier education through simplified conceptual learning, creating a solid base for board examinations and competitive gateways.",
    },
    {
      icon: <Eye className="w-6 h-6 text-brand-orange" />,
      title: "Our Vision",
      desc: "To be recognized globally as a center of academic excellence where character building and career mentoring go hand in hand.",
    },
    {
      icon: <Shield className="w-6 h-6 text-brand-gold" />,
      title: "Our Values",
      desc: "Discipline, academic integrity, respect for curiosity, and continuous evaluation form the foundation of our work culture.",
    },
  ];

  const milestones = [
    {
      year: "2012",
      title: "The Foundation",
      desc: "Edison's Knowledge Hub was founded with just 2 classrooms and a vision to simplify competitive exam coaching.",
    },
    {
      year: "2016",
      title: "First State Topper",
      desc: "Our student secured Rank 1 in State Higher Secondary Examinations, marking our footprint.",
    },
    {
      year: "2020",
      title: "Digital Integration",
      desc: "Built modern smart classrooms and integrated interactive boards to deliver smart hybrid revision courses.",
    },
    {
      year: "2026",
      title: "A Decade & Beyond",
      desc: "Now mentoring over 1,500 students annually across Science, Commerce, and Humanities streams.",
    },
  ];

  return (
    <div className="w-full">
      {/* Subpage Header Banner */}
      <section className="bg-brand-navy text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url('/images/hero_bg.png')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 to-brand-navy" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 z-10">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs md:text-sm font-semibold uppercase tracking-widest text-brand-gold"
          >
            Get to Know Us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold"
          >
            About Edison's Knowledge Hub
          </motion.h1>
          <div className="h-1 w-16 bg-brand-gold mx-auto rounded-full" />
        </div>
      </section>

      {/* Story & Legacy Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">Our Story</span>
              <h2 className="font-heading text-3xl font-bold text-brand-navy">
                Empowering Students with Conceptual Purity since 2012.
              </h2>
              <p className="text-brand-charcoal/80 font-light leading-relaxed">
                Edison's Knowledge Hub was established with a singular focus: to strip away the stress of rote learning 
                and replace it with deep conceptual understanding. Over the last decade, we have grown 
                from a small coaching tutorial to a premium institute of repute.
              </p>
              <p className="text-brand-charcoal/70 font-light text-sm leading-relaxed">
                Our founders noticed that while students spent hours studying, they struggled to solve problems 
                requiring application of knowledge. By hiring dedicated researchers and CA/IIT level educators, 
                we structured a curriculum that starts with standard school boards and scales smoothly to 
                national competitive benchmarks.
              </p>
            </motion.div>

            {/* Core Values grid on Right */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {coreValues.map((val, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-xl border border-brand-navy/5 bg-brand-cream/10 hover:bg-white hover:border-brand-gold/20 transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center shrink-0">
                    {val.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-brand-navy mb-1">{val.title}</h3>
                    <p className="text-xs md:text-sm font-light text-brand-charcoal/80 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Director's Message Section */}
      <section className="py-16 md:py-24 bg-brand-cream/35">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-14 border border-brand-navy/5 shadow-md relative"
          >
            <Quote className="absolute top-6 right-8 w-24 h-24 text-brand-gold/5 pointer-events-none" />
            
            <div className="space-y-8">
              <div className="text-center md:text-left space-y-2">
                <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">Leadership Message</span>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-brand-navy">Director's Message</h2>
                <div className="h-0.5 w-12 bg-brand-gold mt-1 mx-auto md:ml-0 rounded-full" />
              </div>

              <div className="space-y-5 text-sm md:text-base font-light text-brand-charcoal/90 leading-relaxed italic">
                <p>
                  &ldquo;Education is not about loading the mind with facts. It is about training the mind to think. 
                  At Edison's Knowledge Hub, our primary objective is to instil a sense of confidence and intellectual curiosity 
                  in every student who walks through our doors.&rdquo;
                </p>
                <p>
                  &ldquo;We understand that the transition from school exams to national competitive papers like JEE or CUET 
                  can feel overwhelming. That is why our structure focuses on gradual progression—ensuring that school boards 
                  are mastered first, followed by application-based problem solving. We invite parents and students to join us 
                  and experience a premium approach to mentoring.&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-brand-cream flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="font-heading text-lg font-bold text-brand-navy">Dr. Arvind Mukhopadhyay</h4>
                  <p className="text-xs text-brand-muted">Founder & Director, Edison's Knowledge Hub</p>
                </div>
                <div className="border border-brand-gold/30 rounded-lg px-4 py-2 bg-brand-cream/20">
                  <span className="text-xs font-bold text-brand-gold tracking-widest uppercase">Academic Integrity</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* History Milestones Timeline */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Path of Growth"
            subtitle="Milestones"
            description="A visual look at how we expanded our campus, faculty strength, and success rates over the years."
          />

          <div className="relative border-l border-brand-gold/30 md:border-l-0 md:before:absolute md:before:top-1/2 md:before:left-0 md:before:w-full md:before:h-[1px] md:before:bg-brand-gold/30 md:before:-translate-y-1/2 min-h-[300px] flex flex-col md:flex-row justify-between gap-12 md:gap-6 pl-6 md:pl-0 pt-4">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative md:w-1/4 md:text-center space-y-3"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[31px] top-1.5 md:-left-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-brand-gold border-4 border-white shadow-md z-10" />

                <div className="bg-brand-cream/20 md:bg-white p-5 rounded-xl border border-brand-navy/5 md:border-0 hover:shadow-md transition-shadow">
                  <span className="inline-block font-heading text-2xl font-extrabold text-brand-orange mb-1">
                    {m.year}
                  </span>
                  <h4 className="font-heading text-base font-bold text-brand-navy mb-2">{m.title}</h4>
                  <p className="text-xs text-brand-charcoal/80 font-light leading-relaxed">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Admissions page */}
      <section className="py-12 bg-brand-navy text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold">Experience Academic Excellence Firsthand</h2>
          <p className="text-sm font-light text-brand-cream/80 leading-relaxed">
            Register your enquiry or schedule a physical campus tour with our faculty mentors.
          </p>
          <div className="flex justify-center gap-4">
            <Button href="/contact" variant="gold">Enquire Now</Button>
            <Button href="/courses" variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-brand-navy">Browse Courses</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
