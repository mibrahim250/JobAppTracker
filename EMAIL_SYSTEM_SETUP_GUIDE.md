# Email-Based User System Setup Guide

## Overview

This guide explains how to set up and use the enhanced email-based user system for the Job Application Tracker. The system now properly associates job applications with users by email address, ensuring data persistence and user-specific access.

## 🚀 Quick Setup

### 1. Database Setup

Run the enhanced database setup script:

```sql
-- Execute this in your Supabase SQL editor
\i enhanced_user_email_setup.sql
```

This script will:
- Create enhanced user and job application tables
- Add email-based user association
- Set up Row Level Security (RLS) policies
- Create helper functions for email-based operations
- Add email verification functionality

### 2. Test the System

Run the test script to verify everything works:

```sql
-- Execute this in your Supabase SQL editor
\i test_email_system.sql
```

## 🔧 Key Features

### Email-Based User Association

- **User Registration**: Users are automatically created when they sign up
- **Email Verification**: Built-in email verification system
- **Job Application Linking**: Applications are linked to users by email
- **Data Persistence**: Applications are stored in the database, not just localStorage

### Database Functions

The system provides several helper functions:

```sql
-- Get user by email
SELECT * FROM public.get_user_by_email('user@example.com');

-- Get applications by email
SELECT * FROM public.get_applications_by_email('user@example.com');

-- Add job application by email
SELECT public.add_job_application(
    'user@example.com',
    'Company Name',
    'Job Title',
    'Applied',
    '2024-01-15',
    'Application notes'
);

-- Verify user email
SELECT public.verify_user_email('verification-token');
```

### Row Level Security (RLS)

The system includes comprehensive RLS policies:

- Users can only see their own applications
- Applications are filtered by user email
- Secure access control for all operations

## 📱 Frontend Integration

### User Service Functions

The enhanced `userService.js` includes new functions:

```javascript
// Get user by email
const user = await getUserByEmail('user@example.com');

// Get applications by email
const applications = await getApplicationsByEmail('user@example.com');

// Add application by email
const appId = await addJobApplicationByEmail('user@example.com', {
  company: 'Company Name',
  role: 'Job Title',
  status: 'Applied',
  applied_date: '2024-01-15',
  notes: 'Application notes'
});

// Email verification
const verified = await checkEmailVerification();
await sendEmailVerification('user@example.com');

// Sync local applications to database
await syncUserApplications();
```

### Email Verification Component

The `EmailVerification` component provides:

- Email verification status checking
- Verification email sending
- Token-based verification
- User-friendly verification flow

## 🔄 Data Flow

### 1. User Registration
```
User signs up → Auth user created → Trigger creates user profile → Email verification sent
```

### 2. Job Application Creation
```
User adds application → Frontend calls addJobApplicationByEmail → Database stores with user_email → RLS ensures security
```

### 3. Application Retrieval
```
User logs in → Frontend calls getApplicationsByEmail → Database returns user-specific applications → RLS filters by email
```

## 🛡️ Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Email-based filtering ensures proper isolation
- Secure policies for all CRUD operations

### Email Verification
- Required for full functionality
- Token-based verification system
- Automatic verification status tracking

### Data Validation
- Input validation on all functions
- SQL injection protection
- Proper error handling

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token TEXT,
    email_verification_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Job Applications Table
```sql
CREATE TABLE public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    applied_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔍 Monitoring and Debugging

### Check User Status
```sql
-- View all users and their verification status
SELECT email, username, email_verified, created_at 
FROM public.users 
ORDER BY created_at DESC;
```

### Check Application Counts
```sql
-- View application counts by user
SELECT 
    u.email,
    COUNT(ja.id) as application_count
FROM public.users u
LEFT JOIN public.job_applications ja ON u.id = ja.user_id
GROUP BY u.id, u.email
ORDER BY application_count DESC;
```

### Test RLS Policies
```sql
-- Test if RLS is working correctly
SELECT 
    'Total users:' as info,
    COUNT(*) as count
FROM public.users
UNION ALL
SELECT 
    'Total applications:' as info,
    COUNT(*) as count
FROM public.job_applications;
```

## 🚨 Troubleshooting

### Common Issues

1. **Applications not showing up**
   - Check if user email is verified
   - Verify RLS policies are enabled
   - Check browser console for errors

2. **Email verification not working**
   - Check Supabase email settings
   - Verify email templates are configured
   - Check spam folder

3. **Database functions not found**
   - Ensure enhanced setup script was run
   - Check function permissions
   - Verify schema access

### Debug Commands

```sql
-- Check if functions exist
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check user permissions
SELECT grantee, privilege_type, table_name 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public';
```

## 📈 Performance Optimization

### Indexes
The system includes optimized indexes:
- `idx_users_email` on users.email
- `idx_job_applications_user_email` on job_applications.user_email
- `idx_job_applications_user_id` on job_applications.user_id

### Query Optimization
- Use email-based queries for better performance
- Leverage the `user_applications_view` for complex queries
- Implement pagination for large datasets

## 🔮 Future Enhancements

### Planned Features
- Bulk application import/export
- Application templates
- Advanced filtering and search
- Email notifications for application updates
- Multi-user collaboration features

### Extension Points
- Custom email templates
- Additional user profile fields
- Integration with job boards
- Analytics and reporting features

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the test script output
3. Check Supabase logs for errors
4. Verify all setup scripts were executed successfully

## ✅ Checklist

- [ ] Enhanced database setup script executed
- [ ] Test script runs successfully
- [ ] Frontend components updated
- [ ] Email verification working
- [ ] RLS policies enabled
- [ ] User registration flow tested
- [ ] Job application creation tested
- [ ] Data persistence verified
- [ ] Security policies confirmed

---

**Note**: This system ensures that job applications are properly associated with users by email address, providing secure, persistent storage and user-specific access to all application data.
