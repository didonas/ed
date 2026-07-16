"use client";

export interface OnboardingProfile {
  name: string;
  phone: string;
  classStudying: string;
  board: string;
  interest: string;
}

const STORAGE_KEY = "eddie_onboarding_profile";

/**
 * Retrieves the user's saved onboarding profile from storage.
 * Easily swappable with a fetch() call to a backend API.
 */
export async function getOnboardingProfile(): Promise<OnboardingProfile | null> {
  if (typeof window === "undefined") return null;
  
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return null;
    return JSON.parse(rawData) as OnboardingProfile;
  } catch (error) {
    console.error("Error reading onboarding profile:", error);
    return null;
  }
}

/**
 * Saves the user's onboarding profile.
 * Easily swappable with a POST/PUT fetch() call to a backend API.
 */
export async function saveOnboardingProfile(profile: OnboardingProfile): Promise<boolean> {
  if (typeof window === "undefined") return false;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error("Error saving onboarding profile:", error);
    return false;
  }
}

/**
 * Clears the user's saved onboarding profile (e.g. for reset/update details).
 * Easily swappable with a DELETE fetch() call to a backend API.
 */
export async function clearOnboardingProfile(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing onboarding profile:", error);
    return false;
  }
}

const ENQUIRY_ID_KEY = "eddie_enquiry_id";

export function getEnquiryId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ENQUIRY_ID_KEY);
}

export function saveEnquiryId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ENQUIRY_ID_KEY, id);
}

export function clearEnquiryId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ENQUIRY_ID_KEY);
}

