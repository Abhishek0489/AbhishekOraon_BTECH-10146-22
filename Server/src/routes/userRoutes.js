import express from 'express';
import {
  updateProfile,
  deleteProfile
} from '../controllers/userController.js';

const router = express.Router();

/**
 * User Routes
 * All routes are protected by authMiddleware (applied in server.js)
 * 
 * PUT    /api/user  - Update user profile (email, full_name, metadata)
 * DELETE /api/user  - Delete user account (requires SUPABASE_SERVICE_ROLE_KEY)
 */

// PUT /api/user - Update user profile
router.put('/', updateProfile);

// DELETE /api/user - Delete user account
router.delete('/', deleteProfile);

export default router;
