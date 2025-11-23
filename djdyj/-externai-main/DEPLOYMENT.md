# 🚀 Deploy ExternAI to Vercel

## Prerequisites

- ✅ Vercel account (free): https://vercel.com/signup
- ✅ GitHub account (to connect your repository)
- ✅ OpenAI API key: https://platform.openai.com/api-keys

---

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended - Easiest)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - ExternAI IDE"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/externai.git
   git push -u origin main
   ```

2. **Go to Vercel Dashboard**: https://vercel.com/new

3. **Import your GitHub repository**:
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`

5. **Add Environment Variables**:
   Click "Environment Variables" and add these:
   
   ```
   OPENAI_API_KEY=sk-your-actual-openai-key-here
   
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDKzjIxwvRpmgMaNK9wwUkkPUxw_KqhDzE
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=exten-90c72.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=exten-90c72
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=exten-90c72.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=624304652362
   NEXT_PUBLIC_FIREBASE_APP_ID=1:624304652362:web:e818c80a8ed82d15c2a6b3
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-J704JQ2435
   ```

6. **Click "Deploy"** 🚀

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd "/Users/sonelisepakade/ExtenAI IDE GTO"
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **externai** (or your choice)
   - Directory? **./
   - Override settings? **Y**
   - Build Command? `npm run build`
   - Install Command? `npm install --legacy-peer-deps`
   - Output Directory? `.next`
   - Development Command? `npm run dev`

5. **Set environment variables**:
   ```bash
   vercel env add OPENAI_API_KEY
   # Paste your OpenAI API key when prompted
   
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   # Paste: AIzaSyDKzjIxwvRpmgMaNK9wwUkkPUxw_KqhDzE
   
   # Repeat for all Firebase env vars from .env.example
   ```

6. **Deploy to production**:
   ```bash
   vercel --prod
   ```

---

## Post-Deployment Configuration

### 1. Update Firebase Authorized Domains

1. Go to Firebase Console: https://console.firebase.google.com/project/exten-90c72/authentication/settings
2. Click **"Authorized domains"**
3. Click **"Add domain"**
4. Add your Vercel domain: `your-project-name.vercel.app`
5. Click **"Add"**

### 2. Test Your Deployment

1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. Test the landing page
3. Click "Sign In" or navigate to `/app`
4. Test authentication (email/password + Google Sign-in)
5. Test AI code generation

---

## Environment Variables Required

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | https://platform.openai.com/api-keys |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase config for authentication | Already configured (see .env.example) |

---

## Troubleshooting

### Build Fails with Peer Dependency Errors
**Solution**: Ensure install command is set to `npm install --legacy-peer-deps` in Vercel settings

### Authentication Not Working
**Solution**: 
1. Check that all Firebase env vars are set in Vercel
2. Add your Vercel domain to Firebase Authorized Domains
3. Redeploy after adding the domain

### OpenAI API Errors
**Solution**: Verify `OPENAI_API_KEY` is set correctly in Vercel environment variables

### WebContainer Issues
**Note**: WebContainers require special headers which are configured in `next.config.js`. Should work automatically.

---

## Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Firebase**:
   - Add your custom domain to Firebase Authorized Domains

---

## Continuous Deployment

Once connected to GitHub:
- ✅ Every push to `main` branch automatically deploys to production
- ✅ Pull requests get preview deployments
- ✅ Automatic SSL certificates
- ✅ Global CDN

---

## Quick Commands Reference

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# View deployment logs
vercel logs

# List deployments
vercel ls

# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

---

## Success Checklist

After deployment, verify:
- [ ] Landing page loads at root URL
- [ ] Authentication page loads at `/app`
- [ ] Email/password sign-in works
- [ ] Google Sign-in works (after adding domain to Firebase)
- [ ] AI code generation works
- [ ] WebContainer preview works
- [ ] All environment variables are set

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Firebase Auth**: https://firebase.google.com/docs/auth/web/start

---

## Estimated Deployment Time
- Initial setup: 5-10 minutes
- Build time: 2-3 minutes
- Total: ~10-15 minutes

🎉 **Your ExternAI IDE will be live and accessible worldwide!**
