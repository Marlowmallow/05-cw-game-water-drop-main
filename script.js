// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let acceptingDropClicks = false;
let dropMaker; // Will store our timer that creates drops regularly
let countdownInterval;
let timerValue = 30;
let scoreValue= 0;
let scoreTotal= 0;
let gameLevel= 1;
let scoregoal = 50;
// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("reset-btn").addEventListener("click", resetGame);
const timer = document.getElementById("time");
const score = document.getElementById("score");
const goal = document.querySelector(".goal");
const levelnum = document.querySelector(".levelnum");
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const successMessage = document.querySelector(".Success");
const failMessage = document.querySelector(".fail");
const welcomeMessage = document.querySelector(".Welcome");
const factsContainer = document.querySelector(".Facts");
const facts = document.querySelectorAll(".Facts h3");
timer.textContent = timerValue;
updateLevelDisplay();

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;
  console.log(scoreTotal);
  timerValue = 30;
  scoreValue= 0;
  if (gameLevel > 1){
    timerValue -= (gameLevel * 5);
  }
  timer.textContent = timerValue;
  score.textContent = "0";
  acceptingDropClicks = true;
  document.getElementById("level-Popup").style.visibility= 'hidden';
  document.getElementById("level-Popup").style.display= 'none';
  gameRunning = true;


  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(() => {
    createDrop();
    for (let dropCount = 0; dropCount < gameLevel; dropCount++) {
      obstacleDrop();
    }
  }, 1000);
  startCountDown();
}

function resetGame() {
  failMessage.style.display = "none";
  failMessage.style.visibility = "hidden";
  resetButton.style.display = "none";
  startButton.style.display = "block";
  gameLevel = 1;
  scoregoal = 50;
  scoreTotal = 0;
}

function createDrop() {
  createFallingDrop("water-drop");
}

function obstacleDrop() {
  createFallingDrop("bad-drop");
}

function createFallingDrop(className) {
  const container = document.getElementById("game-container");
  const size = 60 * (Math.random() * 0.8 + 0.5);
  const gameWidth = container.clientWidth;
  const maxLeft = gameWidth - size;
  const spacing = 8;
  const containerRect = container.getBoundingClientRect();
  const contentLeft = containerRect.left + container.clientLeft;
  const spawnTop = containerRect.top + container.clientTop - 20;
  let xPosition;

  if (maxLeft < 0) return;

  const existingDrops = container.querySelectorAll(".water-drop, .bad-drop");
  let positionFound = false;

  for (let attempt = 0; attempt < 30; attempt++) {
    xPosition = Math.random() * maxLeft;
    const candidate = {
      left: contentLeft + xPosition,
      right: contentLeft + xPosition + size,
      top: spawnTop,
      bottom: spawnTop + size
    };
    const overlaps = Array.from(existingDrops).some((existingDrop) => {
      const rect = existingDrop.getBoundingClientRect();
      return !(
        candidate.right + spacing <= rect.left ||
        candidate.left >= rect.right + spacing ||
        candidate.bottom + spacing <= rect.top ||
        candidate.top >= rect.bottom + spacing
      );
    });

    if (!overlaps) {
      positionFound = true;
      break;
    }
  }

  if (!positionFound) return;

  const drop = document.createElement("div");
  drop.className = className;
  drop.style.width = drop.style.height = `${size}px`;
  drop.style.left = `${xPosition}px`;
  drop.style.top = "-20px";
  drop.style.animationDuration = "4s";
  container.appendChild(drop);

  const pop = [
    { scale: "1", opacity: 1 },
    { scale: "1.4", opacity: 0.8 },
    { scale: "0", opacity: 0 }
  ];
  const Poptiming = {
    duration: 250,
    iterations: 1,
    easing: "ease-out"
  };
  let wasClicked = false;

  drop.addEventListener("click", () => {
    if (wasClicked || !acceptingDropClicks) return;
    wasClicked = true;

    if (className === "water-drop") {
      scoreTracker();
    } else {
      minusScore();
    }

    drop.animate(pop, Poptiming).onfinish = () => drop.remove();
  });

  drop.addEventListener("animationend", () => {
    if (!wasClicked) drop.remove();
  });
}

function scoreTracker() {
  scoreValue += 10;
  scoreTotal += 10;
  score.textContent = scoreValue;
}

function minusScore() {
  scoreValue -= 10;
  scoreTotal -= 10;
  score.textContent = scoreValue;
}

function updateLevelDisplay() {
  levelnum.textContent = `Level ${gameLevel}`;
  goal.textContent = `Goal: ${scoregoal} L`;
  welcomeMessage.style.display = gameLevel === 1 ? "block" : "none";
}

function showLevelFact() {
  const factIndex = gameLevel - 2;

  facts.forEach((fact, index) => {
    fact.style.display = index === factIndex ? "block" : "none";
  });

  const hasFactForLevel = factIndex >= 0 && factIndex < facts.length;
  factsContainer.style.display = hasFactForLevel ? "block" : "none";
  factsContainer.style.visibility = hasFactForLevel ? "visible" : "hidden";
}

function startCountDown() {
  countdownInterval = setInterval(function() {
    timerValue--;
    timer.textContent = timerValue;

    if (timerValue <= 0) {
      clearInterval(countdownInterval);
      clearInterval(dropMaker);
      timer.textContent = "0";
      gameRunning = false;
      setTimeout(() => {
        acceptingDropClicks = false;
        const reachedGoal = scoreValue >= scoregoal;
        if (reachedGoal) {
          gameLevel+= 1;
          scoregoal += 50;
          updateLevelDisplay();
          showLevelFact();
        }
        const levelPopup = document.getElementById("level-Popup");
        if (reachedGoal && gameLevel === 4) {
          successMessage.style.display = "block";
          successMessage.style.visibility = "visible";
          failMessage.style.display = "none";
          welcomeMessage.style.display = "none";
          levelnum.style.display = "none";
          goal.style.display = "none";
          factsContainer.style.display = "none";
          resetButton.style.display = "block";
          startButton.style.display = "none";
        } else if (!reachedGoal) {
          successMessage.style.display = "none";
          failMessage.style.display = "block";
          failMessage.style.visibility = "visible";
          welcomeMessage.style.display = "none";
          levelnum.style.display = "none";
          goal.style.display = "none";
          startButton.style.display = "none";
          resetButton.style.display = "block";
          factsContainer.style.display = "none";
        } else {
          failMessage.style.display = "none";
          resetButton.style.display = "none";
          startButton.style.display = "block";
        }
        levelPopup.style.visibility = "visible";
        levelPopup.style.display = "flex";
      }, 4000);
    }
  }, 1000);
}
