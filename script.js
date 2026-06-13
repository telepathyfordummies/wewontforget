const board = document.getElementById("board");

const rows = 4;
const cols = 4;

const boardWidth = 800;
const boardHeight = 800;

const pieceWidth = boardWidth / cols;
const pieceHeight = boardHeight / rows;

const imageSrc = "puzzle.png";

let placedCount = 0;
const totalPieces = rows * cols;

// -----------------------------
// scatter outside board 
// -----------------------------
function getRandomOutsideBoard() {
    const boardRect = board.getBoundingClientRect();

    let x, y;

    while (true) {
        x = Math.random() * (window.innerWidth - pieceWidth);
        y = Math.random() * (window.innerHeight - pieceHeight);

        const insideBoard =
            x > boardRect.left - 20 &&
            x < boardRect.right + 20 &&
            y > boardRect.top - 20 &&
            y < boardRect.bottom + 20;

        if (!insideBoard) return { x, y };
    }
}

// -----------------------------
// CREATE PIECES
// -----------------------------
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {

        const piece = document.createElement("div");
        piece.classList.add("piece");

        piece.style.width = pieceWidth + "px";
        piece.style.height = pieceHeight + "px";

        piece.style.backgroundImage = `url(${imageSrc})`;
        piece.style.backgroundSize = `${boardWidth}px ${boardHeight}px`;

        piece.style.backgroundPosition =
            `-${col * pieceWidth}px -${row * pieceHeight}px`;

        // IMPORTANT: correct position RELATIVE TO BOARD
        const correctX = col * pieceWidth;
        const correctY = row * pieceHeight;

        piece.dataset.correctX = correctX;
        piece.dataset.correctY = correctY;

        const pos = getRandomOutsideBoard();
        piece.style.left = pos.x + "px";
        piece.style.top = pos.y + "px";

        board.appendChild(piece);

        enableDrag(piece);
    }
}

// -----------------------------
// DRAG LOGIC
// -----------------------------
function enableDrag(piece) {

    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;

    piece.addEventListener("mousedown", startDrag);

    function startDrag(e) {

        if (piece.dataset.locked) return;

        dragging = true;

        offsetX = e.clientX - piece.offsetLeft;
        offsetY = e.clientY - piece.offsetTop;

        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", stopDrag);
    }

    function drag(e) {
        if (!dragging) return;

        piece.style.left = (e.clientX - offsetX) + "px";
        piece.style.top = (e.clientY - offsetY) + "px";
    }

    function stopDrag() {
        dragging = false;

        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", stopDrag);

        //  THIS MAY BE THE FIX OR IM GRABBING THE GUN BOARDSPACE
        const boardRect = board.getBoundingClientRect();
        const pieceRect = piece.getBoundingClientRect();

        const currentX = pieceRect.left - boardRect.left;
        const currentY = pieceRect.top - boardRect.top;

        const correctX = Number(piece.dataset.correctX);
        const correctY = Number(piece.dataset.correctY);

        const distance = Math.hypot(
            currentX - correctX,
            currentY - correctY
        );

        if (distance < 40) {

            // snap into exact board position
            piece.style.left = correctX + "px";
            piece.style.top = correctY + "px";

            piece.dataset.locked = "true";

            placedCount++;

            console.log("Placed:", placedCount, "/", totalPieces);

            if (placedCount === totalPieces) {
                console.log("PUZZLE COMPLETE");
                completePuzzle();
            }
        }
    }
}

// -----------------------------
// COMPLETION POPUP
// -----------------------------
function completePuzzle() {

    const modal = document.getElementById("modal");

    modal.classList.add("show");

    document.getElementById("continueBtn").onclick = () => {
        window.location.href =
            "https://telepathyfordummies.github.io/s0rryf0rg3tt1ngl0st/story.html";
    };
}
