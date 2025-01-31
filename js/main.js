const answerOptions = document.querySelector(".answer-options");
const startQuizBtn = document.querySelector(".start-quiz-btn");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const quizTimer = document.querySelector(".quiz-timer");
const timerDisplay = document.querySelector(".time-duration");
const configContainer = document.querySelector(".config-container");
const quizContainer = document.querySelector(".quiz-container");
const resultContainer = document.querySelector(".result-container");
const categoryOption = document.querySelector(".category-options");
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer;
let quizCategory;
let numberOfQuestion;
let currentQuestion;
const questionsIndexHistory = [];
let correctAnswerCount = 0;
// Timer
const startTimer = () => {
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;
    if (currentTime <= 5) {
      quizTimer.style.transition = ".3s ease background-color";
      quizTimer.style.backgroundColor = "red";
    }
    if (currentTime <= 0) {
      clearInterval(timer);
      highlightCorrectAnswer();
      nextQuestionBtn.style.visibility = "visible";
      answerOptions
        .querySelectorAll(".answer-option")
        .forEach((option) => (option.style.pointerEvents = "none"));
    }
  }, 1000);
};
// clear and reset the timer
const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDisplay.textContent = `${currentTime}s`;
  quizTimer.style.backgroundColor = "rgb(83, 84, 84)";
};

//show quiz result
const showQuizResult = () => {
  quizContainer.style.display = "none";
  resultContainer.style.display = "block";
  const resultMessage = document.querySelector(".result-message");
  resultMessage.innerHTML = `You answered <b>${correctAnswerCount}</b> of <b>${numberOfQuestion}</b> questions correctly. Great effort!`;
};
//fetch a random question from based on the selected category
const getRandomQuestion = () => {
  const categoryQuestions =
    questions.find(
      (cat) => cat.category.toLowerCase() === quizCategory.toLowerCase()
    ).questions || [];
  if (
    questionsIndexHistory.length >=
    Math.min(categoryQuestions.length, numberOfQuestion)
  ) {
    return showQuizResult();
  }
  const availableQuestion = categoryQuestions.filter(
    (_, index) => !questionsIndexHistory.includes(index)
  );
  const randomQuestions =
    availableQuestion[Math.floor(Math.random() * availableQuestion.length)];
  questionsIndexHistory.push(categoryQuestions.indexOf(randomQuestions));
  return randomQuestions;
};

// highlight the correct answer and add icon
const highlightCorrectAnswer = () => {
  const correctOption =
    answerOptions.querySelectorAll(".answer-option")[
      currentQuestion.correctAnswer
    ];
  correctOption.classList.add("correct");
  const iconHTML = `<i class="fa-regular fa-circle-check"></i>`;
  correctOption.insertAdjacentHTML("beforeEnd", iconHTML);
};

// handle the user's answer selection
const handleAnswer = (option, answerIndex) => {
  clearInterval(timer);
  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "incorrect");
  !isCorrect ? highlightCorrectAnswer() : correctAnswerCount++;
  const iconHTML = isCorrect
    ? `<i class="fa-regular fa-circle-check"></i>`
    : `<i class="fa-regular fa-circle-xmark"></i>`;
  option.insertAdjacentHTML("beforeEnd", iconHTML);
  //disable all option after select one
  answerOptions
    .querySelectorAll(".answer-option")
    .forEach((option) => (option.style.pointerEvents = "none"));
  nextQuestionBtn.style.visibility = "visible";
};

// Render the current question and its options in the quiz
const renderQuestion = () => {
  currentQuestion = getRandomQuestion();
  if (!currentQuestion) return;
  resetTimer();
  startTimer();
  answerOptions.innerHTML = "";
  nextQuestionBtn.style.visibility = "hidden";
  questionStatus.innerHTML = `<b>${questionsIndexHistory.length}</b> of <b>${numberOfQuestion}</b> Questions`;
  document.querySelector(".question-text").textContent =
    currentQuestion.question;
  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    answerOptions.appendChild(li);

    li.addEventListener("click", () => handleAnswer(li, index));
  });
};
//reset the quiz and return to the configuration container
const resetQuiz = () => {
  resetTimer();
  correctAnswerCount = 0;
  questionsIndexHistory.length = 0;
  configContainer.style.display = "block";
  resultContainer.style.display = "none";
};

//start Quiz
const startQuiz = () => {
  configContainer.style.display = "none";
  quizContainer.style.display = "block";
  //update the category and the number of questions
  quizCategory = configContainer.querySelector(
    ".category-option.active"
  ).textContent;
  numberOfQuestion = parseInt(
    configContainer.querySelector(".question-option.active").textContent
  );
  renderQuestion();
};
// highlight the selected option on click
document
  .querySelectorAll(".category-option , .question-option")
  .forEach((option) => {
    option.addEventListener("click", () => {
      option.parentNode.querySelector(".active").classList.remove("active");
      option.classList.add("active");
    });
  });
startQuizBtn.addEventListener("click", startQuiz);
nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click", resetQuiz);

