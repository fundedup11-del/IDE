# Google Sign-In Setup Guide

## Current Status
✅ Code is properly implemented
❌ Google Sign-in provider needs to be enabled in Firebase Console

## Step-by-Step Setup

### 1. Enable Google Sign-In in Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `exten-90c72`
3. **Navigate to Authentication**:
   - Click "Authentication" in the left sidebar
   - Click "Sign-in method" tab at the top

4. **Enable Google Provider**:
   - Find "Google" in the providers list
   - Click on it
   - Toggle "Enable" to **ON**
   - **Project support email**: Enter your email (required by Google)
   - Click **"Save"**

### 2. Verify Authorized Domains

1. In Authentication → Settings → **Authorized domains**
2. Make sure these domains are listed:
   - ✅ `localhost` (should be there by default)
   - Add your production domain when deploying (e.g., `yourapp.vercel.app`)

### 3. Test Google Sign-In

1. **Refresh** your app at http://localhost:3000/app
2. Click **"Sign in with Google"**
3. A Google popup should appear
4. Select your Google account
5. You should be signed in and redirected to the IDE

## Troubleshooting

### Error: "auth/operation-not-allowed"
**Cause**: Google provider is not enabled in Firebase Console
**Solution**: Follow Step 1 above to enable it

### Error: "auth/unauthorized-domain"
**Cause**: Your domain is not in the authorized domains list
**Solution**: Add your domain in Authentication → Settings → Authorized domains

### Error: "auth/popup-blocked"
**Cause**: Browser is blocking the popup
**Solution**: Allow popups for localhost in your browser settings

### Popup closes immediately
**This is normal behavior if**:
- You already completed Google sign-in and closed the popup
- The code is working correctly - it won't show an error for this

### Error: "auth/popup-closed-by-user"
**Cause**: User closed the popup before completing sign-in
**Solution**: This is expected behavior - no error will be shown to the user

## Alternative: Use Email/Password

If you prefer not to set up Google Sign-in, you can:
1. Toggle to **"Sign Up"** mode
2. Enter an email and password (min 6 characters)
3. Click **"Sign Up"**
4. You'll be immediately signed in

Email/Password authentication is already fully configured and working! ✅

## Production Deployment

When deploying to production:

1. **Add production domain** to authorized domains:
   - Firebase Console → Authentication → Settings → Authorized domains
   - Click "Add domain"
   - Enter your production domain (e.g., `yourapp.vercel.app`)

2. **Update OAuth consent screen** (if using Google Sign-in):
   - Go to Google Cloud Console
   - Select your Firebase project
   - Navigate to "APIs & Services" → "OAuth consent screen"
   - Add your production domain to authorized domains

3. **Environment Variables** (optional but recommended):
   - Move Firebase config to environment variables
   - Use `.env.local` for local development
   - Set environment variables in your deployment platform

## Need Help?

If Google Sign-in still doesn't work after enabling it:
1. Check browser console for specific error codes
2. Verify you're using the correct Firebase project
3. Try signing out of Google and back in
4. Clear browser cache and cookies
5. Try incognito/private browsing mode

## Quick Test Checklist

- [ ] Google provider enabled in Firebase Console
- [ ] Support email configured
- [ ] `localhost` in authorized domains
- [ ] Browser allows popups
- [ ] Refreshed the app after making changes
- [ ] Tried signing in with Google
- [ ] If popup closes, tried again to complete the flow

---

**Note**: The "auth/popup-closed-by-user" errors in the console are expected when you close the Google popup. The app handles this gracefully and won't show an error to users. This is normal behavior! 👍
