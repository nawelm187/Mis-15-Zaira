/* =========================================================
   MIS 15 — ZAIRA
   Toda la información editable vive en un único lugar: CONFIG.
   ========================================================= */

const CONFIG = {
  nombre: "Zaira",

  // Fecha y hora del evento. Usar formato ISO en "fechaISO" (para el
  // conteo regresivo) y el texto que se muestra en pantalla en "fecha"/"hora".
  fechaISO: "2026-10-10T20:00:00", // [FECHA_ISO] — usada por la cuenta regresiva
  fecha: "Sábado 10 de Octubre de 2026",                 // ej: "Sábado 12 de Diciembre de 2026"
  hora: "20:00 hs",                   // ej: "20:00 hs"
  duracionHoras: 5,                   // duración estimada del evento, para el botón "Agregar al calendario"

  lugar: "Las Acacías",
  direccion: "Mármol 248, B2752 Cap. Sarmiento, Provincia de Buenos Aires",
  maps: "https://maps.app.goo.gl/sR8Av94uo7G55TpX6",

  // Formulario de confirmación de asistencia (Google Forms).
  // Pegá acá el link de tu formulario, tal cual lo copiás de "Enviar" → pestaña de link.
  // El script arma automáticamente la versión "embebida" a partir de este link.
  googleFormUrl: "https://forms.gle/dTb7YN81ojq3YG6u9", // ej: "https://forms.gle/xxxxx" o "https://docs.google.com/forms/d/e/.../viewform"

  instagram: "zaiimadariaga_",          // ej: "https://instagram.com/zaira" o "@zaira" — dejar "" para ocultar

  dressCode: "Elegante"          // ej: "Elegante Sport"
};

document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initReveal();
  initCountdown();
  initHeroOpen();
  initMusic();
  initGallery();
  initLightbox();
  initRsvpModal();
  initConfetti();
  initPhotoBackdrop();
  initSplash();
  initCalendar();
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

  // Formulario de confirmación (Google Forms) — botón único
  const rsvpBtn = document.getElementById("rsvp-open");
  if (rsvpBtn){
    if (isPlaceholder(CONFIG.googleFormUrl)){
      rsvpBtn.setAttribute("aria-disabled", "true");
      rsvpBtn.title = "El formulario todavía no está configurado";
    }
  }

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

/* Convierte cualquier link de Google Forms (forms.gle o docs.google.com)
   en su versión embebida dentro de un iframe. */
function toEmbeddableFormUrl(url){
  let clean = url.trim();
  // Si ya tiene parámetros, respetarlos y solo asegurar embedded=true
  if (/[?&]embedded=true/.test(clean)) return clean;
  if (/\/viewform/.test(clean)){
    return clean.split("?")[0] + "?embedded=true";
  }
  // Links cortos forms.gle: Google los resuelve igual con el parámetro.
  return clean + (clean.includes("?") ? "&" : "?") + "embedded=true";
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

  // Bloquea el scroll (rueda, touch y teclado) hasta que se toque el botón,
  // para asegurar que la música arranque con un gesto real del usuario.
  function blockEvent(e){ e.preventDefault(); }
  const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Spacebar", "Home", "End"];
  function blockKeys(e){
    if (scrollKeys.includes(e.key)) e.preventDefault();
  }

  document.addEventListener("wheel", blockEvent, { passive: false });
  document.addEventListener("touchmove", blockEvent, { passive: false });
  document.addEventListener("keydown", blockKeys);

  openBtn.addEventListener("click", () => {
    document.body.classList.remove("is-locked");
    document.removeEventListener("wheel", blockEvent);
    document.removeEventListener("touchmove", blockEvent);
    document.removeEventListener("keydown", blockKeys);

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

/* ---------------------------------------------------------
   Modal de confirmación (Google Forms embebido)
   --------------------------------------------------------- */
function initRsvpModal(){
  const openBtn = document.getElementById("rsvp-open");
  const modal = document.getElementById("rsvp-modal");
  const closeBtn = document.getElementById("rsvp-modal-close");
  const body = document.getElementById("rsvp-modal-body");
  if (!openBtn || !modal || !body) return;

  openBtn.addEventListener("click", () => {
    if (isPlaceholder(CONFIG.googleFormUrl)){
      // Formulario aún no configurado: no rompe nada, solo no abre.
      return;
    }
    // Insertar el iframe recién al abrir, para no cargar Google Forms de más.
    if (!body.querySelector("iframe")){
      const iframe = document.createElement("iframe");
      iframe.src = toEmbeddableFormUrl(CONFIG.googleFormUrl);
      iframe.title = "Formulario de confirmación de asistencia";
      iframe.loading = "lazy";
      body.appendChild(iframe);
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  });

  function closeModal(){
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (!modal.hidden && e.key === "Escape") closeModal();
  });
}

/* ---------------------------------------------------------
   Serpentinas cayendo (canvas, doradas y negras con filo dorado)
   --------------------------------------------------------- */
function initConfetti(){
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas || !canvas.getContext) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return; // se mantiene oculto vía CSS, no arrancamos el loop

  const ctx = canvas.getContext("2d");
  const GOLD_TONES = ["#D4AF37", "#F4D675", "#FFD966", "#8A6500"];
  let strips = [];
  let width = 0, height = 0, dpr = 1;
  let running = true;
  let rafId = null;

  function density(){
    // menos tiras en pantallas chicas para que quede elegante y liviano
    const area = width * height;
    const base = Math.round(area / 34000);
    return Math.max(16, Math.min(base, 46));
  }

  function makeStrip(spawnAtTop){
    const isGold = Math.random() > 0.45;
    return {
      x: Math.random() * width,
      y: spawnAtTop ? -20 - Math.random() * height : Math.random() * height,
      len: 14 + Math.random() * 12,
      w: 3.2 + Math.random() * 2.2,
      speedY: 18 + Math.random() * 22, // px/seg
      swayAmp: 12 + Math.random() * 22,
      swayFreq: 0.4 + Math.random() * 0.6,
      swaySeed: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 1.6,
      isGold,
      color: isGold ? GOLD_TONES[Math.floor(Math.random() * GOLD_TONES.length)] : "#141210",
      opacity: 0.5 + Math.random() * 0.4
    };
  }

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const target = density();
    if (strips.length === 0){
      strips = Array.from({ length: target }, () => makeStrip(false));
    } else if (strips.length < target){
      strips.push(...Array.from({ length: target - strips.length }, () => makeStrip(true)));
    } else if (strips.length > target){
      strips.length = target;
    }
  }

  let lastTime = null;
  function frame(t){
    if (!running){ rafId = null; return; }
    if (lastTime === null) lastTime = t;
    const dt = Math.min((t - lastTime) / 1000, 0.05);
    lastTime = t;

    ctx.clearRect(0, 0, width, height);

    for (const s of strips){
      s.y += s.speedY * dt;
      s.rot += s.rotSpeed * dt;
      const sway = Math.sin((s.y / 60) * s.swayFreq + s.swaySeed) * s.swayAmp * dt * 0.6;
      s.x += sway;

      if (s.y - s.len > height){
        Object.assign(s, makeStrip(false), { y: -20, x: Math.random() * width });
      }
      if (s.x < -30) s.x = width + 30;
      if (s.x > width + 30) s.x = -30;

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.globalAlpha = s.opacity;

      if (s.isGold){
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.w;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(0, -s.len / 2);
        ctx.lineTo(0, s.len / 2);
        ctx.stroke();
      } else {
        // cinta negra con filo dorado fino para que se distinga del fondo
        ctx.strokeStyle = "#D4AF37";
        ctx.lineWidth = s.w + 1.6;
        ctx.lineCap = "round";
        ctx.globalAlpha = s.opacity * 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -s.len / 2);
        ctx.lineTo(0, s.len / 2);
        ctx.stroke();

        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.w;
        ctx.globalAlpha = s.opacity;
        ctx.beginPath();
        ctx.moveTo(0, -s.len / 2);
        ctx.lineTo(0, s.len / 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    rafId = requestAnimationFrame(frame);
  }

  function start(){
    if (rafId === null){
      lastTime = null;
      rafId = requestAnimationFrame(frame);
    }
  }
  function stop(){
    running = false;
    if (rafId !== null){ cancelAnimationFrame(rafId); rafId = null; }
  }

  resize();
  running = true;
  start();

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden){ running = false; }
    else { running = true; start(); }
  });
}

/* ---------------------------------------------------------
   Fondo de fotos: se achica, se achata y desaparece
   mientras la siguiente aparece desde abajo, al scrollear.
   --------------------------------------------------------- */
function initPhotoBackdrop(){
  const imgs = Array.from(document.querySelectorAll(".photo-backdrop__img"));
  if (imgs.length === 0) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const total = imgs.length;
  let segmentLength = window.innerHeight;
  let ticking = false;

  function update(){
    ticking = false;
    const scrollY = window.scrollY || window.pageYOffset;
    const raw = scrollY / segmentLength;
    const currentIndex = Math.min(Math.floor(raw), total - 1);
    const progress = Math.max(0, Math.min(raw - currentIndex, 1));

    imgs.forEach((img, i) => {
      if (reduceMotion){
        img.style.opacity = i === currentIndex ? "1" : "0";
        img.style.transform = "none";
        return;
      }

      if (i === currentIndex){
        // se achica, se achata y se desvanece
        const scaleX = 1 - progress * 0.12;
        const scaleY = 1 - progress * 0.38;
        img.style.opacity = String(1 - progress);
        img.style.transform = `scale(${scaleX}, ${scaleY}) translateY(${progress * -6}%)`;
      } else if (i === currentIndex + 1){
        // aparece desde abajo, creciendo hasta su tamaño normal
        const scaleX = 0.94 + progress * 0.06;
        const scaleY = 0.62 + progress * 0.38;
        img.style.opacity = String(progress);
        img.style.transform = `scale(${scaleX}, ${scaleY}) translateY(${(1 - progress) * 8}%)`;
      } else if (i < currentIndex){
        img.style.opacity = "0";
        img.style.transform = "scale(0.88, 0.62)";
      } else {
        img.style.opacity = "0";
        img.style.transform = "scale(0.94, 0.62) translateY(8%)";
      }
    });
  }

  function onScroll(){
    if (!ticking){
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  function onResize(){
    segmentLength = window.innerHeight;
    update();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  update();
}

/* ---------------------------------------------------------
   Pantalla de carga (splash)
   --------------------------------------------------------- */
function initSplash(){
  const splash = document.getElementById("splash");
  if (!splash) return;

  let hidden = false;
  function hide(){
    if (hidden) return;
    hidden = true;
    splash.classList.add("splash--hidden");
    setTimeout(() => { splash.style.display = "none"; }, 650);
  }

  // se oculta apenas termina de cargar todo (fuentes, imágenes, etc.)
  if (document.readyState === "complete"){
    setTimeout(hide, 250);
  } else {
    window.addEventListener("load", () => setTimeout(hide, 250));
  }
  // resguardo: nunca se queda trabada más de 2.5s aunque algo falle en cargar
  setTimeout(hide, 2500);
}

/* ---------------------------------------------------------
   Botón "Agregar al calendario" (Google Calendar + .ics)
   --------------------------------------------------------- */
function pad2(n){ return String(n).padStart(2, "0"); }

function parseEventDate(){
  // CONFIG.fechaISO es hora local del evento (sin zona horaria explícita)
  const m = CONFIG.fechaISO.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s] = m;
  const start = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s || 0));
  const end = new Date(start.getTime() + (CONFIG.duracionHoras || 4) * 3600000);
  return { start, end };
}

function formatICSDate(date){
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}T${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}`;
}

function initCalendar(){
  const toggle = document.getElementById("calendar-toggle");
  const list = document.getElementById("calendar-list");
  const googleLink = document.getElementById("calendar-google");
  const icsLink = document.getElementById("calendar-ics");
  if (!toggle || !list || !googleLink || !icsLink) return;

  const range = parseEventDate();
  const title = `Mis 15 años de ${CONFIG.nombre}`;
  const location = [CONFIG.lugar, CONFIG.direccion].filter((v) => !isPlaceholder(v)).join(", ");
  const details = `Celebración de los 15 años de ${CONFIG.nombre}.`;

  if (range){
    // Google Calendar: horario local + zona horaria de Argentina
    const startStr = formatICSDate(range.start);
    const endStr = formatICSDate(range.end);
    const gUrl = new URL("https://www.google.com/calendar/render");
    gUrl.searchParams.set("action", "TEMPLATE");
    gUrl.searchParams.set("text", title);
    gUrl.searchParams.set("dates", `${startStr}/${endStr}`);
    gUrl.searchParams.set("details", details);
    gUrl.searchParams.set("location", location);
    gUrl.searchParams.set("ctz", "America/Argentina/Buenos_Aires");
    googleLink.href = gUrl.toString();

    icsLink.addEventListener("click", (e) => {
      e.preventDefault();
      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Mis15//Zaira//ES",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        `UID:${Date.now()}@mis15zaira`,
        `DTSTAMP:${formatICSDate(new Date())}`,
        `DTSTART:${startStr}`,
        `DTEND:${endStr}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${details}`,
        `LOCATION:${location}`,
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mis-15-zaira.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  } else {
    toggle.setAttribute("aria-disabled", "true");
  }

  function closeList(){
    list.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }
  function toggleList(){
    const willOpen = list.hidden;
    list.hidden = !willOpen;
    toggle.setAttribute("aria-expanded", String(willOpen));
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleList();
  });
  document.addEventListener("click", (e) => {
    if (!list.hidden && !list.contains(e.target) && e.target !== toggle) closeList();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeList();
  });
}
