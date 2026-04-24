/* ══════════════════════════════════════════════════════════════
   ADMIN API  —  base URL: http://localhost:3000/api
══════════════════════════════════════════════════════════════ */
const ADMIN_BASE = 'http://localhost:4545/api';

const AApi = {
  /* ── Tokens ──────────────────────────────────────────────── */
  getToken()          { return localStorage.getItem('admin_token'); },
  setToken(t)         { localStorage.setItem('admin_token', t); },
  setRefresh(t)       { localStorage.setItem('admin_refresh', t); },
  getRefresh()        { return localStorage.getItem('admin_refresh'); },
  setUser(u)          { localStorage.setItem('admin_user', JSON.stringify(u)); },
  getUser()           { try { return JSON.parse(localStorage.getItem('admin_user')); } catch { return null; } },
  isLoggedIn()        { return !!this.getToken(); },
  logout()            { ['admin_token','admin_refresh','admin_user'].forEach(k => localStorage.removeItem(k)); },

  /* ── Core ────────────────────────────────────────────────── */
  async req(method, path, body = null, isForm = false) {
    const headers = {};
    if (!isForm) headers['Content-Type'] = 'application/json';
    if (this.getToken()) headers['Authorization'] = `Bearer ${this.getToken()}`;

    const opts = { method, headers };
    if (body) opts.body = isForm ? body : JSON.stringify(body);

    const res  = await fetch(ADMIN_BASE + path, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
    return data;
  },

  get(path)              { return this.req('GET',    path); },
  post(path, body)       { return this.req('POST',   path, body); },
  put(path, body)        { return this.req('PUT',    path, body); },
  del(path)              { return this.req('DELETE', path); },
  postForm(path, fd)     { return this.req('POST',   path, fd, true); },

  /* ── Auth ────────────────────────────────────────────────── */
  login(email, password) { return this.post('/auth/login', { email, password }); },

  /* ── Users ───────────────────────────────────────────────── */
  getUsers()             { return this.get('/users'); },
  getUser(id)            { return this.get(`/users/${id}`); },
  createUser(d)          { return this.post('/users', d); },
  updateUser(id, d)      { return this.put(`/users/${id}`, d); },
  deleteUser(id)         { return this.del(`/users/${id}`); },

  /* ── Categories ──────────────────────────────────────────── */
  getCategories()        { return this.get('/category'); },
  createCategory(d)      { return this.post('/category', d); },

  /* ── Products ────────────────────────────────────────────── */
  getProducts(catId)     { return this.get('/product' + (catId ? `?category_id=${catId}` : '')); },
  createProduct(fd)      { return this.postForm('/product', fd); },

  /* ── Feedbacks ───────────────────────────────────────────── */
  getFeedbacks()         { return this.get('/feedback'); },
};

/* ─── TOAST ─────────────────────────────────────────────────── */
function aToast(msg, type = '', icon = '') {
  const el = document.getElementById('admin-toast');
  const icons = { success: '✅', error: '❌', warning: '⚠️' };
  el.innerHTML = `<span>${icon || icons[type] || 'ℹ️'}</span> ${msg}`;
  el.className = `a-toast show${type ? ' ' + type : ''}`;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = 'a-toast'; }, 3500);
}

/* ─── MODAL ─────────────────────────────────────────────────── */
const AdminModal = {
  open(title, bodyHtml) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    document.getElementById('modal-overlay').classList.remove('hidden');
  },
  close() {
    document.getElementById('modal-overlay').classList.add('hidden');
    document.getElementById('modal-body').innerHTML = '';
  },
  closeOnOverlay(e) {
    if (e.target === document.getElementById('modal-overlay')) this.close();
  },
};

/* ─── CONFIRM DIALOG ────────────────────────────────────────── */
const AdminConfirm = {
  _resolve: null,
  show(msg) {
    document.getElementById('confirm-msg').textContent = msg;
    document.getElementById('confirm-overlay').classList.remove('hidden');
    return new Promise(r => { this._resolve = r; });
  },
  ok()     { this._close(true); },
  cancel() { this._close(false); },
  _close(val) {
    document.getElementById('confirm-overlay').classList.add('hidden');
    if (this._resolve) { this._resolve(val); this._resolve = null; }
  },
};

/* ─── HELPERS ───────────────────────────────────────────────── */
function initials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('uz-UZ', { day:'2-digit', month:'short', year:'numeric' });
}

function fmtPrice(n) {
  return Number(n || 0).toLocaleString('uz-UZ') + ' so\'m';
}

const FOOD_EMJ = ['🍕','🍔','🌮','🍜','🍣','🥗','🍰','🥤','🍟','🌯','🥩','🍝'];
function foodEmoji(seed) {
  const n = String(seed).split('').reduce((a,c) => a + c.charCodeAt(0), 0);
  return FOOD_EMJ[n % FOOD_EMJ.length];
}
