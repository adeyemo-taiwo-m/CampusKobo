import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Replace these with your actual Supabase credentials from the dashboard
const SUPABASE_URL = "https://wwjcafcmazffakbdvgkl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WFZIvhzLVjWXIfqBnzxdtA_r7MVHyl1";

// Safe storage for environments like expo export / SSR
const getStorage = () => {
  if (typeof window === 'undefined') {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }
  return require("@react-native-async-storage/async-storage").default;
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: getStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
