# Supabase Integration Setup Guide

## 🚀 Setting up Supabase for Job Application Tracker

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a project name and database password
4. Wait for the project to be created

### 2. Get Your Supabase Credentials

Once your project is created, go to **Settings > API** and copy:
- **Project URL** (looks like: `https://your-project-ref.supabase.co`)
- **Anon/Public Key** (starts with `eyJ...`)

### 3. Backend Configuration

Update `backend/src/main/resources/application.properties`:

```properties
# Replace these values with your actual Supabase credentials
spring.datasource.url=jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=YOUR_DATABASE_PASSWORD
```

**Replace:**
- `YOUR_PROJECT_REF` with your actual project reference
- `YOUR_DATABASE_PASSWORD` with the password you set during project creation

### 4. Frontend Configuration

Create a `.env` file in the `frontend` folder:

```env
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Database Schema

Your `job_applications` table will be automatically created by Hibernate when you start the backend.

The table structure will be:
```sql
CREATE TABLE job_applications (
    id BIGSERIAL PRIMARY KEY,
    company VARCHAR(200) NOT NULL,
    role VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes VARCHAR(2000)
);
```

### 6. Install Dependencies

**Backend:**
```bash
cd backend
mvn clean install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 7. Run the Application

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm start
```

### 8. Verify Setup

1. Backend should start on `http://localhost:8080`
2. Frontend should start on `http://localhost:3000`
3. Check Supabase dashboard to see your data being stored

### 🔧 Troubleshooting

**Common Issues:**
- **Connection refused**: Check your Supabase URL and credentials
- **Table not found**: The table will be created automatically on first run
- **CORS errors**: Supabase handles CORS automatically

**Need Help?**
- Check Supabase logs in the dashboard
- Verify your credentials are correct
- Ensure your project is active in Supabase

### 📝 Next Steps

Once set up, your application will:
- Store all job applications in Supabase PostgreSQL
- Provide real-time data persistence
- Allow you to access your data from anywhere
- Scale automatically with Supabase

### 🔐 Security Notes

- Never commit your `.env` file to version control
- Use environment variables for production
- The anon key is safe to use in frontend (it has limited permissions)
