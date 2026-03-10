# The God Who Indwells
### A Digital Exhibition of Christian Contemplative Pointers

A single-page interactive exhibition of 30 contemplative entries drawn from Scripture, the Desert Fathers, Medieval Mystics, the Carmelite tradition, and modern contemplatives.

---

## Deploying to Vercel via GitHub

### Step 1 — Create a GitHub repository

1. Go to [github.com](https://github.com) and sign in
2. Click **"New repository"** (the + icon, top right)
3. Name it something like `contemplative-exhibition`
4. Set it to **Public** or **Private** (both work with Vercel)
5. Click **"Create repository"**

### Step 2 — Upload these files to GitHub

On your new repository page, click **"uploading an existing file"** and drag in:
- `index.html`
- `vercel.json`
- `README.md`

Then click **"Commit changes"**.

### Step 3 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (you can use your GitHub account)
2. Click **"Add New Project"**
3. Click **"Import"** next to your `contemplative-exhibition` repository
4. Vercel will auto-detect it as a static site — **no settings need changing**
5. Click **"Deploy"**

Within about 30 seconds your site will be live at a URL like:
`https://contemplative-exhibition.vercel.app`

### Step 4 — Custom domain (optional)

In your Vercel project dashboard, go to **Settings → Domains** to add your own domain name.

---

## Making updates

Any time you edit `index.html` and push/upload the change to GitHub, Vercel will automatically redeploy within seconds.

---

## Project structure

```
contemplative-exhibition/
├── index.html      ← The entire exhibition (self-contained)
├── vercel.json     ← Vercel deployment config
└── README.md       ← This file
```
