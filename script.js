// service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.log('Service Worker registration failed:', err));
}

const doneBtn = document.getElementById('done-button');
const addButton = document.getElementById('Add');
const inputContainer = document.getElementById('input-container');
const blurBackground = document.getElementById('blurBackground');

addButton.addEventListener('click', function(){
  inputContainer.style.display = 'flex';
  blurBackground.style.display = 'block'
})

blurBackground.addEventListener('click', function (){
  console.log('This fjjffj')
  if(blurBackground.style.display == 'block'){
    blurBackground.style.display = 'none';
    inputContainer.style.display = 'none'
  }
})

doneBtn.addEventListener('click', async ()=>{
  const name = document.getElementById('product-name').value;
  const price = parseFloat(document.getElementById('price').value);
  
  if(!name || !price){
    alert('pls enter product name and price')
   return;
  }
  
  let imageUrl = "";
  
  if(imageFile){
    console.log('blabla')
    console.log('true')
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
  
  try{
    await
    db.collection('products').add(product);
    alert('product added');
    
    document.getElementById('product-name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('productImage').value = '';
  } catch (error){
    console.error('error adding product', error);
  }
})

// DISPLAY PRODUCT FROM FIRE STORE

// Search filter
const searchInput = document.getElementById('search');
let allProducts = []; // store all products

// listen to fire store for updates
db.collection("products").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
  allProducts = []; //Store all products
  snapshot.forEach((doc) => {
    const product = doc.data();
    product.id = doc.id // add ID for Delete functionality
    allProducts.push(product)
  })
  displayProducts(allProducts)
})

// display function
function displayProducts(products){
  const productList = document.getElementById('product-list');
  productList.innerHTML = ''
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
    <div>${product.name} - ₦${product.price}</div> <button type="button" onclick="deleteProduct('${product.id}')">Delete</button>
    ${product.imageUrl ? `<img src = "${product.imageUrl}" width="100px">`: ""}
    `
    productList.appendChild(li);
  })
  
}
searchInput.addEventListener('input', () => {
   const query = searchInput.value.toLowerCase();
   const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
   displayProducts(filtered)
})

async function deleteProduct(id){
  if(confirm("Are you sure you want to delete this item")){
    try{
      await
      db.collection('products').doc(id).delete();
      alert('product deleted')
    }catch(error){
      console.error('Error deleting product:', error);
      alert('failed to delete product')
    }
  }
}

window.addEventListener('offline', () => alert('You are now offline'));
window.addEventListener('online', () => alert('You are back online'));
