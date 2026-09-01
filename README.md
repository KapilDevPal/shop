# Indian Space Hub Store
# shop.indianspacehub.com

Official merchandise store for [Indian Space Hub](https://indianspacehub.com) — ISRO-inspired apparel, collectibles, and toys.

## Tech Stack

- **Framework**: Vite + React 18
- **Styling**: Tailwind CSS v3
- **API**: Rails 8 backend at `https://indianspacehub.com/api/v1`
- **Hosting**: GitHub Pages (custom domain: `shop.indianspacehub.com`)

## Local Development

```bash
npm install
npm run dev         # http://localhost:5173
```

## Production Deploy

Push to `main` → GitHub Actions builds + deploys automatically to GitHub Pages.

## API Integration

Fetches merchandise products from:
- `GET /api/v1/space/store_products?is_merchandise=true`
- `POST /api/v1/space/product_interests`

See [Integration Guide](#) for full API documentation.

## Custom Domain DNS Setup

Add this `CNAME` record at your domain registrar:

| Type  | Host   | Value                    |
|-------|--------|--------------------------|
| CNAME | `shop` | `kapildevpal.github.io`  |

Then enable **"Enforce HTTPS"** in: GitHub repo → Settings → Pages.
