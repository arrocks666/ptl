/* ============================================================
   ARROCKS DEVS — motion + interactions
   ============================================================ */

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none)").matches;

/* ---------- settings ---------- */
const WA_NUMBER = "8801965119476";
const CONTACT_EMAIL = "arrocks666@gmail.com";

/* ---------- year ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- entrance ---------- */
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

/* ---------- scroll reveals ---------- */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reduced) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = [...(el.parentElement?.children || [])].filter((c) =>
          c.classList.contains("reveal")
        );
        const index = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
        el.classList.add("in");
        io.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* ---------- nav state + scroll progress ---------- */
const nav = document.getElementById("nav");
const progressBar = document.querySelector(".progress span");

function onScroll() {
  const y = window.scrollY || document.documentElement.scrollTop;

  if (nav) nav.classList.toggle("is-stuck", y > 24);

  if (progressBar) {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? Math.min(100, (y / height) * 100) : 0;
    progressBar.style.width = `${pct}%`;
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- mobile menu ---------- */
const burger = document.querySelector(".nav-burger");

if (burger && nav) {
  const closeMenu = () => {
    nav.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", closeMenu));

  document.addEventListener("click", (e) => {
    if (nav.classList.contains("menu-open") && !nav.contains(e.target)) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

/* ---------- custom cursor ---------- */
const cursor = document.querySelector(".cursor");

if (cursor && !isTouch && !reduced) {
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let cx = x;
  let cy = y;

  document.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
  });

  const loop = () => {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();

  document.querySelectorAll("a, button, .shot-wrap, .deliver-card, .feature, .engage-card").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-hot"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-hot"));
  });
}

/* ---------- magnetic buttons ---------- */
if (!isTouch && !reduced) {
  document.querySelectorAll(".btn-primary, .btn-ghost, .nav-cta").forEach((btn) => {
    let raf = null;

    btn.addEventListener("mousemove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.16;
      const dy = (e.clientY - r.top - r.height / 2) * 0.22;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    });

    btn.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      btn.style.transform = "";
    });
  });
}

/* ---------- device 3D tilt ---------- */
if (!isTouch && !reduced) {
  document.querySelectorAll("[data-tilt]").forEach((wrap) => {
    const target = wrap.querySelector(".device");
    if (!target) return;
    let raf = null;

    wrap.addEventListener("mousemove", (e) => {
      const r = wrap.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        target.style.transform = `perspective(1200px) rotateX(${(-py * 5).toFixed(
          2
        )}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-8px)`;
      });
    });

    wrap.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      target.style.transform = "";
    });
  });
}

/* ---------- card tilt (subtle) ---------- */
if (!isTouch && !reduced) {
  document.querySelectorAll(".feature, .deliver-card, .engage-card").forEach((el) => {
    el.style.transformStyle = "preserve-3d";

    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * 3).toFixed(2)}deg) rotateY(${(
        px * 3
      ).toFixed(2)}deg) translateY(-6px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

/* ---------- marquee pause on hover ---------- */
const marqueeTrack = document.querySelector(".marquee-track");
if (marqueeTrack) {
  const marquee = marqueeTrack.parentElement;
  marquee.addEventListener("mouseenter", () => (marqueeTrack.style.animationPlayState = "paused"));
  marquee.addEventListener("mouseleave", () => (marqueeTrack.style.animationPlayState = "running"));
}

/* ---------- real screenshots replace the CSS mockups automatically ----------
   assets/shot-home.png · assets/shot-product.png · assets/shot-admin.png
------------------------------------------------------------------------- */
document.querySelectorAll(".shot-img").forEach((img) => {
  const show = () => {
    if (img.naturalWidth > 0) img.classList.add("is-on");
    else img.remove();
  };
  if (img.complete) show();
  else {
    img.addEventListener("load", show);
    img.addEventListener("error", () => img.remove());
  }
});

/* ---------- active nav link ---------- */
const navSections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll(".nav-links a")];

if (navSections.length && navLinks.length && "IntersectionObserver" in window) {
  const ioNav = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((a) => {
          const on = a.getAttribute("href") === id;
          a.style.color = on ? "var(--ink)" : "";
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  navSections.forEach((s) => ioNav.observe(s));
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
const toggleBtn = document.getElementById("toggleForm");
const formWrap = document.getElementById("formWrap");
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const mailBtn = document.getElementById("mailBtn");

if (toggleBtn && formWrap) {
  toggleBtn.addEventListener("click", () => {
    const hidden = formWrap.hasAttribute("hidden");
    if (hidden) formWrap.removeAttribute("hidden");
    else formWrap.setAttribute("hidden", "");

    toggleBtn.textContent = hidden ? "ইমেইল ফর্ম লুকান" : "ইমেইলে লিখতে চান?";
    if (hidden) formWrap.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function note(text, tone) {
  if (!formNote) return;
  formNote.textContent = text;
  formNote.style.color = tone === "error" ? "#FF9DBB" : tone === "ok" ? "#A9F0C8" : "";
}

function readFields() {
  if (!contactForm) return { name: "", email: "", phone: "", type: "", message: "" };
  const data = new FormData(contactForm);
  const get = (k) => (data.get(k) || "").toString().trim();
  return {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    type: get("type") || "নতুন অনলাইন শপ",
    message: get("message"),
  };
}

function validate(d) {
  if (!d.name) return "আপনার নামটা লিখুন।";
  if (!d.email) return "ইমেইলটা লিখুন।";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return "ইমেইলটা ঠিক করে লিখুন (যেমন: name@gmail.com)।";
  return "";
}

function buildSubject(d) {
  return `নতুন প্রজেক্ট — ${d.type} · ${d.name}`;
}

function buildBody(d) {
  return (
    `নাম: ${d.name}\n` +
    `ইমেইল: ${d.email}\n` +
    `হোয়াটসঅ্যাপ: ${d.phone || "—"}\n` +
    `যা দরকার: ${d.type}\n\n` +
    `${d.message || "(কিছু লেখা হয়নি)"}`
  );
}

/* Gmail compose — to / subject / body সব আগেই ভরা */
function gmailUrl(d) {
  return (
    "https://mail.google.com/mail/?view=cm&fs=1" +
    `&to=${encodeURIComponent(CONTACT_EMAIL)}` +
    `&su=${encodeURIComponent(buildSubject(d))}` +
    `&body=${encodeURIComponent(buildBody(d))}`
  );
}

/* নতুন ট্যাবে নিরাপদে খোলা (পপ-আপ ব্লক হয় না, কারণ ক্লিকের ভেতরেই হয়) */
function openInNewTab(url) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* ---- 1) হোয়াটসঅ্যাপ ---- */
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = readFields();

    const err = validate(d);
    if (err) return note(err, "error");

    const text =
      `আসসালামু আলাইকুম ARROCKS DEVS,\n\n` +
      `নতুন প্রজেক্ট — ${d.type}\n\n` +
      buildBody(d);

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
    openInNewTab(url);
    note("হোয়াটসঅ্যাপ খুলেছে — শুধু Send চাপুন।", "ok");
  });
}

/* ---- 2) ইমেইল → Gmail compose ---- */
if (mailBtn) {
  mailBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const d = readFields();

    const err = validate(d);
    if (err) return note(err, "error");

    const url = gmailUrl(d);

    if (mailBtn.tagName === "A") mailBtn.href = url;
    openInNewTab(url);

    note(
      `Gmail খুলেছে — "${CONTACT_EMAIL}"-এ মেইলটা লেখা আছে, শুধু Send চাপুন।`,
      "ok"
    );
  });
}

/* ফর্মে টাইপ করার সাথে সাথে লিংকও আপডেট থাকে (anchor হলে কাজে লাগে) */
if (contactForm && mailBtn && mailBtn.tagName === "A") {
  const sync = () => {
    const d = readFields();
    mailBtn.href = gmailUrl(d);
  };
  contactForm.addEventListener("input", sync);
  contactForm.addEventListener("change", sync);
  sync();
}
