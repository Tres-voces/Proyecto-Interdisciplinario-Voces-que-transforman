const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    menuToggle.textContent = "☰";
  });
});

// Las cuatro etapas abren su propio contenido.
document.querySelectorAll(".stage-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const stage = button.dataset.stage;
    const detail = document.getElementById(`detail-${stage}`);
    const willOpen = detail.hidden;
    detail.hidden = !willOpen;
    button.setAttribute("aria-expanded", String(willOpen));
    button.innerHTML = willOpen
      ? 'Cerrar etapa <span>−</span>'
      : 'Descubrir etapa <span>＋</span>';
  });
});

// Buzón demostrativo: el mensaje no se almacena ni se envía.
const mailboxForm = document.getElementById("mailboxForm");
const messageText = document.getElementById("messageText");
const charCount = document.getElementById("charCount");
const mailboxResult = document.getElementById("mailboxResult");

messageText.addEventListener("input", () => {
  charCount.textContent = messageText.value.length;
  mailboxResult.textContent = "";
});

mailboxForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = messageText.value.trim();
  if (!message) {
    mailboxResult.textContent = "Escribe una reflexión antes de continuar.";
    return;
  }
  mailboxResult.textContent = "¡Gracias por compartir tu reflexión! Esta es solo una demostración: tu mensaje no se guardó ni se envió.";
  mailboxForm.reset();
  charCount.textContent = "0";
});

// Desafío final, una pregunta a la vez.
const questions = [
  {
    question: "¿Cuál de estas situaciones puede ser una señal de acoso escolar?",
    answers: [
      "Un desacuerdo puntual entre compañeros que se resuelve conversando.",
      "Burlas o exclusión repetidas dirigidas a una persona.",
      "Que dos estudiantes tengan gustos diferentes."
    ],
    correct: 1,
    explanation: "Correcto: el acoso suele implicar agresiones repetidas y una situación de desigualdad de poder."
  },
  {
    question: "Ves que comparten una foto para humillar a un compañero. ¿Qué haces?",
    answers: [
      "La comparto para que más personas la vean.",
      "Me río, pero no comento.",
      "No la difundo y busco apoyo de un adulto de confianza."
    ],
    correct: 2,
    explanation: "¡Bien! No difundir contenido dañino y pedir apoyo ayuda a frenar la situación."
  },
  {
    question: "¿Cómo puedes apoyar a una persona que te cuenta que está siendo acosada?",
    answers: [
      "Escucharla sin culparla y preguntarle qué apoyo necesita.",
      "Decirle que debe resolverlo sola.",
      "Contarle su historia a todo el curso."
    ],
    correct: 0,
    explanation: "Exacto: escucha, respeta su privacidad y ayúdala a buscar apoyo seguro."
  },
  {
    question: "¿Cuál es una forma responsable de actuar como testigo?",
    answers: [
      "Enfrentar con violencia a quien agrede.",
      "Acompañar a la persona y comunicar lo ocurrido a un adulto responsable.",
      "Ignorarlo siempre para no involucrarme."
    ],
    correct: 1,
    explanation: "¡Correcto! Puedes apoyar y pedir ayuda sin ponerte en peligro."
  },
  {
    question: "¿Qué ayuda a crear una convivencia escolar respetuosa?",
    answers: [
      "Excluir a quienes son diferentes.",
      "Guardar silencio cuando alguien pide ayuda.",
      "Incluir, escuchar y tratar a los demás con respeto."
    ],
    correct: 2,
    explanation: "¡Así es! La inclusión y el respeto se practican en las decisiones cotidianas."
  }
];

const questionProgress = document.getElementById("questionProgress");
const progressFill = document.getElementById("progressFill");
const questionText = document.getElementById("questionText");
const answerList = document.getElementById("answerList");
const quizFeedback = document.getElementById("quizFeedback");
const nextQuestion = document.getElementById("nextQuestion");
const restartQuiz = document.getElementById("restartQuiz");

let currentQuestion = 0;
let selectedAnswer = null;
let score = 0;
let checked = false;

function renderQuestion() {
  const item = questions[currentQuestion];
  selectedAnswer = null;
  checked = false;
  questionProgress.textContent = `PREGUNTA ${currentQuestion + 1} DE ${questions.length}`;
  progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionText.textContent = item.question;
  answerList.innerHTML = "";
  quizFeedback.textContent = "";
  nextQuestion.disabled = true;
  nextQuestion.innerHTML = 'Comprobar respuesta <span>→</span>';

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.innerHTML = `<span class="letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = answer;
    button.addEventListener("click", () => {
      if (checked) return;
      selectedAnswer = index;
      answerList.querySelectorAll(".answer-option").forEach((option) => option.classList.remove("selected"));
      button.classList.add("selected");
      nextQuestion.disabled = false;
    });
    answerList.appendChild(button);
  });
}

nextQuestion.addEventListener("click", () => {
  if (selectedAnswer === null) return;
  if (!checked) {
    checked = true;
    const item = questions[currentQuestion];
    const options = [...answerList.querySelectorAll(".answer-option")];
    options.forEach((option, index) => {
      option.disabled = true;
      if (index === item.correct) option.classList.add("correct");
      if (index === selectedAnswer && index !== item.correct) option.classList.add("wrong");
    });
    if (selectedAnswer === item.correct) {
      score++;
      quizFeedback.textContent = item.explanation;
    } else {
      quizFeedback.textContent = `La respuesta correcta está marcada. ${item.explanation}`;
    }
    nextQuestion.innerHTML = currentQuestion === questions.length - 1
      ? 'Ver resultado <span>→</span>'
      : 'Siguiente pregunta <span>→</span>';
    return;
  }

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  questionProgress.textContent = "DESAFÍO COMPLETADO";
  progressFill.style.width = "100%";
  questionText.textContent = `Tu resultado: ${score} de ${questions.length}`;
  answerList.innerHTML = "";
  const resultMessage = score === 5
    ? "¡Excelente! Tus decisiones reflejan respeto, empatía y responsabilidad."
    : score >= 3
      ? "¡Buen trabajo! Sigue practicando cómo escuchar, apoyar y pedir ayuda."
      : "Cada aprendizaje cuenta. Revisa las etapas y vuelve a intentarlo: puedes seguir creciendo.";
  quizFeedback.textContent = resultMessage;
  nextQuestion.disabled = true;
  nextQuestion.innerHTML = "Desafío terminado ✓";
}

restartQuiz.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  renderQuestion();
});

renderQuestion();
