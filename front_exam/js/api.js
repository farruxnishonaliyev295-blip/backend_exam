/* ─── API WRAPPER ────────────────────────────────────────────── */
const API_BASE = 'http://localhost:4545/api';

const Api = {
  /* ── Token helpers ─────────────────────────────────────── */
  getToken()  { return localStorage.getItem('accessToken'); },
  setTokens(access, refresh) {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  },
  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  isLoggedIn() { return !!this.getToken(); },

  /* ── Core fetch ────────────────────────────────────────── */
  async request(method, path, body = null, auth = false) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth && this.getToken()) headers['Authorization'] = `Bearer ${this.getToken()}`;

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(API_BASE + path, opts);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
    return data;
  },

  get(path, auth = false)         { return this.request('GET',    path, null, auth); },
  post(path, body, auth = false)   { return this.request('POST',   path, body, auth); },
  put(path, body, auth = false)    { return this.request('PUT',    path, body, auth); },
  delete(path, auth = false)       { return this.request('DELETE', path, null, auth); },

  /* ── Auth ──────────────────────────────────────────────── */
  register(name, email, password)  { return this.post('/auth/register', { name, email, password }); },
  login(email, password)           { return this.post('/auth/login',    { email, password }); },

  /* ── Products ──────────────────────────────────────────── */
  getProducts()                    { return this.get('/product'); },
  getProduct(id)                   { return this.get(`/product/${id}`); },

  /* ── Categories ────────────────────────────────────────── */
  getCategories()                  { return this.get('/category'); },

  /* ── Feedback ──────────────────────────────────────────── */
  sendFeedback(payload)            { return this.post('/feedback', payload); },
};

/* ─── CART (localStorage) ───────────────────────────────────── */
const Cart = {
  _key: 'fq_cart',

  get()       { return JSON.parse(localStorage.getItem(this._key) || '[]'); },
  save(items) { localStorage.setItem(this._key, JSON.stringify(items)); },

  add(product, qty = 1) {
    const items = this.get();
    const idx   = items.findIndex(i => i._id === product._id);
    if (idx > -1) items[idx].qty += qty;
    else items.push({ ...product, qty });
    this.save(items);
  },

  updateQty(id, qty) {
    const items = this.get();
    const idx   = items.findIndex(i => i._id === id);
    if (idx > -1) {
      if (qty <= 0) items.splice(idx, 1);
      else items[idx].qty = qty;
    }
    this.save(items);
  },

  remove(id) {
    this.save(this.get().filter(i => i._id !== id));
  },

  clear() { localStorage.removeItem(this._key); },

  count()  { return this.get().reduce((s, i) => s + i.qty, 0); },

  total()  {
    return this.get().reduce((s, i) => s + (i.price * i.qty), 0);
  },
};

/* ─── TOAST helper ──────────────────────────────────────────── */
function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = `toast${type ? ' ' + type : ''} show`;
  setTimeout(() => { el.className = 'toast'; }, 3000);
}

/* ─── Mock product images ───────────────────────────────────── */
const FOOD_EMOJIS = ['🍕','🍔','🌮','🍜','🍣','🥗','🍰','🥤','🍟','🌯','🥩','🍝'];
function randomEmoji(seed) {
  const n = (seed || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return FOOD_EMOJIS[n % FOOD_EMOJIS.length];
}
