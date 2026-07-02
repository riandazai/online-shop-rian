document.addEventListener('DOMContentLoaded', () => {
    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // --- CART LOGIC ---
    let cart = JSON.parse(localStorage.getItem('fashionCart')) || [];
    
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const toast = document.getElementById('toast');

    // Toggle Cart
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }

    if(cartIcon) cartIcon.addEventListener('click', toggleCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Format Rupiah
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    }

    // Update Cart UI
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            total += parseInt(item.price);
            count++;

            const cartItemHTML = `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${formatRupiah(item.price)}</div>
                        <div class="remove-item" data-index="${index}">Hapus</div>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });

        cartCount.textContent = count;
        cartTotalPrice.textContent = formatRupiah(total);
        
        // Save to local storage
        localStorage.setItem('fashionCart', JSON.stringify(cart));

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemIndex = e.target.getAttribute('data-index');
                cart.splice(itemIndex, 1);
                updateCartUI();
            });
        });
    }

    // Show Toast
    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Function to bind Add to Cart events
    function bindAddToCartButtons() {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            // Remove old listener to avoid duplicates
            button.replaceWith(button.cloneNode(true));
        });
        
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productInfo = e.target;
                const item = {
                    id: productInfo.getAttribute('data-id'),
                    name: productInfo.getAttribute('data-name'),
                    price: productInfo.getAttribute('data-price'),
                    img: productInfo.getAttribute('data-img')
                };

                cart.push(item);
                updateCartUI();
                showToast();
            });
        });
    }

    // Init Bindings
    bindAddToCartButtons();
    updateCartUI();

    // --- SEASONAL PRODUCTS LOGIC ---
    const seasonalData = {
        summer: [
            { id: "s1", name: "Hawaiian Shirt", desc: "Lightweight and breathable shirt for hot days.", price: 200000, img: "https://loremflickr.com/400/500/hawaiian,shirt/all" },
            { id: "s2", name: "Beach Shorts", desc: "Comfortable shorts perfect for the beach.", price: 150000, img: "https://loremflickr.com/400/500/beach,shorts/all" },
            { id: "s3", name: "Sunglasses", desc: "UV protection glasses with a stylish frame.", price: 300000, img: "https://loremflickr.com/400/500/sunglasses/all" }
        ],
        fall: [
            { id: "f1", name: "Autumn Trench Coat", desc: "Classic coat to keep you warm in the breeze.", price: 750000, img: "https://loremflickr.com/400/500/trench,coat/all" },
            { id: "f2", name: "Knit Cardigan", desc: "Soft knit cardigan for a cozy afternoon.", price: 400000, img: "https://loremflickr.com/400/500/knit,cardigan/all" },
            { id: "f3", name: "Ankle Boots", desc: "Stylish brown ankle boots for fall walking.", price: 550000, img: "https://loremflickr.com/400/500/ankle,boots/all" }
        ],
        spring: [
            { id: "sp1", name: "Floral Dress", desc: "Beautiful flowy dress with spring floral patterns.", price: 450000, img: "https://loremflickr.com/400/500/floral,dress/all" },
            { id: "sp2", name: "Light Denim Jacket", desc: "Perfect outer layer for spring weather.", price: 350000, img: "https://loremflickr.com/400/500/denim,jacket/all" },
            { id: "sp3", name: "Pastel Sneakers", desc: "Comfortable sneakers in soft pastel colors.", price: 500000, img: "https://loremflickr.com/400/500/pastel,sneakers/all" }
        ],
        winter: [
            { id: "w1", name: "Heavy Puffer Jacket", desc: "Thick insulated jacket for extreme cold.", price: 950000, img: "https://loremflickr.com/400/500/puffer,jacket/all" },
            { id: "w2", name: "Wool Scarf", desc: "Warm and cozy scarf made of 100% wool.", price: 180000, img: "https://loremflickr.com/400/500/wool,scarf/all" },
            { id: "w3", name: "Thermal Gloves", desc: "Protect your hands from the freezing winter wind.", price: 120000, img: "https://loremflickr.com/400/500/thermal,gloves/all" }
        ]
    };

    const seasonalCards = document.querySelectorAll('.seasonal-card');
    const seasonalContainer = document.getElementById('seasonal-products-container');
    const seasonalGrid = document.getElementById('season-product-grid');
    const seasonalHeaderTitle = document.getElementById('season-header-title');

    seasonalCards.forEach(card => {
        card.addEventListener('click', () => {
            const season = card.getAttribute('id');
            const products = seasonalData[season];
            
            // Set Title
            seasonalHeaderTitle.textContent = season.charAt(0).toUpperCase() + season.slice(1) + " Collection";
            
            // Generate HTML
            let html = "";
            products.forEach(p => {
                html += `
                    <div class="season-product-card">
                        <div class="season-product-img">
                            <img src="${p.img}" alt="${p.name}">
                        </div>
                        <div class="season-product-info">
                            <h3>${p.name}</h3>
                            <div class="season-product-desc">${p.desc}</div>
                            <div class="season-product-price">${formatRupiah(p.price)}</div>
                            <button class="add-to-cart-btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}">Buy Now</button>
                        </div>
                    </div>
                `;
            });

            seasonalGrid.innerHTML = html;
            seasonalContainer.classList.add('active');
            
            // Rebind Add to Cart buttons inside the new grid
            bindAddToCartButtons();

            // Scroll down a bit to show the container
            setTimeout(() => {
                seasonalContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });
    });
});
