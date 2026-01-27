import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          created_at: string;
          goals: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
            water: number;
          };
          preferences: {
            theme: 'light' | 'dark' | 'system';
            notifications: boolean;
            units: 'metric' | 'imperial';
            startOfWeek: 0 | 1;
          };
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      meals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          photo_url: string | null;
          category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
          foods: unknown[];
          created_at: string;
          date: string;
        };
        Insert: Omit<Database['public']['Tables']['meals']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['meals']['Insert']>;
      };
      weight_entries: {
        Row: {
          id: string;
          user_id: string;
          weight: number;
          date: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['weight_entries']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['weight_entries']['Insert']>;
      };
    };
  };
}
