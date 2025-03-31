const noteContainer = document.getElementById('note-container');
const scoreDisplay = document.getElementById('score-display');
const pauseButton = document.getElementById('pause-button');
const gachaButton = document.getElementById('gacha-button');
const gachaResult = document.getElementById('gacha-result');
let score = 0;
let isPaused = false;
let noteIntervals = [];

const characters = [
    { name: '初音ミク', rank: '★1' },
    { name: '鏡音リン', rank: '★2' },
    { name: '鏡音レン', rank: '★3' },
    { name: '巡音ルカ', rank: '★4' },
    { name: 'MEIKO', rank: '★1' },
    { name: 'KAITO', rank: '★2' }
];

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

function createNote() {
    if (isPaused) return;

    const note = document.createElement('div');
    note.classList.add('note');
    note.style.left = `${Math.floor(Math.random() * 80)}vw`; // Adjusted to fit within the container
    note.style.top = '0px';

    noteContainer.appendChild(note);

    let noteInterval = setInterval(() => {
        if (isPaused) return;
        let top = parseInt(note.style.top);
        if (top < (parseInt(noteContainer.style.height) || 80 * window.innerWidth / 100)) {
            note.style.top = `${top + 15}px`; // Speed increased to 3x
        } else {
            clearInterval(noteInterval);
            note.remove();
        }
    }, 50);

    note.addEventListener('click', () => {
        clearInterval(noteInterval);
        note.remove();
        score += 100;
        scoreDisplay.innerText = `Score: ${score}`;
    });

    noteIntervals.push(noteInterval);
}

setInterval(createNote, 1000);

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.innerText = isPaused ? 'Resume' : 'Pause';
});

gachaButton.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const result = characters[randomIndex];
    const existingCharacters = getCookie('characters') ? JSON.parse(getCookie('characters')) : [];

    if (!existingCharacters.find(char => char.name === result.name && char.rank === result.rank)) {
        existingCharacters.push(result);
        setCookie('characters', JSON.stringify(existingCharacters), 365);
        gachaResult.innerText = `ガチャ結果: ${result.name} ${result.rank}`;
    } else {
        gachaResult.innerText = `ガチャ結果: ${result.name} ${result.rank}（既に所持）`;
    }
});
