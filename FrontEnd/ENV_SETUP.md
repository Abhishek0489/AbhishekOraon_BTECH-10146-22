# Frontend Environment Variables Setup

Create a `.env` file in the `FrontEnd` directory with the following structure:

```env
# Supabase Configuration
# Your Supabase project URL
# Found in: Supabase Dashboard > Settings > API > Project URL
VITE_SUPABASE_URL=your_supabase_project_url_here

# Your Supabase anon/public key
# Found in: Supabase Dashboard > Settings > API > Project API keys > anon public
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Steps to get your Supabase credentials:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the **Project URL** and paste it as `VITE_SUPABASE_URL`
4. Copy the **anon public** key and paste it as `VITE_SUPABASE_ANON_KEY`

## Important Notes:

- **VITE_** prefix is required for Vite to expose these variables to the client-side code
- Never commit the `.env` file to version control
- The backend API is configured to run on `http://localhost:5000` (update in `src/services/api.js` if your backend runs on a different port)
