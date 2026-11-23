/* ==========================================================================
   intro.js — PAGE 2 का व्यवहार: स्कूटर एनिमेशन + दीपक ड्रैग इंटरैक्शन
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* अगर उपयोगकर्ता सीधे इस पेज पर आया है (लिफाफे को छोड़कर),
     तब भी संगीत शुरू करने का प्रयास करें — पहला क्लिक/टच होने पर */
  document.body.addEventListener('click', () => SoundSystem.startMusic(), { once: true });

  /* ---------- सुनहरी पंखुड़ियाँ ---------- */
  const petalHolder = document.getElementById('petals');
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('span');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.animationDuration = (7 + Math.random() * 6) + 's';
    petalHolder.appendChild(p);
  }
  const goldHolder = document.getElementById('goldParticles');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDelay = (Math.random() * 6) + 's';
    p.style.animationDuration = (5 + Math.random() * 5) + 's';
    p.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
    goldHolder.appendChild(p);
  }

  /* ---------- स्कूटर आगमन क्रम ---------- */
  const scooterRig = document.getElementById('scooterRig');
  const sceneMessage = document.getElementById('sceneMessage');
  const continueBtn = document.getElementById('continueBtn');

  setTimeout(() => {
    scooterRig.classList.add('arrived');
  }, 700);

  // स्कूटर के रुकने के बाद संदेश दिखाएँ (transition अवधि ~2.6s + शुरूआती देरी)
  setTimeout(() => {
    sceneMessage.classList.add('visible');
  }, 3500);

  setTimeout(() => {
    continueBtn.classList.add('visible');
  }, 4300);

  /* ---------- दीपक मोडल खोलना ---------- */
  const lampModal = document.getElementById('lampModal');
  const fadeOverlay = document.getElementById('fadeOverlay');

  continueBtn.addEventListener('click', () => {
    lampModal.classList.add('visible');
    lampModal.setAttribute('aria-hidden', 'false');
  });

  /* ---------- दीपक ड्रैग इंटरैक्शन (माउस + टच) ---------- */
  const ropeWrap = document.getElementById('lampRopeWrap');
  const diya = document.getElementById('lampDiya');
  const rope = document.getElementById('lampRope');
  const glow = document.getElementById('lampGlow');
  const progressFill = document.getElementById('lampProgressFill');

  const DIYA_MIN_TOP = 30;   // प्रारंभिक स्थिति (px, .lamp-rope-wrap के अंदर)
  const DIYA_MAX_TOP = 120;  // पूर्ण खिंचाव पर स्थिति
  const REQUIRED_RATIO = 0.92; // इतना खींचने पर सफलता मानी जाएगी

  let dragging = false;
  let startY = 0;
  let currentTop = DIYA_MIN_TOP;
  let completed = false;

  function setDiyaPosition(top) {
    currentTop = Math.max(DIYA_MIN_TOP, Math.min(DIYA_MAX_TOP, top));
    diya.style.top = currentTop + 'px';

    const ratio = (currentTop - DIYA_MIN_TOP) / (DIYA_MAX_TOP - DIYA_MIN_TOP);
    progressFill.style.width = (ratio * 100) + '%';

    const glowSize = 40 + ratio * 60;
    glow.style.width = glowSize + 'px';
    glow.style.height = glowSize + 'px';
    glow.style.opacity = 0.25 + ratio * 0.75;
    glow.style.top = (currentTop + 22) + 'px';

    // रस्सी को दीये की लंबाई तक खींचें
    rope.setAttribute('viewBox', `0 0 20 ${Math.max(currentTop, 20)}`);

    return ratio;
  }

  function pointerDown(e) {
    if (completed) return;
    dragging = true;
    startY = (e.touches ? e.touches[0].clientY : e.clientY) - currentTop;
    ropeWrap.style.cursor = 'grabbing';
  }

  function pointerMove(e) {
    if (!dragging || completed) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const top = clientY - startY;
    const ratio = setDiyaPosition(top);

    if (ratio >= REQUIRED_RATIO) {
      completeLamp();
    }
  }

  function pointerUp() {
    if (!dragging || completed) return;
    dragging = false;
    // यदि पर्याप्त नहीं खींचा गया, दीया वापस ऊपर लौट आए
    springBack();
  }

  function springBack() {
    const start = currentTop;
    const startTime = performance.now();
    const duration = 320;
    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDiyaPosition(start - (start - DIYA_MIN_TOP) * eased);
      if (t < 1 && !dragging) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function completeLamp() {
    if (completed) return;
    completed = true;
    dragging = false;
    setDiyaPosition(DIYA_MAX_TOP);

    SoundSystem.lamp();
    lampModal.classList.add('success');

    setTimeout(() => {
      fadeOverlay.classList.add('active');
    }, 500);

    setTimeout(() => {
      window.location.href = 'main.html';
    }, 1250);
  }

  ropeWrap.addEventListener('mousedown', pointerDown);
  window.addEventListener('mousemove', pointerMove);
  window.addEventListener('mouseup', pointerUp);

  ropeWrap.addEventListener('touchstart', pointerDown, { passive: true });
  window.addEventListener('touchmove', pointerMove, { passive: true });
  window.addEventListener('touchend', pointerUp);

  // प्रारंभिक स्थिति सेट करें
  setDiyaPosition(DIYA_MIN_TOP);
});
