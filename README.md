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

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Images are stored in MongoDB GridFS — no local filesystem required.

## Future Payment Integration

The order system includes `paymentStatus` and a `PaymentProvider` abstraction ready for Stripe, PayPal, or Square when needed.
