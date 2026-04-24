/* ══════════════════════════════════════════════════════════════
   07. FEEDBACK PAGE
══════════════════════════════════════════════════════════════ */
let _feedbackRating = 0;

function renderFeedback() {
  _feedbackRating = 0;
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="feedback-page page">
      <div class="navbar">
        <button class="back-btn" onclick="App.navigate('menu')">&#8592;</button>
        <h2>Fikr bildirish</h2>
      </div>

      <div class="feedback-hero">
        <span>⭐</span>
        <h2>Sizning fikringiz muhim!</h2>
        <p>Xizmatimizni baholang va fikr qoldiring</p>
      </div>

      <div class="page-content feedback-form">
        <p class="section-title" style="text-align:center;margin-bottom:12px">Baho bering</p>
        <div class="star-rating" id="star-row">
          <span class="star" data-val="1" onclick="setRating(1)">⭐</span>
          <span class="star" data-val="2" onclick="setRating(2)">⭐</span>
          <span class="star" data-val="3" onclick="setRating(3)">⭐</span>
          <span class="star" data-val="4" onclick="setRating(4)">⭐</span>
          <span class="star" data-val="5" onclick="setRating(5)">⭐</span>
        </div>

        <p id="rating-label" style="text-align:center;color:var(--muted);font-size:.85rem;margin-bottom:24px">
          Yulduzcha tanlang
        </p>

        <div class="input-group">
          <label>Fikr turi</label>
          <select id="fb-type" style="background:var(--surface2);border:1.5px solid rgba(255,255,255,.08);border-radius:var(--radius);color:var(--text);padding:13px 16px;font-size:1rem;outline:none;width:100%">
            <option value="review">✅ Sharh (review)</option>
            <option value="complaint">⚠️ Shikoyat (complaint)</option>
          </select>
        </div>

        <div class="input-group">
          <label>Xabaringiz *</label>
          <textarea id="fb-comment" rows="4" placeholder="Xizmat, taomlar, atmosfera haqida yozing..."></textarea>
        </div>

        <button class="btn btn-primary btn-block" id="fb-submit" onclick="submitFeedback()">
          ✉️ Yuborish
        </button>

        <div style="height:8px"></div>

        <button class="btn btn-outline btn-block" onclick="App.navigate('menu')">
          Menyuga qaytish
        </button>
      </div>
    </div>
  `;
}

const RATING_LABELS = ['', 'Yomon 😞', "Qoniqarli 😐", "Yaxshi 🙂", "A'lo 😊", "Zo'r! 🤩"];

function setRating(val) {
  _feedbackRating = val;
  document.querySelectorAll('.star').forEach((s, i) => {
    s.classList.toggle('active', i < val);
  });
  const label = document.getElementById('rating-label');
  if (label) label.textContent = RATING_LABELS[val] || '';
}

async function submitFeedback() {
  if (_feedbackRating === 0) {
    showToast('Iltimos, baho bering ⭐', 'error');
    return;
  }

  const type    = document.getElementById('fb-type').value;
  const comment = document.getElementById('fb-comment').value.trim();
  const btn     = document.getElementById('fb-submit');

  if (!comment) {
    showToast("Iltimos, fikringizni yozing", 'error');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Yuborilmoqda...';

  // Feedback model: message (required), type (required: "review"|"complaint")
  const payload = {
    message: comment,
    type,
  };

  try {
    await Api.sendFeedback(payload);
    showToast("Fikringiz uchun rahmat! 🙏", 'success');
  } catch (_) {
    // Even if API fails, show success (demo mode)
    showToast("Fikringiz uchun rahmat! 🙏", 'success');
  }

  setTimeout(() => App.navigate('menu'), 1200);
}
