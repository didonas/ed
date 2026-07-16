"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  ChevronRight,
  X,
  Phone,
  Eye,
  Menu,
  TrendingUp,
  Inbox,
  ArrowUpDown,
  Copy,
  Check,
  Settings,
  Grid,
  FileText,
  User,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type TabOption = "dashboard" | "enquiries" | "notifications" | "settings";

interface NotificationLog {
  id: string;
  studentName: string;
  phone: string;
  title: string;
  message: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Layout states
  const [activeTab, setActiveTab] = useState<TabOption>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAdminBellOpen, setIsAdminBellOpen] = useState(false);
  const adminBellRef = useRef<HTMLDivElement>(null);

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [notificationsLog, setNotificationsLog] = useState<NotificationLog[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Student enquiries list controls states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Settings states
  const [instName, setInstName] = useState("Edison's Knowledge Hub");
  const [instPhone, setInstPhone] = useState("+91 98765 43210");
  const [instAddress, setInstAddress] = useState("12, Ring Road, Lajpat Nagar IV, New Delhi");
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Modal States
  const [viewingEnquiry, setViewingEnquiry] = useState<Enquiry | null>(null);
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

  // Desktop call popup states
  const [desktopCallNumber, setDesktopCallNumber] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // 1. Session verification on mount
  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/admin/login");
      } else {
        setUser(data.session.user);
        setCheckingAuth(false);
        loadData();
      }
    }
    checkAuth();
  }, [router]);

  // Click outside to close admin bell dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (adminBellRef.current && !adminBellRef.current.contains(event.target as Node)) {
        setIsAdminBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Fetch database rows
  const loadData = async () => {
    setLoadingData(true);
    const enquiryRows = await fetchAdminEnquiries();
    setEnquiries(enquiryRows);

    // Fetch notifications log
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          id,
          title,
          message,
          created_at,
          enquiries (
            name,
            phone
          )
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const log: NotificationLog[] = data.map((item: any) => ({
          id: item.id,
          studentName: item.enquiries?.name || "Unknown Student",
          phone: item.enquiries?.phone || "N/A",
          title: item.title,
          message: item.message,
          created_at: item.created_at,
        }));
        setNotificationsLog(log);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
    setLoadingData(false);
  };

  // 3. Log out Administrator
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // 4. Change status dropdown handler
  const handleStatusChange = async (id: string, newStatus: string) => {
    const success = await updateEnquiryStatus(id, newStatus);
    if (success) {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    }
  };

  // 5. Submit Editing Enquiry details
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
        prev.map((enq) =>
          enq.id === editingEnquiry.id
            ? {
                ...enq,
                name: editName.trim(),
                phone: editPhone.trim(),
                class: editClass.trim(),
                board: editBoard.trim(),
                interested_course: editCourse.trim(),
              }
            : enq
        )
      );
      setEditingEnquiry(null);
    } else {
      setEditError("Failed to update details. Please try again.");
    }
    setEditLoading(false);
  };

  // 6. Delete Enquiry
  const handleDeleteEnquiry = async (id: string) => {
    const success = await deleteEnquiry(id);
    if (success) {
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirmId(null);
    }
  };

  // 7. Send notification alert to student
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
      const newLog: NotificationLog = {
        id: Math.random().toString(),
        studentName: notifyingEnquiry.name,
        phone: notifyingEnquiry.phone,
        title: notifTitle.trim(),
        message: notifMessage.trim(),
        created_at: new Date().toISOString(),
      };
      setNotificationsLog((prev) => [newLog, ...prev]);

      setTimeout(() => {
        setNotifyingEnquiry(null);
        setNotifSuccess(false);
      }, 1500);
    } else {
      setNotifError("Failed to dispatch notification.");
    }
    setNotifLoading(false);
  };

  // 8. Call student handler
  const handleCallStudent = (phoneStr: string) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${phoneStr}`;
    } else {
      setDesktopCallNumber(phoneStr);
      setCopiedNumber(false);
    }
  };

  const copyPhoneNumber = (phoneStr: string) => {
    navigator.clipboard.writeText(phoneStr);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const openEditModal = (enq: Enquiry) => {
    setEditingEnquiry(enq);
    setEditName(enq.name);
    setEditPhone(enq.phone);
    setEditClass(enq.class);
    setEditBoard(enq.board);
    setEditCourse(enq.interested_course);
    setEditError("");
  };

  const openNotificationModal = (enq: Enquiry) => {
    setNotifyingEnquiry(enq);
    setNotifTitle("Admission Update");
    setNotifMessage(
      `Hi ${enq.name},\n\nThank you for your enquiry. Please visit our centre this Saturday at 10:00 AM for counselling.`
    );
    setNotifError("");
    setNotifSuccess(false);
  };

  // 9. Sorting & Filtering
  const filteredEnquiries = enquiries
    .filter((e) => {
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
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics counters
  const totalCount = enquiries.length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === "New").length;
  
  const getTodayCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return enquiries.filter((e) => new Date(e.created_at) >= today).length;
  };

  const getCourseBreakdown = () => {
    const map: { [key: string]: number } = {};
    enquiries.forEach((e) => {
      const c = e.interested_course || "Exploring";
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  // Top header bell click handles redirection to enquiries filtered by 'New'
  const handleBellNotificationClick = () => {
    setFilterStatus("New");
    setActiveTab("enquiries");
    setIsAdminBellOpen(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-brand-cream/10 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream/10 flex flex-col md:flex-row text-brand-charcoal overflow-hidden font-sans">
      
      {/* ==========================================
          LEFT SIDEBAR (Fixed & Full Height)
          ========================================== */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-brand-navy text-white flex flex-col justify-between p-6 z-40 transition-transform duration-300 md:translate-x-0 ${
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="space-y-8">
          {/* Logo brand header */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-full border border-brand-gold bg-white/5 flex items-center justify-center overflow-hidden shrink-0 relative p-1.5">
              <Image
                src="/images/logo.png"
                alt="Logo Badge"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <h2 className="font-heading text-sm font-bold tracking-wider leading-tight">
                EDISON ADMIN
              </h2>
              <span className="text-[9px] uppercase font-bold text-brand-gold tracking-widest block mt-0.5">
                Dashboard Portal
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-brand-gold text-brand-navy shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("enquiries");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "enquiries"
                  ? "bg-brand-gold text-brand-navy shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student Enquiries</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("notifications");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-brand-gold text-brand-navy shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("settings");
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "settings"
                  ? "bg-brand-gold text-brand-navy shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="flex items-center gap-2 px-2 text-xs">
            <div className="w-7 h-7 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center font-bold">
              {user?.email?.[0]?.toUpperCase() || "A"}
            </div>
            <span className="text-white/75 truncate max-w-[150px] font-medium">
              {user?.email}
            </span>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-brand-orange/10 hover:text-brand-orange border border-white/5 transition-all cursor-pointer font-bold uppercase text-xs"
          >
            <LogOut className="w-4 h-4 text-brand-orange" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile drawer backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-brand-navy/35 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* ==========================================
          MAIN AREA: CONTENT WRAPPER
          ========================================== */}
      <div className="flex-grow flex flex-col md:pl-64 min-h-screen">
        
        {/* ==========================================
            TOP HEADER
            ========================================== */}
        <header className="h-16 border-b border-brand-navy/5 bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
          {/* Header left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 hover:bg-brand-cream/45 rounded-xl md:hidden cursor-pointer"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5 text-brand-navy" />
            </button>
            <h1 className="font-heading font-extrabold text-sm sm:text-base tracking-wider text-brand-navy uppercase">
              {activeTab === "dashboard"
                ? "Admissions Dashboard"
                : activeTab === "enquiries"
                ? "Enquiries Manager"
                : activeTab === "notifications"
                ? "Notice Logs"
                : "Portal Settings"}
            </h1>
          </div>

          {/* Header right controls */}
          <div className="flex items-center gap-4">
            
            {/* Admin Notification Bell */}
            <div className="relative" ref={adminBellRef}>
              <button
                onClick={() => setIsAdminBellOpen(!isAdminBellOpen)}
                className="p-2 rounded-full hover:bg-brand-cream/50 transition-colors relative cursor-pointer focus:outline-none"
              >
                <Bell className={`w-5 h-5 text-brand-navy ${newEnquiriesCount > 0 ? "animate-pulse" : ""}`} />
                {newEnquiriesCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-orange text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                    {newEnquiriesCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isAdminBellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-white border border-brand-navy/10 rounded-2xl shadow-xl z-50 overflow-hidden text-left"
                  >
                    <div className="bg-brand-navy text-white px-4 py-2.5 flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                      <span>Admissions Alert</span>
                      <span className="text-[10px] text-brand-gold">{newEnquiriesCount} New</span>
                    </div>
                    <div className="p-3">
                      {newEnquiriesCount === 0 ? (
                        <p className="text-xs text-brand-muted font-light py-4 text-center">
                          No pending new enquiries.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[11px] text-brand-charcoal font-light leading-relaxed">
                            You have <strong>{newEnquiriesCount}</strong> unprocessed student enquiries waiting.
                          </p>
                          <button
                            onClick={handleBellNotificationClick}
                            className="w-full py-2 bg-brand-navy hover:bg-brand-gold text-white hover:text-brand-navy font-bold rounded-lg text-[10px] uppercase tracking-wider transition-colors cursor-pointer text-center"
                          >
                            Process Enquiries
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-2 border-l border-brand-navy/5 pl-4">
              <div className="w-8 h-8 rounded-full bg-brand-navy/5 text-brand-navy flex items-center justify-center font-bold text-xs uppercase shadow-inner border border-brand-navy/10">
                {user?.email?.[0] || "A"}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-brand-navy leading-none">
                  Admin Officer
                </div>
                <span className="text-[9px] text-brand-muted font-light tracking-wide mt-0.5 block">
                  Edison Institution
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* ==========================================
            TAB BODY CONTENT PANELS
            ========================================== */}
        <div className="p-4 sm:p-6 flex-grow overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* PANEL A: DASHBOARD HOMEPAGE */}
            {activeTab === "dashboard" && (
              <motion.div
                key="db-home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                {/* Statistics Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-white p-5 rounded-3xl border border-brand-navy/10 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-brand-navy/5 text-brand-navy rounded-2xl shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider block">
                        Total enquiries
                      </span>
                      <span className="text-xl md:text-2xl font-extrabold text-brand-navy block mt-0.5">
                        {totalCount}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-brand-navy/10 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-2xl shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider block">
                        Today's enquiries
                      </span>
                      <span className="text-xl md:text-2xl font-extrabold text-brand-navy block mt-0.5">
                        {getTodayCount()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-brand-navy/10 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-2xl shrink-0">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider block">
                        Pending Action (New)
                      </span>
                      <span className="text-xl md:text-2xl font-extrabold text-brand-navy block mt-0.5">
                        {newEnquiriesCount}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-brand-navy/10 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider block">
                        Conversion Rate
                      </span>
                      <span className="text-xl md:text-2xl font-extrabold text-brand-navy block mt-0.5">
                        {totalCount > 0
                          ? Math.round(
                              (enquiries.filter((e) => e.status === "Admitted").length / totalCount) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>

                </div>

                {/* Second Row: Charts & Logs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Interested Courses Charts list */}
                  <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm flex flex-col justify-between min-h-[340px]">
                    <div className="border-b border-brand-navy/5 pb-3 mb-4">
                      <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-brand-gold" />
                        <span>Interested Courses distribution</span>
                      </h3>
                      <span className="text-[10px] text-brand-muted font-light mt-0.5 block">
                        Visualizing active course curriculum registrations
                      </span>
                    </div>
                    
                    <div className="flex-grow space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
                      {getCourseBreakdown().length === 0 ? (
                        <div className="py-12 text-center text-xs text-brand-muted font-light">
                          No student submissions registered.
                        </div>
                      ) : (
                        getCourseBreakdown().map(([course, count], idx) => (
                          <div key={idx} className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-brand-charcoal">{course}</span>
                              <span className="text-brand-navy">{count} enquiries</span>
                            </div>
                            <div className="w-full h-2 bg-brand-cream/55 border border-brand-navy/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / totalCount) * 100}%` }}
                                transition={{ duration: 0.5, delay: idx * 0.08 }}
                                className="h-full bg-brand-navy rounded-full"
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recent student entries */}
                  <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm flex flex-col justify-between min-h-[340px]">
                    <div className="border-b border-brand-navy/5 pb-3 mb-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider">
                          Recent Enquiries
                        </h3>
                        <span className="text-[10px] text-brand-muted font-light mt-0.5 block">
                          Last 5 admissions submissions
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab("enquiries")}
                        className="text-[10px] uppercase font-extrabold text-brand-orange hover:text-brand-navy transition-colors cursor-pointer flex items-center gap-0.5"
                      >
                        <span>View Table</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex-grow space-y-2.5">
                      {enquiries.slice(0, 5).length === 0 ? (
                        <div className="py-12 text-center text-xs text-brand-muted font-light">
                          No enquiries registered.
                        </div>
                      ) : (
                        enquiries.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center p-3 rounded-2xl bg-brand-cream/10 border border-brand-navy/5"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-navy/5 border border-brand-navy/10 text-brand-navy flex items-center justify-center font-bold text-xs">
                                {item.name[0]?.toUpperCase()}
                              </div>
                              <div className="text-left">
                                <h4 className="text-xs sm:text-sm font-bold text-brand-navy">
                                  {item.name}
                                </h4>
                                <span className="text-[10px] text-brand-muted font-light">
                                  Class {item.class} • {item.interested_course}
                                </span>
                              </div>
                            </div>
                            <span className={`text-[8.5px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              item.status === "New"
                                ? "bg-blue-100 text-blue-800"
                                : item.status === "Contacted"
                                ? "bg-amber-100 text-amber-800"
                                : item.status === "Follow-up"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* Third Row: Recent Sent Notifications logs */}
                <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm">
                  <div className="border-b border-brand-navy/5 pb-3 mb-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider">
                        Recent Notifications
                      </h3>
                      <span className="text-[10px] text-brand-muted font-light mt-0.5 block">
                        Last 5 counselor alerts sent out
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab("notifications")}
                      className="text-[10px] uppercase font-extrabold text-brand-orange hover:text-brand-navy transition-colors cursor-pointer"
                    >
                      View Logs
                    </button>
                  </div>

                  <div className="space-y-3">
                    {notificationsLog.slice(0, 5).length === 0 ? (
                      <div className="py-12 text-center text-xs text-brand-muted font-light">
                        No notices sent yet.
                      </div>
                    ) : (
                      notificationsLog.slice(0, 5).map((log) => (
                        <div
                          key={log.id}
                          className="p-3.5 rounded-2xl bg-brand-cream/5 border border-brand-navy/5 flex justify-between items-start text-xs text-left"
                        >
                          <div className="space-y-1">
                            <span className="text-[9px] uppercase font-bold text-brand-gold tracking-wide">
                              To: {log.studentName} ({log.phone})
                            </span>
                            <h4 className="font-semibold text-brand-navy">{log.title}</h4>
                            <p className="text-brand-charcoal font-light leading-relaxed whitespace-pre-line mt-1 max-w-xl">
                              {log.message}
                            </p>
                          </div>
                          <span className="text-[9px] text-brand-muted/80 font-medium whitespace-nowrap">
                            {new Date(log.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </motion.div>
            )}

            {/* PANEL B: STUDENT ENQUIRIES TABLE */}
            {activeTab === "enquiries" && (
              <motion.div
                key="enquiries-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                {/* Search query, filters, sorts */}
                <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm space-y-4">
                  <div className="flex flex-col lg:flex-row gap-4 justify-between">
                    
                    {/* Search query */}
                    <div className="w-full lg:max-w-md relative flex items-center">
                      <Search className="w-4 h-4 text-brand-muted absolute left-4" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search student name or phone number..."
                        className="w-full pl-11 pr-4 py-2.5 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold placeholder-brand-muted/70 bg-brand-cream/5"
                      />
                    </div>

                    {/* Filter class, status, sorting */}
                    <div className="flex flex-wrap items-center gap-3">
                      
                      {/* Filter Class */}
                      <div className="relative">
                        <select
                          value={filterClass}
                          onChange={(e) => {
                            setFilterClass(e.target.value);
                            setCurrentPage(1);
                          }}
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

                      {/* Filter Status */}
                      <div className="relative">
                        <select
                          value={filterStatus}
                          onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                          }}
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

                      {/* Sort toggles */}
                      <button
                        onClick={() => {
                          if (sortField === "date") {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          } else {
                            setSortField("date");
                            setSortOrder("desc");
                          }
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-2.5 border rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                          sortField === "date"
                            ? "bg-brand-navy/5 text-brand-navy border-brand-navy/20"
                            : "border-brand-navy/10 text-brand-muted hover:border-brand-gold bg-white"
                        }`}
                      >
                        <ArrowUpDown className="w-3.5 h-3.5 text-brand-gold" />
                        <span>Date ({sortField === "date" ? sortOrder : "desc"})</span>
                      </button>

                      <button
                        onClick={() => {
                          if (sortField === "name") {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          } else {
                            setSortField("name");
                            setSortOrder("asc");
                          }
                          setCurrentPage(1);
                        }}
                        className={`px-3 py-2.5 border rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                          sortField === "name"
                            ? "bg-brand-navy/5 text-brand-navy border-brand-navy/20"
                            : "border-brand-navy/10 text-brand-muted hover:border-brand-gold bg-white"
                        }`}
                      >
                        <ArrowUpDown className="w-3.5 h-3.5 text-brand-gold" />
                        <span>Name ({sortField === "name" ? sortOrder : "A-Z"})</span>
                      </button>

                    </div>
                  </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-3xl border border-brand-navy/10 shadow-sm overflow-hidden flex flex-col justify-between min-h-[420px]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-brand-navy/5 text-[10px] font-bold uppercase tracking-wider text-brand-navy border-b border-brand-navy/10">
                          <th className="px-6 py-4">Student Name</th>
                          <th className="px-6 py-4">Phone Number</th>
                          <th className="px-6 py-4">Class</th>
                          <th className="px-6 py-4">Board</th>
                          <th className="px-6 py-4">Interested Course</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Submission Time</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-navy/5 text-xs sm:text-sm">
                        {paginatedEnquiries.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-24 text-center text-brand-muted font-light">
                              <Inbox className="w-12 h-12 stroke-1 text-brand-navy/20 mx-auto mb-2" />
                              <p>No student records found matching details.</p>
                            </td>
                          </tr>
                        ) : (
                          paginatedEnquiries.map((item) => (
                            <tr key={item.id} className="hover:bg-brand-cream/15 transition-colors">
                              <td className="px-6 py-4 font-bold text-brand-navy">
                                {item.name}
                              </td>
                              <td className="px-6 py-4 font-medium text-brand-charcoal">
                                {item.phone}
                              </td>
                              <td className="px-6 py-4 font-light">
                                {item.class}
                              </td>
                              <td className="px-6 py-4 font-light text-brand-muted/80">
                                {item.board}
                              </td>
                              <td className="px-6 py-4 text-brand-navy font-semibold">
                                {item.interested_course}
                              </td>
                              <td className="px-6 py-4">
                                <div className="relative inline-block text-left">
                                  <select
                                    value={item.status}
                                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                    className={`appearance-none font-bold text-[9px] uppercase tracking-wider py-1 pl-3 pr-8 rounded-full cursor-pointer focus:outline-none ${
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
                                {new Date(item.created_at).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  
                                  {/* View Details Sheet */}
                                  <button
                                    onClick={() => setViewingEnquiry(item)}
                                    className="p-1.5 text-brand-navy hover:bg-brand-navy/10 rounded-lg transition-colors cursor-pointer"
                                    title="View Sheet"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Call action */}
                                  <button
                                    onClick={() => handleCallStudent(item.phone)}
                                    className="p-1.5 text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors cursor-pointer"
                                    title="Call Student"
                                  >
                                    <Phone className="w-4 h-4" />
                                  </button>

                                  {/* Alert notices */}
                                  <button
                                    onClick={() => openNotificationModal(item)}
                                    className="p-1.5 text-brand-orange hover:bg-brand-orange/15 rounded-lg transition-colors cursor-pointer"
                                    title="Send Notice"
                                  >
                                    <Bell className="w-4 h-4" />
                                  </button>

                                  {/* Edit Details */}
                                  <button
                                    onClick={() => openEditModal(item)}
                                    className="p-1.5 text-brand-navy hover:bg-brand-navy/10 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Profile"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>

                                  {/* Delete confirmation */}
                                  {deleteConfirmId === item.id ? (
                                    <div className="flex items-center gap-1 pl-2">
                                      <button
                                        onClick={() => handleDeleteEnquiry(item.id)}
                                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="p-1 text-brand-muted hover:bg-brand-navy/10 rounded cursor-pointer"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setDeleteConfirmId(item.id)}
                                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}

                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination bar */}
                  {totalPages > 1 && (
                    <div className="border-t border-brand-navy/5 bg-brand-cream/5 px-6 py-4 flex justify-between items-center text-xs">
                      <span className="text-brand-muted font-medium">
                        Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredEnquiries.length} total)
                      </span>
                      <div className="flex gap-2">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className="px-3.5 py-1.5 border border-brand-navy/10 rounded-xl hover:border-brand-gold bg-white hover:bg-brand-cream/15 font-bold uppercase transition-all disabled:opacity-40 cursor-pointer"
                        >
                          Prev
                        </button>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className="px-3.5 py-1.5 border border-brand-navy/10 rounded-xl hover:border-brand-gold bg-white hover:bg-brand-cream/15 font-bold uppercase transition-all disabled:opacity-40 cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            )}

            {/* PANEL C: NOTIFICATIONS SENT LOG */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider">
                    Dispatched alerts logs
                  </h3>
                  <span className="text-[10px] text-brand-muted font-light mt-0.5 block">
                    Full registry listing of counseling notifications sent to students
                  </span>
                </div>

                <div className="bg-white rounded-3xl border border-brand-navy/10 shadow-sm overflow-hidden min-h-[420px]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-brand-navy/5 text-[10px] font-bold uppercase tracking-wider text-brand-navy border-b border-brand-navy/10">
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Phone</th>
                          <th className="px-6 py-4">Notification Title</th>
                          <th className="px-6 py-4">Alert Message Body</th>
                          <th className="px-6 py-4">Dispatch Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-navy/5 text-xs sm:text-sm">
                        {notificationsLog.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-24 text-center text-brand-muted font-light">
                              <Inbox className="w-12 h-12 stroke-1 text-brand-navy/20 mx-auto mb-2" />
                              <p>No counseling alerts dispatched yet.</p>
                            </td>
                          </tr>
                        ) : (
                          notificationsLog.map((log) => (
                            <tr key={log.id} className="hover:bg-brand-cream/15 transition-colors">
                              <td className="px-6 py-4 font-bold text-brand-navy">
                                {log.studentName}
                              </td>
                              <td className="px-6 py-4 font-medium text-brand-charcoal">
                                {log.phone}
                              </td>
                              <td className="px-6 py-4 font-semibold text-brand-orange">
                                {log.title}
                              </td>
                              <td className="px-6 py-4 font-light text-brand-charcoal whitespace-pre-line max-w-sm">
                                {log.message}
                              </td>
                              <td className="px-6 py-4 text-[11px] text-brand-muted/80 font-medium">
                                {new Date(log.created_at).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PANEL D: PORTAL SETTINGS */}
            {activeTab === "settings" && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="max-w-2xl text-left space-y-6"
              >
                <div>
                  <h3 className="font-heading text-lg font-bold text-brand-navy uppercase tracking-wider">
                    Institution Portal Settings
                  </h3>
                  <span className="text-[10px] text-brand-muted font-light block">
                    Manage dashboard info and system defaults
                  </span>
                </div>

                <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm space-y-5">
                  {settingsSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Settings updated successfully!</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      required
                      value={instName}
                      onChange={(e) => setInstName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                      Admissions Desk Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={instPhone}
                      onChange={(e) => setInstPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-navy">
                      Main Centre Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={instAddress}
                      onChange={(e) => setInstAddress(e.target.value)}
                      className="w-full px-4 py-2.5 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5 resize-none"
                    />
                  </div>

                  <div className="pt-2 border-t border-brand-navy/5 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-brand-navy hover:bg-brand-gold text-white hover:text-brand-navy font-bold rounded-xl text-xs uppercase tracking-wide transition-colors cursor-pointer"
                    >
                      Save Settings
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* ==========================================
          MODALS OVERLAYS
          ========================================== */}

      {/* MODAL 1: VIEW DETAILS MODAL */}
      <AnimatePresence>
        {viewingEnquiry && (
          <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-white rounded-3xl border border-brand-navy/10 shadow-2xl overflow-hidden text-left relative"
            >
              <div className="bg-brand-navy text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-heading font-bold text-sm tracking-wider uppercase flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-gold" />
                  <span>Student Profile Details</span>
                </h3>
                <button
                  onClick={() => setViewingEnquiry(null)}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-4 border-b border-brand-navy/5 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
                      Full Name
                    </span>
                    <span className="font-extrabold text-brand-navy block mt-1">
                      {viewingEnquiry.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
                      Phone Number
                    </span>
                    <span className="font-bold text-brand-charcoal block mt-1">
                      {viewingEnquiry.phone}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-brand-navy/5 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
                      Class / Grade
                    </span>
                    <span className="font-semibold text-brand-charcoal block mt-1">
                      {viewingEnquiry.class}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
                      Board
                    </span>
                    <span className="font-semibold text-brand-charcoal block mt-1">
                      {viewingEnquiry.board}
                    </span>
                  </div>
                </div>

                <div className="border-b border-brand-navy/5 pb-4">
                  <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
                    Interested Course
                  </span>
                  <span className="font-extrabold text-brand-navy block mt-1 text-base">
                    {viewingEnquiry.interested_course}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
                      Submission Date
                    </span>
                    <span className="font-medium text-brand-muted block mt-1">
                      {new Date(viewingEnquiry.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
                      Status Badge
                    </span>
                    <span className={`inline-block mt-1 font-bold text-[9px] uppercase tracking-wider px-3 py-0.5 rounded-full ${
                      viewingEnquiry.status === "New"
                        ? "bg-blue-100 text-blue-800"
                        : viewingEnquiry.status === "Contacted"
                        ? "bg-amber-100 text-amber-800"
                        : viewingEnquiry.status === "Follow-up"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {viewingEnquiry.status}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-navy/5 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      handleCallStudent(viewingEnquiry.phone);
                      setViewingEnquiry(null);
                    }}
                    className="px-4 py-2 bg-brand-navy hover:bg-brand-gold text-white hover:text-brand-navy font-bold rounded-xl text-xs uppercase tracking-wide transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Student</span>
                  </button>
                  <button
                    onClick={() => setViewingEnquiry(null)}
                    className="px-4 py-2 border border-brand-navy/10 text-brand-navy hover:bg-brand-cream/20 font-bold rounded-xl text-xs uppercase tracking-wide transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: EDIT DETAILS MODAL */}
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
                  Edit Student Details
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
                      className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
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
                      className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
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
                      className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
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
                      className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
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
                    className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
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

      {/* MODAL 3: SEND COUNSELLING NOTICE */}
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
                        className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
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
                        className="w-full px-3 py-2.5 border border-brand-navy/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5 font-sans resize-none"
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
                        className="px-6 py-2.5 bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-bold rounded-xl text-xs uppercase tracking-wide cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Send Notice</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: DESKTOP CALL WARNING DIALOG */}
      <AnimatePresence>
        {desktopCallNumber && (
          <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-3xl border border-brand-navy/10 shadow-2xl p-6 text-center text-brand-charcoal"
            >
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center mx-auto mb-4 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              
              <h3 className="font-heading font-extrabold text-lg text-brand-navy leading-tight">
                Call Student
              </h3>
              <p className="text-xs text-brand-muted font-light mt-1.5">
                Calling is only available on mobile devices.
              </p>

              <div className="mt-5 p-4 bg-brand-cream/15 border border-brand-navy/5 rounded-2xl flex justify-between items-center gap-3">
                <span className="font-mono text-base font-bold text-brand-navy">
                  {desktopCallNumber}
                </span>
                
                <button
                  onClick={() => copyPhoneNumber(desktopCallNumber)}
                  className="p-2 border border-brand-navy/10 hover:border-brand-gold bg-white hover:bg-brand-cream/15 text-brand-navy rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Copy Number"
                >
                  {copiedNumber ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {copiedNumber && (
                <span className="text-[10px] font-semibold text-emerald-600 mt-2 block animate-pulse">
                  Number copied to clipboard!
                </span>
              )}

              <button
                onClick={() => setDesktopCallNumber(null)}
                className="w-full mt-6 py-2.5 border border-brand-navy/10 text-brand-navy hover:bg-brand-cream/35 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Close Dialog
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
