import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type VerificationRecord = {
  id: string;
  user_id: string;
  id_type: string;
  verification_score: number;
  verification_date: string;
  status: 'verified' | 'pending' | 'rejected';
  id_front_image: string;
  id_back_image: string;
  selfie_image: string;
  portrait_image: string;
  created_at: string;
  updated_at: string;
}; 