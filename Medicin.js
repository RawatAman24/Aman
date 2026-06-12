const cart = [];
function addToCart(name, price) {
  cart.push({ name, price });
  alert(name + " added to cart!");
  console.log(cart);
}
/*cart*/
function updateTotal() {
    const rows = document.querySelectorAll("#cartBody tr");
    let grandTotal = 0;
    rows.forEach((row) => {
        const priceText = row.cells[1].textContent.replace("₹", "");
        const price = parseInt(priceText, 10);
        const qty = parseInt(
            row.querySelector(".qty").value,
            10
        );
        const total = price * qty;
        row.querySelector(".itemTotal").textContent =
            "₹" + total;
        grandTotal += total;
    });
    document.getElementById("grandTotal").textContent =
        "Grand Total: ₹" + grandTotal;
}
/*payment*/
document.getElementById("paymentForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const paymentMethod = document.getElementById("paymentMethod").value;
    document.getElementById("message").textContent =
        "Thank you, " +
        name +
        "! Your order has been placed successfully using " +
        paymentMethod.toUpperCase() +
        ".";
});