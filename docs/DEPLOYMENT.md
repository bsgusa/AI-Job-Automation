# Deployment Guide

Lexora AI is a static site — it can be deployed anywhere that serves HTML files.

## GitHub Pages (Recommended — Free)

1. Go to **Settings → Pages** in your repository
2. Set **Source** to `main` branch, `/ (root)` folder
3. Click **Save**
4. Your site will be live at: `https://bsgusa.github.io/AI-Job-Automation/`

## Netlify (One Click)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/bsgusa/AI-Job-Automation)

Or via CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

## Vercel (One Click)

```bash
npm install -g vercel
vercel --prod
```

## Custom Domain Setup

After deploying to GitHub Pages or Netlify, point your domain:

```
# DNS Records for lexora.ai
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
CNAME www   bsgusa.github.io.
```

## Local Development

```bash
# Python (built-in)
python3 -m http.server 3000

# Node.js
npx serve .

# PHP (if installed)
php -S localhost:3000
```
