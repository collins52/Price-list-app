const addButton = document.getElementById('Add');
const inputContainer = document.getElementById('input-container');
const productInput = document.getElementById('product-input');
const doneButton = document.getElementById('done-button');
const productList = document.getElementById('product-list');
const searchInput = document.getElementById('search');
const container = document.getElementById('container')

// Load saved products from localStorage on page load
loadProductsFromStorage();

document.addEventListener('click', function(event){
    const $target = event.target;

    // DONE BUTTON
    if($target.id.includes('done-button')){
        const inputValue = productInput.value.trim();

        // Validate input format: 'product - #price'
        if(inputValue.includes('-')){

            // create new product item (li)
            const newProductItem = document.createElement('li');
            newProductItem.className = 'product-item';
            newProductItem.innerHTML = `${inputValue}<button type="button" id="delete-button">Delete</button>`;
            productList.appendChild(newProductItem)
        }else {
            alert('Please enter in the correct format: product - #price');
        }

        inputContainer.style.display = 'none';
        productInput.value = '';

        // Save to localStorage
        saveProductToStorage(inputValue)
    }

    // Remove input container when the clicked element is not the done button
    if($target.id.includes('container')){
        inputContainer.style.display = 'none';
    }

    // ADD BUTTON
    if($target.id.includes('Add')){
        inputContainer.style.display = 'block';
    }
    // DELTE BUTTON
    if($target.id.includes('delete-button')){
        const productItem = event.target.parentElement; // Get the parent of event.target i.e the delete button
        const productText = productItem.textContent.replace('Delete', '').trim(); // Get the product text without delete. i think this removes the textContent i.e "delete" of the button.
        
        // Remove product item from the list
        productList.removeChild(productItem);
        deleteProductFromStorage(productText);
    }
})

// Function to delete product from local storage

function deleteProductFromStorage(product){
    let products = JSON.parse(localStorage.getItem('products')) || []; // get the array
    products = products.filter(item => item !== product); //Remove product from array
    localStorage.setItem('products', JSON.stringify(products)); //update local storage
}

// Function to save product from local storage

function saveProductToStorage(product){
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product); //add new item to array
    localStorage.setItem('products', JSON.stringify(products)); //Save to local storage after adding new item

}

// Function to load product from local storage

function loadProductsFromStorage(){
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach(function (product) {
        const newProductItem = document.createElement('li');
        newProductItem.className = 'product-item';
        newProductItem.innerHTML = `${product} <button type="button" class="edit-button">Delete</button>`;
        productList.appendChild(newProductItem);
    })
}

// Search function: Filters the product list as the user typesin the search box

searchInput.addEventListener('input', function(){
    const filter = searchInput.value.toLowerCase();
    const productItems = document.getElementsByClassName('product-item');

    Array.from(productItems).forEach(function(item){
        const text = item.textContent.toLowerCase();
        if(text.includes(filter)){
            item.style.display = '';
        }else{
            item.style.display = 'none'
        }
    })
})

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('service-worker.js')
//       .then(reg => console.log('Service Worker registered:', reg))
//       .catch(err => console.error('Service Worker registration failed:', err));
//   }

if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('/service-worker.js')
    .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) =>{
        console.log('Service Worker registration failed', error);
    });
}



