import { createClient } from "@supabase/supabase-js";

// Retrieve Supabase credentials with safety fallback values to prevent build crashes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project-id.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
