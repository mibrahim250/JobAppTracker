# Quick Fix for User Creation Issue

## 🚨 **If you're having trouble with user creation, run this in your Supabase SQL Editor:**

### Step 1: Drop existing policies (if they exist)
```sql
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
```

### Step 2: Create the new trigger function
```sql
-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Step 3: Create the trigger
```sql
-- Create a trigger to automatically create user profile when auth.users is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### Step 4: Update the insert policy
```sql
-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## 🎉 **What this does:**

1. **Automatic User Creation**: When someone signs up, a user profile is automatically created in your `users` table
2. **Better Error Handling**: The app won't crash if user profile creation fails
3. **Fallback Username**: If no username is provided, it uses the email prefix
4. **Proper RLS**: Users can only access their own data

## 🔧 **After running these commands:**

1. Restart your React app
2. Try creating a new account
3. The user should be automatically created in both `auth.users` and your `users` table

## 📝 **To test:**

1. Go to your Supabase dashboard
2. Check the `users` table - you should see new users being created
3. Check the `auth.users` table - this is where Supabase stores authentication data
4. Try logging in with the new account

The trigger will automatically handle user creation from now on! 🚀
