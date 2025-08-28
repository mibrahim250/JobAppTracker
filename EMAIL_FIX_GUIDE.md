# 🔧 FIX: Supabase Email Not Working

## **The Problem**
Your Supabase Auth email settings are not properly configured, which is why emails are not being sent when users register.

## **Step 1: Create Environment Variables**

Create a `.env` file in your `frontend` directory:

```env
REACT_APP_SUPABASE_URL=https://vigsbugdoluldgwcqkac.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpZ3NidWdkb2x1bGRnd2Nxa2FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MzcwMTEsImV4cCI6MjA3MTMxMzAxMX0.A_j3X2kLCVOjuj1yKgXojXtNKL
```

## **Step 2: Configure Supabase Auth Settings**

### **Go to your Supabase Dashboard:**

1. **Navigate to Authentication > Settings**
2. **Enable "Confirm email"** - This is the most important step!
3. **Configure email templates** (optional but recommended)

### **Required Settings:**

✅ **Enable "Confirm email"** - This sends verification emails
✅ **Enable "Secure email change"** - For password resets
✅ **Set "Site URL"** to your app URL (e.g., `http://localhost:3000`)

### **Email Template Settings:**

1. **Go to Authentication > Email Templates**
2. **Configure "Confirm signup" template:**
   - Subject: `Confirm your email address`
   - Content: Use the default template or customize

## **Step 3: Test the Fix**

1. **Restart your React app:**
   ```bash
   cd frontend
   npm start
   ```

2. **Try registering a new user**
3. **Check your email** (including spam folder)
4. **Click the verification link**

## **Step 4: Verify Database Setup**

Run this in your Supabase SQL Editor to ensure the database is properly set up:

```sql
-- Check if email verification is working
SELECT 
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
```

## **Common Issues & Solutions:**

### **Issue 1: "Email not sent"**
- **Solution:** Enable "Confirm email" in Auth settings
- **Check:** Supabase project is active and not paused

### **Issue 2: "Email in spam folder"**
- **Solution:** Check spam/junk folder
- **Add:** Supabase to your email whitelist

### **Issue 3: "Verification link not working"**
- **Solution:** Set correct Site URL in Auth settings
- **Check:** URL matches your app's domain

### **Issue 4: "User created but no email"**
- **Solution:** Check Auth logs in Supabase dashboard
- **Verify:** Email service is not rate-limited

## **Step 5: Monitor Auth Logs**

In your Supabase Dashboard:
1. **Go to Authentication > Logs**
2. **Look for email-related errors**
3. **Check for successful email sends**

## **Step 6: Test Complete Flow**

1. **Register new user** → Should receive email
2. **Click verification link** → Should verify email
3. **Login** → Should work without email verification error
4. **Add job application** → Should save to database

## **🔍 Debugging Commands**

Run these in Supabase SQL Editor to check status:

```sql
-- Check user verification status
SELECT 
    email,
    email_confirmed_at IS NOT NULL as is_verified,
    created_at
FROM auth.users 
ORDER BY created_at DESC;

-- Check if trigger is working
SELECT 
    u.email,
    u.email_verified,
    u.created_at
FROM public.users u
ORDER BY u.created_at DESC;
```

## **✅ Success Indicators**

When fixed, you should see:
- ✅ Registration sends verification email
- ✅ Email contains working verification link
- ✅ Clicking link verifies the user
- ✅ User can login after verification
- ✅ Job applications save to database

## **🚨 If Still Not Working**

1. **Check Supabase project status** - ensure it's not paused
2. **Verify email service** - check if Supabase email service is working
3. **Contact Supabase support** - if email service is down
4. **Check billing** - ensure project has email quota

---

**The main issue is that "Confirm email" is not enabled in your Supabase Auth settings. Enable it and emails will start working!** 🎉
