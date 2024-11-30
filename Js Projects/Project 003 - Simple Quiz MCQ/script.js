const questionElement = document.getElementById("Question");
const answerButtonsElement = document.getElementById("ans");
const nextButton = document.getElementById("next-btn");

let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// Load questions from JSON
async function loadQuestions() {
  try {
    const response = await fetch("questions.json");
    const data = await response.json();
    shuffledQuestions = data.sort(() => Math.random() - 0.5).slice(0, 4); // Shuffle and limit to 4 questions
    startQuiz();
  } catch (error) {
    console.error("Failed to load questions:", error);
  }
}

// Start quiz
function startQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  nextButton.innerText = "Next";
  showQuestion();
}

// Show current question
function showQuestion() {
  resetState();
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("button");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

// Reset state before showing next question
function resetState() {
  nextButton.style.display = "none";
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

// Handle answer selection
function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === "true";

  // Update score if correct
  if (correct) {
    score++;
  }

  // Lock buttons and show feedback
  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct === "true");
    button.disabled = true; // Disable all buttons after one is clicked
  });

  // Show the next button
  nextButton.style.display = "block";
}

// Set button status (correct or incorrect)
function setStatusClass(element, correct) {
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("incorrect");
  }
}

// Handle Next button click
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    showQuestion();
  } else {
    showScore();
  }
});

// Show final score
function showScore() {
  resetState();
  questionElement.innerText = `You scored ${score} out of ${shuffledQuestions.length}!`;
  nextButton.innerText = "Restart";
  nextButton.style.display = "block";
  nextButton.addEventListener("click", startQuiz);
}

// Initialize quiz by loading questions
loadQuestions();
