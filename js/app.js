(() => {
  const routes = [
    "/", "/classify", "/dynamic", "/volume", "/params",
    "/compressors", "/3d", "/facts", "/quiz", "/literature"
  ];

  const I18N = window.NK_I18N;
  const LANG_KEY = "nk-lang";
  let lang = "ru";
  try { const saved = localStorage.getItem(LANG_KEY); if (saved === "ru" || saved === "en") lang = saved; } catch (_) {}
  const T = () => I18N[lang];
  const quizData = () => T().quiz.map(([q, options], i) => ({ q, options, a: I18N.answers[i] }));
  let lastScore = null;

  function applyLang(next) {
    lang = next === "en" ? "en" : "ru";
    try { localStorage.setItem(LANG_KEY, lang); } catch (_) {}
    const ui = T().ui;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const v = ui[el.dataset.i18n];
      if (v == null) return;
      if (el.tagName === "TITLE") document.title = v.replace(/&amp;/g, "&"); else el.innerHTML = v;
    });
    ["alt", "aria-label", "title", "content"].forEach(attr => {
      document.querySelectorAll(`[data-i18n-${attr}]`).forEach(el => {
        const v = ui[el.getAttribute(`data-i18n-${attr}`)];
        if (v != null) el.setAttribute(attr, v);
      });
    });
    document.querySelectorAll(".lang-btn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    // re-render dynamic parts, keeping quiz selections
    const picks = [...document.querySelectorAll("#quizForm input:checked")].map(i => [i.name, i.value]);
    const graded = document.getElementById("quizResult").classList.contains("show");
    renderQuiz();
    picks.forEach(([n, v]) => { const i = document.querySelector(`#quizForm input[name="${n}"][value="${v}"]`); if (i) i.checked = true; });
    if (graded) gradeQuiz(null);
    const active = document.querySelector(".branch-item.active");
    if (active) document.getElementById("classDetail").textContent = T().details[active.dataset.detail] || "";
  }

  function pathFromHash() {
    const h = (location.hash || "#/").replace(/^#/, "");
    const p = h.split("?")[0];
    return routes.includes(p) ? p : "/";
  }

  function showPage(path) {
    document.querySelectorAll(".page").forEach(el => {
      el.classList.toggle("active", el.dataset.page === path);
    });
    document.querySelectorAll(".nav-links a").forEach(a => {
      a.classList.toggle("active", a.dataset.route === path);
    });
    document.getElementById("topnav").classList.remove("open");
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function renderQuiz() {
    const quiz = quizData();
    const form = document.getElementById("quizForm");
    form.innerHTML = quiz.map((item, i) => `
      <article class="card quiz-card" data-qi="${i}">
        <div class="quiz-q">${i + 1}. ${item.q}</div>
        <div class="quiz-options">
          ${item.options.map((opt, j) => `
            <label>
              <input type="radio" name="q${i}" value="${j}" required />
              <span>${opt}</span>
            </label>
          `).join("")}
        </div>
      </article>
    `).join("");
  }

  function gradeQuiz(e) {
    if (e) e.preventDefault();
    const quiz = quizData();
    let score = 0;
    quiz.forEach((item, i) => {
      const card = document.querySelector(`.quiz-card[data-qi="${i}"]`);
      const labels = [...card.querySelectorAll("label")];
      labels.forEach(l => l.classList.remove("correct", "wrong"));
      const selected = card.querySelector(`input[name="q${i}"]:checked`);
      const val = selected ? Number(selected.value) : -1;
      labels[item.a].classList.add("correct");
      if (val === item.a) score++;
      else if (val >= 0) labels[val].classList.add("wrong");
    });
    const res = document.getElementById("quizResult");
    res.classList.add("show");
    document.getElementById("quizScore").textContent = `${score}/${quiz.length}`;
    const msg = document.getElementById("quizMsg");
    const m = T().msg;
    msg.textContent = score === quiz.length ? m[0] : score >= 7 ? m[1] : score >= 5 ? m[2] : m[3];
    if (e) res.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function resetQuiz() {
    renderQuiz();
    document.getElementById("quizResult").classList.remove("show");
  }

  // classification clicks
  function bindClassification() {
    document.querySelectorAll(".branch-item").forEach(item => {
      item.addEventListener("click", () => {
        document.querySelectorAll(".branch-item").forEach(x => x.classList.remove("active"));
        item.classList.add("active");
        const key = item.dataset.detail;
        document.getElementById("classDetail").textContent = T().details[key] || "";
      });
    });
  }

  function bindEmbeds() {
    const box = document.getElementById("embedBox");
    const frame = document.getElementById("embedFrame");
    document.querySelectorAll("[data-embed]").forEach(btn => {
      btn.addEventListener("click", () => {
        const url = btn.getAttribute("data-embed");
        box.hidden = false;
        frame.src = url;
        box.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  document.getElementById("navToggle").addEventListener("click", () => {
    document.getElementById("topnav").classList.toggle("open");
  });

  window.addEventListener("hashchange", () => showPage(pathFromHash()));
  document.getElementById("quizForm").addEventListener("submit", gradeQuiz);
  document.getElementById("quizReset").addEventListener("click", resetQuiz);

  document.querySelectorAll(".lang-btn").forEach(b => b.addEventListener("click", () => applyLang(b.dataset.lang)));

  applyLang(lang);
  bindClassification();
  bindEmbeds();
  showPage(pathFromHash());
})();
