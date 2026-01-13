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

# Server Configuration (optional)
PORT=3000
```

## Steps to get your Supabase credentials:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the **Project URL** and paste it as `SUPABASE_URL`
4. Copy the **anon public** key (also called "publishable" key) and paste it as `SUPABASE_KEY`
   - ✅ Use the **anon** key (respects RLS policies)
   - ❌ Do NOT use the **service_role** key (bypasses RLS - only for admin operations)

**Important:** Never commit the `.env` file to version control. It should be in your `.gitignore`.
