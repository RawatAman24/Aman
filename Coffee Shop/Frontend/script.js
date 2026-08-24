// API Base URL - Update this based on where backend is running
const API_URL = 'http://localhost:5000/api';
// Global variables
let allProducts = [];
let cart = [];
let filteredProducts = [];
// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCartFromStorage();
    updateCartDisplay();
});
// Load products from backend API
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        allProducts = await response.json();
        filteredProducts = allProducts;
        displayProducts(allProducts);
    } catch (error) {
        console.log('Backend not running. Using local data.');
        // Use local data if backend is not available
        allProducts = [
            { id: 1, name: "Espresso", price: 3.50, description: "Strong and bold single shot espresso", category: "Espresso" },
            { id: 2, name: "Americano", price: 3.75, description: "Espresso with hot water", category: "Espresso" },
            { id: 3, name: "Cappuccino", price: 4.50, description: "Espresso with steamed milk and foam", category: "Milk Coffee" },
            { id: 4, name: "Latte", price: 4.75, description: "Espresso with plenty of steamed milk", category: "Milk Coffee" },
            { id: 5, name: "Mocha", price: 5.25, description: "Espresso, steamed milk, and chocolate", category: "Specialty" },
            { id: 6, name: "Macchiato", price: 4.25, description: "Espresso marked with milk foam", category: "Espresso" },
            { id: 7, name: "Iced Coffee", price: 4.00, description: "Chilled espresso with ice and milk", category: "Cold Beverages" },
            { id: 8, name: "Flat White", price: 4.75, description: "Espresso with velvety microfoam", category: "Milk Coffee" }
        ];
        filteredProducts = allProducts;
        displayProducts(allProducts);
    }
}

// Display products on the grid
function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = ''; 
    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No products found</p>';
        return;
    }
    products.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    // Generate emoji based on product name
    let emoji = '☕';
    if (product.name.includes('Iced')) emoji = '🧊';
    if (product.name.includes('Mocha')) emoji = '🍫';
    card.innerHTML = `
        <div class="product-image">${emoji}</div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add</button>
            </div>
        </div>
    `;
    return card;
}

// Filter products by category
function filterProducts(category) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    // Filter products
    if (category === 'All') {
        filteredProducts = allProducts;
    } else {
        filteredProducts = allProducts.filter(p => p.category === category);
    }
    displayProducts(filteredProducts);
}

// Add item to cart
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }
    saveCartToStorage();
    updateCartDisplay();
    showNotification(`${name} added to cart!`);
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const subtotal = document.getElementById('subtotal');
    const tax = document.getElementById('tax');
    const total = document.getElementById('total');
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Display cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        subtotal.textContent = '$0.00';
        tax.textContent = '$0.00';
        total.textContent = '$0.00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');
        // Calculate totals
        const subtotalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxAmount = subtotalAmount * 0.08;
        const totalAmount = subtotalAmount + taxAmount;
        subtotal.textContent = '$' + subtotalAmount.toFixed(2);
        tax.textContent = '$' + taxAmount.toFixed(2);
        total.textContent = '$' + totalAmount.toFixed(2);
    }
}
// Update item quantity
function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCartToStorage();
            updateCartDisplay();
        }
    }
}
// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCartToStorage();
    updateCartDisplay();
}
// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('active');
}
// Go to checkout
function goToCheckout() {
    if (cart.length === 0) {
        alert('Please add items to your cart first!');
        return;
    }
    toggleCart();
    document.getElementById('checkout-modal').classList.add('active');
}

// Close checkout
function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('active');
}
// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await placeOrder();
        });
    }
});

// Place order
async function placeOrder() {
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;   
    const orderData = {
        cart,
        customerInfo: { fullname, email, address, phone }
    };
    try {
        const response = await fetch(`${API_URL}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });  
        const result = await response.json();
        if (result.success) {
            showOrderConfirmation(result.orderId, result.estimatedDelivery);
            cart = [];
            saveCartToStorage();
            updateCartDisplay();
            closeCheckout();
        }
    } catch (error) {
        console.log('Using local order processing');
        // Simulate order placement if backend is not available
        const orderId = Math.floor(Math.random() * 100000);
        showOrderConfirmation(orderId, '30 minutes');
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        closeCheckout();
    }
}

// Show order confirmation
function showOrderConfirmation(orderId, deliveryTime) {
    document.getElementById('order-id').textContent = '#' + orderId;
    document.getElementById('delivery-time').textContent = deliveryTime;
    document.getElementById('confirmation-modal').classList.add('active');
}

// Close confirmation
function closeConfirmation() {
    document.getElementById('confirmation-modal').classList.remove('active');
}

// Scroll to menu
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// Local storage functions
function saveCartToStorage() {
    localStorage.setItem('coffeeShopCart', JSON.stringify(cart));
}
function loadCartFromStorage() {
    const saved = localStorage.getItem('coffeeShopCart');
    cart = saved ? JSON.parse(saved) : [];
}

// Show notification
function showNotification(message) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease-in;
    `;
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}
// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);