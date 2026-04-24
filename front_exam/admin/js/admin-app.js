/* ══════════════════════════════════════════════════════════════
   ADMIN APP ROUTER
══════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',          icon: '📊', section: 'main' },
  { id: 'users',      label: 'Foydalanuvchilar',   icon: '👥', section: 'main' },
  { id: 'categories', label: 'Kategoriyalar',       icon: '🏷️', section: 'main' },
  { id: 'products',   label: 'Mahsulotlar',         icon: '🍽️', section: 'main' },
  { id: 'feedbacks',  label: 'Fikrlar',             icon: '💬', section: 'main' },
];

const PAGE_RENDERERS = {
  dashboard:  renderDashboard,
  users:      renderUsers,
  categories: renderCategories,
  products:   renderProducts,
  feedbacks:  renderFeedbacks,
};

const AdminApp = {
  current: 'dashboard',

  init() {
    if (!AApi.isLoggedIn()) {
      renderAdminLogin();
      return;
    }
    this.renderShell();
    this.navigate('dashboard');
  },

  navigate(page) {
    if (!PAGE_RENDERERS[page]) return;
    this.current = page;
    this._highlightNav(page);
    PAGE_RENDERERS[page]();
  },

  renderShell() {
    const user = AApi.getUser() || {};
    document.getElementById('admin-app').innerHTML = `
      <div class="a-layout">
        <!-- SIDEBAR -->
        <aside class="a-sidebar">
          <div class="a-sidebar-logo">
            <span>🍽️</span> Food<em>QR</em> Admin
          </div>

          <div class="a-sidebar-section">Asosiy</div>
          <nav id="a-nav">
            ${NAV_ITEMS.map(n => `
              <div class="a-nav-item" id="nav-${n.id}" onclick="AdminApp.navigate('${n.id}')">
                <span class="nav-icon">${n.icon}</span>
                ${n.label}
              </div>
            `).join('')}
          </nav>

          <div class="a-sidebar-footer">
            <div class="a-sidebar-user" onclick="AdminApp.logout()">
              <div class="a-avatar">${initials(user.name || 'AD')}</div>
              <div class="a-sidebar-user-info">
                <div class="a-sidebar-user-name">${user.name || 'Admin'}</div>
                <div class="a-sidebar-user-role">${user.role || 'admin'}</div>
              </div>
              <button class="a-logout-btn" title="Chiqish">⏻</button>
            </div>
          </div>
        </aside>

        <!-- MAIN -->
        <div class="a-main">
          <div class="a-topbar">
            <h1 id="a-page-title">Dashboard</h1>
            <div class="a-topbar-actions">
              <a href="index.html" class="a-btn a-btn-outline a-btn-sm">🌐 Saytga o'tish</a>
              <button class="a-btn a-btn-danger a-btn-sm" onclick="AdminApp.logout()">⏻ Chiqish</button>
            </div>
          </div>
          <div class="a-content" id="a-page-content">
            <div class="a-loader"><div class="a-spinner"></div></div>
          </div>
        </div>
      </div>
    `;
  },

  setPageTitle(title) {
    const el = document.getElementById('a-page-title');
    if (el) el.textContent = title;
    document.title = `${title} — FoodQR Admin`;
  },

  _highlightNav(page) {
    document.querySelectorAll('.a-nav-item').forEach(el => el.classList.remove('active'));
    const active = document.getElementById(`nav-${page}`);
    if (active) active.classList.add('active');
  },

  logout() {
    AApi.logout();
    aToast('Chiqildi', 'warning');
    setTimeout(() => renderAdminLogin(), 400);
  },
};

/* ─── Boot ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => AdminApp.init());
