// =================
// Utility Functions
// =================

// -----------
// Random Helpers
// -----------


// -----------
// DOM Helpers
// -----------
function createElement(tag, classNames = [], textContent = "") {
    const el = document.createElement(tag);
    classNames.forEach(cls => el.classList.add(cls));
    el.textContent = textContent;
    return el;
}

function createButton(classNames = [], textContent = "", onClick) {
    const btn = createElement("button", classNames, textContent)
    btn.addEventListener("click", onClick);
    return btn;
}

// =================
// Objects / Modules
// =================

// Game constants (board size, mark representations, move codes, etc.)
const constants = Object.freeze({
    BOARD_SIZE: 3,
    CROSS: 'X',
    NOUGHT: 'O',
    EMPTY_CELL: ' ',
    MOVE_OK: 0,
    CELL_OCCUPIED: 1,
    OUT_OF_BOUNDS: 2
});

function createCell() {

    let value = constants.EMPTY_CELL;

    const getMark = () => value;

    const setMark = (mark) => value = mark;

    return { getMark, setMark };
}

function createPlayer(name, mark) {
    let score = 0;

    const getScore = () => score;

    const incrementScore = () => ++score;

    return { name, mark, getScore, incrementScore };
}


/* 
** The gameBoard tracks the state of the board and therefore win conditions
*/
const gameBoard = ((size) => {
    const board = [];

    let rowMarks = [0, 0, 0], colMarks = [0, 0, 0], diagMarks = 0, antiDiagMarks = 0;

    // Create a 2d array that will represent the state of the game board
    // For this 2d array, row 0 will represent the top row and
    // column 0 will represent the left-most column.
    for (let i = 0; i < size; i++) {
        board[i] = []
        for (let j = 0; j < size; j++) {
            board[i].push(createCell());
        }
    }

    const getBoard = () => board;
    const getSize = () => size;

    // Validate a candidate move (i.e. check if the specified cell is empty or not, and that the specified cell actually
    // exists on the board)
    const validateMove = (row, col) => {
        if (row < 0 || row >= size || col < 0 || col >= size) return constants.OUT_OF_BOUNDS;
        if (board[row][col].getMark() !== constants.EMPTY_CELL) return constants.CELL_OCCUPIED;
        return constants.MOVE_OK;
    }

    // Place the player's mark on the board, 
    // and maintain mark counters for each row, column and diagonal to detect a win
    const placeMark = (row, column, player) => {
        board[row][column].setMark(player.mark);


        player.mark === constants.NOUGHT ? mark = 1 : mark = -1;

        rowMarks[row] += mark;
        colMarks[column] += mark;
        if (row === column) diagMarks += mark;
        if (row + column === size - 1) antiDiagMarks += mark;
    };

    const checkWin = (row, column, player) => {

        if (Math.abs(rowMarks[row]) === size ||
            Math.abs(colMarks[column]) === size ||
            Math.abs(diagMarks) === size ||
            Math.abs(antiDiagMarks) === size)
            return player; // winner
        return null; // no winner
    }

    const clearBoard = () => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                board[i][j].setMark(constants.EMPTY_CELL);
            }
        }

        // reset mark counters
        rowMarks = [0, 0, 0], colMarks = [0, 0, 0], diagMarks = 0, antiDiagMarks = 0;
    }

    // This method is used to print the board to the console without the need for a UI.
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getMark()))
        console.table(boardWithCellValues);
    };



    return { getBoard, getSize, validateMove, placeMark, checkWin, clearBoard, printBoard };
})(constants.BOARD_SIZE);



/* 
** The gameController is be responsible for controlling the flow and state of the game's turns, as well as whether
** anybody has won the game
*/
const gameController = ((playerOneName = "Player One",
    playerTwoName = "Player Two") => {

    const players = [
        createPlayer(playerOneName, constants.CROSS),
        createPlayer(playerTwoName, constants.NOUGHT)
    ];

    let activePlayer = players[0];
    let turnCount = 0;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        gameBoard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const printNewGame = () => {
        console.log("\n🔥🔥🔥 NEW GAME 🔥🔥🔥\n----------------------\n");
        printNewRound();
    }

    const startNewGame = () => {
        console.log("Starting new game...");
        gameBoard.clearBoard();
        activePlayer = players[0];
        turnCount = 0;
        printNewGame();
    }

    const handleDraw = () => {
        gameBoard.printBoard();
        console.log("It's a draw! Good game!");
        startNewGame();
    }

    const handleWin = (winningPlayer) => {
        gameBoard.printBoard();
        console.log(`${winningPlayer.name} wins! Congratulations!`);
        startNewGame();
    }

    const playRound = (row, column) => {
        // Place a mark for the current player
        let moveStatus = gameBoard.validateMove(row, column)
        if (moveStatus !== constants.MOVE_OK) {
            if (moveStatus === constants.OUT_OF_BOUNDS) console.log("ERROR: Specified cell is out of bounds.");
            if (moveStatus === constants.CELL_OCCUPIED) console.log("ERROR: Specified cell is already occupied");
            console.log("Please specify a legal move.");
            return { valid: false, winner: null, draw: false };
        };
        console.log(
            `Placing ${getActivePlayer().name}'s mark into row ${row}, column ${column}... `
        );
        gameBoard.placeMark(row, column, getActivePlayer());
        turnCount++;

        // check for draw
        if (turnCount >= constants.BOARD_SIZE ** 2) {
            handleDraw();
            return { valid: true, winner: null, draw: true };
        }

        // check for win
        const winningPlayer = gameBoard.checkWin(row, column, getActivePlayer());
        if (winningPlayer) {
            handleWin(winningPlayer);
            return { valid: true, winner: winningPlayer, draw: false };
        }


        // Switch player turn
        switchPlayerTurn();

        printNewRound();

        return { valid: true, winner: null, draw: false };
    };


    // Initial play game message
    printNewGame();

    // For the console version, we will only use playRound, but we will need
    // getActivePlayer for the UI version.
    return {
        playRound,
        getActivePlayer
    };
})();

/* 
** The displayController is responsible for controlling the display of the game state to the players
*/
const displayController = (() => {

})();

// =================
// Data / State
// =================



// =================
// Domain-Specific Functions
// =================


// =================
// DOM Manipulation Functions
// =================



// =================
// Main Execution Block / Script Body
// =================

// --- Helper to separate games in console ---
function newGameHeader(name) {
    console.log(`\n===== ${name} =====\n--------------------------\n`);
}

// --- 1. Horizontal Win ---
newGameHeader("Horizontal Win");
gameController.playRound(0, 0); // P1
gameController.playRound(1, 0); // P2
gameController.playRound(0, 1); // P1
gameController.playRound(1, 1); // P2
gameController.playRound(0, 2); // P1 → horizontal win

// --- 2. Vertical Win ---
newGameHeader("Vertical Win");
gameController.playRound(0, 0); // P1
gameController.playRound(0, 1); // P2
gameController.playRound(1, 0); // P1
gameController.playRound(1, 1); // P2
gameController.playRound(2, 0); // P1 → vertical win

// --- 3. Diagonal Win ---
newGameHeader("Diagonal Win");
gameController.playRound(0, 0); // P1
gameController.playRound(0, 1); // P2
gameController.playRound(1, 1); // P1
gameController.playRound(0, 2); // P2
gameController.playRound(2, 2); // P1 → diagonal win

// --- 4. Anti-Diagonal Win ---
newGameHeader("Anti-Diagonal Win");
gameController.playRound(0, 2); // P1
gameController.playRound(0, 0); // P2
gameController.playRound(1, 1); // P1
gameController.playRound(1, 0); // P2
gameController.playRound(2, 0); // P1 → anti-diagonal win

// --- 5. Draw Game ---
newGameHeader("Draw Game");
gameController.playRound(0, 0); // P1
gameController.playRound(0, 1); // P2
gameController.playRound(0, 2); // P1
gameController.playRound(1, 1); // P2
gameController.playRound(1, 0); // P1
gameController.playRound(1, 2); // P2
gameController.playRound(2, 1); // P1
gameController.playRound(2, 0); // P2
gameController.playRound(2, 2); // P1 → draw

// --- 6. Invalid Moves ---
newGameHeader("Invalid Moves");
gameController.playRound(0, 0); // P1
gameController.playRound(0, 0); // P2 tries occupied cell
gameController.playRound(3, 3); // P1 tries out-of-bounds

