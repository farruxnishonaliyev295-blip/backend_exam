/* ══════════════════════════════════════════════════════════════
   04. PUBLIC MENU (QR VIEW)
══════════════════════════════════════════════════════════════ */
let _menuProducts  = [];
let _menuFiltered  = [];
let _menuCategory  = 'all';
let _menuSearch    = '';

async function renderMenu() {
  const app = document.getElementById('app');
  const cartCount = Cart.count();

  app.innerHTML = `
    <div class="page">
      <div class="navbar">
        <button class="back-btn" onclick="App.navigate('welcome')">&#8592;</button>
        <h2>🍽️ Menyu</h2>
        <button class="cart-icon-btn" onclick="App.navigate('cart')">
          🛒
          <span class="cart-badge" id="nav-cart-badge" ${cartCount === 0 ? 'style="display:none"' : ''}>${cartCount}</span>
        </button>
      </div>

      <!-- Search -->
      <div class="menu-search">
        <div class="search-box">
          <span>🔍</span>
          <input type="text" id="menu-search" placeholder="Taom qidirish..." oninput="menuOnSearch(this.value)" />
        </div>
      </div>

      <!-- Categories -->
      <div class="categories-scroll" id="cats-row">
        <div class="cat-chip active" data-cat="all" onclick="menuFilterCat('all', this)">Barchasi</div>
      </div>

      <!-- Grid -->
      <div class="menu-grid" id="menu-grid">
        <div class="page-loader" style="grid-column:1/-1">
          <div class="spinner"></div>
          <span>Yuklanmoqda...</span>
        </div>
      </div>

      <!-- Cart FAB -->
      <button class="cart-fab ${cartCount === 0 ? 'hidden' : ''}" id="cart-fab" onclick="App.navigate('cart')">
        🛒 Savatcha <span id="fab-count">${cartCount}</span> ta
      </button>
    </div>
  `;

  await loadMenuData();
}

async function loadMenuData() {
  try {
    const [prodRes, catRes] = await Promise.all([
      Api.getProducts(),
      Api.getCategories(),
    ]);

    _menuProducts = prodRes.data || prodRes.products || prodRes || [];
    const cats    = catRes.data  || catRes.categories  || catRes  || [];

    // Render category chips
    const row = document.getElementById('cats-row');
    if (row) {
      cats.forEach(cat => {
        const chip = document.createElement('div');
        chip.className = 'cat-chip';
        chip.dataset.cat = cat._id;
        chip.textContent = cat.name;
        chip.onclick = function() { menuFilterCat(cat._id, chip); };
        row.appendChild(chip);
      });
    }

    _menuFiltered = [..._menuProducts];
    renderMenuGrid();
  } catch (err) {
    renderMenuFallback();
  }
}

function renderMenuFallback() {
  // Show demo products when API is unavailable
  _menuProducts = [
    { _id: '1', name: 'Margherita Pizza', price: 55000, category: { name: 'Pizza' }, description: 'Klassik italyan pitsasi' },
    { _id: '2', name: 'Burger King', price: 42000, category: { name: 'Burger' }, description: 'Mazali go\'sht burger' },
    { _id: '3', name: 'Caesar Salad', price: 35000, category: { name: 'Salad' }, description: 'Yangi sabzavotlar' },
    { _id: '4', name: 'Pepsi Cola', price: 12000, category: { name: 'Ichimlik' }, description: 'Sovuq ichimlik' },
    { _id: '5', name: 'Lag\'mon', price: 28000, category: { name: 'Milliy' }, description: 'O\'zbek oshxonasi' },
    { _id: '6', name: 'Shashlik', price: 48000, category: { name: 'Milliy' }, description: 'Qo\'y go\'shtidan' },
  ];

  const row = document.getElementById('cats-row');
  if (row) {
    const uniqueCats = [...new Set(_menuProducts.map(p => p.category?.name).filter(Boolean))];
    uniqueCats.forEach(catName => {
      const chip = document.createElement('div');
      chip.className = 'cat-chip';
      chip.dataset.cat = catName;
      chip.textContent = catName;
      chip.onclick = function() { menuFilterCat(catName, chip); };
      row.appendChild(chip);
    });
  }

  _menuFiltered = [..._menuProducts];
  renderMenuGrid();
  showToast("API ulanmagan — demo ma'lumotlar ko'rsatilmoqda", '');
}

function renderMenuGrid() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  if (_menuFiltered.length === 0) {
    grid.innerHTML = `
      <div class="menu-empty">
        <span>😕</span>
        <p>Taomlar topilmadi</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = _menuFiltered.map(p => {
    const emoji = randomEmoji(p._id + p.name);
    const price = Number(p.price || 0).toLocaleString('uz-UZ');
    const imgHtml = p.image
      ? `<img src="http://localhost:4545/uploads/${p.image}" alt="${p.name}" onerror="this.parentElement.innerHTML='${emoji}'" />`
      : emoji;
    return `
      <div class="product-card" onclick="App.navigate('detail', { product: ${JSON.stringify(p).replace(/"/g, '&quot;')} })">
        <div class="product-card-img">${imgHtml}</div>
        <div class="product-card-body">
          <div class="product-card-name">${p.name}</div>
          <div class="product-card-price">${price} so'm</div>
          <button class="product-card-add" onclick="event.stopPropagation(); quickAddToCart('${p._id}')">
            + Qo'shish
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function menuOnSearch(val) {
  _menuSearch = val.toLowerCase();
  applyMenuFilter();
}

function menuFilterCat(catId, el) {
  _menuCategory = catId;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  applyMenuFilter();
}

function applyMenuFilter() {
  _menuFiltered = _menuProducts.filter(p => {
    const matchCat = _menuCategory === 'all'
      || p.category?._id === _menuCategory
      || p.category?.name === _menuCategory;
    const matchSearch = !_menuSearch || p.name.toLowerCase().includes(_menuSearch);
    return matchCat && matchSearch;
  });
  renderMenuGrid();
}

function quickAddToCart(id) {
  const product = _menuProducts.find(p => p._id === id);
  if (!product) return;
  Cart.add(product, 1);
  updateCartUI();
  showToast(`${product.name} savatchaga qo'shildi 🛒`, 'success');
}

function updateCartUI() {
  const count = Cart.count();
  const badge = document.getElementById('nav-cart-badge');
  const fab   = document.getElementById('cart-fab');
  const fabCount = document.getElementById('fab-count');

  if (badge) {
    badge.textContent = count;
    badge.style.display = count === 0 ? 'none' : 'flex';
  }
  if (fab) {
    fab.classList.toggle('hidden', count === 0);
  }
  if (fabCount) {
    fabCount.textContent = count;
  }
}
