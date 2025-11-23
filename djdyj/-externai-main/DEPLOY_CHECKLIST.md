# 🎯 Pre-Deployment Checklist

Before deploying to Vercel, complete these steps:

## ✅ Required Steps

### 1. Get Your OpenAI API Key
- [ ] Go to https://platform.openai.com/api-keys
- [ ] Click "Create new secret key"
- [ ] Copy the key (starts with `sk-...`)
- [ ] Save it securely - you'll need it for Vercel

### 2. Verify Firebase Configuration
- [ ] Google Sign-in enabled in Firebase Console
- [ ] Email/Password authentication enabled
- [ ] Test authentication locally works

### 3. Test Local Build
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] All dependencies installed

## 🚀 Deployment Options

### Quick Deploy (Easiest - 5 minutes)

**Option A: Deploy Button**
Click this button to deploy instantly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fexternai)

**Option B: Vercel CLI** (Recommended)
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Run deployment script
./deploy.sh

# OR manually:
vercel login
vercel --prod
```

**Option C: GitHub Integration** (Best for continuous deployment)
1. Push code to GitHub
2. Connect GitHub to Vercel
3. Auto-deploy on every push

## 📝 Environment Variables to Add in Vercel

After deploying, add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Required
OPENAI_API_KEY=sk-your-key-here

# Firebase (already configured)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDKzjIxwvRpmgMaNK9wwUkkPUxw_KqhDzE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=exten-90c72.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=exten-90c72
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=exten-90c72.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=624304652362
NEXT_PUBLIC_FIREBASE_APP_ID=1:624304652362:web:e818c80a8ed82d15c2a6b3
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-J704JQ2435
```

## 🔧 Post-Deployment Steps

### 1. Update Firebase Authorized Domains
After deployment, you'll get a URL like: `externai-abc123.vercel.app`

```
1. Go to: https://console.firebase.google.com/project/exten-90c72/authentication/settings
2. Click "Authorized domains" tab
3. Click "Add domain"
4. Enter: externai-abc123.vercel.app (your actual URL)
5. Click "Save"
```

### 2. Test Your Deployment
- [ ] Landing page loads
- [ ] Sign in with email/password works
- [ ] Sign in with Google works
- [ ] AI code generation works
- [ ] WebContainer preview works

## 🎨 Optional Enhancements

### Custom Domain
1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. Add to Vercel: Settings → Domains
3. Update DNS records
4. Add domain to Firebase Authorized Domains

### Analytics
- [ ] Add Vercel Analytics
- [ ] Set up Firebase Analytics
- [ ] Monitor usage and performance

## 🐛 Common Issues & Solutions

### Build fails with "peer dependency" errors
**Solution**: Vercel should use `npm install --legacy-peer-deps` (configured in vercel.json)

### "OPENAI_API_KEY is not defined"
**Solution**: Add the environment variable in Vercel Dashboard → Settings → Environment Variables

### Google Sign-in doesn't work
**Solution**: Add your Vercel domain to Firebase Authorized Domains

### WebContainer doesn't load
**Solution**: WebContainers require special headers, which are configured in `next.config.js` - should work automatically

## 📊 Deployment Timeline

- Setup: 5 minutes
- First deploy: 3-5 minutes
- Firebase configuration: 2 minutes
- Testing: 5 minutes
- **Total: ~15-20 minutes**

## 🎉 Success Indicators

You'll know deployment succeeded when:
- ✅ Vercel build completes without errors
- ✅ You get a deployment URL (e.g., externai-abc123.vercel.app)
- ✅ Landing page loads at that URL
- ✅ Authentication works after adding domain to Firebase
- ✅ AI features work after adding OPENAI_API_KEY

## 📞 Need Help?

- **Vercel Status**: https://vercel.com/docs
- **Firebase Auth**: https://firebase.google.com/docs/auth
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**Ready to deploy? Run:** `./deploy.sh`

Or follow the detailed guide in `DEPLOYMENT.md`
