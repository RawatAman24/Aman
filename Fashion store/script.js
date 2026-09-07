let cartCount = 0;
function addToCart() {
    cartCount++;
    document.getElementById("cartCount").innerText =
        cartCount;
    alert("Product added to cart 🛍️");
}