const noteContainer = document.getElementById('note-container');
const scoreDisplay = document.getElementById('score-display');
let score = 0;

function createNote() {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.left = `${Math.floor(Math.random() * 250)}px`;
    note.style.top = '0px';

    noteContainer.appendChild(note);

    let noteInterval = setInterval(() => {
        let top = parseInt(note.style.top);
        if (top < 550) {
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
}

setInterval(createNote, 1000);
