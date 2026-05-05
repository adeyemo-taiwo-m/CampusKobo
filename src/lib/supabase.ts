import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Replace these with your actual Supabase credentials from the dashboard
const SUPABASE_URL = "https://wwjcafcmazffakbdvgkl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WFZIvhzLVjWXIfqBnzxdtA_r7MVHyl1";

const LargeStorage = {
  getItem: async (key: string) => {
    try {
      if (typeof window === 'undefined') return null;
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (typeof window !== 'undefined') {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {}
  },
  removeItem: async (key: string) => {
    try {
      if (typeof window !== 'undefined') {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {}
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: LargeStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
