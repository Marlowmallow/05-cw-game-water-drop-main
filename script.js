// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let countdownInterval;
let timerValue = 30;
let scoreValue= 0;
// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);
const timer = document.getElementById("time");
const score = document.getElementById("score");


function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  timerValue = 30;
  clearInterval(scoreValue);
  score.textContent = "0";
  timer.textContent = timerValue;
  console.log("Hello world!");

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(() => {
    createDrop();
    obstacleDrop();
  }, 1000);
  startCountDown();
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

  if (className === "water-drop") {
    drop.addEventListener("click", () => scoreTracker(drop));
  }

  else if (className === "bad-drop"){
    drop.addEventListener("click", () => minusScore(drop));
  }

  drop.addEventListener("animationend", () => {
    drop.remove();
  });
}

function scoreTracker(drop) {
  scoreValue += 10;
  score.textContent = scoreValue;
  drop.remove();
}

function minusScore(drop) {
  scoreValue -= 10;
  score.textContent = scoreValue;
  drop.remove();
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
    }
  }, 1000);
}
