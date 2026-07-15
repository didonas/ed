import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "navy" | "gold" | "orange" | "cream";
  className?: string;
}

export default function Badge({
  children,
  variant = "navy",
  className = "",
}: BadgeProps) {
  const baseStyle =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider select-none";

  const variants = {
    navy: "bg-brand-navy/10 text-brand-navy border border-brand-navy/20",
    gold: "bg-brand-gold/15 text-brand-gold border border-brand-gold/30",
    orange: "bg-brand-orange/15 text-brand-orange border border-brand-orange/30",
    cream: "bg-brand-cream text-brand-navy border border-brand-gold/20",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
