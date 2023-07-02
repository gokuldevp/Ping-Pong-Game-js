import "./styles.css";

let rodUp = document.getElementById("rod-up");
let rodDown = document.getElementById("rod-down");
let ball = document.getElementById("ball");
let rodPosition = 45;
let topScore = parseInt(localStorage.getItem("topScore")) || 0;
let topScoreName = localStorage.getItem("topScoreName") || "Rod 1";

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

function moveRod(event) {
  // Function to move rod
  let increment = 1;

  if (event.code === "KeyA") {
    // moving to left when pressing key A
    if (rodPosition > 0) {
      rodPosition -= increment;
      rodUp.style.left = rodPosition + "%";
      rodDown.style.left = rodPosition + "%";
    }
  } else if (event.code === "KeyD") {
    // moving to right when pressing key D
    if (rodPosition < 92) {
      rodPosition += increment;
      rodUp.style.left = rodPosition + "%";
      rodDown.style.left = rodPosition + "%";
    }
  }
}

function moveBall(event) {
  // Function to move the ball
  if (event.code === "Enter") {
    ball.style.visibility = "visible";
    // Ball details
    let ballSpeedX = 2;
    let ballSpeedY = 2;
    let ballRect = ball.getBoundingClientRect();
    let ballPosX = ballRect.left;
    let ballPosY = ballRect.top;
    let ballWidth = ballRect.width;
    let ballHeight = ballRect.height;

    // rod details
    let rodUpHeight = rodUp.offsetHeight;
    let rodDownHeight = rodDown.offsetHeight;
    let rodUpWidth = rodUp.offsetWidth;
    let rodDownWidth = rodDown.offsetWidth;

    let score = 0;

    let movement = setInterval(function () {
      ballPosX += ballSpeedX;
      ballPosY += ballSpeedY;

      // Update rod positions
      let rodUpX = rodUp.getBoundingClientRect().x;
      let rodDownX = rodDown.getBoundingClientRect().x;

      ball.style.left = ballPosX + "px";
      ball.style.top = ballPosY + "px";

      if (ballPosX + ballWidth > window.innerWidth || ballPosX < 0) {
        ballSpeedX = -ballSpeedX; // Reverse the direction on x-axis
      }

      if (ballPosY <= rodUpHeight) {
        ballSpeedY = -ballSpeedY; // Reverse the direction on y-axis
        score++;

        // Check if the game ends on
        let ballPos = ballPosX + ballWidth / 2;
        if (ballPos < rodUpX || ballPos > rodUpX + rodUpWidth) {
          clearInterval(movement);
          storeWin("Rod 1", score);
          gameOverBoard("Rod 2", score);
          resetBoard("Rod 1");
        }
      } else if (ballPosY + ballHeight >= window.innerHeight - rodDownHeight) {
        ballSpeedY = -ballSpeedY; // Reverse the direction on y-axis
        score++;

        // Check if the game ends
        let ballPos = ballPosX + ballWidth / 2;
        if (ballPos < rodDownX || ballPos > rodDownX + rodDownWidth) {
          clearInterval(movement);
          storeWin("Rod 2", score);
          gameOverBoard("Rod 1", score);
          resetBoard("Rod 2", score, ballSpeedY);
        }
      }
    }, 10);
  }
}

function scoreBoard() {
  // function to display the score in the bigining of the game
  let currentTopScore = localStorage.getItem("topScore");
  let currentTopScoreName = localStorage.getItem("topScoreName");
  console.log();

  if (currentTopScore == null) {
    window.alert("This is your first time!");
  } else {
    window.alert(
      currentTopScoreName + " has a maximum score of " + currentTopScore
    );
  }
}

function storeWin(rodName, score) {
  // function to save the score
  var currentTopScore = parseInt(localStorage.getItem("topScore"));

  if (isNaN(currentTopScore) || score > currentTopScore) {
    localStorage.setItem("topScoreName", rodName);
    localStorage.setItem("topScore", score);
  }
}

function gameOverBoard(winRod, score) {
  // Function to display the game over message
  let currentTopScore = localStorage.getItem("topScore");
  if (currentTopScore == null) {
    currentTopScore = 0;
  }
  window.alert(
    winRod +
      " wins with a score of " +
      score +
      ". The highest Score is " +
      currentTopScore
  );
}

function resetBoard(rodName, score, ballSpeedY) {
  // Function to resent the board
  rodPosition = 45;
  rodUp.style.left = rodPosition + "%";
  rodDown.style.left = rodPosition + "%";
  ball.style.left = (windowWidth - ball.offsetWidth) / 2 + "px";

  // Lossing player gets the ball
  if (rodName === "Rod 1") {
    ball.style.top = "4.5%";
    ballSpeedY = 2;
  } else if (rodName === "Rod 2") {
    ball.style.top = "95.5%";
    ballSpeedY = -2;
  }
  score = 0;
}

// display Score board when the browser is opened
scoreBoard();
// Moving the Rod 1 and Rod 2
document.addEventListener("keydown", moveRod);
// Movin the ball on clicking enter key
document.addEventListener("keypress", moveBall);
