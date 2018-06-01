const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');
const scoreboard = document.getElementById('score');
const buttonArray = document.getElementsByTagName('button');
const startButton = buttonArray[0];
const stopButton = buttonArray[1];
const sqrSize = 40;
let score = 0;
let clicked = 0;
let stopped = false;
const hitSound = new Audio('audio/mk3-00180.mp3');
const mainMusic = new Audio('audio/mktheme.mp3');
mainMusic.volume = 0.18;
const colorArr = ['#018E42', '#A3333D', '#1B2845', '#5B6057', '#2274A5', '#372248', '#659157', '#031927', '#23395B',
  '#ff0000', '#ff0683', ''];
let square = {
  currentPosX: 50,
  currentPosY: 0,
  size: sqrSize,
  speed: getRandom(1, 5),
  color: colorArr[getRandom(0, colorArr.length - 1)]
}
let gameState = [square];
let nextIntervalTime;



function animate(t) {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  if (t >= nextIntervalTime) {
    nextIntervalTime = t + getRandom(500, 3000);
    addSqr();
  }

  gameState = gameState.filter(sqr => sqr.currentPosY < canvas.clientHeight);


  for (var i = 0; i < gameState.length; i++) {

    let currentSqr = gameState[i];
    ctx.fillStyle = currentSqr.color;
    ctx.fillRect(currentSqr.currentPosX, currentSqr.currentPosY, currentSqr.size, currentSqr.size);
    currentSqr.currentPosY += currentSqr.speed;
  }

  requestId = requestAnimationFrame(animate);

}




function addSqr() {
  const sqr =
    {
      currentPosX: getRandom(0, canvas.clientWidth - sqrSize),
      currentPosY: 0,
      size: sqrSize,
      speed: getRandom(1, 5),
      color: colorArr[getRandom(0, colorArr.length - 1)]
    }
  gameState.push(sqr);
}




function onStart() {
  canvas.style.background = `url('images/MK.png')`;
  if (mainMusic.paused) {
    mainMusic.play();
  } else {
    audioStop(mainMusic);
    mainMusic.play();
  }

  stopped = false;
  clicked += 1;
  if (clicked >= 2) {
    scoreboard.textContent = '0';
    gameState = [];
    score = 0;
  }
  else {
    score = 0;
    scoreboard.textContent = '0';
    nextIntervalTime = performance.now() + getRandom(500, 3000);
    requestId = requestAnimationFrame(animate);
  }
}



function onStop() {
  cancelAnimationFrame(requestId);
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  mainMusic.pause();
  stopped = true;
  gameState = [];
  clicked = 0;
}




function onClickSqrKill(event) {
  event.preventDefault();
  let x = event.offsetX;
  let y = event.offsetY;
  for (var i = 0; i < gameState.length; i++) {

    let currentSqr = gameState[i];

    if (isSqrTouched(currentSqr, x, y)) {
      sqrKill(i);
      audioStop(hitSound);
      hitSound.play();
      score += 1;
      scoreboard.textContent = `${score}`;
    }
  }
}




function sqrKill(n) {
  gameState.splice(n, 1);
}



function audioStop(audio) {
  audio.pause();
  audio.currentTime = 0;
}



function getRandom(min, max) {
  return Math.floor(min + Math.random() * (max + min - 1));
}



function isSqrTouched(currentSqr, x, y) {
  const size = currentSqr.size;
  const sqrY = currentSqr.currentPosY;
  const sqrX = currentSqr.currentPosX;
  return x >= sqrX && x <= sqrX + size && y >= sqrY && y <= sqrY + size;
}


canvas.addEventListener('mousedown', onClickSqrKill, false);
startButton.addEventListener('click', onStart, false);
stopButton.addEventListener('click', onStop, false);












