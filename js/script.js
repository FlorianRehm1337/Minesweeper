//easymode = 64 Fields //10 Mines
//mediummode = 256 Fields //45 Mines
//hardmode = 480 Fields // 90 Mines
let clock;
let ms = 0;
let sec = 0;
let min = 0;
let time;
let mediummodeFlags = 45;
let hardmodeFlags = 90;


function renderGamefield() {
  let gamefield = document.getElementById('gamefield');
  gamefield.innerHTML = ``;

  for (let i = 0; i < 480; i++) {
    gamefield.innerHTML += `
          <img class="field-easy" src="./Designs/Version 1/buttons/00_Default.png" alt="">
        `;
  }
}


function startCounter() {
  clock = document.getElementById('time');
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

  //Doing some string interpolation
  let seconds = sec < 10 ? `0` + sec : sec;
  let minute = min < 10 ? `0` + min : min;

  let timer = `${minute}:${seconds}`;
  clock.innerHTML = timer;
};

//stop timer
function resetCounter() {
  clearInterval(time)
}

document.oncontextmenu = function (event) {

  let currentField = event.target.getAttribute('value');
  if (gamefieldArray[currentField] == undefined) {
    return false;
  }else if (!gamefieldArray[currentField].flag && easymodeFlags != 0) {
    gamefieldArray[currentField].flag = true;
    console.log(gamefieldArray[currentField])
    gamefieldArray[currentField].src = '01_Mine mark.png';
    renderEasyGamefield();
    easymodeFlags--;
    renderFlagNumber();
  }else{
    gamefieldArray[currentField].flag = false;
    gamefieldArray[currentField].src = '00_Default.png';
    renderEasyGamefield();
    console.log('back change')
    easymodeFlags++;
    renderFlagNumber();
  }
  return false;
} 


function renderFlagNumber(){
  let flagNumber = document.getElementById('flags');
  flagNumber.innerHTML = easymodeFlags;
}