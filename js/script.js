let gamefieldArray = [];
let generatedNumbers = [];
let fieldsAroundFirstReveal = []
let bombfieldArray = [];
let clock;
let ms;
let sec;
let min;
let time;
let gameover = false;
let win = false;
let firstReveal;
let winCounter;
let flagAmount = 0;
let selectedGamemode;
let blacklistedFieldsTop;
let blacklistedFieldsLeft;
let blacklistedFieldsRight;
let blacklistedFieldsBottom;
let rowLenght;
let loading = false;


function startCounter() {
  ms = 0;
  sec = 0;
  min = 0;
  time = setInterval(timer, 10);
}

function timer() {
  ms++;
  if (ms >= 100) {
    sec++
    ms = 0
  }
  if (sec === 60) {
    min++
    sec = 0
  }
  if (min === 60) {
    ms, sec, min = 0;
  }

  let seconds = sec < 10 ? `0` + sec : sec;
  let minute = min < 10 ? `0` + min : min;

  let timer = `${minute}:${seconds}`;
  clock.innerHTML = timer;
};

function resetCounter() {
  clock.innerHTML = '00:00'
  clearInterval(time)
}

document.oncontextmenu = function (event) {
  let currentField = event.target.getAttribute('value');
  let FieldSource = changeSource(currentField);
  if (gamefieldArray[currentField] == undefined) {
    return false;
  } else if (!gamefieldArray[currentField].flag && flagAmount != 0 && !gamefieldArray[currentField].revealed) {
    gamefieldArray[currentField].flag = true;
    FieldSource.src = './Designs/Version 1/buttons/01_Mine mark.png';
    flagAmount--;
    renderFlagNumber();
  } else if (gamefieldArray[currentField].revealed) {
    return false;
  } else if (gamefieldArray[currentField].flag) {
    gamefieldArray[currentField].flag = false;
    FieldSource.src = './Designs/Version 1/buttons/00_Default.png';
    flagAmount++;
    renderFlagNumber();
  }
  return false;
}

function renderFlagNumber() {
  let flagNumber = document.getElementById('flags');
  flagNumber.innerHTML = flagAmount;
}

function checkGameOver() {

  if (gameover) {
    clearInterval(time);
    let endscreen = document.getElementById('loosing-screen');
    endscreen.classList.remove('d-none');
  }
  if (winCounter == 0) {
    clearInterval(time);
    let finishTimer = document.getElementById('finish-time');
    finishTimer.innerHTML = `You finished the Game in ${clock.innerHTML}`;
    let endscreen = document.getElementById('winner-screen');
    endscreen.classList.remove('d-none');
  }
}

async function getGamemode() {
  clock = document.getElementById('time');
  selectedGamemode = document.getElementById('gamemodes').value;
  resetGame();
  loading = true;
  await setLoadingScreen();
  if (window.innerWidth < 1450) {
    setEasyGamefield();
    await generateEasyGamefield();
  } else {
    if (selectedGamemode == 'easy') {
      setEasyGamefield();
      await generateEasyGamefield();
    } else if (selectedGamemode == 'medium') {
      setMediumGamefield();
      await generateMediumGamefield();
    } else if (selectedGamemode == 'hard') {
      setHardGamefield();
      await generateHardGamefield();
    }
  }

}

function resetGame() {
  firstReveal = false;
  gameover = false;
  gamefieldArray = [];
  bombfieldArray = [];
  generatedNumbers = [];
  resetClasses();
  resetCounter();
}

function resetClasses() {
  document.getElementById('gamefield').classList.remove('gamefield-easy', 'field-easy', 'gamefield-medium', 'field-medium', 'gamefield-hard', 'field-hard');
}

async function renderGamefield() {
  let gamefield = document.getElementById('gamefield');
  gamefield.innerHTML = ``;
  if (window.innerWidth < 1450) {
    for (let i = 0; i < gamefieldArray.length; i++) {
      console.log('renderField')
      gamefield.innerHTML += `
          <img id="field${i}" onclick="revealField(${i})" class="field-easy" value="${i}" src="/Designs/Version 1/buttons/00_Default.png">
        `;
    }
  } else {
    for (let i = 0; i < gamefieldArray.length; i++) {
      console.log('renderField')
      gamefield.innerHTML += `
          <img id="field${i}" onclick="revealField(${i})" class="field-${selectedGamemode}" value="${i}" src="/Designs/Version 1/buttons/00_Default.png">
        `;
    }
  }

}

function placeBombs() {
  let min = 1;
  let max = gamefieldArray.length - 1;
  for (let i = 0; i < flagAmount; i++) {
    let bombIndex = getRandomNumber(min, max);
    if (generatedNumbers.indexOf(bombIndex) == -1 && generatedNumbers.length != flagAmount && !gamefieldArray[bombIndex].firstReveal) {
      generatedNumbers.push(bombIndex);
    } else {
      i--
    }
    if (gamefieldArray[bombIndex].bomb === false && !gamefieldArray[bombIndex].firstReveal) {
      gamefieldArray[bombIndex].bomb = true;
    }
  }
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function placeNumbers() {
  getBombFields()
  for (let i = 0; i < bombfieldArray.length; i++) {
    let currentBomb = bombfieldArray[i].id
    checkFieldsAroundBomb(currentBomb);
  }
}

function getBombFields() {
  bombfieldArray = gamefieldArray.filter(a => a.bomb === true);
}

function checkFieldsAroundBomb(currentBomb) {
  fieldsAroundFirstReveal = [];
  let topLeft = currentBomb - (rowLenght + 1);
  let top = currentBomb - rowLenght;
  let topRight = currentBomb - (rowLenght - 1);
  let left = currentBomb - 1;
  let right = currentBomb + 1;
  let bottomLeft = currentBomb + (rowLenght - 1);
  let bottom = currentBomb + rowLenght;
  let bottomRight = currentBomb + (rowLenght + 1);

  if (!firstReveal) {
    fieldsAroundFirstReveal.push(topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight);
    setFirstReveal();
    return;
  }
  addNumbersAroundBomb(topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight, currentBomb);
}

function addNumbersAroundBomb(topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight, currentBomb) {
  if (blacklistedFieldsLeft.indexOf(currentBomb) == -1 && gamefieldArray[topLeft] != undefined && gamefieldArray[topLeft].bomb == false) {
    gamefieldArray[topLeft].number++
  }
  if (gamefieldArray[top] != undefined && gamefieldArray[top].bomb == false) {
    gamefieldArray[top].number++
  }
  if (blacklistedFieldsRight.indexOf(currentBomb) == -1 && gamefieldArray[topRight] != undefined && gamefieldArray[topRight].bomb == false) {
    gamefieldArray[topRight].number++
  }
  if (blacklistedFieldsLeft.indexOf(currentBomb) == -1 && gamefieldArray[left] != undefined && gamefieldArray[left].bomb == false) {
    gamefieldArray[left].number++
  }
  if (blacklistedFieldsRight.indexOf(currentBomb) == -1 && gamefieldArray[right] != undefined && gamefieldArray[right].bomb == false) {
    gamefieldArray[right].number++
  }
  if (blacklistedFieldsLeft.indexOf(currentBomb) == -1 && gamefieldArray[bottomLeft] != undefined && gamefieldArray[bottomLeft].bomb == false) {
    gamefieldArray[bottomLeft].number++
  }
  if (gamefieldArray[bottom] != undefined && gamefieldArray[bottom].bomb == false) {
    gamefieldArray[bottom].number++
  }
  if (blacklistedFieldsRight.indexOf(currentBomb) == -1 && gamefieldArray[bottomRight] != undefined && gamefieldArray[bottomRight].bomb == false) {
    gamefieldArray[bottomRight].number++
  }
}

function setFirstReveal() {
  fieldsAroundFirstReveal.forEach(field => {
    if (gamefieldArray[field] != undefined) {
      gamefieldArray[field].firstReveal = true;
    }
  })
}

function setEasyGamefield() {
  blacklistedFieldsLeft = easyBlacklistedFieldsLeft;
  blacklistedFieldsRight = easyBlacklistedFieldsRight;
  blacklistedFieldsTop = easyBlacklistedFieldsTop;
  blacklistedFieldsBottom = easyBlacklistedFieldsBottom;
  rowLenght = easyBlacklistedFieldsTop.length;
}


function setMediumGamefield() {
  blacklistedFieldsLeft = mediumBlacklistedFieldsLeft;
  blacklistedFieldsRight = mediumBlacklistedFieldsRight;
  blacklistedFieldsTop = mediumBlacklistedFieldsTop;
  blacklistedFieldsBottom = mediumBlacklistedFieldsBottom;
  rowLenght = mediumBlacklistedFieldsTop.length;
}


function setHardGamefield() {
  blacklistedFieldsLeft = hardBlacklistedFieldsLeft;
  blacklistedFieldsRight = hardBlacklistedFieldsRight;
  blacklistedFieldsTop = hardBlacklistedFieldsTop;
  blacklistedFieldsBottom = hardBlacklistedFieldsBottom;
  rowLenght = hardBlacklistedFieldsTop.length;
}

async function createWinNumber() {
  winCounter = gamefieldArray.length - bombfieldArray.length;
}

async function revealField(i) {
  let FieldSource = changeSource(i)
  if (!gamefieldArray[i].flag) {
    if (!firstReveal) {
      checkFieldsAroundBomb(i)
      firstReveal = true;
      gamefieldArray[i].firstReveal = true;
      placeBombs();
      placeNumbers();
      await createWinNumber();
      await revealOneField(i);
      startCounter();
    } else if (gamefieldArray[i].bomb) {
      FieldSource.src = './Designs/Version 1/buttons/mine.png';
      gameover = true;
      checkGameOver();
    } else {
      await revealOneField(i);
      checkGameOver();
    }
  }
}

async function revealOneField(i) {
  let FieldSource = changeSource(i)
  let FieldNumber = numberOfField(i);
  if (checkUndefined(i) && !gamefieldArray[i].revealed && !gamefieldArray[i].bomb) {
    gamefieldArray[i].revealed = true;
    winCounter--;
    if (checkFieldIsMiddle(i)) {
      await revealFieldsAround(i)
    } else if (checkFieldIsInCorner(i)) {
      await revealFieldsInCorner(i);
    } else if (blacklistedFieldsTop.includes(i) && checkNumberAndBomb(i)) {
      revealFieldInTopRow(i)
    } else if (blacklistedFieldsRight.includes(i) && checkNumberAndBomb(i)) {
      revealFieldinRightRow(i)
    } else if (blacklistedFieldsLeft.includes(i) && checkNumberAndBomb(i)) {
      revealFieldinLeftRow(i)
    } else if (blacklistedFieldsBottom.includes(i) && checkNumberAndBomb(i)) {
      revealFieldInBottomRow(i)
    }

    if (gamefieldArray[i].flag) {
      FieldSource.src = './Designs/Version 1/buttons/01c_mine mark - flag.png'
    } else if (FieldNumber == 0 && !gamefieldArray[i].bomb) {
      FieldSource.src = './Designs/Version 1/buttons/no number.png'
    } else {
      FieldSource.src = `./Designs/Version 1/buttons/02_${FieldNumber}.png`;
    }
  }
}

async function revealFieldsAround(i) {
  await revealOneField(i - rowLenght + 1);
  await revealOneField(i - rowLenght);
  await revealOneField(i - rowLenght - 1);
  await revealOneField(i - 1);
  await revealOneField(i + 1);
  await revealOneField(i + rowLenght - 1);
  await revealOneField(i + rowLenght);
  await revealOneField(i + rowLenght + 1);
}

function checkUndefined(i) {
  return gamefieldArray[i] != undefined
}

function numberOfField(i) {
  return gamefieldArray[i].number
}

function changeSource(i) {
  return document.getElementById(`field${i}`);
}

function checkNumberAndBomb(i) {

  return gamefieldArray[i].number == 0 &&
    !gamefieldArray[i].bomb
}

function checkFieldIsInCorner(i) {
  return i == 0 ||
    i == (blacklistedFieldsTop.length - 1) ||
    i == blacklistedFieldsLeft[blacklistedFieldsLeft.length - 1] ||
    i == blacklistedFieldsBottom[blacklistedFieldsBottom.length - 1] &&
    checkNumberAndBomb(i)
}

function checkFieldIsMiddle(i) {
  return checkNumberAndBomb(i) &&
    i > (blacklistedFieldsTop.length - 1) &&
    i < blacklistedFieldsBottom[0] &&
    !blacklistedFieldsLeft.includes(i) &&
    !blacklistedFieldsRight.includes(i)
}

async function revealFieldsInCorner(i) {

  if (i == 0) {
    revealOneField(i + 1);
    revealOneField(i + rowLenght);
    revealOneField(i + rowLenght + 1);
  } else if (i == (blacklistedFieldsTop.length - 1)) { //topRightCorner
    revealOneField(i - 1);
    revealOneField(i + rowLenght);
    revealOneField(i + rowLenght - 1);
  } else if (i == blacklistedFieldsLeft[blacklistedFieldsLeft.length - 1]) {  //bottomLeftCorner
    revealOneField(i + 1);
    revealOneField(i - rowLenght);
    revealOneField(i - rowLenght + 1);
  } else if (i == blacklistedFieldsBottom[blacklistedFieldsBottom.length - 1]) {  //bottomRightCorner
    revealOneField(i - 1);
    revealOneField(i - rowLenght);
    revealOneField(i - rowLenght - 1);
  } else {
    return false;
  }
}

async function revealFieldInTopRow(i) {
  revealOneField(i - 1);
  revealOneField(i + 1);
  revealOneField(i + rowLenght);
  revealOneField(i + rowLenght - 1);
  revealOneField(i + rowLenght + 1);
}

async function revealFieldinRightRow(i) {
  revealOneField(i - 1);
  revealOneField(i + rowLenght);
  revealOneField(i - rowLenght);
  revealOneField(i - rowLenght - 1);
  revealOneField(i + rowLenght - 1);
}

async function revealFieldinLeftRow(i) {
  revealOneField(i + 1);
  revealOneField(i + rowLenght);
  revealOneField(i - rowLenght);
  revealOneField(i - rowLenght + 1);
  revealOneField(i + rowLenght + 1);
}

async function revealFieldInBottomRow(i) {
  revealOneField(i - 1);
  revealOneField(i + 1);
  revealOneField(i - rowLenght);
  revealOneField(i - rowLenght - 1);
  revealOneField(i - rowLenght + 1);
}

function playAgain() {
  if (gameover) {
    let endscreen = document.getElementById('loosing-screen');
    endscreen.classList.add('d-none');
  } else {
    let endscreen = document.getElementById('winner-screen');
    endscreen.classList.add('d-none');
  }
  getGamemode();

}

async function setLoadingScreen() {
  if (loading) {
    document.getElementById('loading-spinner').classList.remove('d-none');
  } else {
    document.getElementById('loading-spinner').classList.add('d-none');
  }
}