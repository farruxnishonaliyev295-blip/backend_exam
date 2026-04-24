/* ══════════════════════════════════════════════════════════════
   USERS — full CRUD
   GET /users  GET /users/:id  POST /users  PUT /users/:id  DELETE /users/:id
══════════════════════════════════════════════════════════════ */
let _users = [];
let _usersFiltered = [];

async function renderUsers() {
  AdminApp.setPageTitle('Foydalanuvchilar');
  const main = document.getElementById('a-page-content');
  main.innerHTML = `<div class="a-loader"><div class="a-spinner"></div></div>`;

  try {
    const res = await AApi.getUsers();
    _users = res.data || res.users || res || [];
    _usersFiltered = [..._users];
    paintUsersPage();
  } catch (err) {
    main.innerHTML = `<div class="a-empty"><span>⚠️</span><p>${err.message}</p></div>`;
  }
}

function paintUsersPage() {
  const main = document.getElementById('a-page-content');
  main.innerHTML = `
    <div class="a-page-header">
      <div>
        <h2>👥 Foydalanuvchilar</h2>
        <p>${_users.length} ta foydalanuvchi</p>
      </div>
      <button class="a-btn a-btn-primary" onclick="openUserCreate()">
        ＋ Yangi foydalanuvchi
      </button>
    </div>

    <div class="a-toolbar">
      <div class="a-search">
        <span>🔍</span>
        <input placeholder="Ism yoki email bo'yicha qidirish..." oninput="filterUsers(this.value)" />
      </div>
      <select class="a-select" style="width:auto;padding:9px 13px" onchange="filterUsersByRole(this.value)">
        <option value="">Barcha rollar</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
    </div>

    <div class="a-card">
      <div class="a-table-wrap">
        <table class="a-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Foydalanuvchi</th>
              <th>Role</th>
              <th>Ro'yxat sanasi</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody id="users-tbody">
            ${renderUsersRows()}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderUsersRows() {
  if (_usersFiltered.length === 0)
    return `<tr><td colspan="5"><div class="a-empty"><span>👥</span><p>Foydalanuvchilar topilmadi</p></div></td></tr>`;

  return _usersFiltered.map((u, i) => `
    <tr>
      <td style="color:var(--muted);font-size:.8rem">${i + 1}</td>
      <td>
        <div class="t-user-cell">
          <div class="t-avatar">${initials(u.name)}</div>
          <div>
            <div class="name">${u.name}</div>
            <div class="email">${u.email}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${u.role === 'admin' ? 'badge-purple' : 'badge-blue'}">${u.role}</span></td>
      <td style="color:var(--muted);font-size:.82rem">${fmtDate(u.createdAt)}</td>
      <td>
        <div class="actions">
          <button class="a-btn a-btn-outline a-btn-xs" onclick="openUserEdit('${u._id}')">✏️ Tahrir</button>
          <button class="a-btn a-btn-danger a-btn-xs" onclick="deleteUser('${u._id}','${u.name}')">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterUsers(q) {
  const query = q.toLowerCase();
  _usersFiltered = _users.filter(u =>
    u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query)
  );
  document.getElementById('users-tbody').innerHTML = renderUsersRows();
}

function filterUsersByRole(role) {
  _usersFiltered = role ? _users.filter(u => u.role === role) : [..._users];
  document.getElementById('users-tbody').innerHTML = renderUsersRows();
}

/* ── CREATE ──────────────────────────────────────────────────── */
function openUserCreate() {
  AdminModal.open('➕ Yangi foydalanuvchi', `
    <form onsubmit="submitUserCreate(event)">
      <div class="a-form-row">
        <div class="a-form-group">
          <label>Ism *</label>
          <input class="a-input" id="uc-name" placeholder="To'liq ism" required minlength="3"/>
        </div>
        <div class="a-form-group">
          <label>Role</label>
          <select class="a-select" id="uc-role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div class="a-form-group">
        <label>Email *</label>
        <input class="a-input" id="uc-email" type="email" placeholder="email@example.com" required />
      </div>
      <div class="a-form-group">
        <label>Parol *</label>
        <input class="a-input" id="uc-pass" type="password" placeholder="Kamida 6 ta belgi" required minlength="6"/>
      </div>
      <div class="a-form-actions">
        <button type="submit" class="a-btn a-btn-primary a-btn-block" id="uc-btn">Yaratish</button>
        <button type="button" class="a-btn a-btn-outline" onclick="AdminModal.close()">Bekor</button>
      </div>
    </form>
  `);
}

async function submitUserCreate(e) {
  e.preventDefault();
  const btn = document.getElementById('uc-btn');
  btn.disabled = true; btn.innerHTML = '<span class="a-spinner"></span>';

  try {
    const newUser = await AApi.createUser({
      name:     document.getElementById('uc-name').value.trim(),
      email:    document.getElementById('uc-email').value.trim(),
      password: document.getElementById('uc-pass').value,
      role:     document.getElementById('uc-role').value,
    });
    const created = newUser.data || newUser;
    _users.push(created);
    _usersFiltered = [..._users];
    AdminModal.close();
    document.getElementById('users-tbody').innerHTML = renderUsersRows();
    aToast('Foydalanuvchi yaratildi!', 'success');
  } catch (err) {
    aToast(err.message, 'error');
    btn.disabled = false; btn.textContent = 'Yaratish';
  }
}

/* ── EDIT ────────────────────────────────────────────────────── */
function openUserEdit(id) {
  const u = _users.find(u => u._id === id);
  if (!u) return;

  AdminModal.open('✏️ Foydalanuvchini tahrirlash', `
    <form onsubmit="submitUserEdit(event,'${id}')">
      <div class="a-form-row">
        <div class="a-form-group">
          <label>Ism *</label>
          <input class="a-input" id="ue-name" value="${u.name}" required minlength="3"/>
        </div>
        <div class="a-form-group">
          <label>Role</label>
          <select class="a-select" id="ue-role">
            <option value="user" ${u.role === 'user' ? 'selected' : ''}>User</option>
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
          </select>
        </div>
      </div>
      <div class="a-form-group">
        <label>Email *</label>
        <input class="a-input" id="ue-email" type="email" value="${u.email}" required />
      </div>
      <div class="a-form-group">
        <label>Yangi parol <span style="color:var(--muted)">(ixtiyoriy)</span></label>
        <input class="a-input" id="ue-pass" type="password" placeholder="O'zgartirish uchun kiriting" minlength="6"/>
      </div>
      <div class="a-form-actions">
        <button type="submit" class="a-btn a-btn-primary a-btn-block" id="ue-btn">Saqlash</button>
        <button type="button" class="a-btn a-btn-outline" onclick="AdminModal.close()">Bekor</button>
      </div>
    </form>
  `);
}

async function submitUserEdit(e, id) {
  e.preventDefault();
  const btn = document.getElementById('ue-btn');
  btn.disabled = true; btn.innerHTML = '<span class="a-spinner"></span>';

  const payload = {
    name:  document.getElementById('ue-name').value.trim(),
    email: document.getElementById('ue-email').value.trim(),
    role:  document.getElementById('ue-role').value,
  };
  const pass = document.getElementById('ue-pass').value;
  if (pass) payload.password = pass;

  try {
    const updated = await AApi.updateUser(id, payload);
    const data = updated.data || updated;
    const idx = _users.findIndex(u => u._id === id);
    if (idx > -1) _users[idx] = { ..._users[idx], ...data };
    _usersFiltered = [..._users];
    AdminModal.close();
    document.getElementById('users-tbody').innerHTML = renderUsersRows();
    aToast('Foydalanuvchi yangilandi!', 'success');
  } catch (err) {
    aToast(err.message, 'error');
    btn.disabled = false; btn.textContent = 'Saqlash';
  }
}

/* ── DELETE ──────────────────────────────────────────────────── */
async function deleteUser(id, name) {
  const ok = await AdminConfirm.show(`"${name}" foydalanuvchisini o'chirishni tasdiqlaysizmi?`);
  if (!ok) return;

  try {
    await AApi.deleteUser(id);
    _users = _users.filter(u => u._id !== id);
    _usersFiltered = _usersFiltered.filter(u => u._id !== id);
    document.getElementById('users-tbody').innerHTML = renderUsersRows();
    aToast('Foydalanuvchi o\'chirildi', 'warning');
  } catch (err) {
    aToast(err.message, 'error');
  }
}
