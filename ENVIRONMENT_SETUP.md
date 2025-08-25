# Environment Variables Setup

## Create a `.env` file in the `frontend` directory

Create a file called `.env` in your `frontend` folder with the following content:

```env
# Supabase Configuration
# Replace these with your actual Supabase credentials from your dashboard
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## How to get your Supabase credentials:

1. Go to your Supabase project dashboard
2. Click on **Settings** in the left sidebar
3. Click on **API**
4. Copy the **Project URL** and paste it as the value for `REACT_APP_SUPABASE_URL`
5. Copy the **anon public** key and paste it as the value for `REACT_APP_SUPABASE_ANON_KEY`

## Example:
```env
REACT_APP_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU2NzI5MCwiZXhwIjoxOTUyMTQzMjkwfQ.example
```

## Important Notes:
- Never commit your `.env` file to version control
- The `.env` file should be in the `frontend` directory, not the root
- Restart your development server after creating the `.env` file
- Make sure there are no spaces around the `=` sign
