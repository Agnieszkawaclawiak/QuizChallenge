var startButton = document.getElementById("start");

//document selectors
const time = document.getElementById('time');
//const quizContainer = document.getElementById('quiz');
//const resultsContainer = document.getElementById('results');//
const startScreen = document.getElementById('start-screen');
const submitButton = document.getElementById('submit');
const questions = document.getElementById('questions');
const questionTitle = document.getElementById('question-title');
const choices = document.getElementById('choices');
const endScreen = document.getElementById('endScreen');
const finalScore = document.getElementById('final-score');
const initials = document.getElementById('initials');
const feedback = document.getElementById('feedback');
const start = document.getElementById('start');
//variables

let timerInterval;
let secondsLeft;
let quizSelection;
let quizQuestions;
let quizAnswers;

const htmlQuestions = [
  'What does HTML stand for?',
  'The <title> element must be located inside...',
  'Which tag is used to create a hyperlink?',
  'How do you open a link in a new window?',
  '<h3> is the largest default heading tag.',
  'Which of the following table tags is used to create a table row?',
  'Which of the following HTML tags is NOT valid?',
  'Which of the following is NOT an HTML attribute?',
  'What HTML form input must be used to present multiple options, but select only one?',
];

const htmlAnswers = [
  [['Hyper Text Markup Language', true], ['Hot Mail', false], ['How to Make Lasagna', false]],
  [['the <head> element', true], ['the <body> element', false]],
  [['<a>', true], ['<img>', false], ['<dl>', false], ['<link>', false]],
  [['target="_new"', false], ['target="_window"', false], ['target="_blank"', true]],
  [['True', false], ['False', true]],
  [['<th>', false], ['<td>', false], ['<tr>', true], ['<table>', false]],
  [['<h1>', false], ['<h8>', true], ['<h4>', false], ['<h5>', false]],
  [['alt', false], ['target', false], ['fontSize', true], ['id', false]],
  [['<input type="text">', false], ['<input type="radio">', true], ['<input type="checkbox">', false]],
];
function init() {
  renderHome();
}
start.addEventListener('click', renderHome);
finalScore.addEventListener('click', renderScoreboard);

function initializeTimer() {
    secondsLeft = 75;

    if (!timerInterval) {
        timerInterval = setInterval(function () {
            secondsLeft--;
            time.textContent = secondsLeft;

            if (secondsLeft <= 0) {
                endQuiz();
            }
        }, 1000);
    }
}

function stopTime() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    secondsLeft = 0;
    time.textContent = secondsLeft;
}

// HOMEPAGE RENDERING //
function renderHome() {
    resetQuiz();
    // check if timer is initialized
    if (timerInterval) {
        stopTime();
    }

    questions.textContent = '';

    renderTitle('Coding Quiz Challenge');

    let par = document.createElement('p');
    par.textContent = 'Select a category below for the language you would like to take a quiz on. You will have 75 seconds to complete all 9 questions! At the end, enter your initials to be added to the leaderboard.';

    let categoryDiv = document.createElement('div');
    categoryDiv.classList.add('selection-div');

    let categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Select a Category:'

    let categorySelect = document.createElement('select');
    categorySelect.setAttribute('id', 'quiz-select')

    categorySelect.appendChild(createChoice('HTML Basics'));
    categorySelect.appendChild(createChoice('CSS Basics'));
    categorySelect.appendChild(createChoice('JavaScript Basics'));

    categoryDiv.appendChild(categoryLabel);
    categoryDiv.appendChild(categorySelect);

    let startButton = document.createElement('button');
    startButton.textContent = 'Start Quiz!';
    startButton.setAttribute('id', 'start');
    startButton.addEventListener('click', startQuiz);

   start.appendChild(par);
   start.appendChild(categoryDiv);
   start.appendChild(startButton);
}

function createChoice(choiceName) {
    let choice = document.createElement('option');
    choice.textContent = choiceName;
    return choice;
}

// HIGHSCORE PAGE RENDERING
function renderScoreboard() {
    startScreen.textContent = '';
    resetQuiz();

    // check if timer is initialized
    if (timerInterval) {
        stopTime();
    }

    let scoreboard = JSON.parse(localStorage.getItem('scoreboard'));
    
    renderTitle('Leaderboard')

    if (!scoreboard) {
        let par = document.createElement('p');
        par.textContent = 'It looks like there are no high scores yet! Will you be the first one?'
        start.appendChild(par);
       
        let button = document.createElement('button');
        button.textContent = 'Back to Home';
        button.addEventListener('click', renderHome);
        start.appendChild(button)

        return
    }


    let playerUl = document.createElement('ul');
    playerUl.classList.add('scoreboard-list');

    for (let i = 0; i < scoreboard.length; i++) {
        let playerLi = document.createElement('li');
        playerLi.classList.add('scoreboard-item');
        playerLi.textContent = `${scoreboard[i].name} -- ${scoreboard[i].score}`;
        playerUl.appendChild(playerLi);
    }


    let homeButton = document.createElement('button');
    homeButton.textContent = 'Back to Home';
    homeButton.addEventListener('click', renderHome);

    let resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Highscores'
    resetButton.addEventListener('click', function() {
        localStorage.clear();
        renderScoreboard();
    });

   start-screen.appendChild(playerUl);
    start-screen.appendChild(homeButton);
   start-screen.appendChild(resetButton);
}

function addHighScore() {
    let scoreboard = JSON.parse(localStorage.getItem('scoreboard'));

    // validation of empty scoreboard
    if (scoreboard == null) {
        scoreboard = [];
    }

    let playerName = document.getElementById('initials-input').value.toUpperCase();
    let playerScore = secondsLeft;

    let player = {
        'name': playerName,
        'score': playerScore
    };

    // push player object onto localStorage array, then sort array highest to lowest
    scoreboard.push(player);                      
    scoreboard.sort((a, b) => b.score - a.score); 
    localStorage.setItem('scoreboard', JSON.stringify(scoreboard));
}

// QUIZ RENDERING + HANDLING

// sets questions based on home selection, starts timer, and prints the first question
function startQuiz() {
    setQuiz();
    start.textContent = '';
    initializeTimer(); 
    renderQuestion();
}

// sets quizQuestions + quizAnswers as the chosen array
function setQuiz() {
    quizSelection = document.querySelector('#quiz-select').value;

    if (quizSelection === 'HTML Basics') {
        quizQuestions = JSON.parse(JSON.stringify(htmlQuestions));
        quizAnswers = JSON.parse(JSON.stringify(htmlAnswers));
    } else if (quizSelection === 'CSS Basics') {
        quizQuestions = JSON.parse(JSON.stringify(cssQuestions));
        quizAnswers = JSON.parse(JSON.stringify(cssAnswers));
    } else if (quizSelection === 'JavaScript Basics') {
        quizQuestions = JSON.parse(JSON.stringify(javascriptQuestions));
        quizAnswers = JSON.parse(JSON.stringify(javascriptAnswers));
    } else {
        quizQuestions = JSON.parse(JSON.stringify(questions));
        quizAnswers = JSON.parse(JSON.stringify(answers));
    }
}

function resetQuiz() {
    quizQuestions = null;
    quizAnswers = null;
    resetTimer();
}

function endQuiz() {
    if (secondsLeft < 0) {
        secondsLeft = 0;
        timerEl.textContent = secondsLeft;
    }
    stopTime();

    let affirmations = ['Keep it up, pal!', 'You\'re doing great!', 'I bet you could do this with your eyes closed!', 'I\'m sure everyone would be impressed if they saw you take this quiz!', 'Steve Jobs? Is that you?!', 'Excelsior!']

    let pageTitle = document.createElement('h1');
    pageTitle.textContent = 'Quiz Over!';

    let quizResults = document.createElement('p');
    quizResults.textContent = `You scored ${secondsLeft} points. ${affirmations[randomNumber(affirmations.length)]}`;

    let initialsPrompt = document.createElement('p');
    initialsPrompt.textContent = 'Please enter your initials:'
    initialsPrompt.classList.add('enter-initials')

    let initialsInput = document.createElement('input');
    initialsInput.classList.add('initials-input');
    initialsInput.setAttribute('id', 'initials-input');
    initialsInput.maxLength = 3;
    initialsInput.size = 4;

    let highscoreButton = document.createElement('button');
    highscoreButton.textContent = 'Go to Highscores';

    highscoreButton.addEventListener('click', function () {
        if (initialsInput.value) {
            addHighScore();
            resetQuiz();
            renderScoreboard();
        }
    })

    mainEl.textContent = '';

    mainEl.appendChild(pageTitle);
    mainEl.appendChild(quizResults);
    mainEl.appendChild(initialsPrompt);
    mainEl.appendChild(initialsInput);
    mainEl.appendChild(highscoreButton);
};

function renderQuestion() {
    // check if there are any remaining questions
    if (quizQuestions.length === 0) {
        return endQuiz();
    }

    start.textContent = '';
    
    let card = document.createElement('div');
    card.classList.add('card');
    
    let icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add('fa-question-circle');
    icon.classList.add('fa-4x');
    card.appendChild(icon);

    // generate a random number based on the number of questions available
    randomNum = randomNumber(quizQuestions.length);

    card.appendChild(renderQuestionTitle(quizQuestions[randomNum]));

    let listOptions = document.createElement('ol');

    // print questions depending on how many there are for that question
    for (let i = 0; i < quizAnswers[randomNum].length; i++) {
        listOptions.appendChild(createAnswerChoice(randomNum, i));
    }

    card.appendChild(listOptions);

    startScreen.appendChild(card);
}

function createAnswerChoice(randomNum, index) {
    let answer = document.createElement('li');

    answer.classList.add('answer-choice');
    answer.addEventListener('click', checkAnswer);
    answer.textContent = quizAnswers[randomNum][index][0];
    answer.dataset.answer = quizAnswers[randomNum][index][1];

    return answer;
}

function checkAnswer() {
    // check to see if the answer is correct, then remove it from its array
    if (this.dataset.answer === 'true') {
        this.classList.add('correct');

        quizQuestions.splice(randomNum, 1);
        quizAnswers.splice(randomNum, 1);

        setTimeout(renderQuestion, 500);
    } else {
        // notify user of wrong answer, then add 15 second penalty
        if (!this.textContent.endsWith('❌')) {
            this.textContent = `${this.textContent} ❌`;
            secondsLeft -= 15;
        }
    }
}

// UTILITY
function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

function renderTitle(titleContent) {
    let title = document.createElement('h1');
    title.textContent = titleContent;
    title.classList.add('page-title');

    start.appendChild(title);
}

function renderQuestionTitle(titleContent) {
    let title = document.createElement('h2');
    title.textContent = titleContent;
    title.classList.add('question-title');

    return title;
}

init();

