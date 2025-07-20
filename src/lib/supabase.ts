import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  name: string;
  pin_code: string;
  sports: string[];
  skill_level: 'Beginner' | 'Intermediate' | 'Pro';
  availability: Record<string, string[]>;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user_id: string;
  buddy_id: string;
  sport: string;
  match_score: number;
  created_at: string;
  buddy_profile?: Profile;
}