"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/admin/login");
      }
    }
    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-brand-cream/10 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin" />
    </div>
  );
}
