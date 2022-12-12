//easymode = 64 Fields //10 Mines

let gamefieldArray = [];
let generatedNumbers = [];
let blacklistedFieldsRight = [7, 15, 23, 31, 39, 47, 55, 63];
let blacklistedFieldsLeft = [0, 8, 16, 24, 32, 40, 48, 56];
let fieldsAroundFirstReveal = []
let leftSideArray = [0, 8, 16, 24, 32, 40, 48, 56];
let rightSideArray = [7, 15, 23, 31, 39, 47, 55, 63];
let bombfieldArray;
let numberfieldArray;
let noNumberfieldArray;
let firstReveal = false;
let easymodeFlags = 10;


function generateEasyGamefield() {
  renderFlagNumber();
  for (let i = 0; i < 64; i++) {
    gamefieldArray.push({
      "bomb": false,
      "flag": false,
      "number": 0,
      "src": "00_Default.png",
      "revealed": false,
      "firstReveal": false,
      "id": i
    })
  }
  renderEasyGamefield();
}


function placeBombs() {
  let min = 1;
  let max = 63;
  for (let i = 0; i < 10; i++) {
    let bombIndex = getRandomNumber(min, max);
    if (generatedNumbers.indexOf(bombIndex) == -1 && generatedNumbers.length != 10 && !gamefieldArray[bombIndex].firstReveal) {
      generatedNumbers.push(bombIndex);
    } else {
      i--
    }
    if (gamefieldArray[bombIndex].bomb === false && !gamefieldArray[bombIndex].firstReveal) {
      gamefieldArray[bombIndex].bomb = true;
    }
  }
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
  let topLeft = currentBomb - 9;
  let top = currentBomb - 8;
  let topRight = currentBomb - 7;
  let left = currentBomb - 1;
  let right = currentBomb + 1;
  let bottomLeft = currentBomb + 7;
  let bottom = currentBomb + 8;
  let bottomRight = currentBomb + 9;

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


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


async function renderEasyGamefield() {
  let gamefield = document.getElementById('gamefield');
  gamefield.innerHTML = ``;
  for (let i = 0; i < gamefieldArray.length; i++) {
    gamefield.innerHTML += `
          <img onclick="revealField(${i})" class="field-easy" value="${i}" src="/Designs/Version 1/buttons/${gamefieldArray[i]['src']}">
        `;
  }
}


async function revealField(i) {

  if (!firstReveal) {
    checkFieldsAroundBomb(i)
    firstReveal = true;
    gamefieldArray[i].firstReveal = true;
    placeBombs();
    placeNumbers();
    await revealOneField(i);
    renderEasyGamefield();
    startCounter();
  } else {
    await revealOneField(i);
    renderEasyGamefield();
  }
}


async function revealOneField(i) {
  if (checkUndefined(i) && !gamefieldArray[i].revealed) {
    gamefieldArray[i].revealed = true;
    if (gamefieldArray[i].number == 0 && !gamefieldArray[i].bomb && i > 7 && i < 56 && !leftSideArray.includes(i) && !rightSideArray.includes(i)) {
      await revealFieldsAround(i)
    }
    if (gamefieldArray[i].bomb) {
      gamefieldArray[i].src = 'mine.png'
    }
    if (gamefieldArray[i].flag) {
      gamefieldArray[i].src = '01c_mine mark - flag.png'
    }
    if (numberOfField(i) == 0 && !gamefieldArray[i].bomb) {
      gamefieldArray[i].src = 'no number.png'
    }
    if (numberOfField(i) == 1) {
      gamefieldArray[i].src = '02_1.png'
    }
    if (numberOfField(i) == 2) {
      gamefieldArray[i].src = '02_2.png'
    }
    if (numberOfField(i) == 3) {
      gamefieldArray[i].src = '02_3.png'
    }
    if (numberOfField(i) == 4) {
      gamefieldArray[i].src = '02_4.png'
    }
    if (numberOfField(i) == 5) {
      gamefieldArray[i].src = '02_5.png'
    }
    if (numberOfField(i) == 6) {
      gamefieldArray[i].src = '02_6.png'
    }
    if (numberOfField(i) == 7) {
      gamefieldArray[i].src = '02_7.png'
    }
    if (numberOfField(i) == 8) {
      gamefieldArray[i].src = '02_8.png'
    }
  }
}


async function revealFieldsAround(i) {
  await revealOneField(i - 9);
  await revealOneField(i - 8);
  await revealOneField(i - 7);
  await revealOneField(i - 1);
  await revealOneField(i + 1);
  await revealOneField(i + 7);
  await revealOneField(i + 8);
  await revealOneField(i + 9);
}

function checkUndefined(i) {
  return gamefieldArray[i] != undefined
}


function numberOfField(i) {
  return gamefieldArray[i].number
}