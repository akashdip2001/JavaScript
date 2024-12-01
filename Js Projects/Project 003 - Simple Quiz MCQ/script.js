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
  resetState(); // Remove previous question and answers
  let currentQuestion = shuffledQuestions[currentQuestionIndex];
  let questioNo = currentQuestionIndex + 1;
  questionElement.innerText = questioNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("button"); //class name
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
// (e) --> get the data from the event (which button was clicked by user)
function selectAnswer(e) {
  const selectedButton = e.target; // The clicked button
  const isCorrect = selectedButton.dataset.correct === "true"; // Check if the answer is correct

  // Add the appropriate class based on correctness
  if (isCorrect) {
    selectedButton.classList.add("correct");
    score++; // Increment score if correct
  } else {
    selectedButton.classList.add("incorrect");
  }

  // Check all buttons using array which is correct & Lock buttons and show feedback
  Array.from(answerButtonsElement.children).forEach((button) => {
    // Check all buttons using array which is correct
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true; // Disable all buttons after one is clicked
  });

  // also Block the btn - hover effect in css --> after clicking the button --> :not([disabled]) & cursor: not-allowed

  // Show the next button
  nextButton.style.display = "block";
}

// Handle Next button click
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    // shuffledQuestions.length --> how to get 4 questions , check the README file
    showQuestion();
  } else {
    showScore();
  }
});

// Show final score
function showScore() {
  resetState(); // Remove previous question and answers
  questionElement.innerText = `You scored ${score} out of ${shuffledQuestions.length}!`;
  nextButton.innerText = "Restart";
  nextButton.style.display = "block";
  nextButton.addEventListener("click", startQuiz);
}

// Initialize quiz by loading questions
loadQuestions();
