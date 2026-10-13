# Handoff: poland.oliwiakonieczna.info (Oliwia from Poland)

Read this first. It is written for whoever picks this project up next, human or AI,
on any account.

## What this is

The creator and consulting site for **Oliwia Konieczna** as "Oliwia from Poland".
She helps international students and newcomers with studying, visas, and life in
Poland, and sells one-to-one consultations. This site takes real money, so its
booking and payment flow is the part to be most careful with.

- **Live:** https://poland.oliwiakonieczna.info
- **Repo:** `TinyAnts/oliwia-from-poland`, production branch `main`
- **Hosting:** Cloudflare Pages, auto-deploys on push to `main`
- **Contact email:** `ask.oliwia.from.poland@gmail.com`

## Stack

Vite + React + TypeScript + Tailwind v4, shadcn/ui, Framer Motion. The page lives
in `src/pages/Home.tsx`; SEO metadata and JSON-LD live in `index.html`.

```bash
npm install && npm run dev
npm run build     # outputs to dist/
```

Cloudflare build settings: preset **React (Vite)**, command `npm run build`,
output `dist`.

## The booking and payment flow (important)

There is **no payment processor**, deliberately. Taking card payments would require
registering a business, which the owner does not want. The flow is manual:

1. Visitor clicks any "Book Now" button, which opens `BOOKING_URL`.
2. They pick a free slot on Setmore and enter their details.
3. They send the fee to the PayPal.Me link within 24 hours.
4. **Oliwia confirms manually** and sends a Google Calendar invite with a Meet link.

```ts
const BOOKING_URL = "https://oliwiaqn42.setmore.com";
const PAYPAL_URL  = "https://paypal.me/OliwiaFromPoland";
```

Setmore configuration that already exists and should not be undone:

- 17 services, each assigned to the staff member, or it will not appear publicly.
  In Setmore, **services** are the bookable items; **categories** are just folders.
  Creating a category by mistake produces an empty booking page.
- The PayPal instruction lives in Settings -> Booking preferences -> **Booking
  policies**, because Setmore's confirmation email does not include the service
  description. It shows at checkout and at the top of the booking page.
- Cancellation policy is set to **48 hours**, matching every mention in the site
  copy and the FAQ JSON-LD. If you change one, change all of them.
- Availability is afternoons and evenings Central European Time.
- Google Meet auto-integration is a paid Setmore feature and is intentionally not
  used. Invites are sent by hand.
- Nothing auto-cancels unpaid bookings. Automating that would need a processor.

## Pricing and the promo card

Polish Lessons is the featured promo service and is styled to stand out: a thicker
primary border, ring, rose-to-amber gradient background, a PROMO ribbon, a slight
scale-up, and strikethrough original prices.

- Polish Lesson 30 min: **16.99 EUR** (was 20)
- Polish Lesson 50 min: **19.99 EUR** (was 35)
- Other pairs run 40 to 45 EUR for 25 min and 70 to 80 EUR for 50 min
- Ask Me Anything 25 min: 30 EUR

There used to be a free "Promotion Booking Call" card. It was removed on purpose.
Do not reintroduce it.

## Claims that must stay as written

- Audience is described as **"40,000+ followers"** across four platforms
  (Instagram, Facebook, TikTok, YouTube) as a **combined total**. Never split it
  into per-platform numbers and never inflate it.
- View counts are described in general terms ("millions of views"), never as a
  precise figure.

## Watch out for

- `index.html` contains JSON-LD with a `FAQPage` block that mirrors the on-page
  FAQ, including the booking, timezone, Meet, and refund answers. Change both
  together or the structured data will contradict the page.
- Editing `Home.tsx` with scripted find-and-replace is unreliable because JSX wraps
  strings across lines. Grep the exact current text first, then replace.

## House rules (apply to every site in this family)

These are the owner's standing preferences. Breaking them means redoing work.

1. **Never use em-dashes or en-dashes (the long dash characters) in site copy.**
   The owner considers them a tell that text was written by AI. Use commas,
   colons, semicolons, or the middot separator instead. Check with a search for
   the long dash characters before shipping.
2. **No invented testimonials, reviews, or endorsements presented as real.**
   Placeholder social proof stays behind a flag that is off in production.
3. **Free tiers only.** No paid subscriptions, no Stripe, no payment processors,
   nothing that would require registering a business.
4. **Write like a person.** Short punchy fragments stacked together read as
   machine-written. Prefer plain sentences in the first person.
5. **Preview before shipping.** Build, screenshot, and show the owner a preview.
   The owner reviews visually and gives precise feedback.
6. **Forms and interactive elements must stay accessible** (labels, focus states,
   reduced-motion fallbacks for animations).

## Free Thirukkural PDF and the hidden download counter

A section with id `thirukkural` (between How It Works and For Brands, plus a
"Free PDF" nav link) offers a free 13-page booklet of ten Thirukkural couplets in
Tamil, Polish and English. It is a demand test: the copy asks readers to download
and share it, and to support on Ko-fi only if they want to, possibly toward a book.

- Component: `src/components/ThirukkuralSection.tsx` (copy, Ko-fi link, counter).
- PDF: `public/downloads/thirukkural-10-couplets-oliwia-from-poland.pdf`.
  To replace it, overwrite that file with the same name.
- Support link: `https://ko-fi.com/oliwiafrompoland` (Ko-fi, not Buy Me a Coffee).
- Short link for social bios: `/thirukkural` redirects to `/#thirukkural`
  (`public/_redirects`).

**Counter.** Each click on a download link sends a POST to `/api/downloads`
(`functions/api/downloads.js`, a Cloudflare Pages Function). The total shows as a
faint 10px number in the bottom-left corner of the footer (white at 9% opacity).
Visiting `/api/downloads` directly shows the number as `{"count": N}`.

- Storage is a free **D1 database** bound to the Pages project as
  `DOWNLOADS_DB` (Settings -> Bindings, Production). The table creates itself.
  Counts are stored per day in table `downloads (item, day, n)`, so the D1
  console can show demand over time:
  `SELECT day, n FROM downloads ORDER BY day;`
- Without the binding, the API answers 503, the number is simply hidden, and the
  PDF still downloads (the link points straight at the static file).
- The same visitor is counted at most once per 30 seconds; requests from other
  websites are refused. It counts clicks on this site, not people who get the
  PDF some other way (for example a forwarded file).
- The number is faint, not secret: anyone who selects the footer text can see it.
  Never seed or inflate it.

## How deployment works

Every site follows the same path:

```
git push  ->  GitHub (TinyAnts/<repo>)  ->  Cloudflare Pages auto-build  ->  live domain
```

Cloudflare Pages watches the production branch of the GitHub repo and rebuilds on
every push. Nothing is uploaded by hand. Cloudflare account id:
`3869409b5f0d6bec2fa88ebf6106b5f1`.

If a push lands on GitHub but the site does not change, the Pages project has lost
its Git connection. Fix it at Cloudflare dashboard -> Workers & Pages -> the project
-> Settings -> Build -> Git repository -> Connect. If the repo is missing from the
dropdown, grant the Cloudflare Pages GitHub App access to it at
github.com/settings/installations. This has happened before on this account.

Custom domains are managed in the Pages project under Custom domains. DNS is
already on Cloudflare nameservers, so adding a subdomain there creates the DNS
record automatically. Give it a few minutes and expect browser/ISP DNS caching to
lag; testing in incognito does not bypass an OS-level DNS cache.

## The other sites in this family

| Repo | Live at | Stack |
|---|---|---|
| `TinyAnts/oliwia-portfolio` | oliwiakonieczna.info | static HTML, no build |
| `TinyAnts/oliwia-from-poland` | poland.oliwiakonieczna.info | Vite + React + TS |
| `TinyAnts/oliwia-yoga` | yoga.oliwiakonieczna.info | Vite + React + TS |
| `TinyAnts/career-copilot-360` | aivet.work | Vite + React + TS |
| `TinyAnts/raj-portfolio` | raj.aivet.work | Vite + React + TS |
