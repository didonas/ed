import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8 border-t border-brand-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Institution Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-8 relative shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Edison's Knowledge Hub Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <h3 className="font-heading font-extrabold text-lg md:text-xl tracking-wider text-white">
                EDISON'S <span className="text-brand-gold font-light">KNOWLEDGE HUB</span>
              </h3>
            </div>
            <p className="text-brand-cream/70 text-sm font-light leading-relaxed">
              Edison's Knowledge Hub is dedicated to providing students with premium education, 
              innovative courses, and mentorship that shapes the leaders of tomorrow. 
              Trust built through academic excellence since 2012.
            </p>
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-brand-navy transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/edisonshubnagercoil/"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-brand-navy transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-brand-navy transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold hover:text-brand-navy transition-all duration-300"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163c-.272-1.016-1.07-1.815-2.085-2.087C19.578 3.53 12 3.53 12 3.53s-7.578 0-9.413.546c-1.015.272-1.813 1.071-2.085 2.087C0 7.998 0 12 0 12s0 4.002.502 6.163c.272 1.016 1.07 1.815 2.085 2.087C4.42 20.8 12 20.8 12 20.8s7.58 0 9.417-.55c1.015-.272 1.81-.82 2.082-1.836C24 16.002 24 12 24 12s0-4.002-.502-6.163zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-lg text-brand-gold tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Our Courses", href: "/courses" },
                { name: "Faculty Team", href: "/faculty" },
                { name: "Gallery", href: "/gallery" },
                { name: "Contact Us", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group text-sm font-light text-brand-cream/80 hover:text-brand-gold flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity -ml-3 group-hover:ml-0" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-lg text-brand-gold tracking-wide">
              Contact Info
            </h4>
            <ul className="space-y-3.5 text-sm font-light text-brand-cream/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <span>
                  102, Academic Chambers, Sector 15,
                  <br />
                  Chanakyapuri, New Delhi - 110021
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-gold shrink-0" />
                <a href="tel:+919876543210" className="hover:text-brand-gold transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-gold shrink-0" />
                <a href="mailto:info@Edisonacademy.edu" className="hover:text-brand-gold transition-colors">
                  info@Edisonacademy.edu
                </a>
              </li>
            </ul>
          </div>

          {/* Working Hours Column */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-lg text-brand-gold tracking-wide">
              Office Hours
            </h4>
            <ul className="space-y-3 text-sm font-light text-brand-cream/80">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Monday - Saturday</p>
                  <p className="text-xs text-brand-cream/60">08:00 AM - 07:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Sunday</p>
                  <p className="text-xs text-brand-cream/60">09:00 AM - 02:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-brand-cream/50">
          <p>© {currentYear} Edison's Knowledge Hub. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-brand-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-brand-gold transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/courses" className="hover:text-brand-gold transition-colors">
              Admissions Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
