window.addEventListener('DOMContentLoaded', () => {
  const clickSound = document.getElementById('clickSound');
  const allButtons = document.querySelectorAll('button');

  allButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      clickSound.currentTime = 0; // reset in case button is clicked quickly
      clickSound.play();
    });
  });
});

const gameBoard = document.getElementById('gameBoard');
const scoreDisplay = document.getElementById('score');
const pauseButton = document.getElementById('pauseButton');
const pauseMenu = document.getElementById('pauseMenu');

let score = 0;
let currentLevel = 1;

const symbols = [ //look i named them correctly
  '../images/banana.jpeg',
  '../images/apple.jpeg',
  '../images/logo_norm (2).jpeg',
  '../images/cherry.jpeg',
  '../images/orange.jpeg',
  '../images/strawberry.jpeg',
  '../images/blueberry.jpeg',
  '../images/kiwi.jpeg',
  '../images/eye.png',   
  '../images/ethan.png',       
  '../images/lips.png',        
  '../images/fishEye.jpeg',   
];



let cardValues = [...symbols, ...symbols]; // 16 total cards (each pic x2)

let firstCard = null;
let secondCard = null;
let lockBoard = false;


function startLevel(level) {
  currentLevel = level;
  
  // Calculate number of pairs based on level
  let pairsCount = 0;
  if (level === 1) pairsCount = 4;    // 8 cards = 4 pairs
  else if (level === 2) pairsCount = 8;  // 16 cards = 8 pairs
  else if (level === 3) pairsCount = 12; // 24 cards = 12 pairs

  // Prepare cardValues array with the right number of pairs
  cardValues = [...symbols.slice(0, pairsCount), ...symbols.slice(0, pairsCount)];
  
  mainMenu.style.display = 'none';
  levelSelect.style.display = 'none';
  gameContainer.style.display = 'block';

  score = 0;
  scoreDisplay.textContent = score;
  timeLeft = 60;
  timerDisplay.textContent = timeLeft;

  createBoard(); // sets up board random pattern
  startTimer(); // start timer
}

function shuffle(array) {                          // Shuffle function
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


function createBoard() {
  const shuffled = shuffle(cardValues.slice());
  gameBoard.innerHTML = '';

  if (currentLevel === 1) {
    gameBoard.style.gridTemplateColumns = 'repeat(4, 100px)';
  } else if (currentLevel === 2) {
    gameBoard.style.gridTemplateColumns = 'repeat(4, 100px)';
  } else if (currentLevel === 3) {
    gameBoard.style.gridTemplateColumns = 'repeat(6, 100px)';  // wider grid for 24 cards
  }

  shuffled.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;

    const img = document.createElement('img');
    img.src = '../images/backGround.jpeg';          // card back
    img.classList.add('card-img');
    card.appendChild(img);

    card.addEventListener('click', flipCard);  //everytime the user clicks on it,  the code picks it up
    gameBoard.appendChild(card);

    console.log('Creating board with symbols:', shuffled);
  });
}

function flipCard() {
  if (this.classList.contains('matched') || lockBoard || this.classList.contains('flipped')) return;

  this.classList.add('flipped');
  const img = this.querySelector('img');
  img.src = this.dataset.symbol;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  setTimeout(checkForMatch, 300); // Delay gives time for flip animation
}

function checkForMatch() {                        //does it match???
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

    if (isMatch) {
      score += 10;
      scoreDisplay.textContent = score;
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      checkWinCondition();
      resetCards();
      lockBoard = false;
    } 
    
    
    else {
        setTimeout(() => {                                                   //flips card over after the delay
      firstCard.querySelector('img').src = '../images/backGround.jpeg';
      secondCard.querySelector('img').src = '../images/backGround.jpeg';
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetCards(false);
       lockBoard = false;
      }, 1000);
  }
      
  }

 
  // Reset state
  firstCard = null;
  secondCard = null;
 

    function resetCards() {
          firstCard = null;
          secondCard = null;
        }

        let gameEnded = false; //prevent endGame from running twice

    function checkWinCondition() {
      const allCards = document.querySelectorAll('.card');
      const allMatched = Array.from(allCards).every(card => 
        card.classList.contains('matched') 
      );

      if (allMatched) {
        endGame(true); // Player wins
      }
}

//timer and game flow ~~~~ vibes 
let timeLeft = 60;
const timerDisplay = document.getElementById('timer');

function startTimer(reset = true) {
  clearInterval(window.timerInterval); // prevent multiple timers
  if (reset)  timeLeft = 60;
  gameEnded = false; // Reset endGame flag when starting/restarting game

  timerDisplay.textContent = timeLeft;
  window.timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(window.timerInterval);
      endGame(false);                                                     // Time's up
    }
  }, 1000);
}


//end and win game checking. win or lose there is no try..... im so tired
function endGame(won) {
  if (gameEnded) return;
  gameEnded = true;
  clearInterval(window.timerInterval);

  const overlay = document.getElementById('overlay');
  const message = document.getElementById('endMessage');
  const nextLevelBtn = document.getElementById('nextLevelButton');
  
  overlay.classList.remove('hidden');
  message.textContent = won ? "You Win!" : "Time's up! Try again!";
  
  if (won) {
    
    const winSound = document.getElementById('winSound');
    winSound.play();

    launchConfetti();
  }

  if (won && currentLevel < 3) {
    nextLevelBtn.classList.remove('hidden');
  } else {
    nextLevelBtn.classList.add('hidden');
  }
}


  function launchConfetti(duration = 15000) {
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);
    [0.1, 0.7].forEach(x => {
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(x, x + 0.2), y: Math.random() - 0.2 }
      }));
    });
  }, 250);
  }


function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

  //UI
//restart and start game
  function restartGame() {
    score = 0;
    scoreDisplay.textContent = score;
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;
    createBoard();
    startTimer();
    document.getElementById('overlay').classList.add('hidden');
  }

  pauseButton.addEventListener('click', () => {
  pauseGame();
});

  function pauseGame() {
    clearInterval(window.timerInterval);
    pauseMenu.classList.remove('hidden');
    lockBoard = true; // prevent card flipping while paused
  }

  function resumeGame() {
    document.getElementById("pauseMenu").classList.add("hidden");
    lockBoard = false;
    startTimer();
  }

  function returnToMenu() {
    pauseMenu.classList.add('hidden');
    gameContainer.style.display = 'none';
    mainMenu.style.display = 'flex';
    clearInterval(window.timerInterval);
  }

  function showLevelSelect() {
    pauseMenu.classList.add('hidden');
    gameContainer.style.display = 'none';
    levelSelect.style.display = 'block';
    clearInterval(window.timerInterval);
  }

  function goToNextLevel() {
  currentLevel++;
  startLevel(currentLevel);
  createBoard();
  startTimer();
  document.getElementById('overlay').classList.add('hidden');
  }


  const playButton = document.getElementById('playButton');
  const mainMenu = document.getElementById('mainMenu');
  const gameContainer = document.getElementById('gameContainer');
  const levelSelect = document.getElementById('levelSelect');

  
    playButton.addEventListener('click', () => {
    mainMenu.style.display = 'none';
    levelSelect.style.display = 'block';

  
  });

  //Learn JavaScript by Building 7 Games - Full Course
  //Feb 28, 2022
  //freeCodeCamp.org
  //19 march 2025
  //https://www.youtube.com/watch?v=ec8vSKJuZTk
  //online youtube video

  //Making a Game in JavaScript with No Experience
  // Oct 27, 2023
  //Goodgis
  //20 march 2025
  //https://www.youtube.com/watch?v=r9I4DuGmJ2Y
   //online youtube video

   //How to Code a Card Matching Game
   //  Premiered Oct 20, 2018
   //Web Dev Simplified
   //20 march 2025
   //https://www.youtube.com/watch?v=28VfzEiJgy4
    //online youtube video

    //How to make HTML5 Games: Javascript Tutorial for Beginners JS guide
    //Jul 14, 2013
    //ScripttersWar
    //21 March 2025
    //https://www.youtube.com/watch?v=XgK4YaMqQFg&list=PLh-MBXZEiyMhulEqYE3gn63idSAKG6Sx1
     //online youtube video

    //W3Schools
    //19 march
     //https://www.w3schools.com/js/js_whereto.asp
     //online website

     //How To Create/Add An Image In Javascript
    //SoftAuthor
    //Jun 27 2023
    //24 April 2025
     //https://www.youtube.com/watch?v=HWHfzt1kp84
     //online youtube video

    //Button Click Sound Effect | In HTML CSS and JavaScript | HTML Tutorial For Beginners
    //Jun 18, 2021
    //ProgrammingTT
    //19 May 2025
    //https://www.youtube.com/watch?v=0R6rZngcHGg
    //online youtube video

    //How to play Audio Files with JavaScript
    //Aug 24, 2022
    //The Wheelchair Guy
    //19 May 2025
    //https: https://www.youtube.com/watch?v=3xlws5og44U
    //online youtube video