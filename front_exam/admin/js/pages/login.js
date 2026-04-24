/* ══════════════════════════════════════════════════════════════
   ADMIN LOGIN PAGE
══════════════════════════════════════════════════════════════ */
function renderAdminLogin() {
  document.getElementById('admin-app').innerHTML = `
    <div class="a-login-wrap">
      <div class="a-login-box">
        <div class="a-login-logo">
          <span>🍽️</span>
          <h1>Food<em>QR</em> Admin</h1>
          <p>Admin paneliga kirish</p>
        </div>

        <form onsubmit="doAdminLogin(event)">
          <div class="a-form-group">
            <label>Email</label>
            <input class="a-input" type="email" id="al-email"
              placeholder="admin@foodqr.uz" required autocomplete="email" />
          </div>
          <div class="a-form-group">
            <label>Parol</label>
            <input class="a-input" type="password" id="al-pass"
              placeholder="••••••••" required autocomplete="current-password" />
          </div>
          <button type="submit" class="a-btn a-btn-primary a-btn-block" id="al-btn" style="margin-top:8px;padding:12px">
            Kirish
          </button>
        </form>

        <p style="text-align:center;margin-top:20px;font-size:.8rem;color:var(--muted)">
          <a href="index.html" style="color:var(--accent)">← Asosiy saytga qaytish</a>
        </p>
      </div>
    </div>
  `;
}

async function doAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('al-email').value.trim();
  const pass  = document.getElementById('al-pass').value;
  const btn   = document.getElementById('al-btn');

  btn.disabled = true;
  btn.innerHTML = '<span class="a-spinner"></span> Kirish...';

  try {
    const res = await AApi.login(email, pass);

    const user = res.user || res.data?.user;
    if (user?.role !== 'admin') {
      aToast("Siz admin emassiz!", 'error');
      btn.disabled = false;
      btn.textContent = 'Kirish';
      return;
    }

    AApi.setToken(res.accessToken || res.data?.accessToken);
    AApi.setRefresh(res.refreshToken || res.data?.refreshToken);
    AApi.setUser(user);

    aToast('Xush kelibsiz, ' + (user.name || 'Admin') + '!', 'success');
    setTimeout(() => AdminApp.navigate('dashboard'), 600);
  } catch (err) {
    aToast(err.message || 'Login xatosi', 'error');
    btn.disabled = false;
    btn.textContent = 'Kirish';
  }
}
