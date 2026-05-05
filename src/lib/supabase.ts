import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Replace these with your actual Supabase credentials from the dashboard
const SUPABASE_URL = "https://wwjcafcmazffakbdvgkl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WFZIvhzLVjWXIfqBnzxdtA_r7MVHyl1";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
