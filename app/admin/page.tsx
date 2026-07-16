"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  fetchAdminEnquiries,
  updateEnquiryStatus,
  editEnquiryDetails,
  deleteEnquiry,
  sendStudentNotification,
  Enquiry,
} from "@/services/supabaseService";
import {
  Search,
  Filter,
  LogOut,
  Users,
  Calendar,
  AlertCircle,
  Edit,
  Trash2,
  Bell,
  CheckCircle,
  ChevronDown,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Data States
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal States
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editClass, setEditClass] = useState("");
  const [editBoard, setEditBoard] = useState("");
  const [editCourse, setEditCourse] = useState("");
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [notifyingEnquiry, setNotifyingEnquiry] = useState<Enquiry | null>(null);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifError, setNotifError] = useState("");
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // 1. Session verification on mount
  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setAuthLoading(false);
      if (data.session?.user) {
        loadDashboardData();
      }
    }
    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadDashboardData();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. Fetch enquiries data
  const loadDashboardData = async () => {
    setLoadingData(true);
    const data = await fetchAdminEnquiries();
    setEnquiries(data);
    setLoadingData(false);
  };

  // 3. Authenticate administrator
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(error.message);
      } else if (data.session) {
        setUser(data.session.user);
        loadDashboardData();
      }
    } catch (err: any) {
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  // 4. Log out administrator
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEnquiries([]);
  };

  // 5. Change Enquiry Status
  const handleStatusChange = async (id: string, newStatus: string) => {
    const success = await updateEnquiryStatus(id, newStatus);
    if (success) {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    }
  };

  // 6. Edit Enquiry Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnquiry) return;
    setEditError("");
    setEditLoading(true);

    if (!editName.trim() || !editPhone.trim() || !editClass.trim() || !editBoard.trim() || !editCourse.trim()) {
      setEditError("All fields are required.");
      setEditLoading(false);
      return;
    }

    const success = await editEnquiryDetails(
      editingEnquiry.id,
      editName.trim(),
      editPhone.trim(),
      editClass.trim(),
      editBoard.trim(),
      editCourse.trim()
    );

    if (success) {
      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === editingEnquiry.id
            ? {
                ...e,
                name: editName.trim(),
                phone: editPhone.trim(),
                class: editClass.trim(),
                board: editBoard.trim(),
                interested_course: editCourse.trim(),
              }
            : e
        )
      );
      setEditingEnquiry(null);
    } else {
      setEditError("Failed to update enquiry. Please try again.");
    }
    setEditLoading(false);
  };

  // 7. Delete Enquiry Submit
  const handleDeleteSubmit = async (id: string) => {
    const success = await deleteEnquiry(id);
    if (success) {
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirmId(null);
    }
  };

  // 8. Open Edit Modal helper
  const openEditModal = (enquiry: Enquiry) => {
    setEditingEnquiry(enquiry);
    setEditName(enquiry.name);
    setEditPhone(enquiry.phone);
    setEditClass(enquiry.class);
    setEditBoard(enquiry.board);
    setEditCourse(enquiry.interested_course);
    setEditError("");
  };

  // 9. Open Notification Modal helper
  const openNotificationModal = (enquiry: Enquiry) => {
    setNotifyingEnquiry(enquiry);
    setNotifTitle("Admission Update");
    setNotifMessage(
      `Hi ${enquiry.name},\n\nThank you for your enquiry. Please visit our centre this Saturday at 10:00 AM for counselling.`
    );
    setNotifError("");
    setNotifSuccess(false);
  };

  // 10. Submit Student Notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyingEnquiry) return;
    setNotifError("");
    setNotifSuccess(false);
    setNotifLoading(true);

    if (!notifTitle.trim() || !notifMessage.trim()) {
      setNotifError("Title and Message cannot be empty.");
      setNotifLoading(false);
      return;
    }

    const success = await sendStudentNotification(
      notifyingEnquiry.id,
      notifTitle.trim(),
      notifMessage.trim()
    );

    if (success) {
      setNotifSuccess(true);
      setTimeout(() => {
        setNotifyingEnquiry(null);
        setNotifSuccess(false);
      }, 1500);
    } else {
      setNotifError("Failed to send notification. Please try again.");
    }
    setNotifLoading(false);
  };

  // 11. Stats Calculations
  const getTotalEnquiriesCount = () => enquiries.length;

  const getTodayEnquiriesCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return enquiries.filter((e) => new Date(e.created_at) >= today).length;
  };

  const getFilteredEnquiries = () => {
    return enquiries.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.phone.includes(searchQuery);

      const matchesClass =
        filterClass === "all" ||
        e.class.toLowerCase() === filterClass.toLowerCase() ||
        (filterClass === "Other" &&
          !["classes 1–5", "classes 6–8", "classes 9–10", "classes 11–12", "college"].includes(
            e.class.toLowerCase()
          ));

      const matchesStatus = filterStatus === "all" || e.status === filterStatus;

      return matchesSearch && matchesClass && matchesStatus;
    });
  };

  const filteredData = getFilteredEnquiries();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-cream/10 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  // A. RENDER LOGIN GATE
  if (!user) {
    return (
      <div className="min-h-screen bg-brand-cream/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-3xl border border-brand-navy/10 shadow-2xl p-8"
        >
          <div className="text-center space-y-3 mb-8">
            <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest">
              Admin Portal
            </span>
            <h1 className="font-heading text-2xl font-extrabold text-brand-navy">
              EDISON'S KNOWLEDGE HUB
            </h1>
            <div className="h-0.5 w-12 bg-brand-gold mx-auto rounded-full" />
            <p className="text-xs text-brand-muted font-light">
              Enter your credentials to manage admission enquiries.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-150 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@edisons.com"
                className="w-full px-4 py-3 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-4 py-3.5 bg-brand-navy hover:bg-brand-navy/90 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? "Authenticating..." : "Admin Log In"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // B. RENDER MAIN DASHBOARD VIEW
  return (
    <div className="min-h-screen bg-brand-cream/5 text-brand-charcoal py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header bar */}
        <div className="bg-brand-navy text-white rounded-3xl px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-brand-gold bg-white/5 flex items-center justify-center overflow-hidden shrink-0 relative">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold tracking-wider leading-tight">
                EDISON'S KNOWLEDGE HUB
              </h1>
              <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest">
                Enquiry Management Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-white/60 font-light hidden md:inline">
              Logged in as: <strong>{user.email}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-white/20 hover:border-brand-orange hover:bg-brand-orange/10 rounded-xl font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm flex items-center gap-4 text-left">
            <div className="p-4 rounded-full bg-brand-navy/5 text-brand-navy">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-brand-muted font-medium uppercase tracking-wider block">
                Total Enquiries
              </span>
              <span className="text-3xl font-extrabold text-brand-navy mt-0.5 block">
                {getTotalEnquiriesCount()}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm flex items-center gap-4 text-left">
            <div className="p-4 rounded-full bg-brand-gold/10 text-brand-gold">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-brand-muted font-medium uppercase tracking-wider block">
                Today's Enquiries
              </span>
              <span className="text-3xl font-extrabold text-brand-navy mt-0.5 block">
                {getTodayEnquiriesCount()}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm flex items-center gap-4 text-left">
            <div className="p-4 rounded-full bg-brand-orange/10 text-brand-orange">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-brand-muted font-medium uppercase tracking-wider block">
                New Actionable
              </span>
              <span className="text-3xl font-extrabold text-brand-navy mt-0.5 block">
                {enquiries.filter((e) => e.status === "New").length}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filters Controls */}
        <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="w-full lg:max-w-md relative flex items-center">
              <Search className="w-4 h-4 text-brand-muted absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name or mobile number..."
                className="w-full pl-11 pr-4 py-3 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-navy uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-brand-gold" />
                <span>Filters:</span>
              </div>

              {/* Class Filter */}
              <div className="relative">
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  className="appearance-none bg-brand-cream/5 border border-brand-navy/15 rounded-xl py-2.5 pl-4 pr-10 text-xs font-bold text-brand-navy uppercase tracking-wider focus:outline-none cursor-pointer"
                >
                  <option value="all">Class: All</option>
                  <option value="Classes 1–5">Classes 1–5</option>
                  <option value="Classes 6–8">Classes 6–8</option>
                  <option value="Classes 9–10">Classes 9–10</option>
                  <option value="Classes 11–12">Classes 11–12</option>
                  <option value="College">College</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3.5 text-brand-navy/60 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none bg-brand-cream/5 border border-brand-navy/15 rounded-xl py-2.5 pl-4 pr-10 text-xs font-bold text-brand-navy uppercase tracking-wider focus:outline-none cursor-pointer"
                >
                  <option value="all">Status: All</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Admitted">Admitted</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3.5 text-brand-navy/60 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl border border-brand-navy/10 shadow-sm overflow-hidden">
          {loadingData ? (
            <div className="py-24 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin" />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-24 text-center text-brand-muted font-light space-y-2">
              <FileSpreadsheet className="w-12 h-12 stroke-1 text-brand-navy/20 mx-auto" />
              <p>No enquiries found matching your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-navy/5 text-[11px] font-bold uppercase tracking-wider text-brand-navy border-b border-brand-navy/10">
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Academic Details</th>
                    <th className="px-6 py-4">Interest</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Submitted Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-navy/5 text-xs sm:text-sm">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-brand-cream/15 transition-colors">
                      <td className="px-6 py-4 font-bold text-brand-navy">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <a href={`tel:${item.phone}`} className="hover:underline hover:text-brand-orange">
                          {item.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4 font-light text-brand-charcoal">
                        <div>Class: <strong className="font-semibold">{item.class}</strong></div>
                        <div className="text-[10px] text-brand-muted/80 mt-0.5">Board: {item.board}</div>
                      </td>
                      <td className="px-6 py-4 text-brand-navy font-semibold">
                        {item.interested_course}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block text-left">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className={`appearance-none font-bold text-[10px] uppercase tracking-wider py-1 pl-3 pr-8 rounded-full cursor-pointer focus:outline-none ${
                              item.status === "New"
                                ? "bg-blue-100 text-blue-800"
                                : item.status === "Contacted"
                                ? "bg-amber-100 text-amber-800"
                                : item.status === "Follow-up"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Admitted">Admitted</option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2.5 top-2 pointer-events-none opacity-60" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[11px] text-brand-muted/85 font-medium">
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Alert Notice Button */}
                          <button
                            onClick={() => openNotificationModal(item)}
                            className="p-2 text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors cursor-pointer"
                            title="Send Notification Alert"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                          
                          {/* Edit Details Button */}
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 text-brand-navy hover:bg-brand-navy/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit Enquiry"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          {deleteConfirmId === item.id ? (
                            <div className="flex items-center gap-1.5 pl-2">
                              <button
                                onClick={() => handleDeleteSubmit(item.id)}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="p-1 hover:bg-brand-navy/10 rounded text-brand-muted cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Enquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* MODAL 1: EDIT ENQUIRY DIALOG */}
      <AnimatePresence>
        {editingEnquiry && (
          <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-brand-navy/10 shadow-2xl overflow-hidden text-left"
            >
              <div className="bg-brand-navy text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-heading font-bold text-sm tracking-wider uppercase">
                  Edit Enquiry Details
                </h3>
                <button
                  onClick={() => setEditingEnquiry(null)}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                {editError && (
                  <div className="p-3 bg-red-50 border border-red-150 text-red-500 rounded-xl text-xs font-semibold">
                    {editError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                      Student Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                      Class / Grade
                    </label>
                    <input
                      type="text"
                      required
                      value={editClass}
                      onChange={(e) => setEditClass(e.target.value)}
                      className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                      Education Board
                    </label>
                    <input
                      type="text"
                      required
                      value={editBoard}
                      onChange={(e) => setEditBoard(e.target.value)}
                      className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                    Interested Course
                  </label>
                  <input
                    type="text"
                    required
                    value={editCourse}
                    onChange={(e) => setEditCourse(e.target.value)}
                    className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-brand-navy/5">
                  <button
                    type="button"
                    onClick={() => setEditingEnquiry(null)}
                    className="px-4 py-2.5 border border-brand-navy/10 text-brand-navy font-semibold rounded-xl text-xs uppercase tracking-wide cursor-pointer hover:bg-brand-cream/25"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-6 py-2.5 bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer disabled:opacity-50"
                  >
                    {editLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: SEND NOTIFICATION DIALOG */}
      <AnimatePresence>
        {notifyingEnquiry && (
          <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-brand-navy/10 shadow-2xl overflow-hidden text-left"
            >
              <div className="bg-brand-navy text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-heading font-bold text-sm tracking-wider uppercase flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-brand-gold animate-bounce" />
                  <span>Send Notification Alert</span>
                </h3>
                <button
                  onClick={() => setNotifyingEnquiry(null)}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendNotification} className="p-6 space-y-4">
                {notifSuccess ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center text-emerald-600 gap-2">
                    <CheckCircle className="w-12 h-12 text-emerald-500 animate-pulse" />
                    <p className="font-bold text-sm">Notification Sent Successfully!</p>
                  </div>
                ) : (
                  <>
                    {notifError && (
                      <div className="p-3 bg-red-50 border border-red-150 text-red-500 rounded-xl text-xs font-semibold">
                        {notifError}
                      </div>
                    )}

                    <div className="text-xs text-brand-charcoal font-light bg-brand-cream/25 p-3.5 rounded-xl border border-brand-navy/5">
                      Target Student: <strong className="font-semibold text-brand-navy">{notifyingEnquiry.name}</strong> ({notifyingEnquiry.phone})
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                        Alert Title
                      </label>
                      <input
                        type="text"
                        required
                        value={notifTitle}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        placeholder="E.g. Admission Update"
                        className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                        Alert Message Body
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={notifMessage}
                        onChange={(e) => setNotifMessage(e.target.value)}
                        className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold font-sans resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-brand-navy/5">
                      <button
                        type="button"
                        onClick={() => setNotifyingEnquiry(null)}
                        className="px-4 py-2.5 border border-brand-navy/10 text-brand-navy font-semibold rounded-xl text-xs uppercase tracking-wide cursor-pointer hover:bg-brand-cream/25"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={notifLoading}
                        className="px-6 py-2.5 bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer disabled:opacity-50"
                      >
                        {notifLoading ? "Sending..." : "Send Notice"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
