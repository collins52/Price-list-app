// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}

// DOM elements
const doneBtn = document.getElementById('done-button');
const addButton = document.getElementById('Add');
const inputContainer = document.getElementById('input-container');
const blurBackground = document.getElementById('blurBackground');
const searchInput = document.getElementById('search');
const productList = document.getElementById('product-list');

let allProducts = [];

// Show input form
addButton.addEventListener('click', () => {
  inputContainer.style.display = 'flex';
  blurBackground.style.display = 'block';
});

// Hide input form
blurBackground.addEventListener('click', () => {
  blurBackground.style.display = 'none';
  inputContainer.style.display = 'none';
});

// Add new product
doneBtn.addEventListener('click', async () => {
  const name = document.getElementById('product-name').value;
  const price = parseFloat(document.getElementById('price').value);
  const imageFile = document.getElementById('productImage').files[0];

  if (!name || isNaN(price)) {
    alert('Please enter product name and price.');
    return;
  }

  let imageUrl = "";
  if (imageFile) {
    const storageRef = storage.ref().child("product-images/" + imageFile.name);
    await storageRef.put(imageFile);
    imageUrl = await storageRef.getDownloadURL();
  }

  const product = {
    name,
    price,
    imageUrl,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  try {
    await db.collection('products').add(product);
    alert('Product added');
    document.getElementById('product-name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('productImage').value = '';
  } catch (error) {
    console.error('Error adding product:', error);
  }
});

// Real-time listener
db.collection("products").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
  allProducts = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    data.id = doc.id;
    allProducts.push(data);
  });

  console.log("Products fetched:", allProducts.length);
  displayProducts(allProducts);
});

// Display products
function displayProducts(products) {
  productList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>${product.name} - ₦${product.price}</div>
      ${product.imageUrl ? `<img src="${product.imageUrl}" width="100px">` : ''}
      <button onclick="deleteProduct('${product.id}')">Delete</button>
    `;
    productList.appendChild(li);
  });
}

// Filter search
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
  displayProducts(filtered);
});

// Delete product
async function deleteProduct(id) {
  if (confirm("Delete this product?")) {
    try {
      await db.collection("products").doc(id).delete();
      alert("Product deleted");
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Delete failed");
    }
  }
}

window.addEventListener('offline', () => alert('You are now offline'));
window.addEventListener('online', () => alert('You are back online'));
