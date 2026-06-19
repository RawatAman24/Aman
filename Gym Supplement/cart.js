function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({
        name: name,
        price: price,
        image: image,
        quantity: 1
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart successfully!");
}

/*buy now*/
function buyNow(name, price, image) {
    // Create an order with one product
    const order = {
        name: name,
        price: price,
        image: image,
        quantity: 1
    };
    // Save to localStorage
    localStorage.setItem("buyNowProduct", JSON.stringify(order));
    // Redirect to checkout page
    window.location.href = "checkout.html";
}