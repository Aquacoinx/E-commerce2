// Global State Management
const AppState = {
    cart: JSON.parse(localStorage.getItem('aquastore-cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('aquastore-wishlist')) || [],
    user: JSON.parse(localStorage.getItem('aquastore-user')) || null,
    theme: localStorage.getItem('aquastore-theme') || 'light',
    products: [],
    currentFilter: 'all',
    currentSort: 'featured'
};

// Sample Products Data
const sampleProducts = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        price: 89.99,
        priceAQX: 4.5,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        rating: 4.5,
        reviews: 128,
        description: "Premium wireless headphones with noise cancellation and 30-hour battery life."
    },
    {
        id: 2,
        title: "Organic Cotton T-Shirt",
        price: 29.99,
        priceAQX: 1.5,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        rating: 4.2,
        reviews: 89,
        description: "Comfortable organic cotton t-shirt in multiple colors and sizes."
    },
    {
        id: 3,
        title: "Smart Fitness Watch",
        price: 199.99,
        priceAQX: 10.0,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        rating: 4.7,
        reviews: 256,
        description: "Advanced fitness tracking with heart rate monitor and GPS functionality."
    },
    {
        id: 4,
        title: "Gourmet Coffee Beans",
        price: 24.99,
        priceAQX: 1.25,
        category: "food",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
        rating: 4.6,
        reviews: 73,
        description: "Premium single-origin coffee beans, freshly roasted to perfection."
    },
    {
        id: 5,
        title: "Minimalist Desk Lamp",
        price: 79.99,
        priceAQX: 4.0,
        category: "home",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
        rating: 4.3,
        reviews: 45,
        description: "Modern LED desk lamp with adjustable brightness and USB charging port."
    },
    {
        id: 6,
        title: "Yoga Mat Premium",
        price: 49.99,
        priceAQX: 2.5,
        category: "sports",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        rating: 4.4,
        reviews: 112,
        description: "Non-slip premium yoga mat with extra cushioning and carrying strap."
    },
    {
        id: 7,
        title: "Programming Books Set",
        price: 149.99,
        priceAQX: 7.5,
        category: "books",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
        rating: 4.8,
        reviews: 89,
        description: "Complete set of modern programming books covering latest technologies."
    },
    {
        id: 8,
        title: "Smartphone Case",
        price: 19.99,
        priceAQX: 1.0,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
        rating: 4.1,
        reviews: 203,
        description: "Durable protective case with wireless charging compatibility."
    }
];

// Utility Functions
const utils = {
    formatCurrency: (amount) => `$${amount.toFixed(2)}`,
    formatAQCNX: (amount) => `${amount.toFixed(2)} AQCNX`,
    formatTON: (amount) => `${amount.toFixed(2)} TON`,
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    showToast: (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
};

// Real TON Wallet Integration using TON Connect UI
class TonWalletManager {
    constructor() {
        this.tonConnectUI = null;
        this.isConnected = false;
        this.address = null;
        this.balance = 0;
        this.init();
    }

    async init() {
        try {
            // Wait for TON Connect UI to load
            if (typeof window.TON_CONNECT_UI !== 'undefined') {
                await this.initTonConnect();
            } else {
                // Wait for script to load
                const checkTonConnect = setInterval(() => {
                    if (typeof window.TON_CONNECT_UI !== 'undefined') {
                        clearInterval(checkTonConnect);
                        this.initTonConnect();
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Failed to initialize TON Connect:', error);
        }
    }

    async initTonConnect() {
        try {
            const { TonConnectUI } = window.TON_CONNECT_UI;
            
           this.tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json'
        });
            // Listen for wallet connection status changes
            this.tonConnectUI.onStatusChange((wallet) => {
                if (wallet) {
                    this.isConnected = true;
                    this.address = wallet.account.address;
                    this.updateBalance();
                } else {
                    this.isConnected = false;
                    this.address = null;
                    this.balance = 0;
                }
                this.updateUI();
            });

            // Check if already connected
            const currentWallet = this.tonConnectUI.wallet;
            if (currentWallet) {
                this.isConnected = true;
                this.address = currentWallet.account.address;
                await this.updateBalance();
                this.updateUI();
            }

        } catch (error) {
            console.error('TON Connect initialization failed:', error);
        }
    }

    async connect() {
        if (!this.tonConnectUI) {
            utils.showToast('TON Connect not initialized', 'error');
            return;
        }

        try {
            await this.tonConnectUI.openModal();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            utils.showToast('Failed to connect wallet', 'error');
        }
    }

    async disconnect() {
        if (!this.tonConnectUI) return;

        try {
            await this.tonConnectUI.disconnect();
            this.isConnected = false;
            this.address = null;
            this.balance = 0;
            this.updateUI();
            utils.showToast('Wallet disconnected', 'success');
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    }

    async updateBalance() {
        if (!this.address) return;

        try {
            // Simulate balance for demo - in real app, fetch from TON API
            this.balance = (Math.random() * 100 + 10).toFixed(2);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
            this.balance = 0;
        }
    }

    async sendTransaction(amount, destination = 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t') {
        if (!this.tonConnectUI || !this.isConnected) {
            throw new Error('Wallet not connected');
        }

        if (parseFloat(amount) > parseFloat(this.balance)) {
            throw new Error('Insufficient balance');
        }

        try {
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 360,
                messages: [{
                    address: destination,
                    amount: (parseFloat(amount) * 1000000000).toString(), // Convert to nanoTON
                }]
            };

            const result = await this.tonConnectUI.sendTransaction(transaction);
            
            // Update balance after successful transaction
            this.balance = (parseFloat(this.balance) - parseFloat(amount)).toFixed(2);
            this.updateUI();
            
            return result;
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    }

    updateUI() {
        const connectWalletBtn = document.getElementById('connectWalletBtn');
        const userDropdown = document.getElementById('userDropdown');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const walletAddress = document.getElementById('walletAddress');
        const walletBalance = document.getElementById('walletBalance');

        if (this.isConnected && connectWalletBtn && userDropdown) {
            connectWalletBtn.style.display = 'none';
            userDropdown.style.display = 'block';
            dropdownMenu.style.display = 'none';

            if (walletAddress) {
                const shortAddress = this.address ? 
                    `${this.address.slice(0, 6)}...${this.address.slice(-4)}` : '';
                walletAddress.textContent = shortAddress;
            }

            if (walletBalance) {
                walletBalance.textContent = `${this.balance} Aqcnx`;
            }

            // Update user state
            AppState.user = {
                walletAddress: this.address,
                balance: this.balance,
                walletType: 'TON'
            };
            localStorage.setItem('aquastore-user', JSON.stringify(AppState.user));
        } else if (connectWalletBtn && userDropdown) {
            connectWalletBtn.style.display = 'flex';
            userDropdown.style.display = 'none';
            AppState.user = null;
            localStorage.removeItem('aquastore-user');
        }
    }

    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
}

// Initialize TON wallet manager
let tonWallet;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Initialize TON wallet
    tonWallet = new TonWalletManager();
    
    // Set initial theme
    applyTheme(AppState.theme);
    
    // Load products
    AppState.products = sampleProducts;
    renderProducts();
    
    // Update cart badge
    updateCartBadge();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Hide preloader
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
    }, 1500);
    
    // Initialize scroll to top
    initializeScrollToTop();
}

// Event Listeners
function initializeEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Cart icon
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => openModal('cartModal'));
    }
    
    // Connect wallet - Real TON wallet
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', () => {
            if (tonWallet) {
                tonWallet.connect();
            }
        });
    }
    
    // Logout button - Real TON wallet
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (tonWallet) {
                tonWallet.disconnect();
            }
        });
    }

    // Product filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            AppState.currentFilter = e.target.dataset.filter;
            renderProducts();
        });
    });
    
    // Sort filter
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            AppState.currentSort = e.target.value;
            renderProducts();
        });
    }
    
    // VTU buttons
    document.querySelectorAll('.vtu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const service = e.target.dataset.service;
            openVTUModal(service);
        });
    });
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.dataset.modal;
            closeModal(modalId);
        });
    });
    
    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Floating chat
    const floatingChat = document.getElementById('floatingChat');
    if (floatingChat) {
        floatingChat.addEventListener('click', () => {
            window.open('https://wa.me/1234567890', '_blank');
        });
    }
    
    // Scroll to top
    const scrollToTop = document.getElementById('scrollToTop');
    if (scrollToTop) {
        scrollToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', utils.debounce(handleSearch, 300));
    }
    
    // Category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            filterByCategory(category);
        });
    });
}

// Theme Management
function toggleTheme() {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    applyTheme(AppState.theme);
    localStorage.setItem('aquastore-theme', AppState.theme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Product Management
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    let filteredProducts = AppState.products;
    
    // Apply category filter
    if (AppState.currentFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === AppState.currentFilter
        );
    }
    
    // Apply sorting
    switch (AppState.currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.priceAQX - b.priceAQX);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.priceAQX - a.priceAQX);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        default:
            // Featured - random order
            filteredProducts.sort(() => Math.random() - 0.5);
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                <div class="product-actions">
                    <button class="action-btn" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="quickView(${product.id})" title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">${utils.formatAQX(product.priceAQX)}</div>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-text">(${product.reviews} reviews)</span>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    if (hasHalfStar) {
        stars += '☆';
    }
    
    return stars;
}

function filterByCategory(category) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === category) {
            btn.classList.add('active');
        }
    });
    
    AppState.currentFilter = category;
    renderProducts();
    
    // Scroll to products section
    document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query === '') {
        AppState.products = sampleProducts;
    } else {
        AppState.products = sampleProducts.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }
    
    renderProducts();
}

// Cart Management
function addToCart(productId) {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = AppState.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        AppState.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartState();
    utils.showToast('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    AppState.cart = AppState.cart.filter(item => item.id !== productId);
    updateCartState();
    renderCartItems();
    utils.showToast('Product removed from cart', 'success');
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = AppState.cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartState();
        renderCartItems();
    }
}

function updateCartState() {
    localStorage.setItem('aquastore-cart', JSON.stringify(AppState.cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    if (AppState.cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartSubtotal) cartSubtotal.textContent = '0 AQCNX';
        if (cartTotal) cartTotal.textContent = '0 AQCNX';
        return;
    }
    
    cartItems.innerHTML = AppState.cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <div class="cart-item-price">${utils.formatAQX(item.priceAQX)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" 
                           onchange="updateQuantity(${item.id}, parseInt(this.value))">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    const subtotal = AppState.cart.reduce((sum, item) => sum + (item.priceAQX * item.quantity), 0);
    if (cartSubtotal) cartSubtotal.textContent = utils.formatAQCNX(subtotal);
    if (cartTotal) cartTotal.textContent = utils.formatAQCNX(subtotal);
}

// Wishlist Management
function toggleWishlist(productId) {
    const isInWishlist = AppState.wishlist.includes(productId);
    
    if (isInWishlist) {
        AppState.wishlist = AppState.wishlist.filter(id => id !== productId);
        utils.showToast('Removed from wishlist', 'success');
    } else {
        AppState.wishlist.push(productId);
        utils.showToast('Added to wishlist!', 'success');
    }
    
    localStorage.setItem('aquastore-wishlist', JSON.stringify(AppState.wishlist));
    
    // Update heart icon
    const heartIcon = document.querySelector(`[onclick="toggleWishlist(${productId})"] i`);
    if (heartIcon) {
        heartIcon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
    }
}

// Quick View
function quickView(productId) {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;
    
    const quickViewContent = document.getElementById('quickViewContent');
    if (quickViewContent) {
        quickViewContent.innerHTML = `
            <div class="quick-view-content">
                <div>
                    <img src="${product.image}" alt="${product.title}" class="quick-view-image">
                </div>
                <div class="quick-view-info">
                    <h3>${product.title}</h3>
                    <div class="quick-view-price">${utils.formatAQX(product.priceAQX)}</div>
                    <div class="product-rating">
                        <div class="stars">${generateStars(product.rating)}</div>
                        <span class="rating-text">(${product.reviews} reviews)</span>
                    </div>
                    <p class="quick-view-description">${product.description}</p>
                    <div class="quick-view-actions">
                        <button class="btn-primary" onclick="addToCart(${product.id}); closeModal('quickViewModal')">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn-secondary" onclick="toggleWishlist(${product.id})">
                            <i class="fas fa-heart"></i>
                            Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    openModal('quickViewModal');
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Special handling for cart modal
        if (modalId === 'cartModal') {
            renderCartItems();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// VTU Services with real TON payment
function openVTUModal(service) {
    const vtuModalTitle = document.getElementById('vtuModalTitle');
    const vtuModalContent = document.getElementById('vtuModalContent');
    
    if (!vtuModalTitle || !vtuModalContent) return;
    
    const serviceConfig = {
        airtime: {
            title: 'Buy Airtime',
            icon: 'fas fa-mobile-alt',
            fields: [
                { label: 'Phone Number', type: 'tel', placeholder: '+234 xxx xxx xxxx' },
                { label: 'Network', type: 'select', options: ['MTN', 'Airtel', 'Glo', '9mobile'] },
                { label: 'Amount (TON)', type: 'number', placeholder: '0.00' }
            ]
        },
        data: {
            title: 'Buy Data Bundle',
            icon: 'fas fa-wifi',
            fields: [
                { label: 'Phone Number', type: 'tel', placeholder: '+234 xxx xxx xxxx' },
                { label: 'Network', type: 'select', options: ['MTN', 'Airtel', 'Glo', '9mobile'] },
                { label: 'Data Plan', type: 'select', options: ['1GB - 0.5 TON', '2GB - 1.0 TON', '5GB - 2.5 TON', '10GB - 5.0 TON'] }
            ]
        },
        electricity: {
            title: 'Pay Electricity Bill',
            icon: 'fas fa-bolt',
            fields: [
                { label: 'Meter Number', type: 'text', placeholder: 'Enter meter number' },
                { label: 'Disco', type: 'select', options: ['AEDC', 'EKEDC', 'IKEDC', 'PHEDC'] },
                { label: 'Amount (TON)', type: 'number', placeholder: '0.00' }
            ]
        },
        cable: {
            title: 'Renew Cable TV',
            icon: 'fas fa-tv',
            fields: [
                { label: 'Decoder Number', type: 'text', placeholder: 'Enter decoder number' },
                { label: 'Provider', type: 'select', options: ['DSTV', 'GOTV', 'Startimes'] },
                { label: 'Package', type: 'select', options: ['Basic - 5.0 TON', 'Premium - 15.0 TON', 'Ultimate - 25.0 TON'] }
            ]
        }
    };
    
    const config = serviceConfig[service];
    if (!config) return;
    
    vtuModalTitle.innerHTML = `<i class="${config.icon}"></i> ${config.title}`;
    
    vtuModalContent.innerHTML = `
        <form class="vtu-form" onsubmit="processVTU(event, '${service}')">
            ${config.fields.map(field => {
                if (field.type === 'select') {
                    return `
                        <div class="form-group">
                            <label class="form-label">${field.label}</label>
                            <select class="form-select" required>
                                <option value="">Select ${field.label}</option>
                                ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                            </select>
                        </div>
                    `;
                } else {
                    return `
                        <div class="form-group">
                            <label class="form-label">${field.label}</label>
                            <input type="${field.type}" class="form-input" placeholder="${field.placeholder}" required>
                        </div>
                    `;
                }
            }).join('')}
            <div class="form-group">
                <button type="submit" class="btn-primary" style="width: 100%;">
                    <i class="fas fa-credit-card"></i>
                    Pay with TON
                </button>
            </div>
        </form>
    `;
    
    openModal('vtuModal');
}

async function processVTU(event, service) {
    event.preventDefault();
    
    if (!tonWallet || !tonWallet.isConnected) {
        utils.showToast('Please connect your TON wallet first', 'error');
        return;
    }
    
    const button = event.target.querySelector('button[type="submit"]');
    button.innerHTML = '<span class="loading"><span class="spinner"></span> Processing...</span>';
    button.disabled = true;
    
    try {
        // Get amount from form
        const formData = new FormData(event.target);
        const amountInput = event.target.querySelector('input[type="number"]');
        const amount = amountInput ? amountInput.value : '1.0';
        
        // Send real TON transaction
        await tonWallet.sendTransaction(amount);
        
        button.innerHTML = '<i class="fas fa-check"></i> Transaction Successful!';
        button.style.background = '#10B981';
        
        setTimeout(() => {
            closeModal('vtuModal');
            utils.showToast(`${service.toUpperCase()} service completed successfully!`, 'success');
        }, 2000);
        
    } catch (error) {
        console.error('VTU payment failed:', error);
        utils.showToast(error.message || 'Payment failed', 'error');
        button.innerHTML = '<i class="fas fa-credit-card"></i> Retry Payment';
        button.disabled = false;
    }
}

// Checkout Process with real TON payment
function initiateCheckout() {
    if (!tonWallet || !tonWallet.isConnected) {
        utils.showToast('Please connect your TON wallet first', 'error');
        return;
    }
    
    if (AppState.cart.length === 0) {
        utils.showToast('Your cart is empty', 'error');
        return;
    }
    
    openModal('checkoutModal');
    loadCheckoutStep(1);
}

function loadCheckoutStep(step) {
    const checkoutContent = document.getElementById('checkoutContent');
    const steps = document.querySelectorAll('.step');
    
    // Update step indicators
    steps.forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepEl.classList.add('completed');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
        }
    });
    
    switch (step) {
        case 1:
            loadOrderReview();
            break;
        case 2:
            loadPaymentStep();
            break;
        case 3:
            loadConfirmationStep();
            break;
    }
}

function loadOrderReview() {
    const checkoutContent = document.getElementById('checkoutContent');
    const subtotal = AppState.cart.reduce((sum, item) => sum + (item.priceAQX * item.quantity), 0);
    
    checkoutContent.innerHTML = `
        <div class="order-review">
            <h3>Order Summary</h3>
            <div class="order-items">
                ${AppState.cart.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                        <div style="flex: 1; margin-left: 1rem;">
                            <h4>${item.title}</h4>
                            <p>Quantity: ${item.quantity}</p>
                            <p style="color: var(--primary-blue); font-weight: 600;">${utils.formatAQX(item.priceAQX * item.quantity)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>${utils.formatAQCNX(subtotal)}</span>
                </div>
                <div class="total-row">
                    <span>Shipping:</span>
                    <span>Free</span>
                </div>
                <div class="total-row total-final">
                    <span>Total:</span>
                    <span>${utils.formatAQCNX(subtotal)}</span>
                </div>
            </div>
            <button class="btn-primary" onclick="loadCheckoutStep(2)" style="width: 100%; margin-top: 2rem;">
                Proceed to Payment
            </button>
        </div>
    `;
}

function loadPaymentStep() {
    const checkoutContent = document.getElementById('checkoutContent');
    const total = AppState.cart.reduce((sum, item) => sum + (item.priceAQCNX * item.quantity), 0);
    const tonAmount = (total * 0.1).toFixed(2); // Convert AQCNX to TON (example rate)
    
    checkoutContent.innerHTML = `
        <div class="payment-step">
            <h3>Payment with TON Wallet</h3>
            <div class="payment-info">
                <div class="wallet-info">
                    <div class="wallet-details">
                        <i class="fas fa-wallet"></i>
                        <div>
                            <p><strong>Connected Wallet:</strong></p>
                            <p class="wallet-address">${tonWallet.formatAddress(tonWallet.address)}</p>
                            <p class="wallet-balance">Balance: ${tonWallet.balance} TON</p>
                        </div>
                    </div>
                </div>
                <div class="payment-amount">
                    <h4>Amount to Pay: ${utils.formatTON(tonAmount)}</h4>
                    <p class="conversion-note">Converted from ${utils.formatAQCNX(total)}</p>
                </div>
            </div>
            <button class="btn-primary" onclick="processPayment()" style="width: 100%; margin-top: 2rem;">
                <i class="fas fa-credit-card"></i>
                Pay with TON
            </button>
        </div>
    `;
}

async function processPayment() {
    const button = event.target;
    const total = AppState.cart.reduce((sum, item) => sum + (item.priceAQCNX * item.quantity), 0);
    const tonAmount = (total * 0.1).toFixed(2); // Convert AQX to TON
    
    button.innerHTML = '<span class="loading"><span class="spinner"></span> Processing Payment...</span>';
    button.disabled = true;
    
    try {
        if (parseFloat(tonWallet.balance) < parseFloat(tonAmount)) {
            utils.showToast('Insufficient TON balance', 'error');
            button.innerHTML = '<i class="fas fa-credit-card"></i> Pay with TON';
            button.disabled = false;
            return;
        }
        
        // Send real TON transaction
        await tonWallet.sendTransaction(tonAmount);
        
        // Clear cart on successful payment
        AppState.cart = [];
        updateCartState();
        
        loadCheckoutStep(3);
    } catch (error) {
        console.error('Payment failed:', error);
        utils.showToast(error.message || 'Payment failed. Please try again.', 'error');
        button.innerHTML = '<i class="fas fa-credit-card"></i> Retry Payment';
        button.disabled = false;
    }
}

function loadConfirmationStep() {
    const checkoutContent = document.getElementById('checkoutContent');
    
    checkoutContent.innerHTML = `
        <div class="confirmation-step">
            <div class="success-animation">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: #10B981; margin-bottom: 2rem;"></i>
            </div>
            <h3>Payment Successful!</h3>
            <p>Your order has been confirmed and will be processed shortly.</p>
            <div class="order-details">
                <p><strong>Transaction ID:</strong> #TON${Date.now().toString().slice(-8)}</p>
                <p><strong>Payment Method:</strong> TON Wallet</p>
                <p><strong>Status:</strong> Confirmed</p>
            </div>
            <button class="btn-primary" onclick="closeModal('checkoutModal')" style="width: 100%; margin-top: 2rem;">
                Continue Shopping
            </button>
        </div>
    `;
    
    utils.showToast('Order placed successfully!', 'success');
}

// Newsletter
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const button = event.target.querySelector('button[type="submit"]');
    
    button.innerHTML = '<span class="loading"><span class="spinner"></span> Subscribing...</span>';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        button.style.background = '#10B981';
        utils.showToast('Successfully subscribed to newsletter!', 'success');
        
        setTimeout(() => {
            button.innerHTML = 'Subscribe';
            button.disabled = false;
            button.style.background = '';
            event.target.reset();
        }, 3000);
    }, 2000);
}

// Scroll to Top
function initializeScrollToTop() {
    const scrollToTop = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    });
}

// Add checkout button event listener
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', initiateCheckout);
    }
});

// Add toast styles to CSS
const toastStyles = `
<style>
.toast {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    padding: 1rem 1.5rem;
    z-index: 9999;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s ease-out;
    max-width: 400px;
}

.toast.show {
    transform: translateX(0);
    opacity: 1;
}

.toast-success {
    border-left: 4px solid #10B981;
}

.toast-error {
    border-left: 4px solid #EF4444;
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.toast-success .toast-content i {
    color: #10B981;
}

.toast-error .toast-content i {
    color: #EF4444;
}

.empty-cart {
    text-align: center;
    color: var(--gray-500);
    padding: 2rem;
    font-size: 1.1rem;
}

.order-review .order-items {
    margin: 1.5rem 0;
}

.order-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--gray-200);
}

.order-item:last-child {
    border-bottom: none;
}

.payment-info {
    background: var(--gray-50);
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    margin: 1.5rem 0;
}

.wallet-details {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.wallet-details i {
    font-size: 2rem;
    color: var(--primary-blue);
}

.payment-amount {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--gray-200);
    text-align: center;
}

.confirmation-step {
    text-align: center;
    padding: 2rem 0;
}

.success-animation {
    animation: bounce 1s ease-out;
}

@keyframes bounce {
    0%, 20%, 60%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-20px);
    }
    80% {
        transform: translateY(-10px);
    }
}

.order-details {
    background: var(--gray-50);
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    margin: 1.5rem 0;
    text-align: left;
}

.order-details p {
    margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
    .toast {
        top: 1rem;
        right: 1rem;
        left: 1rem;
        max-width: none;
        transform: translateY(-100px);
    }
    
    .toast.show {
        transform: translateY(0);
    }
}
</style>
`;

// Inject toast styles
document.head.insertAdjacentHTML('beforeend', toastStyles);

// Load TON Connect UI script
const tonConnectScript = document.createElement('script');
tonConnectScript.src = 'https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js';
tonConnectScript.onload = () => {
    console.log('TON Connect UI loaded successfully');
    // Initialize wallet after script loads
    if (tonWallet) {
        tonWallet.init();
    }
};
tonConnectScript.onerror = () => {
    console.error('Failed to load TON Connect UI');
    utils.showToast('Failed to load wallet integration', 'error');
};
document.head.appendChild(tonConnectScript);

// Service Worker Registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    utils.showToast('An error occurred. Please refresh the page.', 'error');
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    utils.showToast('An error occurred. Please try again.', 'error');
});