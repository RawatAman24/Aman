const $=s=>document.querySelector(s);
const getCart=()=>JSON.parse(localStorage.getItem("fammsCart")||"[]");
const saveCart=c=>{localStorage.setItem("fammsCart",JSON.stringify(c));
    updateCartCount()};
const getWish=()=>JSON.parse(localStorage.getItem("fammsWish")||"[]");
const saveWish=w=>localStorage.setItem("fammsWish",JSON.stringify(w));

function header(){
 const el=$("#header"); if(!el)return;
 el.innerHTML=`<header><div class="container nav">
 <a class="logo" href="index.html">FAMMS</a>
 <button class="hamb" onclick="document.querySelector('.navlinks').classList.toggle('open')">
 <i class="fa fa-bars"></i>
 </button>
 <nav class="navlinks"><a href="index.html">Home</a>
 <a href="shop.html">Shop</a>
 <a href="about.html">About</a>
 <a href="contact.html">Contact</a>
 <a href="wishlist.html"><i class="fa-regular fa-heart"></i></a>
 <a href="cart.html" class="cart-link"><i class="fa fa-cart-shopping"></i>
 <b id="cartCount">0</b></a>
 <a href="login.html">Login</a>
 </nav></div>
 </header>`;
 updateCartCount();
}
function footer(){
 const el=$("#footer"); if(!el)return;
 el.innerHTML=`<footer>
 <div class="container footer-grid"><div>
 <a class="logo" href="index.html">FAMMS</a>
 <p>Modern fashion for everyday life. Quality, comfort and style in one place.</p>
 </div>
 <div>
 <h3>Quick Links</h3>
 <a href="shop.html">Shop</a>
 <a href="about.html">About</a>
 <a href="wishlist.html">Wishlist</a>
 <a href="cart.html">Cart</a>
 </div>
 <div>
 <h3>Customer Care</h3>
 <a href="contact.html">Contact</a>
 <a href="#">Shipping</a>
 <a href="#">Returns</a>
 <a href="#">FAQ</a>
 </div>
 <div>
 <h3>Contact</h3>
 <p>Ahmedabad, Gujarat, India</p>
 <p>+91 98765 43210</p>
 <p>support@famms.example</p>
 </div>
 </div>
 <div class="copyright">© 2026 FAMMS. All Rights Reserved.</div>
 </footer>`;
}
function updateCartCount(){const e=$("#cartCount");
    if(e)e.textContent=getCart().reduce((a,x)=>a+x.qty,0)}
function card(p){
 const wish=getWish().includes(p.id);
 return `<article class="product-card"><a href="product.html?id=${p.id}" class="product-img">
 <img src="${p.img}" alt="${p.name}"></a>
 <div class="product-info">
 <div class="card-top">
 <span class="tag">${p.category}</span>
 <button class="heart" onclick="toggleWish(${p.id});event.preventDefault()">
 <i class="${wish?'fa-solid':'fa-regular'} fa-heart"></i>
 </button>
 </div>
 <h3>${p.name}</h3>
 <p class="price">$${p.price}</p>
 <button class="small-btn" onclick="addCart(${p.id})">Add to Cart</button>
 <a class="small-btn dark" href="product.html?id=${p.id}">View</a>
 </div>
 </article>`;
}
function renderProducts(list,target){const e=$(target);
    if(e)e.innerHTML=list.map(card).join("")||`<div class="empty">No products found.</div>`}
function addCart(id){
 const c=getCart(), p=products.find(x=>x.id===id), old=c.find(x=>x.id===id);
 old?old.qty++:c.push({id,qty:1}); saveCart(c); alert(p.name+" added to cart.");
}
function toggleWish(id){
 let w=getWish();w=w.includes(id)?w.filter(x=>x!==id):[...w,id];saveWish(w); location.reload();
}
function productPage(){
 const e=$("#productDetail");if(!e)return;
 const id=Number(new URLSearchParams(location.search).get("id"))||1,p=products.find(x=>x.id===id)||products[0];
 e.innerHTML=`<div class="product-detail"><div>
 <img src="${p.img}" alt="${p.name}"></div>
 <div>
 <p class="eyebrow">${p.category.toUpperCase()}</p>
 <h1>${p.name}</h1>
 <div class="rating">★★★★★ <span>(24 reviews)</span></div>
 <h2 class="big-price">$${p.price}</h2>
 <p>Premium quality fashion piece designed for comfort and everyday style. Free shipping available on qualifying orders.</p>
 <div class="quantity">
 <button onclick="this.nextElementSibling.stepDown()">−</button>
 <input type="number" value="1" min="1">
 <button onclick="this.previousElementSibling.stepUp()">+</button>
 </div>
 <button class="btn" onclick="addCart(${p.id})">Add to Cart</button>
 <button class="outline-btn" onclick="toggleWish(${p.id})">♡ Wishlist</button>
 <div class="product-meta"><p><b>Category:</b> ${p.category}</p>
 <p><b>Availability:</b> In Stock</p></div></div></div>`;
}
function cartPage(){
 const e=$("#cartItems"),s=$("#cartSummary");if(!e||!s)return;
 const c=getCart();
 if(!c.length){e.innerHTML=`<div class="empty"><h2>Your cart is empty</h2>
    <a class="btn" href="shop.html">Start Shopping</a></div>`;s.innerHTML="";
    return}
 let total=0;
 e.innerHTML=c.map(x=>{const p=products.find(y=>y.id===x.id),sub=p.price*x.qty;total+=sub;
    return `<div class="cart-row">
    <img src="${p.img}"><div>
    <h3>${p.name}</h3>
    <p>$${p.price} × ${x.qty}</p>
    <div>
    <button onclick="changeQty(${p.id},-1)">−</button>
    <button onclick="changeQty(${p.id},1)">+</button>
    <button class="remove" onclick="removeCart(${p.id})">Remove</button>
    </div>
    </div>
    <strong>$${sub.toFixed(2)}</strong></div>`}).join("");
 s.innerHTML=`<div class="cart-summary"><h2>Order Summary</h2><p>Subtotal <b>$${total.toFixed(2)}</b></p>
 <p>Shipping <b>Free</b></p>
 <hr><h3>Total <b>$${total.toFixed(2)}</b></h3>
 <a class="btn" href="checkout.html">Proceed to Checkout</a></div>`;
}
function changeQty(id,n){let c=getCart(),x=c.find(y=>y.id===id);x.qty+=n;if(x.qty<=0)c=c.filter(y=>y.id!==id);saveCart(c);cartPage()}
function removeCart(id){saveCart(getCart().filter(x=>x.id!==id));cartPage()}
function checkoutPage(){
 const e=$("#checkoutSummary");if(!e)return;const c=getCart();let t=0;
 e.innerHTML=c.map(x=>{const p=products.find(y=>y.id===x.id);t+=p.price*x.qty;return `<p>${p.name} × ${x.qty}<b>$${(p.price*x.qty).toFixed(2)}</b></p>`}).join("")+`<hr><h3>Total <b>$${t.toFixed(2)}</b></h3>`;
 const f=$("#checkoutForm");f?.addEventListener("submit",ev=>{ev.preventDefault();if(!c.length)return alert("Your cart is empty.");const order="FAMMS-"+Date.now().toString().slice(-6);localStorage.removeItem("fammsCart");alert("Order placed successfully! Order ID: "+order);location.href="index.html"});
}
function wishlistPage(){const e=$("#wishlistItems");if(e){const w=getWish();renderProducts(products.filter(p=>w.includes(p.id)),"#wishlistItems")}}
function shopPage(){
 const render=()=>{let list=[...products],q=($("#searchInput")?.value||"").toLowerCase(),cat=$("#categoryFilter")?.value||"all",sort=$("#sortSelect")?.value;
 list=list.filter(p=>(p.name.toLowerCase().includes(q)||p.category.includes(q))&&(cat==="all"||p.category===cat));
 if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);renderProducts(list,"#allProducts")};
 ["searchInput","categoryFilter","sortSelect"].forEach(id=>$("#"+id)?.addEventListener("input",render));render();
}
let reviewIndex=0;
function reviewPage(){const e=$("#review");if(e){const r=reviews[reviewIndex];e.innerHTML=`<div><div class="avatar">${r.name[0]}</div><h3>${r.name}</h3><span>${r.role}</span><p>“${r.text}”</p></div>`}}
function nextReview(){reviewIndex=(reviewIndex+1)%reviews.length;reviewPage()}
function prevReview(){reviewIndex=(reviewIndex-1+reviews.length)%reviews.length;reviewPage()}

document.addEventListener("DOMContentLoaded",()=>{
 header();footer();productPage();cartPage();checkoutPage();wishlistPage();shopPage();reviewPage();
 if($("#featuredProducts"))renderProducts(products.slice(0,8),"#featuredProducts");
 $("#newsletterForm")?.addEventListener("submit",e=>{e.preventDefault();alert("Thanks for subscribing!");e.target.reset()});
 $("#contactForm")?.addEventListener("submit",e=>{e.preventDefault();alert("Message sent successfully!");e.target.reset()});
 $("#loginForm")?.addEventListener("submit",e=>{e.preventDefault();alert("Demo login successful.");location.href="index.html"});
 $("#registerForm")?.addEventListener("submit",e=>{e.preventDefault();alert("Account created successfully.");location.href="login.html"});
});