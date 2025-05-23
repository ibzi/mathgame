const setupEl = document.getElementById('setup');
const gameEl = document.getElementById('game');
const questionEl = document.getElementById('question');
const choicesContainer = document.getElementById('choices-container');
const resultEl = document.getElementById('result');
const resultTextEl = document.getElementById('result-text');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const correctSound = new Audio('sounds/correct.mp3');
const incorrectSound = new Audio('sounds/incorrect.wav');


let countdown;
let countdownValue;
let currentQuestion = 0;
let score = 0;
let level = 0;
let timer;
let timeLimit = 0;

// Start the game
function startGame() {
  correctSound.load();
  incorrectSound.load();
  level = parseInt(document.getElementById('level').value);
  setupEl.classList.add('hidden');
  gameEl.classList.remove('hidden');
  resultEl.classList.add('hidden');
  currentQuestion = 0;
  score = 0;

  // Set time limit based on level
  if (level === 1) timeLimit = 20;
  else if (level === 2) timeLimit = 10;
  else timeLimit = 0;

  displayQuestion();
}

// Display a single question with 4 multiple choice answers
function displayQuestion() {
  if (currentQuestion >= 10) {
    endGame();
    return;
  }

  currentQuestion++;

  const num1 = Math.floor(Math.random() * 12) + 1;
  const num2 = Math.floor(Math.random() * 12) + 1;
  const operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];

  let questionText;
  let correctAnswer;

  switch (operator) {
    case '+':
      correctAnswer = num1 + num2;
      questionText = `${num1} + ${num2}`;
      break;
    case '-':
      correctAnswer = num1 >= num2 ? num1 - num2 : num2 - num1;
      questionText = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`;
      break;
    case '*':
      correctAnswer = num1 * num2;
      questionText = `${num1} × ${num2}`;
      break;
    case '/':
      correctAnswer = num1;
      const divisor = num2;
      const dividend = num1 * num2;
      questionText = `${dividend} ÷ ${divisor}`;
      break;
  }

  questionEl.textContent = `Question ${currentQuestion}: ${questionText}`;
  generateChoices(correctAnswer);

  if (timeLimit > 0) {
    clearInterval(countdown);
    countdownValue = timeLimit;
    timerDisplay.textContent = `Time Left: ${countdownValue}s`;
  
    countdown = setInterval(() => {
      countdownValue--;
      timerDisplay.textContent = `Time Left: ${countdownValue}s`;
      if (countdownValue <= 0) {
        clearInterval(countdown);
        nextQuestion(); // Treat as wrong answer
      }
    }, 1000);
  } else {
    timerDisplay.textContent = 'Time Left: ∞';
  }
  




// Generate 4 choices and display them as buttons
function generateChoices(correctAnswer) {
  const choices = new Set();
  choices.add(correctAnswer);

  while (choices.size < 4) {
    const wrong = correctAnswer + Math.floor(Math.random() * 10 - 5);
    if (wrong >= 0 && wrong !== correctAnswer) choices.add(wrong);
  }

  const shuffled = Array.from(choices).sort(() => Math.random() - 0.5);

  choicesContainer.innerHTML = '';
  shuffled.forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.className = 'choice-btn';
    btn.onclick = () => checkAnswer(choice, correctAnswer);
    choicesContainer.appendChild(btn);
  });
}

// Check if selected answer is correct
function checkAnswer(selected, correct) {
  clearInterval(countdown);

  const buttons = document.querySelectorAll('.choice-btn');
  buttons.forEach(btn => {
    btn.disabled = true;
    const value = parseInt(btn.textContent);

    if (value === correct) {
      btn.classList.add('correct');
    }

    if (value === selected && selected !== correct) {
      btn.classList.add('incorrect');
    }
  });

  if (selected === correct) {
    correctSound.play(); // ✅ Play correct answer sound
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
  } else {
    incorrectSound.play(); // ❌ Play incorrect answer sound
  }

  setTimeout(() => {
    nextQuestion();
  }, 1000);
}




// Move to next question or end game
function nextQuestion() {
  displayQuestion();
}

// End game and show score
function endGame() {
  clearInterval(countdown);
  gameEl.classList.add('hidden');
  resultEl.classList.remove('hidden');
  resultTextEl.textContent = `You scored ${score} out of 10 questions! 🎉`;
}


}

// Return to start screen
function returnToStart() {
  resultEl.classList.add('hidden');
  setupEl.classList.remove('hidden');
}



