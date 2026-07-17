"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { AlertCircle, Lock } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  // Check session on mount: if already authenticated, redirect immediately
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/admin/dashboard");
      } else {
        setCheckingSession(false);
      }
    }
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase.from('enquiries').select('count').limit(1);
      
      if (testError && testError.message.includes('Failed to fetch')) {
        setErrorMsg("Cannot connect to database. Please check your internet connection or contact support.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Failed to fetch')) {
          setErrorMsg("Network error: Cannot reach authentication server. Please check your internet connection.");
        } else if (error.message.includes('Invalid login credentials')) {
          setErrorMsg("Invalid email or password. Please try again.");
        } else {
          setErrorMsg(error.message);
        }
      } else if (data.session) {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err?.message?.includes('Failed to fetch')) {
        setErrorMsg("Connection failed. Please check: 1) Your internet connection, 2) Supabase project is active, 3) Firewall/VPN settings.");
      } else {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-brand-cream/10 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4">
      {/* Background overlay details */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-navy/60 via-brand-navy to-black opacity-90 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl p-8 relative z-10 text-white"
      >
        <div className="text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full border border-brand-gold bg-brand-navy flex items-center justify-center mx-auto shrink-0 relative overflow-hidden p-2.5">
            <Image
              src="/images/logo.png"
              alt="Edison Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest block">
              Secure Credentials Required
            </span>
            <h1 className="font-heading text-2xl font-extrabold tracking-wide mt-1">
              EDISON'S ADMIN PORTAL
            </h1>
            <div className="h-0.5 w-12 bg-brand-gold mx-auto mt-2.5 rounded-full" />
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-xs font-semibold flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-brand-orange" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-brand-gold/80">
              Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. administrator@edisons.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold text-white placeholder-white/30 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-brand-gold/80">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold text-white placeholder-white/30 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? "Verifying Session..." : "Secure Sign In"}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
