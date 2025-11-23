# Deploying to Vercel

This project is Next.js and ready for Vercel. Follow one of the two options below.

## Option A — GitHub + Vercel (recommended)

1. Push this repository to GitHub (create a repo and push the current branch):

```powershell
git checkout -b deploy/vercel
git add .
git commit -m "chore: add vercel config and deploy workflow"
git push -u origin deploy/vercel
```

2. In Vercel, import the GitHub repository and follow the UI to set up the project. Vercel will detect Next.js automatically.

3. Required environment variables (example names used in the project):
- `OPENAI_API_KEY` — your OpenAI key (used by server API routes)
- Any Firebase credentials or third-party API keys (if used).

4. Alternatively, use the GitHub Action already in `.github/workflows/vercel-deploy.yml`. Add the following repository secrets in the GitHub repo:
- `VERCEL_TOKEN` — personal token from Vercel (Account Settings → Tokens)
- `VERCEL_ORG_ID` — organization id (from Vercel dashboard)
- `VERCEL_PROJECT_ID` — project id (from Vercel dashboard)

When secrets are set, pushing to `main` or `master` will trigger an automatic deploy.

## Option B — Vercel CLI (manual)

1. Install Vercel CLI (locally):

```powershell
npm i -g vercel
vercel login
```

2. From the repo root run:

```powershell
vercel --prod
```

3. When prompted, select the project settings, or create a new project. Set environment variables in the Vercel dashboard.

## Post-deploy checklist
- Verify serverless API routes work (e.g., `/api/chat`).
- Confirm environment variables are set in Vercel for production.
- Check logs in the Vercel dashboard for any runtime errors and missing secrets.
- If you use Playwright CI, ensure builds succeed in the Vercel Action or check the GitHub Actions logs.

If you'd like, I can:
- create a branch `deploy/vercel` and push it (I can't push without your Git remote credentials), or
- prepare the exact secrets values to set in Vercel/GitHub if you provide them.
