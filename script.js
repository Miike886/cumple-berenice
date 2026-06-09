(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sections = Array.from(document.querySelectorAll("[data-section]"));
  const dots = Array.from(document.querySelectorAll(".dot"));

  function burstConfetti(colors, options) {
    if (reduceMotion) return;

    if (typeof window.confetti === "function") {
      window.confetti({
        particleCount: 110,
        spread: 78,
        origin: { y: 0.62 },
        colors,
        ...options,
      });
      return;
    }

    document.body.classList.add("tiny-celebration");
    window.setTimeout(() => document.body.classList.remove("tiny-celebration"), 700);
  }

  const popIcons = [
    `<svg viewBox="0 0 80 80"><path d="M40 66C18 48 13 38 16 27c4-15 20-16 24-4 4-12 20-11 24 4 3 11-2 21-24 39z" fill="#f48fb1" stroke="#ad1457" stroke-width="4"/></svg>`,
    `<svg viewBox="0 0 80 80"><path d="M18 38h44c8 0 13 6 15 19 1 8-5 12-11 8l-10-8H24l-10 8c-6 4-12 0-11-8 2-13 7-19 15-19z" fill="#1a2a6c"/><circle cx="25" cy="48" r="5" fill="#00e5ff"/><path d="M53 44v10M48 49h10" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 80 80"><circle cx="25" cy="32" r="12" fill="none" stroke="#9c27b0" stroke-width="5"/><circle cx="55" cy="32" r="12" fill="none" stroke="#9c27b0" stroke-width="5"/><path d="M37 32h6M12 29l-9-5M68 29l9-5" stroke="#9c27b0" stroke-width="4" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="26" fill="#fff" stroke="#111" stroke-width="4"/><path d="M40 14l10 16-10 9-10-9zM15 40l18-1 7 19-14 10M65 40l-18-1-7 19 14 10" fill="none" stroke="#111" stroke-width="4" stroke-linejoin="round"/></svg>`,
  ];

  function spawnStickers(count = 8, x = window.innerWidth / 2, y = window.innerHeight / 2) {
    if (reduceMotion) return;

    Array.from({ length: count }).forEach((_, index) => {
      const sticker = document.createElement("span");
      sticker.className = "pop-sticker";
      sticker.innerHTML = popIcons[index % popIcons.length];
      sticker.style.left = `${x + (Math.random() * 160 - 80)}px`;
      sticker.style.top = `${y + (Math.random() * 80 - 40)}px`;
      sticker.style.setProperty("--sticker-x", `${Math.random() * 140 - 70}px`);
      sticker.style.setProperty("--sticker-delay", `${index * 38}ms`);
      document.body.appendChild(sticker);
      window.setTimeout(() => sticker.remove(), 1250);
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = document.getElementById(dot.dataset.target);
      target?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.dataset.section;
        entry.target.classList.add("is-visible");
        dots.forEach((dot) => dot.classList.toggle("is-active", dot.dataset.target === id));
      });
    },
    { threshold: 0.58 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  const countNodes = {
    days: document.querySelector('[data-count="days"]'),
    hours: document.querySelector('[data-count="hours"]'),
    minutes: document.querySelector('[data-count="minutes"]'),
    seconds: document.querySelector('[data-count="seconds"]'),
  };
  const birthdayDate = document.querySelector(".birthday-date");
  let countdownCelebrated = false;
  let countdownTarget = nextBirthdayTarget();

  function nextBirthdayTarget(now = new Date()) {
    let target = new Date(now.getFullYear(), 5, 9, 0, 0, 0, 0);
    if (now > target) target = new Date(now.getFullYear() + 1, 5, 9, 0, 0, 0, 0);
    return target;
  }

  function updateCountdown() {
    const now = new Date();
    const distance = countdownTarget - now;

    if (distance <= 0) {
      countNodes.days.textContent = "00";
      countNodes.hours.textContent = "00";
      countNodes.minutes.textContent = "00";
      countNodes.seconds.textContent = "00";
      birthdayDate.textContent = `9 de junio · ${countdownTarget.getFullYear()}`;

      if (!countdownCelebrated) {
        countdownCelebrated = true;
        burstConfetti(["#f48fb1", "#ad1457", "#ff8000", "#00e5ff"]);
        window.setTimeout(() => {
          countdownTarget = nextBirthdayTarget(new Date());
          updateCountdown();
        }, 9000);
      }
      return;
    }

    const totalSeconds = Math.floor(distance / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countNodes.days.textContent = String(days).padStart(2, "0");
    countNodes.hours.textContent = String(hours).padStart(2, "0");
    countNodes.minutes.textContent = String(minutes).padStart(2, "0");
    countNodes.seconds.textContent = String(seconds).padStart(2, "0");
    birthdayDate.textContent = `9 de junio · ${countdownTarget.getFullYear()}`;
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  document.querySelectorAll("[data-burst]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const rect = button.getBoundingClientRect();
      burstConfetti(["#f48fb1", "#ad1457", "#ff8000", "#00e5ff"], { particleCount: 140, spread: 92 });
      spawnStickers(10, rect.left + rect.width / 2, rect.top);
      event.currentTarget.textContent = "🥳 Te amo mucho mi reina 🥳";
    });
  });

  const radioMessage = document.querySelector(".radio-message");
  document.querySelectorAll("[data-radio]").forEach((button) => {
    button.addEventListener("click", () => {
      radioMessage.textContent = button.dataset.radio;
      radioMessage.classList.remove("is-flashing");
      void radioMessage.offsetWidth;
      radioMessage.classList.add("is-flashing");
      burstConfetti(["#ff8000", "#ffffff"], { particleCount: 44, spread: 48, origin: { y: 0.72 } });
    });
  });

  document.querySelectorAll(".reason-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });
  });

  const reasonsSection = document.querySelector(".reasons-section");
  const showAllButton = document.querySelector(".show-all-reasons");
  showAllButton?.addEventListener("click", () => {
    const isExpanded = reasonsSection.classList.toggle("is-expanded");
    showAllButton.textContent = isExpanded ? "ver menos" : "ver todas";
  });

  const shuffleReasons = document.querySelector(".shuffle-reasons");
  shuffleReasons?.addEventListener("click", () => {
    const cards = Array.from(document.querySelectorAll(".reason-card"));
    cards.forEach((card) => card.classList.remove("is-flipped"));
    cards
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
      .forEach((card, index) => {
        window.setTimeout(() => card.classList.add("is-flipped"), index * 110);
      });
    burstConfetti(["#f48fb1", "#ad1457"], { particleCount: 70, spread: 66 });
  });

  const route = {
  index: 0,
  picks: [],
  steps: [
    {
      text: "Hoy tu corazoncito pide...",
      icon: "mouse",
      options: [
        { label: "mimos", result: "mimos, calma y cero prisa" },
        { label: "jugar un rato", result: "una partida donde tú eliges las reglas" },
        { label: "ver anime", result: "capítulos, snacks y comentarios intensos" },
        { label: "salir bonita", result: "un plan lindo para verte brillar" },
      ],
    },
    {
      text: "Tu compañero ideal para este día sería...",
      icon: "dog",
      options: [
        { label: "Togo", result: "Togo acompañándote en modo cumpleañera consentida" },
        { label: "Lando", result: "un mini domingo de F1, aunque no sea domingo" },
        { label: "Bachira", result: "energía Bachira para hacer todo a tu manera" },
        { label: "tu novio obediente", result: "tu novio haciendo caso sin discutir" },
      ],
    },
    {
      text: "Para recargar felicidad eliges...",
      icon: "helmet",
      options: [
        { label: "mugrero", result: "snacks elegidos por ti, como debe ser" },
        { label: "besitos", result: "besitos sin contador, sin límite " },
        { label: "música", result: "música para sentirte protagonista de tu propia escena" },
        { label: "siesta", result: "una siesta digna de cumpleañera importante" },
      ],
    },
    {
      text: "Tu escena perfecta de cumpleaños necesita...",
      icon: "book",
      options: [
        { label: "una carta cursi", result: "una carta cursi, honesta y muy tuya" },
        { label: "ganar una partida", result: "una partida ganada por ti y celebrada como si fuera final mundial" },
        { label: "una plática profunda", result: "una conversación inteligente de esas que solo tú haces bonitas" },
        { label: "modo Lando", result: "un momento para verte gritar, emocionarte y sonreír como solo tú sabes" },      ],
    },
    {
      text: "Para cerrar el día, decreto oficial:",
      icon: "heart",
      options: [
        { label: "soy la cumpleañera", result: "tú eres la cumpleañera y hoy se hace lo que tú digas" },
        { label: "quiero un iPhone 15 Pro", result: "queda registrado el deseo oficialmente, sin prometer milagros" },
        { label: "quiero sorpresa", result: "una sorpresa lista para aparecer cuando menos lo esperes" },
        { label: "quiero todo", result: "todo: Togo, anime, juegos, carta, besitos y mucho amor" },
      ],
    },
  ],
};

  const progressDots = document.querySelector(".progress-dots");
  const quizQuestion = document.querySelector(".quiz-question");
  const quizCount = document.querySelector(".quiz-count");
  const quizOptions = document.querySelector(".quiz-options");
  const quizIllustration = document.querySelector(".quiz-illustration");
  const quizResult = document.querySelector(".quiz-result");
  const scoreLine = document.querySelector(".score-line");
  const resultCopy = document.querySelector(".result-copy");
  const resultList = document.querySelector(".result-list");
  const restartQuiz = document.querySelector(".restart-quiz");
  const quizCard = document.querySelector(".quiz-card");

  const icons = {
    dog: `<svg viewBox="0 0 120 120"><circle cx="37" cy="41" r="18" fill="#8d5524"/><circle cx="83" cy="41" r="18" fill="#8d5524"/><rect x="26" y="32" width="68" height="62" rx="30" fill="#c68642"/><circle cx="46" cy="61" r="5" fill="#2b170c"/><circle cx="74" cy="61" r="5" fill="#2b170c"/><path d="M56 72h8l-4 6z" fill="#2b170c"/></svg>`,
    helmet: `<svg viewBox="0 0 120 120"><path d="M27 85c1-36 13-60 33-60s32 24 33 60" fill="none" stroke="#FF8000" stroke-width="15" stroke-linecap="round"/><rect x="37" y="47" width="46" height="22" rx="10" fill="#0a0a18"/><text x="60" y="63" text-anchor="middle" font-size="16" font-family="Arial" font-weight="700" fill="#FF8000">4</text><path d="M34 86h52" stroke="#4b2700" stroke-width="8" stroke-linecap="round"/></svg>`,
    book: `<svg viewBox="0 0 120 120"><path d="M24 28h42q12 0 12 12v58H35q-11 0-11-11z" fill="#00e5ff"/><path d="M76 28h22v70H76q-12 0-12-12V40q0-12 12-12z" fill="#1a2a6c"/><path d="M36 48h24M36 62h22M80 48h12M80 62h12" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>`,
    mouse: `<svg viewBox="0 0 120 120"><circle cx="38" cy="42" r="23" fill="#f8bbd0"/><circle cx="82" cy="42" r="23" fill="#f8bbd0"/><circle cx="60" cy="66" r="34" fill="#fce4ec" stroke="#f48fb1" stroke-width="3"/><circle cx="49" cy="62" r="5" fill="#3a2630"/><circle cx="71" cy="62" r="5" fill="#3a2630"/><path d="M55 75q5 5 10 0" fill="none" stroke="#ad1457" stroke-width="3" stroke-linecap="round"/></svg>`,
    heart: `<svg viewBox="0 0 120 120"><path d="M60 94C26 66 18 50 22 35c5-21 29-23 38-5 9-18 33-16 38 5 4 15-4 31-38 59z" fill="#f48fb1" stroke="#ad1457" stroke-width="5"/><path d="M43 41c6-10 17-9 22 3" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".75"/></svg>`,
  };

  function renderProgress() {
    progressDots.innerHTML = "";
    route.steps.forEach((_, idx) => {
      const dot = document.createElement("span");
      dot.className = "progress-dot";
      dot.textContent = idx + 1;
      if (idx < route.index) dot.classList.add("is-done");
      if (idx === route.index) dot.classList.add("is-current");
      progressDots.appendChild(dot);
    });
  }

  function renderRouteStep() {
    const step = route.steps[route.index];
    quizResult.hidden = true;
    quizCard.hidden = false;
    quizOptions.hidden = false;
    quizQuestion.textContent = step.text;
    quizCount.textContent = `decisión ${route.index + 1} de ${route.steps.length}`;
    quizIllustration.innerHTML = icons[step.icon];
    quizOptions.innerHTML = "";
    renderProgress();

    step.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option.label;
      button.addEventListener("click", (event) => chooseRouteOption(option, event.currentTarget));
      quizOptions.appendChild(button);
    });
  }

  function chooseRouteOption(option, button) {
    route.picks[route.index] = option.result;
    Array.from(quizOptions.querySelectorAll("button")).forEach((item) => {
      item.disabled = true;
      item.classList.toggle("is-picked", item === button);
    });

    burstConfetti(["#f48fb1", "#ad1457", "#00e5ff"], { particleCount: 38, spread: 48 });

    window.setTimeout(() => {
      route.index += 1;
      if (route.index >= route.steps.length) showRouteResult();
      else renderRouteStep();
    }, 680);
  }

  function showRouteResult() {
    renderProgress();
    quizCard.hidden = true;
    quizOptions.hidden = true;
    quizResult.hidden = false;
    scoreLine.textContent = "ruta lista";
    resultCopy.textContent = "Tu cumpleaños queda oficialmente configurado con:";
    resultList.innerHTML = "";

    route.picks.forEach((pick) => {
      const item = document.createElement("span");
      item.textContent = pick;
      resultList.appendChild(item);
    });

    burstConfetti(["#f48fb1", "#ad1457", "#ff8000", "#00e5ff"], { particleCount: 170, spread: 96 });
  }

  restartQuiz.addEventListener("click", () => {
    route.index = 0;
    route.picks = [];
    renderRouteStep();
  });

  renderRouteStep();

  const letterStage = document.querySelector(".letter-stage");
  const envelopeButton = document.querySelector(".envelope-button");
  const letterPaper = document.querySelector(".letter-paper");
  let letterConfettiDone = false;

  envelopeButton.addEventListener("click", () => {
    letterStage.classList.add("is-open");
    burstConfetti(["#f48fb1", "#ad1457"], { particleCount: 54, spread: 52 });
    window.setTimeout(() => letterPaper.focus({ preventScroll: true }), 650);
  });

  letterPaper.addEventListener("scroll", () => {
    if (letterConfettiDone) return;
    const atBottom = letterPaper.scrollTop + letterPaper.clientHeight >= letterPaper.scrollHeight - 18;
    if (!atBottom) return;
    letterConfettiDone = true;
    burstConfetti(["#f48fb1", "#ad1457", "#ff8700", "#00e5ff"], { particleCount: 180, spread: 95 });
  });

})();
