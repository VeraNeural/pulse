# 🔐 Supabase Authentication Setup for Pulse

Supabase authentication and database has been successfully integrated into Pulse! Here's everything you need to know:

## ✅ What Was Implemented

### 1. **Supabase Client** (`src/lib/supabase.ts`)
- Configured Supabase client with environment variables
- Ready to use across the app

### 2. **Auth Context** (`src/contexts/AuthContext.tsx`)
- Full authentication state management
- Functions available:
  - `signUp(email, password, displayName)` - Create new account
  - `signIn(email, password)` - Login with email/password
  - `signOut()` - Logout
  - `signInWithGoogle()` - OAuth with Google
- Auto-syncs with Supabase auth state
- Automatically creates/fetches user profiles

### 3. **Login Page** (`src/app/login/page.tsx`)
- Email + password login
- Google OAuth button
- Link to signup page
- Luxury Pulse styling with purple accents

### 4. **Signup Page** (`src/app/signup/page.tsx`)
- Display name, email, password inputs
- Creates auth account + user profile
- New users get 100 coins to start
- Link to login page

### 5. **Auth Guard** (`src/components/AuthGuard.tsx`)
- Protects routes requiring authentication
- Shows loading screen while checking auth
- Auto-redirects to `/login` if not authenticated
- Excludes public routes: `/login`, `/signup`, `/auth/callback`

### 6. **Auth Callback** (`src/app/auth/callback/page.tsx`)
- Handles OAuth redirects (Google)
- Creates user profile for new OAuth users
- Redirects to home after successful auth

### 7. **Updated Layout** (`src/app/layout.tsx`)
- Wrapped app with `AuthProvider`
- All pages now have access to auth state
- Maintains existing `CoinsContext` and `PostsContext`

### 8. **Updated Feed** (`src/app/page.tsx`)
- Uses `useAuth()` to get current user
- Displays user avatar in header (first letter of display name)
- Shows user's display name on hover

## 🗄️ Database Setup

### Run this SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  coins INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can read public user info"
  ON users FOR SELECT USING (true);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_display_name ON users(display_name);
```

The SQL file is also saved in `supabase_setup.sql` at the root.

## 🔑 Environment Variables

Your `.env.local` file is configured with:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## 🎨 User Flow

1. **New User Journey:**
   - Visit app → Redirected to `/login`
   - Click "Create Account" → `/signup`
   - Enter display name, email, password
   - Account created + 100 coins awarded
   - Redirected to feed

2. **Returning User:**
   - Visit app → Auto-login if session exists
   - Or login at `/login`
   - See personalized feed with avatar

3. **Google OAuth:**
   - Click "Continue with Google" on login
   - Authorize with Google
   - Auto-creates profile with Google display name
   - Redirected to feed

## 🔧 Enable Google OAuth in Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Set redirect URL to: `https://yourdomain.com/auth/callback`

## 📝 User Profile Structure

```typescript
interface UserProfile {
  id: string;              // UUID from auth.users
  email: string;           // User's email
  display_name: string;    // Chosen display name
  avatar?: string;         // Optional avatar URL
  is_anonymous: boolean;   // Whether posts are anonymous
  coins: number;           // Current coin balance
  created_at: string;      // Account creation date
}
```

## 🎯 Next Steps

1. **Run the SQL migration** in Supabase to create the users table
2. **Test the auth flow:**
   - Create a new account at `/signup`
   - Login at `/login`
   - Check that you stay logged in after refresh
3. **Customize as needed:**
   - Add more fields to user profile
   - Sync coins with database
   - Add profile editing functionality

## 🚀 Usage in Components

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, profile, signOut } = useAuth();
  
  return (
    <div>
      <p>Welcome, {profile?.display_name}!</p>
      <p>Coins: {profile?.coins}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

## 🔒 Security Features

- ✅ Row Level Security (RLS) enabled
- ✅ Users can only update their own profiles
- ✅ Password requirements enforced (min 6 chars)
- ✅ Email validation
- ✅ Secure session management
- ✅ Auth state persistence

---

**Your app is now protected with authentication!** 🎉

Users must sign in to access the feed, create posts, and interact with content.
