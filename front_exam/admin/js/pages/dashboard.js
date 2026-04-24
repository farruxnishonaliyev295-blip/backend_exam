/* ══════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════ */
async function renderDashboard() {
  AdminApp.setPageTitle('Dashboard');

  const main = document.getElementById('a-page-content');
  main.innerHTML = `<div class="a-loader"><div class="a-spinner"></div> Yuklanmoqda...</div>`;

  try {
    const [usersRes, catsRes, prodsRes, fbRes] = await Promise.allSettled([
      AApi.getUsers(),
      AApi.getCategories(),
      AApi.getProducts(),
      AApi.getFeedbacks(),
    ]);

    const users    = extract(usersRes);
    const cats     = extract(catsRes);
    const prods    = extract(prodsRes);
    const feedbacks = extract(fbRes);

    const adminCount  = users.filter(u => u.role === 'admin').length;
    const reviewCount = feedbacks.filter(f => f.type === 'review').length;
    const compCount   = feedbacks.filter(f => f.type === 'complaint').length;

    main.innerHTML = `
      <!-- Stat cards -->
      <div class="a-stats-grid">
        ${statCard('👥', users.length, "Foydalanuvchilar", '#6c63ff', 'rgba(108,99,255,.15)')}
        ${statCard('🏷️', cats.length,  "Kategoriyalar",    '#22c55e', 'rgba(34,197,94,.15)')}
        ${statCard('🍽️', prods.length, "Mahsulotlar",      '#f59e0b', 'rgba(245,158,11,.15)')}
        ${statCard('💬', feedbacks.length, "Fikrlar",      '#38bdf8', 'rgba(56,189,248,.15)')}
      </div>

      <!-- Two columns -->
      <div class="a-widgets-row">
        <!-- Recent users -->
        <div class="a-card">
          <div class="a-card-header">
            <h3>👥 So'ngi foydalanuvchilar</h3>
            <button class="a-btn a-btn-ghost a-btn-sm" onclick="AdminApp.navigate('users')">Barchasi →</button>
          </div>
          <div class="a-table-wrap">
            <table class="a-table">
              <thead><tr><th>Ism</th><th>Role</th><th>Sana</th></tr></thead>
              <tbody>
                ${users.slice(-5).reverse().map(u => `
                  <tr>
                    <td><div class="t-user-cell">
                      <div class="t-avatar">${initials(u.name)}</div>
                      <div><div class="name">${u.name}</div><div class="email">${u.email}</div></div>
                    </div></td>
                    <td><span class="badge ${u.role === 'admin' ? 'badge-purple' : 'badge-blue'}">${u.role}</span></td>
                    <td style="color:var(--muted);font-size:.8rem">${fmtDate(u.createdAt)}</td>
                  </tr>`).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--muted);padding:20px">Ma\'lumot yo\'q</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Feedback summary -->
        <div class="a-card">
          <div class="a-card-header">
            <h3>💬 Fikrlar tahlili</h3>
            <button class="a-btn a-btn-ghost a-btn-sm" onclick="AdminApp.navigate('feedbacks')">Barchasi →</button>
          </div>
          <div class="a-card-body">
            <div style="display:flex;flex-direction:column;gap:14px">
              ${feedbackBar('✅ Sharhlar (review)', reviewCount, feedbacks.length, 'var(--success)')}
              ${feedbackBar('⚠️ Shikoyatlar (complaint)', compCount, feedbacks.length, 'var(--danger)')}
            </div>

            <div style="margin-top:24px">
              <p style="font-size:.78rem;color:var(--muted);text-transform:uppercase;font-weight:700;letter-spacing:.06em;margin-bottom:12px">Admin hisob: ${adminCount}</p>
              <div style="display:flex;gap:10px;flex-wrap:wrap">
                <button class="a-btn a-btn-primary a-btn-sm" onclick="AdminApp.navigate('users')">Foydalanuvchilar</button>
                <button class="a-btn a-btn-outline a-btn-sm" onclick="AdminApp.navigate('products')">Mahsulotlar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent feedbacks -->
      <div class="a-card" style="margin-top:16px">
        <div class="a-card-header">
          <h3>💬 So'ngi fikrlar</h3>
        </div>
        <div class="a-table-wrap">
          <table class="a-table">
            <thead><tr><th>Xabar</th><th>Tur</th><th>Qurilma</th><th>Sana</th></tr></thead>
            <tbody>
              ${feedbacks.slice(-5).reverse().map(f => `
                <tr>
                  <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${f.message || '—'}</td>
                  <td><span class="badge ${f.type === 'review' ? 'badge-green' : 'badge-red'}">${f.type}</span></td>
                  <td style="color:var(--muted);font-size:.75rem;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${f.device_info ? f.device_info.split(' ')[0] : '—'}</td>
                  <td style="color:var(--muted);font-size:.8rem;white-space:nowrap">${fmtDate(f.createdAt)}</td>
                </tr>`).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:20px">Fikrlar yo\'q</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    main.innerHTML = `<div class="a-empty"><span>⚠️</span><p>${err.message}</p></div>`;
  }
}

function extract(settled) {
  if (settled.status !== 'fulfilled') return [];
  const v = settled.value;
  return Array.isArray(v) ? v : (v?.data || v?.users || v?.products || v?.categories || v?.feedbacks || []);
}

function statCard(icon, value, label, color, bg) {
  return `
    <div class="a-stat-card">
      <div class="a-stat-icon" style="background:${bg};color:${color}">${icon}</div>
      <div class="a-stat-info">
        <div class="a-stat-value" style="color:${color}">${value}</div>
        <div class="a-stat-label">${label}</div>
      </div>
    </div>`;
}

function feedbackBar(label, count, total, color) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return `
    <div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:.85rem">
        <span>${label}</span>
        <span style="font-weight:700;color:${color}">${count}</span>
      </div>
      <div style="height:6px;background:var(--surface2);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${color};border-radius:3px;transition:width .5s"></div>
      </div>
    </div>`;
}
