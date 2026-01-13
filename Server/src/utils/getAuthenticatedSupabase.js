import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Creates an authenticated Supabase client for a specific user
 * This is necessary for RLS (Row Level Security) policies to work correctly
 * @param {string} accessToken - The user's Supabase access token
 * @returns {object} Authenticated Supabase client
 */
export const getAuthenticatedSupabase = (accessToken) => {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    }
  );
};
