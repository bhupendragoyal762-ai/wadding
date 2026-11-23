/* ==========================================================================
   main.js — PAGE 3 (मुख्य निमंत्रण) का व्यवहार
   सभी सामग्री script.js में मौजूद WEDDING ऑब्जेक्ट से आती है।
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* पहले से चल रहा संगीत जारी रखें, या पहले टच/क्लिक पर शुरू करें */
  document.body.addEventListener('click', () => SoundSystem.startMusic(), { once: true });

  /* ---------- हीरो संदेश व दोनों जोड़ों की जानकारी भरें ---------- */
  document.getElementById('heroMessage').textContent = WEDDING.message;

  const c1 = WEDDING.couple1;
  const c2 = WEDDING.couple2;
  document.getElementById('c1Label').textContent = c1.label;
  document.getElementById('c1Bride').textContent = c1.brideName;
  document.getElementById('c1BrideParents').textContent = c1.brideParents;
  document.getElementById('c1Groom').textContent = c1.groomName;
  document.getElementById('c1GroomParents').textContent = c1.groomParents;

  document.getElementById('c2Label').textContent = c2.label;
  document.getElementById('c2Bride').textContent = c2.brideName;
  document.getElementById('c2BrideParents').textContent = c2.brideParents;
  document.getElementById('c2Groom').textContent = c2.groomName;
  document.getElementById('c2GroomParents').textContent = c2.groomParents;

  /* ---------- विवाह स्थल ---------- */
  document.getElementById('venueName').textContent = WEDDING.venueName;
  document.getElementById('venueAddress').textContent = WEDDING.venueAddress;
  document.getElementById('mapsLink').href = WEDDING.googleMapsURL;

  /* ---------- व्हाट्सऐप ---------- */
  const waMsg = encodeURIComponent('नमस्ते! मैं आपके विवाह निमंत्रण के संबंध में संपर्क कर रहा/रही हूँ।');
  document.getElementById('whatsappLink').href = `https://wa.me/${WEDDING.whatsappNumber}?text=${waMsg}`;

  /* ---------- कार्यक्रम सूची ---------- */
  const eventsList = document.getElementById('eventsList');
  WEDDING.events.forEach((ev) => {
    const card = document.createElement('div');
    card.className = 'event-card reveal';
    card.innerHTML = `
      <p class="event-name">${ev.name}</p>
      <p class="event-detail"><b>दिनांक</b> ${ev.date}</p>
      <p class="event-detail"><b>समय</b> ${ev.time}</p>
      <p class="event-detail"><b>स्थान</b> ${ev.venue}</p>
    `;
    eventsList.appendChild(card);
  });

  /* ---------- उलटी गिनती ---------- */
  document.getElementById('countdownDate').textContent =
    `${WEDDING.weddingDateDisplay} · ${WEDDING.weddingTimeDisplay}`;
  document.getElementById('countdownTime').textContent =
    `हम मिलकर इस शुभ दिन का इंतज़ार कर रहे हैं`;

  const target = new Date(WEDDING.weddingDate).getTime();
  const elDays = document.getElementById('cdDays');
  const elHours = document.getElementById('cdHours');
  const elMins = document.getElementById('cdMins');
  const elSecs = document.getElementById('cdSecs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tickCountdown() {
    const now = Date.now();
    let diff = target - now;
    if (isNaN(target)) return;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMins.textContent = pad(mins);
    elSecs.textContent = pad(secs);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------- गैलरी ---------- */
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryImages = WEDDING.gallery;

  galleryImages.forEach((item, index) => {
    const cell = document.createElement('div');
    cell.className = 'gallery-item reveal';
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('role', 'button');
    cell.setAttribute('aria-label', item.caption);

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption;
    img.loading = 'lazy';
    img.addEventListener('error', () => {
      img.remove();
      const fb = document.createElement('div');
      fb.className = 'gallery-fallback';
      fb.textContent = 'फोटो जोड़ें: ' + item.src.split('/').pop();
      cell.appendChild(fb);
    });
    cell.appendChild(img);

    cell.addEventListener('click', () => openLightbox(index));
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(index); }
    });

    galleryGrid.appendChild(cell);
  });

  /* ---------- लाइटबॉक्स ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  let lightboxIndex = 0;

  function openLightbox(index) {
    lightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('visible');
    lightbox.setAttribute('aria-hidden', 'false');
    SoundSystem.click();
  }
  function updateLightbox() {
    const item = galleryImages[lightboxIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = item.caption;
  }
  function closeLightbox() {
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  });
  document.getElementById('lightboxNext').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % galleryImages.length;
    updateLightbox();
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('visible')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
  });

  /* ---------- RSVP फ़ॉर्म ---------- */
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rsvpName').value.trim();
    const guests = document.getElementById('rsvpGuests').value;
    const attending = document.getElementById('rsvpAttending').value;
    const message = document.getElementById('rsvpMessage').value.trim();

    if (!name) return;

    // फिलहाल स्थानीय रूप से सहेजें (कोई बैकएंड नहीं)
    try {
      const responses = JSON.parse(localStorage.getItem('wedding_rsvp_responses') || '[]');
      responses.push({ name, guests, attending, message, at: new Date().toISOString() });
      localStorage.setItem('wedding_rsvp_responses', JSON.stringify(responses));
    } catch (err) { /* स्टोरेज उपलब्ध नहीं */ }

    document.getElementById('rsvpSuccessName').textContent = name;
    rsvpForm.style.display = 'none';
    rsvpSuccess.classList.add('visible');
    SoundSystem.click();
  });

  /* ---------- संगीत टॉगल बटन ---------- */
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  musicToggle.addEventListener('click', () => {
    const playing = SoundSystem.toggleMusic();
    musicIcon.textContent = playing ? '♪' : '♪̶';
    musicToggle.classList.toggle('muted', !playing);
  });

  /* ---------- स्क्रॉल-रिवील एनिमेशन ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }
});
