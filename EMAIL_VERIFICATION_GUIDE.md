# Email Verification System Guide

## Overview

Your job application tracker uses **Supabase Auth** for email verification, which is the recommended approach. Here's how it works:

## How Email Verification Works

### 1. **Supabase Auth (Primary System)**
- When a user signs up, Supabase automatically sends a verification email
- The verification link contains a token that Supabase handles internally
- When clicked, Supabase marks the user's email as verified in `auth.users.email_confirmed_at`
- **No custom verification codes needed** - Supabase handles everything

### 2. **Custom Users Table (Sync)**
- Your `public.users` table mirrors the verification status from Supabase Auth
- The `email_verified` field is updated when Supabase Auth verification is complete
- This allows your app to easily check verification status

## Checking if Emails are Stored

### Run the Diagnostic Script

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Run the `check_email_storage.sql` script
3. This will show you:
   - How many users have emails stored
   - How many emails are verified vs unverified
   - Sample data from both tables

### Manual Database Check

```sql
-- Check auth.users (Supabase built-in)
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as users_with_email,
    COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as verified_emails
FROM auth.users;

-- Check public.users (your custom table)
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as users_with_email,
    COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_emails
FROM public.users;
```

## Email Verification Flow

### Frontend Process:
1. **User signs up** → Supabase sends verification email automatically
2. **User clicks verification link** → Supabase verifies email
3. **User returns to app** → Click "Check Verification" button
4. **App refreshes session** → Gets updated verification status
5. **App updates custom table** → Syncs verification status

### No Manual Token Entry Needed:
- ❌ **Don't need**: Manual verification code entry
- ✅ **Do need**: Click verification link in email
- ✅ **Do need**: Click "Check Verification" button in app

## Testing Email Verification

### 1. **Sign Up Test**
```javascript
// In your app, sign up a new user
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123'
});
```

### 2. **Check Email**
- Look for verification email from Supabase
- Check spam/junk folder
- Click the verification link

### 3. **Verify in App**
- Return to your app
- Open Email Verification modal
- Click "Check Verification" button

### 4. **Check Database**
```sql
-- Run this after verification
SELECT 
    email,
    email_confirmed_at,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'VERIFIED'
        ELSE 'UNVERIFIED'
    END as status
FROM auth.users 
WHERE email = 'test@example.com';
```

## Troubleshooting

### Emails Not Being Stored?
1. **Check signup process** - Make sure email is being passed to Supabase
2. **Check database triggers** - Ensure `handle_new_user()` trigger is working
3. **Check RLS policies** - Make sure users can insert into `public.users`

### Verification Not Working?
1. **Check Supabase Auth settings** - Ensure email confirmation is enabled
2. **Check email templates** - Verify Supabase email templates are configured
3. **Check spam folder** - Verification emails often go to spam
4. **Check session refresh** - Make sure app refreshes session after verification

### Custom Verification Tokens?
- **Not needed** - Supabase handles verification automatically
- **If you want custom tokens** - You can use the `email_verification_token` field in `public.users`
- **But recommended** - Stick with Supabase Auth verification

## Database Schema

### auth.users (Supabase built-in)
```sql
- id: UUID (primary key)
- email: TEXT
- email_confirmed_at: TIMESTAMP (null = unverified, timestamp = verified)
- created_at: TIMESTAMP
```

### public.users (your custom table)
```sql
- id: UUID (references auth.users.id)
- email: TEXT
- email_verified: BOOLEAN (mirrors auth.users.email_confirmed_at)
- email_verification_token: TEXT (optional, for custom verification)
- email_verification_expires: TIMESTAMP (optional)
- created_at: TIMESTAMP
```

## Key Points

1. **Supabase Auth is the source of truth** for email verification
2. **No manual verification codes** - just click the link in email
3. **Custom table syncs** with Supabase Auth verification status
4. **Frontend checks verification** by refreshing session and checking `email_confirmed_at`
5. **Emails are stored** in both `auth.users` and `public.users` tables

## Next Steps

1. **Run the diagnostic scripts** to check current state
2. **Test the signup flow** with a new email
3. **Verify the verification process** works end-to-end
4. **Check that emails are being stored** in both tables
5. **Ensure the frontend properly handles** verification status

The system is designed to work automatically with Supabase Auth - no custom verification codes needed!
