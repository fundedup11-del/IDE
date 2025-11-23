# Firebase Authentication Troubleshooting

## Current Issue: 400 Errors from Firebase

You're seeing these errors:
```
identitytoolkit.googleapis.com/v1/accounts:signUp?key=... Failed to load resource: 400
identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=... Failed to load resource: 400
```

## Most Likely Cause: Email/Password Provider Not Enabled

### To Fix:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `exten-90c72`
3. **Navigate to Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Sign-in method" tab at the top
4. **Enable Email/Password**:
   - Find "Email/Password" in the list
   - Click on it
   - Toggle "Enable" to ON
   - Click "Save"
5. **Enable Google Sign-In** (optional but recommended):
   - Find "Google" in the list
   - Click on it
   - Toggle "Enable" to ON
   - Provide a project support email
   - Click "Save"

## Additional Checks:

### 1. API Key Restrictions
- In Firebase Console → Project Settings → General
- Make sure your API key is not restricted
- If restricted, add `localhost` and your domain to allowed origins

### 2. Authorized Domains
- In Firebase Console → Authentication → Settings → Authorized domains
- Make sure `localhost` is in the list (it should be by default)
- For production, add your deployed domain

### 3. Check Browser Console
The code now logs detailed errors. Check your browser console for:
```
Firebase Auth Error: [error object]
Error code: auth/...
Error message: ...
```

Common error codes:
- `auth/operation-not-allowed` - Email/Password provider not enabled
- `auth/api-key-not-valid` - API key issue
- `auth/invalid-api-key` - API key configuration problem
- `auth/app-deleted` - Project was deleted
- `auth/invalid-credential` - Wrong email/password

## Testing Steps:

1. **After enabling Email/Password in Firebase Console:**
   - Refresh http://localhost:3000/app
   - Try creating a new account
   - Check browser console for any errors

2. **Try Google Sign-In:**
   - Make sure you enabled Google provider in Firebase
   - Click "Sign in with Google"
   - Complete the authentication flow

3. **Check Network Tab:**
   - Open DevTools → Network tab
   - Try signing up
   - Click on the failed request
   - Look at the Response tab for the error message

## Quick Verification:

Run this in your browser console on localhost:3000:
```javascript
// This will show if Firebase is initialized correctly
console.log('Firebase Auth:', window.firebase?.auth?.());
```

## Need More Help?

If you still see 400 errors after enabling Email/Password:
1. Share the error message from the browser console
2. Check if the Firebase project ID matches: `exten-90c72`
3. Verify the API key in src/lib/firebase.ts matches the one in Firebase Console
