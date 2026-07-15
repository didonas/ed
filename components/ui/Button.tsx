"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "gold";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseStyle =
    "px-6 py-3 rounded-lg font-medium text-sm md:text-base transition-all duration-300 inline-flex items-center justify-center gap-2 tracking-wide cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy shadow-md shadow-brand-navy/10",
    secondary: "bg-brand-orange text-white hover:bg-brand-navy shadow-md shadow-brand-orange/10",
    outline: "border-2 border-brand-navy text-brand-navy bg-transparent hover:bg-brand-navy hover:text-white",
    gold: "bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white shadow-md shadow-brand-gold/15",
  };

  const buttonContent = (
    <motion.span
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-2 justify-center w-full h-full"
    >
      {children}
    </motion.span>
  );

  const fullClassName = `${baseStyle} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={fullClassName}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={fullClassName}
    >
      {buttonContent}
    </button>
  );
}
