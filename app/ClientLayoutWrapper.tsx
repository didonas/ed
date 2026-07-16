"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NewsTicker from "@/components/layout/NewsTicker";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/shared/WhatsAppFAB";
import EddieAssistant from "@/components/shared/EddieAssistant";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Return pure children for admin portal to exclude public elements
    return <>{children}</>;
  }

  return (
    <>
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
    </>
  );
}
