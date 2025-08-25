# Supabase Setup Instructions

## 🚀 **Step 1: Create Supabase Tables**

Go to your Supabase dashboard → SQL Editor and run these commands:

### Create Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Create Job Applications Table
```sql
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(200) NOT NULL,
  role VARCHAR(200) NOT NULL,
  status VARCHAR(50) NOT NULL,
  applied_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔒 **Step 2: Enable Row Level Security (RLS)**

### For Users Table
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### For Job Applications Table
```sql
-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own applications
CREATE POLICY "Users can view own applications" ON job_applications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own applications
CREATE POLICY "Users can insert own applications" ON job_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own applications
CREATE POLICY "Users can update own applications" ON job_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own applications
CREATE POLICY "Users can delete own applications" ON job_applications
  FOR DELETE USING (auth.uid() = user_id);
```

## ⚙️ **Step 3: Configure Environment Variables**

1. Go to your Supabase project settings
2. Copy your **Project URL** and **anon public key**
3. Create a `.env` file in the `frontend` directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 🔧 **Step 4: Update Supabase Config**

Edit `frontend/src/config/supabase.js` and replace the placeholder values with your actual Supabase credentials.

**Example:**
```javascript
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key-here';
```

## 🌐 **Step 5: Configure Supabase Auth Settings**

1. Go to **Authentication** → **URL Configuration**
2. Add your Vercel domain to **Site URL** (e.g., `https://your-app.vercel.app`)
3. Add your local development URL to **Redirect URLs** (e.g., `http://localhost:3000`)
4. Save the changes

## 🎉 **Step 6: Test the App**

1. Run `npm start` in the frontend directory
2. Create a new account or login
3. Start adding job applications!

## 📝 **Notes**

- Each user will only see their own job applications
- Data is stored securely in Supabase with proper authentication
- The app now supports multiple users with separate data
- All CRUD operations are protected by Row Level Security
