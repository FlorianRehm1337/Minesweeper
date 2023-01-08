let hardBlacklistedFieldsRight = [29, 59, 89, 119, 149, 179, 209, 239, 269, 299, 329, 359, 389, 419, 449, 479];
let hardBlacklistedFieldsLeft = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450];
let hardBlacklistedFieldsTop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
let hardBlacklistedFieldsBottom = [450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479];
let hardModeFlags = 90;


async function generateHardGamefield() {

    document.getElementById('gamefield').classList.add('gamefield-hard');
    for (let i = 0; i < 480; i++) {
        console.log('generateField')
        gamefieldArray.push({
            "bomb": false,
            "flag": false,
            "number": 0,
            "revealed": false,
            "firstReveal": false,
            "id": i
        })
    }
    flagAmount = hardModeFlags;
    renderFlagNumber();
    await renderGamefield();
    loading = false;
    setLoadingScreen();
}