/* ══════════════════════════════════════════════════════════════
   FEEDBACKS — GET (admin only)
   GET /feedback (protect + admin)
══════════════════════════════════════════════════════════════ */
let _feedbacks = [];

async function renderFeedbacks() {
  AdminApp.setPageTitle('Fikrlar');
  const main = document.getElementById('a-page-content');
  main.innerHTML = `<div class="a-loader"><div class="a-spinner"></div></div>`;

  try {
    const res = await AApi.getFeedbacks();
    _feedbacks = Array.isArray(res) ? res : (res.data || res.feedbacks || []);
    paintFeedbacksPage();
  } catch (err) {
    main.innerHTML = `<div class="a-empty"><span>⚠️</span><p>${err.message}</p></div>`;
  }
}

function paintFeedbacksPage() {
  const main = document.getElementById('a-page-content');
  const reviews    = _feedbacks.filter(f => f.type === 'review');
  const complaints = _feedbacks.filter(f => f.type === 'complaint');

  main.innerHTML = `
    <div class="a-page-header">
      <div>
        <h2>💬 Foydalanuvchi fikrlari</h2>
        <p>${_feedbacks.length} ta fikr · ✅ ${reviews.length} sharh · ⚠️ ${complaints.length} shikoyat</p>
      </div>
      <div style="display:flex;gap:8px">
        <button class="a-btn a-btn-outline a-btn-sm" onclick="filterFbByType('')">Barchasi</button>
        <button class="a-btn a-btn-success  a-btn-sm" onclick="filterFbByType('review')">✅ Sharhlar</button>
        <button class="a-btn a-btn-danger   a-btn-sm" onclick="filterFbByType('complaint')">⚠️ Shikoyatlar</button>
      </div>
    </div>

    <div class="a-toolbar">
      <div class="a-search">
        <span>🔍</span>
        <input placeholder="Xabar bo'yicha qidirish..." oninput="filterFbByText(this.value)" />
      </div>
    </div>

    <div class="a-card">
      <div class="a-table-wrap">
        <table class="a-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Xabar</th>
              <th>Tur</th>
              <th>Rasm</th>
              <th>Qurilma</th>
              <th>Sana</th>
            </tr>
          </thead>
          <tbody id="fb-tbody">${renderFbRows(_feedbacks)}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderFbRows(list) {
  if (list.length === 0)
    return `<tr><td colspan="6"><div class="a-empty"><span>💬</span><p>Fikrlar topilmadi</p></div></td></tr>`;

  return list.map((f, i) => `
    <tr>
      <td style="color:var(--muted);font-size:.8rem">${i + 1}</td>
      <td style="max-width:260px">
        <div style="font-size:.875rem;line-height:1.5">${f.message || '—'}</div>
      </td>
      <td>
        <span class="badge ${f.type === 'review' ? 'badge-green' : 'badge-red'}">
          ${f.type === 'review' ? '✅' : '⚠️'} ${f.type}
        </span>
      </td>
      <td>
        ${f.image
          ? `<a href="http://localhost:3000/uploads/${f.image}" target="_blank">
               <img src="http://localhost:3000/uploads/${f.image}" style="width:40px;height:40px;border-radius:6px;object-fit:cover" onerror="this.style.display='none'" />
             </a>`
          : '<span style="color:var(--muted);font-size:.8rem">—</span>'}
      </td>
      <td style="color:var(--muted);font-size:.72rem;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
        ${f.device_info || '—'}
      </td>
      <td style="color:var(--muted);font-size:.82rem;white-space:nowrap">${fmtDate(f.createdAt)}</td>
    </tr>
  `).join('');
}

let _fbType = '';
let _fbText = '';

function filterFbByType(type) {
  _fbType = type;
  applyFbFilter();
}

function filterFbByText(text) {
  _fbText = text.toLowerCase();
  applyFbFilter();
}

function applyFbFilter() {
  const filtered = _feedbacks.filter(f => {
    const matchType = !_fbType || f.type === _fbType;
    const matchText = !_fbText || (f.message || '').toLowerCase().includes(_fbText);
    return matchType && matchText;
  });
  document.getElementById('fb-tbody').innerHTML = renderFbRows(filtered);
}
