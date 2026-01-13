# Environment Variables Setup

Create a `.env` file in the `Server` directory with the following structure:

```env
# Supabase Configuration
# Your Supabase project URL
# Found in: Supabase Dashboard > Settings > API > Project URL
SUPABASE_URL=your_supabase_project_url_here

# Your Supabase anon/public key (also called "publishable" key)
# Use the ANON key (not service_role) to respect Row Level Security policies
# Found in: Supabase Dashboard > Settings > API > Project API keys > anon public
SUPABASE_KEY=your_supabase_anon_key_here

# Supabase Service Role Key (REQUIRED for user deletion feature)
# ⚠️ SECURITY WARNING: This key bypasses RLS and has admin privileges
# Only use on the server side, NEVER expose to the client
# Found in: Supabase Dashboard > Settings > API > Project API keys > service_role (secret)
# This is optional but required if you want to use the DELETE /api/user endpoint
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Server Configuration
PORT=5000

# Frontend URL (for CORS - required in production)
# For production: https://your-frontend-url.onrender.com
# Leave empty or use '*' for development (allows all origins)
FRONTEND_URL=https://task-manager-frontend-40li.onrender.com
```

## Steps to get your Supabase credentials:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the **Project URL** and paste it as `SUPABASE_URL`
4. Copy the **anon public** key (also called "publishable" key) and paste it as `SUPABASE_KEY`
   - ✅ Use the **anon** key (respects RLS policies)
   - ❌ Do NOT use the **service_role** key here (bypasses RLS - only for admin operations)

5. (Optional but recommended) Copy the **service_role** key and paste it as `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ **SECURITY WARNING**: This key has admin privileges and bypasses RLS
   - **Required** for the user deletion feature (`DELETE /api/user`)
   - **NEVER** expose this key to the client or commit it to version control
   - Only use it on the server side for admin operations

**Important:** 
- Never commit the `.env` file to version control. It should be in your `.gitignore`.
- The `SUPABASE_SERVICE_ROLE_KEY` is optional but required for user account deletion functionality.
