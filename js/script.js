//easymode = 64 Fields //10 Mines
//mediummode = 256 Fields //45 Mines
//hardmode = 480 Fields // 90 Mines

function renderGamefield() {
    let gamefield = document.getElementById('gamefield')

    for (let i = 0; i < 64; i++) {
        gamefield.innerHTML += `
          <img class="field-easy" src="./Designs/Version 1/buttons/00_Default.png" alt="">
        `;

    }
}