/* ══════════════════════════════════════════════════════════════
   APP ROUTER
══════════════════════════════════════════════════════════════ */
const PAGES = {
  splash:   renderSplash,
  welcome:  renderWelcome,
  auth:     renderAuth,
  menu:     renderMenu,
  detail:   renderDetail,
  cart:     renderCart,
  feedback: renderFeedback,
};

const App = {
  current: null,
  params:  null,

  navigate(page, params = {}) {
    if (!PAGES[page]) { console.warn('Unknown page:', page); return; }
    this.current = page;
    this.params  = params;
    // Sahifani sessionStorage ga saqlash (splash/welcome/auth dan tashqari)
    if (!['splash', 'welcome', 'auth'].includes(page)) {
      sessionStorage.setItem('fq_page', page);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    PAGES[page](params);
  },
};

/* ─── Boot ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const savedPage = sessionStorage.getItem('fq_page');

  // Agar token bor va oldingi sahifa saqlangan bo'lsa — to'g'ridan splash'siz o'tish
  if (Api.isLoggedIn() && savedPage && PAGES[savedPage]) {
    App.navigate(savedPage);
  } else {
    App.navigate('splash');
  }
});
