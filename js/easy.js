//easymode = 64 Fields //10 Mines

let gamefieldArray = [];
let generatedNumbers = [];
let blacklistedFieldsRight = [7, 15, 23, 31, 39, 47, 55, 63];
let blacklistedFieldsLeft = [0, 8, 16, 24, 32, 40, 48, 56];
let fieldsAroundFirstReveal = []
let bombfieldArray;
let numberfieldArray;
let noNumberfieldArray;
let firstReveal = false;

function generateEasyGamefield() {
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
      //gamefieldArray[bombIndex].src = 'mine.png';
    }
  }
}


function placeNumbers() {
  getBombFields()
  for (let i = 0; i < bombfieldArray.length; i++) {
    let currentBomb = bombfieldArray[i].id
    checkFieldsAroundBomb(currentBomb);

  }
  //changeFieldSource()
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
    fieldsAroundFirstReveal.push(topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight)
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
  debugger;
  fieldsAroundFirstReveal.forEach(field => {
    if (gamefieldArray[field] != undefined) {
      gamefieldArray[field].firstReveal = true;
    }
  })
}


function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


function renderEasyGamefield() {
  let gamefield = document.getElementById('gamefield');
  gamefield.innerHTML = ``;

  for (let i = 0; i < gamefieldArray.length; i++) {
    gamefield.innerHTML += `
          <img onclick="revealField(${i})" class="field-easy" src="/Designs/Version 1/buttons/${gamefieldArray[i]['src']}">
        `;
  }
}


function revealField(i) {

  if (!firstReveal) {
    checkFieldsAroundBomb(i)
    firstReveal = true;
    gamefieldArray[i].firstReveal = true;
    placeBombs();
    placeNumbers();
    changeFieldSource();
    renderEasyGamefield();
  }
}


//test Function for Placement of objects
function changeFieldSource() {
  numberfieldArray = gamefieldArray.filter(x => x.number != 0);
  noNumberfieldArray = gamefieldArray.filter(a => a.number == 0);
  console.log(noNumberfieldArray)

  for (let index = 0; index < noNumberfieldArray.length; index++) {
    if (noNumberfieldArray[index].number == 0 && noNumberfieldArray[index].bomb == false) {
      noNumberfieldArray[index].src = 'no number.png';
    }

    if (noNumberfieldArray[index].number == 0 && noNumberfieldArray[index].bomb == true) {
      noNumberfieldArray[index].src = 'mine.png';
    }
  }
  for (let n = 0; n < numberfieldArray.length; n++) {
    for (let i = 1; i < 8; i++) {
      if (numberfieldArray[n].number == i) {
        numberfieldArray[n].src = `02_${i}.png`;
      }
    }
  }
}