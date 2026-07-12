# E-Commerce Backend (Node.js / Express)

This backend was built to match the API your frontend (`cart.js`) already calls:

| Method | Route | Purpose |
|---|---|---|
| GET | /api/cart | Get current cart + item count |
| POST | /api/cart | Add item `{ name, price, image, quantity }` |
| PUT | /api/cart/:index | Update quantity `{ action: "increase" | "decrease" }` |
| DELETE | /api/cart/:index | Remove item |
| POST | /api/buy-now | Stash a single item for immediate checkout |
| GET | /api/checkout-data | Items to show on checkout page |
| POST | /api/checkout | Place order `{ billing: {...} }` |
| POST | /api/register | Create account `{ name, email, phone, password }` |
| POST | /api/login | Log in `{ email, password }` |
| POST | /api/logout | Destroy session |

## How it works
- **Sessions**: `express-session` gives each browser a cart that persists across requests via a cookie — no login required to use the cart.
- **Passwords**: hashed with `bcryptjs` before storage.
- **Storage**: everything (`users`, `orders`, cart) is currently kept in memory as plain JS arrays inside `server.js`. This is great for testing but **resets whenever the server restarts** and won't work if you deploy multiple server instances. Swap in a real database (MongoDB, PostgreSQL, MySQL) for production — the route logic stays the same, just replace the array operations with DB queries.
- **Frontend**: the `public/` folder contains your original HTML/CSS/JS, served directly by Express, so opening `http://localhost:3000/Home.html` runs the whole app end-to-end against this backend.

## Setup
```bash
npm install
npm start
```
Server runs at `http://localhost:3000`.

## Notes / things to change before production
1. Set a strong, random `secret` for `express-session` (currently a placeholder) — ideally from an environment variable.
2. Set `cookie.secure = true` once you're serving over HTTPS.
3. Replace the in-memory `users`/`orders`/cart arrays with a real database.
4. Add input validation/sanitization as needed (basic checks are included, but harden for production use).
5. Consider adding authentication middleware for the checkout route if you want to require login before ordering.
