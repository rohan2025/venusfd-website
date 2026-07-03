/* ============================================================
   VenusFD — starfield, scroll reveals, calculator, demo, form
   ============================================================ */

/* ---------- Starfield ---------- */
(function starfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.1 + 0.2,
      base: Math.random() * 0.5 + 0.15,
      speed: Math.random() * 1.5 + 0.4,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      const twinkle = reduced ? 1 : 0.6 + 0.4 * Math.sin(t / 1000 * s.speed + s.phase);
      ctx.globalAlpha = s.base * twinkle;
      ctx.fillStyle = "#f4e7d2";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (!reduced) requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
})();

/* ---------- Scroll reveals ---------- */
(function reveals() {
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.15 }
  );
  els.forEach((el) => io.observe(el));
})();

/* ---------- Missed-call calculator ---------- */
(function calculator() {
  const missedIn = document.getElementById("missedIn");
  const ticketIn = document.getElementById("ticketIn");
  const rateIn = document.getElementById("rateIn");
  if (!missedIn) return;

  const missedOut = document.getElementById("missedOut");
  const ticketOut = document.getElementById("ticketOut");
  const rateOut = document.getElementById("rateOut");
  const monthlyLoss = document.getElementById("monthlyLoss");
  const yearlyLoss = document.getElementById("yearlyLoss");

  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  function paintFill(input) {
    const pct =
      ((input.value - input.min) / (input.max - input.min)) * 100;
    input.style.setProperty("--fill", pct + "%");
  }

  function update() {
    const missed = Number(missedIn.value);
    const ticket = Number(ticketIn.value);
    const rate = Number(rateIn.value) / 100;

    missedOut.textContent = missed;
    ticketOut.textContent = usd.format(ticket);
    rateOut.textContent = rateIn.value + "%";

    // 4.33 weeks per month; only the share of missed callers who would have booked
    const monthly = missed * 4.33 * rate * ticket;
    monthlyLoss.textContent = usd.format(Math.round(monthly));
    yearlyLoss.textContent = usd.format(Math.round(monthly * 12));

    [missedIn, ticketIn, rateIn].forEach(paintFill);
  }

  [missedIn, ticketIn, rateIn].forEach((el) =>
    el.addEventListener("input", update)
  );
  update();
})();

/* ---------- Live demo (placeholder until voice backend is wired) ---------- */
(function demo() {
  const btn = document.getElementById("demoBtn");
  const note = document.getElementById("demoNote");
  if (!btn) return;
  btn.addEventListener("click", () => {
    note.hidden = false;
  });
})();

/* ---------- Book form ---------- */
(function bookForm() {
  const form = document.getElementById("bookForm");
  const done = document.getElementById("formDone");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.hidden = true;
    done.hidden = false;
  });
})();
