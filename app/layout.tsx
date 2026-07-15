import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import NewsTicker from "@/components/layout/NewsTicker";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/shared/WhatsAppFAB";
import EddieAssistant from "@/components/shared/EddieAssistant";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Edison's Knowledge Hub | Premium Coaching & Courses Institution",
    template: "%s | Edison's Knowledge Hub",
  },
  description:
    "Edison's Knowledge Hub is a premier academic institution offering state-of-the-art Science, Commerce, and Humanities courses. Connect with expert faculty, experience immersive learning, and secure admissions.",
  keywords: [
    "Coaching Institute",
    "Academic Institution",
    "Science Coaching",
    "Commerce Coaching",
    "Admissions 2026",
    "Edison's Knowledge Hub",
    "Delhi Best Institute",
  ],
  authors: [{ name: "Edison's Knowledge Hub Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream text-brand-charcoal font-sans">
        {/* Horizontal Announcements Ticker */}
        <NewsTicker />
        
        {/* Sticky Header Navbar */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow">{children}</main>
        
        {/* Institution Footer */}
        <Footer />
        
        {/* Floating Quick Action Contacts */}
        <WhatsAppFAB />

        {/* Eddie Digital Mascot Guide */}
        <EddieAssistant />
      </body>
    </html>
  );
}
