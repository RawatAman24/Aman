const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sample Coffee Products Database
const coffeeProducts = [
  {
    id: 1,
    name: "Espresso",
    price: 3.50,
    image: "espresso.jpg",
    description: "Strong and bold single shot espresso",
    category: "Espresso"
  },
  {
    id: 2,
    name: "Americano",
    price: 3.75,
    image: "americano.jpg",
    description: "Espresso with hot water",
    category: "Espresso"
  },
  {
    id: 3,
    name: "Cappuccino",
    price: 4.50,
    image: "cappuccino.jpg",
    description: "Espresso with steamed milk and foam",
    category: "Milk Coffee"
  },
  {
    id: 4,
    name: "Latte",
    price: 4.75,
    image: "latte.jpg",
    description: "Espresso with plenty of steamed milk",
    category: "Milk Coffee"
  },
  {
    id: 5,
    name: "Mocha",
    price: 5.25,
    image: "mocha.jpg",
    description: "Espresso, steamed milk, and chocolate",
    category: "Specialty"
  },
  {
    id: 6,
    name: "Macchiato",
    price: 4.25,
    image: "macchiato.jpg",
    description: "Espresso marked with milk foam",
    category: "Espresso"
  },
  {
    id: 7,
    name: "Iced Coffee",
    price: 4.00,
    image: "iced-coffee.jpg",
    description: "Chilled espresso with ice and milk",
    category: "Cold Beverages"
  },
  {
    id: 8,
    name: "Flat White",
    price: 4.75,
    image: "flat-white.jpg",
    description: "Espresso with velvety microfoam",
    category: "Milk Coffee"
  }
];

let orders = [];

// Routes
app.get('/api/products', (req, res) => {
  res.json(coffeeProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = coffeeProducts.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});
app.post('/api/checkout', (req, res) => {
  const { cart, customerInfo } = req.body;
  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  const orderId = Math.floor(Math.random() * 100000);
  const order = {
    orderId,
    items: cart,
    customerInfo,
    orderDate: new Date(),
    status: 'Pending'
  };
  orders.push(order);
  res.json({
    success: true,
    orderId,
    message: 'Order placed successfully!',
    estimatedDelivery: '30 minutes'
  });
});
app.get('/api/orders/:orderId', (req, res) => {
  const order = orders.find(o => o.orderId === parseInt(req.params.orderId));
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});
app.listen(PORT, () => {
  console.log(`Coffee Shop API running on http://localhost:${PORT}`);
});
