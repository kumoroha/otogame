const noteContainer = document.getElementById('note-container');
const scoreDisplay = document.getElementById('score-display');
const rankDisplay = document.getElementById('rank-display');
const pauseButton = document.getElementById('pause-button');
const gachaButton = document.getElementById('gacha-button');
const gachaResult = document.getElementById('gacha-result');
const endScreen = document.getElementById('end-screen');
const finalScore = document.getElementById('final-score');
const finalRank = document.getElementById('final-rank');
const retryButton = document.getElementById('retry-button');
const judgementDisplay = document.getElementById('judgement-display');
const coinsDisplay = document.getElementById('coins-display');
const fragmentsDisplay = document.getElementById('fragments-display');
let score = 0;
let isPaused = false;
let noteIntervals = [];
let gameInterval;
let hitLines = [
    document.querySelector('.line1').offsetTop,
    document.querySelector('.line2').offsetTop
];
let coins = parseInt(getCookie('coins')) || 0;
let fragments = parseInt(getCookie('fragments')) || 0;

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
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
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
        if (top < noteContainer.offsetHeight) {
            note.style.top = `${top + 10}px`; // Speed adjusted to be slower
        } else {
            clearInterval(noteInterval);
            note.remove();
            updateJudgement('MISS');
        }
    }, 20); // Reduced interval for smoother animation

    note.addEventListener('click', () => {
        clearInterval(noteInterval);
        note.remove();
        let hitScore = calculateHitScore(parseInt(note.style.top));
        score += hitScore;
        updateScoreAndRank();
    });

    noteIntervals.push(noteInterval);
}

function calculateHitScore(noteTop) {
    if (noteTop >= hitLines[1] - 5 && noteTop <= hitLines[1] + 5) {
        updateJudgement('PERFECT');
        return 300;
    } else if (noteTop >= hitLines[0] - 5 && noteTop <= hitLines[0] + 5) {
        updateJudgement('GREAT');
        return 100;
    } else if (noteTop >= hitLines[0] - 10 && noteTop <= hitLines[0] + 10) {
        updateJudgement('GOOD');
        return 50;
    } else {
        updateJudgement('BAD');
        return 10;
    }
}

function updateJudgement(judgement) {
    judgementDisplay.innerText = judgement;
    setTimeout(() => judgementDisplay.innerText = '', 1000); // Clear judgement after 1 second
}

function updateScoreAndRank() {
    scoreDisplay.innerText = `Score: ${score}`;
    rankDisplay.innerText = `Rank: ${calculateRank(score)}`;
}

function calculateRank(score) {
    if (score >= 10000) {
        return 'S';
    } else if (score >= 7500) {
        return 'A';
    } else if (score >= 5000) {
        return 'B';
    } else if (score >= 2500) {
        return 'C';
    } else {
        return 'D';
    }
}

function endGame() {
    clearInterval(gameInterval);
    noteIntervals.forEach(interval => clearInterval(interval));
    endScreen.style.display = 'block';
    finalScore.innerText = `Final Score: ${score}`;
    finalRank.innerText = `Final Rank: ${calculateRank(score)}`;
    coins += Math.floor(score / 10);
    fragments += Math.floor(score / 10);
    setCookie('coins', coins, 365);
    setCookie('fragments', fragments, 365);
    updateCurrencyDisplay();
}

function resetGame() {
    score = 0;
    updateScoreAndRank();
    endScreen.style.display = 'none';
    noteIntervals = [];
    gameInterval = setInterval(createNote, 1000);
}

function updateCurrencyDisplay() {
    coinsDisplay.innerText = `Coins: ${coins}`;
    fragmentsDisplay.innerText = `Fragments: ${fragments}`;
}

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

retryButton.addEventListener('click', resetGame);

updateCurrencyDisplay();
gameInterval = setInterval(createNote, 1000);
