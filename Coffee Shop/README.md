# ☕ Coffee Haven - E-Commerce Coffee Shop Website

A modern, fully-functional e-commerce website for a coffee shop with frontend and backend components.

## Features

✨ **Product Catalog**
- Browse 8+ premium coffee products
- Filter by category (Espresso, Milk Coffee, Cold Beverages, Specialty)
- Detailed product descriptions and pricing

🛒 **Shopping Cart**
- Add/remove items dynamically
- Update quantities
- Real-time cart total calculations
- Persistent cart (saved in browser)

💳 **Checkout System**
- Customer information form
- Order confirmation with order ID
- Estimated delivery time display

🎨 **Responsive Design**
- Works on desktop, tablet, and mobile
- Modern UI with smooth animations
- Professional color scheme (coffee browns and creams)

## Project Structure

```
Coffee Shop/
├── Frontend/
│   ├── Home.html          # Main website page
│   ├── style.css          # Styling and responsive design
│   └── script.js          # Frontend functionality
└── Backend/
    ├── server.js          # Express.js API server
    ├── package.json       # Node.js dependencies
    └── README.md          # Backend documentation
```

## Getting Started

### Frontend Only (No Backend Required)

1. Open `Frontend/Home.html` in your browser
2. The website will work with local product data
3. Orders will be simulated without a backend

### With Backend (Full Setup)

#### Step 1: Set up Backend

1. Navigate to the `Backend` folder:
   ```
   cd "Coffee Shop/Backend"
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   
   The server will run on `http://localhost:5000`

#### Step 2: Open Frontend

1. Open `Frontend/Home.html` in your browser
2. The website will connect to the backend API
3. Products and orders will be handled by the server

## Usage Guide

### Navigation
- **Home**: Scroll to see the hero section and overview
- **Menu**: Browse all coffee products
- **About**: Learn about Coffee Haven
- **Contact**: View contact information
- **Cart**: Click the cart icon to view your shopping cart

### Shopping
1. Browse products and click **Add** button
2. Adjust quantities in the cart
3. Click **Proceed to Checkout**
4. Fill in your information
5. Click **Place Order**
6. Get your order confirmation with order ID

## Available Products

1. **Espresso** - $3.50
2. **Americano** - $3.75
3. **Cappuccino** - $4.50
4. **Latte** - $4.75
5. **Mocha** - $5.25
6. **Macchiato** - $4.25
7. **Iced Coffee** - $4.00
8. **Flat White** - $4.75

## Technical Details

### Frontend Technologies
- **HTML5**: Semantic markup
- **CSS3**: Responsive design with flexbox and grid
- **JavaScript (Vanilla)**: No dependencies required
- **LocalStorage**: Cart persistence

### Backend Technologies
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **CORS**: Cross-origin resource sharing

### API Endpoints

#### GET /api/products
Get all available products
```json
Response: [
  { id, name, price, description, category, image },
  ...
]
```

#### GET /api/products/:id
Get a specific product

#### POST /api/checkout
Place an order
```json
Body: {
  cart: [{ id, name, price, quantity }],
  customerInfo: { fullname, email, address, phone }
}
Response: {
  success: true,
  orderId: number,
  estimatedDelivery: string
}
```

#### GET /api/orders/:orderId
Get order details

## Customization

### Add More Products
Edit the `coffeeProducts` array in `Backend/server.js`:
```javascript
const coffeeProducts = [
  {
    id: 9,
    name: "Your Coffee Name",
    price: 5.99,
    description: "Description",
    category: "Category"
  },
  ...
];
```

### Change Colors
Modify the CSS variables in `Frontend/style.css`:
- Primary color: `#2c1810` (Dark brown)
- Accent color: `#d4a574` (Light brown)

### Modify Contact Info
Update the contact section in `Frontend/Home.html`

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers

## Notes

- Cart data is saved locally in the browser
- Orders are stored in backend memory (not persistent)
- Refresh browser returns to fresh state
- No database setup required for basic testing

## Future Enhancements

- [ ] User authentication
- [ ] Payment gateway integration
- [ ] Database integration (MongoDB/SQL)
- [ ] Order history and tracking
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Search functionality
- [ ] Wishlist feature

## License

Free to use and modify for educational purposes.

## Support

For issues or questions, check:
1. Backend is running on port 5000
2. Browser console for JavaScript errors
3. Network tab for API call issues

---

**Enjoy your Coffee Haven! ☕**
