let products = [];
let cart = [];

function addProduct() {
  const name = document.getElementById('name').value;
  const price = parseFloat(document.getElementById('price').value);

  if (!name || isNaN(price)) {
    alert("Please enter valid product name and price.");
    return;
  }

  const product = { id: Date.now(), name, price };
  products.push(product);
  document.getElementById('name').value = '';
  document.getElementById('price').value = '';
  renderProducts();
  renderProductList();
}

function removeProduct(id) {
  products = products.filter(p => p.id !== id);
  renderProducts();
  renderProductList();
}

function renderProductList() {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `${p.name} - $${p.price.toFixed(2)} 
      <button onclick="removeProduct(${p.id})">Remove</button>`;
    list.appendChild(li);
  });
}

function renderProducts() {
  const container = document.getElementById('products');
  container.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <strong>${p.name}</strong> - $${p.price.toFixed(2)}
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  renderCart();
}

function renderCart() {
  const list = document.getElementById('cart-items');
  list.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `${item.name} - $${item.price.toFixed(2)} 
      <button onclick="removeFromCart(${index})">Remove</button>`;
    list.appendChild(li);
  });
  document.getElementById('total').textContent = total.toFixed(2);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}
