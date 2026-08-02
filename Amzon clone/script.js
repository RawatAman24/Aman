document.addEventListener('DOMContentLoaded',()=>{
  const products = [
    {id:1,title:'Wireless Headphones',price:59.99},
    {id:2,title:'Smart Watch',price:99.99},
    {id:3,title:'Portable Speaker',price:29.99},
    {id:4,title:'Running Shoes',price:49.99},
    {id:5,title:'Sunglasses',price:19.99},
    {id:6,title:'Backpack',price:39.99},
    {id:7,title:'Coffee Maker',price:24.99},
    {id:8,title:'Desk Lamp',price:14.99}
  ];

  const grid = document.getElementById('productGrid');
  const cartBtn = document.getElementById('cartBtn');
  const cartPanel = document.getElementById('cart');
  const cartItemsEl = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const yearEl = document.getElementById('year');

  let cart = [];

  function renderProducts(){
    grid.innerHTML = '';
    products.forEach(p=>{
      const el = document.createElement('article');el.className='card';
      el.innerHTML = `<div class="thumb">📦</div><h3>${p.title}</h3><div class="price">$${p.price.toFixed(2)}</div><div class="actions"><button data-id="${p.id}" class="add">Add</button></div>`;
      grid.appendChild(el);
    });
  }

  function updateCartUI(){
    cartItemsEl.innerHTML = '';
    let total=0;
    cart.forEach(item=>{
      total += item.price * item.qty;
      const d = document.createElement('div');
      d.textContent = `${item.title} × ${item.qty} — $${(item.price*item.qty).toFixed(2)}`;
      cartItemsEl.appendChild(d);
    });
    cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
    cartTotal.textContent = total.toFixed(2);
  }

  grid.addEventListener('click',e=>{
    if(e.target.matches('button.add')){
      const id = Number(e.target.dataset.id);
      const prod = products.find(p=>p.id===id);
      const existing = cart.find(c=>c.id===id);
      if(existing) existing.qty++;
      else cart.push({...prod,qty:1});
      updateCartUI();
      cartPanel.setAttribute('aria-hidden','false');
    }
  });

  cartBtn.addEventListener('click',()=>{
    const hidden = cartPanel.getAttribute('aria-hidden') === 'true';
    cartPanel.setAttribute('aria-hidden', hidden ? 'false' : 'true');
  });

  document.getElementById('checkout')?.addEventListener('click',()=>{
    alert('Checkout demo — not implemented');
  });

  document.getElementById('menuBtn')?.addEventListener('click',()=>{
    const nav = document.getElementById('nav');
    if(nav.style.display === 'block') nav.style.display=''; else nav.style.display='block';
  });

  yearEl.textContent = new Date().getFullYear();
  renderProducts();
  updateCartUI();
});
document.addEventListener('DOMContentLoaded',()=>{
  const products = [
    {id:1,title:'Wireless Headphones',price:59.99},
    {id:2,title:'Smart Speaker',price:89.0},
    {id:3,title:'Fitness Tracker',price:39.99},
    {id:4,title:'Portable Charger',price:24.99},
    {id:5,title:'Sunglasses',price:19.99},
    {id:6,title:'Travel Backpack',price:49.99},
    {id:7,title:'Coffee Mug',price:12.0},
    {id:8,title:'Laptop Stand',price:29.99}
  ];

  const productGrid = document.getElementById('productGrid');
  const cartBtn = document.getElementById('cartBtn');
  const cartPanel = document.getElementById('cart');
  const cartItemsEl = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');

  let cart = [];

  function renderProducts(){
    productGrid.innerHTML = '';
    products.forEach(p=>{
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="thumb">📦</div>
        <h3>${p.title}</h3>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div class="actions">
          <button class="btn add" data-id="${p.id}">Add to cart</button>
        </div>`;
      productGrid.appendChild(card);
    });
  }

  function addToCart(id){
    const prod = products.find(p=>p.id===id);
    const item = cart.find(i=>i.id===id);
    if(item) item.qty++;
    else cart.push({id:prod.id,title:prod.title,price:prod.price,qty:1});
    updateCartUI();
  }

  function updateCartUI(){
    cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
    cartItemsEl.innerHTML = '';
    cart.forEach(i=>{
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `<div>${i.title} × ${i.qty}</div><div>$${(i.price*i.qty).toFixed(2)}</div>`;
      cartItemsEl.appendChild(row);
    });
    cartTotal.textContent = cart.reduce((s,i)=>s+i.qty*i.price,0).toFixed(2);
  }

  // event delegation for add buttons
  productGrid.addEventListener('click',e=>{
    const btn = e.target.closest('button.add');
    if(!btn) return;
    const id = Number(btn.dataset.id);
    addToCart(id);
  });

  cartBtn.addEventListener('click',()=>{
    const isHidden = cartPanel.getAttribute('aria-hidden') === 'true';
    cartPanel.setAttribute('aria-hidden', String(!isHidden));
  });

  menuBtn.addEventListener('click',()=>{
    if(nav.style.display==='flex') nav.style.display='none';
    else nav.style.display='flex';
  });

  // set current year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  renderProducts();
  updateCartUI();
});
