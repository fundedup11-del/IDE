Previewing ExternAI without installing anything

This file explains how to preview the project in the cloud (no local installs required).

Options (no local installs required):

A) Gitpod (recommended quick preview)
- Create a GitHub repository and push or upload this project there.
  - If you can use Git (preferred):
    1. Create an empty repository on GitHub (https://github.com/new).
    2. From PowerShell in the project folder:
       ```powershell
       git init
       git add .
       git commit -m "Add project for cloud preview"
       git branch -M main
       git remote add origin https://github.com/<your-username>/<your-repo>.git
       git push -u origin main
       ```
  - If you cannot use Git on this machine, use the GitHub web UI:
    1. Create a new repository on GitHub (https://github.com/new).
    2. Open the new repo page and click **Add file → Upload files**.
    3. In File Explorer, open the project folder, select all files and folders (Ctrl+A), then drag-and-drop them into the GitHub upload area.
    4. Commit the changes.

- Open the repo in Gitpod (no installs) by visiting:
  https://gitpod.io/#https://github.com/<your-username>/<your-repo>

  Gitpod will launch a cloud workspace, run `npm ci` and `npm run dev` (see `.gitpod.yml`), and open a preview on port 3000 for you to view in the browser.

Notes:
- The repo needs to be public or you must sign in to Gitpod with GitHub access to a private repo.
- Gitpod provides a live, browser-based IDE and a preview URL — no local installs required.

B) Vercel (hosted deployment)
- Push your repo to GitHub (same as above).
- In Vercel (https://vercel.com), click **Import Project** → select your GitHub repo → Deploy.
- Vercel will build and deploy the project and provide a live URL that you can open in any browser.

C) Replit or Codespaces
- Replit: import the GitHub repo into Replit and run `npm run dev` in the Replit console.
- Codespaces (GitHub): available if your account supports it — open repo in Codespaces and start the server.

If you want, I can:
- Create this `PREVIEW.md` (done).
- Walk you through creating the GitHub repo and uploading files via the web UI step-by-step.
- Generate a ZIP of the project if you prefer to download and re-upload from another PC.

If you want me to guide you live through the minimal web-only route, tell me whether you:
- Have a GitHub account (yes/no)?
- Can drag-and-drop files into the GitHub web UI (yes/no)?

Then I will provide the exact next click-by-click steps for that path.
