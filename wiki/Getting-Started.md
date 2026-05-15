# Getting Started with Lexora AI

Welcome! This guide gets you up and running in under 5 minutes.

---

## Prerequisites

- A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Git (for local development)
- Optional: Node.js 18+ (for local dev server with live reload)

---

## Option 1 — View Live Website

Open your browser and navigate to the live deployment. No setup required.

---

## Option 2 — Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/bsgusa/AI-Job-Automation.git
cd AI-Job-Automation

# 2. Open directly (simplest)
open index.html

# 3. Or serve with live reload (recommended for development)
npx serve .
# → http://localhost:3000
```

---

## Option 3 — Deploy Your Own Instance

### GitHub Pages (Free, 2 minutes)

1. Fork this repository
2. Go to **Settings → Pages**
3. Set Source: `main` branch, `/ (root)` folder
4. Click **Save**
5. Live at: `https://YOUR_USERNAME.github.io/AI-Job-Automation/`

### Netlify (Free, 1 minute)

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

### Vercel (Free, 1 minute)

```bash
npm install -g vercel
vercel --prod
```

See **[[Deployment]]** for full hosting options including custom domains.

---

## Project Structure

```
/
├── index.html      ← Main website (open this)
├── css/style.css   ← All styles
├── js/main.js      ← All interactivity
├── assets/         ← Images, icons
├── docs/           ← Technical documentation
└── wiki/           ← This wiki (source files)
```

---

## Making Changes

```bash
# Create a feature branch
git checkout -b feature/my-improvement

# Make your changes to index.html, css/style.css, or js/main.js

# Test in browser
open index.html

# Commit and push
git add .
git commit -m "feat: describe your change"
git push origin feature/my-improvement

# Open a Pull Request on GitHub
```

See **[[Contributing]]** for full contribution guidelines and code standards.

---

## Next Steps

- 📖 Read about the **[[Products]]** we offer
- 🧠 Understand **[[Technology]]** powering Lexora AI
- 🔐 Review our **[[Security-and-Compliance]]** posture
- 🗺️ Check the **[[Roadmap]]** for upcoming features
