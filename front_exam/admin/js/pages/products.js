/* ══════════════════════════════════════════════════════════════
   PRODUCTS — GET + POST (multipart/form-data image)
   GET /product?category_id=   POST /product (protect + admin)
══════════════════════════════════════════════════════════════ */
let _prods    = [];
let _prodCats = [];

async function renderProducts() {
  AdminApp.setPageTitle('Mahsulotlar');
  const main = document.getElementById('a-page-content');
  main.innerHTML = `<div class="a-loader"><div class="a-spinner"></div></div>`;

  try {
    const [prodsRes, catsRes] = await Promise.all([
      AApi.getProducts(),
      AApi.getCategories(),
    ]);
    _prods    = Array.isArray(prodsRes) ? prodsRes : (prodsRes.data || prodsRes.products || []);
    _prodCats = Array.isArray(catsRes)  ? catsRes  : (catsRes.data  || catsRes.categories || []);
    paintProdsPage();
  } catch (err) {
    main.innerHTML = `<div class="a-empty"><span>⚠️</span><p>${err.message}</p></div>`;
  }
}

function paintProdsPage() {
  const main = document.getElementById('a-page-content');
  const totalSum = _prods.reduce((s, p) => s + (p.price || 0), 0);

  main.innerHTML = `
    <div class="a-page-header">
      <div>
        <h2>🍽️ Mahsulotlar</h2>
        <p>${_prods.length} ta mahsulot · Jami: ${fmtPrice(totalSum)}</p>
      </div>
      <button class="a-btn a-btn-primary" onclick="openProdCreate()">
        ＋ Yangi mahsulot
      </button>
    </div>

    <div class="a-toolbar">
      <div class="a-search">
        <span>🔍</span>
        <input placeholder="Mahsulot nomi..." oninput="filterProds(this.value)" />
      </div>
      <select class="a-select" style="width:auto;padding:9px 13px" onchange="filterProdsByCat(this.value)">
        <option value="">Barcha kategoriyalar</option>
        ${_prodCats.map(c => `<option value="${c._id}">${c.name}</option>`).join('')}
      </select>
    </div>

    <div class="a-card">
      <div class="a-table-wrap">
        <table class="a-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Mahsulot</th>
              <th>Kategoriya</th>
              <th>Narx</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody id="prods-tbody">${renderProdsRows(_prods)}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderProdsRows(list) {
  if (list.length === 0)
    return `<tr><td colspan="5"><div class="a-empty"><span>🍽️</span><p>Mahsulotlar topilmadi</p></div></td></tr>`;

  return list.map((p, i) => {
    const emoji = foodEmoji(p._id + p.name);
    const catName = p.category_id?.name || p.category?.name || '—';
    const imgHtml = p.image
      ? `<img src="http://localhost:4545/uploads/${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='${emoji}'" />`
      : emoji;
    return `
      <tr>
        <td style="color:var(--muted);font-size:.8rem">${i + 1}</td>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div class="t-product-img">${imgHtml}</div>
            <div>
              <div style="font-weight:600">${p.name}</div>
              <div style="font-size:.75rem;color:var(--muted)">${p._id}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-purple">${catName}</span></td>
        <td style="font-weight:700;color:var(--warning)">${fmtPrice(p.price)}</td>
        <td style="color:var(--muted);font-size:.82rem">${fmtDate(p.createdAt)}</td>
      </tr>
    `;
  }).join('');
}

function filterProds(q) {
  const filtered = _prods.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  document.getElementById('prods-tbody').innerHTML = renderProdsRows(filtered);
}

function filterProdsByCat(catId) {
  const filtered = catId
    ? _prods.filter(p => (p.category_id?._id || p.category_id) === catId)
    : [..._prods];
  document.getElementById('prods-tbody').innerHTML = renderProdsRows(filtered);
}

/* ── CREATE ──────────────────────────────────────────────────── */
function openProdCreate() {
  const catOpts = _prodCats.map(c => `<option value="${c._id}">${c.name}</option>`).join('');

  AdminModal.open('➕ Yangi mahsulot', `
    <form onsubmit="submitProdCreate(event)" enctype="multipart/form-data">
      <div class="a-form-group">
        <label>Mahsulot rasmi</label>
        <div class="img-preview-box" id="img-prev" onclick="document.getElementById('pc-img').click()">
          <div class="ph"><span>📷</span>Rasm tanlash uchun bosing</div>
        </div>
        <input type="file" id="pc-img" accept="image/*" style="display:none" onchange="previewImg(this)" />
      </div>
      <div class="a-form-group">
        <label>Mahsulot nomi *</label>
        <input class="a-input" id="pc-name" placeholder="Masalan: Margherita Pizza" required />
      </div>
      <div class="a-form-row">
        <div class="a-form-group">
          <label>Narx (so'm) *</label>
          <input class="a-input" id="pc-price" type="number" placeholder="55000" min="0" required />
        </div>
        <div class="a-form-group">
          <label>Kategoriya *</label>
          <select class="a-select" id="pc-cat" required>
            <option value="">Tanlang...</option>
            ${catOpts}
          </select>
        </div>
      </div>
      ${catOpts === '' ? `<p style="color:var(--warning);font-size:.82rem;margin-bottom:12px">⚠️ Avval kategoriya yarating!</p>` : ''}
      <div class="a-form-actions">
        <button type="submit" class="a-btn a-btn-primary a-btn-block" id="pc-btn">Yaratish</button>
        <button type="button" class="a-btn a-btn-outline" onclick="AdminModal.close()">Bekor</button>
      </div>
    </form>
  `);
}

function previewImg(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('img-prev').innerHTML =
      `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:6px" />`;
  };
  reader.readAsDataURL(file);
}

async function submitProdCreate(e) {
  e.preventDefault();
  const btn = document.getElementById('pc-btn');
  btn.disabled = true; btn.innerHTML = '<span class="a-spinner"></span>';

  const fd = new FormData();
  fd.append('name',        document.getElementById('pc-name').value.trim());
  fd.append('price',       document.getElementById('pc-price').value);
  fd.append('category_id', document.getElementById('pc-cat').value);

  const imgFile = document.getElementById('pc-img').files[0];
  if (imgFile) fd.append('image', imgFile);

  try {
    const created = await AApi.createProduct(fd);
    _prods.push(created);
    AdminModal.close();
    document.getElementById('prods-tbody').innerHTML = renderProdsRows(_prods);
    aToast('Mahsulot yaratildi!', 'success');
  } catch (err) {
    aToast(err.message, 'error');
    btn.disabled = false; btn.textContent = 'Yaratish';
  }
}
