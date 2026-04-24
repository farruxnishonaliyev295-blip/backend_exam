/* ══════════════════════════════════════════════════════════════
   CATEGORIES — GET + POST
   GET /category   POST /category (protect + admin)
══════════════════════════════════════════════════════════════ */
let _cats = [];

async function renderCategories() {
  AdminApp.setPageTitle('Kategoriyalar');
  const main = document.getElementById('a-page-content');
  main.innerHTML = `<div class="a-loader"><div class="a-spinner"></div></div>`;

  try {
    const res = await AApi.getCategories();
    _cats = Array.isArray(res) ? res : (res.data || res.categories || []);
    paintCatsPage();
  } catch (err) {
    main.innerHTML = `<div class="a-empty"><span>⚠️</span><p>${err.message}</p></div>`;
  }
}

function paintCatsPage() {
  const main = document.getElementById('a-page-content');
  main.innerHTML = `
    <div class="a-page-header">
      <div>
        <h2>🏷️ Kategoriyalar</h2>
        <p>${_cats.length} ta kategoriya</p>
      </div>
      <button class="a-btn a-btn-primary" onclick="openCatCreate()">
        ＋ Yangi kategoriya
      </button>
    </div>

    <div class="a-toolbar">
      <div class="a-search">
        <span>🔍</span>
        <input placeholder="Kategoriya nomi..." oninput="filterCats(this.value)" />
      </div>
    </div>

    <div class="a-card">
      <div class="a-table-wrap">
        <table class="a-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kategoriya nomi</th>
              <th>Yaratilgan sana</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody id="cats-tbody">${renderCatsRows(_cats)}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderCatsRows(list) {
  if (list.length === 0)
    return `<tr><td colspan="4"><div class="a-empty"><span>🏷️</span><p>Kategoriyalar topilmadi</p></div></td></tr>`;

  const colors = ['badge-purple','badge-green','badge-yellow','badge-blue','badge-red'];
  return list.map((c, i) => `
    <tr>
      <td style="color:var(--muted);font-size:.8rem">${i + 1}</td>
      <td>
        <span class="badge ${colors[i % colors.length]}" style="font-size:.85rem;padding:5px 14px">
          🏷️ ${c.name}
        </span>
      </td>
      <td style="color:var(--muted);font-size:.82rem">${fmtDate(c.createdAt)}</td>
      <td style="color:var(--muted);font-size:.72rem;font-family:monospace">${c._id}</td>
    </tr>
  `).join('');
}

function filterCats(q) {
  const filtered = _cats.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
  document.getElementById('cats-tbody').innerHTML = renderCatsRows(filtered);
}

/* ── CREATE ──────────────────────────────────────────────────── */
function openCatCreate() {
  AdminModal.open('➕ Yangi kategoriya', `
    <form onsubmit="submitCatCreate(event)">
      <div class="a-form-group">
        <label>Kategoriya nomi *</label>
        <input class="a-input" id="cc-name" placeholder="Masalan: Pizza, Burgerlar..." required />
      </div>
      <p style="font-size:.8rem;color:var(--muted);margin-bottom:16px">
        ℹ️ Kategoriya yaratish admin tokenini talab qiladi.
      </p>
      <div class="a-form-actions">
        <button type="submit" class="a-btn a-btn-primary a-btn-block" id="cc-btn">Yaratish</button>
        <button type="button" class="a-btn a-btn-outline" onclick="AdminModal.close()">Bekor</button>
      </div>
    </form>
  `);
}

async function submitCatCreate(e) {
  e.preventDefault();
  const btn = document.getElementById('cc-btn');
  btn.disabled = true; btn.innerHTML = '<span class="a-spinner"></span>';

  try {
    const created = await AApi.createCategory({ name: document.getElementById('cc-name').value.trim() });
    _cats.push(created);
    AdminModal.close();
    document.getElementById('cats-tbody').innerHTML = renderCatsRows(_cats);
    // update header count
    document.querySelector('#a-page-content .a-page-header p').textContent = `${_cats.length} ta kategoriya`;
    aToast('Kategoriya yaratildi!', 'success');
  } catch (err) {
    aToast(err.message, 'error');
    btn.disabled = false; btn.textContent = 'Yaratish';
  }
}
