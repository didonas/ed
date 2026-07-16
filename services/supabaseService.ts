import { supabase } from "@/lib/supabaseClient";

export interface OnboardingProfile {
  name: string;
  phone: string;
  classStudying: string;
  board: string;
  interest: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  class: string;
  board: string;
  interested_course: string;
  status: string;
  created_at: string;
}

export interface Notification {
  id: string;
  enquiry_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ==========================================
// 1. VISITOR / STUDENT PUBLIC DATA ACCESS
// ==========================================

/**
 * Submits a new student enquiry to Supabase.
 */
export async function submitSupabaseEnquiry(profile: OnboardingProfile): Promise<Enquiry | null> {
  try {
    const { data, error } = await supabase
      .from("enquiries")
      .insert([
        {
          name: profile.name,
          phone: profile.phone,
          class: profile.classStudying,
          board: profile.board,
          interested_course: profile.interest,
          status: "New",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting enquiry in Supabase:", error.message);
      return null;
    }
    return data as Enquiry;
  } catch (error) {
    console.error("Supabase submitEnquiry exception:", error);
    return null;
  }
}

/**
 * Updates an existing student enquiry in Supabase.
 */
export async function updateSupabaseEnquiry(id: string, profile: OnboardingProfile): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("enquiries")
      .update({
        name: profile.name,
        phone: profile.phone,
        class: profile.classStudying,
        board: profile.board,
        interested_course: profile.interest,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating enquiry in Supabase:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Supabase updateEnquiry exception:", error);
    return false;
  }
}

/**
 * Fetches a single student enquiry by its secure UUID using an RPC to respect RLS.
 */
export async function fetchEnquiryById(id: string): Promise<Enquiry | null> {
  try {
    const { data, error } = await supabase.rpc("get_my_enquiry", { enquiry_uuid: id });
    if (error) {
      console.error("Error fetching enquiry by ID:", error.message);
      return null;
    }
    if (Array.isArray(data) && data.length > 0) {
      return data[0] as Enquiry;
    }
    return null;
  } catch (error) {
    console.error("Supabase fetchEnquiryById exception:", error);
    return null;
  }
}

/**
 * Fetches notifications matching a student's enquiry UUID from localStorage via secure RPC.
 */
export async function fetchNotificationsForVisitor(enquiryId: string): Promise<Notification[]> {
  try {
    const { data, error } = await supabase.rpc("get_my_notifications", { enquiry_uuid: enquiryId });
    if (error) {
      console.error("Error fetching notifications:", error.message);
      return [];
    }
    return (data || []) as Notification[];
  } catch (error) {
    console.error("Supabase fetchNotifications exception:", error);
    return [];
  }
}

/**
 * Marks all notifications matching the student's ID as read.
 */
export async function markNotificationsAsRead(enquiryId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc("mark_notifications_read", { enquiry_uuid: enquiryId });
    if (error) {
      console.error("Error marking notifications as read:", error.message);
    }
  } catch (error) {
    console.error("Supabase markNotificationsAsRead exception:", error);
  }
}

/**
 * Marks a single notification as read by its unique ID.
 */
export async function markSingleNotificationRead(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking single notification read:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Supabase markSingleNotificationRead exception:", error);
    return false;
  }
}

// ==========================================
// 2. ADMIN SECURE DASHBOARD DATA ACCESS
// ==========================================

/**
 * Fetches all enquiries for the administrator view.
 */
export async function fetchAdminEnquiries(): Promise<Enquiry[]> {
  try {
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading admin enquiries:", error.message);
      return [];
    }
    return (data || []) as Enquiry[];
  } catch (error) {
    console.error("Supabase fetchAdminEnquiries exception:", error);
    return [];
  }
}

/**
 * Updates an enquiry's follow-up status.
 */
export async function updateEnquiryStatus(id: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("enquiries")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating enquiry status:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Supabase updateEnquiryStatus exception:", error);
    return false;
  }
}

/**
 * Edits details of a specific enquiry.
 */
export async function editEnquiryDetails(
  id: string,
  name: string,
  phone: string,
  className: string,
  boardName: string,
  courseName: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("enquiries")
      .update({
        name,
        phone,
        class: className,
        board: boardName,
        interested_course: courseName,
      })
      .eq("id", id);

    if (error) {
      console.error("Error editing enquiry details:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Supabase editEnquiryDetails exception:", error);
    return false;
  }
}

/**
 * Deletes an enquiry.
 */
export async function deleteEnquiry(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) {
      console.error("Error deleting enquiry:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Supabase deleteEnquiry exception:", error);
    return false;
  }
}

/**
 * Sends a custom notification notice to a specific student enquiry.
 */
export async function sendStudentNotification(
  enquiryId: string,
  title: string,
  message: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from("notifications").insert([
      {
        enquiry_id: enquiryId,
        title,
        message,
        is_read: false,
      },
    ]);

    if (error) {
      console.error("Error inserting notification:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Supabase sendStudentNotification exception:", error);
    return false;
  }
}
