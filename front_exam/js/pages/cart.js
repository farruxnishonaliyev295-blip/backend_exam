/* ══════════════════════════════════════════════════════════════
   06. CART PAGE
══════════════════════════════════════════════════════════════ */
function renderCart() {
  const app   = document.getElementById('app');
  const items = Cart.get();

  if (items.length === 0) {
    app.innerHTML = `
      <div class="page">
        <div class="navbar">
          <button class="back-btn" onclick="App.navigate('menu')">&#8592;</button>
          <h2>Savatcha</h2>
        </div>
        <div class="cart-empty">
          <span>🛒</span>
          <h3>Savatcha bo'sh</h3>
          <p>Hali hech narsa qo'shilmadi</p>
          <button class="btn btn-primary" onclick="App.navigate('menu')">Menyuga o'tish</button>
        </div>
      </div>
    `;
    return;
  }

  const deliveryFee = 10000;
  const subtotal    = Cart.total();
  const total       = subtotal + deliveryFee;

  app.innerHTML = `
    <div class="page cart-page">
      <div class="navbar">
        <button class="back-btn" onclick="App.navigate('menu')">&#8592;</button>
        <h2>Savatcha</h2>
        <button class="btn btn-ghost btn-sm" onclick="clearCart()">Tozalash</button>
      </div>

      <div class="page-content">
        <p class="section-title">${items.length} ta mahsulot</p>

        <div class="cart-list" id="cart-list">
          ${items.map(item => renderCartItem(item)).join('')}
        </div>

        <div class="cart-summary">
          <div class="cart-summary-row">
            <span>Mahsulotlar</span>
            <span>${subtotal.toLocaleString('uz-UZ')} so'm</span>
          </div>
          <div class="cart-summary-row">
            <span>Yetkazib berish</span>
            <span>${deliveryFee.toLocaleString('uz-UZ')} so'm</span>
          </div>
          <div class="cart-summary-row total">
            <span>Jami</span>
            <span id="cart-total">${total.toLocaleString('uz-UZ')} so'm</span>
          </div>
        </div>
      </div>

      <div class="cart-checkout">
        <button class="btn btn-primary btn-block" onclick="placeOrder()">
          ✅ Buyurtma berish — ${total.toLocaleString('uz-UZ')} so'm
        </button>
      </div>
    </div>
  `;
}

function renderCartItem(item) {
  const emoji = randomEmoji(item._id + item.name);
  const imgHtml = item.image
    ? `<img src="${item.image}" alt="${item.name}" onerror="this.parentElement.innerHTML='${emoji}'" />`
    : emoji;

  return `
    <div class="cart-item" id="cart-item-${item._id}">
      <div class="cart-item-img">${imgHtml}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${Number(item.price).toLocaleString('uz-UZ')} so'm</div>
        <div class="cart-item-qty">
          <button class="qty-mini-btn" onclick="cartChangeQty('${item._id}', ${item.qty - 1})">&#8722;</button>
          <span class="qty-mini-val" id="qty-val-${item._id}">${item.qty}</span>
          <button class="qty-mini-btn" onclick="cartChangeQty('${item._id}', ${item.qty + 1})">&#43;</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="cartRemove('${item._id}')" title="O'chirish">🗑️</button>
    </div>
  `;
}

function cartChangeQty(id, newQty) {
  Cart.updateQty(id, newQty);
  if (newQty <= 0) {
    const el = document.getElementById(`cart-item-${id}`);
    if (el) el.remove();
    if (Cart.count() === 0) { renderCart(); return; }
  } else {
    const valEl = document.getElementById(`qty-val-${id}`);
    if (valEl) valEl.textContent = newQty;
  }
  recalcSummary();
}

function cartRemove(id) {
  Cart.remove(id);
  const el = document.getElementById(`cart-item-${id}`);
  if (el) { el.style.opacity = '0'; el.style.transform = 'translateX(40px)'; el.style.transition = '.25s'; }
  setTimeout(() => {
    if (Cart.count() === 0) renderCart();
    else { if (el) el.remove(); recalcSummary(); }
  }, 260);
}

function recalcSummary() {
  const deliveryFee = 10000;
  const subtotal    = Cart.total();
  const total       = subtotal + deliveryFee;
  const el = document.getElementById('cart-total');
  if (el) el.textContent = `${total.toLocaleString('uz-UZ')} so'm`;
}

function clearCart() {
  if (!confirm('Savatchani tozalashni xohlaysizmi?')) return;
  Cart.clear();
  renderCart();
  showToast('Savatcha tozalandi', '');
}

function placeOrder() {
  Cart.clear();
  showToast("Buyurtmangiz qabul qilindi! 🎉 Ta'ingiz mazali bo'lsin!", 'success');
  setTimeout(() => App.navigate('feedback'), 1200);
}
