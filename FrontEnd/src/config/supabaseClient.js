import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These should be set as environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Supabase URL and Anon Key must be set in environment variables');
  console.error('Create a .env file in the FrontEnd folder with:');
  console.error('VITE_SUPABASE_URL=your_url_here');
  console.error('VITE_SUPABASE_ANON_KEY=your_key_here');
}

// Create Supabase client (use placeholder values if not set to prevent errors)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
