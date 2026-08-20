# Grab My Goods Resell

Premium ecommerce website + admin CMS for [Grab My Goods Resell](https://grabmygoodsresell.com) — a local resale business in Waxahachie, Texas.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **MongoDB** + **Mongoose**
- **GridFS** for persistent image storage (serverless-safe)
- **JWT** session auth for admin

## Getting Started

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in values:

```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_PASSWORD=your_secure_admin_password
ADMIN_SECRET=your_random_jwt_secret_at_least_32_chars
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Security:** Rotate your MongoDB password if it was ever shared in plain text. Never commit `.env.local`.

### 2. Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin panel.

### 3. Production build

```bash
npm run build
npm start
```

## Features

### Storefront
- Homepage with CMS-driven sections
- Shop with server-side search, filters, sorting, pagination
- Product detail pages with SEO + structured data
- Cart (persists in localStorage)
- Checkout / order request (no payment gateway yet)
- About, Contact, Booking, Testimonials, FAQ, Pricing
- Local pickup only messaging

### Admin (`/admin`)
- Secure login with session cookies
- Dashboard with stats
- Product management (create, edit, duplicate, hide, mark sold, archive, bulk actions)
- Multi-image upload with drag-to-reorder (GridFS)
- Order management with status updates
- Category, Testimonial, FAQ management
- CMS for homepage and page content
- Site settings (branding, contact info, SEO defaults)

## Key Routes

| Public | Admin |
|--------|-------|
| `/` | `/admin` |
| `/shop` | `/admin/products` |
| `/products/[slug]` | `/admin/orders` |
| `/cart` | `/admin/content` |
| `/checkout` | `/admin/settings` |

## Deployment (Vercel)

### 1. Import the project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `BizzOne-Digital/grabgoodsresell` from GitHub
3. **Framework Preset:** Next.js (auto-detected)
4. **Root Directory:** leave blank (project root)
5. **Build Command:** `npm run build` (default)
6. **Output Directory:** leave blank (do NOT set to `out` or `dist`)

### 2. Environment variables (required)

In Vercel → Project → **Settings → Environment Variables**, add for **Production**, **Preview**, and **Development**:

| Variable | Example |
|----------|---------|
| `MONGODB_URI` | Standard `mongodb://...` connection string from Atlas |
| `ADMIN_PASSWORD` | Your admin login password |
| `ADMIN_SECRET` | Random string, at least 32 characters |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` or your custom domain |

Use the **standard** MongoDB URI (`mongodb://`), not `mongodb+srv://`, if you see DNS timeout errors.

### 3. MongoDB Atlas (required for production)

In MongoDB Atlas → **Network Access**, add **`0.0.0.0/0`** so Vercel serverless functions can connect.

### 4. Deploy

Click **Deploy**. Wait until the deployment status is **Ready** (not Error).

Open the URL shown in the deployment, e.g. `https://grabgoodsresell.vercel.app` — **not** an old or guessed URL.

### 5. Custom domain (`grabmygoodsresell.com`)

1. Vercel → Project → **Settings → Domains** → Add `grabmygoodsresell.com`
2. At your domain registrar, update DNS to Vercel’s records (usually `A` record `76.76.21.21` or CNAME to `cname.vercel-dns.com`)
3. Remove old DNS pointing to the previous website builder
4. Set `NEXT_PUBLIC_SITE_URL=https://grabmygoodsresell.com` in Vercel env vars
5. Redeploy

### Troubleshooting `404: NOT_FOUND`

This is a **Vercel platform** error (not the Next.js site). It usually means:

- The deployment **failed** — check **Deployments** tab for red “Error” status and read build logs
- You’re opening the **wrong URL** — use the exact URL from a successful deployment
- **Output Directory** was set incorrectly in Vercel settings — clear it
- **Root Directory** points to a subfolder that doesn’t exist — clear it
- Domain DNS points to Vercel but **no successful production deploy** exists yet

After fixing, click **Redeploy** on the latest commit.

Images are stored in MongoDB GridFS — no local filesystem required.

## Future Payment Integration

The order system includes `paymentStatus` and a `PaymentProvider` abstraction ready for Stripe, PayPal, or Square when needed.
