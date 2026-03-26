# Luiz Mitumba Thrifts — Complete Setup Guide

Follow these steps in order. Takes about 20–30 minutes total.

---

## STEP 1 — Create your Supabase database (free)

1. Go to https://supabase.com and click **Start your project**
2. Sign up with GitHub or Google
3. Click **New project** → choose a name (e.g. "luiz-thrifts") → set a database password → pick region **South Africa (Cape Town)** (closest to Nairobi)
4. Wait ~2 minutes for it to set up
5. In the left sidebar click **SQL Editor** → **New query**
6. Copy the entire contents of `supabase/schema.sql` and paste it in → click **Run**
7. Go to **Settings → API** and copy:
   - **Project URL** → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## STEP 2 — Create your Cloudinary account (free)

1. Go to https://cloudinary.com and click **Sign up for free**
2. Sign up (no credit card needed)
3. From your Dashboard copy:
   - **Cloud name** → `CLOUDINARY_CLOUD_NAME`
   - **API key** → `CLOUDINARY_API_KEY`
   - **API secret** → `CLOUDINARY_API_SECRET`

The free tier gives you:
- 25 GB storage
- 25 GB monthly bandwidth
- Auto WebP/AVIF conversion for fast mobile loading
- Global CDN — your photos load fast everywhere

---

## STEP 3 — Set up the project locally

You need Node.js installed. Download from https://nodejs.org (choose LTS version).

### On your computer:

```bash
# 1. Extract the project zip you downloaded
# 2. Open a terminal in the luiz-thrifts folder

# Install dependencies
npm install

# Create your environment file
cp .env.local.example .env.local
```

Now open `.env.local` in any text editor and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdef123456
ADMIN_PASSWORD=choose-a-strong-password
NEXT_PUBLIC_WA_NUMBER=25498430650
```

**Important:** Change `ADMIN_PASSWORD` to something only you know.

### Test locally:

```bash
npm run dev
```

Open http://localhost:3000 in your browser. You should see your store!

---

## STEP 4 — Deploy to Vercel (free hosting)

1. Go to https://github.com and create a free account
2. Create a **new repository** called `luiz-thrifts` (set to private)
3. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/luiz-thrifts.git
git push -u origin main
```

4. Go to https://vercel.com → **Sign up with GitHub**
5. Click **Add New Project** → import your `luiz-thrifts` repo
6. Before clicking Deploy, click **Environment Variables** and add ALL the variables from your `.env.local` file (same names, same values)
7. Click **Deploy** → wait ~2 minutes
8. Your site is live at `https://luiz-thrifts.vercel.app` (or similar)

---

## STEP 5 — Upload your first listing

1. Open your live site
2. Tap **Admin ›** in the top right
3. Enter your `ADMIN_PASSWORD`
4. Tap the front photo zone → select a photo from your phone gallery
5. Tap the back photo zone → select the back photo
6. Choose the category (Dresses, T-Shirts, etc.)
7. Under **Left outfit**: enter the price and tap the available sizes
8. Under **Right outfit**: do the same
9. Tap **Add to store** — it uploads to Cloudinary and saves to Supabase
10. Tap the **Manage** tab to see all your listings

---

## How WhatsApp ordering works

When a customer:
1. Taps a product card
2. Selects Left or Right outfit
3. Selects their size
4. Taps "Order on WhatsApp"

They are taken to WhatsApp with a pre-filled message like:

> Hi! I'm interested in the *left outfit* from *Luiz Mitumba Thrifts* 🙏
> Size: *M*
> Price: *KES 850*
> Is it still available?

You receive this message on +254 98430650.

---

## File structure

```
luiz-thrifts/
├── pages/
│   ├── index.js              ← Main storefront
│   ├── _app.js
│   ├── _document.js          ← Google Fonts
│   └── api/
│       ├── products/
│       │   ├── index.js      ← GET all, POST new product
│       │   └── [id].js       ← DELETE product
│       └── upload.js         ← Upload images to Cloudinary
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── CategoryPills.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── ProductModal.jsx      ← Detail sheet + WhatsApp button
│   ├── AdminPanel.jsx        ← Password-protected admin
│   └── Footer.jsx
├── lib/
│   ├── supabase.js           ← Supabase client
│   └── cloudinary.js        ← Cloudinary upload helper
├── styles/
│   └── globals.css
├── supabase/
│   └── schema.sql            ← Run this in Supabase SQL editor
└── .env.local.example        ← Copy to .env.local and fill in
```

---

## Troubleshooting

**Images not loading:** Check your Cloudinary credentials in `.env.local`

**"Unauthorized" on admin actions:** Your `ADMIN_PASSWORD` in `.env.local` must match what you type in the admin login

**Blank page after deploy:** Check Vercel → your project → Functions tab for errors. Usually a missing environment variable.

**Products not saving:** Check Supabase → Table editor → products table exists. If not, re-run `schema.sql`.

---

## Switching to a custom domain later

1. Buy a domain (e.g. from Namecheap or Kenya's Safaricom Domains)
2. In Vercel → your project → Settings → Domains → Add your domain
3. Follow the DNS instructions Vercel gives you
4. Done — your site moves to your custom domain with automatic SSL

---

Need help? The entire codebase is clean and commented. Each file does one job.
