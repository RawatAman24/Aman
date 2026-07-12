const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- In-memory "database" ----------
// Replace with a real DB (MongoDB/MySQL/Postgres) for production use.
const users = []; // { id, name, email, phone, passwordHash }
const orders = []; // { id, userEmail, billing, items, total, createdAt }

// ---------- Middleware ----------
app.use(express.json());
app.use(
  session({
    secret: "change-this-secret-in-production",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      // secure: true, // enable when serving over HTTPS
    },
  })
);

// Serve the frontend files directly (place the Frontend folder contents in /public)
app.use(express.static(path.join(__dirname, "public")));

// Ensure every session has a cart array
app.use((req, res, next) => {
  if (!req.session.cart) req.session.cart = [];
  next();
});

// ---------- Helpers ----------
function cartCount(cart) {
  return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
}

function findUserByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

// ---------- Cart routes ----------

// GET /api/cart -> { cart, count }
app.get("/api/cart", (req, res) => {
  res.json({ cart: req.session.cart, count: cartCount(req.session.cart) });
});

// POST /api/cart -> add item { name, price, image, quantity }
app.post("/api/cart", (req, res) => {
  const { name, price, image, quantity } = req.body || {};

  if (!name || typeof price !== "number") {
    return res.status(400).json({ message: "Product name and price are required." });
  }

  const qty = Number(quantity) > 0 ? Number(quantity) : 1;
  const existing = req.session.cart.find((item) => item.name === name);

  if (existing) {
    existing.quantity += qty;
  } else {
    req.session.cart.push({ name, price: Number(price), image: image || "", quantity: qty });
  }

  res.status(201).json({ message: "Added to cart.", cart: req.session.cart, count: cartCount(req.session.cart) });
});

// PUT /api/cart/:index -> { action: "increase" | "decrease" }
app.put("/api/cart/:index", (req, res) => {
  const index = Number(req.params.index);
  const { action } = req.body || {};
  const cart = req.session.cart;

  if (!cart[index]) {
    return res.status(404).json({ message: "Cart item not found." });
  }

  if (action === "increase") {
    cart[index].quantity += 1;
  } else if (action === "decrease") {
    cart[index].quantity -= 1;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  } else {
    return res.status(400).json({ message: "Invalid action." });
  }

  res.json({ message: "Cart updated.", cart, count: cartCount(cart) });
});

// DELETE /api/cart/:index
app.delete("/api/cart/:index", (req, res) => {
  const index = Number(req.params.index);
  const cart = req.session.cart;

  if (!cart[index]) {
    return res.status(404).json({ message: "Cart item not found." });
  }

  cart.splice(index, 1);
  res.json({ message: "Item removed.", cart, count: cartCount(cart) });
});

// ---------- Buy Now ----------
// POST /api/buy-now -> stashes a single-item "buy now" cart for checkout
app.post("/api/buy-now", (req, res) => {
  const { name, price, image, quantity } = req.body || {};

  if (!name || typeof price !== "number") {
    return res.status(400).json({ message: "Product name and price are required." });
  }

  const qty = Number(quantity) > 0 ? Number(quantity) : 1;
  req.session.buyNowItem = { name, price: Number(price), image: image || "", quantity: qty };

  res.status(201).json({ message: "Ready for checkout." });
});

// ---------- Checkout ----------

// GET /api/checkout-data -> items to display on the checkout page
// Uses the "buy now" item if present, otherwise the full cart.
app.get("/api/checkout-data", (req, res) => {
  const items = req.session.buyNowItem ? [req.session.buyNowItem] : req.session.cart;
  res.json({ items });
});

// POST /api/checkout -> { billing } places the order
app.post("/api/checkout", (req, res) => {
  const { billing } = req.body || {};

  if (!billing || !billing.name || !billing.email || !billing.address) {
    return res.status(400).json({ message: "Billing details are incomplete." });
  }

  const items = req.session.buyNowItem ? [req.session.buyNowItem] : req.session.cart;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty." });
  }

  const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

  const order = {
    id: orders.length + 1,
    userEmail: billing.email,
    billing,
    items,
    total,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);

  // Clear cart / buy-now state after successful order
  req.session.cart = [];
  delete req.session.buyNowItem;

  res.status(201).json({ message: "Order placed successfully!", orderId: order.id });
});

// ---------- Auth ----------

// POST /api/register -> { name, email, phone, password }
app.post("/api/register", (req, res) => {
  const { name, email, phone, password } = req.body || {};

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "Please complete all registration fields." });
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = { id: users.length + 1, name, email, phone, passwordHash };
  users.push(user);

  res.status(201).json({ message: "Registration successful!" });
});

// POST /api/login -> { email, password }
app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  req.session.user = { id: user.id, name: user.name, email: user.email };
  res.json({ message: "Login successful!" });
});

// POST /api/logout
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out." });
  });
});

// ---------- Fallback ----------
app.use((req, res) => {
  res.status(404).json({ message: "Not found." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
