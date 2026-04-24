/* ══════════════════════════════════════════════════════════════
   02. WELCOME SCREEN
══════════════════════════════════════════════════════════════ */
function renderWelcome() {
  const app      = document.getElementById('app');
  const loggedIn = Api.isLoggedIn();
  const user     = JSON.parse(localStorage.getItem('fq_user') || 'null');

  app.innerHTML = `
    <div class="welcome-page page">
      <div class="welcome-hero">
        <div class="welcome-emoji">🍽️</div>
        <h1 class="welcome-title">Xush kelibsiz,<br><span>FoodQR</span>ga!</h1>
        ${loggedIn && user ? `<p style="color:var(--accent);font-size:.9rem;margin-top:8px">👤 ${user.name || user.email}</p>` : ''}
        <p class="welcome-subtitle">
          Sevimli restoraningiz menyusini QR kod orqali ko'ring va buyurtma bering
        </p>
      </div>

      <div class="welcome-actions">
        <button class="btn btn-primary btn-block" onclick="App.navigate('menu')">
          🔍 Menyuni ko'rish
        </button>

        ${loggedIn ? `
          <div class="welcome-divider">hisob</div>
          <button class="btn btn-outline btn-block" onclick="logoutUser()">
            🚪 Chiqish (Logout)
          </button>
        ` : `
          <div class="welcome-divider">yoki</div>
          <button class="btn btn-outline btn-block" onclick="App.navigate('auth', { tab: 'login' })">
            Kirish (Login)
          </button>
          <button class="btn btn-ghost btn-block" onclick="App.navigate('auth', { tab: 'register' })">
            Ro'yxatdan o'tish
          </button>
        `}
      </div>
    </div>
  `;
}

function logoutUser() {
  Api.clearTokens();
  localStorage.removeItem('fq_user');
  sessionStorage.removeItem('fq_page');
  showToast('Chiqildi', '');
  App.navigate('welcome');
}
