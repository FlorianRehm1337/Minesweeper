let mediumBlacklistedFieldsRight = [15, 31, 47, 63, 79, 95, 111, 127, 143, 159, 175, 191, 207, 223, 239, 255];
let mediumBlacklistedFieldsLeft = [0, 16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240];
let mediumBlacklistedFieldsTop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let mediumBlacklistedFieldsBottom = [240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255];
let mediumModeFlags = 45;


function generateMediumGamefield() {

    document.getElementById('gamefield').classList.add('gamefield-medium');
    for (let i = 0; i < 256; i++) {
        gamefieldArray.push({
            "bomb": false,
            "flag": false,
            "number": 0,
            "revealed": false,
            "firstReveal": false,
            "id": i
        })
    }
    flagAmount = mediumModeFlags;
    renderFlagNumber();
    renderGamefield();
}