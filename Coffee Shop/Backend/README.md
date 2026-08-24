# Coffee Haven Backend

Express.js API server for the Coffee Haven e-commerce website.

## Installation

1. Make sure you have Node.js installed (v14 or higher)
2. Navigate to this directory:
   ```
   cd Backend
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Running the Server

Start the development server:
```
npm start
```

Or with auto-restart on file changes (requires nodemon):
```
npm run dev
```

The server will start on `http://localhost:5000`

## Available Endpoints

### Products

#### GET /api/products
Get all coffee products

**Response:**
```json
[
  {
    "id": 1,
    "name": "Espresso",
    "price": 3.50,
    "image": "espresso.jpg",
    "description": "Strong and bold single shot espresso",
    "category": "Espresso"
  },
  ...
]
```

#### GET /api/products/:id
Get a specific product by ID

**Example:** `/api/products/1`

**Response:**
```json
{
  "id": 1,
  "name": "Espresso",
  "price": 3.50,
  "image": "espresso.jpg",
  "description": "Strong and bold single shot espresso",
  "category": "Espresso"
}
```

### Orders

#### POST /api/checkout
Place a new order

**Request Body:**
```json
{
  "cart": [
    {
      "id": 1,
      "name": "Espresso",
      "price": 3.50,
      "quantity": 2
    }
  ],
  "customerInfo": {
    "fullname": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "phone": "555-1234"
  }
}
```

**Response:**
```json
{
  "success": true,
  "orderId": 45678,
  "message": "Order placed successfully!",
  "estimatedDelivery": "30 minutes"
}
```

#### GET /api/orders/:orderId
Get order details

**Example:** `/api/orders/45678`

**Response:**
```json
{
  "orderId": 45678,
  "items": [
    {
      "id": 1,
      "name": "Espresso",
      "price": 3.50,
      "quantity": 2
    }
  ],
  "customerInfo": {
    "fullname": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "phone": "555-1234"
  },
  "orderDate": "2024-08-11T10:30:00.000Z",
  "status": "Pending"
}
```

## Configuration

Edit `server.js` to:
- Change the PORT (default: 5000)
- Modify products catalog
- Add new routes

## Database Notes

Currently, data is stored in-memory:
- Products: Static array (can be replaced with database)
- Orders: Stored in `orders` array (not persistent between restarts)

To add persistent storage, consider:
- **MongoDB**: NoSQL database
- **PostgreSQL**: SQL database
- **SQLite**: Lightweight SQL database
- **Firebase**: Cloud database

## CORS Settings

By default, CORS is enabled for all origins. To restrict to specific domains:

```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

## Troubleshooting

### Port 5000 already in use
Change the PORT variable in server.js to another port (e.g., 5001)

### Module not found errors
Run `npm install` to ensure all dependencies are installed

### CORS errors
Make sure the frontend is making requests to the correct API URL
