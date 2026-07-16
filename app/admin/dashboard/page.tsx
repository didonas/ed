"use client";

import React, { useState, useEffect } from "react";
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
  X,
  Phone,
  Eye,
  Menu,
  ChevronRight,
  TrendingUp,
  Inbox,
  ArrowUpDown,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type TabOption = "dashboard" | "enquiries" | "notifications";

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

  // Active view tab state
  const [activeTab, setActiveTab] = useState<TabOption>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [notificationsLog, setNotificationsLog] = useState<NotificationLog[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Controls states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // Desktop calling popup modal state
  const [desktopCallNumber, setDesktopCallNumber] = useState<string | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // 1. Session verification and redirect if unauthenticated
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

  // 2. Fetch database rows
  const loadData = async () => {
    setLoadingData(true);
    const enquiryRows = await fetchAdminEnquiries();
    setEnquiries(enquiryRows);

    // Fetch notifications log by querying directly (joined with enquiries name)
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
      console.error("Error loading notification logs:", err);
    }

    setLoadingData(false);
  };

  // 3. Log out Administrator
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // 4. Change enquiry Status dropdown
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

  // 7. Send counseling Notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyingEnquiry) return;
    setNotifError("");
    setNotifSuccess(false);
    setNotifLoading(true);

    if (!notifTitle.trim() || !notifMessage.trim()) {
      setNotifError("Title and Message body are required.");
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
      // Append to local log list
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

  // 8. Call Trigger details (handles mobile dialer vs desktop popup copy)
  const handleCallStudent = (phoneStr: string) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${phoneStr}`;
    } else {
      setDesktopCallNumber(phoneStr);
      setCopiedNumber(false);
    }
  };

  // Copy phone helper
  const copyPhoneNumber = (phoneStr: string) => {
    navigator.clipboard.writeText(phoneStr);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Helper modals
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

  // 9. Sorting & Filtering calculations
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

  // Pagination bounds
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const paginatedEnquiries = filteredEnquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics counters
  const totalCount = enquiries.length;
  
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

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-brand-cream/10 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream/5 text-brand-charcoal flex flex-col md:flex-row relative">
      
      {/* 1. Dashboard Sidebar (Desktop navigation menu) */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-brand-navy text-white flex flex-col justify-between p-6 z-40 transition-transform duration-300 md:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="space-y-8">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-full border border-brand-gold bg-white/5 flex items-center justify-center overflow-hidden shrink-0 relative p-1.5">
              <Image
                src="/images/logo.png"
                alt="Edison Badge"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold tracking-wider leading-tight">
                EDISON'S HUB
              </h2>
              <span className="text-[9px] uppercase font-bold text-brand-gold tracking-widest block mt-0.5">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-brand-gold text-brand-navy shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab("enquiries");
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
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
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "notifications"
                  ? "bg-brand-gold text-brand-navy shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </button>
          </nav>
        </div>

        {/* Footer actions logout */}
        <div className="border-t border-white/10 pt-4 flex flex-col gap-2 text-xs">
          <div className="text-white/50 px-2 leading-tight">
            Admin: <strong>{user?.email?.split("@")[0]}</strong>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-brand-orange/10 hover:text-brand-orange border border-white/5 transition-all cursor-pointer font-bold uppercase"
          >
            <LogOut className="w-4 h-4 text-brand-orange" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar mobile backdrop overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-brand-navy/30 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main container content */}
      <main className="flex-grow min-h-screen p-4 sm:p-8 flex flex-col gap-6 w-full max-w-7xl mx-auto overflow-hidden">
        
        {/* Mobile Top Bar */}
        <div className="flex md:hidden justify-between items-center bg-brand-navy text-white p-4 rounded-2xl shadow">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-white/5 rounded-xl cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-brand-gold">
            Edison Admin
          </span>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/10 rounded-xl cursor-pointer text-brand-orange"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {loadingData ? (
          <div className="flex-grow flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-brand-navy border-t-brand-gold rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            
            {/* TAB A: OVERVIEW DASHBOARD */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-brand-navy">
                    Dashboard Overview
                  </h1>
                  <p className="text-xs text-brand-muted font-light mt-1 uppercase tracking-wider">
                    Edison's Knowledge Hub admissions analytics
                  </p>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-brand-navy/5 text-brand-navy shrink-0">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-brand-muted font-medium uppercase tracking-wider block">
                        Total enquiries
                      </span>
                      <span className="text-2xl md:text-3xl font-extrabold text-brand-navy mt-0.5 block">
                        {totalCount}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-brand-gold/10 text-brand-gold shrink-0">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-brand-muted font-medium uppercase tracking-wider block">
                        Today's enquiries
                      </span>
                      <span className="text-2xl md:text-3xl font-extrabold text-brand-navy mt-0.5 block">
                        {getTodayCount()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
                    <div className="p-4 rounded-2xl bg-brand-orange/10 text-brand-orange shrink-0">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-brand-muted font-medium uppercase tracking-wider block">
                        Active Conversion Rate
                      </span>
                      <span className="text-2xl md:text-3xl font-extrabold text-brand-navy mt-0.5 block">
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

                {/* Sub grid elements */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Interested Courses Breakdown List */}
                  <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm flex flex-col">
                    <div className="border-b border-brand-navy/5 pb-3 mb-4">
                      <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider">
                        Interested Courses
                      </h3>
                      <span className="text-[10px] text-brand-muted font-light block">
                        Enquiry distribution by curriculum interests
                      </span>
                    </div>
                    <div className="flex-grow space-y-3 max-h-[280px] overflow-y-auto pr-1">
                      {getCourseBreakdown().length === 0 ? (
                        <div className="py-12 text-center text-xs text-brand-muted font-light">
                          No submissions recorded yet.
                        </div>
                      ) : (
                        getCourseBreakdown().map(([course, count], idx) => (
                          <div key={idx} className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-brand-charcoal">{course}</span>
                              <span className="text-brand-navy">{count} enquiries</span>
                            </div>
                            <div className="w-full h-2 bg-brand-cream/45 border border-brand-navy/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-navy rounded-full"
                                style={{ width: `${(count / totalCount) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recent Students List */}
                  <div className="bg-white p-6 rounded-3xl border border-brand-navy/10 shadow-sm flex flex-col">
                    <div className="border-b border-brand-navy/5 pb-3 mb-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-heading text-sm font-bold text-brand-navy uppercase tracking-wider">
                          Recent students
                        </h3>
                        <span className="text-[10px] text-brand-muted font-light block">
                          Last 5 newly submitted entries
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab("enquiries")}
                        className="text-[11px] font-bold text-brand-orange hover:text-brand-navy transition-colors flex items-center gap-0.5"
                      >
                        <span>View All</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex-grow space-y-3">
                      {enquiries.slice(0, 5).length === 0 ? (
                        <div className="py-12 text-center text-xs text-brand-muted font-light">
                          No students records yet.
                        </div>
                      ) : (
                        enquiries.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center p-3 rounded-2xl bg-brand-cream/10 border border-brand-navy/5"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-navy/5 text-brand-navy flex items-center justify-center font-bold text-xs">
                                {item.name[0]}
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
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
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
              </motion.div>
            )}

            {/* TAB B: STUDENT ENQUIRIES LIST VIEW */}
            {activeTab === "enquiries" && (
              <motion.div
                key="enquiries-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-brand-navy">
                    Student Enquiries
                  </h1>
                  <p className="text-xs text-brand-muted font-light mt-1 uppercase tracking-wider">
                    Search, filter, sort, and manage student submissions
                  </p>
                </div>

                {/* Filters, search, sort bar controls */}
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
                        className="w-full pl-11 pr-4 py-2.5 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold placeholder-brand-muted/70"
                      />
                    </div>

                    {/* Filter and Sort controls */}
                    <div className="flex flex-wrap items-center gap-3">
                      
                      {/* Filter Class */}
                      <div className="relative">
                        <select
                          value={filterClass}
                          onChange={(e) => {
                            setFilterClass(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="appearance-none bg-brand-cream/5 border border-brand-navy/15 rounded-xl py-2 pl-4 pr-10 text-xs font-bold text-brand-navy uppercase tracking-wider focus:outline-none cursor-pointer"
                        >
                          <option value="all">Class: All</option>
                          <option value="Classes 1–5">Classes 1–5</option>
                          <option value="Classes 6–8">Classes 6–8</option>
                          <option value="Classes 9–10">Classes 9–10</option>
                          <option value="Classes 11–12">Classes 11–12</option>
                          <option value="College">College</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3 text-brand-navy/60 pointer-events-none" />
                      </div>

                      {/* Filter Status */}
                      <div className="relative">
                        <select
                          value={filterStatus}
                          onChange={(e) => {
                            setFilterStatus(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="appearance-none bg-brand-cream/5 border border-brand-navy/15 rounded-xl py-2 pl-4 pr-10 text-xs font-bold text-brand-navy uppercase tracking-wider focus:outline-none cursor-pointer"
                        >
                          <option value="all">Status: All</option>
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Follow-up">Follow-up</option>
                          <option value="Admitted">Admitted</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3 text-brand-navy/60 pointer-events-none" />
                      </div>

                      {/* Sort Toggle */}
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
                        className={`px-3 py-2 border rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                          sortField === "date"
                            ? "bg-brand-navy/5 text-brand-navy border-brand-navy/20"
                            : "border-brand-navy/10 text-brand-muted hover:border-brand-gold"
                        }`}
                        title="Sort by Date"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
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
                        className={`px-3 py-2 border rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                          sortField === "name"
                            ? "bg-brand-navy/5 text-brand-navy border-brand-navy/20"
                            : "border-brand-navy/10 text-brand-muted hover:border-brand-gold"
                        }`}
                        title="Sort by Name"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        <span>Name ({sortField === "name" ? sortOrder : "A-Z"})</span>
                      </button>

                    </div>
                  </div>
                </div>

                {/* Table list */}
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
                              <p>No student records found.</p>
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
                                  
                                  {/* View Button */}
                                  <button
                                    onClick={() => setViewingEnquiry(item)}
                                    className="p-1.5 text-brand-navy hover:bg-brand-navy/10 rounded-lg transition-colors cursor-pointer"
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Call Button */}
                                  <button
                                    onClick={() => handleCallStudent(item.phone)}
                                    className="p-1.5 text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors cursor-pointer"
                                    title="Call Student"
                                  >
                                    <Phone className="w-4 h-4" />
                                  </button>

                                  {/* Send Notice Button */}
                                  <button
                                    onClick={() => openNotificationModal(item)}
                                    className="p-1.5 text-brand-orange hover:bg-brand-orange/15 rounded-lg transition-colors cursor-pointer"
                                    title="Send Notice"
                                  >
                                    <Bell className="w-4 h-4" />
                                  </button>

                                  {/* Edit Button */}
                                  <button
                                    onClick={() => openEditModal(item)}
                                    className="p-1.5 text-brand-navy hover:bg-brand-navy/10 rounded-lg transition-colors cursor-pointer"
                                    title="Edit details"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>

                                  {/* Delete Button */}
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

                  {/* Pagination controller bar */}
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

            {/* TAB C: NOTIFICATIONS LOG PANEL */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-brand-navy">
                    Sent Notifications Log
                  </h1>
                  <p className="text-xs text-brand-muted font-light mt-1 uppercase tracking-wider">
                    Log registry of counseling notification messages dispatched to students
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-brand-navy/10 shadow-sm overflow-hidden min-h-[420px]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-brand-navy/5 text-[10px] font-bold uppercase tracking-wider text-brand-navy border-b border-brand-navy/10">
                          <th className="px-6 py-4">Student</th>
                          <th className="px-6 py-4">Phone</th>
                          <th className="px-6 py-4">Notification Title</th>
                          <th className="px-6 py-4">Message Body</th>
                          <th className="px-6 py-4">Dispatch Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-navy/5 text-xs sm:text-sm">
                        {notificationsLog.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-24 text-center text-brand-muted font-light">
                              <Inbox className="w-12 h-12 stroke-1 text-brand-navy/20 mx-auto mb-2" />
                              <p>No notices dispatched yet.</p>
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

          </AnimatePresence>
        )}
      </main>

      {/* MODAL 1: VIEW DETAILS MODAL */}
      <AnimatePresence>
        {viewingEnquiry && (
          <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-white rounded-3xl border border-brand-navy/10 shadow-2xl overflow-hidden text-left"
            >
              <div className="bg-brand-navy text-white px-6 py-4 flex justify-between items-center">
                <h3 className="font-heading font-bold text-sm tracking-wider uppercase">
                  Student Profile Sheet
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
                      Class Studying
                    </span>
                    <span className="font-semibold text-brand-charcoal block mt-1">
                      {viewingEnquiry.class}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
                      Education Board
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
                    onClick={() => handleCallStudent(viewingEnquiry.phone)}
                    className="px-4 py-2 bg-brand-navy hover:bg-brand-gold text-white hover:text-brand-navy font-bold rounded-xl text-xs uppercase tracking-wide transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Student</span>
                  </button>
                  <button
                    onClick={() => setViewingEnquiry(null)}
                    className="px-4 py-2 border border-brand-navy/10 text-brand-navy hover:bg-brand-cream/20 font-bold rounded-xl text-xs uppercase tracking-wide transition-all cursor-pointer"
                  >
                    Close Sheet
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
                <span className="text-[10px] font-semibold text-emerald-600 mt-2 block">
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
