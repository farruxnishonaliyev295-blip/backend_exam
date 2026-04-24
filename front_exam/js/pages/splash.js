/* ══════════════════════════════════════════════════════════════
   01. SPLASH SCREEN
══════════════════════════════════════════════════════════════ */
function renderSplash() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="splash-page">
      <div class="splash-logo">🍽️</div>
      <h1 class="splash-brand">Food<span>QR</span></h1>
      <p class="splash-tagline">Restoran menyusini QR orqali ko'ring</p>
      <div class="splash-loader">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

  // Token bo'lsa — menyuga, bo'lmasa — welcome ga
  setTimeout(() => {
    App.navigate(Api.isLoggedIn() ? 'menu' : 'welcome');
  }, 2800);
}
