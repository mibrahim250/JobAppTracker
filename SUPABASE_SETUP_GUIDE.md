# Supabase Authentication Setup Guide

## Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy your **Project URL** and **anon public** key

## Step 2: Configure Environment Variables

Create a `.env` file in the `frontend` directory with your credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Configure Supabase Authentication

1. In your Supabase Dashboard, go to **Authentication** → **Settings**
2. Under **Email Auth**, make sure it's enabled
3. Configure email templates if desired
4. Set up redirect URLs if needed

## Step 4: Test the Authentication

1. Start your development server: `npm start`
2. Try signing up with a real email address
3. Check your email for confirmation (if enabled)
4. Sign in with your credentials
5. Check the **Authentication** → **Users** section in Supabase to see your user

## Features Now Available:

- ✅ Real user registration with email/password
- ✅ User authentication and session management
- ✅ Automatic login persistence
- ✅ Secure logout functionality
- ✅ Users stored in Supabase database
- ✅ Email confirmation (if enabled in Supabase)

## Troubleshooting:

- If you get CORS errors, check your Supabase project settings
- If authentication fails, verify your credentials in the `.env` file
- If users aren't appearing, check the Supabase Authentication → Users section

## Security Notes:

- Never commit your `.env` file to version control
- The anon key is safe to use in the frontend (it's designed for this)
- Users will be stored securely in Supabase's auth system
