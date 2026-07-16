"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, BellRing, Inbox, X, Calendar, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getEnquiryId } from "@/services/onboardingService";
import {
  fetchNotificationsForVisitor,
  markSingleNotificationRead,
  markNotificationsAsRead,
  Notification,
} from "@/services/supabaseService";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [enquiryId, setEnquiryId] = useState<string | null>(null);
  
  const panelRef = useRef<HTMLDivElement>(null);

  // Load visitor enquiry ID and fetch notifications on mount
  useEffect(() => {
    const id = getEnquiryId();
    if (id) {
      setEnquiryId(id);
      loadNotifications(id);
      
      // Poll for new notifications every 10 seconds (lightweight live-sync fallback)
      const pollInterval = setInterval(() => {
        loadNotifications(id);
      }, 10000);
      
      return () => clearInterval(pollInterval);
    }
  }, []);

  // Fetch notifications
  const loadNotifications = async (id: string) => {
    const data = await fetchNotificationsForVisitor(id);
    setNotifications(data);
    const unread = data.filter((n) => !n.is_read).length;
    setUnreadCount(unread);
  };

  // Click outside listener to auto-close panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle open panel (no longer auto-marks all read)
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Mark single notification as read
  const handleMarkSingleRead = async (id: string) => {
    const success = await markSingleNotificationRead(id);
    if (success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  // Mark all notifications as read helper
  const handleMarkAllRead = async () => {
    if (enquiryId && unreadCount > 0) {
      await markNotificationsAsRead(enquiryId);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    }
  };

  // Helper to format date nicely
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Do not render anything if the visitor has not onboarded (no enquiry ID)
  if (!enquiryId) return null;

  return (
    <div className="relative pointer-events-auto" ref={panelRef}>
      {/* Bell Icon Trigger */}
      <button
        onClick={handleToggle}
        className="p-2 rounded-full text-white/80 hover:text-brand-gold hover:bg-white/5 transition-all duration-300 relative cursor-pointer focus:outline-none"
        aria-label="Toggle notifications panel"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5 text-brand-gold animate-swing origin-top" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        
        {/* Unread Badge indicator */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 w-4.5 h-4.5 bg-brand-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-brand-navy shadow-sm"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Notifications Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-brand-navy/10 rounded-2xl shadow-2xl overflow-hidden z-50 text-brand-charcoal"
          >
            {/* Header */}
            <div className="bg-brand-navy text-white px-4 py-3 flex justify-between items-center border-b border-white/10">
              <span className="font-heading text-sm font-semibold tracking-wider flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-brand-gold" />
                <span>STUDENT NOTIFICATIONS</span>
              </span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] uppercase font-bold text-brand-gold hover:text-white transition-colors cursor-pointer px-2 py-0.5 border border-brand-gold/20 rounded"
                  >
                    Mark All Read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[320px] overflow-y-auto divide-y divide-brand-navy/5 bg-brand-cream/5">
              {notifications.length === 0 ? (
                <div className="py-12 px-4 flex flex-col items-center justify-center text-center text-brand-muted/70 gap-2">
                  <Inbox className="w-10 h-10 stroke-1 text-brand-navy/20" />
                  <p className="text-xs font-light">You don't have any updates yet.</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 transition-colors text-left relative ${
                      !item.is_read ? "bg-blue-50/70 font-semibold border-l-4 border-brand-navy" : "bg-white"
                    }`}
                  >
                    <h4 className="text-xs sm:text-sm font-bold text-brand-navy pr-4 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-brand-charcoal/80 font-light mt-1.5 leading-relaxed whitespace-pre-line">
                      {item.message}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-1 text-[10px] text-brand-muted/80 font-medium">
                        <Calendar className="w-3 h-3 text-brand-orange" />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                      
                      {!item.is_read && (
                        <button
                          onClick={() => handleMarkSingleRead(item.id)}
                          className="px-2 py-1 bg-brand-navy hover:bg-brand-gold text-white hover:text-brand-navy text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Mark as Read</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="bg-brand-cream/20 px-4 py-2 text-center border-t border-brand-navy/5">
              <span className="text-[10px] uppercase font-bold text-brand-navy/60">
                Edison's Knowledge Hub Guide
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
