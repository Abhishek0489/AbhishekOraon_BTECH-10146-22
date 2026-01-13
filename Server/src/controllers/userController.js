import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { getAuthenticatedSupabase } from '../utils/getAuthenticatedSupabase.js';

dotenv.config();

/**
 * Get Supabase admin client (uses service role key for admin operations)
 * This is needed for operations that bypass RLS, like deleting users
 */
const getAdminSupabase = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations');
  }

  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

/**
 * Update user profile
 * PUT /api/user
 */
export const updateProfile = async (req, res) => {
  try {
    const { email, full_name, metadata } = req.body;
    const user_id = req.user.id;
    const accessToken = req.accessToken;

    // Create authenticated Supabase client with user's token
    const authenticatedSupabase = getAuthenticatedSupabase(accessToken);

    // Build update object
    const updateData = {};

    // Update email if provided
    if (email !== undefined) {
      if (email.trim() === '') {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Email cannot be empty'
        });
      }
      updateData.email = email.trim();
    }

    // Update user metadata (full_name, etc.)
    if (full_name !== undefined || metadata !== undefined) {
      const currentUser = await authenticatedSupabase.auth.getUser();
      const currentMetadata = currentUser.data.user?.user_metadata || {};

      updateData.data = {
        ...currentMetadata,
        ...(full_name !== undefined && { full_name: full_name.trim() }),
        ...(metadata && typeof metadata === 'object' ? metadata : {})
      };
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'No fields provided to update'
      });
    }

    // Update user profile
    const { data, error } = await authenticatedSupabase.auth.updateUser(updateData);

    if (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to update profile',
        details: error.message
      });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: data.user
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while updating the profile'
    });
  }
};

/**
 * Delete user profile (self-deletion)
 * DELETE /api/user
 * 
 * Note: This requires SUPABASE_SERVICE_ROLE_KEY in .env
 * The service role key bypasses RLS and allows admin operations.
 * 
 * IMPORTANT: Only use the service role key on the server side.
 * Never expose it to the client.
 */
export const deleteProfile = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Check if service role key is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        error: 'Configuration Error',
        message: 'SUPABASE_SERVICE_ROLE_KEY is not configured. Please add it to your .env file.',
        instructions: [
          '1. Go to your Supabase Dashboard',
          '2. Navigate to Settings > API',
          '3. Copy the "service_role" key (NOT the anon key)',
          '4. Add it to your Server/.env file as SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here',
          '5. Restart your server'
        ]
      });
    }

    // Create admin Supabase client (uses service role key)
    const adminSupabase = getAdminSupabase();

    // Delete user using admin API
    const { data, error } = await adminSupabase.auth.admin.deleteUser(user_id);

    if (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to delete user account',
        details: error.message
      });
    }

    return res.status(200).json({
      message: 'User account deleted successfully',
      deleted: true
    });
  } catch (error) {
    console.error('Error in deleteProfile:', error);
    
    // Handle specific error for missing service role key
    if (error.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return res.status(500).json({
        error: 'Configuration Error',
        message: error.message,
        instructions: [
          'Add SUPABASE_SERVICE_ROLE_KEY to your .env file',
          'Get it from: Supabase Dashboard > Settings > API > service_role key'
        ]
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while deleting the profile'
    });
  }
};
