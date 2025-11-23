# 🔥 Enable Google Sign-In - Complete Guide

## Current Issue
Google Sign-in requires configuration in Firebase Console. Follow these exact steps:

---

## ✅ Step-by-Step Instructions

### 1. Open Firebase Console
🌐 **URL**: https://console.firebase.google.com/project/exten-90c72/authentication/providers

This link takes you directly to the Sign-in providers page for your project!

### 2. Enable Google Provider

1. You'll see a list of sign-in providers
2. Find **"Google"** in the list (look for the Google logo)
3. Click on the **"Google"** row
4. You'll see a toggle switch - turn it **ON** (it should turn blue/green)
5. A form will appear asking for:
   - **Project support email**: Enter your email address (any email you use)
   - This is required by Google for their OAuth consent screen
6. Click **"Save"** button at the bottom

### 3. Verify Configuration

After saving, you should see:
- ✅ Google provider shows as "Enabled" in the list
- ✅ A green checkmark or "Enabled" badge next to Google

### 4. Test It!

1. **Go back to your app**: http://localhost:3000/app
2. **Refresh the page** (Cmd+R or Ctrl+R)
3. Click **"Sign in with Google"** button
4. A Google popup should appear
5. Select your Google account
6. Click **"Continue"** or **"Allow"**
7. You should be signed in! 🎉

---

## 🛠️ Alternative Quick Links

If the direct link doesn't work, follow this path:

1. **Firebase Console Home**: https://console.firebase.google.com/
2. Select project: **exten-90c72**
3. Left sidebar → Click **"Authentication"** (🔐 lock icon)
4. Top tabs → Click **"Sign-in method"**
5. Provider list → Click **"Google"**
6. Toggle **"Enable"** to ON
7. Enter support email
8. Click **"Save"**

---

## 📋 Quick Checklist

Before testing:
- [ ] Opened Firebase Console
- [ ] Selected project `exten-90c72`
- [ ] Went to Authentication → Sign-in method
- [ ] Clicked on Google provider
- [ ] Toggled "Enable" to ON
- [ ] Entered support email
- [ ] Clicked "Save"
- [ ] Saw "Enabled" status for Google
- [ ] Refreshed your app at localhost:3000/app

After testing:
- [ ] Clicked "Sign in with Google"
- [ ] Google popup appeared
- [ ] Selected Google account
- [ ] Successfully signed in
- [ ] Redirected to IDE interface

---

## 🐛 Troubleshooting

### "auth/operation-not-allowed"
- **Cause**: Google provider not enabled
- **Fix**: Follow steps above to enable it

### "auth/popup-blocked"
- **Cause**: Browser blocking popups
- **Fix**: Click the popup icon in address bar and allow popups for localhost

### "auth/unauthorized-domain"
- **Cause**: Domain not authorized
- **Fix**: In Authentication → Settings → Authorized domains, verify `localhost` is listed

### Popup closes immediately without error
- **This is normal**: The app handles this gracefully
- **Solution**: Just try clicking "Sign in with Google" again

### Still not working?
1. **Check browser console** (F12) for specific error codes
2. **Try incognito/private mode** to rule out extensions
3. **Clear browser cache** and try again
4. **Use Email/Password** as alternative (already working!)

---

## 🚀 What Happens After Enabling

Once Google Sign-in is enabled:
1. **Instant authentication** - no need to create password
2. **Secure** - uses Google's OAuth 2.0
3. **Fast** - one-click sign in
4. **Convenient** - use any Google account

---

## 💡 Need to Enable Email/Password Instead?

Email/Password is already enabled and working! Just:
1. Toggle to "Sign Up" mode
2. Enter email + password (min 6 chars)
3. Click "Sign Up"
4. Done! ✅

---

## 📱 Screenshots Guide

### What you're looking for in Firebase Console:

**Sign-in method tab should show:**
```
Providers          Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email/Password    ✅ Enabled
Google            ❌ Disabled  ← Click here to enable
```

**After enabling:**
```
Providers          Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email/Password    ✅ Enabled
Google            ✅ Enabled   ← Should look like this
```

---

## ⏱️ Time Required
- **Setup**: 2 minutes
- **Testing**: 30 seconds
- **Total**: ~3 minutes

---

## 🎯 Success Criteria

You'll know it's working when:
1. ✅ Click "Sign in with Google" button
2. ✅ Google popup appears asking to choose account
3. ✅ After selecting account, popup closes
4. ✅ You're signed in and see the IDE interface
5. ✅ Header shows your email address

---

## 📞 Still Need Help?

If you've followed all steps and it still doesn't work:
1. Share the error message from browser console
2. Verify the Firebase project ID is correct: `exten-90c72`
3. Check if you're logged into the correct Google account in Firebase Console
4. Try creating a new Firebase project and updating the config

---

**Ready?** Click this link to get started: 
👉 https://console.firebase.google.com/project/exten-90c72/authentication/providers

Good luck! 🚀
