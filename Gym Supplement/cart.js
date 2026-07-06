const cartKey = "cart";
const buyNowKey = "buyNow";
function getCart() {
    const data = localStorage.getItem(cartKey);
    if (!data) {
        return [];
    }
    try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}
function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}
function getBuyNowItem() {
    const data = localStorage.getItem(buyNowKey);
    if (!data) {
        return null;
    }
    try {
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}
function clearBuyNowItem() {
    localStorage.removeItem(buyNowKey);
}
function formatPrice(value) {
    const number = Number(value) || 0;
    return `₹${number.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    document.querySelectorAll("#cartCount").forEach(el => {
        el.textContent = count;
    });
}
function addToCart(name, price, image) {
    const cart = getCart();
    const productPrice = Number(price) || 0;
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity = Number(existing.quantity || 0) + 1;
    } else {
        cart.push({
            name,
            price: productPrice,
            image: image || "",
            quantity: 1
        });
    }
    saveCart(cart);
    updateCartCount();
    alert(`${name} added to cart!`);
}
function buyNow(name, price, image) {
    localStorage.setItem(buyNowKey, JSON.stringify({
        name,
        price: Number(price) || 0,
        image: image || "",
        quantity: 1
    }));
    window.location.href = "Checkout.html";
}
function removeItem(index) {
    const cart = getCart();
    if (!cart[index]) {
        return;
    }
    if (!confirm("Remove this product from cart?")) {
        return;
    }
    cart.splice(index, 1);
    saveCart(cart);
    updateCartCount();
    renderCartPage();
}
function increaseQty(index) {
    const cart = getCart();
    if (!cart[index]) {
        return;
    }
    cart[index].quantity = Number(cart[index].quantity || 0) + 1;
    saveCart(cart);
    updateCartCount();
    renderCartPage();
}
function decreaseQty(index) {
    const cart = getCart();
    if (!cart[index]) {
        return;
    }
    if (cart[index].quantity > 1) {
        cart[index].quantity = Number(cart[index].quantity || 0) - 1;
    } else {
        cart.splice(index, 1);
    }
    saveCart(cart);
    updateCartCount();
    renderCartPage();
}
function renderCartPage() {
    const table = document.getElementById("cartItems");
    const grandTotalElement = document.getElementById("grandTotal");
    if (!table || !grandTotalElement) {
        return;
    }
    const cart = getCart();
    table.innerHTML = "";
    let grandTotal = 0;
    if (cart.length === 0) {
        table.innerHTML = `<tr><td colspan="6">Your cart is empty.</td></tr>`;
        grandTotalElement.textContent = "₹0";
        return;
    }
    cart.forEach((item, index) => {
        const subtotal = Number(item.price) * Number(item.quantity);
        grandTotal += subtotal;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${item.image}" width="80" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>${formatPrice(item.price)}</td>
            <td>
                <button type="button" onclick="decreaseQty(${index})">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button type="button" onclick="increaseQty(${index})">+</button>
            </td>
            <td>${formatPrice(subtotal)}</td>
            <td><button type="button" onclick="removeItem(${index})">Remove</button></td>
        `;
        table.appendChild(row);
    });
    grandTotalElement.textContent = formatPrice(grandTotal);
}
function renderCheckoutPage() {
    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutTotal = document.getElementById("checkoutTotal");
    if (!checkoutItems || !checkoutTotal) {
        return;
    }
    const buyNowItem = getBuyNowItem();
    const cart = getCart();
    const items = buyNowItem ? [buyNowItem] : cart;
    checkoutItems.innerHTML = "";
    let total = 0;
    if (items.length === 0) {
        checkoutItems.innerHTML = `<p>Your cart is empty.</p>`;
        checkoutTotal.textContent = "₹0";
        return;
    }
    items.forEach(item => {
        const subtotal = Number(item.price) * Number(item.quantity);
        total += subtotal;
        const productDiv = document.createElement("div");
        productDiv.className = "summary-product";
        productDiv.innerHTML = `
            <img src="${item.image}" width="80" alt="${item.name}">
            <div>
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price)}</p>
                <p>Qty: ${item.quantity}</p>
            </div>
        `;
        checkoutItems.appendChild(productDiv);
    });
    checkoutTotal.textContent = formatPrice(total);
}
function handleCheckoutForm() {
    const form = document.getElementById("checkoutForm");
    if (!form) {
        return;
    }
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("🎉 Order Placed Successfully!");
        saveCart([]);
        clearBuyNowItem();
        updateCartCount();
        window.location.href = "Home.html";
    });
}
function handleLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) {
        return;
    }
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const userData = localStorage.getItem("user");
        if (!userData) {
            alert("Please register first!");
            window.location.href = "Registration.html";
            return;
        }
        const user = JSON.parse(userData);
        if (email === user.email && password === user.password) {
            alert("🎉 Login Successful!");
            window.location.href = "Home.html";
        } else {
            alert("Invalid Email or Password");
        }
    });
}
function handleRegistrationForm() {
    const form = document.getElementById("registerForm");
    if (!form) {
        return;
    }
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const phone = document.getElementById("registerPhone").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("registerConfirmPassword").value;
        if (!name || !email || !phone || !password) {
            alert("Please complete all registration fields.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        const user = { name, email, phone, password };
        localStorage.setItem("user", JSON.stringify(user));
        alert("Registration Successful!");
        window.location.href = "Login.html";
    });
}
function initPage() {
    updateCartCount();
    renderCartPage();
    renderCheckoutPage();
    handleCheckoutForm();
    handleLoginForm();
    handleRegistrationForm();
}
document.addEventListener("DOMContentLoaded", initPage);
window.addToCart = addToCart;
window.buyNow = buyNow;
window.removeItem = removeItem;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
