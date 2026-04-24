/* ══════════════════════════════════════════════════════════════
   05. PRODUCT DETAIL
══════════════════════════════════════════════════════════════ */
let _detailQty = 1;
let _detailProduct = null;

function renderDetail(params = {}) {
  const product = params.product;
  if (!product) { App.navigate('menu'); return; }

  _detailProduct = product;
  _detailQty     = 1;

  const app   = document.getElementById('app');
  const emoji = randomEmoji(product._id + product.name);
  const price = Number(product.price || 0);
  const catName = product.category?.name || '';

  const imgHtml = product.image
    ? `<img src="http://localhost:4545/uploads/${product.image}" alt="${product.name}" onerror="this.outerHTML='<span style=\\'font-size:6rem\\'>${emoji}</span>'" />`
    : `<span style="font-size:6rem">${emoji}</span>`;

  app.innerHTML = `
    <div class="detail-page page">
      <div class="navbar">
        <button class="back-btn" onclick="App.navigate('menu')">&#8592;</button>
        <h2>Taom haqida</h2>
        <button class="cart-icon-btn" onclick="App.navigate('cart')">
          🛒
          ${Cart.count() > 0 ? `<span class="cart-badge">${Cart.count()}</span>` : ''}
        </button>
      </div>

      <div class="detail-hero">${imgHtml}</div>

      <div class="detail-body">
        ${catName ? `<div class="detail-category">${catName}</div>` : ''}
        <h1 class="detail-name">${product.name}</h1>
        <p class="detail-desc">${product.description || 'Mazali va sifatli taom. Oshpazimiz eng yaxshi ingredientlardan tayyorlaydi.'}</p>

        <div class="detail-price" id="detail-price">${price.toLocaleString('uz-UZ')} so'm</div>

        <!-- Quantity -->
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(-1)">&#8722;</button>
          <span class="qty-value" id="detail-qty">1</span>
          <button class="qty-btn" onclick="changeQty(1)">&#43;</button>
        </div>

        <div class="detail-total">
          Jami: <strong id="detail-total">${price.toLocaleString('uz-UZ')} so'm</strong>
        </div>

        <button class="btn btn-primary btn-block" onclick="addDetailToCart()">
          🛒 Savatchaga qo'shish
        </button>

        <div style="height:16px"></div>

        <button class="btn btn-outline btn-block" onclick="App.navigate('feedback')">
          ⭐ Fikr qoldiring
        </button>
      </div>
    </div>
  `;
}

function changeQty(delta) {
  _detailQty = Math.max(1, _detailQty + delta);
  document.getElementById('detail-qty').textContent = _detailQty;

  const price = Number(_detailProduct?.price || 0);
  const total = (price * _detailQty).toLocaleString('uz-UZ');
  document.getElementById('detail-total').textContent = `${total} so'm`;
}

function addDetailToCart() {
  if (!_detailProduct) return;
  Cart.add(_detailProduct, _detailQty);
  showToast(`${_detailQty} ta ${_detailProduct.name} qo'shildi 🛒`, 'success');
  setTimeout(() => App.navigate('cart'), 600);
}
