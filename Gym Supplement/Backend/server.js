const path = require("path");
const express = require("express");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "..", "Frontend");
const imagesPath = path.join(__dirname, "..", "..", "images");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "gym-supplement-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
  })
);

app.use("/images", express.static(imagesPath));
app.use(express.static(publicPath));

const products = [
  { id: "whey-protein", name: "Premium Whey Protein", price: 2499, image: "/images/Whey Prorein.jpg" },
  { id: "creatine", name: "Premium Creatine", price: 999, image: "/images/creatine.jpg" },
  { id: "pre-workout", name: "Premium Pre Workout", price: 1599, image: "/images/preworkout.jpg" },
  { id: "mass-gainer", name: "Premium Mass Gainer", price: 3299, image: "/images/mass gainer.jpg" },
  { id: "bcaa", name: "Premium BCAA", price: 1299, image: "/images/bcaa.jpg" },
  { id: "fish-oil", name: "Premium Fish Oil", price: 799, image: "/images/fish oil.jpg" },
  { id: "multivitamins", name: "Premium Multivitamins", price: 999, image: "/images/Multivitamins.jpg" },
  { id: "shaker", name: "Shaker", price: 299, image: "/images/Shakers.jpg" },
  { id: "gym-gloves", name: "Gym Gloves", price: 399, image: "/images/Gym Gloves.jpg" },
  { id: "gym-bag", name: "Gym Bag", price: 599, image: "/images/GYM Bags.jpg" },
  { id: "adjustable-dumbbell", name: "Adjustable Dumbbell", price: 7999, image: "/images/Adjustable Dumbbell.jpg" },
  { id: "yoga-mat", name: "Yoga Mat", price: 499, image: "/images/Mat.jpg" }
];

const users = [];

function getSessionCart(req) {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  return req.session.cart;
}

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/cart", (req, res) => {
  const cart = getSessionCart(req);
  const count = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  res.json({ cart, count });
});

app.post("/api/cart", (req, res) => {
  const { name, price, image, quantity = 1 } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Product name and price are required." });
  }
  const cart = getSessionCart(req);
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity = Number(existing.quantity || 0) + Number(quantity);
  } else {
    cart.push({ name, price: Number(price), image: image || "", quantity: Number(quantity) });
  }
  res.json({ message: "Product added to cart.", cart });
});

app.put("/api/cart/:index", (req, res) => {
  const index = Number(req.params.index);
  const { action, quantity } = req.body;
  const cart = getSessionCart(req);
  if (Number.isNaN(index) || index < 0 || index >= cart.length) {
    return res.status(400).json({ message: "Invalid cart item index." });
  }
  if (action === "increase") {
    cart[index].quantity = Number(cart[index].quantity || 0) + 1;
  } else if (action === "decrease") {
    if (cart[index].quantity > 1) {
      cart[index].quantity = Number(cart[index].quantity || 0) - 1;
    } else {
      cart.splice(index, 1);
    }
  } else if (action === "set") {
    const qty = Number(quantity || 0);
    if (qty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = qty;
    }
  }
  res.json({ cart });
});

app.delete("/api/cart/:index", (req, res) => {
  const index = Number(req.params.index);
  const cart = getSessionCart(req);
  if (Number.isNaN(index) || index < 0 || index >= cart.length) {
    return res.status(400).json({ message: "Invalid cart item index." });
  }
  cart.splice(index, 1);
  res.json({ message: "Item removed from cart.", cart });
});

app.post("/api/buy-now", (req, res) => {
  const { name, price, image, quantity = 1 } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: "Product name and price are required." });
  }
  req.session.buyNowItem = { name, price: Number(price), image: image || "", quantity: Number(quantity) };
  res.json({ message: "Buy now item saved." });
});

app.get("/api/checkout-data", (req, res) => {
  const buyNowItem = req.session.buyNowItem || null;
  const cart = getSessionCart(req);
  const items = buyNowItem ? [buyNowItem] : cart;
  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  res.json({ items, total });
});

app.post("/api/checkout", (req, res) => {
  const { billing } = req.body;
  const items = req.session.buyNowItem ? [req.session.buyNowItem] : getSessionCart(req);
  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items available for checkout." });
  }
  if (!billing || !billing.name || !billing.email || !billing.phone || !billing.address) {
    return res.status(400).json({ message: "Billing details are incomplete." });
  }
  req.session.cart = [];
  req.session.buyNowItem = null;
  res.json({ message: "Order placed successfully." });
});

app.post("/api/register", (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(409).json({ message: "User already exists." });
  }
  users.push({ name, email, phone, password });
  res.json({ message: "Registration successful." });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  req.session.user = { name: user.name, email: user.email };
  res.json({ message: "Login successful.", user: req.session.user });
});

app.get("/api/session", (req, res) => {
  if (req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  res.json({ loggedIn: false });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "Home.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
