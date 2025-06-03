let products = [];

function saveProduct() {
  const name = document.getElementById('name').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const editIndex = document.getElementById('editIndex').value;

  if (!name || isNaN(price)) {
    alert("Please enter valid product name and price.");
    return;
  }

  if (editIndex === "") {
    // Add new product
    products.push({ name, price });
  } else {
    // Edit product
    products[editIndex] = { name, price };
    document.getElementById('editIndex').value = "";
  }

  document.getElementById('name').value = '';
  document.getElementById('price').value = '';
  renderProducts();
}

function renderProducts() {
  const tbody = document.getElementById('product-body');
  tbody.innerHTML = '';
  products.forEach((product, index) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.price.toFixed(2)}</td>
      <td>
        <button onclick="editProduct(${index})">Edit</button>
        <button onclick="deleteProduct(${index})">Delete</button>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function editProduct(index) {
  const product = products[index];
  document.getElementById('name').value = product.name;
  document.getElementById('price').value = product.price;
  document.getElementById('editIndex').value = index;
}

function deleteProduct(index) {
  if (confirm("Are you sure you want to delete this product?")) {
    products.splice(index, 1);
    renderProducts();
  }
}

// Initial render
renderProducts();
