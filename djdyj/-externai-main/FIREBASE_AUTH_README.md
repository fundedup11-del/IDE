# Firebase Authentication Setup

## Installation

Run the following command to install Firebase:

```bash
npm install firebase
```

## What's Been Set Up

### 1. Firebase Configuration (`src/lib/firebase.ts`)
- Initialized Firebase app with your credentials
- Set up Firebase Authentication
- Configured Analytics

### 2. Authentication Context (`src/contexts/AuthContext.tsx`)
- Provides authentication state and methods throughout the app
- Methods available:
  - `signIn(email, password)` - Email/password sign in
  - `signUp(email, password)` - Create new account
  - `signInWithGoogle()` - Google OAuth sign in
  - `logout()` - Sign out user
  - `resetPassword(email)` - Send password reset email

### 3. Login Form (`src/components/LoginForm.tsx`)
- Beautiful login/signup UI
- Email/password authentication
- Google Sign-In button
- Error handling and loading states

### 4. Protected Route (`src/components/ProtectedRoute.tsx`)
- Wraps the /app route to require authentication
- Shows login form if user is not authenticated
- Shows loading state while checking auth status

### 5. Updated Components
- **Layout**: Wrapped with AuthProvider
- **Header**: Shows user email and logout button when authenticated
- **App Page**: Wrapped with ProtectedRoute

## Firebase Console Setup Required

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **exten-90c72**
3. Enable Authentication:
   - Click "Authentication" in left sidebar
   - Click "Get Started"
   - Enable "Email/Password" provider
   - Enable "Google" provider (add your domain to authorized domains)

## Usage

Users will now see a login screen when they visit `/app`. They can:
- Sign up with email/password
- Sign in with email/password  
- Sign in with Google
- Access the ExternAI IDE once authenticated
- See their email in the header
- Click logout to sign out

## Testing

1. Start the dev server: `npm run dev`
2. Navigate to http://localhost:3000/app
3. You should see the login form
4. Create an account or sign in
5. After authentication, you'll see the IDE
6. Your email will appear in the header with a logout button

## Security Notes

- Never commit your Firebase API keys to public repositories (add to .gitignore)
- Consider moving Firebase config to environment variables
- Enable email verification in Firebase Console for production
- Set up proper security rules in Firebase Console
