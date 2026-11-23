/* ==========================================================================
   script.js — साझा विन्यास (Shared Configuration) + ध्वनि प्रणाली (Audio System)
   यह फ़ाइल हर पेज (index.html, intro.html, main.html) में लोड होती है।
   अपनी शादी की जानकारी भरने के लिए नीचे दिया गया WEDDING ऑब्जेक्ट बदलें।
   ========================================================================== */

const WEDDING = {

  couple1: {
    label: "प्रथम विवाह",
    brideName: "दुल्हन का नाम",
    groomName: "दूल्हे का नाम",
    brideParents: "श्री ____ व श्रीमती ____ की सुपुत्री",
    groomParents: "श्री ____ व श्रीमती ____ के सुपुत्र"
  },

  couple2: {
    label: "द्वितीय विवाह",
    brideName: "दूसरी दुल्हन का नाम",
    groomName: "दूसरे दूल्हे का नाम",
    brideParents: "श्री ____ व श्रीमती ____ की सुपुत्री",
    groomParents: "श्री ____ व श्रीमती ____ के सुपुत्र"
  },

  weddingDate: "2027-02-14T19:00:00",
  weddingDateDisplay: "14 फरवरी 2027",
  weddingTimeDisplay: "शाम 7:00 बजे",

  venueName: "विवाह स्थल का नाम",
  venueAddress: "पूरा पता यहाँ लिखें, शहर, राज्य",
  googleMapsURL: "https://maps.google.com",

  whatsappNumber: "919999999999",

  message: "आप सपरिवार सादर आमंत्रित हैं। आपकी उपस्थिति हमारे लिए सौभाग्य की बात होगी।",

  events: [
    {
      name: "हल्दी समारोह",
      date: "12 फरवरी 2027",
      time: "सुबह 10:00 बजे",
      venue: "पारिवारिक निवास स्थान"
    },
    {
      name: "मेहंदी समारोह",
      date: "12 फरवरी 2027",
      time: "शाम 5:00 बजे",
      venue: "पारिवारिक निवास स्थान"
    },
    {
      name: "संगीत समारोह",
      date: "13 फरवरी 2027",
      time: "शाम 7:00 बजे",
      venue: "बैंक्वेट हॉल"
    },
    {
      name: "विवाह समारोह",
      date: "14 फरवरी 2027",
      time: "शाम 7:00 बजे",
      venue: "विवाह स्थल का नाम"
    },
    {
      name: "स्वागत समारोह",
      date: "15 फरवरी 2027",
      time: "रात्रि 8:00 बजे",
      venue: "बैंक्वेट हॉल"
    }
  ],

  gallery: [
    { src: "assets/gallery/photo1.jpg", caption: "हमारी सुंदर स्मृति" },
    { src: "assets/gallery/photo2.jpg", caption: "एक खूबसूरत पल" },
    { src: "assets/gallery/photo3.jpg", caption: "साथ का सफ़र" },
    { src: "assets/gallery/photo4.jpg", caption: "अपनों का साथ" },
    { src: "assets/gallery/photo5.jpg", caption: "प्रेम की कहानी" },
    { src: "assets/gallery/photo6.jpg", caption: "नई शुरुआत" }
  ],

  audio: {
    music: "assets/music/wedding-music.mp3",
    click: "assets/sounds/click.mp3",
    envelope: "assets/sounds/envelope.mp3",
    lamp: "assets/sounds/lamp.mp3",
    typing: "assets/sounds/type.mp3",

    musicVolume: 0.8,
    clickVolume: 0.4,
    effectVolume: 0.5
  }
};

/* ==========================================================================
   ध्वनि प्रणाली (Global Sound System)
   सभी पेज इस ऑब्जेक्ट का उपयोग करके ध्वनियाँ चलाते हैं।
   फाइल न मिलने पर भी वेबसाइट सामान्य रूप से काम करती रहती है (कोई error नहीं रुकता)।
   ========================================================================== */

const SoundSystem = (function () {
  const cache = {};
  let bgMusic = null;
  let musicStarted = false;

  function getAudio(src, volume) {
    if (!cache[src]) {
      const a = new Audio(src);
      a.volume = volume;
      cache[src] = a;
    }
    return cache[src];
  }

  function safePlay(src, volume) {
    try {
      const base = getAudio(src, volume);
      // clone so overlapping clicks can still play
      const node = base.cloneNode();
      node.volume = volume;
      const p = node.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) {
      /* सुनने योग्य फाइल उपलब्ध नहीं — बिना रुके आगे बढ़ें */
    }
  }

  return {
    click() {
      safePlay(WEDDING.audio.click, WEDDING.audio.clickVolume);
    },
    envelope() {
      safePlay(WEDDING.audio.envelope, WEDDING.audio.effectVolume);
    },
    lamp() {
      safePlay(WEDDING.audio.lamp, WEDDING.audio.effectVolume);
    },
    typing() {
      safePlay(WEDDING.audio.typing, WEDDING.audio.effectVolume * 0.6);
    },
    startMusic() {
      if (musicStarted) return;
      try {
        bgMusic = new Audio(WEDDING.audio.music);
        bgMusic.loop = true;
        bgMusic.volume = WEDDING.audio.musicVolume;
        const p = bgMusic.play();
        if (p && p.catch) p.catch(() => {});
        musicStarted = true;
        window.__weddingMusic = bgMusic;
      } catch (e) {
        /* संगीत फाइल उपलब्ध नहीं */
      }
    },
    setMusicVolume(v) {
      WEDDING.audio.musicVolume = v;
      if (bgMusic) bgMusic.volume = v;
    },
    toggleMusic() {
      if (!bgMusic) {
        this.startMusic();
        return true;
      }
      if (bgMusic.paused) {
        bgMusic.play().catch(() => {});
        return true;
      } else {
        bgMusic.pause();
        return false;
      }
    },
    isMusicPlaying() {
      return !!(bgMusic && !bgMusic.paused);
    }
  };
})();

/* बटन/लिंक क्लिक पर हल्की क्लिक ध्वनि जोड़ें */
function bindClickSounds() {
  document.querySelectorAll("[data-click-sound]").forEach((el) => {
    el.addEventListener("click", () => SoundSystem.click());
  });
}

document.addEventListener("DOMContentLoaded", bindClickSounds);
