(() => {
  const routes = [
    "/", "/classify", "/dynamic", "/volume", "/params",
    "/compressors", "/3d", "/facts", "/quiz", "/literature"
  ];

  const details = {
    centrifugal: "Центробежный — лопастное колесо разгоняет жидкость от центра к периферии. Универсален для воды и светлых нефтепродуктов. Смотрите раздел «Динамические» и 3D HowItWorks.",
    axial: "Осевой — поток вдоль оси, как у винта. Огромный расход при малом напоре: каналы, циркуляция, охлаждение.",
    vortex: "Вихревой — многократный обмен энергией в боковом канале. Высокий напор, скромный КПД, часто самозасос.",
    jet: "Струйный (эжектор) — энергия рабочей струи, движущихся частей нет. Надёжен, но КПД обычно низкий.",
    piston: "Поршневой/плунжерный — вытеснение объёма цилиндра. Высокое давление, пульсации, нужны клапаны и демпфер.",
    gear: "Шестерённый — перенос во впадинах зубьев. Масло, топливо, нефть. Не глушить нагнетание без клапана!",
    screw: "Винтовой — полости вдоль шнеков. Вязкие нефти и смеси, относительно ровная подача.",
    vane: "Пластинчатый — камеры переменного объёма в гидроприводе. Мембранный — химия и дозирование без утечек по штоку."
  };

  const quiz = [
    {
      q: "Какой класс насосов вытесняет фиксированный объём за цикл?",
      options: ["Динамические", "Объёмные", "Только струйные", "Только осевые"],
      a: 1
    },
    {
      q: "Что обычно делают при пуске центробежного насоса на нагнетании?",
      options: ["Полностью открывают задвижку", "Держат задвижку закрытой/почти закрытой (по паспорту)", "Глушат всасывание", "Отключают предохранительный клапан"],
      a: 1
    },
    {
      q: "Почему опасно полностью перекрывать нагнетание объёмного насоса?",
      options: ["Упадёт КПД электродвигателя", "Давление будет расти до срыва прочности/срабатывания клапана", "Исчезнет кавитация", "Насос начнёт работать как турбина"],
      a: 1
    },
    {
      q: "Условие отсутствия кавитации:",
      options: ["NPSHa < NPSHr", "NPSHa ≥ NPSHr (+ запас)", "H = 0", "η = 1"],
      a: 1
    },
    {
      q: "Законы подобия: при увеличении частоты вращения n напор H меняется как…",
      options: ["~ n", "~ n²", "~ n³", "не зависит от n"],
      a: 1
    },
    {
      q: "Полезная мощность насоса равна…",
      options: ["ρ g Q H", "Q / H", "Δp / Q", "η / n"],
      a: 0
    },
    {
      q: "Мёртвый (вредный) объём в поршневом компрессоре…",
      options: ["Увеличивает производительность", "Снижает объёмный КПД при высокой степени сжатия", "Нужен только для смазки", "Равен нулю всегда"],
      a: 1
    },
    {
      q: "Степень сжатия компрессора — это…",
      options: ["Qнагн / Qвс", "pнагн / pвс", "Tвс / Tнагн", "η / ε"],
      a: 1
    },
    {
      q: "Какой насос лучше подходит для очень большого расхода при малом напоре?",
      options: ["Вихревой", "Осевой", "Мембранный", "Шестерённый"],
      a: 1
    },
    {
      q: "На вязкой нефти часто предпочтительнее…",
      options: ["Только осевой", "Шестерённый или винтовой", "Только струйный", "Только вихревой"],
      a: 1
    }
  ];

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
    e.preventDefault();
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
    if (score === quiz.length) msg.textContent = "Отлично! Можно идти на лабу с высоко поднятой головой.";
    else if (score >= 7) msg.textContent = "Хороший уровень. Подтяните NPSH и компрессоры — и будет отлично.";
    else if (score >= 5) msg.textContent = "База есть. Перечитайте классификацию и парадокс задвижки.";
    else msg.textContent = "Стоит пройти разделы «Классификация», «Параметры» и «Факты» ещё раз.";
    res.scrollIntoView({ behavior: "smooth", block: "center" });
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
        document.getElementById("classDetail").textContent = details[key] || "";
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

  renderQuiz();
  bindClassification();
  bindEmbeds();
  showPage(pathFromHash());
})();
