# Oliwia from Poland: website

Landing page for the "Oliwia from Poland" creator brand (Instagram, Facebook, TikTok, YouTube) with 1:1 consultation booking.

Built with Vite + React + Tailwind CSS v4. Static pages, plus one small Cloudflare Pages Function for the PDF download counter (`functions/api/downloads.js`).

## Develop

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Deploy

Hosted on Cloudflare Pages. Every push to `main` auto-deploys.

- Build command: `npm run build`
- Output directory: `dist`

## Editing content

Almost all content lives in `src/pages/Home.tsx`:

- `SOCIALS`: social media links
- `BOOKING_URL` and `PAYPAL_URL`: the booking page and PayPal link
- `services`: consultation offerings and prices
- Stats strip: follower numbers (in the About section)
- FAQ: questions and answers (mirrored in the JSON-LD in `index.html`)

Images live in `src/assets/images/` (optimized .webp). SEO/meta tags are in `index.html`.
