import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export const supabase = createClient(
  environment.apiUrl,
  environment.publicAnonKey,
  {
    auth: {
      storage: {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
        removeItem: (key) => localStorage.removeItem(key)
      },
      autoRefreshToken: false,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
);