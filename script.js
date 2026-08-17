/* =========================================================
   MIS 15 — ZAIRA
   Toda la información editable vive en un único lugar: CONFIG.
   ========================================================= */

const CONFIG = {
  nombre: "Zaira",

  // Fecha y hora del evento. Usar formato ISO en "fechaISO" (para el
  // conteo regresivo) y el texto que se muestra en pantalla en "fecha"/"hora".
  fechaISO: "2026-12-12T20:00:00", // [FECHA_ISO] — usada por la cuenta regresiva
  fecha: "[FECHA]",                 // ej: "Sábado 12 de Diciembre de 2026"
  hora: "[HORA]",                   // ej: "20:00 hs"

  lugar: "[LUGAR]",
  direccion: "[DIRECCIÓN]",
  maps: "[LINK_DE_GOOGLE_MAPS]",     // ej: "https://maps.app.goo.gl/xxxxx"

  whatsapp: "[WHATSAPP]",            // ej: "5491122334455" (código país + número, sin + ni espacios)
  mensajeWhatsapp: "Hola Zaira! Confirmo mi asistencia a tus 15 años \uD83D\uDC95",

  instagram: "[INSTAGRAM]",          // ej: "https://instagram.com/zaira" o "@zaira" — dejar "" para ocultar

  dressCode: "[DRESS CODE]"          // ej: "Elegante Sport"
};

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initReveal();
  initCountdown();
  initHeroOpen();
  initMusic();
  initGallery();
  initLightbox();
});

/* ---------------------------------------------------------
   Aplica la configuración a todos los textos y enlaces
   --------------------------------------------------------- */
function applyConfig(){
  setText("detail-fecha", CONFIG.fecha);
  setText("detail-hora", CONFIG.hora);
  setText("detail-lugar", CONFIG.lugar);
  setText("detail-direccion", CONFIG.direccion);
  setText("detail-dresscode", CONFIG.dressCode);

  // Google Maps
  const mapsLink = document.getElementById("maps-link");
  if (mapsLink){
    if (isPlaceholder(CONFIG.maps)){
      mapsLink.setAttribute("aria-disabled", "true");
      mapsLink.href = "#detalles";
      mapsLink.addEventListener("click", (e) => e.preventDefault());
    } else {
      mapsLink.href = CONFIG.maps;
    }
  }

  // WhatsApp (RSVP) — dos botones apuntan al mismo enlace
  const waHref = buildWhatsappLink(CONFIG.whatsapp, CONFIG.mensajeWhatsapp);
  ["rsvp-link", "rsvp-link-2"].forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (waHref){
      el.href = waHref;
    } else {
      el.href = "#rsvp";
      el.addEventListener("click", (e) => e.preventDefault());
    }
  });

  // Instagram (opcional)
  const igSection = document.getElementById("instagram-section");
  const igLink = document.getElementById("instagram-link");
  if (CONFIG.instagram && !isPlaceholder(CONFIG.instagram)){
    const href = normalizeInstagram(CONFIG.instagram);
    igLink.href = href;
    igSection.hidden = false;
  }

  // Título dinámico con el nombre (por si se reutiliza el proyecto)
  if (CONFIG.nombre && CONFIG.nombre !== "Zaira"){
    document.title = `Mis 15 — ${CONFIG.nombre}`;
  }
}

function setText(id, value){
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function isPlaceholder(value){
  return !value || /^\[.*\]$/.test(value.trim());
}

function buildWhatsappLink(number, message){
  if (isPlaceholder(number)) return null;
  const digits = number.replace(/[^\d]/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function normalizeInstagram(value){
  const v = value.trim();
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@/, "");
  return `https://instagram.com/${handle}`;
}

/* ---------------------------------------------------------
   Animaciones de aparición al hacer scroll
   --------------------------------------------------------- */
function initReveal(){
  const items = document.querySelectorAll("[data-reveal]");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced){
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  if (!("IntersectionObserver" in window)){
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  items.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   Cuenta regresiva
   --------------------------------------------------------- */
function initCountdown(){
  const target = new Date(CONFIG.fechaISO).getTime();
  const timerEl = document.getElementById("countdown-timer");
  const todayEl = document.getElementById("countdown-today");

  if (isNaN(target)){
    // Fecha aún no configurada correctamente: ocultar el contador con gracia.
    if (timerEl) timerEl.hidden = true;
    if (todayEl){
      todayEl.hidden = false;
      todayEl.textContent = "¡Muy pronto vas a saber la fecha!";
    }
    return;
  }

  const dEl = document.getElementById("cd-days");
  const hEl = document.getElementById("cd-hours");
  const mEl = document.getElementById("cd-minutes");
  const sEl = document.getElementById("cd-seconds");

  function tick(){
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0){
      if (timerEl) timerEl.hidden = true;
      if (todayEl) todayEl.hidden = false;
      clearInterval(intervalId);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (dEl) dEl.textContent = String(days).padStart(2, "0");
    if (hEl) hEl.textContent = String(hours).padStart(2, "0");
    if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
    if (sEl) sEl.textContent = String(seconds).padStart(2, "0");
  }

  tick();
  const intervalId = setInterval(tick, 1000);
}

/* ---------------------------------------------------------
   Botón "Abrir invitación": transición + intento de música
   --------------------------------------------------------- */
function initHeroOpen(){
  const openBtn = document.getElementById("open-invite");
  const hero = document.getElementById("hero");
  if (!openBtn) return;

  openBtn.addEventListener("click", () => {
    // Intentar reproducir música tras la interacción del usuario.
    const audio = document.getElementById("bg-music");
    const musicBtn = document.getElementById("music-toggle");
    if (audio && audio.querySelector("source").getAttribute("src")){
      audio.play()
        .then(() => {
          if (musicBtn) musicBtn.setAttribute("aria-pressed", "true");
        })
        .catch(() => {
          // Reproducción bloqueada por el navegador: no rompe la página,
          // el usuario puede iniciarla manualmente con el botón de música.
        });
    }

    const target = document.getElementById("countdown") || document.getElementById("main-content");
    if (target){
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

/* ---------------------------------------------------------
   Reproductor de música (opcional y tolerante a fallos)
   --------------------------------------------------------- */
function initMusic(){
  const audio = document.getElementById("bg-music");
  const btn = document.getElementById("music-toggle");
  if (!audio || !btn) return;

  const source = audio.querySelector("source");
  const src = source ? source.getAttribute("src") : null;

  if (!src){
    btn.hidden = true;
    return;
  }

  // Verificar si el archivo de música existe realmente antes de mostrar el botón,
  // para que nunca quede un control roto en pantalla.
  fetch(src, { method: "HEAD" })
    .then((res) => {
      if (res.ok) btn.hidden = false;
    })
    .catch(() => {
      // Sin música disponible: el botón permanece oculto y la página sigue intacta.
    });

  btn.addEventListener("click", () => {
    if (audio.paused){
      audio.play()
        .then(() => btn.setAttribute("aria-pressed", "true"))
        .catch(() => {});
    } else {
      audio.pause();
      btn.setAttribute("aria-pressed", "false");
    }
  });

  audio.addEventListener("error", () => { btn.hidden = true; });
}

/* ---------------------------------------------------------
   Galería + Lightbox
   --------------------------------------------------------- */
let galleryImages = [];
let currentImageIndex = 0;

function initGallery(){
  const items = document.querySelectorAll(".gallery__item");
  galleryImages = Array.from(items).map((item) => {
    const img = item.querySelector("img");
    return { src: img.getAttribute("src"), alt: img.getAttribute("alt") };
  });

  items.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });
}

function initLightbox(){
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (!lightbox) return;

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => navigateLightbox(-1));
  nextBtn.addEventListener("click", () => navigateLightbox(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });

  // Deslizar para navegar en móvil
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 40){
      navigateLightbox(delta > 0 ? -1 : 1);
    }
  }, { passive: true });
}

function openLightbox(index){
  currentImageIndex = index;
  renderLightboxImage();
  const lightbox = document.getElementById("lightbox");
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox(){
  const lightbox = document.getElementById("lightbox");
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

function navigateLightbox(direction){
  if (!galleryImages.length) return;
  currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
  renderLightboxImage();
}

function renderLightboxImage(){
  const img = document.getElementById("lightbox-img");
  const data = galleryImages[currentImageIndex];
  if (!img || !data) return;
  img.src = data.src;
  img.alt = data.alt || "";
}
