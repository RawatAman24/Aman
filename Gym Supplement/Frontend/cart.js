const API = {
  cart: "/api/cart",
  buyNow: "/api/buy-now",
  checkout: "/api/checkout",
  checkoutData: "/api/checkout-data",
  register: "/api/register",
  login: "/api/login"
};

function formatPrice(value) {
  const number = Number(value) || 0;
  return `₹${number.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

async function getCart() {
  const data = await apiRequest(API.cart);
  return data.cart || [];
}

async function updateCartCount() {
  try {
    const data = await apiRequest(API.cart);
    const count = data.count || 0;
    document.querySelectorAll("#cartCount").forEach(el => {
      el.textContent = count;
    });
  } catch (error) {
    console.error(error);
  }
}

async function addToCart(name, price, image) {
  try {
    await apiRequest(API.cart, {
      method: "POST",
      body: JSON.stringify({ name, price: Number(price) || 0, image: image || "", quantity: 1 })
    });
    updateCartCount();
    alert(`${name} added to cart!`);
  } catch (error) {
    alert(error.message);
  }
}

async function buyNow(name, price, image) {
  try {
    await apiRequest(API.buyNow, {
      method: "POST",
      body: JSON.stringify({ name, price: Number(price) || 0, image: image || "", quantity: 1 })
    });
    window.location.href = "Checkout.html";
  } catch (error) {
    alert(error.message);
  }
}

async function removeItem(index) {
  if (!confirm("Remove this product from cart?")) {
    return;
  }
  try {
    await apiRequest(`${API.cart}/${index}`, { method: "DELETE" });
    updateCartCount();
    renderCartPage();
  } catch (error) {
    alert(error.message);
  }
}

async function increaseQty(index) {
  try {
    await apiRequest(`${API.cart}/${index}`, {
      method: "PUT",
      body: JSON.stringify({ action: "increase" })
    });
    updateCartCount();
    renderCartPage();
  } catch (error) {
    alert(error.message);
  }
}

async function decreaseQty(index) {
  try {
    await apiRequest(`${API.cart}/${index}`, {
      method: "PUT",
      body: JSON.stringify({ action: "decrease" })
    });
    updateCartCount();
    renderCartPage();
  } catch (error) {
    alert(error.message);
  }
}

async function renderCartPage() {
  const table = document.getElementById("cartItems");
  const grandTotalElement = document.getElementById("grandTotal");
  if (!table || !grandTotalElement) {
    return;
  }

  try {
    const data = await apiRequest(API.cart);
    const cart = data.cart || [];
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
  } catch (error) {
    table.innerHTML = `<tr><td colspan="6">Unable to load cart.</td></tr>`;
    grandTotalElement.textContent = "₹0";
  }
}

async function renderCheckoutPage() {
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");
  if (!checkoutItems || !checkoutTotal) {
    return;
  }

  try {
    const data = await apiRequest(API.checkoutData);
    const items = data.items || [];
    let total = 0;
    checkoutItems.innerHTML = "";

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
  } catch (error) {
    checkoutItems.innerHTML = `<p>Unable to load checkout details.</p>`;
    checkoutTotal.textContent = "₹0";
  }
}

function handleCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const billing = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      state: document.getElementById("state").value.trim(),
      pincode: document.getElementById("pincode").value.trim(),
      payment: document.getElementById("payment").value
    };

    try {
      const result = await apiRequest(API.checkout, {
        method: "POST",
        body: JSON.stringify({ billing })
      });
      alert(result.message || "Order placed successfully!");
      updateCartCount();
      window.location.href = "Home.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

function handleLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const result = await apiRequest(API.login, {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      alert(result.message || "Login successful!");
      window.location.href = "Home.html";
    } catch (error) {
      alert(error.message);
    }
  });
}

function handleRegistrationForm() {
  const form = document.getElementById("registerForm");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async e => {
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

    try {
      const result = await apiRequest(API.register, {
        method: "POST",
        body: JSON.stringify({ name, email, phone, password })
      });
      alert(result.message || "Registration successful!");
      window.location.href = "Login.html";
    } catch (error) {
      alert(error.message);
    }
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
