const noteContainer = document.getElementById('note-container');
const scoreDisplay = document.getElementById('score-display');
const pauseButton = document.getElementById('pause-button');
const gachaButton = document.getElementById('gacha-button');
const gachaResult = document.getElementById('gacha-result');
let score = 0;
let isPaused = false;
let noteIntervals = [];

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
            note.style.top = `${top + 5}px`;
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
    const characters = ['初音ミク', '鏡音リン', '鏡音レン', '巡音ルカ', 'MEIKO', 'KAITO'];
    const randomIndex = Math.floor(Math.random() * characters.length);
    const result = characters[randomIndex];
    gachaResult.innerText = `ガチャ結果: ${result}`;
});
