# 🚀 AlgoMind — Deployment Guide

## Project Structure

```
algomind/
├── api/
│   └── chat.js          ← Serverless proxy (keeps API key secret)
├── src/
│   ├── main.jsx         ← React entry point
│   └── App.jsx          ← Your entire app
├── index.html
├── vite.config.js
├── package.json
├── vercel.json
├── .env.example
└── .gitignore
```

---

## ⚡ Option 1: Deploy to Vercel (Recommended — Free)

### Step 1 — Get your Anthropic API Key
1. Go to **https://console.anthropic.com/settings/keys**
2. Click **Create Key** → copy it somewhere safe

### Step 2 — Push to GitHub
```bash
# Inside the algomind folder:
git init
git add .
git commit -m "Initial commit"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/algomind.git
git push -u origin main
```

### Step 3 — Deploy on Vercel
1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your **algomind** repo
4. Vercel auto-detects Vite — no config needed
5. Before clicking Deploy, go to **"Environment Variables"** and add:
   ```
   Name:  ANTHROPIC_API_KEY
   Value: sk-ant-xxxxxxxxxxxxxxxx   ← your key here
   ```
6. Click **Deploy** 🎉

Your app will be live at: `https://algomind.vercel.app`

---

## 💻 Option 2: Run Locally First

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# Then edit .env and add your real API key:
# ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx

# 3. Start dev server
npm run dev
# → Opens at http://localhost:5173
```

> ⚠️ The AI Mentor chat uses `/api/chat` which only works on Vercel or with `vercel dev`.
> For local testing without Vercel CLI, you can temporarily put the API key directly
> in the fetch call in App.jsx — but NEVER commit that to GitHub.

### Optional: Use Vercel CLI locally
```bash
npm install -g vercel
vercel dev
# → Runs at http://localhost:3000 with /api/chat working
```

---

## 🌐 Option 3: Deploy to Netlify

1. Push to GitHub (same as Step 2 above)
2. Go to **https://netlify.com** → New site from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `ANTHROPIC_API_KEY`

For Netlify, rename `api/chat.js` to `netlify/functions/chat.js` and update the fetch URL in App.jsx from `/api/chat` to `/.netlify/functions/chat`.

---

## 🔒 Security Notes

| What | Where | Safe? |
|------|-------|-------|
| `ANTHROPIC_API_KEY` | Vercel env vars (server-side) | ✅ Yes |
| `/api/chat.js` | Runs on server, never sent to browser | ✅ Yes |
| Your React code | Bundled and sent to browser | ✅ No secrets here |

**Never** put your API key directly in `App.jsx` or any frontend file — it will be visible to anyone who opens DevTools.

---

## 🔧 After Deployment

- **Custom domain**: Vercel → Project Settings → Domains → Add yours
- **Redeploy**: Just push to `main` branch — Vercel auto-deploys
- **View logs**: Vercel dashboard → Functions tab → chat.js logs

---

## 📦 Build for Production (manual)

```bash
npm run build
# Creates /dist folder — upload this to any static host
# Note: /api/chat.js won't work on plain static hosts (needs serverless)
```
