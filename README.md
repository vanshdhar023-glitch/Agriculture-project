# AgriPrice Hub

## Cloudflare Turnstile

1. Create a Turnstile widget in the Cloudflare dashboard and allow the hostnames used by the app (for local development, add `localhost`).
2. Copy `.env.example` to `.env` and set `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` to the keys for that widget.
3. Start the app with `npm start` using Node.js 20.6 or newer, then open `http://127.0.0.1:3000`.

Registration tokens are verified server-side with Cloudflare before the account is created. Login uses a six-character alphanumeric challenge instead. The Turnstile secret key is read only by the Node server; do not commit `.env` or expose the secret in frontend code. If the keys are missing, registration is unavailable and fails closed.

## Mandi Prices API Pagination

`GET /api/mandi-prices` accepts a 1-based `page` and a `limit` from 1 to 250. The default limit is 100. Existing filters such as `state`, `crop`, `category`, `mandiType`, `sort`, and `search` can be combined with pagination.

```text
GET /api/mandi-prices?state=Punjab&page=1&limit=50
```

Responses include `total` matching records, the current `page`, the effective `limit`, and the number of `pages`, alongside the page's `data`.