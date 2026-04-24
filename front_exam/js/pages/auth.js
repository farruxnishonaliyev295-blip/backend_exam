/* ══════════════════════════════════════════════════════════════
   03. LOGIN / REGISTER
══════════════════════════════════════════════════════════════ */
function renderAuth(params = {}) {
  const activeTab = params.tab || 'login';
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="auth-page page">
      <div class="navbar">
        <button class="back-btn" onclick="App.navigate('welcome')">&#8592;</button>
        <h2>Kirish / Ro'yxat</h2>
      </div>

      <div class="auth-header">
        <h1>Salom! 👋</h1>
        <p>Hisobingizga kiring yoki yangi hisob yarating</p>
      </div>

      <div class="page-content">
        <div class="auth-tabs">
          <div class="auth-tab ${activeTab === 'login' ? 'active' : ''}"
               id="tab-login" onclick="switchTab('login')">Kirish</div>
          <div class="auth-tab ${activeTab === 'register' ? 'active' : ''}"
               id="tab-register" onclick="switchTab('register')">Ro'yxat</div>
        </div>

        <!-- LOGIN FORM -->
        <form class="auth-form ${activeTab === 'login' ? 'active' : ''}"
              id="form-login" onsubmit="submitLogin(event)">
          <div class="input-group">
            <label>Email</label>
            <input type="email" id="login-email" placeholder="example@email.com" required autocomplete="email" />
          </div>
          <div class="input-group">
            <label>Parol</label>
            <input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password" />
          </div>
          <button type="submit" class="btn btn-primary btn-block" id="login-btn">
            Kirish
          </button>
          <div class="auth-footer-link">
            Hisob yo'qmi? <a onclick="switchTab('register')">Ro'yxatdan o'ting</a>
          </div>
        </form>

        <!-- REGISTER FORM -->
        <form class="auth-form ${activeTab === 'register' ? 'active' : ''}"
              id="form-register" onsubmit="submitRegister(event)">
          <div class="input-group">
            <label>Ism</label>
            <input type="text" id="reg-name" placeholder="Ismingiz" required autocomplete="name" />
          </div>
          <div class="input-group">
            <label>Email</label>
            <input type="email" id="reg-email" placeholder="example@email.com" required autocomplete="email" />
          </div>
          <div class="input-group">
            <label>Parol</label>
            <input type="password" id="reg-password" placeholder="Kamida 6 ta belgi" required minlength="6" autocomplete="new-password" />
          </div>
          <button type="submit" class="btn btn-primary btn-block" id="register-btn">
            Ro'yxatdan o'tish
          </button>
          <div class="auth-footer-link">
            Hisob bormi? <a onclick="switchTab('login')">Kiring</a>
          </div>
        </form>
      </div>
    </div>
  `;
}

function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(el => el.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  document.getElementById(`form-${tab}`).classList.add('active');
}

async function submitLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const btn      = document.getElementById('login-btn');

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>';

  try {
    const res = await Api.login(email, password);
    Api.setTokens(res.accessToken || res.data?.accessToken, res.refreshToken || res.data?.refreshToken);
    localStorage.setItem('fq_user', JSON.stringify(res.user || res.data?.user || { email }));
    showToast('Muvaffaqiyatli kirdingiz! 🎉', 'success');
    setTimeout(() => App.navigate('menu'), 800);
  } catch (err) {
    showToast(err.message || 'Login xatosi', 'error');
    btn.disabled = false;
    btn.textContent = 'Kirish';
  }
}

async function submitRegister(e) {
  e.preventDefault();
  const name     = document.getElementById('reg-name').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const btn      = document.getElementById('register-btn');

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>';

  try {
    await Api.register(name, email, password);
    showToast("Ro'yxat muvaffaqiyatli! Kiring ✅", 'success');
    setTimeout(() => switchTab('login'), 800);
  } catch (err) {
    showToast(err.message || "Ro'yxat xatosi", 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = "Ro'yxatdan o'tish";
  }
}
