// script.js

// Service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.log('Service Worker registration failed:', err));
}

// Wait for Firebase to be ready
document.addEventListener("firebase-ready", () => {

  const doneBtn = document.getElementById('done-button');
  const addButton = document.getElementById('Add');
  const inputContainer = document.getElementById('input-container');
  const blurBackground = document.getElementById('blurBackground');
  const searchInput = document.getElementById('search');
  const productList = document.getElementById('product-list');
  let allProducts = [];

  addButton.addEventListener('click', () => {
    inputContainer.style.display = 'flex';
    blurBackground.style.display = 'block';
  });

  blurBackground.addEventListener('click', () => {
    if (blurBackground.style.display === 'block') {
      blurBackground.style.display = 'none';
      inputContainer.style.display = 'none';
    }
  });

  doneBtn.addEventListener('click', async () => {
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('price').value);
    const imageFile = document.getElementById('productImage').files[0];

    if (!name || !price) {
      alert('Please enter product name and price');
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
      timestamp: new Date()
    };

    try {
      await db.collection('products').add(product);
      alert('Product added');

      document.getElementById('product-name').value = '';
      document.getElementById('price').value = '';
      document.getElementById('productImage').value = '';
    } catch (error) {
      console.error('Error adding product', error);
    }
  });

  // Firestore listener with persistence
  db.collection("products").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
    allProducts = [];
    snapshot.forEach((doc) => {
      const product = doc.data();
      product.id = doc.id;
      allProducts.push(product);
    });
    displayProducts(allProducts);
  });

  function displayProducts(products) {
    productList.innerHTML = '';
    products.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>${product.name} - ₦${product.price}</div>
        <button type="button" onclick="deleteProduct('${product.id}')">Delete</button>
        ${product.imageUrl ? `<img src="${product.imageUrl}" width="100px">` : ""}
      `;
      productList.appendChild(li);
    });
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
    displayProducts(filtered);
  });

  window.deleteProduct = async function (id) {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await db.collection('products').doc(id).delete();
        alert('Product deleted');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  window.addEventListener('offline', () => alert('You are now offline'));
  window.addEventListener('online', () => alert('You are back online'));
});
