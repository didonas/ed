"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, BookOpen, Phone, ChevronRight, RefreshCw, Compass, Users, MapPin, MessageSquare, Award, Sparkles } from "lucide-react";
import Image from "next/image";
import {
  getOnboardingProfile,
  saveOnboardingProfile,
  clearOnboardingProfile,
  getEnquiryId,
  saveEnquiryId,
  clearEnquiryId,
  OnboardingProfile,
} from "@/services/onboardingService";
import {
  submitSupabaseEnquiry,
  updateSupabaseEnquiry,
  fetchEnquiryById,
} from "@/services/supabaseService";

type OnboardingStep = "welcome" | "menu" | 1 | 2 | 3 | 4 | 5 | "complete" | "minimized";

export default function EddieAssistant() {
  const pathname = usePathname();
  const router = useRouter();

  // Onboarding Wizard & Menu States
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("minimized");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [classStudying, setClassStudying] = useState("");
  const [board, setBoard] = useState("");
  const [interest, setInterest] = useState("");

  // "Other" Option custom sub-mode inputs
  const [isClassOther, setIsClassOther] = useState(false);
  const [isBoardOther, setIsBoardOther] = useState(false);
  const [isInterestOther, setIsInterestOther] = useState(false);
  
  const [otherClass, setOtherClass] = useState("");
  const [otherBoard, setOtherBoard] = useState("");
  const [otherInterest, setOtherInterest] = useState("");

  const [hasProfile, setHasProfile] = useState(false);
  const [errors, setErrors] = useState<string>("");
  const [isDismissed, setIsDismissed] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const assistantRef = useRef<HTMLDivElement>(null);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  // Load session dismissal and check for existing onboarding profile from storage and database
  useEffect(() => {
    const dismissed = sessionStorage.getItem("eddie_dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }

    async function checkProfile() {
      const enquiryId = getEnquiryId();
      let profileLoaded = false;

      if (enquiryId) {
        // Fetch latest profile from Supabase to keep in sync
        const dbProfile = await fetchEnquiryById(enquiryId);
        if (dbProfile) {
          setName(dbProfile.name);
          setPhone(dbProfile.phone);
          setClassStudying(dbProfile.class);
          setBoard(dbProfile.board);
          setInterest(dbProfile.interested_course);
          setHasProfile(true);
          profileLoaded = true;
          
          // Update local storage backup
          await saveOnboardingProfile({
            name: dbProfile.name,
            phone: dbProfile.phone,
            classStudying: dbProfile.class,
            board: dbProfile.board,
            interest: dbProfile.interested_course,
          });
        } else {
          // Fallback to local storage if server is unreachable
          const localProfile = await getOnboardingProfile();
          if (localProfile) {
            setName(localProfile.name);
            setPhone(localProfile.phone);
            setClassStudying(localProfile.classStudying);
            setBoard(localProfile.board);
            setInterest(localProfile.interest);
            setHasProfile(true);
            profileLoaded = true;
          }
        }
      } else {
        // Check if an offline local profile exists, and sync it to DB
        const localProfile = await getOnboardingProfile();
        if (localProfile) {
          setName(localProfile.name);
          setPhone(localProfile.phone);
          setClassStudying(localProfile.classStudying);
          setBoard(localProfile.board);
          setInterest(localProfile.interest);
          profileLoaded = true;
          
          const dbData = await submitSupabaseEnquiry({
            name: localProfile.name,
            phone: localProfile.phone,
            classStudying: localProfile.classStudying,
            board: localProfile.board,
            interest: localProfile.interest,
          });
          if (dbData) {
            saveEnquiryId(dbData.id);
            setHasProfile(true);
          }
        }
      }

      // Check if welcome popup should be shown (first visit after 2 seconds)
      const popupShown = localStorage.getItem("eddie_popup_shown");
      if (!popupShown && !profileLoaded) {
        setTimeout(() => {
          setShowWelcomePopup(true);
        }, 2000);
      }
    }
    checkProfile();
  }, []);

  // Eye blinking loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Click outside to close (only on non-form screens to prevent accidental data loss)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        (currentStep === "welcome" || currentStep === "menu" || currentStep === "complete") &&
        assistantRef.current &&
        !assistantRef.current.contains(event.target as Node)
      ) {
        setCurrentStep("minimized");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [currentStep]);

  if (isDismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    sessionStorage.setItem("eddie_dismissed", "true");
  };

  // Form Validations
  const handleNameNext = () => {
    if (!name.trim()) {
      setErrors("Please tell me your name so I can address you!");
      return;
    }
    setErrors("");
    setCurrentStep(2);
  };

  const handlePhoneNext = () => {
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!cleanPhone) {
      setErrors("Mobile number is required.");
      return;
    }
    if (!/^\d{10}$/.test(cleanPhone)) {
      setErrors("Please enter a valid 10-digit number.");
      return;
    }
    setErrors("");
    setCurrentStep(3);
  };

  const handleSelectClass = (val: string) => {
    if (val === "Other") {
      setIsClassOther(true);
    } else {
      setClassStudying(val);
      setCurrentStep(4);
    }
  };

  const handleSelectBoard = (val: string) => {
    if (val === "Other") {
      setIsBoardOther(true);
    } else {
      setBoard(val);
      setCurrentStep(5);
    }
  };

  const handleSelectInterest = async (val: string) => {
    if (val === "Other") {
      setIsInterestOther(true);
      return;
    }

    setInterest(val);
    
    // Construct profile and save it to storage and Supabase
    const profile: OnboardingProfile = {
      name,
      phone,
      classStudying,
      board,
      interest: val,
    };
    
    // Save to localStorage
    await saveOnboardingProfile(profile);
    
    const enquiryId = getEnquiryId();
    if (enquiryId) {
      // Update record in Supabase
      const success = await updateSupabaseEnquiry(enquiryId, profile);
      if (success) {
        setHasProfile(true);
      }
    } else {
      // Insert new record in Supabase
      const dbData = await submitSupabaseEnquiry(profile);
      if (dbData) {
        saveEnquiryId(dbData.id);
        setHasProfile(true);
      }
    }
    
    setCurrentStep("complete");
  };

  const handleSkip = async () => {
    setErrors("");
    const profile: OnboardingProfile = {
      name: name || "Visitor",
      phone: phone || "0000000000",
      classStudying: classStudying || "Not Specified",
      board: board || "Not Specified",
      interest: interest || "Exploring",
    };
    
    await saveOnboardingProfile(profile);
    
    const enquiryId = getEnquiryId();
    if (enquiryId) {
      const success = await updateSupabaseEnquiry(enquiryId, profile);
      if (success) setHasProfile(true);
    } else {
      const dbData = await submitSupabaseEnquiry(profile);
      if (dbData) {
        saveEnquiryId(dbData.id);
        setHasProfile(true);
      }
    }
    
    setCurrentStep("complete");
  };

  // Reopen the onboarding form pre-filled with existing data
  const handleUpdateDetails = () => {
    setIsClassOther(false);
    setIsBoardOther(false);
    setIsInterestOther(false);
    setOtherClass("");
    setOtherBoard("");
    setOtherInterest("");
    setErrors("");
    setCurrentStep(1); // Return to Step 1 (Name)
  };

  // Trigger custom dispatch events or path changes based on context buttons
  const dispatchAction = (actionType: string, detailValue: string, routePath?: string) => {
    setIsOpenState(false);
    
    if (routePath && pathname !== routePath) {
      router.push(routePath);
      // Wait for page transition before dispatching
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(actionType, { detail: detailValue }));
      }, 500);
    } else {
      window.dispatchEvent(new CustomEvent(actionType, { detail: detailValue }));
    }
  };

  // Set local minimized trigger helper
  const setIsOpenState = (open: boolean) => {
    if (open) {
      if (hasProfile) {
        setCurrentStep("menu");
      } else {
        setCurrentStep("welcome");
      }
    } else {
      setCurrentStep("minimized");
    }
  };

  // Determine current mascot pose, text prompt, and scale based on step
  const getStepConfig = () => {
    if (currentStep === "minimized") {
      switch (pathname) {
        case "/about":
          return {
            pose: "/images/eddy/explaining.png",
            msg: "😊 Here's our story and what makes us different.",
          };
        case "/courses":
          return {
            pose: "/images/eddy/pointing_right.png",
            msg: "📚 Not sure which course is right for you? Start here.",
          };
        case "/faculty":
          return {
            pose: "/images/eddy/standing.png",
            msg: "👨‍🏫 Meet the experienced teachers who guide our students.",
          };
        case "/gallery":
          return {
            pose: "/images/eddy/looking_at_user.png",
            msg: "📸 Take a look at our classrooms, events, and student activities.",
          };
        case "/contact":
          return {
            pose: "/images/eddy/pointing_left.png",
            msg: "📞 Have questions? We'd love to hear from you.",
          };
        default:
          return {
            pose: "/images/eddy/waving.png",
            msg: hasProfile
              ? `Welcome back, ${name} 👋`
              : "👋 Welcome! I'm Eddie. Let me help you explore our institution.",
          };
      }
    }

    switch (currentStep) {
      case "menu":
        switch (pathname) {
          case "/courses":
            return {
              pose: "/images/eddy/pointing_right.png",
              msg: "👋 Looking for the right course?",
            };
          case "/gallery":
            return {
              pose: "/images/eddy/looking_at_user.png",
              msg: "📸 Welcome to our gallery.",
            };
          case "/faculty":
            return {
              pose: "/images/eddy/standing.png",
              msg: "👨‍🏫 Need help choosing a mentor?",
            };
          case "/about":
            return {
              pose: "/images/eddy/explaining.png",
              msg: "🏫 Want to know our vision?",
            };
          case "/contact":
            return {
              pose: "/images/eddy/pointing_left.png",
              msg: "📞 Have questions? Get in touch!",
            };
          default:
            return {
              pose: "/images/eddy/waving.png",
              msg: `Welcome back, ${name} 👋`,
            };
        }
      case "welcome":
        return {
          pose: "/images/eddy/waving.png",
          msg: "👋 Hi! I'm Eddie.",
        };
      case 1:
        return {
          pose: "/images/eddy/explaining.png",
          msg: "What's your name?",
        };
      case 2:
        return {
          pose: "/images/eddy/thinking.png",
          msg: "What's your mobile number?",
        };
      case 3:
        return {
          pose: "/images/eddy/sitting.png",
          msg: isClassOther ? "Enter your class" : "Which class are you studying in?",
        };
      case 4:
        return {
          pose: "/images/eddy/reading_book.png",
          msg: isBoardOther ? "Enter your board" : "Which board do you follow?",
        };
      case 5:
        return {
          pose: "/images/eddy/pointing_right.png",
          msg: isInterestOther ? "Enter your course" : "What are you interested in?",
        };
      case "complete":
        return {
          pose: "/images/eddy/celebrating.png",
          msg: `🎉 Thanks, ${name || "friend"}!`,
        };
      default:
        return {
          pose: "/images/eddy/waving.png",
          msg: "",
        };
    }
  };

  const stepConfig = getStepConfig();

  // Progress Bar percentage
  const getProgressPercentage = () => {
    if (currentStep === "menu") return 100;
    if (typeof currentStep === "number") {
      return (currentStep / 5) * 100;
    }
    if (currentStep === "complete") return 100;
    return 0;
  };

  return (
    <>
      {/* 2. Welcome First Visit Modal Popup */}
      <AnimatePresence>
        {showWelcomePopup && (
          <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl border border-brand-navy/10 shadow-2xl p-6 md:p-8 space-y-6 text-center text-brand-charcoal"
            >
              <div className="text-center space-y-3">
                <span className="text-[10px] uppercase font-bold text-brand-gold tracking-widest">
                  Welcome Guide
                </span>
                <h2 className="font-heading text-xl md:text-2xl font-extrabold text-brand-navy leading-tight">
                  👋 Welcome to Edison’s Knowledge Hub
                </h2>
                <div className="h-0.5 w-12 bg-brand-gold mx-auto rounded-full" />
              </div>
              
              <p className="text-sm font-light text-brand-charcoal/90 leading-relaxed">
                Meet Eddie, your learning companion! Click on Eddie at the bottom-left corner and answer a few simple questions so we can recommend the perfect course for you.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    localStorage.setItem("eddie_popup_shown", "true");
                    setShowWelcomePopup(false);
                    setCurrentStep("welcome"); // Automatically open Eddie onboarding
                  }}
                  className="flex-grow py-3 bg-brand-navy hover:bg-brand-navy/90 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Meet Eddie
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem("eddie_popup_shown", "true");
                    setShowWelcomePopup(false);
                  }}
                  className="flex-grow py-3 bg-transparent border border-brand-navy/10 text-brand-navy hover:bg-brand-cream/35 font-medium rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div
        ref={assistantRef}
        className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3 pointer-events-auto"
      >
      {/* 1. Onboarding Wizard & Menu Speech Modal */}
      <AnimatePresence>
        {currentStep !== "minimized" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="w-[340px] sm:w-[400px] bg-white rounded-3xl border border-brand-navy/10 shadow-2xl overflow-hidden flex flex-col max-h-[540px]"
          >
            {/* Header progress bar */}
            <div className="bg-white px-5 pt-5 pb-3 flex flex-col gap-3 border-b border-brand-navy/5">
              <div className="flex justify-between items-center text-xs font-semibold text-brand-muted">
                {/* Back Button */}
                {typeof currentStep === "number" ? (
                  <button
                    onClick={() => {
                      if (currentStep === 3 && isClassOther) {
                        setIsClassOther(false);
                      } else if (currentStep === 4 && isBoardOther) {
                        setIsBoardOther(false);
                      } else if (currentStep === 5 && isInterestOther) {
                        setIsInterestOther(false);
                      } else {
                        setCurrentStep(currentStep === 1 ? "welcome" : ((currentStep - 1) as OnboardingStep));
                      }
                    }}
                    className="flex items-center gap-1 hover:text-brand-navy transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4.5 h-4.5 text-brand-orange" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div className="w-12" />
                )}

                {/* Title */}
                <span>
                  {currentStep === "menu"
                    ? "Assistant Menu"
                    : typeof currentStep === "number"
                    ? `Step ${currentStep} of 5`
                    : "Welcome Guide"}
                </span>

                {/* Skip Link / Close */}
                {typeof currentStep === "number" ? (
                  <button
                    onClick={handleSkip}
                    className="hover:text-brand-orange transition-colors cursor-pointer text-brand-gold"
                  >
                    Skip
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentStep("minimized")}
                    className="text-brand-charcoal hover:text-brand-orange transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                )}
              </div>

              {/* Progress Bar container */}
              <div className="w-full h-2.5 bg-brand-cream rounded-full overflow-hidden border border-brand-gold/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-[#25D366] rounded-full"
                />
              </div>
            </div>

            {/* Mascot layout */}
            <div className="px-5 py-4 bg-brand-cream/15 flex gap-4 items-center border-b border-brand-navy/5">
              <div className="w-16 h-20 relative shrink-0 overflow-hidden flex items-end justify-center">
                <motion.div
                  key={stepConfig.pose}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full h-full relative scale-105 origin-bottom"
                >
                  <Image
                    src={stepConfig.pose}
                    alt="Eddie Mascot"
                    fill
                    sizes="64px"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </div>

              <div className="text-left flex-grow">
                <h4 className="font-heading text-sm font-semibold text-brand-navy">Eddie Says:</h4>
                <p className="text-xs md:text-sm font-light text-brand-charcoal leading-relaxed mt-0.5 animate-pulse">
                  {stepConfig.msg}
                </p>
              </div>
            </div>

            {/* Main Action Content Area */}
            <div className="p-5 flex-grow overflow-y-auto text-left bg-white max-h-[320px]">
              {errors && (
                <div className="mb-4 text-xs font-semibold text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-150">
                  {errors}
                </div>
              )}

              <AnimatePresence mode="wait">
                {currentStep === "welcome" && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <p className="text-sm font-light leading-relaxed text-brand-charcoal">
                      Welcome to <strong>EDISON'S KNOWLEDGE HUB</strong>. I'll ask just a few quick questions to help you explore the right course stream.
                    </p>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="w-full py-3.5 bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-semibold rounded-xl transition-all duration-300 shadow-md text-sm uppercase tracking-wide cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>✨ Let's Get Started</span>
                    </button>
                  </motion.div>
                )}

                {/* 2. Permanent Context-Aware Menu Screen */}
                {currentStep === "menu" && (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {/* Render buttons based on pathname (Context-Aware) */}
                    
                    {/* A. Courses Page Context */}
                    {pathname === "/courses" && (
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => dispatchAction("eddie-courses-filter", "all")}
                          className="w-full py-2.5 px-4 bg-brand-cream/20 hover:bg-brand-cream/50 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-left text-xs sm:text-sm font-semibold text-brand-navy transition-all cursor-pointer flex items-center gap-2.5 shadow-sm"
                        >
                          <BookOpen className="w-4 h-4 text-brand-orange" />
                          <span>📚 View All Courses</span>
                        </button>
                        <button
                          onClick={() => dispatchAction("eddie-courses-filter", "science")}
                          className="w-full py-2.5 px-4 bg-brand-cream/20 hover:bg-brand-cream/50 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-left text-xs sm:text-sm font-semibold text-brand-navy transition-all cursor-pointer flex items-center gap-2.5 shadow-sm"
                        >
                          <Award className="w-4 h-4 text-brand-gold" />
                          <span>🔥 Most Popular Course (Science Integrated)</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsOpenState(false);
                            router.push("/contact");
                          }}
                          className="w-full py-2.5 px-4 bg-brand-cream/20 hover:bg-brand-cream/50 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-left text-xs sm:text-sm font-semibold text-brand-navy transition-all cursor-pointer flex items-center gap-2.5 shadow-sm"
                        >
                          <Phone className="w-4 h-4 text-brand-navy" />
                          <span>📞 Ask About Admissions</span>
                        </button>
                      </div>
                    )}

                    {/* B. Gallery Page Context */}
                    {pathname === "/gallery" && (
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => dispatchAction("eddie-gallery-filter", "activity")}
                          className="w-full py-2.5 px-4 bg-brand-cream/20 hover:bg-brand-cream/50 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-left text-xs sm:text-sm font-semibold text-brand-navy transition-all cursor-pointer flex items-center gap-2.5 shadow-sm"
                        >
                          <Sparkles className="w-4 h-4 text-brand-orange" />
                          <span>🎓 Student Activities</span>
                        </button>
                        <button
                          onClick={() => dispatchAction("eddie-gallery-filter", "classroom")}
                          className="w-full py-2.5 px-4 bg-brand-cream/20 hover:bg-brand-cream/50 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-left text-xs sm:text-sm font-semibold text-brand-navy transition-all cursor-pointer flex items-center gap-2.5 shadow-sm"
                        >
                          <MapPin className="w-4 h-4 text-brand-gold" />
                          <span>🏫 Smart Classrooms Tour</span>
                        </button>
                        <button
                          onClick={() => dispatchAction("eddie-gallery-filter", "lab")}
                          className="w-full py-2.5 px-4 bg-brand-cream/20 hover:bg-brand-cream/50 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-left text-xs sm:text-sm font-semibold text-brand-navy transition-all cursor-pointer flex items-center gap-2.5 shadow-sm"
                        >
                          <BookOpen className="w-4 h-4 text-brand-navy" />
                          <span>🔬 Academic Labs Preview</span>
                        </button>
                      </div>
                    )}

                    {/* C. Faculty Page Context */}
                    {pathname === "/faculty" && (
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => dispatchAction("eddie-faculty-filter", "science")}
                          className="w-full py-2.5 px-4 bg-brand-cream/20 hover:bg-brand-cream/50 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-left text-xs sm:text-sm font-semibold text-brand-navy transition-all cursor-pointer flex items-center gap-2.5 shadow-sm"
                        >
                          <Sparkles className="w-4 h-4 text-brand-orange" />
                          <span>🧪 Science Department Faculty</span>
                        </button>
                        <button
                          onClick={() => dispatchAction("eddie-faculty-filter", "commerce")}
                          className="w-full py-2.5 px-4 bg-brand-cream/20 hover:bg-brand-cream/50 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-left text-xs sm:text-sm font-semibold text-brand-navy transition-all cursor-pointer flex items-center gap-2.5 shadow-sm"
                        >
                          <Award className="w-4 h-4 text-brand-gold" />
                          <span>💼 Commerce Department Faculty</span>
                        </button>
                        <button
                          onClick={() => dispatchAction("eddie-faculty-filter", "humanities")}
                          className="w-full py-2.5 px-4 bg-brand-cream/20 hover:bg-brand-cream/50 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-left text-xs sm:text-sm font-semibold text-brand-navy transition-all cursor-pointer flex items-center gap-2.5 shadow-sm"
                        >
                          <BookOpen className="w-4 h-4 text-brand-navy" />
                          <span>🎨 Humanities & Languages</span>
                        </button>
                      </div>
                    )}

                    {/* D. Default Context Menu (For Home, About, Contact, etc.) */}
                    {pathname !== "/courses" && pathname !== "/gallery" && pathname !== "/faculty" && (
                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                        <button
                          onClick={() => {
                            setIsOpenState(false);
                            router.push("/courses");
                          }}
                          className="flex items-center gap-2.5 px-3 py-2.5 bg-brand-cream/20 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-brand-navy font-semibold transition-all shadow-sm cursor-pointer"
                        >
                          <BookOpen className="w-4 h-4 text-brand-orange" />
                          <span>Explore Courses</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsOpenState(false);
                            router.push("/about");
                          }}
                          className="flex items-center gap-2.5 px-3 py-2.5 bg-brand-cream/20 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-brand-navy font-semibold transition-all shadow-sm cursor-pointer"
                        >
                          <Compass className="w-4 h-4 text-brand-gold" />
                          <span>Our Story</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsOpenState(false);
                            router.push("/faculty");
                          }}
                          className="flex items-center gap-2.5 px-3 py-2.5 bg-brand-cream/20 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-brand-navy font-semibold transition-all shadow-sm cursor-pointer"
                        >
                          <Users className="w-4 h-4 text-brand-orange" />
                          <span>Meet Faculty</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsOpenState(false);
                            router.push("/gallery");
                          }}
                          className="flex items-center gap-2.5 px-3 py-2.5 bg-brand-cream/20 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-brand-navy font-semibold transition-all shadow-sm cursor-pointer"
                        >
                          <Compass className="w-4 h-4 text-brand-navy" />
                          <span>Gallery Tour</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsOpenState(false);
                            router.push("/contact");
                          }}
                          className="flex items-center gap-2.5 px-3 py-2.5 bg-brand-cream/20 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-brand-navy font-semibold transition-all shadow-sm cursor-pointer"
                        >
                          <Phone className="w-4 h-4 text-brand-orange" />
                          <span>Contact Us</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsOpenState(false);
                            router.push("/contact");
                            setTimeout(() => {
                              const mapEl = document.querySelector("iframe");
                              if (mapEl) mapEl.scrollIntoView({ behavior: "smooth" });
                            }, 500);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2.5 bg-brand-cream/20 border border-brand-navy/5 hover:border-brand-gold rounded-xl text-brand-navy font-semibold transition-all shadow-sm cursor-pointer"
                        >
                          <MapPin className="w-4 h-4 text-brand-gold" />
                          <span>Visit Centre</span>
                        </button>
                      </div>
                    )}

                    {/* E. Constant Reset Footer Button */}
                    <div className="pt-3 border-t border-brand-navy/5 flex justify-between items-center gap-4">
                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#25D366] hover:text-[#20ba59] transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                      
                      <button
                        onClick={handleUpdateDetails}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-orange hover:text-brand-navy transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Update My Details</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="eddieName" className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="eddieName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="E.g. Priyanshi Sharma"
                        className="w-full px-4 py-3 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={handleNameNext}
                      className="w-full py-3.5 bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-semibold rounded-xl transition-colors text-sm cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="eddiePhone" className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        id="eddiePhone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit number"
                        className="w-full px-4 py-3 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
                        autoFocus
                      />
                    </div>
                    <button
                      onClick={handlePhoneNext}
                      className="w-full py-3.5 bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy font-semibold rounded-xl transition-colors text-sm cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {!isClassOther ? (
                        <motion.div
                          key="class-grid"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="grid grid-cols-2 gap-2"
                        >
                          {[
                            "Classes 1–5",
                            "Classes 6–8",
                            "Classes 9–10",
                            "Classes 11–12",
                            "College",
                            "Other",
                          ].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleSelectClass(val)}
                              className="py-3 border border-brand-navy/15 hover:border-brand-gold bg-white hover:bg-brand-cream/15 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer text-brand-navy text-center"
                            >
                              {val}
                            </button>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="class-other"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                              Custom Class
                            </label>
                            <input
                              type="text"
                              value={otherClass}
                              onChange={(e) => setOtherClass(e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-4 py-3 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
                              autoFocus
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setIsClassOther(false);
                                setOtherClass("");
                              }}
                              className="w-1/3 py-2.5 border border-brand-navy/10 text-brand-navy hover:bg-brand-cream/30 hover:border-brand-gold font-medium rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                            >
                              Back
                            </button>
                            <button
                              disabled={!otherClass.trim()}
                              onClick={() => {
                                setClassStudying(otherClass.trim());
                                setIsClassOther(false);
                                setCurrentStep(4);
                              }}
                              className="w-2/3 py-2.5 bg-brand-navy text-white disabled:opacity-50 hover:bg-brand-gold hover:text-brand-navy font-semibold rounded-xl transition-colors text-sm cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              Continue
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {!isBoardOther ? (
                        <motion.div
                          key="board-grid"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="grid grid-cols-2 gap-2"
                        >
                          {["CBSE", "State Board", "ICSE", "IGCSE", "Other"].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleSelectBoard(val)}
                              className="py-3 border border-brand-navy/15 hover:border-brand-gold bg-white hover:bg-brand-cream/15 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer text-brand-navy text-center"
                            >
                              {val}
                            </button>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="board-other"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                              Custom Board
                            </label>
                            <input
                              type="text"
                              value={otherBoard}
                              onChange={(e) => setOtherBoard(e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-4 py-3 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
                              autoFocus
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setIsBoardOther(false);
                                setOtherBoard("");
                              }}
                              className="w-1/3 py-2.5 border border-brand-navy/10 text-brand-navy hover:bg-brand-cream/30 hover:border-brand-gold font-medium rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                            >
                              Back
                            </button>
                            <button
                              disabled={!otherBoard.trim()}
                              onClick={() => {
                                setBoard(otherBoard.trim());
                                setIsBoardOther(false);
                                setCurrentStep(5);
                              }}
                              className="w-2/3 py-2.5 bg-brand-navy text-white disabled:opacity-50 hover:bg-brand-gold hover:text-brand-navy font-semibold rounded-xl transition-colors text-sm cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              Continue
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {!isInterestOther ? (
                        <motion.div
                          key="interest-grid"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="grid grid-cols-2 gap-2"
                        >
                          {[
                            "School Tuition",
                            "NEET",
                            "JEE",
                            "Computer Courses",
                            "Spoken English",
                            "Olympiad",
                            "Career Guidance",
                            "Just Exploring",
                            "Other",
                          ].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleSelectInterest(val)}
                              className="py-2.5 border border-brand-navy/15 hover:border-brand-gold bg-white hover:bg-brand-cream/15 text-xs font-semibold rounded-xl transition-all cursor-pointer text-brand-navy text-center"
                            >
                              {val}
                            </button>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="interest-other"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                              Custom Course / Interest
                            </label>
                            <input
                              type="text"
                              value={otherInterest}
                              onChange={(e) => setOtherInterest(e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-4 py-3 border border-brand-navy/15 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-gold bg-brand-cream/5"
                              autoFocus
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setIsInterestOther(false);
                                setOtherInterest("");
                              }}
                              className="w-1/3 py-2.5 border border-brand-navy/10 text-brand-navy hover:bg-brand-cream/30 hover:border-brand-gold font-medium rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
                            >
                              Back
                            </button>
                            <button
                              disabled={!otherInterest.trim()}
                              onClick={() => {
                                handleSelectInterest(otherInterest.trim());
                                setIsInterestOther(false);
                              }}
                              className="w-2/3 py-2.5 bg-brand-navy text-white disabled:opacity-50 hover:bg-brand-gold hover:text-brand-navy font-semibold rounded-xl transition-colors text-sm cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              Continue
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {currentStep === "complete" && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <p className="text-sm font-light leading-relaxed text-brand-charcoal">
                      I'm glad you stopped by, <strong>{name || "friend"}</strong>. Based on your profile, you can now explore the most suitable streams.
                    </p>
                    <button
                      onClick={() => setCurrentStep("menu")}
                      className="w-full py-3 bg-[#25D366] text-white hover:bg-[#20ba59] font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Open Assistant Menu</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Floating Circular Head Avatar Trigger */}
      <AnimatePresence>
        {currentStep === "minimized" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsOpenState(true)}
            className="flex items-center gap-2 group cursor-pointer relative"
          >
            {/* Circle Head-only Mascot (Clean Standalone Avatar) */}
            <div className="w-16 h-16 rounded-full border border-brand-gold bg-brand-navy shadow-lg relative flex items-center justify-center">
              <motion.div
                animate={isBlinking ? { scaleY: [1, 0.1, 1] } : {}}
                transition={{ duration: 0.18 }}
                className="w-12.5 h-12.5 relative"
              >
                <Image
                  src="/images/eddy/avatar_head.png"
                  alt="Eddie Mascot Avatar"
                  fill
                  sizes="50px"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>

            {/* Glowing Active Status Badge */}
            <span className="absolute bottom-0 left-0 w-4 h-4 bg-[#25D366] rounded-full border-2 border-white animate-pulse" />

            {/* Tooltip speech hint */}
            <div className="absolute left-20 bg-brand-navy text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-brand-gold/20 flex flex-col items-start gap-0.5">
              <span className="text-[10px] uppercase font-bold text-brand-gold">Eddie Guide</span>
              <span className="font-light text-brand-cream/90 text-xs">
                {hasProfile ? `Welcome back, ${name}!` : "Let's find your course!"}
              </span>
            </div>

            {/* Direct Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute -top-1 -right-1 w-5.5 h-5.5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white cursor-pointer"
              title="Dismiss Guide"
              aria-label="Dismiss Eddie Guide"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}
