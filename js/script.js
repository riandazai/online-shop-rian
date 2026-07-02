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
            { id: "s1", name: "Hawaiian Shirt", desc: "Lightweight and breathable shirt for hot days.", price: 200000, img: "images/outfit_s1.png" },
            { id: "s2", name: "Beach Shorts", desc: "Comfortable shorts perfect for the beach.", price: 150000, img: "images/outfit_s2.png" },
            { id: "s3", name: "Sunglasses", desc: "UV protection glasses with a stylish frame.", price: 300000, img: "images/outfit_s3.png" }
        ],
        fall: [
            { id: "f1", name: "Autumn Trench Coat", desc: "Classic coat to keep you warm in the breeze.", price: 750000, img: "images/outfit_f1.png" },
            { id: "f2", name: "Knit Cardigan", desc: "Soft knit cardigan for a cozy afternoon.", price: 400000, img: "images/outfit_f2.png" },
            { id: "f3", name: "Ankle Boots", desc: "Stylish brown ankle boots for fall walking.", price: 550000, img: "images/outfit_f3.png" }
        ],
        spring: [
            { id: "sp1", name: "Floral Dress", desc: "Beautiful flowy dress with spring floral patterns.", price: 450000, img: "images/outfit_sp1.png" },
            { id: "sp2", name: "Light Denim Jacket", desc: "Perfect outer layer for spring weather.", price: 350000, img: "images/denim_jacket.png" },
            { id: "sp3", name: "Pastel Sneakers", desc: "Comfortable sneakers in soft pastel colors.", price: 500000, img: "images/season_sneakers pastel.png" }
        ],
        winter: [
            { id: "w1", name: "Heavy Puffer Jacket", desc: "Thick insulated jacket for extreme cold.", price: 950000, img: "images/season_heavy puffer jacket.png" },
            { id: "w2", name: "Wool Scarf", desc: "Warm and cozy scarf made of 100% wool.", price: 180000, img: "images/wool_sweater.png" },
            { id: "w3", name: "Thermal Gloves", desc: "Protect your hands from the freezing winter wind.", price: 120000, img: "images/season_thermal gloves.png" }
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

    // --- PAYMENT MODAL LOGIC ---
    const checkoutBtn = document.querySelector('.checkout-btn');
    const paymentModal = document.getElementById('payment-modal');
    const paymentOverlay = document.getElementById('payment-overlay');
    const closePayment = document.getElementById('close-payment');
    const payBtn = document.getElementById('pay-btn');
    const paymentTotalEl = document.getElementById('payment-total');
    const successNotification = document.getElementById('success-notification');

    function openPaymentModal() {
        if (cart.length === 0) return;
        // Sync total to modal
        let total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);
        paymentTotalEl.textContent = formatRupiah(total);
        // Reset radio selections
        document.querySelectorAll('input[name="payment"]').forEach(r => r.checked = false);
        payBtn.disabled = true;
        payBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Bayar Sekarang';
        paymentModal.classList.add('active');
        paymentOverlay.classList.add('active');
    }

    function closePaymentModal() {
        paymentModal.classList.remove('active');
        paymentOverlay.classList.remove('active');
    }

    if (checkoutBtn) checkoutBtn.addEventListener('click', openPaymentModal);
    if (closePayment) closePayment.addEventListener('click', closePaymentModal);
    if (paymentOverlay) paymentOverlay.addEventListener('click', closePaymentModal);

    // Enable pay button when a method is selected
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', () => {
            payBtn.disabled = false;
            payBtn.innerHTML = '<i class="fa-solid fa-lock-open"></i> Bayar Sekarang';
        });
    });

    // Pay button click
    if (payBtn) {
        payBtn.addEventListener('click', () => {
            // Simulate payment processing
            payBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
            payBtn.disabled = true;

            setTimeout(() => {
                closePaymentModal();
                // Close cart sidebar too
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');

                // Clear cart
                cart = [];
                updateCartUI();

                // Show success notification
                successNotification.classList.add('show');
                setTimeout(() => {
                    successNotification.classList.remove('show');
                }, 5000);
            }, 2000);
        });
    }

    // --- PROFILE PANEL LOGIC ---
    const profileIcon = document.getElementById('profile-icon');
    const profilePanel = document.getElementById('profile-panel');
    const profileOverlay = document.getElementById('profile-overlay');
    const closeProfile = document.getElementById('close-profile');
    const loginView = document.getElementById('profile-login-view');
    const registerView = document.getElementById('profile-register-view');
    const loggedInView = document.getElementById('profile-loggedin-view');

    let currentUser = JSON.parse(localStorage.getItem('sulovaUser')) || null;

    function openProfilePanel() {
        profilePanel.classList.add('active');
        profileOverlay.classList.add('active');
        renderProfileView();
    }
    function closeProfilePanel() {
        profilePanel.classList.remove('active');
        profileOverlay.classList.remove('active');
    }
    function renderProfileView() {
        if (currentUser) {
            loginView.style.display = 'none';
            registerView.style.display = 'none';
            loggedInView.style.display = 'block';
            document.getElementById('profile-display-name').textContent = currentUser.name;
            document.getElementById('profile-display-email').textContent = currentUser.email;
            document.getElementById('stat-orders').textContent = currentUser.orders || 0;
            document.getElementById('stat-wishlist').textContent = currentUser.wishlist || 0;
        } else {
            loginView.style.display = 'block';
            registerView.style.display = 'none';
            loggedInView.style.display = 'none';
        }
    }

    if (profileIcon) profileIcon.addEventListener('click', openProfilePanel);
    if (closeProfile) closeProfile.addEventListener('click', closeProfilePanel);
    if (profileOverlay) profileOverlay.addEventListener('click', closeProfilePanel);

    // Switch to register
    document.getElementById('go-register')?.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    });
    // Switch back to login
    document.getElementById('go-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        registerView.style.display = 'none';
        loginView.style.display = 'block';
    });

    // Login form submit
    document.getElementById('profile-login-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const storedUsers = JSON.parse(localStorage.getItem('sulovaUsers')) || [];
        const found = storedUsers.find(u => u.email === email && u.password === password);
        if (found) {
            currentUser = found;
            localStorage.setItem('sulovaUser', JSON.stringify(currentUser));
            renderProfileView();
        } else {
            alert('Email atau password salah! Silakan coba lagi atau daftar akun baru.');
        }
    });

    // Register form submit
    document.getElementById('profile-register-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const storedUsers = JSON.parse(localStorage.getItem('sulovaUsers')) || [];
        if (storedUsers.find(u => u.email === email)) {
            alert('Email sudah terdaftar! Silakan login.');
            return;
        }
        const newUser = { name, email, password, orders: 0, wishlist: 0 };
        storedUsers.push(newUser);
        localStorage.setItem('sulovaUsers', JSON.stringify(storedUsers));
        currentUser = newUser;
        localStorage.setItem('sulovaUser', JSON.stringify(currentUser));
        renderProfileView();
    });

    // Logout
    document.getElementById('profile-logout-btn')?.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('sulovaUser');
        renderProfileView();
    });

    // After successful purchase, increment order count
    const originalPayHandler = payBtn?.onclick;
    if (payBtn) {
        payBtn.addEventListener('click', () => {
            if (currentUser) {
                currentUser.orders = (currentUser.orders || 0) + 1;
                localStorage.setItem('sulovaUser', JSON.stringify(currentUser));
                // Update list too
                const storedUsers = JSON.parse(localStorage.getItem('sulovaUsers')) || [];
                const idx = storedUsers.findIndex(u => u.email === currentUser.email);
                if (idx !== -1) storedUsers[idx] = currentUser;
                localStorage.setItem('sulovaUsers', JSON.stringify(storedUsers));
            }
        });
    }

    // --- SEARCH LOGIC ---
    const searchIcon = document.getElementById("search-icon");
    const searchBox = document.getElementById("search-box");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");

    if (searchIcon && searchBox) {
        searchIcon.addEventListener("click", () => {
            searchBox.classList.toggle("active");
            if (searchBox.classList.contains("active")) {
                searchInput.focus();
                renderSearchResults(""); 
            }
        });

        // Close when clicking outside
        document.addEventListener("click", (e) => {
            if (!searchIcon.contains(e.target) && !searchBox.contains(e.target)) {
                searchBox.classList.remove("active");
            }
        });

        searchInput.addEventListener("input", (e) => {
            renderSearchResults(e.target.value.toLowerCase().trim());
        });

        function renderSearchResults(query) {
            searchResults.innerHTML = "";
            if (!query) return;

            // 1. Gather normal products from DOM
            let allProducts = [];
            document.querySelectorAll('.product-card .add-to-cart-btn').forEach(btn => {
                allProducts.push({
                    id: btn.getAttribute('data-id'),
                    name: btn.getAttribute('data-name'),
                    price: btn.getAttribute('data-price'),
                    img: btn.getAttribute('data-img')
                });
            });

            // 2. Add seasonal products
            allProducts = [
                ...allProducts,
                ...seasonalData.summer,
                ...seasonalData.fall,
                ...seasonalData.spring,
                ...seasonalData.winter
            ];

            const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));

            if (filtered.length === 0) {
                searchResults.innerHTML = "<div class='no-results'>Barang tidak ditemukan.</div>";
                return;
            }

            filtered.forEach(p => {
                const div = document.createElement("div");
                div.className = "search-item";
                div.innerHTML = `
                    <img src="${p.img}" alt="${p.name}">
                    <div class="search-item-info">
                        <h4>${p.name}</h4>
                        <p>${formatRupiah(p.price)}</p>
                    </div>
                    <button class="add-to-cart-btn-small search-buy-btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-img="${p.img}">Beli</button>
                `;
                searchResults.appendChild(div);
            });

            // Bind click to the new tiny add buttons
            searchResults.querySelectorAll('.search-buy-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const item = {
                        id: btn.getAttribute('data-id'),
                        name: btn.getAttribute('data-name'),
                        price: btn.getAttribute('data-price'),
                        img: btn.getAttribute('data-img')
                    };
                    cart.push(item);
                    updateCartUI();
                    showToast();
                    searchBox.classList.remove("active");
                });
            });
        }
    }
});
