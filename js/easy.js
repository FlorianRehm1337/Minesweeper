let easyBlacklistedFieldsRight = [7, 15, 23, 31, 39, 47, 55, 63];
let easyBlacklistedFieldsLeft = [0, 8, 16, 24, 32, 40, 48, 56];
let easyBlacklistedFieldsTop = [0, 1, 2, 3, 4, 5, 6, 7];
let easyBlacklistedFieldsBottom = [56, 57, 58, 59, 60, 61, 62, 63];
let easymodeFlags = 10;


async function generateEasyGamefield() {

  document.getElementById('gamefield').classList.add('gamefield-easy');

  for (let i = 0; i < 64; i++) {
    gamefieldArray.push({
      "bomb": false,
      "flag": false,
      "number": 0,
      "revealed": false,
      "firstReveal": false,
      "id": i
    })
  }

  switch (selectedGamemode) {
    case 'easy':
      flagAmount = easymodeFlags;
      break;

    case 'medium':
      flagAmount = 20;
      break;

    case 'hard':
      flagAmount = 30;
      break;
  }
  renderFlagNumber();
  await renderGamefield();
  loading = false;
  setLoadingScreen();
}

