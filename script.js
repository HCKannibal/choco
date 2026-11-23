
// ===================================
// NEON GLOW — PRODUCT DATABASE
// ===================================

const products = [
    {
        id: 1,
        name: "Cyber Pink Jacket",
        category: "clothes",
        categoryName: "FASHION",
        price: 28900,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
        tag: "NEW"
    },
    {
        id: 2,
        name: "Black Streetwear",
        category: "clothes",
        categoryName: "FASHION",
        price: 19500,
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600",
        tag: "HOT"
    },
    {
        id: 3,
        name: "Neon Beauty Set",
        category: "beauty",
        categoryName: "BEAUTY",
        price: 12500,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
        tag: "NEW"
    },
    {
        id: 4,
        name: "Luxury Perfume",
        category: "beauty",
        categoryName: "BEAUTY",
        price: 22000,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600",
        tag: "BESTSELLER"
    },
    {
        id: 5,
        name: "Cyber Sunglasses",
        category: "accessories",
        categoryName: "ACCESSORIES",
        price: 8900,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
        tag: "TREND"
    },
    {
        id: 6,
        name: "Silver Necklace",
        category: "accessories",
        categoryName: "ACCESSORIES",
        price: 14500,
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600",
        tag: "NEW"
    },
    {
        id: 7,
        name: "Pink Fashion Dress",
        category: "clothes",
        categoryName: "FASHION",
        price: 31500,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600",
        tag: "HOT"
    },
    {
        id: 8,
        name: "Glow Skin Cream",
        category: "beauty",
        categoryName: "BEAUTY",
        price: 7600,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
        tag: "POPULAR"
    }
];

// ===================================
// VARIABLES
// ===================================

let selectedCategory = "all";

let cart = JSON.parse(localStorage.getItem("neonCart")) || [];

// ===================================
// PRICE FORMAT
// ===================================

function formatPrice(price) {
    return price.toLocaleString("ru-RU") + " ₸";
}

// ===================================
// DISPLAY PRODUCTS
// ===================================

function displayProducts() {

    const grid = document.getElementById("product-grid");
    const searchValue = document.getElementById("search").value.toLowerCase();
    const sortValue = document.getElementById("sort").value;

    let filteredProducts = products.filter(product => {

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.categoryName.toLowerCase().includes(searchValue);

        return matchesCategory && matchesSearch;
    });

    // SORTING

    if (sortValue === "cheap") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (sortValue === "expensive") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    if (sortValue === "name") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    // PRODUCT COUNT

    document.getElementById("product-total").textContent =
        filteredProducts.length + " PRODUCTS";

    // EMPTY RESULT

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="empty-products">
                Товары не найдены :(
            </div>
        `;
        return;
    }

    // PRODUCT CARDS

    grid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">

            <div class="product-image">
                <img src="${product.image}"
                     alt="${product.name}"
                     loading="lazy">

                <span class="product-tag">
                    ${product.tag}
                </span>
            </div>

            <div class="product-info">

                <p class="product-category">
                    ${product.categoryName}
                </p>

                <h3>${product.name}</h3>

                <p class="product-price">
                    ${formatPrice(product.price)}
                </p>

                <button class="add-button"
                        onclick="addToCart(${product.id})">
                    + ДОБАВИТЬ В КОРЗИНУ
                </button>

            </div>
        </article>
    `).join("");
}

// ===================================
// CATEGORY FILTERS
// ===================================

document.querySelectorAll(".category-card").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".category-card")
            .forEach(item => item.classList.remove("active"));

        button.classList.add("active");

        selectedCategory = button.dataset.category;

        displayProducts();
    });

});

// ===================================
// SEARCH
// ===================================

document.getElementById("search")
    .addEventListener("input", displayProducts);

// ===================================
// SORTING
// ===================================

document.getElementById("sort")
    .addEventListener("change", displayProducts);

// ===================================
// SAVE CART
// ===================================

function saveCart() {

    localStorage.setItem("neonCart", JSON.stringify(cart));

    updateCart();
}

// ===================================
// ADD TO CART
// ===================================

function addToCart(id) {

    const product = products.find(item => item.id === id);

    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();

}

// ===================================
// UPDATE CART
// ===================================

function updateCart() {

    const cartItems = document.getElementById("cart-items");

    const cartCount = document.getElementById("cart-count");

    const cartTotal = document.getElementById("cart-total");

    // TOTAL QUANTITY

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    cartCount.textContent = totalQuantity;

    // TOTAL PRICE

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartTotal.textContent = formatPrice(totalPrice);

    // EMPTY CART

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="cart-empty">
                <h3>ТВОЯ КОРЗИНА ПУСТА</h3>
                <p>Добавь что-нибудь красивое ♡</p>
            </div>
        `;

        return;
    }

    // CART PRODUCTS

    cartItems.innerHTML = cart.map(item => `

        <div class="cart-item">

            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>${formatPrice(item.price * item.quantity)}</p>

                <div class="quantity">

                    <button onclick="changeQuantity(${item.id}, -1)">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                </div>

                <button class="remove-button"
                        onclick="removeFromCart(${item.id})">
                    Удалить
                </button>

            </div>

        </div>

    `).join("");
}

// ===================================
// CHANGE QUANTITY
// ===================================

function changeQuantity(id, amount) {

    const product = cart.find(item => item.id === id);

    if (!product) return;

    product.quantity += amount;

    if (product.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    saveCart();
}

// ===================================
// REMOVE PRODUCT
// ===================================

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    saveCart();
}

// ===================================
// OPEN / CLOSE CART
// ===================================

function toggleCart() {

    document.getElementById("cart-overlay")
        .classList.toggle("open");
}

function closeCart(event) {

    if (event.target.id === "cart-overlay") {
        toggleCart();
    }
}

// ===================================
// CHECKOUT
// ===================================

function checkout() {

    if (cart.length === 0) {
        alert("Твоя корзина пока пуста!");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    alert(
        "Спасибо за заказ в NEON GLOW! ♡\n\n" +
        "Количество товаров: " +
        cart.reduce((sum, item) => sum + item.quantity, 0) +
        "\nСумма заказа: " + formatPrice(total) +
        "\n\nЭто демонстрационный заказ."
    );

    cart = [];

    saveCart();

    toggleCart();
}

// ===================================
// INITIALIZATION
// ===================================

displayProducts();
updateCart();
